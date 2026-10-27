/* ==================================================================
   I PEZZI DELLA GRAFICA "A CARTOLINA"

   Le parti disegnate che la home e le pagine del liceo hanno in comune:
     - il disegno della scuola con le tre linee (Grafica.disegno)
     - il timbro rotondo del piede (Grafica.timbro)
   I colori e le misure stanno in grafica.css.

   Non ha bisogno di altri file. js/comuni.js resta per i pezzi comuni
   a tutte le pagine (testata, piede, contatti), cartolina compresa.
   ================================================================== */

window.Grafica = (function () {
  "use strict";

  var SVG = "http://www.w3.org/2000/svg";

  /* Il disegno delle tre linee. Se si cambia il disegno, si aumenta il
     numero ?v= qui sotto. */
  var FILE_DISEGNO = "immagini/linee-scuola.svg?v=1";

  /* Lo spessore delle linee sullo schermo, in pixel. Resta lo stesso
     su telefono, computer e LIM. */
  var SPESSORE_LINEE = 2.4;

  /* La larghezza massima della scuola al centro del disegno, in rem */
  var MASSIMO_DISEGNO = 60;


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

  return { disegno: disegno, timbro: timbro };
}());
