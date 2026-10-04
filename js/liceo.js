/* ==================================================================
   LA PAGINA DEL LICEO E LE PAGINE DEI TRE PERCORSI

   Legge contenuti/liceo.txt e contenuti/comuni.txt (la pagina del
   liceo anche contenuti/home.txt, per il claim) e riempie la pagina.
   I testi non stanno qui: si cambiano nei file di testo.

   Le pagine dei percorsi sono uguali fra loro. Nel tag <body> due
   attributi dicono quale percorso mostrare:
     data-percorso   la sezione di liceo.txt con i testi del percorso,
                     per esempio "LICEO MATEMATICO"
     data-ore        la sezione con le ore in più rispetto al quadro
                     base, per esempio "ORE AGGIUNTIVE MATEMATICO";
                     manca per Scienze applicate
   La pagina del liceo non ha data-percorso.

   Ha bisogno di js/contenuti.js e js/comuni.js, che vanno caricati
   prima di questo.
   ================================================================== */

(function () {
  "use strict";

  var C = window.Contenuti;
  var P = window.Pezzi;
  var elemento = P.elemento;

  /* TESTO MODIFICABILE: le scritte fisse delle pagine dei percorsi */
  var TESTI = {
    quadro: "Quadro orario",
    laboratori: "Laboratori e progetti",
    dopo: "Dopo il diploma",
    materia: "Materia",
    /* i gruppi di anni sopra le colonne: scritta e numero di colonne */
    gruppi: [["Primo biennio", 2], ["Secondo biennio", 2], ["Quinto anno", 1]],
    inPiuNel: "In più nel",
    totale: "Totale",
    anni: ["1°", "2°", "3°", "4°", "5°"],
    anniPerLettori: ["primo anno", "secondo anno", "terzo anno", "quarto anno", "quinto anno"],
    didascalia: "Ore settimanali, ",
    nessunaOra: "nessuna ora"
  };

  var percorso = document.body.getAttribute("data-percorso");

  var daLeggere = [C.leggi("contenuti/liceo.txt"), C.leggi("contenuti/comuni.txt")];
  if (!percorso) { daLeggere.push(C.leggi("contenuti/home.txt")); }

  Promise.all(daLeggere)
    .then(function (file) {
      P.testata(file[1]);
      P.piede(file[1]);
      if (percorso) {
        paginaPercorso(file[0], percorso, document.body.getAttribute("data-ore"));
      } else {
        paginaLiceo(file[0], file[2]);
      }
      document.getElementById("contenuto").hidden = false;
    })
    .catch(function (errore) {
      console.error(errore);
      document.getElementById("avviso").hidden = false;
    });


  /* ---------------------------------------------------------------
     LA PAGINA DEL LICEO
     --------------------------------------------------------------- */

  function paginaLiceo(liceo, home) {
    tornaIndietro(liceo.campo("LICEO", "torna-home"));

    /* Il quadratino blu con la lampadina, come nella scheda della home */
    document.getElementById("simbolo").appendChild(P.icona("lampadina", "icona-liceo"));

    /* Il claim è quello della scheda del liceo nella home: la riga della
       tabella INDIRIZZI di home.txt con il colore "liceo" */
    var claim = document.getElementById("claim");
    var rigaLiceo = home.righe("INDIRIZZI").filter(function (riga) {
      return (riga[7] || "").toLowerCase() === "liceo";
    })[0];
    if (rigaLiceo && rigaLiceo[2]) {
      C.scrivi(claim, rigaLiceo[2]);
    } else {
      claim.hidden = true;
    }

    /* Il titolo su due righe, in un solo h1: "titolo" sopra e, più
       piccola, "titolo-riga-2". Fra le due una virgola che si sente ma
       non si vede: il lettore di schermo legge "Liceo scientifico,
       opzione Scienze applicate". */
    var h1 = document.getElementById("titolo");
    C.scrivi(h1, liceo.campo("LICEO", "titolo"));
    if (liceo.campo("LICEO", "titolo-riga-2")) {
      h1.appendChild(elemento("span", "solo-lettori", ", "));
      h1.appendChild(elemento("span", "titolo-riga-2", liceo.campo("LICEO", "titolo-riga-2")));
    }
    C.scrivi(document.getElementById("sottotitolo"), liceo.campo("LICEO", "sottotitolo"));

    /* Le tre schede dei percorsi, nell'ordine del file. Ognuna ha una
       parte alta colorata con il nome e, sotto, la parte bianca con la
       spiegazione e la pillola "Scopri il percorso".
       - Il colore della parte alta segue il percorso, non la posizione:
         la classe viene dal nome del file della pagina
         (liceo-matematico.html dà "tono-liceo-matematico").
       - La scheda è cliccabile per intero con un solo link, sul nome,
         che copre tutta la scheda (vedi stile.css). La pillola è solo
         un disegno: il lettore di schermo sente solo il nome. */
    var elenco = document.getElementById("percorsi");
    liceo.righe("PERCORSI").forEach(function (riga, i) {
      if (riga.length !== 3) {
        console.warn("liceo.txt, PERCORSI, riga " + (i + 1) + ": servono 3 colonne, ne ho trovate " + riga.length);
        return;
      }
      var voce = document.createElement("li");
      voce.className = "carta percorso tono-" + riga[2].replace(/\.html$/, "");

      var testa = document.createElement("div");
      testa.className = "percorso-testa";
      var titolo = document.createElement("h2");
      titolo.className = "percorso-nome";
      var link = elemento("a", "percorso-link", riga[0]);
      link.href = riga[2];
      titolo.appendChild(link);
      testa.appendChild(titolo);
      var filetto = elemento("span", "percorso-filetto", "");
      filetto.setAttribute("aria-hidden", "true");
      testa.appendChild(filetto);
      voce.appendChild(testa);

      var corpo = document.createElement("div");
      corpo.className = "percorso-corpo";
      corpo.appendChild(elemento("p", "percorso-testo", riga[1]));
      var vai = elemento("p", "percorso-vai", liceo.campo("LICEO", "pulsante-percorso") + " ›");
      vai.setAttribute("aria-hidden", "true");
      corpo.appendChild(vai);
      voce.appendChild(corpo);

      elenco.appendChild(voce);
    });
  }

  /* Il nome completo del liceo, su una riga: "Liceo scientifico,
     opzione Scienze applicate" */
  function titoloCompleto(liceo) {
    var riga2 = liceo.campo("LICEO", "titolo-riga-2");
    return liceo.campo("LICEO", "titolo") + (riga2 ? ", " + riga2 : "");
  }

  /* Il collegamento in alto a sinistra ("‹ Torna alla home", "‹ Torna
     al liceo") compare solo se in liceo.txt c'è la sua scritta. Per
     nasconderlo si mette un # davanti alla riga; per farlo ricomparire
     lo si toglie. */
  function tornaIndietro(testo) {
    var scritta = document.getElementById("torna");
    if (!testo) {
      scritta.closest(".torna").hidden = true;
      return;
    }
    C.scrivi(scritta, testo);
  }


  /* ---------------------------------------------------------------
     LE PAGINE DEI PERCORSI
     --------------------------------------------------------------- */

  function paginaPercorso(liceo, sezione, sezioneOre) {
    var riga = liceo.righe("PERCORSI").filter(function (r) {
      return (r[0] || "").toUpperCase() === sezione.toUpperCase();
    })[0];
    if (!riga) {
      console.warn("liceo.txt: nella tabella PERCORSI non trovo " + sezione);
      riga = [sezione];
    }
    var nome = riga[0];

    /* Il tono del percorso (per la riga-titolo "In più nel ..." del
       quadro orario), dal nome del file della pagina, come nelle schede
       di liceo.html */
    if (riga[2]) { document.body.classList.add("tono-" + riga[2].replace(/\.html$/, "")); }

    tornaIndietro(liceo.campo("LICEO", "torna-liceo"));
    C.scrivi(document.getElementById("etichetta"), titoloCompleto(liceo));
    C.scrivi(document.getElementById("titolo"), nome);
    C.scrivi(document.getElementById("spiegazione"), liceo.campo(sezione, "spiegazione"));

    C.scrivi(document.getElementById("titolo-quadro"), TESTI.quadro);
    quadroOrario(liceo, sezioneOre, nome);

    fasciaFacoltativa("laboratori", TESTI.laboratori, liceo.campo(sezione, "laboratori"));
    fasciaFacoltativa("dopo-il-diploma", TESTI.dopo, liceo.campo(sezione, "dopo-il-diploma"));
  }

  /* Le fasce "Laboratori e progetti" e "Dopo il diploma" compaiono solo
     se in liceo.txt c'è il loro campo. Per nasconderle si mette un #
     davanti alla riga; per farle ricomparire lo si toglie. */
  function fasciaFacoltativa(id, titolo, testo) {
    var paragrafo = document.getElementById(id);
    var fascia = paragrafo.closest("section");
    if (!testo) {
      fascia.hidden = true;
      return;
    }
    C.scrivi(fascia.querySelector("h2"), titolo);
    C.scrivi(paragrafo, testo);
  }


  /* ---------------------------------------------------------------
     IL QUADRO ORARIO
     Le materie di Scienze applicate (QUADRO BASE) subito sotto le
     intestazioni. Nel Liceo Matematico e nel Liceo Digitale seguono le
     ore aggiuntive del percorso, in una seconda parte della tabella che
     si apre con la riga-titolo "In più nel ..." nel tono del percorso
     (nel Matematico c'è così una seconda riga "Matematica" con le sole
     ore in più). In fondo il totale, calcolato dal sito.
     Le colonne degli anni sono raggruppate: primo biennio (1° e 2°),
     secondo biennio (3° e 4°), quinto anno.
     --------------------------------------------------------------- */

  /* Le ore di una cella: il trattino (o una cella vuota) vale zero */
  function ore(valore, dove) {
    if (valore === undefined || valore === "" || valore === "-") { return 0; }
    var numero = Number(valore);
    if (isNaN(numero)) {
      console.warn("liceo.txt, " + dove + ": \"" + valore + "\" non è un numero, lo conto come zero");
      return 0;
    }
    return numero;
  }

  /* Le righe di una tabella di liceo.txt, controllate: sei colonne */
  function righeOre(liceo, sezione) {
    return liceo.righe(sezione).filter(function (r, i) {
      if (r.length !== 6) {
        console.warn("liceo.txt, " + sezione + ", riga " + (i + 1) + ": servono 6 colonne, ne ho trovate " + r.length);
        return false;
      }
      return true;
    });
  }

  /* Una riga della tabella: la materia e le ore dei cinque anni, che
     si aggiungono ai totali. Il trattino si vede grigio; il lettore di
     schermo sente "nessuna ora". */
  function rigaMateria(r, totali) {
    var tr = document.createElement("tr");
    var th = elemento("th", "", r[0]);
    th.scope = "row";
    tr.appendChild(th);
    for (var j = 0; j < 5; j++) {
      var n = ore(r[j + 1], r[0]);
      totali[j] += n;
      var td = document.createElement("td");
      if (n > 0) {
        td.textContent = n;
      } else {
        td.className = "orario-nessuna";
        var vedi = elemento("span", "", "–");
        vedi.setAttribute("aria-hidden", "true");
        td.appendChild(vedi);
        td.appendChild(elemento("span", "solo-lettori", TESTI.nessunaOra));
      }
      tr.appendChild(td);
    }
    return tr;
  }

  function quadroOrario(liceo, sezioneOre, nome) {
    var tabella = document.getElementById("orario");
    tabella.appendChild(elemento("caption", "solo-lettori", TESTI.didascalia + nome));

    /* Le colonne: la materia, poi i cinque anni. I primi quattro sono
       larghi uguali; il quinto è un po' più largo, perché sopra c'è
       "Quinto anno" da solo (le larghezze stanno in stile.css). */
    var colonne = document.createElement("colgroup");
    var colMateria = document.createElement("col");
    colMateria.className = "orario-col-materia";
    colonne.appendChild(colMateria);
    for (var k = 0; k < 5; k++) {
      var col = document.createElement("col");
      col.className = "orario-col-anno" + (k === 4 ? " orario-col-quinto" : "");
      colonne.appendChild(col);
    }
    tabella.appendChild(colonne);

    /* Le intestazioni, su due righe: sopra i gruppi (Primo biennio,
       Secondo biennio, Quinto anno), sotto i cinque anni. "Materia"
       occupa tutte e due le righe. */
    var testa = document.createElement("thead");
    var rigaGruppi = document.createElement("tr");
    rigaGruppi.className = "orario-gruppi";
    var thMateria = elemento("th", "orario-materia", TESTI.materia);
    thMateria.scope = "col";
    thMateria.rowSpan = 2;
    rigaGruppi.appendChild(thMateria);
    /* Ogni gruppo sempre su due righe, a capo dopo la prima parola
       ("Primo / biennio", "Quinto / anno"), così sono tutti uguali:
       "Quinto anno" su una riga sola non entra nella sua colonna. */
    TESTI.gruppi.forEach(function (gruppo) {
      var th = document.createElement("th");
      var spazio = gruppo[0].indexOf(" ");
      if (spazio === -1) {
        C.scrivi(th, gruppo[0]);
      } else {
        /* lo spazio prima dell'a capo non si vede, ma tiene separate le
           due parole per chi legge il testo ("Primo biennio") */
        C.scrivi(th, gruppo[0].slice(0, spazio + 1));
        th.appendChild(document.createElement("br"));
        C.scrivi(th, gruppo[0].slice(spazio + 1));
      }
      th.scope = "colgroup";
      th.colSpan = gruppo[1];
      rigaGruppi.appendChild(th);
    });
    testa.appendChild(rigaGruppi);

    var rigaAnni = document.createElement("tr");
    rigaAnni.className = "orario-anni";
    TESTI.anni.forEach(function (anno, j) {
      var th = document.createElement("th");
      th.scope = "col";
      var vedi = elemento("span", "", anno);
      vedi.setAttribute("aria-hidden", "true");
      th.appendChild(vedi);
      th.appendChild(elemento("span", "solo-lettori", TESTI.anniPerLettori[j]));
      rigaAnni.appendChild(th);
    });
    testa.appendChild(rigaAnni);
    tabella.appendChild(testa);

    /* Le materie del quadro base */
    var totali = [0, 0, 0, 0, 0];
    var base = document.createElement("tbody");
    righeOre(liceo, "QUADRO BASE").forEach(function (r) {
      base.appendChild(rigaMateria(r, totali));
    });
    tabella.appendChild(base);

    /* Le ore in più del percorso, se ci sono: una seconda parte della
       tabella che si apre con la riga-titolo "In più nel ...". Per il
       lettore di schermo la riga-titolo è l'intestazione delle righe
       che la seguono. */
    var aggiunte = sezioneOre ? righeOre(liceo, sezioneOre) : [];
    if (aggiunte.length) {
      var inPiu = document.createElement("tbody");
      inPiu.className = "orario-in-piu";
      var rigaTitolo = document.createElement("tr");
      var thTitolo = elemento("th", "orario-titolo-in-piu", TESTI.inPiuNel + " " + nome);
      thTitolo.scope = "rowgroup";
      thTitolo.colSpan = 6;
      rigaTitolo.appendChild(thTitolo);
      inPiu.appendChild(rigaTitolo);
      aggiunte.forEach(function (r) {
        inPiu.appendChild(rigaMateria(r, totali));
      });
      tabella.appendChild(inPiu);
    }

    /* In fondo, i totali calcolati */
    var piede = document.createElement("tfoot");
    var rigaTotale = document.createElement("tr");
    var thTotale = elemento("th", "", TESTI.totale);
    thTotale.scope = "row";
    rigaTotale.appendChild(thTotale);
    totali.forEach(function (t) {
      var td = document.createElement("td");
      td.textContent = t;
      rigaTotale.appendChild(td);
    });
    piede.appendChild(rigaTotale);
    tabella.appendChild(piede);
  }
}());
