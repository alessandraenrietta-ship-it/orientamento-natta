/* ==================================================================
   LA PAGINA DEL LICEO E LE PAGINE DEI TRE PERCORSI

   Legge contenuti/liceo.txt, contenuti/comuni.txt e contenuti/home.txt
   (il claim del liceo e la parola del timbro) e riempie la pagina.
   I testi non stanno qui: si cambiano nei file di testo.

   Le pagine dei percorsi sono uguali fra loro. Nel tag <body>
   l'attributo data-percorso dice quale percorso mostrare: il nome della
   sezione di liceo.txt con i suoi testi, per esempio "LICEO
   MATEMATICO". Le ore in più del percorso si trovano nella tabella
   PERCORSI di liceo.txt (colonna "ore in più").
   La pagina del liceo non ha data-percorso.

   Grafica "a cartolina", come la home (vedi grafica.css): fondo
   bianco, un trattino nel tono del percorso accanto al nome, niente
   simboli.

   Ha bisogno di js/contenuti.js, js/comuni.js e js/grafica.js (disegno,
   piede, timbro, date degli open day), che vanno caricati prima di
   questo.
   ================================================================== */

(function () {
  "use strict";

  var C = window.Contenuti;
  var P = window.Pezzi;
  var G = window.Grafica;
  var elemento = P.elemento;

  /* TESTO MODIFICABILE: le scritte fisse delle tabelle delle ore */
  var TESTI = {
    quadro: "Quadro orario",
    materia: "Materia",
    /* i gruppi di anni sopra le colonne: scritta e numero di colonne */
    gruppi: [["Primo biennio", 2], ["Secondo biennio", 2], ["Quinto anno", 1]],
    inPiuNel: "In più nel",
    totale: "Totale",
    anni: ["1°", "2°", "3°", "4°", "5°"],
    anniPerLettori: ["primo anno", "secondo anno", "terzo anno", "quarto anno", "quinto anno"],
    didascalia: "Ore settimanali, ",
    didascaliaConfronto: "Ore settimanali dei tre percorsi, anno per anno",
    didascaliaDifferenze: "Ore in più alla settimana rispetto a Scienze applicate",
    nessunaOra: "nessuna ora",
    nessunaOraInPiu: "nessuna ora in più",
    inPiu: "+"
  };

  var percorso = document.body.getAttribute("data-percorso");

  Promise.all([
    C.leggi("contenuti/liceo.txt"),
    C.leggi("contenuti/comuni.txt"),
    C.leggi("contenuti/home.txt")
  ])
    .then(function (file) {
      var liceo = file[0], comuni = file[1], home = file[2];
      P.testata(comuni);
      G.piede(comuni);
      G.timbro(home, comuni);
      if (percorso) {
        paginaPercorso(liceo, percorso);
      } else {
        paginaLiceo(liceo, home);
      }
      visita(liceo, comuni, percorso);
      document.getElementById("contenuto").hidden = false;
      if (!percorso) { G.disegno(document.getElementById("disegno")); }
    })
    .catch(function (errore) {
      console.error(errore);
      document.getElementById("avviso").hidden = false;
    });


  /* I tre percorsi della tabella PERCORSI di liceo.txt, controllati.
     Quattro colonne: nome | spiegazione breve | pagina | ore in più.
     Il tono (il blu del percorso) viene dal nome del file della pagina:
     liceo-matematico.html dà "tono-liceo-matematico". */
  function elencoPercorsi(liceo) {
    var elenco = [];
    liceo.righe("PERCORSI").forEach(function (riga, i) {
      if (riga.length !== 4) {
        console.warn("liceo.txt, PERCORSI, riga " + (i + 1) + ": servono 4 colonne, ne ho trovate " + riga.length);
        return;
      }
      elenco.push({
        nome: riga[0], testo: riga[1], pagina: riga[2], ore: riga[3],
        tono: "tono-" + riga[2].replace(/\.html$/, "")
      });
    });
    return elenco;
  }

  /* Il trattino nel tono del percorso, prima del nome. Solo decorativo. */
  function trattino() {
    var t = elemento("span", "trattino", "");
    t.setAttribute("aria-hidden", "true");
    return t;
  }


  /* ---------------------------------------------------------------
     LA PAGINA DEL LICEO
     Apertura (titolo, claim, disegno), poi i percorsi con il
     sottotitolo sopra, poi "Le ore a confronto".
     --------------------------------------------------------------- */

  function paginaLiceo(liceo, home) {
    tornaIndietro(liceo.campo("LICEO", "torna-home"));

    /* Il claim, sotto il titolo, è quello del liceo nella home: la riga
       della tabella INDIRIZZI di home.txt con il colore "liceo" */
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
       non si vede, attaccata alla prima parte (grafica.css,
       .solo-lettori-in-riga): il lettore di schermo legge "Liceo
       scientifico, opzione Scienze applicate". */
    var h1 = document.getElementById("titolo");
    C.scrivi(h1, liceo.campo("LICEO", "titolo"));
    if (liceo.campo("LICEO", "titolo-riga-2")) {
      h1.appendChild(elemento("span", "solo-lettori-in-riga", ","));
      h1.appendChild(elemento("span", "titolo-riga-2", liceo.campo("LICEO", "titolo-riga-2")));
    }

    /* La sezione dei percorsi: il titolo (di livello 2, visibile solo
       ai lettori di schermo) e il sottotitolo */
    C.scrivi(document.getElementById("titolo-percorsi"), liceo.campo("LICEO", "titolo-percorsi"));
    C.scrivi(document.getElementById("sottotitolo"), liceo.campo("LICEO", "sottotitolo"));

    /* I tre percorsi, nell'ordine del file, come gli indirizzi della
       home: il trattino nel tono del percorso accanto al nome, sotto la
       spiegazione breve e il pulsante "Scopri il percorso ›".
       - Ogni percorso è cliccabile per intero con un solo link, sul
         nome, che copre tutto il percorso (vedi grafica.css). Il
         pulsante è solo un disegno: il lettore di schermo sente solo il
         nome.
       - Ogni percorso ha sempre gli stessi tre pezzi (nome, spiegazione,
         pulsante): al computer grafica.css li mette su righe comuni alle
         tre colonne. */
    var elenco = document.getElementById("percorsi");
    elencoPercorsi(liceo).forEach(function (p) {
      var voce = document.createElement("li");
      voce.className = "percorso con-trattino " + p.tono;

      /* Il nome è un titolo di livello 3, come gli indirizzi della home */
      var titolo = document.createElement("h3");
      titolo.className = "percorso-nome";
      var link = elemento("a", "percorso-link", p.nome);
      link.href = p.pagina;
      titolo.appendChild(link);
      voce.appendChild(titolo);

      voce.appendChild(G.paroleIntere(elemento("p", "percorso-testo", p.testo)));

      var fondo = document.createElement("p");
      fondo.className = "percorso-fondo";
      fondo.setAttribute("aria-hidden", "true");
      fondo.appendChild(elemento("span", "pulsante pulsante-vuoto", liceo.campo("LICEO", "pulsante-percorso")));
      voce.appendChild(fondo);

      elenco.appendChild(voce);
    });

    confronto(liceo);
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
     LE ORE A CONFRONTO (liceo.html, id="confronto")
     Una tabella nello stile del quadro orario, con una riga per
     percorso e le ore totali alla settimana anno per anno, calcolate
     dal sito: QUADRO BASE più le ore in più del percorso. Sotto, il
     pulsante "Che cosa cambia ›" (details/summary: si apre e si chiude
     senza JavaScript) con le ore in più rispetto a Scienze applicate.
     --------------------------------------------------------------- */

  function confronto(liceo) {
    C.scrivi(document.getElementById("titolo-confronto"), liceo.campo("LICEO", "titolo-confronto"));
    C.scrivi(document.getElementById("nota-confronto"), liceo.campo("LICEO", "nota-confronto"));

    var percorsi = elencoPercorsi(liceo);

    /* La tabella dei totali */
    var tabella = document.getElementById("tabella-confronto");
    tabella.appendChild(elemento("caption", "solo-lettori", TESTI.didascaliaConfronto));
    intestazione(tabella, liceo.campo("LICEO", "intestazione-percorso"));
    var corpo = document.createElement("tbody");
    percorsi.forEach(function (p) {
      var tr = document.createElement("tr");
      tr.className = p.tono;
      var th = document.createElement("th");
      th.scope = "row";
      th.className = "orario-percorso";
      th.appendChild(trattino());
      C.scrivi(th, p.nome);
      tr.appendChild(th);
      totaliPercorso(liceo, p.ore).forEach(function (t) {
        var td = document.createElement("td");
        td.textContent = t;
        tr.appendChild(td);
      });
      corpo.appendChild(tr);
    });
    tabella.appendChild(corpo);

    /* "Che cosa cambia": le ore in più di ogni percorso che ne ha */
    C.scrivi(document.getElementById("pulsante-differenze"), liceo.campo("LICEO", "pulsante-differenze"));
    C.scrivi(document.getElementById("nota-differenze"), liceo.campo("LICEO", "nota-differenze"));
    var dettaglio = document.getElementById("tabella-differenze");
    dettaglio.appendChild(elemento("caption", "solo-lettori", TESTI.didascaliaDifferenze));
    intestazione(dettaglio, TESTI.materia);
    var quanti = 0;
    percorsi.forEach(function (p) {
      var righe = p.ore ? righeOre(liceo, p.ore) : [];
      if (!righe.length) { return; }
      quanti++;
      var gruppo = document.createElement("tbody");
      gruppo.className = "orario-in-piu " + p.tono;
      var rigaTitolo = document.createElement("tr");
      var thTitolo = elemento("th", "orario-titolo-in-piu", p.nome);
      thTitolo.scope = "rowgroup";
      thTitolo.colSpan = 6;
      rigaTitolo.appendChild(thTitolo);
      gruppo.appendChild(rigaTitolo);
      righe.forEach(function (r) { gruppo.appendChild(rigaDifferenza(r)); });
      dettaglio.appendChild(gruppo);
    });
    if (!quanti) { document.getElementById("differenze").hidden = true; }
  }

  /* Le ore totali di un percorso, anno per anno: il quadro base più le
     ore della sezione "ore in più" (se c'è) */
  function totaliPercorso(liceo, sezioneOre) {
    var totali = [0, 0, 0, 0, 0];
    var righe = righeOre(liceo, "QUADRO BASE");
    if (sezioneOre) { righe = righe.concat(righeOre(liceo, sezioneOre)); }
    righe.forEach(function (r) {
      for (var j = 0; j < 5; j++) { totali[j] += ore(r[j + 1], r[0]); }
    });
    return totali;
  }

  /* Una riga del dettaglio "Che cosa cambia": la materia e le ore in
     più, scritte "+2"; il trattino grigio dove non ce ne sono. */
  function rigaDifferenza(r) {
    var tr = document.createElement("tr");
    var th = elemento("th", "", r[0]);
    th.scope = "row";
    tr.appendChild(th);
    for (var j = 0; j < 5; j++) {
      var n = ore(r[j + 1], r[0]);
      var td = document.createElement("td");
      if (n > 0) {
        td.className = "orario-in-piu-valore";
        td.textContent = TESTI.inPiu + n;
      } else {
        segnaNessuna(td, TESTI.nessunaOraInPiu);
      }
      tr.appendChild(td);
    }
    return tr;
  }


  /* ---------------------------------------------------------------
     LE PAGINE DEI PERCORSI
     --------------------------------------------------------------- */

  function paginaPercorso(liceo, sezione) {
    var p = elencoPercorsi(liceo).filter(function (r) {
      return r.nome.toUpperCase() === sezione.toUpperCase();
    })[0];
    if (!p) {
      console.warn("liceo.txt: nella tabella PERCORSI non trovo " + sezione);
      p = { nome: sezione, ore: "", tono: "" };
    }

    /* Il tono del percorso (per la riga-titolo "In più nel ..." del
       quadro orario) */
    if (p.tono) { document.body.classList.add(p.tono); }

    tornaIndietro(liceo.campo("LICEO", "torna-liceo"));
    C.scrivi(document.getElementById("etichetta"), titoloCompleto(liceo));
    C.scrivi(document.getElementById("titolo"), p.nome);
    var spiegazione = document.getElementById("spiegazione");
    C.scrivi(spiegazione, liceo.campo(sezione, "spiegazione"));
    testoLungo(spiegazione);

    C.scrivi(document.getElementById("titolo-quadro"), TESTI.quadro);
    quadroOrario(liceo, p.ore, p.nome);

    /* Sotto il quadro orario, il pulsante verso "Le ore a confronto" */
    var confronta = document.getElementById("confronta");
    C.scrivi(confronta, liceo.campo("LICEO", "pulsante-confronta"));

    blocchi(liceo, sezione);

    fasciaFacoltativa("dopo-il-diploma", liceo.campo("LICEO", "titolo-dopo"), liceo.campo(sezione, "dopo-il-diploma"));
  }

  /* Le tre parti sotto l'apertura, ognuna con il titolo in verde e il
     testo sotto: "Che cosa si impara" e "A chi si rivolge" sono elenchi
     (una riga del file per voce, con un trattino grigio), "Come si
     studia" è un paragrafo. I titoli stanno nella sezione LICEO di
     liceo.txt. Una parte senza testo non compare; se non ne compare
     nessuna, sparisce tutta la sezione. */
  function blocchi(liceo, sezione) {
    var contenitore = document.getElementById("blocchi");
    var schede = [
      { titolo: "titolo-impara", campo: "impara", elenco: true },
      { titolo: "titolo-studio", campo: "come-si-studia", elenco: false },
      { titolo: "titolo-a-chi", campo: "a-chi", elenco: true }
    ];
    var quante = 0;

    schede.forEach(function (s) {
      var testi = liceo.campi(sezione, s.campo).filter(function (t) { return t.trim() !== ""; });
      if (!testi.length) { return; }
      quante++;

      var blocco = document.createElement("div");
      blocco.className = "blocco";
      blocco.appendChild(elemento("h2", "blocco-titolo", liceo.campo("LICEO", s.titolo)));
      if (s.elenco) {
        var ul = document.createElement("ul");
        ul.className = "blocco-elenco";
        testi.forEach(function (t) { ul.appendChild(elemento("li", "", t)); });
        blocco.appendChild(ul);
      } else {
        testi.forEach(function (t) { blocco.appendChild(elemento("p", "", t)); });
      }
      contenitore.appendChild(G.paroleIntere(blocco));
    });

    if (!quante) { contenitore.closest("section").hidden = true; }
  }

  /* La sezione "Dopo il diploma" compare solo se in liceo.txt c'è il
     suo campo. Per nasconderla si mette un # davanti alla riga; per
     farla ricomparire lo si toglie. */
  function fasciaFacoltativa(id, titolo, testo) {
    var paragrafo = document.getElementById(id);
    var fascia = paragrafo.closest("section");
    if (!testo) {
      fascia.hidden = true;
      return;
    }
    C.scrivi(fascia.querySelector("h2"), titolo);
    C.scrivi(paragrafo, testo);
    testoLungo(paragrafo);
  }

  /* I paragrafi lunghi (spiegazione e "Dopo il diploma"), dai
     LUNGHEZZA_COLONNE caratteri in su, ricevono la classe "testo-lungo":
     al computer grafica.css li mette su due colonne giustificate. Quelli
     più corti restano una colonna sola allineata a sinistra.
     Le due colonne non le fa il browser: il sito divide il paragrafo
     alla fine della frase più vicina alla metà dei caratteri (un punto
     seguito da una maiuscola) e mette le due parti in due pezzi
     ("colonna"). Così nessuna frase passa da una colonna all'altra, e le
     colonne possono finire ad altezze diverse. Il paragrafo resta uno
     solo: sul telefono si vede come prima e il lettore di schermo lo
     legge di seguito. */
  var LUNGHEZZA_COLONNE = 350;
  var FINE_FRASE = /[.!?](?=\s+[A-ZÀ-Ý])/g;

  function testoLungo(paragrafo) {
    var testo = paragrafo.textContent.trim();
    if (testo.length >= LUNGHEZZA_COLONNE && !paragrafo.querySelector(".da-completare")) {
      var meta = testo.length / 2, taglio = -1, trovato;
      FINE_FRASE.lastIndex = 0;
      while ((trovato = FINE_FRASE.exec(testo)) !== null) {
        var qui = trovato.index + 1;
        if (taglio === -1 || Math.abs(qui - meta) < Math.abs(taglio - meta)) { taglio = qui; }
      }
      paragrafo.classList.add("testo-lungo");
      if (taglio > 0) {
        paragrafo.textContent = "";
        paragrafo.appendChild(elemento("span", "colonna", testo.slice(0, taglio)));
        paragrafo.appendChild(document.createTextNode(" "));
        paragrafo.appendChild(elemento("span", "colonna", testo.slice(taglio).trim()));
      }
    }
    G.paroleIntere(paragrafo);
  }


  /* ---------------------------------------------------------------
     VIENI A TROVARCI (in fondo a liceo.html e alle pagine dei percorsi)
     Il titolo da liceo.txt; sotto i foglietti delle date, la nota sui
     turni e il pulsante per prenotare, da comuni.txt, con lo stesso
     componente della home (js/grafica.js). Se non resta nessuna data
     futura, solo la frase "nessuna-data", senza foglietti né pulsante.
     Nelle pagine dei percorsi, sotto, i collegamenti agli altri due
     percorsi.
     --------------------------------------------------------------- */

  function visita(liceo, comuni, attuale) {
    C.scrivi(document.getElementById("titolo-visita"), liceo.campo("LICEO", "titolo-visita"));
    var date = document.getElementById("date-visita");
    var nota = document.getElementById("nota-visita");
    var prenota = document.getElementById("prenota-visita");

    if (!G.listaDate(comuni, date)) {
      date.hidden = true;
      C.scrivi(nota, comuni.campo("OPEN DAY", "nessuna-data"));
      prenota.hidden = true;
    } else {
      if (comuni.campo("OPEN DAY", "nota-turni")) {
        C.scrivi(nota, comuni.campo("OPEN DAY", "nota-turni"));
      } else {
        nota.hidden = true;
      }
      G.pulsantePrenota(comuni, prenota);
    }

    /* Gli altri percorsi: solo nelle pagine dei percorsi */
    var altri = document.getElementById("altri-percorsi");
    if (!attuale || !altri) { return; }
    C.scrivi(document.getElementById("titolo-altri"), liceo.campo("LICEO", "titolo-altri"));
    var elenco = document.getElementById("elenco-altri");
    elencoPercorsi(liceo).forEach(function (p) {
      if (p.nome.toUpperCase() === attuale.toUpperCase()) { return; }
      var li = document.createElement("li");
      li.className = p.tono;
      li.appendChild(trattino());
      var a = elemento("a", "", p.nome);
      a.href = p.pagina;
      li.appendChild(a);
      elenco.appendChild(li);
    });
  }


  /* ---------------------------------------------------------------
     IL QUADRO ORARIO
     Le materie di Scienze applicate (QUADRO BASE) subito sotto le
     intestazioni. Nel Liceo Matematico e nel Liceo Digitale seguono le
     ore aggiuntive del percorso, in una seconda parte della tabella che
     si apre con la riga-titolo "In più nel ...", con un trattino e la
     scritta nel tono del percorso, senza fondo pieno
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

  /* Una cella senza ore: il trattino si vede grigio; il lettore di
     schermo sente la scritta */
  function segnaNessuna(td, scritta) {
    td.className = "orario-nessuna";
    var vedi = elemento("span", "", "–");
    vedi.setAttribute("aria-hidden", "true");
    td.appendChild(vedi);
    td.appendChild(elemento("span", "solo-lettori", scritta));
  }

  /* Una riga della tabella: la materia e le ore dei cinque anni, che
     si aggiungono ai totali. */
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
        segnaNessuna(td, TESTI.nessunaOra);
      }
      tr.appendChild(td);
    }
    return tr;
  }

  /* Le colonne e le intestazioni comuni alle tabelle delle ore (quadro
     orario, confronto, che cosa cambia).
     Colonne: la prima (materia o percorso), poi i cinque anni. I primi
     quattro sono larghi uguali; il quinto è un po' più largo, perché
     sopra c'è "Quinto anno" da solo (le larghezze stanno in
     grafica.css).
     Intestazioni su due righe: sopra i gruppi (Primo biennio, Secondo
     biennio, Quinto anno), sotto i cinque anni. La prima intestazione
     occupa tutte e due le righe. */
  function intestazione(tabella, primaColonna) {
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

    var testa = document.createElement("thead");
    var rigaGruppi = document.createElement("tr");
    rigaGruppi.className = "orario-gruppi";
    var thPrima = elemento("th", "orario-materia", primaColonna);
    thPrima.scope = "col";
    thPrima.rowSpan = 2;
    rigaGruppi.appendChild(thPrima);
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
  }

  function quadroOrario(liceo, sezioneOre, nome) {
    var tabella = document.getElementById("orario");
    tabella.appendChild(elemento("caption", "solo-lettori", TESTI.didascalia + nome));
    intestazione(tabella, TESTI.materia);

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
