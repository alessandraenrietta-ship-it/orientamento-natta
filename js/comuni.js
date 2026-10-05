/* ==================================================================
   I PEZZI COMUNI A TUTTE LE PAGINE

   La testata, il piede e i piccoli attrezzi che servono a più pagine:
   il quadratino con il simbolo, i link, i dati di contatto.
   I testi non stanno qui: si cambiano nei file di testo.

   Ha bisogno di js/contenuti.js, che va caricato prima di questo.
   ================================================================== */

window.Pezzi = (function () {
  "use strict";

  var C = window.Contenuti;
  var SVG = "http://www.w3.org/2000/svg";

  /* I disegni stanno in immagini/simboli.svg: se si cambia un disegno,
     si aumenta il numero ?v= qui sotto. */
  var FILE_SIMBOLI = "immagini/simboli.svg?v=5";

  /* Il quadratino colorato con un simbolo dentro. Il simbolo è solo
     decorativo: il nome è sempre scritto accanto. */
  function icona(simbolo, classe) {
    var riquadro = document.createElement("span");
    riquadro.className = "icona" + (classe ? " " + classe : "");
    riquadro.appendChild(segno(simbolo));
    return riquadro;
  }

  /* Un simbolo da solo, senza quadratino, che prende il colore del
     testo intorno. Solo decorativo. */
  function segno(simbolo, classe) {
    var svg = document.createElementNS(SVG, "svg");
    if (classe) { svg.setAttribute("class", classe); }
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

  /* Il telefono per la chiamata: solo cifre, con il prefisso
     dell'Italia davanti */
  function linkTelefono(numero) {
    return "tel:+39" + numero.replace(/\D/g, "");
  }

  /* Un indirizzo web si mostra senza "https://", che non serve leggere */
  function sitoDaMostrare(indirizzo) {
    return indirizzo.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }

  /* Scrive un dato. Negli indirizzi email il punto in cui si può andare
     a capo è subito dopo la chiocciola: sul telefono "orientamento@" /
     "itisgiulionatta.it", mai a metà parola. Il dato resta scritto per
     intero e si può selezionare e copiare. */
  function scriviDato(el, valore) {
    var chiocciola = valore.indexOf("@");
    if (chiocciola === -1 || C.daCompletare(valore)) {
      return C.scrivi(el, valore);
    }
    el.appendChild(document.createTextNode(valore.slice(0, chiocciola + 1)));
    el.appendChild(document.createElement("wbr"));
    el.appendChild(document.createTextNode(valore.slice(chiocciola + 1)));
    return el;
  }

  /* La testata: il nome della scuola accanto al logo */
  function testata(comuni) {
    C.scrivi(document.getElementById("nome-scuola"), comuni.campo("SCUOLA", "nome"));
  }

  /* Il piede: nome della scuola, indirizzo, telefono, email della
     segreteria e sito, presi da comuni.txt. Telefono, email e sito sono
     link. */
  function piede(comuni) {
    var elenco = document.getElementById("piede");
    function voce(contenuto) {
      var li = document.createElement("li");
      li.appendChild(contenuto);
      elenco.appendChild(li);
    }
    var campo = function (nome) { return comuni.campo("SCUOLA", nome); };

    if (campo("nome")) { voce(C.scrivi(document.createElement("span"), campo("nome"))); }
    if (campo("indirizzo")) { voce(C.scrivi(document.createElement("span"), campo("indirizzo"))); }
    if (campo("telefono")) { voce(collegamento(campo("telefono"), linkTelefono(campo("telefono")))); }
    if (campo("email")) {
      var email = collegamento("", "mailto:" + campo("email"));
      scriviDato(email, campo("email"));
      voce(email);
    }
    if (campo("sito")) { voce(collegamento(sitoDaMostrare(campo("sito")), campo("sito"))); }
  }

  return {
    icona: icona,
    segno: segno,
    elemento: elemento,
    collegamento: collegamento,
    linkTelefono: linkTelefono,
    sitoDaMostrare: sitoDaMostrare,
    scriviDato: scriviDato,
    testata: testata,
    piede: piede
  };
}());
