/* ==================================================================
   IL LETTORE DEI FILE DI TESTO

   Legge i file della cartella contenuti/ e li rende utilizzabili dalle
   pagine. Il formato dei file è spiegato in LEGGIMI.md:

       == NOME ==            inizia una sezione
       campo: testo          un campo (lo stesso campo può ripetersi)
       a | b | c             una riga di tabella
       # ...                 un commento, ignorato

   COME SI USA IN UNA PAGINA
       Contenuti.leggi("contenuti/home.txt").then(function (file) {
         file.campo("APERTURA", "titolo")   -> il primo testo del campo
         file.campi("APERTURA", "testo")    -> tutti i testi del campo
         file.righe("INDIRIZZI")            -> le righe della tabella
       });

   Le righe che il lettore non capisce non fermano la pagina: vengono
   segnalate nella console del browser (tasto F12), con il numero di
   riga, così si trovano e si correggono.
   ================================================================== */

window.Contenuti = (function () {
  "use strict";

  var SEGNAPOSTO = /\[DA COMPLETARE[^\]]*\]/g;

  function leggi(percorso) {
    /* "no-cache": il browser chiede sempre al sito se il file è
       cambiato, così una correzione ai testi si vede subito. */
    return fetch(percorso, { cache: "no-cache" })
      .then(function (risposta) {
        if (!risposta.ok) {
          throw new Error("Non trovo il file " + percorso + " (" + risposta.status + ")");
        }
        return risposta.text();
      })
      .then(function (testo) { return analizza(testo, percorso); });
  }

  function analizza(testo, nomeFile) {
    var sezioni = {};
    var corrente = nuovaSezione(sezioni, "");

    /* Il segno invisibile che il Blocco note a volte mette all'inizio
       del file va tolto, altrimenti la prima riga non si riconosce. */
    var righe = testo.replace(/^﻿/, "").split(/\r?\n/);

    righe.forEach(function (riga, i) {
      var pulita = riga.trim();
      if (pulita === "" || pulita.charAt(0) === "#") { return; }

      var titolo = pulita.match(/^==\s*(.+?)\s*==$/);
      if (titolo) {
        corrente = nuovaSezione(sezioni, titolo[1].toUpperCase());
        return;
      }

      if (pulita.indexOf("|") !== -1) {
        corrente.righe.push(pulita.split("|").map(function (c) { return c.trim(); }));
        return;
      }

      /* Conta solo il primo ":", così un orario o un indirizzo web
         nel testo non creano problemi. */
      var campo = pulita.match(/^([A-Za-z0-9-]+)\s*:\s*(.*)$/);
      if (campo) {
        var nome = campo[1].toLowerCase();
        if (!corrente.campi[nome]) { corrente.campi[nome] = []; }
        corrente.campi[nome].push(campo[2]);
        return;
      }

      console.warn(nomeFile + ", riga " + (i + 1) + ": non la capisco e la salto -> " + pulita);
    });

    return {
      campo: function (sezione, nome) {
        var s = sezioni[sezione];
        return (s && s.campi[nome]) ? s.campi[nome][0] : "";
      },
      campi: function (sezione, nome) {
        var s = sezioni[sezione];
        return (s && s.campi[nome]) ? s.campi[nome].slice() : [];
      },
      righe: function (sezione) {
        var s = sezioni[sezione];
        return s ? s.righe.slice() : [];
      }
    };
  }

  function nuovaSezione(sezioni, nome) {
    if (!sezioni[nome]) { sezioni[nome] = { campi: {}, righe: [] }; }
    return sezioni[nome];
  }

  /* Vero se nel testo c'è ancora un [DA COMPLETARE: ...] */
  function daCompletare(testo) {
    return testo.search(SEGNAPOSTO) !== -1;
  }

  /* Aggiunge un testo dentro un elemento della pagina. Gli eventuali
     [DA COMPLETARE: ...] diventano un riquadro tratteggiato, ben
     visibile. Il testo entra sempre come testo semplice: anche se
     qualcuno scrivesse un tag HTML nel file, non verrebbe eseguito. */
  function scrivi(elemento, testo) {
    var inizio = 0;
    testo.replace(SEGNAPOSTO, function (trovato, posizione) {
      if (posizione > inizio) {
        elemento.appendChild(document.createTextNode(testo.slice(inizio, posizione)));
      }
      var segno = document.createElement("span");
      segno.className = "da-completare";
      segno.textContent = trovato;
      elemento.appendChild(segno);
      inizio = posizione + trovato.length;
      return trovato;
    });
    if (inizio < testo.length) {
      elemento.appendChild(document.createTextNode(testo.slice(inizio)));
    }
    return elemento;
  }

  return { leggi: leggi, scrivi: scrivi, daCompletare: daCompletare };
}());
