/* ==================================================================
   LA PAGINA INIZIALE

   Legge contenuti/home.txt, contenuti/comuni.txt e contenuti/serali.txt
   e riempie la pagina. I testi non stanno qui: si cambiano nei file di
   testo.

   Grafica "a cartolina" (vedi grafica.css): fondo bianco, un trattino
   colorato accanto a ogni indirizzo e a ogni data, niente simboli.

   Ha bisogno di js/contenuti.js e js/comuni.js, che vanno caricati
   prima di questo.
   ================================================================== */

(function () {
  "use strict";

  var C = window.Contenuti;

  /* I pezzi comuni a tutte le pagine stanno in js/comuni.js */
  var P = window.Pezzi;
  var elemento = P.elemento, linkTelefono = P.linkTelefono, scriviDato = P.scriviDato;

  /* I colori che si possono scrivere nella colonna "colore". Arancione,
     rosa e blu indicano solo i tre indirizzi: non si usano per altro. */
  var COLORI = ["meccanica", "grafica", "liceo"];

  /* Il disegno delle tre linee. Se si cambia il disegno, si aumenta il
     numero ?v= qui sotto. */
  var FILE_DISEGNO = "immagini/linee-scuola.svg?v=1";

  /* Lo spessore delle linee sullo schermo, in pixel. Resta lo stesso
     su telefono, computer e LIM. */
  var SPESSORE_LINEE = 2.4;

  Promise.all([
    C.leggi("contenuti/home.txt"),
    C.leggi("contenuti/comuni.txt"),
    C.leggi("contenuti/serali.txt")
  ])
    .then(function (file) {
      riempi(file[0], file[1]);
      serali(file[2], file[0]);
      document.getElementById("contenuto").hidden = false;
      disegno();
    })
    .catch(function (errore) {
      console.error(errore);
      document.getElementById("avviso").hidden = false;
    });

  function riempi(home, comuni) {
    /* Testata: il nome breve della scuola, senza virgolette (il
       maiuscolo lo mette grafica.css) */
    C.scrivi(document.getElementById("nome-scuola"),
      comuni.campo("SCUOLA", "nome-breve") || comuni.campo("SCUOLA", "nome"));

    /* Apertura. Accanto all'occhiello il sito aggiunge l'anno scritto
       in comuni.txt: "Orientamento 2026/27". */
    var occhiello = document.getElementById("occhiello");
    if (home.campo("APERTURA", "occhiello")) {
      C.scrivi(occhiello, home.campo("APERTURA", "occhiello") + " " + comuni.campo("OPEN DAY", "anno"));
    } else {
      occhiello.hidden = true;
    }
    /* Il titolo grande è il claim generale della scuola */
    C.scrivi(document.getElementById("titolo"), home.campo("APERTURA", "claim"));
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

    P.piede(comuni);
    timbro(home, comuni);
  }


  /* ---------------------------------------------------------------
     IL DISEGNO DELLE TRE LINEE
     Si legge immagini/linee-scuola.svg e lo si mette dentro la pagina:
     così il CSS può cambiare lo spessore delle linee e farle disegnare
     una dopo l'altra (vedi grafica.css). Se il file non si legge, lo
     spazio resta vuoto e la pagina funziona lo stesso.
     --------------------------------------------------------------- */

  function disegno() {
    var contenitore = document.getElementById("disegno");
    fetch(FILE_DISEGNO)
      .then(function (risposta) {
        if (!risposta.ok) { throw new Error(risposta.status); }
        return risposta.text();
      })
      .then(function (testo) {
        var svg = new DOMParser().parseFromString(testo, "image/svg+xml").documentElement;
        if (svg.nodeName !== "svg") { throw new Error("il file non è un disegno SVG"); }
        svg.setAttribute("focusable", "false");
        /* pathLength="1": ogni linea è lunga 1, così l'animazione del
           CSS funziona qualunque sia la sua vera lunghezza */
        Array.prototype.forEach.call(svg.querySelectorAll("path"), function (linea) {
          linea.setAttribute("pathLength", "1");
        });
        contenitore.appendChild(document.importNode(svg, true));
        spessore(contenitore.querySelector("svg"));
      })
      .catch(function (errore) {
        console.warn("Non riesco a leggere il disegno " + FILE_DISEGNO + ": " + errore.message);
      });
  }

  /* Il disegno si allarga e si stringe con lo schermo, e con lui lo
     spessore delle linee. Qui lo si ricalcola ogni volta che cambia la
     larghezza, perché sullo schermo resti sempre di 2,4 pixel. */
  function spessore(svg) {
    var larghezzaDisegno = svg.viewBox.baseVal.width;
    function aggiorna() {
      var larghezza = svg.getBoundingClientRect().width;
      if (!larghezza) { return; }
      svg.style.setProperty("--spessore", (SPESSORE_LINEE * larghezzaDisegno / larghezza) + "px");
    }
    aggiorna();
    if (window.ResizeObserver) {
      new ResizeObserver(aggiorna).observe(svg);
    } else {
      window.addEventListener("resize", aggiorna);
    }
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

      var voce = document.createElement("li");
      voce.className = "indirizzo con-trattino tono-" + dati.colore;
      /* Il trattino colorato (lo disegna grafica.css) sta accanto a tipo
         di scuola e nome; tutto il resto è allineato a loro */
      var testa = document.createElement("div");
      testa.className = "indirizzo-testa";
      testa.appendChild(elemento("p", "indirizzo-tipo", dati.tipo));
      testa.appendChild(elemento("h3", "indirizzo-nome", dati.nome));
      voce.appendChild(testa);

      if (dati.claim) { voce.appendChild(elemento("p", "indirizzo-claim", dati.claim)); }
      if (dati.frase) { voce.appendChild(elemento("p", "indirizzo-frase", dati.frase)); }
      if (dati.breve) { voce.appendChild(elemento("p", "", dati.breve)); }

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
     manca, al posto del pulsante torna "Pagina in preparazione". */
  function pulsantePagina(dati, home, fondo) {
    var a = document.createElement("a");
    a.className = "pulsante pulsante-vuoto";
    a.href = dati.pagina;
    a.textContent = home.campo("SEZIONI", "vai-alla-pagina");
    var nascosto = document.createElement("span");
    nascosto.className = "solo-lettori";
    nascosto.textContent = ": " + dati.nome;
    a.appendChild(nascosto);

    fetch(dati.pagina, { method: "HEAD", cache: "no-cache" })
      .then(function (risposta) {
        if (!risposta.ok) { throw new Error(risposta.status); }
      })
      .catch(function () {
        console.warn("home.txt: " + dati.nome + " è segnata \"pronta\" ma la pagina " + dati.pagina + " non esiste");
        fondo.replaceChild(inPreparazione(home), a);
      });

    return a;
  }


  /* ---------------------------------------------------------------
     OPEN DAY
     --------------------------------------------------------------- */

  /* Un turno con il suo stato. Nel file, dopo l'orario, si può scrivere
     "esaurito": "10.00-11.00 esaurito" (funziona anche il vecchio
     "sold out"). Accanto al turno esaurito compare in rosso la scritta
     del campo "esaurito" di comuni.txt: la differenza non sta solo nel
     colore (rosso e verde si confondono per chi è daltonico) ma anche
     nella scritta. Chi usa un lettore di schermo sente "posti liberi"
     oppure la scritta. */
  var TURNO_PIENO = /\s*(esaurito|sold\s*out)\s*$/i;

  function turnoConStato(testo, scrittaEsaurito) {
    var esaurito = TURNO_PIENO.test(testo);
    var voce = document.createElement("li");
    voce.className = "turno" + (esaurito ? " turno-esaurito" : "");
    C.scrivi(voce, testo.replace(TURNO_PIENO, ""));
    if (esaurito) {
      voce.appendChild(elemento("span", "turno-scritta", " " + scrittaEsaurito));
    } else {
      voce.appendChild(elemento("span", "solo-lettori", ", posti liberi"));
    }
    return voce;
  }

  function openDay(comuni) {
    /* Ogni data: il trattino verde, il giorno e sotto i due turni */
    var elenco = document.getElementById("elenco-open-day");
    comuni.righe("OPEN DAY").forEach(function (riga, i) {
      if (riga.length !== 4) {
        console.warn("comuni.txt, OPEN DAY, riga " + (i + 1) + ": servono 4 colonne, ne ho trovate " + riga.length);
        return;
      }
      var voce = document.createElement("li");
      voce.className = "data con-trattino";
      voce.appendChild(elemento("p", "data-giorno", riga[0] + " " + riga[1]));
      var turni = document.createElement("ul");
      turni.className = "data-turni";
      [riga[2], riga[3]].forEach(function (orario) {
        turni.appendChild(turnoConStato(orario, comuni.campo("OPEN DAY", "esaurito") || "Esaurito"));
      });
      voce.appendChild(turni);
      elenco.appendChild(voce);
    });

    /* La nota sui turni, sotto le date: compare solo se c'è */
    var nota = document.getElementById("open-day-nota");
    if (comuni.campo("OPEN DAY", "nota-turni")) {
      C.scrivi(nota, comuni.campo("OPEN DAY", "nota-turni"));
    } else {
      nota.hidden = true;
    }

    /* In fondo, il pulsante per prenotare. Se il link manca, resta solo
       il testo. */
    var prenota = document.getElementById("prenotazione");
    var testo = comuni.campo("OPEN DAY", "come-prenotare");
    var link = comuni.campo("OPEN DAY", "prenotazione");
    if (link && !C.daCompletare(link)) {
      var a = elemento("a", "pulsante pulsante-pieno", testo);
      a.href = link;
      prenota.appendChild(a);
    } else {
      C.scrivi(prenota, testo + " " + (link || ""));
    }
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
      fondo.appendChild(inPreparazione(home));
    }
    contenitore.appendChild(fondo);
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


  /* ---------------------------------------------------------------
     IL TIMBRO DEL PIEDE
     Un timbro rotondo blu inchiostro: due cerchi, la scritta "IIS GIULIO
     NATTA · ORIENTAMENTO" lungo il cerchio e il logo al centro. Le
     parole vengono dai file di testo (nome breve della scuola e
     occhiello). È solo decorativo: i dati sono scritti accanto.
     --------------------------------------------------------------- */

  function timbro(home, comuni) {
    var SVG = "http://www.w3.org/2000/svg";
    var contenitore = document.getElementById("timbro");
    var nome = comuni.campo("SCUOLA", "nome-breve") || comuni.campo("SCUOLA", "nome");
    var scritta = (nome + " · " + home.campo("APERTURA", "occhiello") + " · ").toUpperCase();

    function nuovo(tag, attributi) {
      var e = document.createElementNS(SVG, tag);
      Object.keys(attributi).forEach(function (k) { e.setAttribute(k, attributi[k]); });
      return e;
    }

    /* Il disegno è largo 120: il bordo esterno ha raggio 58, quello
       interno 38; la scritta poggia sul raggio 44 e sta a metà fra i
       due */
    var raggio = 44;
    var svg = nuovo("svg", { viewBox: "0 0 120 120", focusable: "false" });
    svg.appendChild(nuovo("circle", { cx: 60, cy: 60, r: 58, "class": "timbro-bordo" }));
    svg.appendChild(nuovo("circle", { cx: 60, cy: 60, r: 38, "class": "timbro-bordo" }));
    /* Il cerchio su cui corre la scritta: parte da sinistra e gira in
       senso orario, così la scritta in alto si legge dritta */
    svg.appendChild(nuovo("path", {
      id: "timbro-cerchio",
      d: "M " + (60 - raggio) + " 60 a " + raggio + " " + raggio + " 0 1 1 " + (2 * raggio) + " 0" +
         " a " + raggio + " " + raggio + " 0 1 1 " + (-2 * raggio) + " 0",
      fill: "none"
    }));
    var testo = nuovo("text", { "class": "timbro-scritta" });
    var percorso = nuovo("textPath", {
      href: "#timbro-cerchio",
      textLength: (2 * Math.PI * raggio).toFixed(1),
      lengthAdjust: "spacing"
    });
    percorso.textContent = scritta;
    testo.appendChild(percorso);
    svg.appendChild(testo);
    contenitore.appendChild(svg);

    /* Il logo al centro, tinto di blu inchiostro da grafica.css */
    var logo = document.createElement("span");
    logo.className = "timbro-logo";
    contenitore.appendChild(logo);
  }
}());
