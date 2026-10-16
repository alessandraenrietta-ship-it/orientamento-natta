/* ==================================================================
   LA CARTOLINA DI PRESENTAZIONE (cartolina.html)

   Legge contenuti/home.txt, contenuti/comuni.txt e
   contenuti/cartolina.txt e compone le due facciate della cartolina.
   I testi non stanno qui: si cambiano nei file di testo.

   Due versioni, scelte con i pulsanti della pagina:
   - tipografia: un foglio per facciata, 106 x 156 mm (la cartolina
     più 3 mm di abbondanza per lato);
   - a4: due cartoline per foglio A4 orizzontale, con i segni di taglio.
   Con l'indirizzo cartolina.html?foglio=a4 si apre già la seconda.

   Ha bisogno di js/contenuti.js, js/comuni.js e js/qr.js, che vanno
   caricati prima di questo.
   ================================================================== */

(function () {
  "use strict";

  var C = window.Contenuti;
  var P = window.Pezzi;
  var elemento = P.elemento, segno = P.segno;

  /* Il simbolo di ogni indirizzo, scelto dalla colonna "colore" di
     home.txt: gli stessi della home */
  var SIMBOLI = {
    meccanica: "rotella",
    grafica: "occhio",
    liceo: "lampadina"
  };

  /* La misura del foglio di stampa per ogni versione */
  var PAGINA = {
    tipografia: "@page { size: 106mm 156mm; margin: 0; }",
    a4: "@page { size: 297mm 210mm; margin: 0; }"
  };

  var fronte, retro;

  Promise.all([
    C.leggi("contenuti/home.txt"),
    C.leggi("contenuti/comuni.txt"),
    C.leggi("contenuti/cartolina.txt")
  ])
    .then(function (file) {
      fronte = facciataFronte(file[0], file[1]);
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

  /* Due cartoline uguali affiancate, al centro dell'A4, e i segni di
     taglio. Le misure sono in millimetri, a partire dall'angolo in
     alto a sinistra della coppia (212 x 156 mm). */
  function foglioA4(facciata) {
    var foglio = document.createElement("div");
    foglio.className = "foglio foglio-a4";
    var coppia = document.createElement("div");
    coppia.className = "coppia";
    coppia.appendChild(facciata.cloneNode(true));
    var seconda = facciata.cloneNode(true);
    seconda.setAttribute("aria-hidden", "true");
    coppia.appendChild(seconda);

    /* Dove passano i tagli: in verticale ai bordi delle due cartoline,
       in orizzontale in alto e in basso. I segni sono lunghi 6 mm e
       restano a 2 mm dal fondo, così non si vedono sulla cartolina. */
    [3, 103, 109, 209].forEach(function (x) {
      coppia.appendChild(segnoTaglio("verticale", x - 0.125, -8));
      coppia.appendChild(segnoTaglio("verticale", x - 0.125, 158));
    });
    [3, 153].forEach(function (y) {
      coppia.appendChild(segnoTaglio("orizzontale", -8, y - 0.125));
      coppia.appendChild(segnoTaglio("orizzontale", 214, y - 0.125));
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
     IL FRONTE: logo, nome della scuola e le tre schede degli indirizzi
     --------------------------------------------------------------- */

  function facciataFronte(home, comuni) {
    var f = document.createElement("section");
    f.className = "facciata fronte";
    f.setAttribute("aria-label", "Fronte");

    var testata = document.createElement("div");
    testata.className = "fronte-testata";
    var logo = document.createElement("img");
    logo.className = "fronte-logo";
    logo.src = "immagini/logo-natta.png";
    logo.alt = "";
    logo.width = 231;
    logo.height = 155;
    testata.appendChild(logo);
    var nome = elemento("p", "fronte-nome", comuni.campo("SCUOLA", "nome"));
    if (comuni.campo("SCUOLA", "città")) {
      nome.appendChild(elemento("span", "fronte-citta", comuni.campo("SCUOLA", "città")));
    }
    testata.appendChild(nome);
    f.appendChild(testata);

    var schede = document.createElement("div");
    schede.className = "fronte-schede";
    home.righe("INDIRIZZI").forEach(function (riga, i) {
      if (riga.length !== 8) {
        console.warn("home.txt, INDIRIZZI, riga " + (i + 1) + ": servono 8 colonne, ne ho trovate " + riga.length);
        return;
      }
      schede.appendChild(scheda({
        nome: riga[0], tipo: riga[1], claim: riga[2], frase: riga[3],
        colore: riga[7].toLowerCase()
      }));
    });
    f.appendChild(schede);
    return f;
  }

  /* Una scheda: in alto il colore dell'indirizzo con simbolo, tipo
     e nome; sotto la parte bianca con il claim e la frase "In
     questo indirizzo imparerai...", come nella home. */
  function scheda(dati) {
    var s = document.createElement("article");
    s.className = "scheda tono-" + dati.colore;

    var testa = document.createElement("div");
    testa.className = "scheda-testa";
    if (SIMBOLI[dati.colore]) {
      testa.appendChild(segno(SIMBOLI[dati.colore], "scheda-simbolo"));
    } else {
      console.warn("home.txt: colore sconosciuto \"" + dati.colore + "\" per " + dati.nome);
    }
    var testi = document.createElement("div");
    testi.appendChild(elemento("p", "scheda-tipo", dati.tipo));
    testi.appendChild(elemento("h2", "scheda-nome", dati.nome));
    testa.appendChild(testi);
    s.appendChild(testa);

    var corpo = document.createElement("div");
    corpo.className = "scheda-corpo";
    var testoCorpo = document.createElement("div");
    if (dati.claim) { testoCorpo.appendChild(elemento("p", "scheda-claim", dati.claim)); }
    if (dati.frase) { testoCorpo.appendChild(elemento("p", "scheda-frase", dati.frase)); }
    corpo.appendChild(testoCorpo);
    s.appendChild(corpo);
    return s;
  }


  /* ---------------------------------------------------------------
     IL RETRO: fascia verde con il claim, i tre simboli, codice QR,
     testo sotto il QR, sito e fascia dei contatti
     --------------------------------------------------------------- */

  function facciataRetro(home, comuni, cartolina) {
    var f = document.createElement("section");
    f.className = "facciata retro";
    f.setAttribute("aria-label", "Retro");

    /* In alto la fascia verde con il claim in giallo */
    var testa = document.createElement("div");
    testa.className = "retro-testa";
    testa.appendChild(claimSuDueRighe(home.campo("APERTURA", "claim")));
    f.appendChild(testa);

    var alto = document.createElement("div");
    alto.className = "retro-alto";

    /* I simboli degli indirizzi, nello stesso ordine del fronte, ognuno
       nel suo quadratino colorato. Solo decorativi: i nomi sono sul
       fronte. */
    var simboli = document.createElement("div");
    simboli.className = "retro-simboli";
    simboli.setAttribute("aria-hidden", "true");
    home.righe("INDIRIZZI").forEach(function (riga) {
      var colore = (riga[7] || "").toLowerCase();
      if (!SIMBOLI[colore]) { return; }
      var quadratino = document.createElement("span");
      quadratino.className = "retro-quadratino tono-" + colore;
      quadratino.appendChild(segno(SIMBOLI[colore], "retro-simbolo"));
      simboli.appendChild(quadratino);
    });
    alto.appendChild(simboli);

    var sito = comuni.campo("SCUOLA", "sito-orientamento");
    if (sito && !C.daCompletare(sito)) {
      var qr = document.createElement("div");
      qr.className = "retro-qr";
      qr.innerHTML = window.QR.svg(sito, { titolo: "Codice QR del sito di orientamento" });
      if (qr.innerHTML) {
        alto.appendChild(qr);
      } else {
        console.warn("comuni.txt: l'indirizzo sito-orientamento è troppo lungo per il codice QR");
      }
    } else {
      alto.appendChild(elemento("p", "retro-sotto-qr", "[DA COMPLETARE: sito-orientamento in comuni.txt]"));
    }

    /* Il testo sotto il QR: ogni riga "sotto-qr" di cartolina.txt va a
       capo */
    var righe = cartolina.campi("RETRO", "sotto-qr");
    if (righe.length) {
      var sotto = document.createElement("p");
      sotto.className = "retro-sotto-qr";
      righe.forEach(function (riga) {
        sotto.appendChild(elemento("span", "retro-riga", riga));
      });
      alto.appendChild(sotto);
    }
    /* Sotto, scritto per esteso, l'indirizzo del sito della scuola (il
       campo "sito"), più corto da leggere e da digitare. Il QR invece
       porta al sito di orientamento. */
    alto.appendChild(indirizzoSito(comuni.campo("SCUOLA", "sito") ||
      "[DA COMPLETARE: sito in comuni.txt]"));
    f.appendChild(alto);

    /* La fascia verde con telefono, email dell'orientamento e
       indirizzo della scuola */
    var fascia = document.createElement("div");
    fascia.className = "retro-fascia";
    var elenco = document.createElement("ul");
    elenco.className = "retro-contatti";
    [["telefono", "telefono"], ["email-orientamento", "busta"], ["indirizzo", "luogo"]]
      .forEach(function (voce) {
        var valore = comuni.campo("SCUOLA", voce[0]);
        if (!valore) { return; }
        var li = document.createElement("li");
        li.appendChild(segno(voce[1], "retro-icona"));
        li.appendChild(P.scriviDato(document.createElement("span"), valore));
        elenco.appendChild(li);
      });
    fascia.appendChild(elenco);
    f.appendChild(fascia);
    return f;
  }

  /* Il claim generale va a capo dopo la prima virgola: "Un'unica
     scuola," / "tanti modi di imparare.". Senza virgola resta com'è. */
  function claimSuDueRighe(claim) {
    var p = document.createElement("p");
    p.className = "retro-claim";
    var virgola = claim.indexOf(",");
    if (virgola === -1) { return C.scrivi(p, claim); }
    C.scrivi(p, claim.slice(0, virgola + 1));
    p.appendChild(document.createElement("br"));
    C.scrivi(p, claim.slice(virgola + 1).trim());
    return p;
  }

  /* L'indirizzo del sito scritto per esteso, senza "https://". Ogni
     pezzo fra due barre "/" resta intero: si va a capo solo dopo una
     barra, mai a metà di un nome. */
  function indirizzoSito(sito) {
    var p = document.createElement("p");
    p.className = "retro-sito";
    if (C.daCompletare(sito)) { return C.scrivi(p, sito); }
    P.sitoDaMostrare(sito).split("/").forEach(function (pezzo, i, tutti) {
      var span = document.createElement("span");
      span.textContent = pezzo + (i < tutti.length - 1 ? "/" : "");
      p.appendChild(span);
      if (i < tutti.length - 1) { p.appendChild(document.createElement("wbr")); }
    });
    return p;
  }
}());
