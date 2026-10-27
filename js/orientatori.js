/* ==================================================================
   LA PAGINA PER I DOCENTI ORIENTATORI (orientatori.html)

   Il titolo, l'anteprima della cartolina "Vieni a trovarci" che si
   gira e, sotto, i pulsanti "Scarica la cartolina in PDF ›" e "Gira
   la cartolina ›". Le scritte arrivano dalla sezione ORIENTATORI di
   contenuti/comuni.txt; fronte e retro li disegna
   js/cartolina-facciate.js, lo stesso codice di cartolina.html, con
   home.txt, comuni.txt e cartolina.txt.

   La cartolina si gira toccandola, con Invio o con la barra
   spaziatrice, oppure con il pulsante: 180 gradi in orizzontale in 0,8
   secondi (grafica.css), senza movimento per chi ha chiesto di
   ridurlo. Dopo ogni giro una riga nascosta annuncia al lettore di
   schermo quale faccia si vede.

   Il pulsante del PDF compare solo se il file indicato in comuni.txt
   esiste.

   Ha bisogno di js/contenuti.js, js/comuni.js, js/grafica.js, js/qr.js
   e js/cartolina-facciate.js, che vanno caricati prima di questo.
   ================================================================== */

(function () {
  "use strict";

  var C = window.Contenuti;
  var P = window.Pezzi;
  var G = window.Grafica;
  var K = window.Cartolina;

  /* TESTO MODIFICABILE: il nome della cartolina per il lettore di
     schermo e la riga nascosta che annuncia la faccia */
  var NOME_CARTOLINA = "Cartolina del Natta: tocca per girarla";
  var FACCIA = { fronte: "Fronte della cartolina", retro: "Retro della cartolina" };

  /* La cartolina rifilata è larga 150 mm: in pixel dello schermo */
  var LARGHEZZA_CARTOLINA = 150 * 96 / 25.4;

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
      var home = file[0], comuni = file[1], cartolina = file[2];
      P.testata(comuni);
      G.piede(comuni, true);
      G.timbro(home, comuni);
      C.scrivi(document.getElementById("titolo"), comuni.campo("ORIENTATORI", "titolo"));
      document.getElementById("faccia-fronte").appendChild(K.fronte(comuni, file[3]));
      document.getElementById("faccia-retro").appendChild(K.retro(home, comuni, cartolina));
      pulsanti(comuni);
      document.getElementById("contenuto").hidden = false;
      /* La misura si prende solo ora che la pagina si vede */
      adatta();
    })
    .catch(function (errore) {
      console.error(errore);
      document.getElementById("avviso").hidden = false;
    });


  /* Le facciate sono grandi come la cartolina vera: si rimpiccioliscono
     fino alla larghezza dell'anteprima, anche quando la finestra cambia */
  var gira = document.getElementById("cartolina-gira");

  function adatta() {
    gira.style.setProperty("--scala", gira.getBoundingClientRect().width / LARGHEZZA_CARTOLINA);
  }

  if (window.ResizeObserver) {
    new ResizeObserver(adatta).observe(gira);
  } else {
    window.addEventListener("resize", adatta);
  }


  /* Il giro: la classe "girata" ruota la cartolina (grafica.css) */
  var annuncio = document.getElementById("cartolina-faccia");

  function giraCartolina() {
    var girata = gira.classList.toggle("girata");
    annuncio.textContent = girata ? FACCIA.retro : FACCIA.fronte;
  }

  gira.setAttribute("aria-label", NOME_CARTOLINA);
  gira.addEventListener("click", giraCartolina);
  gira.addEventListener("keydown", function (evento) {
    if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      giraCartolina();
    }
  });


  /* I due pulsanti sotto la cartolina */
  function pulsanti(comuni) {
    var campo = function (nome) { return comuni.campo("ORIENTATORI", nome); };

    var pulsanteGira = document.getElementById("pulsante-gira");
    C.scrivi(pulsanteGira, campo("pulsante-gira"));
    pulsanteGira.addEventListener("click", giraCartolina);

    /* Il PDF: si chiede al sito solo il primo byte, per sapere se il
       file c'è senza scaricarlo tutto */
    var pdf = campo("pdf");
    var pulsantePdf = document.getElementById("pulsante-pdf");
    if (!pdf || C.daCompletare(pdf)) { return; }
    C.scrivi(pulsantePdf, campo("pulsante-pdf"));
    pulsantePdf.href = pdf;
    fetch(pdf, { cache: "no-cache", headers: { Range: "bytes=0-0" } })
      .then(function (risposta) {
        if (risposta.ok) { pulsantePdf.hidden = false; }
      })
      .catch(function () { /* niente file, niente pulsante */ });
  }
})();
