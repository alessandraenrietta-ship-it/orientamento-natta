/* ==================================================================
   LE PAGINE DEI DUE INDIRIZZI DEL LICEO TECNOLOGICO
   (meccanica.html, grafica.html) E DEI DUE CORSI SERALI
   (serale-meccanica.html, serale-grafica.html, con data-serale: vedi
   più sotto)

   Nel tag <body> l'attributo data-indirizzo dice quale file leggere:
   "meccanica" vuol dire contenuti/meccanica.txt. Legge anche
   contenuti/home.txt (nome dell'indirizzo e riga grigia sopra il nome,
   dalla tabella INDIRIZZI, cercando la riga con questa pagina) e
   contenuti/comuni.txt (testata, piede, date degli open day).
   I testi non stanno qui: si cambiano nei file di testo.

   L'impaginazione ricalca le pagine dei percorsi del liceo (vedi
   js/liceo.js e grafica.css): apertura centrata, poi tre parti con il
   titolo in verde ("Adatto a chi", "Imparerai a", "Dopo il diploma"),
   poi "Vieni a trovarci." con i foglietti delle date.

   Ha bisogno di js/contenuti.js, js/comuni.js e js/grafica.js, che
   vanno caricati prima di questo.
   ================================================================== */

(function () {
  "use strict";

  var C = window.Contenuti;
  var P = window.Pezzi;
  var G = window.Grafica;
  var elemento = P.elemento;

  var nomeFile = document.body.getAttribute("data-indirizzo");
  /* Le pagine dei due corsi serali (serale-meccanica.html,
     serale-grafica.html) hanno anche l'attributo data-serale: il nome del
     corso viene dalla tabella HOME di serali.txt e in fondo, al posto
     delle date degli open day, c'è il pulsante "Come iscriversi ›". */
  var serale = document.body.hasAttribute("data-serale");
  /* La pagina che si sta guardando, per esempio "meccanica.html": serve
     a trovare la sua riga nella tabella INDIRIZZI di home.txt (o, per i
     serali, nella tabella HOME di serali.txt) */
  var pagina = window.location.pathname.split("/").pop() || nomeFile + ".html";

  var letture = [
    C.leggi("contenuti/" + nomeFile + ".txt"),
    C.leggi("contenuti/comuni.txt"),
    C.leggi("contenuti/home.txt")
  ];
  if (serale) { letture.push(C.leggi("contenuti/serali.txt")); }

  Promise.all(letture)
    .then(function (file) {
      var testi = file[0], comuni = file[1], home = file[2], serali = file[3];
      P.testata(comuni);
      G.piede(comuni);
      G.timbro(home, comuni);
      apertura(testi, serale ? rigaSerale(serali) : rigaDiurno(home));
      blocchi(testi);
      if (document.getElementById("date-visita")) { visita(testi, comuni); }
      if (document.getElementById("iscrizione")) { iscrizione(serali); }
      document.getElementById("contenuto").hidden = false;
    })
    .catch(function (errore) {
      console.error(errore);
      document.getElementById("avviso").hidden = false;
    });


  /* Nome e riga grigia delle pagine del diurno: colonne "nome" e "tipo"
     ("Liceo tecnologico") della riga di home.txt che porta a questa
     pagina */
  function rigaDiurno(home) {
    var riga = home.righe("INDIRIZZI").filter(function (r) {
      return (r[5] || "").toLowerCase() === pagina.toLowerCase();
    })[0];
    if (!riga) {
      console.warn("home.txt, INDIRIZZI: non trovo la riga con la pagina " + pagina);
      return { nome: "", tipo: "" };
    }
    return { nome: riga[0], tipo: riga[1] };
  }

  /* Il nome delle pagine dei serali: prima colonna della riga della
     tabella HOME di serali.txt che porta a questa pagina. La riga grigia
     sta nel file della pagina (campo "occhiello"). */
  function rigaSerale(serali) {
    var riga = serali.righe("HOME").filter(function (r) {
      return (r[2] || "").toLowerCase() === pagina.toLowerCase();
    })[0];
    if (!riga) {
      console.warn("serali.txt, HOME: non trovo la riga con la pagina " + pagina);
      return { nome: "", tipo: "" };
    }
    return { nome: riga[0], tipo: "" };
  }

  /* L'apertura: la riga grigia (campo "occhiello" del file della pagina,
     se c'è, altrimenti il tipo di home.txt) e il nome; sotto, il
     paragrafo di apertura. */
  function apertura(testi, dati) {
    var etichetta = document.getElementById("etichetta");
    var occhiello = testi.campo("PAGINA", "occhiello") || dati.tipo;
    if (occhiello) { C.scrivi(etichetta, occhiello); } else { etichetta.hidden = true; }
    C.scrivi(document.getElementById("titolo"), dati.nome);

    /* Il paragrafo di apertura, su una colonna sola (scelta di
       Alessandra, 13 novembre 2026: niente due colonne): giustificato al
       computer, a sinistra sul telefono, come la spiegazione dei
       percorsi del liceo (grafica.css, .spiegazione). */
    var paragrafo = document.getElementById("spiegazione");
    if (testi.campo("PAGINA", "apertura")) {
      G.paroleIntere(C.scrivi(paragrafo, testi.campo("PAGINA", "apertura")));
    } else {
      paragrafo.hidden = true;
    }
  }

  /* Le tre parti, ognuna con il titolo in verde:
     - "Adatto a chi" e "Imparerai a": elenchi con il trattino grigio,
       una riga del file per voce;
     - "Dopo il diploma": due sottotitoli, "Potrai lavorare" (un
       paragrafo) e "Potrai continuare gli studi" (un elenco).
     Una parte senza testo non compare; se non ne compare nessuna,
     sparisce tutta la sezione. */
  function blocchi(testi) {
    var contenitore = document.getElementById("blocchi");
    var quante = 0;

    function voci(campo) {
      return testi.campi("PAGINA", campo).filter(function (t) { return t.trim() !== ""; });
    }
    function elenco(righe) {
      var ul = document.createElement("ul");
      ul.className = "blocco-elenco";
      righe.forEach(function (t) { ul.appendChild(C.scrivi(document.createElement("li"), t)); });
      return ul;
    }
    function nuovoBlocco(titolo) {
      quante++;
      var blocco = document.createElement("div");
      blocco.className = "blocco";
      blocco.appendChild(elemento("h2", "blocco-titolo", testi.campo("TITOLI", titolo)));
      return blocco;
    }

    [["titolo-adatto", "adatto"], ["titolo-imparerai", "imparerai"]].forEach(function (s) {
      var righe = voci(s[1]);
      if (!righe.length) { return; }
      var blocco = nuovoBlocco(s[0]);
      blocco.appendChild(elenco(righe));
      contenitore.appendChild(G.paroleIntere(blocco));
    });

    var lavorare = voci("lavorare"), studi = voci("studi");
    if (lavorare.length || studi.length) {
      var dopo = nuovoBlocco("titolo-dopo");
      if (lavorare.length) {
        dopo.appendChild(elemento("h3", "blocco-sottotitolo", testi.campo("TITOLI", "titolo-lavorare")));
        lavorare.forEach(function (t) { dopo.appendChild(C.scrivi(document.createElement("p"), t)); });
      }
      if (studi.length) {
        dopo.appendChild(elemento("h3", "blocco-sottotitolo", testi.campo("TITOLI", "titolo-studi")));
        dopo.appendChild(elenco(studi));
      }
      contenitore.appendChild(G.paroleIntere(dopo));
    }

    if (!quante) { contenitore.closest("section").hidden = true; }
  }

  /* Vieni a trovarci: il titolo da questo file; sotto i foglietti delle
     date e la nota sui turni da comuni.txt, con lo stesso componente
     della home e delle pagine del liceo (js/grafica.js). Se non resta
     nessuna data futura, solo la frase "nessuna-data". */
  function visita(testi, comuni) {
    C.scrivi(document.getElementById("titolo-visita"), testi.campo("TITOLI", "titolo-visita"));
    var date = document.getElementById("date-visita");
    var nota = document.getElementById("nota-visita");
    if (!G.listaDate(comuni, date)) {
      date.hidden = true;
      C.scrivi(nota, comuni.campo("OPEN DAY", "nessuna-data"));
    } else if (comuni.campo("OPEN DAY", "nota-turni")) {
      C.scrivi(nota, comuni.campo("OPEN DAY", "nota-turni"));
    } else {
      nota.hidden = true;
    }
  }

  /* In fondo alle pagine dei serali: il pulsante verso la pagina della
     scuola con la domanda di iscrizione, lo stesso della home (campi
     "pulsante" e "link" della sezione PAGINA di serali.txt). Si apre in
     una nuova scheda, e il lettore di schermo lo dice. Se manca uno dei
     due campi, la sezione non compare. */
  function iscrizione(serali) {
    var fondo = document.getElementById("iscrizione");
    var scritta = serali.campo("PAGINA", "pulsante");
    var link = serali.campo("PAGINA", "link");
    if (!scritta || !link || C.daCompletare(link)) {
      fondo.closest("section").hidden = true;
      return;
    }
    var a = elemento("a", "pulsante pulsante-vuoto", scritta);
    a.href = link;
    a.target = "_blank";
    a.rel = "noopener";
    /* TESTO MODIFICABILE */
    a.appendChild(elemento("span", "solo-lettori", " (si apre il sito della scuola in una nuova scheda)"));
    fondo.appendChild(a);
  }
}());
