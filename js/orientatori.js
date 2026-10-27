/* ==================================================================
   LA PAGINA PER I DOCENTI ORIENTATORI (orientatori.html)

   Il titolo, l'anteprima della cartolina "Vieni a trovarci" che si
   gira e, sotto, i pulsanti "Scarica la cartolina in PDF ›" (con la
   riga "Versione non definitiva.") e "Gira la cartolina ›", poi il
   contatto "Scrivi all'orientamento". Le scritte arrivano dalla sezione
   ORIENTATORI di contenuti/comuni.txt; fronte e retro li disegna
   js/cartolina-facciate.js, lo stesso codice di cartolina.html, con
   home.txt, comuni.txt e cartolina.txt.

   La cartolina si gira toccandola con il mouse o con il dito, oppure
   con il pulsante, che è l'unico modo da tastiera: 180 gradi in
   orizzontale in 0,8 secondi (grafica.css), senza movimento per chi ha
   chiesto di ridurlo. Il lettore di schermo legge solo la faccia che
   si vede: del fronte una descrizione, del retro tutto il testo della
   cartolina. Dopo ogni giro una riga nascosta avvisa quale faccia si
   vede.

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
  var elemento = P.elemento;

  /* La cartolina rifilata è larga 150 mm: in pixel dello schermo */
  var LARGHEZZA_CARTOLINA = 150 * 96 / 25.4;

  /* Gli avvisi dopo il giro, letti da comuni.txt */
  var AVVISO = { fronte: "", retro: "" };

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
      var campo = function (nome) { return comuni.campo("ORIENTATORI", nome); };
      P.testata(comuni);
      G.piede(comuni, true);
      G.timbro(home, comuni);
      C.scrivi(document.getElementById("titolo"), campo("titolo"));
      AVVISO.fronte = campo("avviso-fronte");
      AVVISO.retro = campo("avviso-retro");

      /* Il fronte è un disegno: per il lettore di schermo una
         descrizione, il disegno resta nascosto */
      var fronte = K.fronte(comuni, file[3]);
      fronte.setAttribute("aria-hidden", "true");
      var facciaFronte = document.getElementById("faccia-fronte");
      facciaFronte.appendChild(elemento("p", "solo-lettori", campo("descrizione-fronte")));
      facciaFronte.appendChild(fronte);
      /* Il retro è fatto di testo vero: il lettore di schermo lo legge
         così com'è, quando si vede */
      document.getElementById("faccia-retro").appendChild(K.retro(home, comuni, cartolina));

      pulsanti(comuni);
      contatto(comuni);
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


  /* Il giro: la classe "girata" ruota la cartolina (grafica.css). La
     faccia che va dietro si nasconde al lettore di schermo, quella che
     viene davanti si mostra; poi l'avviso. */
  var annuncio = document.getElementById("cartolina-faccia");

  function giraCartolina() {
    var girata = gira.classList.toggle("girata");
    document.getElementById("faccia-fronte").setAttribute("aria-hidden", girata ? "true" : "false");
    document.getElementById("faccia-retro").setAttribute("aria-hidden", girata ? "false" : "true");
    annuncio.textContent = girata ? AVVISO.retro : AVVISO.fronte;
  }

  /* Con il mouse e con il dito la cartolina si gira toccandola */
  gira.addEventListener("click", giraCartolina);


  /* I due pulsanti sotto la cartolina */
  function pulsanti(comuni) {
    var campo = function (nome) { return comuni.campo("ORIENTATORI", nome); };

    var pulsanteGira = document.getElementById("pulsante-gira");
    C.scrivi(pulsanteGira, campo("pulsante-gira"));
    pulsanteGira.addEventListener("click", giraCartolina);

    /* Il PDF: si chiede al sito solo il primo byte, per sapere se il
       file c'è senza scaricarlo tutto. Pulsante e riga grigia sotto
       compaiono insieme. */
    var pdf = campo("pdf");
    if (!pdf || C.daCompletare(pdf)) { return; }
    var pulsantePdf = document.getElementById("pulsante-pdf");
    C.scrivi(pulsantePdf, campo("pulsante-pdf"));
    pulsantePdf.href = pdf;
    var nota = document.getElementById("nota-pdf");
    if (campo("nota-pdf")) {
      C.scrivi(nota, campo("nota-pdf"));
    } else {
      nota.hidden = true;
    }
    fetch(pdf, { cache: "no-cache", headers: { Range: "bytes=0-0" } })
      .then(function (risposta) {
        if (risposta.ok) { document.getElementById("scarica-pdf").hidden = false; }
      })
      .catch(function () { /* niente file, niente pulsante */ });
  }

  /* Il contatto dell'orientamento, come nei contatti della home: il
     link sottolineato, che apre la posta, e sotto l'indirizzo */
  function contatto(comuni) {
    var scritta = comuni.campo("ORIENTATORI", "contatto");
    var email = comuni.campo("SCUOLA", "email-orientamento");
    if (!scritta || !email || C.daCompletare(email)) { return; }
    var voce = elemento("li", "contatto", "");
    var azione = elemento("p", "contatto-azione", "");
    var a = elemento("a", "", scritta);
    a.href = "mailto:" + email;
    azione.appendChild(a);
    voce.appendChild(azione);
    voce.appendChild(P.scriviDato(elemento("p", "contatto-dato", ""), email));
    document.getElementById("contatto-orientatori").appendChild(voce);
  }
})();
