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
  var FILE_SIMBOLI = "immagini/simboli.svg?v=4";

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

  /* Un simbolo da solo, senza quadratino, che prende il colore del
     testo intorno. Solo decorativo. */
  function segno(simbolo, classe) {
    var svg = document.createElementNS(SVG, "svg");
    svg.setAttribute("class", classe);
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    var uso = document.createElementNS(SVG, "use");
    uso.setAttribute("href", FILE_SIMBOLI + "#" + simbolo);
    svg.appendChild(uso);
    return svg;
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
     "sold out": "10.00-11.00 sold out".
     - turno libero: spunta verde
     - turno esaurito: croce rossa e la scritta "Sold out"
     La differenza non sta solo nel colore (rosso e verde si confondono
     per chi è daltonico) ma anche nella forma e nella scritta. Chi usa
     un lettore di schermo sente "posti liberi" oppure "sold out". */
  var SOLD_OUT = /\s*sold\s*out\s*$/i;

  function turnoConStato(testo) {
    var esaurito = SOLD_OUT.test(testo);
    var orario = testo.replace(SOLD_OUT, "");
    var voce = document.createElement("li");
    voce.className = "turno " + (esaurito ? "turno-esaurito" : "turno-libero");
    voce.appendChild(segno(esaurito ? "croce" : "spunta", "turno-segno"));
    C.scrivi(voce, orario);
    if (esaurito) {
      voce.appendChild(elemento("span", "sold-out", " Sold out"));
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
        turni.appendChild(turnoConStato(orario));
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
