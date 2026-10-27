/* ==================================================================
   LE DUE FACCIATE DELLA CARTOLINA "VIENI A TROVARCI"

   Disegna fronte e retro della cartolina, 156 x 106 mm (la cartolina
   150 x 100 più 3 mm di abbondanza per lato). Lo usano:
     - cartolina.html, la pagina da stampare (js/cartolina.js);
     - orientatori.html, la pagina per i docenti orientatori
       (js/orientatori.js).
   Così la cartolina del sito e quella da stampare sono sempre uguali.
   L'aspetto sta in cartolina-facciate.css.

   - Fronte: la scuola disegnata dalle tre linee degli indirizzi
     (immagini/linee-scuola.svg), il codice QR al posto del portone,
     fra le due torri, e sotto "IIS GIULIO NATTA · RIVOLI".
   - Retro, come una cartolina postale: a sinistra l'invito, i tre
     indirizzi e la firma di Giulio Natta; a destra francobollo, onde
     di annullo, timbro e destinatario; in basso i contatti.

   I testi non stanno qui: arrivano da home.txt, comuni.txt e
   cartolina.txt.

   COME SI USA
       Cartolina.fronte(comuni, testoDelDisegno)  -> la facciata
       Cartolina.retro(home, comuni, cartolina)   -> la facciata
       Cartolina.FILE_DISEGNO                     -> il disegno da leggere

   Ha bisogno di js/contenuti.js, js/comuni.js, js/grafica.js (il
   timbro) e js/qr.js, che vanno caricati prima di questo.
   ================================================================== */

window.Cartolina = (function () {
  "use strict";

  var C = window.Contenuti;
  var P = window.Pezzi;
  var G = window.Grafica;
  var elemento = P.elemento;
  var SVG = "http://www.w3.org/2000/svg";

  /* Il disegno delle tre linee: lo stesso della home */
  var FILE_DISEGNO = "immagini/linee-scuola.svg?v=2";

  /* La firma di Giulio Natta: un'immagine blu notte su fondo bianco
     pieno, senza trasparenze. Se si cambia il file, si aumenta il
     numero ?v= qui sotto. */
  var FILE_FIRMA = "immagini/firma-natta.png?v=2";

  /* Sul fronte il disegno è largo quanto la facciata, 156 mm, cioè 640
     unità del disegno: un'unità è 156 / 640 mm. Con queste misure si
     mettono le linee a 0,4 mm e il QR fra le due torri. */
  var LARGHEZZA_FACCIATA = 156;           /* mm */
  var MM_PER_UNITA = LARGHEZZA_FACCIATA / 640;
  var SPESSORE_LINEE = 0.4;               /* mm */


  /* ---------------------------------------------------------------
     IL FRONTE: la scuola delle tre linee, il QR al posto del portone e
     il nome della scuola
     --------------------------------------------------------------- */

  function fronte(comuni, testoDisegno) {
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
       mette cartolina-facciate.css) */
    var nome = comuni.campo("SCUOLA", "nome");
    var citta = comuni.campo("SCUOLA", "città");
    f.appendChild(elemento("p", "fronte-nome", nome + (citta ? " · " + citta : "")));
    return f;
  }


  /* ---------------------------------------------------------------
     IL RETRO, come una cartolina postale
     --------------------------------------------------------------- */

  function retro(home, comuni, cartolina) {
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
      li.appendChild(elemento("span", "retro-nome", P.nomeIntero(riga[0])));
      elenco.appendChild(li);
    });
    sinistra.appendChild(elenco);

    sinistra.appendChild(elemento("p", "retro-saluto", testo("saluto")));
    var firma = document.createElement("img");
    firma.className = "retro-firma";
    firma.src = FILE_FIRMA;
    firma.alt = "firma di Giulio Natta";
    firma.width = 2000;
    firma.height = 534;
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
     (cartolina-facciate.css). Il disegno è in decimi di millimetro:
     177 x 210. */
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

  return { fronte: fronte, retro: retro, FILE_DISEGNO: FILE_DISEGNO };
}());
