/* ==================================================================
   LA PAGINA DA STAMPARE DELLA CARTOLINA "VIENI A TROVARCI"
   (cartolina.html)

   Legge contenuti/home.txt, contenuti/comuni.txt e
   contenuti/cartolina.txt, fa disegnare le due facciate a
   js/cartolina-facciate.js (lo stesso codice di orientatori.html) e le mette
   sui fogli da stampare. I testi non stanno qui: si cambiano nei file
   di testo.

   Tre versioni, scelte con i pulsanti della pagina:
   - tipografia: un foglio per facciata, 156 x 106 mm (la cartolina
     più 3 mm di abbondanza per lato);
   - a4: due cartoline per foglio A4 verticale, una sopra l'altra, con
     i segni di taglio;
   - docenti: il PDF che si scarica da orientatori.html
     (materiali/cartolina-natta.pdf). Una cartolina per foglio A4
     verticale, al centro, con l'abbondanza e i segni di taglio; sotto,
     fuori dai segni, due righe grigie lette da comuni.txt (sezione
     ORIENTATORI, pdf-riga-1 e pdf-riga-2). Pagina 1 il fronte, pagina
     2 il retro.
   Con l'indirizzo cartolina.html?foglio=a4 o ?foglio=docenti si apre
   già la versione scelta.

   Ha bisogno di js/contenuti.js, js/comuni.js, js/grafica.js,
   js/qr.js e js/cartolina-facciate.js, che vanno caricati prima di
   questo.
   ================================================================== */

(function () {
  "use strict";

  var C = window.Contenuti;
  var P = window.Pezzi;
  var K = window.Cartolina;
  var elemento = P.elemento;

  /* La misura del foglio di stampa per ogni versione */
  var PAGINA = {
    tipografia: "@page { size: 156mm 106mm; margin: 0; }",
    a4: "@page { size: 210mm 297mm; margin: 0; }",
    docenti: "@page { size: 210mm 297mm; margin: 0; }"
  };

  var fronte, retro, righeDocenti;

  Promise.all([
    C.leggi("contenuti/home.txt"),
    C.leggi("contenuti/comuni.txt"),
    C.leggi("contenuti/cartolina.txt"),
    fetch(K.FILE_DISEGNO).then(function (r) {
      if (!r.ok) { throw new Error("Non trovo il disegno " + K.FILE_DISEGNO); }
      return r.text();
    })
  ])
    .then(function (file) {
      fronte = K.fronte(file[1], file[3]);
      retro = K.retro(file[0], file[1], file[2]);
      righeDocenti = ["pdf-riga-1", "pdf-riga-2"]
        .map(function (nome) { return file[1].campo("ORIENTATORI", nome); })
        .filter(function (riga) { return riga; });
      var richiesto = new URLSearchParams(location.search).get("foglio");
      mostra(PAGINA.hasOwnProperty(richiesto) ? richiesto : "tipografia");
      document.getElementById("fogli").hidden = false;
      document.querySelectorAll("[data-modo]").forEach(function (pulsante) {
        pulsante.addEventListener("click", function () {
          mostra(pulsante.getAttribute("data-modo"));
          /* Si aspetta che il browser abbia ridisegnato i fogli, poi si
             apre la finestra di stampa */
          requestAnimationFrame(function () {
            requestAnimationFrame(function () { window.print(); });
          });
        });
      });
    })
    .catch(function (errore) {
      console.error(errore);
      document.getElementById("avviso").hidden = false;
    });


  /* ---------------------------------------------------------------
     LE TRE VERSIONI
     --------------------------------------------------------------- */

  function mostra(modo) {
    document.getElementById("misura-foglio").textContent = PAGINA[modo];
    document.body.className = "modo-" + modo;
    var fogli = document.getElementById("fogli");
    fogli.textContent = "";

    if (modo === "a4") {
      fogli.appendChild(gruppo("Foglio 1: i fronti", foglioA4(fronte)));
      fogli.appendChild(gruppo("Foglio 2: i retri", foglioA4(retro)));
    } else if (modo === "docenti") {
      fogli.appendChild(gruppo("Pagina 1: il fronte", foglioDocenti(fronte)));
      fogli.appendChild(gruppo("Pagina 2: il retro", foglioDocenti(retro)));
    } else {
      fogli.appendChild(gruppo("Fronte", foglioTipografia(fronte)));
      fogli.appendChild(gruppo("Retro", foglioTipografia(retro)));
    }
  }

  /* Un foglio con sopra il suo nome, che si vede solo sullo schermo */
  function gruppo(nome, foglio) {
    var g = document.createElement("div");
    g.className = "foglio-gruppo";
    g.appendChild(elemento("p", "foglio-nome", nome));
    g.appendChild(foglio);
    return g;
  }

  function foglioTipografia(facciata) {
    var foglio = document.createElement("div");
    foglio.className = "foglio foglio-tipografia";
    foglio.appendChild(facciata.cloneNode(true));
    return foglio;
  }

  /* Due cartoline uguali una sopra l'altra, al centro dell'A4
     verticale, e i segni di taglio. Le misure sono in millimetri, a
     partire dall'angolo in alto a sinistra della coppia (156 x 212 mm). */
  function foglioA4(facciata) {
    var foglio = document.createElement("div");
    foglio.className = "foglio foglio-a4";
    var coppia = document.createElement("div");
    coppia.className = "coppia";
    coppia.appendChild(facciata.cloneNode(true));
    var seconda = facciata.cloneNode(true);
    seconda.setAttribute("aria-hidden", "true");
    coppia.appendChild(seconda);

    /* Dove passano i tagli: in orizzontale ai bordi delle due
       cartoline, in verticale a sinistra e a destra. I segni sono
       lunghi 6 mm e restano a 2 mm dal fondo, così non si vedono sulla
       cartolina. */
    [3, 103, 109, 209].forEach(function (y) {
      coppia.appendChild(segnoTaglio("orizzontale", -8, y - 0.125));
      coppia.appendChild(segnoTaglio("orizzontale", 158, y - 0.125));
    });
    [3, 153].forEach(function (x) {
      coppia.appendChild(segnoTaglio("verticale", x - 0.125, -8));
      coppia.appendChild(segnoTaglio("verticale", x - 0.125, 214));
    });

    foglio.appendChild(coppia);
    return foglio;
  }

  /* Una sola cartolina al centro dell'A4 verticale, con i segni di
     taglio agli angoli e, sotto, le due righe grigie. Le misure sono in
     millimetri, a partire dall'angolo in alto a sinistra della
     cartolina con l'abbondanza (156 x 106 mm). Fronte e retro sono
     nello stesso punto del foglio, così combaciano quando lo si
     capovolge sul lato lungo. */
  function foglioDocenti(facciata) {
    var foglio = document.createElement("div");
    foglio.className = "foglio foglio-a4";
    var sola = document.createElement("div");
    sola.className = "sola";
    sola.appendChild(facciata.cloneNode(true));

    /* I tagli passano a 3 mm dai bordi: in orizzontale a 3 e 103 mm,
       in verticale a 3 e 153 mm. Segni lunghi 6 mm, a 2 mm dal fondo. */
    [3, 103].forEach(function (y) {
      sola.appendChild(segnoTaglio("orizzontale", -8, y - 0.125));
      sola.appendChild(segnoTaglio("orizzontale", 158, y - 0.125));
    });
    [3, 153].forEach(function (x) {
      sola.appendChild(segnoTaglio("verticale", x - 0.125, -8));
      sola.appendChild(segnoTaglio("verticale", x - 0.125, 108));
    });

    if (righeDocenti.length) {
      var note = document.createElement("div");
      note.className = "note-docenti";
      righeDocenti.forEach(function (riga) { note.appendChild(elemento("p", "", riga)); });
      sola.appendChild(note);
    }

    foglio.appendChild(sola);
    return foglio;
  }

  function segnoTaglio(verso, x, y) {
    var s = document.createElement("span");
    s.className = "segno-taglio segno-" + verso;
    s.setAttribute("aria-hidden", "true");
    s.style.left = x + "mm";
    s.style.top = y + "mm";
    return s;
  }
}());
