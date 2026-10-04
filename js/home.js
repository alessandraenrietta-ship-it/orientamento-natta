/* ==================================================================
   LA PAGINA INIZIALE

   Legge contenuti/home.txt e contenuti/comuni.txt e riempie la pagina.
   I testi non stanno qui: si cambiano nei file di testo.

   Ha bisogno di js/contenuti.js e js/comuni.js, che vanno caricati
   prima di questo.
   ================================================================== */

(function () {
  "use strict";

  var C = window.Contenuti;

  /* I pezzi comuni a tutte le pagine stanno in js/comuni.js */
  var P = window.Pezzi;
  var icona = P.icona, segno = P.segno, elemento = P.elemento;
  var linkTelefono = P.linkTelefono, scriviDato = P.scriviDato;

  /* Il simbolo di ogni indirizzo, scelto dalla colonna "colore" */
  var SIMBOLI = {
    meccanica: "rotella",
    grafica: "occhio",
    liceo: "lampadina",
    serali: "luna"
  };

  Promise.all([
    C.leggi("contenuti/home.txt"),
    C.leggi("contenuti/comuni.txt"),
    C.leggi("contenuti/serali.txt")
  ])
    .then(function (file) {
      riempi(file[0], file[1]);
      serali(file[2], file[0]);
      document.getElementById("contenuto").hidden = false;
    })
    .catch(function (errore) {
      console.error(errore);
      document.getElementById("avviso").hidden = false;
    });

  function riempi(home, comuni) {
    /* Testata */
    P.testata(comuni);

    /* Apertura. La riga piccola sopra al titolo compare solo se nel
       file c'è il campo "occhiello". */
    var occhiello = document.getElementById("occhiello");
    if (home.campo("APERTURA", "occhiello")) {
      C.scrivi(occhiello, home.campo("APERTURA", "occhiello"));
    } else {
      occhiello.hidden = true;
    }
    C.scrivi(document.getElementById("titolo"), home.campo("APERTURA", "titolo"));
    C.scrivi(document.getElementById("claim"), home.campo("APERTURA", "claim"));
    var presentazione = document.getElementById("presentazione");
    home.campi("APERTURA", "testo").forEach(function (testo) {
      presentazione.appendChild(C.scrivi(document.createElement("p"), testo));
    });
    /* La riga per gli adulti compare solo se nel file c'è */
    var testoAdulti = document.getElementById("testo-adulti");
    if (home.campo("APERTURA", "testo-adulti")) {
      C.scrivi(testoAdulti, home.campo("APERTURA", "testo-adulti"));
    } else {
      testoAdulti.hidden = true;
    }
    /* I due pulsanti dell'apertura portano alle fasce degli indirizzi
       e dei serali, più in basso. Dopo il salto il focus va sul titolo
       della fascia: chi usa la tastiera riparte da lì, e il lettore di
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

    /* Titoli delle fasce */
    C.scrivi(document.getElementById("titolo-indirizzi"), home.campo("SEZIONI", "indirizzi"));
    C.scrivi(document.getElementById("titolo-open-day"),
      home.campo("SEZIONI", "open-day") + " " + comuni.campo("OPEN DAY", "anno"));
    C.scrivi(document.getElementById("titolo-contatti"), home.campo("SEZIONI", "contatti"));

    schede(home);
    openDay(comuni);
    contatti(home, comuni);

    P.piede(comuni);
  }


  /* ---------------------------------------------------------------
     LE SCHEDE DEGLI INDIRIZZI
     --------------------------------------------------------------- */

  /* Le tre schede hanno tutte la stessa struttura: simbolo, tipo di
     scuola, nome, claim, testo breve e, in fondo, il pulsante o
     "Pagina in preparazione". */
  function schede(home) {
    var contenitore = document.getElementById("schede");

    home.righe("INDIRIZZI").forEach(function (riga, i) {
      if (riga.length !== 8) {
        console.warn("home.txt, INDIRIZZI, riga " + (i + 1) + ": servono 8 colonne, ne ho trovate " + riga.length);
        return;
      }
      var dati = {
        nome: riga[0], tipo: riga[1], claim: riga[2], frase: riga[3], breve: riga[4],
        pagina: riga[5], stato: riga[6].toLowerCase(), colore: riga[7].toLowerCase()
      };
      contenitore.appendChild(scheda(dati, home));
    });
  }

  function scheda(dati, home) {
    var articolo = document.createElement("article");
    articolo.className = "carta scheda";

    /* La testa della scheda: il quadratino con il simbolo a sinistra e,
       accanto, il tipo di scuola e il nome. Il resto segue sotto, a
       tutta larghezza. */
    var testa = document.createElement("div");
    testa.className = "scheda-testa";
    if (SIMBOLI[dati.colore]) {
      testa.appendChild(icona(SIMBOLI[dati.colore], "icona-" + dati.colore));
    } else {
      console.warn("home.txt: colore sconosciuto \"" + dati.colore + "\" per " + dati.nome);
    }
    var titoli = document.createElement("div");
    titoli.className = "scheda-titoli";
    titoli.appendChild(elemento("p", "etichetta", dati.tipo));
    titoli.appendChild(elemento("h3", "", dati.nome));
    testa.appendChild(titoli);
    articolo.appendChild(testa);
    if (dati.claim) { articolo.appendChild(elemento("p", "scheda-claim", dati.claim)); }
    /* La frase concreta, subito sotto il claim, in testo normale. Come
       gli altri campi, se è vuota non compare. */
    if (dati.frase) { articolo.appendChild(elemento("p", "scheda-frase", dati.frase)); }
    if (dati.breve) { articolo.appendChild(elemento("p", "", dati.breve)); }

    var fondo = document.createElement("div");
    fondo.className = "scheda-fondo";

    if (dati.stato === "pronta") {
      fondo.appendChild(pulsantePagina(dati, home, fondo));
    } else {
      fondo.appendChild(inPreparazione(home));
    }

    articolo.appendChild(fondo);
    return articolo;
  }

  function inPreparazione(home) {
    return elemento("p", "scheda-stato", home.campo("SEZIONI", "in-preparazione"));
  }

  /* Il pulsante verso la pagina dell'indirizzo. Per chi usa un lettore
     di schermo si aggiunge il nome dell'indirizzo, altrimenti sentirebbe
     quattro volte "Vai alla pagina" senza sapere quale.
     Per sicurezza si controlla anche che la pagina esista davvero: se
     manca, al posto del pulsante torna "Pagina in preparazione". */
  function pulsantePagina(dati, home, fondo) {
    var a = document.createElement("a");
    a.className = "pulsante";
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

  /* Il mese abbreviato del foglietto, ricavato dalla data scritta nel
     file: "21 novembre" diventa NOV. */
  var MESI = {
    gennaio: "GEN", febbraio: "FEB", marzo: "MAR", aprile: "APR",
    maggio: "MAG", giugno: "GIU", luglio: "LUG", agosto: "AGO",
    settembre: "SET", ottobre: "OTT", novembre: "NOV", dicembre: "DIC"
  };

  /* Un turno con il suo stato. Nel file, dopo l'orario, si può scrivere
     "esaurito": "10.00-11.00 esaurito" (funziona anche il vecchio
     "sold out").
     - turno libero: spunta verde
     - turno esaurito: croce rossa e la scritta del campo "esaurito" di
       comuni.txt
     La differenza non sta solo nel colore (rosso e verde si confondono
     per chi è daltonico) ma anche nella forma e nella scritta. Chi usa
     un lettore di schermo sente "posti liberi" oppure la scritta. */
  var TURNO_PIENO = /\s*(esaurito|sold\s*out)\s*$/i;

  function turnoConStato(testo, scrittaEsaurito) {
    var esaurito = TURNO_PIENO.test(testo);
    var orario = testo.replace(TURNO_PIENO, "");
    var voce = document.createElement("li");
    voce.className = "turno " + (esaurito ? "turno-esaurito" : "turno-libero");
    voce.appendChild(segno(esaurito ? "croce" : "spunta", "turno-segno"));
    C.scrivi(voce, orario);
    if (esaurito) {
      voce.appendChild(elemento("span", "turno-scritta", " " + scrittaEsaurito));
    } else {
      voce.appendChild(elemento("span", "solo-lettori", ", posti liberi"));
    }
    return voce;
  }

  function openDay(comuni) {
    /* La nota sui turni, sotto il titolo: compare solo se c'è */
    var nota = document.getElementById("open-day-nota");
    if (comuni.campo("OPEN DAY", "nota-turni")) {
      C.scrivi(nota, comuni.campo("OPEN DAY", "nota-turni"));
    } else {
      nota.hidden = true;
    }

    /* Ogni data: un foglietto da calendario (mese e giorno) e, accanto
       o sotto, il giorno della settimana e i due turni. Il foglietto è
       solo un disegno: chi usa un lettore di schermo sente la data per
       intero, scritta accanto al giorno della settimana. */
    var elenco = document.getElementById("elenco-open-day");
    comuni.righe("OPEN DAY").forEach(function (riga, i) {
      if (riga.length !== 4) {
        console.warn("comuni.txt, OPEN DAY, riga " + (i + 1) + ": servono 4 colonne, ne ho trovate " + riga.length);
        return;
      }
      var parti = riga[1].split(/\s+/);
      var numero = parti[0];
      var mese = MESI[(parti[1] || "").toLowerCase()] || (parti[1] || "").slice(0, 3).toUpperCase();

      var voce = document.createElement("li");
      voce.className = "data";

      var foglietto = document.createElement("div");
      foglietto.className = "foglietto";
      foglietto.setAttribute("aria-hidden", "true");
      foglietto.appendChild(elemento("span", "foglietto-mese", mese));
      foglietto.appendChild(elemento("span", "foglietto-giorno", numero));
      voce.appendChild(foglietto);

      var testi = document.createElement("div");
      testi.className = "data-testi";
      var quando = elemento("p", "data-settimana", riga[0]);
      quando.appendChild(elemento("span", "solo-lettori", " " + riga[1]));
      testi.appendChild(quando);
      /* I due turni, uno sotto l'altro */
      var turni = document.createElement("ul");
      turni.className = "data-turni";
      [riga[2], riga[3]].forEach(function (orario) {
        turni.appendChild(turnoConStato(orario, comuni.campo("OPEN DAY", "esaurito") || "Esaurito"));
      });
      testi.appendChild(turni);
      voce.appendChild(testi);

      elenco.appendChild(voce);
    });

    /* In fondo alla scheda, il pulsante per prenotare. Se il link manca,
       resta solo il testo. */
    var prenota = document.getElementById("prenotazione");
    var testo = comuni.campo("OPEN DAY", "come-prenotare");
    var link = comuni.campo("OPEN DAY", "prenotazione");
    if (link && !C.daCompletare(link)) {
      var a = elemento("a", "pulsante", testo);
      a.href = link;
      prenota.appendChild(a);
    } else {
      C.scrivi(prenota, testo + " " + (link || ""));
    }
  }


  /* ---------------------------------------------------------------
     CORSI SERALI
     Legge la sezione HOME di contenuti/serali.txt e costruisce una
     scheda uguale a quelle degli indirizzi, con la stessa funzione.
     Le informazioni dettagliate (sezione PAGINA) servono alla futura
     pagina dei serali e qui non si usano.
     --------------------------------------------------------------- */

  function serali(file, home) {
    C.scrivi(document.getElementById("titolo-serali"), file.campo("HOME", "titolo"));
    var dati = {
      nome:   file.campo("HOME", "nome"),
      tipo:   file.campo("HOME", "tipo"),
      claim:  file.campo("HOME", "claim"),
      breve:  file.campo("HOME", "in breve"),
      pagina: file.campo("HOME", "pagina"),
      stato:  file.campo("HOME", "stato").toLowerCase(),
      colore: "serali"
    };
    /* Stessa scheda degli indirizzi, ma disposta in orizzontale: lunga
       e bassa */
    var articolo = scheda(dati, home);
    articolo.className += " scheda-orizzontale";
    document.getElementById("scheda-serali").appendChild(articolo);
  }


  /* ---------------------------------------------------------------
     CONTATTI
     --------------------------------------------------------------- */

  /* I pulsanti d'azione della fascia dei contatti. Ogni riga di
     home.txt: azione | campo del dato | campo del link (facoltativo).
     Ogni pulsante è un unico link, cliccabile per intero. */
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
      var simbolo, link = null, esterno = false;
      if (riga[2]) {
        link = comuni.campo("SCUOLA", riga[2]);
        if (!link) { console.warn("home.txt, CONTATTI: in comuni.txt non trovo il campo " + riga[2]); }
        esterno = true;
        simbolo = /^https?:\/\//.test(valore) ? "globo" : "luogo";
      } else if (riga[1] === "telefono") {
        link = linkTelefono(valore);
        simbolo = "telefono";
      } else if (valore.indexOf("@") !== -1) {
        link = "mailto:" + valore;
        simbolo = "busta";
      } else {
        simbolo = "luogo";
      }
      if (!link || C.daCompletare(link) || C.daCompletare(valore)) { return; }

      var a = document.createElement("a");
      a.className = "carta azione";
      a.href = link;
      if (esterno) {
        a.target = "_blank";
        a.rel = "noopener";
      }
      a.appendChild(icona(simbolo));

      var testi = document.createElement("span");
      testi.className = "azione-testi";
      testi.appendChild(elemento("span", "azione-nome", riga[0]));
      testi.appendChild(scriviDato(elemento("span", "azione-dato", ""), valore));
      if (esterno) {
        /* Chi usa un lettore di schermo sente dove si apre il link.
           Se in home.txt c'è il campo apri-mappa, la sua scritta compare
           anche sotto il dato, in una riga piccola; oggi non c'è. */
        /* TESTO MODIFICABILE */
        var dove = /google\.[^/]+\/maps/.test(link) ? "Google Maps" : "un altro sito";
        testi.appendChild(elemento("span", "solo-lettori", " (si apre " + dove + " in una nuova scheda)"));
        if (home.campo("SEZIONI", "apri-mappa")) {
          testi.appendChild(elemento("span", "azione-apri", home.campo("SEZIONI", "apri-mappa")));
        }
      }
      a.appendChild(testi);

      var voce = document.createElement("li");
      voce.appendChild(a);
      elenco.appendChild(voce);
    });
  }
}());
