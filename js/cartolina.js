/* ==================================================================
   LA CARTOLINA "VIENI A TROVARCI" (cartolina.html)

   Legge contenuti/home.txt, contenuti/comuni.txt e
   contenuti/cartolina.txt e compone le due facciate della cartolina,
   15 x 10 cm orizzontale. I testi non stanno qui: si cambiano nei file
   di testo.

   - Fronte: la scuola disegnata dalle tre linee degli indirizzi
     (immagini/linee-scuola.svg), il codice QR al posto del portone,
     fra le due torri, e sotto "IIS GIULIO NATTA · RIVOLI".
   - Retro, come una cartolina postale: a sinistra l'invito, i tre
     indirizzi e la firma di Giulio Natta; a destra francobollo, onde
     di annullo, timbro e destinatario; in basso i contatti.

   Due versioni, scelte con i pulsanti della pagina:
   - tipografia: un foglio per facciata, 156 x 106 mm (la cartolina
     più 3 mm di abbondanza per lato);
   - a4: due cartoline per foglio A4 verticale, una sopra l'altra, con
     i segni di taglio.
   Con l'indirizzo cartolina.html?foglio=a4 si apre già la seconda.

   Ha bisogno di js/contenuti.js, js/comuni.js, js/grafica.js (il
   timbro) e js/qr.js, che vanno caricati prima di questo.
   ================================================================== */

(function () {
  "use strict";

  var C = window.Contenuti;
  var P = window.Pezzi;
  var G = window.Grafica;
  var elemento = P.elemento;
  var SVG = "http://www.w3.org/2000/svg";

  /* Il disegno delle tre linee: lo stesso della home */
  var FILE_DISEGNO = "immagini/linee-scuola.svg?v=1";

  /* La firma di Giulio Natta: un'immagine con lo sfondo trasparente,
     colorata di blu notte da cartolina.css */
  var FILE_FIRMA = "immagini/firma-natta.png";

  /* Sul fronte il disegno è largo quanto la facciata, 156 mm, cioè 640
     unità del disegno: un'unità è 156 / 640 mm. Con queste misure si
     mettono le linee a 0,4 mm e il QR fra le due torri. */
  var LARGHEZZA_FACCIATA = 156;           /* mm */
  var MM_PER_UNITA = LARGHEZZA_FACCIATA / 640;
  var SPESSORE_LINEE = 0.4;               /* mm */

  /* La misura del foglio di stampa per ogni versione */
  var PAGINA = {
    tipografia: "@page { size: 156mm 106mm; margin: 0; }",
    a4: "@page { size: 210mm 297mm; margin: 0; }"
  };

  var fronte, retro;

  Promise.all([
    C.leggi("contenuti/home.txt"),
    C.leggi("contenuti/comuni.txt"),
    C.leggi("contenuti/cartolina.txt"),
    fetch(FILE_DISEGNO).then(function (r) {
      if (!r.ok) { throw new Error("Non trovo il disegno " + FILE_DISEGNO); }
      return r.text();
    })
  ])
    .then(function (file) {
      fronte = facciataFronte(file[1], file[3]);
      retro = facciataRetro(file[0], file[1], file[2]);
      var richiesto = new URLSearchParams(location.search).get("foglio");
      mostra(richiesto === "a4" ? "a4" : "tipografia");
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
     LE DUE VERSIONI
     --------------------------------------------------------------- */

  function mostra(modo) {
    document.getElementById("misura-foglio").textContent = PAGINA[modo];
    document.body.className = "modo-" + modo;
    var fogli = document.getElementById("fogli");
    fogli.textContent = "";

    if (modo === "a4") {
      fogli.appendChild(gruppo("Foglio 1: i fronti", foglioA4(fronte)));
      fogli.appendChild(gruppo("Foglio 2: i retri", foglioA4(retro)));
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

  function segnoTaglio(verso, x, y) {
    var s = document.createElement("span");
    s.className = "segno-taglio segno-" + verso;
    s.setAttribute("aria-hidden", "true");
    s.style.left = x + "mm";
    s.style.top = y + "mm";
    return s;
  }


  /* ---------------------------------------------------------------
     IL FRONTE: la scuola delle tre linee, il QR al posto del portone e
     il nome della scuola
     --------------------------------------------------------------- */

  function facciataFronte(comuni, testoDisegno) {
    var f = document.createElement("section");
    f.className = "facciata fronte";
    f.setAttribute("aria-label", "Fronte");

    /* Il disegno, largo quanto la facciata: le linee entrano ed escono
       dai bordi, abbondanza compresa. Solo decorativo. */
    var disegno = new DOMParser().parseFromString(testoDisegno, "image/svg+xml").documentElement;
    disegno.setAttribute("class", "fronte-disegno");
    disegno.setAttribute("aria-hidden", "true");
    disegno.setAttribute("focusable", "false");
    disegno.setAttribute("preserveAspectRatio", "xMidYMid meet");
    var tratto = SPESSORE_LINEE / MM_PER_UNITA;
    Array.prototype.forEach.call(disegno.querySelectorAll("g, path"), function (n) {
      n.setAttribute("stroke-width", tratto.toFixed(2));
    });
    f.appendChild(document.importNode(disegno, true));

    /* Il QR, al posto del portone: sotto il tetto curvo, fra le due
       torri, senza linee che lo tocchino. Porta al sito di
       orientamento. */
    var sito = comuni.campo("SCUOLA", "sito-orientamento");
    if (sito && !C.daCompletare(sito)) {
      var qr = document.createElement("div");
      qr.className = "fronte-qr";
      var codice = window.QR.svg(sito, { bordo: 2, titolo: "Codice QR del sito di orientamento" });
      if (codice) {
        /* Il codice in blu notte, sul suo riquadro bianco */
        qr.innerHTML = codice.replace('fill="#000000"', 'fill="#00193C"');
        f.appendChild(qr);
      } else {
        console.warn("comuni.txt: l'indirizzo sito-orientamento è troppo lungo per il codice QR");
      }
    } else {
      f.appendChild(elemento("p", "fronte-qr", "[DA COMPLETARE: sito-orientamento in comuni.txt]"));
    }

    /* Sotto, centrato: "IIS GIULIO NATTA · RIVOLI" (il maiuscolo lo
       mette cartolina.css) */
    var nome = comuni.campo("SCUOLA", "nome");
    var citta = comuni.campo("SCUOLA", "città");
    f.appendChild(elemento("p", "fronte-nome", nome + (citta ? " · " + citta : "")));
    return f;
  }


  /* ---------------------------------------------------------------
     IL RETRO, come una cartolina postale
     --------------------------------------------------------------- */

  function facciataRetro(home, comuni, cartolina) {
    var f = document.createElement("section");
    f.className = "facciata retro";
    f.setAttribute("aria-label", "Retro");
    var testo = function (nome) { return cartolina.campo("RETRO", nome); };

    /* A sinistra: l'invito, i tre indirizzi, il saluto e la firma */
    var sinistra = document.createElement("div");
    sinistra.className = "retro-sinistra";
    sinistra.appendChild(elemento("p", "retro-invito", testo("invito")));

    /* I tre indirizzi, nello stesso ordine della home: il trattino del
       loro colore, il tipo in grigio e sotto il nome */
    var elenco = document.createElement("ul");
    elenco.className = "retro-indirizzi";
    home.righe("INDIRIZZI").forEach(function (riga, i) {
      if (riga.length !== 8) {
        console.warn("home.txt, INDIRIZZI, riga " + (i + 1) + ": servono 8 colonne, ne ho trovate " + riga.length);
        return;
      }
      var li = document.createElement("li");
      li.className = "tono-" + riga[7].toLowerCase();
      li.appendChild(elemento("span", "retro-tipo", riga[1]));
      li.appendChild(elemento("span", "retro-nome", riga[0]));
      elenco.appendChild(li);
    });
    sinistra.appendChild(elenco);

    sinistra.appendChild(elemento("p", "retro-saluto", testo("saluto")));
    var firma = document.createElement("span");
    firma.className = "retro-firma";
    firma.setAttribute("role", "img");
    firma.setAttribute("aria-label", "Firma di Giulio Natta");
    firma.style.setProperty("--firma", "url(\"" + FILE_FIRMA + "\")");
    sinistra.appendChild(firma);
    f.appendChild(sinistra);

    /* Al centro il filetto verticale */
    var filetto = document.createElement("span");
    filetto.className = "retro-filetto";
    filetto.setAttribute("aria-hidden", "true");
    f.appendChild(filetto);

    /* A destra, in alto: le onde di annullo, il timbro e il francobollo.
       Tutti e tre solo decorativi. */
    f.appendChild(onde());
    var timbro = document.createElement("div");
    timbro.className = "retro-timbro";
    timbro.setAttribute("aria-hidden", "true");
    f.appendChild(G.timbro(home, comuni, timbro));
    f.appendChild(francobollo());

    /* A destra, sotto: il destinatario */
    var destinatario = document.createElement("div");
    destinatario.className = "retro-destinatario";
    destinatario.appendChild(elemento("p", "retro-etichetta", testo("destinatario")));
    destinatario.appendChild(elemento("p", "retro-riga", testo("riga-1")));
    destinatario.appendChild(elemento("p", "retro-riga", testo("riga-2")));
    destinatario.appendChild(elemento("p", "retro-riga retro-riga-vuota", ""));
    f.appendChild(destinatario);

    /* In basso, a tutta larghezza: il sottopancia con indirizzo,
       telefono ed email dell'orientamento, su una riga */
    var dati = ["indirizzo", "telefono", "email-orientamento"]
      .map(function (campo) { return comuni.campo("SCUOLA", campo); })
      .filter(function (valore) { return valore; });
    f.appendChild(elemento("p", "retro-sottopancia", dati.join(" · ")));
    return f;
  }

  /* Le onde di annullo: tre righe ondulate nei colori degli indirizzi,
     una sotto l'altra */
  function onde() {
    var svg = document.createElementNS(SVG, "svg");
    svg.setAttribute("class", "retro-onde");
    svg.setAttribute("viewBox", "0 0 170 70");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    ["meccanica", "grafica", "liceo"].forEach(function (colore, i) {
      var y = 15 + i * 20;
      var d = "M2 " + y;
      for (var x = 2; x < 168; x += 33) {
        d += " q 8.25 -9 16.5 0 t 16.5 0";
      }
      var onda = document.createElementNS(SVG, "path");
      onda.setAttribute("d", d);
      onda.setAttribute("class", "onda tono-" + colore);
      svg.appendChild(onda);
    });
    return svg;
  }

  /* Il francobollo: rettangolo verde con il bordo dentellato, una
     cornice tratteggiata bianca e, al centro, il logo in bianco
     (cartolina.css). Il disegno è in decimi di millimetro: 177 x 210. */
  function francobollo() {
    var f = document.createElement("div");
    f.className = "retro-francobollo";
    f.setAttribute("aria-hidden", "true");
    var svg = document.createElementNS(SVG, "svg");
    svg.setAttribute("viewBox", "0 0 177 210");
    svg.setAttribute("focusable", "false");
    function nuovo(tag, attributi) {
      var e = document.createElementNS(SVG, tag);
      Object.keys(attributi).forEach(function (k) { e.setAttribute(k, attributi[k]); });
      return e;
    }
    svg.appendChild(nuovo("rect", { x: 0, y: 0, width: 177, height: 210, "class": "francobollo-fondo" }));
    /* I dentini: cerchi bianchi lungo i quattro lati */
    var passo = 14.75, raggio = 4.2, x, y;
    for (x = 0; x <= 177.01; x += passo) {
      svg.appendChild(nuovo("circle", { cx: x.toFixed(2), cy: 0, r: raggio, "class": "francobollo-dente" }));
      svg.appendChild(nuovo("circle", { cx: x.toFixed(2), cy: 210, r: raggio, "class": "francobollo-dente" }));
    }
    for (y = 0; y <= 210.01; y += 210 / 14) {
      svg.appendChild(nuovo("circle", { cx: 0, cy: y.toFixed(2), r: raggio, "class": "francobollo-dente" }));
      svg.appendChild(nuovo("circle", { cx: 177, cy: y.toFixed(2), r: raggio, "class": "francobollo-dente" }));
    }
    svg.appendChild(nuovo("rect", { x: 14, y: 14, width: 149, height: 182, "class": "francobollo-cornice" }));
    f.appendChild(svg);
    var logo = document.createElement("span");
    logo.className = "francobollo-logo";
    f.appendChild(logo);
    return f;
  }
}());
