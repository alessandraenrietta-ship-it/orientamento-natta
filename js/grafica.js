/* ==================================================================
   I PEZZI DELLA GRAFICA "A CARTOLINA"

   Le parti che la home e le pagine del liceo hanno in comune:
     - il disegno della scuola con le tre linee (Grafica.disegno)
     - il piede con le etichette (Grafica.piede) e il suo timbro
       rotondo (Grafica.timbro)
     - le date degli open day ancora da venire (Grafica.dateOpenDay),
       i loro foglietti da calendario (Grafica.listaDate) e il pulsante
       per prenotare (Grafica.pulsantePrenota)
     - le parole con il trattino che non si spezzano nei testi
       giustificati (Grafica.paroleIntere)
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
  var FILE_DISEGNO = "immagini/linee-scuola.svg?v=2";

  /* Lo spessore delle linee sullo schermo, in pixel: più sottili sul
     telefono (sotto i 40rem), dove il disegno è piccolo; uguale su
     tablet, computer e LIM */
  var SPESSORE_TELEFONO = 1.4;
  var SPESSORE_LINEE = 2.4;
  var LARGO = window.matchMedia ? window.matchMedia("(min-width: 40rem)") : null;

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
     di 1,4 pixel sul telefono e 2,4 dai 40rem in su. Tutto si rifà ogni
     volta che cambia la larghezza. */
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
      var spessore = (!LARGO || LARGO.matches) ? SPESSORE_LINEE : SPESSORE_TELEFONO;
      svg.style.setProperty("--spessore", (spessore / scala) + "px");
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
     Accanto al timbro solo la riga per i docenti: "Sei un docente
     orientatore? Scarica la cartolina del Natta ›", che porta a
     orientatori.html. Compare solo con "stato: pronta" nella sezione
     ORIENTATORI di comuni.txt, e mai su orientatori.html stessa, che
     chiama Grafica.piede(comuni, true). Va nell'elenco con id="piede".
     I dati della scuola (nome, indirizzo, centralino, segreteria, sito)
     nel piede non ci sono più, in nessuna pagina: ripetevano quasi
     uguali la sezione Contatti della home (scelta di Alessandra, 27
     ottobre 2026 sera).
     --------------------------------------------------------------- */

  function piede(comuni, senzaOrientatori) {
    var elenco = document.getElementById("piede");
    if (senzaOrientatori || comuni.campo("ORIENTATORI", "stato") !== "pronta") { return; }
    var docenti = document.createElement("li");
    docenti.className = "piede-orientatori";
    docenti.appendChild(C.scrivi(document.createElement("span"), comuni.campo("ORIENTATORI", "domanda") + " "));
    var link = P.collegamento(comuni.campo("ORIENTATORI", "collegamento"), "orientatori.html");
    link.className = "link-freccia";
    docenti.appendChild(link);
    elenco.appendChild(docenti);
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

  /* Un turno con il suo stato, su una riga sua: l'orario e accanto
     "Posti liberi" in verde oppure "Posti esauriti" in rosso (campi
     "libero" ed "esaurito" di comuni.txt). Nessun simbolo: la
     differenza non sta solo nel colore (rosso e verde si confondono per
     chi è daltonico) ma nella scritta. Nel file, dopo l'orario, si
     scrive "esaurito" quando il turno è pieno: "10.00-11.00 esaurito"
     (funziona anche il vecchio "sold out"); senza, il turno ha posti
     liberi. Sul telefono la scritta è breve, "Libero" o "Esaurito"
     (campi "libero-breve" ed "esaurito-breve"): nella pagina ci sono
     tutte e due, e grafica.css mostra solo quella che serve; quella
     nascosta non la sente nemmeno il lettore di schermo. L'orario non
     si spezza mai; se la scritta non ci sta accanto, va intera alla
     riga sotto. */
  var TURNO_PIENO = /\s*(esaurito|sold\s*out)\s*$/i;

  function turnoConStato(testo, scritte) {
    var esaurito = TURNO_PIENO.test(testo);
    var turno = document.createElement("li");
    turno.className = "turno" + (esaurito ? " turno-esaurito" : " turno-libero");
    turno.appendChild(P.elemento("span", "turno-orario", testo.replace(TURNO_PIENO, "")));
    turno.appendChild(document.createTextNode(" "));
    var stato = P.elemento("span", "turno-stato", "");
    stato.appendChild(P.elemento("span", "stato-lungo", esaurito ? scritte.esaurito : scritte.libero));
    stato.appendChild(P.elemento("span", "stato-breve", esaurito ? scritte.esauritoBreve : scritte.liberoBreve));
    turno.appendChild(stato);
    return turno;
  }

  /* Le date ancora da venire come foglietti da calendario, dentro
     l'elenco indicato (un <ul class="date">). Per ogni data: il
     foglietto (mese e giorno) e, accanto, il giorno della settimana con
     sotto i due turni, uno per riga. Il foglietto è solo un disegno: chi usa un
     lettore di schermo sente la data per intero, scritta accanto al
     giorno della settimana. Restituisce quante date ha messo. Lo stesso
     componente serve alla home e alle pagine del liceo. */
  function listaDate(comuni, elenco) {
    var scritte = {
      libero: comuni.campo("OPEN DAY", "libero") || "Posti liberi",
      esaurito: comuni.campo("OPEN DAY", "esaurito") || "Posti esauriti",
      liberoBreve: comuni.campo("OPEN DAY", "libero-breve") || "Libero",
      esauritoBreve: comuni.campo("OPEN DAY", "esaurito-breve") || "Esaurito"
    };
    var future = dateOpenDay(comuni);
    future.forEach(function (d) {
      var riga = d.riga, data = d.data;
      var voce = document.createElement("li");
      voce.className = "data";

      var foglietto = document.createElement("div");
      foglietto.className = "foglietto";
      foglietto.setAttribute("aria-hidden", "true");
      if (data) {
        foglietto.appendChild(P.elemento("span", "foglietto-mese", data.sigla));
        foglietto.appendChild(P.elemento("span", "foglietto-giorno", String(data.giorno)));
      }
      voce.appendChild(foglietto);

      var testi = document.createElement("div");
      testi.className = "data-testi";
      var settimana = P.elemento("p", "data-settimana", riga[0]);
      settimana.appendChild(P.elemento("span", "solo-lettori", " " + riga[1]));
      testi.appendChild(settimana);

      /* I due turni uno sotto l'altro, ognuno con il suo stato */
      var turni = document.createElement("ul");
      turni.className = "data-turni";
      turni.appendChild(turnoConStato(riga[2], scritte));
      turni.appendChild(turnoConStato(riga[3], scritte));
      testi.appendChild(turni);

      voce.appendChild(testi);
      elenco.appendChild(voce);
    });
    return future.length;
  }

  /* ---------------------------------------------------------------
     LE PAROLE CON IL TRATTINO
     Nei testi giustificati le parole con un trattino, come
     "post-diploma", non devono andare a capo né dopo il trattino né con
     un secondo trattino della sillabazione. Il CSS da solo non lo sa
     fare: qui ogni parola così si chiude in un pezzo che non si spezza
     (classe "parola-intera", vedi grafica.css). I file di testo non
     cambiano.
     --------------------------------------------------------------- */

  var CON_TRATTINO = /[A-Za-zÀ-ÿ]+(?:-[A-Za-zÀ-ÿ]+)+/g;

  function paroleIntere(elemento) {
    var cammino = document.createTreeWalker(elemento, NodeFilter.SHOW_TEXT);
    var nodi = [];
    while (cammino.nextNode()) { nodi.push(cammino.currentNode); }
    nodi.forEach(function (nodo) {
      var testo = nodo.nodeValue;
      if (!CON_TRATTINO.test(testo)) { return; }
      CON_TRATTINO.lastIndex = 0;
      var pezzi = document.createDocumentFragment();
      var inizio = 0, trovato;
      while ((trovato = CON_TRATTINO.exec(testo)) !== null) {
        if (trovato.index > inizio) {
          pezzi.appendChild(document.createTextNode(testo.slice(inizio, trovato.index)));
        }
        var intera = document.createElement("span");
        intera.className = "parola-intera";
        intera.textContent = trovato[0];
        pezzi.appendChild(intera);
        inizio = trovato.index + trovato[0].length;
      }
      if (inizio < testo.length) { pezzi.appendChild(document.createTextNode(testo.slice(inizio))); }
      nodo.parentNode.replaceChild(pezzi, nodo);
    });
    return elemento;
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
     accanto. Va nell'elemento con id="timbro" oppure, se si indica,
     in un altro elemento (la cartolina lo usa sul retro).
     --------------------------------------------------------------- */

  var timbriFatti = 0;

  function timbro(home, comuni, dove) {
    var contenitore = dove || document.getElementById("timbro");
    /* Ogni timbro ha il suo cerchio per la scritta, con un nome diverso */
    var cerchio = "timbro-cerchio" + (timbriFatti++ ? "-" + timbriFatti : "");
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
      id: cerchio,
      d: "M " + (60 - raggio) + " 60 a " + raggio + " " + raggio + " 0 1 1 " + (2 * raggio) + " 0" +
         " a " + raggio + " " + raggio + " 0 1 1 " + (-2 * raggio) + " 0",
      fill: "none"
    }));
    var testo = nuovo("text", { "class": "timbro-scritta" });
    var percorso = nuovo("textPath", {
      href: "#" + cerchio,
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
    return contenitore;
  }

  return {
    disegno: disegno,
    piede: piede,
    timbro: timbro,
    dateOpenDay: dateOpenDay,
    listaDate: listaDate,
    paroleIntere: paroleIntere,
    pulsantePrenota: pulsantePrenota
  };
}());
