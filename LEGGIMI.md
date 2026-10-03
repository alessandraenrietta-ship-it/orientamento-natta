# Come modificare i testi del sito

Tutti i testi stanno nella cartella `contenuti/`. Si aprono con il Blocco
note. Non serve toccare nessun altro file.

- `comuni.txt`: contatti e open day, validi per tutte le pagine. Nella
  sezione degli open day, il campo `per-chi` è la riga che compare
  sotto il titolo.
- `home.txt`: i testi della pagina iniziale. Nella sezione `APERTURA`,
  ogni riga `testo` è un paragrafo; `testo-adulti` è la riga per gli
  adulti; `pulsante-diurno` e `pulsante-adulti` sono le scritte dei due
  pulsanti che portano alla fascia degli indirizzi e a quella dei
  serali. Righe e pulsanti senza testo non compaiono.
- `serali.txt`: i testi dei corsi serali per adulti.

## Le quattro regole

1. **Righe "campo: testo".** A sinistra dei due punti c'è il nome del
   campo: non va cambiato. A destra c'è il testo: si cambia liberamente.
   Ogni campo sta su una riga sola, anche se è lunga.
2. **Sezioni "== NOME ==".** Dividono il file in parti. Il nome non va
   cambiato.
3. **Tabelle.** Una riga per elemento, le colonne separate dalla barra
   verticale `|`. Le colonne sono spiegate nel commento sopra la tabella.
   Dentro i testi la barra `|` non si usa.
4. **Commenti.** Le righe che iniziano con `#` sono commenti: il sito le
   ignora.

## Il file dei serali

`serali.txt` ha due sezioni.

- `== HOME ==` è la scheda dei serali nella pagina iniziale: ha gli
  stessi campi delle schede degli indirizzi (`tipo`, `nome`, `claim`,
  `in breve`, `pagina`, `stato`) più `titolo`, il titolo della fascia.
  I nomi dei campi non vanno cambiati.
- `== PAGINA ==` contiene le informazioni per la futura pagina dei
  serali. Oggi non compaiono da nessuna parte.

Nella sezione `PAGINA` c'è **un'eccezione** alla prima regola. Quattro
campi hanno un posto fisso e il loro nome non va cambiato: `titolo`,
`etichetta` (la riga piccola con l'anno), `pulsante` (la scritta sul
pulsante) e `link` (dove porta il pulsante). **Tutte le altre righe**
sono informazioni, nello stesso ordine del file, e il nome a sinistra
dei due punti **comparirà sulla pagina** come voce, con la prima
lettera maiuscola: si può cambiare, e può contenere spazi e accenti.
Per esempio

    a chi si rivolge: A chi lavora o vuole riprendere gli studi.

sulla pagina diventa "**A chi si rivolge** A chi lavora o vuole
riprendere gli studi." Per aggiungere un'informazione si scrive una
riga nuova nel punto in cui deve comparire; per toglierla si cancella
la riga.

## Dati che mancano

Si scrive `[DA COMPLETARE: che cosa manca]`. Sul sito compare così com'è,
quindi si vede subito.

## Dopo una modifica

Si controlla con `anteprima.bat`. Poi si pubblica con commit e push.
