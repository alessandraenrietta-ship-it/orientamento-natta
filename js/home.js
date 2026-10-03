/* ==================================================================
   LA PAGINA INIZIALE

   Legge contenuti/home.txt e contenuti/comuni.txt e riempie la pagina.
   I testi non stanno qui: si cambiano nei file di testo.

   Ha bisogno di js/contenuti.js, che va caricato prima di questo.
   ================================================================== */

(function () {
  "use strict";

  var C = window.Contenuti;
  var SVG = "http://www.w3.org/2000/svg";

  /* I disegni stanno in immagini/simboli.svg: se si cambia un disegno,
     si aumenta il numero ?v= qui sotto. */
  var FILE_SIMBOLI = "immagini/simboli.svg?v=1";

  /* Il simbolo di ogni indirizzo, scelto dalla colonna "colore" */
  var SIMBOLI = {
    meccanica: "rotella",
    grafica: "occhio",
    liceo: "lampadina",
    serali: "luna"
  };

  Promise.all([C.leggi("contenuti/home.txt"), C.leggi("contenuti/comuni.txt")])
    .then(function (file) {
      riempi(file[0], file[1]);
      document.getElementById("contenuto").hidden = false;
    })
    .catch(function (errore) {
      console.error(errore);
      document.getElementById("avviso").hidden = false;
    });

  function riempi(home, comuni) {
    var nome = comuni.campo("SCUOLA", "nome");

    /* Testata */
    C.scrivi(document.getElementById("nome-scuola"), nome);

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

    /* Titoli delle fasce */
    C.scrivi(document.getElementById("titolo-indirizzi"), home.campo("SEZIONI", "indirizzi"));
    C.scrivi(document.getElementById("titolo-open-day"),
      home.campo("SEZIONI", "open-day") + " " + comuni.campo("OPEN DAY", "anno"));
    C.scrivi(document.getElementById("titolo-contatti"), home.campo("SEZIONI", "contatti"));

    schede(home, comuni);
    openDay(comuni);
    contatti(home, comuni);

    /* Piede */
    C.scrivi(document.getElementById("piede"), nome + " · " + comuni.campo("SCUOLA", "indirizzo"));
  }


  /* ---------------------------------------------------------------
     I PEZZI CHE SI RIPETONO
     --------------------------------------------------------------- */

  /* Il quadratino colorato con un simbolo dentro. Il simbolo è solo
     decorativo: il nome è sempre scritto accanto. */
  function icona(simbolo, classe) {
    var riquadro = document.createElement("span");
    riquadro.className = "icona" + (classe ? " " + classe : "");
    var svg = document.createElementNS(SVG, "svg");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    var uso = document.createElementNS(SVG, "use");
    uso.setAttribute("href", FILE_SIMBOLI + "#" + simbolo);
    svg.appendChild(uso);
    riquadro.appendChild(svg);
    return riquadro;
  }

  /* Un elemento con dentro un testo, che può contenere [DA COMPLETARE] */
  function elemento(tag, classe, testo) {
    var e = document.createElement(tag);
    if (classe) { e.className = classe; }
    return C.scrivi(e, testo);
  }

  /* Un link, oppure solo il testo se l'indirizzo manca */
  function collegamento(testo, indirizzo) {
    if (!indirizzo || C.daCompletare(indirizzo)) {
      var solo = C.scrivi(document.createElement("span"), testo);
      if (indirizzo) { C.scrivi(solo, " " + indirizzo); }
      return solo;
    }
    var a = document.createElement("a");
    a.href = indirizzo;
    C.scrivi(a, testo);
    return a;
  }


  /* ---------------------------------------------------------------
     LE SCHEDE DEGLI INDIRIZZI
     --------------------------------------------------------------- */

  function schede(home, comuni) {
    var contenitore = document.getElementById("schede");

    /* I link utili, raccolti per scheda */
    var linkUtili = {};
    home.righe("LINK UTILI").forEach(function (riga, i) {
      if (riga.length !== 3) {
        console.warn("home.txt, LINK UTILI, riga " + (i + 1) + ": servono 3 colonne, ne ho trovate " + riga.length);
        return;
      }
      var indirizzo = comuni.campo("SCUOLA", riga[2]);
      if (!indirizzo) {
        console.warn("home.txt, LINK UTILI: in comuni.txt non trovo il campo " + riga[2]);
        return;
      }
      if (!linkUtili[riga[0]]) { linkUtili[riga[0]] = []; }
      linkUtili[riga[0]].push({ testo: riga[1], indirizzo: indirizzo });
    });

    home.righe("INDIRIZZI").forEach(function (riga, i) {
      if (riga.length !== 7) {
        console.warn("home.txt, INDIRIZZI, riga " + (i + 1) + ": servono 7 colonne, ne ho trovate " + riga.length);
        return;
      }
      var dati = {
        nome: riga[0], tipo: riga[1], claim: riga[2], breve: riga[3],
        pagina: riga[4], stato: riga[5].toLowerCase(), colore: riga[6].toLowerCase()
      };
      contenitore.appendChild(scheda(dati, linkUtili[dati.colore] || [], home));
    });
  }

  function scheda(dati, link, home) {
    var articolo = document.createElement("article");
    articolo.className = "carta scheda";

    if (SIMBOLI[dati.colore]) {
      articolo.appendChild(icona(SIMBOLI[dati.colore], "icona-" + dati.colore));
    } else {
      console.warn("home.txt: colore sconosciuto \"" + dati.colore + "\" per " + dati.nome);
    }

    articolo.appendChild(elemento("p", "etichetta", dati.tipo));
    articolo.appendChild(elemento("h3", "", dati.nome));
    if (dati.claim) { articolo.appendChild(elemento("p", "scheda-claim", dati.claim)); }
    if (dati.breve) { articolo.appendChild(elemento("p", "", dati.breve)); }

    var fondo = document.createElement("div");
    fondo.className = "scheda-fondo";

    if (dati.stato === "pronta") {
      fondo.appendChild(pulsantePagina(dati, home, fondo));
    } else {
      fondo.appendChild(inPreparazione(home));
    }

    if (link.length) {
      var elenco = document.createElement("ul");
      elenco.className = "scheda-link";
      link.forEach(function (l) {
        var voce = document.createElement("li");
        voce.appendChild(collegamento(l.testo, l.indirizzo));
        elenco.appendChild(voce);
      });
      fondo.appendChild(elenco);
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

  /* "17.30-19.30" diventa "dalle 17.30 alle 19.30": si legge meglio.
       è uno spazio che non va a capo: "alle" resta con l'ora. */
  function orario(testo) {
    var parti = testo.match(/^\s*(\S+)\s*-\s*(\S+)\s*$/);
    return parti ? "dalle " + parti[1] + " alle " + parti[2] : testo;
  }

  function openDay(comuni) {
    var elenco = document.getElementById("elenco-open-day");
    comuni.righe("OPEN DAY").forEach(function (riga, i) {
      if (riga.length !== 3) {
        console.warn("comuni.txt, OPEN DAY, riga " + (i + 1) + ": servono 3 colonne, ne ho trovate " + riga.length);
        return;
      }
      var voce = document.createElement("li");
      voce.className = "carta data";
      voce.appendChild(elemento("span", "etichetta", riga[0]));
      voce.appendChild(elemento("span", "data-giorno", riga[1]));
      voce.appendChild(elemento("span", "data-ora", orario(riga[2])));
      elenco.appendChild(voce);
    });

    var prenota = document.getElementById("prenotazione");
    prenota.appendChild(icona("calendario"));
    prenota.appendChild(collegamento(
      comuni.campo("OPEN DAY", "come-prenotare"),
      comuni.campo("OPEN DAY", "prenotazione")
    ));
  }


  /* ---------------------------------------------------------------
     CONTATTI
     --------------------------------------------------------------- */

  function contatti(home, comuni) {
    var elenco = document.getElementById("elenco-contatti");
    home.righe("CONTATTI").forEach(function (riga, i) {
      if (riga.length !== 2) {
        console.warn("home.txt, CONTATTI, riga " + (i + 1) + ": servono 2 colonne, ne ho trovate " + riga.length);
        return;
      }
      var campo = riga[1];
      var valore = comuni.campo("SCUOLA", campo);
      if (!valore) {
        console.warn("home.txt, CONTATTI: in comuni.txt non trovo il campo " + campo);
        return;
      }

      /* Il sito capisce da solo di che contatto si tratta */
      var simbolo, link = null, mostra = valore;
      if (campo === "telefono") {
        simbolo = "telefono";
        /* Il numero per la chiamata: solo cifre, con il prefisso
           dell'Italia davanti. */
        link = "tel:+39" + valore.replace(/\D/g, "");
      } else if (valore.indexOf("@") !== -1) {
        simbolo = "busta";
        link = "mailto:" + valore;
      } else if (/^https?:\/\//.test(valore)) {
        simbolo = "globo";
        link = valore;
        /* Si mostra l'indirizzo senza "https://", che non serve leggere */
        mostra = valore.replace(/^https?:\/\//, "").replace(/\/$/, "");
      } else {
        simbolo = "luogo";
      }
      if (C.daCompletare(valore)) { link = null; }

      var voce = document.createElement("li");
      voce.className = "carta contatto";
      voce.appendChild(icona(simbolo));
      var testo = document.createElement("div");
      testo.appendChild(elemento("p", "etichetta", riga[0]));
      var riga2 = document.createElement("p");
      riga2.appendChild(link ? collegamento(mostra, link) : C.scrivi(document.createElement("span"), mostra));
      testo.appendChild(riga2);
      voce.appendChild(testo);
      elenco.appendChild(voce);
    });
  }
}());
