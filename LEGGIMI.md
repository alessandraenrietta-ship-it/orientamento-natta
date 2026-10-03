# Come modificare i testi del sito

Tutti i testi stanno nella cartella `contenuti/`. Si aprono con il Blocco
note. Non serve toccare nessun altro file.

- `comuni.txt`: contatti e open day, validi per tutte le pagine.
- `home.txt`: i testi della pagina iniziale.

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

## Dati che mancano

Si scrive `[DA COMPLETARE: che cosa manca]`. Sul sito compare così com'è,
quindi si vede subito.

## Dopo una modifica

Si controlla con `anteprima.bat`. Poi si pubblica con commit e push.
