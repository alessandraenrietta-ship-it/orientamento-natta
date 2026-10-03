/* ==================================================================
   TEMA CHIARO E TEMA SCURO

   Copiato dal sito Liceo Digitale, con due differenze:
   - il nome con cui il browser ricorda la scelta è diverso, perché i
     due siti stanno allo stesso indirizzo di base e altrimenti la
     scelta fatta su uno passerebbe all'altro;
   - sull'interruttore non c'è la luna, che in questo sito è il
     simbolo dei serali, ma un cerchio metà pieno e metà vuoto.

   Il sito si apre sempre chiaro. Chi preferisce lo scuro lo accende
   con l'interruttore, e da quel momento tutte le pagine del sito si
   aprono scure su quel computer.

   COME FUNZIONA
   Questo file scrive una parola sopra la pagina (data-tema="scuro").
   I colori veri stanno in stile.css: lì c'è un elenco di colori per il
   chiaro e uno per lo scuro. Qui non c'è nessun colore.

   COME SI USA IN UNA PAGINA NUOVA
   Nella testa della pagina, PRIMA del foglio di stile:

       <script src="js/tema.js?v=1"></script>

   Va messo lì e non in fondo: così la pagina nasce già del colore
   giusto e non si vede il lampo bianco prima del cambio.

   Per far comparire l'interruttore si mette un contenitore vuoto:

       <div id="interruttore-tema"></div>

   e in fondo alla pagina:

       <script>Tema.interruttore('interruttore-tema');</script>

   COSA VIENE SALVATO
   Soltanto la parola "chiaro" o "scuro", nel browser di chi sceglie.
   Nessun dato personale, niente che esca dal computer.
   ================================================================== */

window.Tema = (function () {
  "use strict";

  var NOME = "orientamento-natta-tema";
  var CHIARO = "chiaro";
  var SCURO = "scuro";
  var SVG = "http://www.w3.org/2000/svg";

  function leggi() {
    try {
      return localStorage.getItem(NOME) === SCURO ? SCURO : CHIARO;
    } catch (e) {
      /* In navigazione anonima non si può salvare niente: pazienza,
         la pagina resta chiara. */
      return CHIARO;
    }
  }

  function salva(quale) {
    try {
      localStorage.setItem(NOME, quale);
    } catch (e) {
      /* niente da fare */
    }
  }

  function applica(quale) {
    document.documentElement.setAttribute("data-tema", quale);
  }

  /* Si applica subito, appena il file viene letto: la pagina non è
     ancora comparsa sullo schermo e non si vede nessun cambio. */
  applica(leggi());

  /* Il disegno dell'interruttore: un cerchio con la metà destra
     piena. È lo stesso nei due temi; cambia la frase che lo spiega. */
  function disegno() {
    var svg = document.createElementNS(SVG, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    var cerchio = document.createElementNS(SVG, "circle");
    cerchio.setAttribute("cx", "12");
    cerchio.setAttribute("cy", "12");
    cerchio.setAttribute("r", "9");
    cerchio.setAttribute("fill", "none");
    cerchio.setAttribute("stroke", "currentColor");
    cerchio.setAttribute("stroke-width", "2");

    var meta = document.createElementNS(SVG, "path");
    meta.setAttribute("d", "M12 3A9 9 0 0 1 12 21Z");
    meta.setAttribute("fill", "currentColor");

    svg.appendChild(cerchio);
    svg.appendChild(meta);
    return svg;
  }

  function interruttore(dove) {
    var contenitore = document.getElementById(dove);
    if (!contenitore) { return; }

    var bottone = document.createElement("button");
    bottone.type = "button";
    bottone.className = "interruttore-tema";
    bottone.appendChild(disegno());
    contenitore.appendChild(bottone);

    function aggiorna() {
      var scuro = leggi() === SCURO;
      /* Sull'interruttore c'è solo il disegno. La frase per esteso
         resta nel suggerimento che compare passandoci sopra, e la
         leggono anche i lettori di schermo: senza, chi non vede il
         disegno non saprebbe che cos'è. */
      var frase = scuro ? "Passa ai colori chiari" : "Passa ai colori scuri";
      bottone.title = frase;
      bottone.setAttribute("aria-label", frase);
    }

    bottone.addEventListener("click", function () {
      var nuovo = leggi() === SCURO ? CHIARO : SCURO;
      salva(nuovo);
      applica(nuovo);
      aggiorna();
    });

    aggiorna();
  }

  return { applica: applica, leggi: leggi, interruttore: interruttore };
}());
