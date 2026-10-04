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
    biennio: "Biennio",
    triennio: "Triennio",
    totale: "Totale ore settimanali",
    anni: ["1°", "2°", "3°", "4°", "5°"],
    anniPerLettori: ["primo anno", "secondo anno", "terzo anno", "quarto anno", "quinto anno"],
    legenda: "In giallo le ore in più rispetto a Scienze applicate.",
    didascalia: "Ore settimanali, ",
    nessunaOra: "nessuna ora",
    oraInPiu: "ora in più",
    oreInPiu: "ore in più"
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
    C.scrivi(document.getElementById("torna"), liceo.campo("LICEO", "torna-home"));

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

    C.scrivi(document.getElementById("titolo"), liceo.campo("LICEO", "titolo"));
    C.scrivi(document.getElementById("sottotitolo"), liceo.campo("LICEO", "sottotitolo"));

    /* Le tre schede dei percorsi, nell'ordine del file. Ogni scheda è
       cliccabile per intero: il link sta sul nome e copre tutta la
       scheda (vedi stile.css). */
    var elenco = document.getElementById("percorsi");
    liceo.righe("PERCORSI").forEach(function (riga, i) {
      if (riga.length !== 3) {
        console.warn("liceo.txt, PERCORSI, riga " + (i + 1) + ": servono 3 colonne, ne ho trovate " + riga.length);
        return;
      }
      var voce = document.createElement("li");
      voce.className = "carta percorso";

      var titolo = document.createElement("h2");
      titolo.className = "percorso-nome";
      var link = elemento("a", "percorso-link", riga[0]);
      link.href = riga[2];
      titolo.appendChild(link);
      voce.appendChild(titolo);

      voce.appendChild(elemento("p", "percorso-testo", riga[1]));

      /* "Scopri il percorso" con la freccina, che non viene letta */
      var vai = elemento("p", "percorso-vai", liceo.campo("LICEO", "pulsante-percorso"));
      var freccia = elemento("span", "", " ›");
      freccia.setAttribute("aria-hidden", "true");
      vai.appendChild(freccia);
      voce.appendChild(vai);

      elenco.appendChild(voce);
    });
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

    C.scrivi(document.getElementById("torna"), liceo.campo("LICEO", "torna-liceo"));
    C.scrivi(document.getElementById("etichetta"), liceo.campo("LICEO", "titolo"));
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
     Il quadro base di Scienze applicate più, se ci sono, le ore
     aggiuntive del percorso: ogni riga delle ore aggiuntive diventa
     una riga nuova in fondo al quadro, prima del totale, anche se la
     materia c'è già nel quadro base (nel Liceo Matematico c'è così una
     seconda riga "Matematica" con le sole ore in più).
     Le ore in più sono in giallo, in grassetto e, per chi usa un
     lettore di schermo, dette a voce ("2 ore in più"). I totali li
     calcola il sito.
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

  /* Una cella con un testo da vedere e uno, diverso, da ascoltare */
  function cella(classe, visibile, perLettori) {
    var td = document.createElement("td");
    if (classe) { td.className = classe; }
    var vedi = document.createElement("span");
    vedi.setAttribute("aria-hidden", "true");
    vedi.textContent = visibile;
    td.appendChild(vedi);
    td.appendChild(elemento("span", "solo-lettori", perLettori));
    return td;
  }

  function inPiu(n) {
    return n + " " + (n === 1 ? TESTI.oraInPiu : TESTI.oreInPiu);
  }

  function quadroOrario(liceo, sezioneOre, nome) {
    /* Le materie del quadro base */
    var materie = [];
    liceo.righe("QUADRO BASE").forEach(function (r, i) {
      if (r.length !== 6) {
        console.warn("liceo.txt, QUADRO BASE, riga " + (i + 1) + ": servono 6 colonne, ne ho trovate " + r.length);
        return;
      }
      materie.push({ nome: r[0], base: r.slice(1), extra: null, nuova: false });
    });

    /* Le ore aggiuntive del percorso */
    var aggiunte = sezioneOre ? liceo.righe(sezioneOre) : [];
    aggiunte.forEach(function (r, i) {
      if (r.length !== 6) {
        console.warn("liceo.txt, " + sezioneOre + ", riga " + (i + 1) + ": servono 6 colonne, ne ho trovate " + r.length);
        return;
      }
      materie.push({ nome: r[0], base: null, extra: r.slice(1), nuova: true });
    });

    var tabella = document.getElementById("orario");
    tabella.appendChild(elemento("caption", "solo-lettori", TESTI.didascalia + nome));

    /* Le colonne, raggruppate: la materia, il biennio (primo e secondo
       anno), il triennio (dal terzo al quinto). Le larghezze stanno in
       stile.css. */
    [["orario-col-materia", 1], ["orario-col-biennio", 2], ["orario-col-triennio", 3]]
      .forEach(function (gruppo) {
        var colgroup = document.createElement("colgroup");
        colgroup.className = gruppo[0];
        for (var k = 0; k < gruppo[1]; k++) {
          colgroup.appendChild(document.createElement("col"));
        }
        tabella.appendChild(colgroup);
      });

    /* Le intestazioni, su due righe: sopra "Biennio" e "Triennio",
       sotto i cinque anni. "Materia" occupa tutte e due le righe. */
    var testa = document.createElement("thead");
    var rigaGruppi = document.createElement("tr");
    rigaGruppi.className = "orario-gruppi";
    var thMateria = elemento("th", "orario-materia", TESTI.materia);
    thMateria.scope = "col";
    thMateria.rowSpan = 2;
    rigaGruppi.appendChild(thMateria);
    [[TESTI.biennio, 2], [TESTI.triennio, 3]].forEach(function (gruppo) {
      var th = elemento("th", "", gruppo[0]);
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

    /* Una riga per materia */
    var totali = [0, 0, 0, 0, 0];
    var corpo = document.createElement("tbody");
    materie.forEach(function (m) {
      var tr = document.createElement("tr");
      if (m.nuova) { tr.className = "riga-in-piu"; }
      var th = elemento("th", "", m.nome);
      th.scope = "row";
      tr.appendChild(th);

      for (var j = 0; j < 5; j++) {
        var base = m.base ? ore(m.base[j], m.nome) : 0;
        var extra = m.extra ? ore(m.extra[j], m.nome) : 0;
        totali[j] += base + extra;

        if (extra > 0) {
          tr.appendChild(cella("in-piu", String(extra), inPiu(extra)));
        } else if (base > 0) {
          var td = document.createElement("td");
          td.textContent = base;
          tr.appendChild(td);
        } else {
          tr.appendChild(cella(m.nuova ? "in-piu" : "", "–", TESTI.nessunaOra));
        }
      }
      corpo.appendChild(tr);
    });
    tabella.appendChild(corpo);

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

    /* La legenda compare solo se ci sono ore in più */
    var legenda = document.getElementById("legenda");
    if (aggiunte.length) {
      var campione = elemento("span", "legenda-campione", "");
      campione.setAttribute("aria-hidden", "true");
      legenda.appendChild(campione);
      C.scrivi(legenda, TESTI.legenda);
    } else {
      legenda.hidden = true;
    }
  }
}());
