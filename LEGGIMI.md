# Come modificare i testi del sito

Tutti i testi stanno nella cartella `contenuti/`. Si aprono con il Blocco
note. Non serve toccare nessun altro file.

- `comuni.txt`: contatti e open day, validi per tutte le pagine.
  - Nella sezione `SCUOLA`, il campo `mappa` è il link a Google Maps
    usato dal pulsante "Dove siamo".
  - **Il piede** di ogni pagina mostra, in quest'ordine, i campi `nome`,
    `indirizzo`, `telefono`, `email` (la segreteria) e `sito`.

  Nella sezione degli open day:
  - `nota-turni`, se c'è, è la frase che compare sotto il titolo della
    fascia; se manca, sotto il titolo non resta spazio vuoto;
  - `come-prenotare` è la scritta del pulsante, `prenotazione` il link
    a cui porta;
  - la tabella ha **quattro colonne**: `giorno | data | primo turno |
    secondo turno`. La data si scrive come `21 novembre`: dal mese il
    sito ricava la sigla del foglietto da calendario (NOV). Gli orari si
    scrivono sempre con ore e minuti, inizio-fine, come `10.00-11.00`.
  - quando un turno è al completo si scrive `esaurito` dopo l'orario,
    come `10.00-11.00 esaurito`: sulla pagina compare una croce rossa
    con la scritta del campo `esaurito` (oggi "Esaurito"). I turni liberi
    hanno una spunta verde.
- `home.txt`: i testi della pagina iniziale. Nella sezione `APERTURA`,
  ogni riga `testo` è un paragrafo; `testo-adulti` è la riga per gli
  adulti; `pulsante-diurno` e `pulsante-adulti` sono le scritte dei due
  pulsanti che portano alla fascia degli indirizzi e a quella dei
  serali. Righe e pulsanti senza testo non compaiono. Nella tabella
  `INDIRIZZI`, la colonna `frase` è la frase concreta che compare subito
  sotto il claim; se è vuota non compare. La tabella `CONTATTI` elenca
  i pulsanti d'azione della fascia dei contatti, con **tre colonne**:
  `azione | campo del dato in comuni.txt | campo del link`. L'azione è
  la scritta in grassetto, sotto compare il dato. La terza colonna si
  può lasciare vuota: il sito capisce da solo che il telefono chiama e
  l'email apre la posta. Se c'è (come `mappa`), il pulsante apre quel
  link in una nuova scheda. Se nella sezione `SEZIONI` si aggiunge il
  campo `apri-mappa`, la sua scritta compare sotto il dato; oggi non c'è.
- `serali.txt`: i testi dei corsi serali per adulti.
- `liceo.txt`: i testi della pagina del liceo (`liceo.html`) e delle
  pagine dei tre percorsi. Vedi più sotto.

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

## Il file del liceo

`liceo.txt` serve a quattro pagine: `liceo.html` e le tre pagine dei
percorsi (`liceo-scienze-applicate.html`, `liceo-matematico.html`,
`liceo-digitale.html`).

- `== LICEO ==`: titolo (`titolo` e, sulla seconda riga più piccola,
  `titolo-riga-2`; nelle pagine dei percorsi compaiono uniti da una
  virgola), sottotitolo della pagina del liceo e le
  scritte fisse (`pulsante-percorso`, `torna-home`, `torna-liceo`).
  `torna-home` e `torna-liceo` sono i collegamenti in alto a sinistra;
  oggi hanno un `#` davanti e non compaiono: per farli comparire si
  toglie il `#`. Il
  claim piccolo sopra il titolo non sta qui: è quello della scheda del
  liceo nella tabella `INDIRIZZI` di `home.txt`.
- `== PERCORSI ==`: una riga per percorso, tre colonne, `nome |
  spiegazione breve | pagina`. Diventano le tre schede della pagina del
  liceo, nello stesso ordine.
- `== QUADRO BASE ==`: le ore settimanali di Scienze applicate, comuni
  ai tre percorsi. Sei colonne: la materia e le ore dal primo al quinto
  anno. Il trattino `-` vuol dire che in quell'anno la materia non c'è.
- `== SCIENZE APPLICATE ==`, `== LICEO MATEMATICO ==`, `== LICEO
  DIGITALE ==`: i testi di ciascuna pagina di percorso (`spiegazione`
  sotto il titolo, `laboratori`, `dopo-il-diploma`). Le fasce
  "Laboratori e progetti" e "Dopo il diploma" compaiono solo se c'è il
  loro campo: oggi le righe hanno un `#` davanti e sono nascoste. Per
  farle comparire si toglie il `#`.

### Le ore aggiuntive

Le sezioni `== ORE AGGIUNTIVE MATEMATICO ==` e `== ORE AGGIUNTIVE
DIGITALE ==` hanno le stesse sei colonne del quadro base, ma contengono
**solo le ore in più** rispetto a Scienze applicate, non le ore totali.

Nel quadro orario le righe delle ore aggiuntive compaiono **dopo le
materie del quadro base**, sotto una riga-titolo colorata "In più nel
Liceo Matematico" oppure "In più nel Liceo Digitale", prima del totale.
Vale anche se la materia c'è già nel quadro base: nel Liceo Matematico
la riga "Matematica" compare due volte, prima con le ore di Scienze
applicate e più sotto, dopo la riga-titolo, con le sole ore in più.

**I totali li calcola il sito**: non si scrivono da nessuna parte. Per
cambiare un orario basta correggere un numero; per aggiungere una
materia in più si aggiunge una riga.

## Le maiuscole del titolo

Il titolo grande della pagina iniziale (campo `titolo` della sezione
`APERTURA` di `home.txt`) compare **esattamente come è scritto**: le
parole in maiuscolo vanno scritte in maiuscolo nel file. Gli altri
titoli delle fasce, invece, la pagina li mette in maiuscolo da sola.

## Dati che mancano

Si scrive `[DA COMPLETARE: che cosa manca]`. Sul sito compare così com'è,
quindi si vede subito.

## Dopo una modifica

Si controlla con `anteprima.bat`. Poi si pubblica con commit e push.
