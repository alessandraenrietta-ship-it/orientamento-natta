/* ==================================================================
   LA PAGINA INIZIALE

   Legge contenuti/home.txt, contenuti/comuni.txt e contenuti/serali.txt
   e riempie la pagina. I testi non stanno qui: si cambiano nei file di
   testo.

   Grafica "a cartolina" (vedi grafica.css): fondo bianco, un trattino
   colorato accanto a ogni indirizzo e a ogni data, niente simboli.

   Ha bisogno di js/contenuti.js, js/comuni.js e js/grafica.js (il
   disegno e il timbro), che vanno caricati prima di questo.
   ================================================================== */

(function () {
  "use strict";

  var C = window.Contenuti;

  /* I pezzi comuni a tutte le pagine stanno in js/comuni.js; il
     disegno e il timbro in js/grafica.js */
  var P = window.Pezzi;
  var G = window.Grafica;
  var elemento = P.elemento, linkTelefono = P.linkTelefono, scriviDato = P.scriviDato;

  /* I colori che si possono scrivere nella colonna "colore". Arancione,
     rosa e blu indicano solo i tre indirizzi: non si usano per altro. */
  var COLORI = ["meccanica", "grafica", "liceo"];

  Promise.all([
    C.leggi("contenuti/home.txt"),
    C.leggi("contenuti/comuni.txt"),
    C.leggi("contenuti/serali.txt")
  ])
    .then(function (file) {
      riempi(file[0], file[1]);
      serali(file[2], file[0]);
      document.getElementById("contenuto").hidden = false;
      G.disegno(document.getElementById("disegno"));
      giroAutomatico(document.getElementById("disegno"));
    })
    .catch(function (errore) {
      console.error(errore);
      document.getElementById("avviso").hidden = false;
    });

  /* ---------------------------------------------------------------
     IL TITOLO CHE SI GIRA
     "The next step is yours." sul davanti e "Il prossimo passo è tuo."
     sul retro. Toccando il titolo o la freccia circolare sotto (un vero
     pulsante, "Gira il titolo", che si usa anche da tastiera) si gira
     di 180 gradi in orizzontale in 0,8 secondi, come la cartolina; un
     secondo tocco torna all'inglese. Quando le tre linee del disegno
     hanno finito di disegnarsi, il titolo fa da solo un giro di andata
     e ritorno, una sola volta, se la persona non l'ha già toccato. Per
     chi ha chiesto di ridurre il movimento niente giro automatico, e il
     tocco scambia le frasi senza movimento (grafica.css).
     --------------------------------------------------------------- */

  var titoloToccato = false;
  var MENO_MOVIMENTO = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Quanto dura il giro e quanto resta in italiano il giro automatico,
     in millisecondi */
  var DURATA_GIRO = 800;
  var ATTESA_ITALIANO = 2000;

  function giraTitolo() {
    document.getElementById("titolo-gira").classList.toggle("girato");
  }

  function titoloCheSiGira() {
    /* Un solo ascoltatore per tutta l'area: titolo e freccia. Il
       pulsante della freccia riceve anche Invio e barra spaziatrice
       dalla tastiera, e il browser li trasforma in un clic. */
    document.getElementById("titolo-gira").addEventListener("click", function () {
      titoloToccato = true;
      giraTitolo();
    });
  }

  /* Il giro automatico, dopo l'ultima delle tre linee del disegno */
  function giroAutomatico(disegno) {
    if (MENO_MOVIMENTO) { return; }
    var finite = 0;
    disegno.addEventListener("animationend", function fine() {
      finite++;
      if (finite < 3) { return; }
      disegno.removeEventListener("animationend", fine);
      if (titoloToccato) { return; }
      giraTitolo();
      setTimeout(function () {
        if (!titoloToccato) { giraTitolo(); }
      }, DURATA_GIRO + ATTESA_ITALIANO);
    });
  }

  function riempi(home, comuni) {
    /* Testata: il nome della scuola (il maiuscolo lo mette grafica.css) */
    C.scrivi(document.getElementById("nome-scuola"), comuni.campo("SCUOLA", "nome"));

    /* Apertura. Accanto all'occhiello il sito aggiunge l'anno scritto
       in comuni.txt: "Orientamento 2026/27". */
    var occhiello = document.getElementById("occhiello");
    if (home.campo("APERTURA", "occhiello")) {
      C.scrivi(occhiello, home.campo("APERTURA", "occhiello") + " " + comuni.campo("OPEN DAY", "anno"));
    } else {
      occhiello.hidden = true;
    }
    /* Il titolo grande, in inglese sul davanti e in italiano sul retro:
       si gira toccandolo (vedi titoloCheSiGira, più sopra) */
    C.scrivi(document.getElementById("titolo-inglese"), home.campo("APERTURA", "titolo-inglese"));
    C.scrivi(document.getElementById("titolo-italiano"), home.campo("APERTURA", "titolo-italiano"));
    titoloCheSiGira();
    var presentazione = document.getElementById("presentazione");
    home.campi("APERTURA", "testo").forEach(function (testo) {
      presentazione.appendChild(C.scrivi(document.createElement("p"), testo));
    });
    if (!presentazione.firstChild) { presentazione.hidden = true; }
    /* La riga per gli adulti compare solo se nel file c'è */
    var testoAdulti = document.getElementById("testo-adulti");
    if (home.campo("APERTURA", "testo-adulti")) {
      C.scrivi(testoAdulti, home.campo("APERTURA", "testo-adulti"));
    } else {
      testoAdulti.hidden = true;
    }
    /* I due pulsanti dell'apertura portano alle sezioni degli indirizzi
       e dei serali, più in basso. Dopo il salto il focus va sul titolo
       della sezione: chi usa la tastiera riparte da lì, e il lettore di
       schermo legge il titolo. Un pulsante senza scritta nel file non
       compare. */
    [["pulsante-diurno", "titolo-indirizzi"], ["pulsante-adulti", "titolo-serali"]]
      .forEach(function (coppia) {
        var pulsante = document.getElementById(coppia[0]);
        var scritta = home.campo("APERTURA", coppia[0]);
        if (!scritta) { pulsante.hidden = true; return; }
        C.scrivi(pulsante, scritta);
        pulsante.addEventListener("click", function () {
          var titolo = document.getElementById(coppia[1]);
          setTimeout(function () { titolo.focus(); }, 0);
        });
      });

    /* Titoli delle sezioni */
    C.scrivi(document.getElementById("titolo-indirizzi"), home.campo("SEZIONI", "indirizzi"));
    C.scrivi(document.getElementById("titolo-open-day"),
      home.campo("SEZIONI", "open-day") + " " + comuni.campo("OPEN DAY", "anno"));
    C.scrivi(document.getElementById("titolo-contatti"), home.campo("SEZIONI", "contatti"));

    indirizzi(home);
    openDay(comuni);
    contatti(home, comuni);

    G.piede(comuni);
    G.timbro(home, comuni);
  }


  /* ---------------------------------------------------------------
     GLI INDIRIZZI
     Per ogni indirizzo: il trattino del suo colore accanto a tipo di
     scuola e nome; sotto il claim, la frase e "Pagina in preparazione"
     oppure il pulsante.
     --------------------------------------------------------------- */

  function indirizzi(home) {
    var elenco = document.getElementById("schede");

    home.righe("INDIRIZZI").forEach(function (riga, i) {
      if (riga.length !== 8) {
        console.warn("home.txt, INDIRIZZI, riga " + (i + 1) + ": servono 8 colonne, ne ho trovate " + riga.length);
        return;
      }
      var dati = {
        nome: riga[0], tipo: riga[1], claim: riga[2], frase: riga[3], breve: riga[4],
        pagina: riga[5], stato: riga[6].toLowerCase(), colore: riga[7].toLowerCase()
      };
      if (COLORI.indexOf(dati.colore) === -1) {
        console.warn("home.txt: colore sconosciuto \"" + dati.colore + "\" per " + dati.nome);
      }

      /* Il trattino colorato (lo disegna grafica.css) sta accanto a tipo
         di scuola e nome; tutto il resto è allineato a loro.
         Ogni indirizzo ha sempre gli stessi cinque pezzi, anche vuoti:
         tipo, nome, claim, testi, fondo. Al computer grafica.css li mette
         su righe comuni alle tre colonne, così ogni pezzo parte alla
         stessa altezza anche quando un nome va su più righe. */
      var voce = document.createElement("li");
      voce.className = "indirizzo con-trattino tono-" + dati.colore;
      voce.appendChild(elemento("p", "indirizzo-tipo", dati.tipo));
      voce.appendChild(elemento("h3", "indirizzo-nome", dati.nome));
      voce.appendChild(elemento("p", "indirizzo-claim", dati.claim));

      var testi = document.createElement("div");
      testi.className = "indirizzo-testi";
      if (dati.frase) { testi.appendChild(G.paroleIntere(elemento("p", "indirizzo-frase", dati.frase))); }
      if (dati.breve) { testi.appendChild(elemento("p", "", dati.breve)); }
      voce.appendChild(testi);

      var fondo = document.createElement("p");
      fondo.className = "indirizzo-fondo";
      if (dati.stato === "pronta") {
        fondo.appendChild(pulsantePagina(dati, home, fondo));
      } else {
        fondo.appendChild(inPreparazione(home));
      }
      voce.appendChild(fondo);

      elenco.appendChild(voce);
    });
  }

  function inPreparazione(home) {
    return elemento("span", "in-preparazione", home.campo("SEZIONI", "in-preparazione"));
  }

  /* Il pulsante verso la pagina dell'indirizzo. Per chi usa un lettore
     di schermo si aggiunge il nome dell'indirizzo, altrimenti sentirebbe
     più volte "Scopri di più" senza sapere quale.
     Per sicurezza si controlla anche che la pagina esista davvero: se
     il server risponde che non c'è (errore 404), al posto del pulsante
     torna "Pagina in preparazione". Con qualunque altra risposta il
     pulsante resta: alcuni servizi di anteprima (raw.githack.com)
     rifiutano le richieste di controllo anche se la pagina c'è. Si usa
     una richiesta normale (GET), perché quella "leggera" (HEAD) quei
     servizi la rifiutano sempre. */
  function pulsantePagina(dati, home, fondo) {
    var a = document.createElement("a");
    a.className = "pulsante pulsante-vuoto";
    a.href = dati.pagina;
    a.textContent = home.campo("SEZIONI", "vai-alla-pagina");
    var nascosto = document.createElement("span");
    nascosto.className = "solo-lettori";
    nascosto.textContent = ": " + dati.nome;
    a.appendChild(nascosto);

    fetch(dati.pagina, { cache: "no-cache" })
      .then(function (risposta) {
        if (risposta.status === 404) {
          console.warn("home.txt: " + dati.nome + " è segnata \"pronta\" ma la pagina " + dati.pagina + " non esiste");
          fondo.replaceChild(inPreparazione(home), a);
        }
      })
      .catch(function () {
        /* Nessuna risposta (per esempio senza rete): il pulsante resta */
      });

    return a;
  }


  /* ---------------------------------------------------------------
     OPEN DAY
     --------------------------------------------------------------- */

  function openDay(comuni) {
    /* Le date ancora da venire, come foglietti da calendario: le
       costruisce js/grafica.js, che toglie anche quelle passate */
    var elenco = document.getElementById("elenco-open-day");
    G.listaDate(comuni, elenco);

    var nota = document.getElementById("open-day-nota");
    var prenota = document.getElementById("prenotazione");

    /* Nessuna data ancora da venire: la sezione scende dopo gli
       indirizzi e mostra solo la frase "nessuna-data" di comuni.txt,
       senza la nota sui turni e senza il pulsante per prenotare */
    if (!elenco.firstChild) {
      elenco.hidden = true;
      prenota.hidden = true;
      C.scrivi(nota, comuni.campo("OPEN DAY", "nessuna-data"));
      nota.className += " nota-nessuna-data";
      var indirizzi = document.getElementById("sezione-indirizzi");
      indirizzi.parentNode.insertBefore(document.getElementById("sezione-open-day"), indirizzi.nextSibling);
      return;
    }

    /* La nota sui turni, sotto le date: compare solo se c'è */
    if (comuni.campo("OPEN DAY", "nota-turni")) {
      C.scrivi(nota, comuni.campo("OPEN DAY", "nota-turni"));
    } else {
      nota.hidden = true;
    }

    /* In fondo, il pulsante per prenotare */
    G.pulsantePrenota(comuni, prenota);
  }


  /* ---------------------------------------------------------------
     CORSI SERALI
     Legge la sezione HOME di contenuti/serali.txt: titolo, tipo, testo
     breve, i percorsi (ognuno con il trattino del colore del suo
     indirizzo) e, in fondo, il pulsante verso la pagina dei serali
     oppure "Pagina in preparazione". La sezione PAGINA serve alla
     futura pagina dei serali e qui non si usa.
     --------------------------------------------------------------- */

  function serali(file, home) {
    var contenitore = document.getElementById("serali");
    C.scrivi(document.getElementById("titolo-serali"), file.campo("HOME", "titolo"));

    if (file.campo("HOME", "tipo")) {
      contenitore.appendChild(elemento("p", "serali-tipo", file.campo("HOME", "tipo")));
    }
    if (file.campo("HOME", "claim")) {
      contenitore.appendChild(elemento("p", "indirizzo-claim", file.campo("HOME", "claim")));
    }
    if (file.campo("HOME", "in breve")) {
      contenitore.appendChild(elemento("p", "serali-breve", file.campo("HOME", "in breve")));
    }

    var elenco = document.createElement("ul");
    elenco.className = "serali-percorsi";
    file.righe("HOME").forEach(function (riga, i) {
      if (riga.length !== 2) {
        console.warn("serali.txt, HOME, riga " + (i + 1) + ": servono 2 colonne, ne ho trovate " + riga.length);
        return;
      }
      var colore = riga[1].toLowerCase();
      if (COLORI.indexOf(colore) === -1) {
        console.warn("serali.txt: colore sconosciuto \"" + colore + "\" per " + riga[0]);
      }
      elenco.appendChild(elemento("li", "con-trattino tono-" + colore, riga[0]));
    });
    if (elenco.firstChild) { contenitore.appendChild(elenco); }

    var dati = {
      nome: file.campo("HOME", "titolo"),
      pagina: file.campo("HOME", "pagina"),
      stato: file.campo("HOME", "stato").toLowerCase()
    };
    var fondo = document.createElement("p");
    fondo.className = "fondo-sezione";
    if (dati.stato === "pronta") {
      fondo.appendChild(pulsantePagina(dati, home, fondo));
    } else {
      fondo.appendChild(preiscrizione(file) || inPreparazione(home));
    }
    contenitore.appendChild(fondo);
  }

  /* Finché la pagina dei serali non c'è, al posto di "Pagina in
     preparazione" il pulsante verso il modulo di preiscrizione sul sito
     della scuola: scritta e link dai campi "pulsante" e "link" della
     sezione PAGINA di serali.txt. Si apre in una nuova scheda, e il
     lettore di schermo lo dice. Se manca uno dei due campi, si torna a
     "Pagina in preparazione". */
  function preiscrizione(file) {
    var scritta = file.campo("PAGINA", "pulsante");
    var link = file.campo("PAGINA", "link");
    if (!scritta || !link || C.daCompletare(link)) { return null; }
    var a = elemento("a", "pulsante pulsante-vuoto", scritta);
    a.href = link;
    a.target = "_blank";
    a.rel = "noopener";
    /* TESTO MODIFICABILE */
    a.appendChild(elemento("span", "solo-lettori", " (si apre il sito della scuola in una nuova scheda)"));
    return a;
  }


  /* ---------------------------------------------------------------
     CONTATTI
     --------------------------------------------------------------- */

  /* Le azioni della sezione dei contatti. Ogni riga di home.txt:
     azione | campo del dato | campo del link (facoltativo).
     L'azione è un link sottolineato in verde; il dato sta sotto, fuori
     dal link, così si può selezionare e copiare. Niente icone. */
  function contatti(home, comuni) {
    var elenco = document.getElementById("elenco-contatti");
    home.righe("CONTATTI").forEach(function (riga, i) {
      if (riga.length !== 3) {
        console.warn("home.txt, CONTATTI, riga " + (i + 1) + ": servono 3 colonne, ne ho trovate " + riga.length);
        return;
      }
      var valore = comuni.campo("SCUOLA", riga[1]);
      if (!valore) {
        console.warn("home.txt, CONTATTI: in comuni.txt non trovo il campo " + riga[1]);
        return;
      }

      /* Il link: quello della terza colonna se c'è, altrimenti il sito
         lo capisce dal dato (il telefono chiama, l'email apre la posta) */
      var link = null, esterno = false;
      if (riga[2]) {
        link = comuni.campo("SCUOLA", riga[2]);
        if (!link) { console.warn("home.txt, CONTATTI: in comuni.txt non trovo il campo " + riga[2]); }
        esterno = true;
      } else if (riga[1] === "telefono") {
        link = linkTelefono(valore);
      } else if (valore.indexOf("@") !== -1) {
        link = "mailto:" + valore;
      }
      if (!link || C.daCompletare(link) || C.daCompletare(valore)) { return; }

      var voce = document.createElement("li");
      voce.className = "contatto";
      var azione = document.createElement("p");
      azione.className = "contatto-azione";
      var a = elemento("a", "", riga[0]);
      a.href = link;
      if (esterno) {
        a.target = "_blank";
        a.rel = "noopener";
        /* Chi usa un lettore di schermo sente dove si apre il link */
        /* TESTO MODIFICABILE */
        var dove = /google\.[^/]+\/maps/.test(link) ? "Google Maps" : "un altro sito";
        a.appendChild(elemento("span", "solo-lettori", " (si apre " + dove + " in una nuova scheda)"));
      }
      azione.appendChild(a);
      voce.appendChild(azione);
      voce.appendChild(scriviDato(elemento("p", "contatto-dato", ""), valore));
      elenco.appendChild(voce);
    });
  }
}());
