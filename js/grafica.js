/* ==================================================================
   I PEZZI DELLA GRAFICA "A CARTOLINA"

   Le parti che la home e le pagine del liceo hanno in comune:
     - il disegno della scuola con le tre linee (Grafica.disegno)
     - il piede con le etichette (Grafica.piede) e il suo timbro
       rotondo (Grafica.timbro)
     - le date degli open day ancora da venire (Grafica.dateOpenDay) e
       il pulsante per prenotare (Grafica.pulsantePrenota)
   I colori e le misure stanno in grafica.css.

   Ha bisogno di js/contenuti.js e js/comuni.js, che vanno caricati
   prima di questo. js/comuni.js resta per i pezzi comuni a tutte le
   pagine, cartolina compresa.
   ================================================================== */

window.Grafica = (function () {
  "use strict";

  var C = window.Contenuti;
  var P = window.Pezzi;
  var SVG = "http://www.w3.org/2000/svg";

  /* Il disegno delle tre linee. Se si cambia il disegno, si aumenta il
     numero ?v= qui sotto. */
  var FILE_DISEGNO = "immagini/linee-scuola.svg?v=1";

  /* Lo spessore delle linee sullo schermo, in pixel. Resta lo stesso
     su telefono, computer e LIM. */
  var SPESSORE_LINEE = 2.4;

  /* La larghezza massima della scuola al centro del disegno, in rem:
     44 perché al computer pulsanti e percorsi restino nella prima
     schermata */
  var MASSIMO_DISEGNO = 44;


  /* ---------------------------------------------------------------
     IL DISEGNO DELLE TRE LINEE
     Si legge immagini/linee-scuola.svg e lo si mette dentro la pagina,
     nel contenitore indicato: così il CSS può cambiare colore e
     spessore delle linee e farle disegnare una dopo l'altra (vedi
     grafica.css). Se il file non si legge, lo spazio resta vuoto e la
     pagina funziona lo stesso.
     --------------------------------------------------------------- */

  function disegno(contenitore) {
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
        adatta(contenitore, contenitore.querySelector("svg"));
      })
      .catch(function (errore) {
        console.warn("Non riesco a leggere il disegno " + FILE_DISEGNO + ": " + errore.message);
      });
  }

  /* Il disegno occupa tutta la larghezza della finestra, ma la scuola
     al centro resta larga al massimo MASSIMO_DISEGNO. Quando la
     finestra è più larga (computer, LIM), si allungano solo i tratti
     orizzontali esterni delle tre linee, alle stesse altezze, fino ai
     bordi. Sul telefono la scuola è già larga quanto lo schermo e non
     cambia nulla.
     Insieme si ricalcola lo spessore, perché sullo schermo resti sempre
     di 2,4 pixel. Tutto si rifà ogni volta che cambia la larghezza. */
  function adatta(contenitore, svg) {
    var box = svg.viewBox.baseVal;
    var sinistra = box.x, destra = box.x + box.width, alto = box.y, altezza = box.height;
    var larghezzaScuola = box.width;
    var linee = Array.prototype.map.call(svg.querySelectorAll("path"), function (linea) {
      var d = linea.getAttribute("d");
      var numeri = d.match(/-?\d+(\.\d+)?/g).map(Number);
      return {
        linea: linea,
        d: d,
        yInizio: numeri[1],                     /* il primo punto: x, y */
        yFine: numeri[numeri.length - 1]        /* l'ultimo punto: x, y */
      };
    });

    function aggiorna() {
      var finestra = contenitore.getBoundingClientRect().width;
      if (!finestra) { return; }
      var rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      var scuola = Math.min(finestra, MASSIMO_DISEGNO * rem);
      var scala = scuola / larghezzaScuola;          /* pixel per unità del disegno */
      var fuori = (finestra - scuola) / 2 / scala;   /* unità da aggiungere per lato */
      if (fuori < 0.5) { fuori = 0; }

      svg.setAttribute("viewBox", [sinistra - fuori, alto, larghezzaScuola + 2 * fuori, altezza].join(" "));
      linee.forEach(function (l) {
        var d = l.d;
        if (fuori) {
          d = "M" + (sinistra - fuori) + " " + l.yInizio + " L" + l.d.replace(/^\s*M/, "") +
              " L" + (destra + fuori) + " " + l.yFine;
        }
        l.linea.setAttribute("d", d);
      });
      svg.style.setProperty("--spessore", (SPESSORE_LINEE / scala) + "px");
    }
    aggiorna();
    if (window.ResizeObserver) {
      new ResizeObserver(aggiorna).observe(contenitore);
    } else {
      window.addEventListener("resize", aggiorna);
    }
  }


  /* ---------------------------------------------------------------
     IL PIEDE
     Nome della scuola e indirizzo, poi tre dati con un'etichetta
     davanti: "Centralino: 011 956 32 13", "Segreteria: ...", "Sito
     della scuola: ...". Il link sta solo sul dato. Tutto da comuni.txt.
     Va nell'elenco con id="piede".
     --------------------------------------------------------------- */

  function piede(comuni) {
    var elenco = document.getElementById("piede");
    var campo = function (nome) { return comuni.campo("SCUOLA", nome); };

    function voce(etichetta, contenuto) {
      var li = document.createElement("li");
      if (etichetta) { li.appendChild(P.elemento("span", "piede-etichetta", etichetta + ": ")); }
      li.appendChild(contenuto);
      elenco.appendChild(li);
    }

    if (campo("nome")) { voce("", C.scrivi(document.createElement("span"), campo("nome"))); }
    if (campo("indirizzo")) { voce("", C.scrivi(document.createElement("span"), campo("indirizzo"))); }
    if (campo("telefono")) {
      voce(campo("etichetta-telefono"), P.collegamento(campo("telefono"), P.linkTelefono(campo("telefono"))));
    }
    if (campo("email")) {
      var email = P.collegamento("", "mailto:" + campo("email"));
      P.scriviDato(email, campo("email"));
      voce(campo("etichetta-email"), email);
    }
    if (campo("sito")) {
      voce(campo("etichetta-sito"), P.collegamento(P.sitoDaMostrare(campo("sito")), campo("sito")));
    }
  }


  /* ---------------------------------------------------------------
     GLI OPEN DAY
     --------------------------------------------------------------- */

  /* I mesi: il numero serve a capire se la data è passata, la sigla
     va sul foglietto */
  var MESI = {
    gennaio: [1, "GEN"], febbraio: [2, "FEB"], marzo: [3, "MAR"], aprile: [4, "APR"],
    maggio: [5, "MAG"], giugno: [6, "GIU"], luglio: [7, "LUG"], agosto: [8, "AGO"],
    settembre: [9, "SET"], ottobre: [10, "OTT"], novembre: [11, "NOV"], dicembre: [12, "DIC"]
  };

  /* La data di un open day. Nel file c'è solo "21 novembre": l'anno si
     ricava dall'anno scolastico ("2026/27"). Da settembre a dicembre è
     il primo anno (2026), da gennaio ad agosto il secondo (2027).
     Se la data non si capisce, si restituisce null. */
  function dataOpenDay(testo, annoScolastico) {
    var parti = testo.trim().split(/\s+/);
    var giorno = parseInt(parti[0], 10);
    var mese = MESI[(parti[1] || "").toLowerCase()];
    var primoAnno = parseInt(annoScolastico, 10);
    if (!giorno || !mese || !primoAnno) { return null; }
    var anno = mese[0] >= 9 ? primoAnno : primoAnno + 1;
    return { quando: new Date(anno, mese[0] - 1, giorno), giorno: giorno, sigla: mese[1] };
  }

  /* Le righe della tabella OPEN DAY di comuni.txt ancora da venire, come
     coppie { riga, data }. Una data resta per tutto il suo giorno e
     sparisce dal giorno dopo. Una data che non si capisce si tiene (con
     data null) e si segnala nella console. */
  function dateOpenDay(comuni) {
    var anno = comuni.campo("OPEN DAY", "anno");
    var oggi = new Date();
    oggi.setHours(0, 0, 0, 0);
    var future = [];
    comuni.righe("OPEN DAY").forEach(function (riga, i) {
      if (riga.length !== 4) {
        console.warn("comuni.txt, OPEN DAY, riga " + (i + 1) + ": servono 4 colonne, ne ho trovate " + riga.length);
        return;
      }
      var data = dataOpenDay(riga[1], anno);
      if (!data) {
        console.warn("comuni.txt, OPEN DAY, riga " + (i + 1) + ": non capisco la data \"" + riga[1] + "\" (si scrive come 21 novembre)");
      } else if (data.quando < oggi) {
        return;   /* data passata */
      }
      future.push({ riga: riga, data: data });
    });
    return future;
  }

  /* Il pulsante pieno per prenotare, dentro l'elemento indicato. Se il
     link manca, resta solo il testo. */
  function pulsantePrenota(comuni, dove) {
    var testo = comuni.campo("OPEN DAY", "come-prenotare");
    var link = comuni.campo("OPEN DAY", "prenotazione");
    if (link && !C.daCompletare(link)) {
      var a = P.elemento("a", "pulsante pulsante-pieno", testo);
      a.href = link;
      dove.appendChild(a);
    } else {
      C.scrivi(dove, testo + " " + (link || ""));
    }
  }


  /* ---------------------------------------------------------------
     IL TIMBRO DEL PIEDE
     Un timbro rotondo blu inchiostro: due cerchi, la scritta "IIS GIULIO
     NATTA · ORIENTAMENTO" lungo il cerchio e il logo al centro. Le
     parole vengono dai file di testo (nome della scuola in comuni.txt e
     occhiello in home.txt). È solo decorativo: i dati sono scritti
     accanto. Va nell'elemento con id="timbro".
     --------------------------------------------------------------- */

  function timbro(home, comuni) {
    var contenitore = document.getElementById("timbro");
    var nome = comuni.campo("SCUOLA", "nome");
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

  return {
    disegno: disegno,
    piede: piede,
    timbro: timbro,
    dateOpenDay: dateOpenDay,
    pulsantePrenota: pulsantePrenota
  };
}());
