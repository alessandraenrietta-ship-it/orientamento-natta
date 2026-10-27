# Come modificare i testi del sito

Tutti i testi stanno nella cartella `contenuti/`. Si aprono con il Blocco
note. Non serve toccare nessun altro file.

- `comuni.txt`: contatti e open day, validi per tutte le pagine.
  - Nella sezione `SCUOLA`, il campo `mappa` è il link a Google Maps
    usato da "Come arrivare".
  - **Il piede** di ogni pagina mostra, in quest'ordine, i campi `nome`,
    `indirizzo`, `telefono`, `email` (la segreteria) e `sito`. Davanti a
    telefono, email e sito compaiono le etichette dei campi
    `etichetta-telefono` ("Centralino"), `etichetta-email` ("Segreteria")
    e `etichetta-sito` ("Sito della scuola").
  - `nome` si scrive senza virgolette (IIS Giulio Natta): nella home
    compare in maiuscolo nella testata e lungo il timbro del piede.

  Nella sezione degli open day:
  - `nota-turni`, se c'è, è la frase che compare sotto le date; se la
    riga si toglie, non resta spazio vuoto;
  - le date già passate il sito le nasconde da solo, il giorno dopo.
    Quando non ne resta nessuna, la sezione degli open day scende dopo
    gli indirizzi e mostra solo la frase del campo `nessuna-data`, senza
    pulsante. Per il nuovo anno basta cambiare `anno` e scrivere le
    date nuove;
  - `come-prenotare` è la scritta del pulsante, `prenotazione` il link
    a cui porta;
  - la tabella ha **quattro colonne**: `giorno | data | primo turno |
    secondo turno`. La data si scrive come `21 novembre`, senza anno: il sito lo
    ricava da `anno` (da settembre a dicembre il primo anno, da gennaio
    ad agosto il secondo) e dal mese ricava la sigla del foglietto da
    calendario (NOV). Gli orari si
    scrivono sempre con ore e minuti, inizio-fine, come `10.00-11.00`.
  - quando un turno è al completo si scrive `esaurito` dopo l'orario,
    come `10.00-11.00 esaurito`: sulla pagina compare, accanto al turno,
    la scritta rossa del campo `esaurito` (oggi "Esaurito").
- `home.txt`: i testi della pagina iniziale. Nella sezione `APERTURA`,
  `occhiello` è la riga piccola sopra il titolo (il sito ci aggiunge
  l'anno degli open day) e `claim` è il titolo grande (lo usa anche la
  cartolina); ogni riga `testo` è un paragrafo; `testo-adulti` è la riga per gli
  adulti; `pulsante-diurno` e `pulsante-adulti` sono le scritte dei due
  pulsanti che portano alla sezione degli indirizzi e a quella dei
  serali. Righe e pulsanti senza testo non compaiono. Nella tabella
  `INDIRIZZI`, la colonna `frase` è la frase concreta che compare subito
  sotto il claim; se è vuota non compare. La colonna `colore`
  (meccanica, grafica, liceo) decide il colore del trattino accanto al
  nome. La tabella `CONTATTI` elenca le azioni della sezione dei
  contatti, con **tre colonne**: `azione | campo del dato in comuni.txt
  | campo del link`. L'azione è il link sottolineato, sotto compare il
  dato, che si può copiare. La terza colonna si
  può lasciare vuota: il sito capisce da solo che il telefono chiama e
  l'email apre la posta. Se c'è (come `mappa`), l'azione apre quel
  link in una nuova scheda.
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

- `== HOME ==` è la sezione dei serali nella pagina iniziale: i campi
  `titolo`, `tipo`, `claim`, `in breve`, `pagina`, `stato` e una
  tabella con i percorsi, `nome | colore` (meccanica o grafica: il
  colore del trattino accanto al nome). I nomi dei campi non vanno
  cambiati.
- `== PAGINA ==` contiene le informazioni per la futura pagina dei
  serali. Oggi nella home si usano solo `pulsante` e `link`: finché la
  pagina dei serali è "in preparazione", in fondo alla sezione dei
  serali compare il pulsante verso il modulo di preiscrizione.

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
  claim sotto il titolo non sta qui: è quello del liceo nella tabella
  `INDIRIZZI` di `home.txt`.
- `== PERCORSI ==`: una riga per percorso, quattro colonne, `nome |
  spiegazione breve | pagina | ore in più`. Diventano i tre percorsi
  della pagina del liceo, nello stesso ordine. "ore in più" è il nome
  della sezione con le ore aggiuntive del percorso (per esempio
  `ORE AGGIUNTIVE MATEMATICO`); per Scienze applicate resta vuota. Il
  sito la usa per il quadro orario delle pagine dei percorsi e per
  calcolare "Le ore a confronto".
- Nella sezione `LICEO` ci sono anche il titolo sopra i tre percorsi,
  che sente solo chi usa un lettore di schermo (`titolo-percorsi`), e i
  testi delle sezioni nuove:
  "Le ore a confronto" (`titolo-confronto`, `nota-confronto`,
  `intestazione-percorso`, `pulsante-differenze`, `nota-differenze`),
  il pulsante sotto il quadro orario (`pulsante-confronta`) e "Vieni a
  trovarci." (`titolo-visita`, `titolo-altri`).
- `== QUADRO BASE ==`: le ore settimanali di Scienze applicate, comuni
  ai tre percorsi. Sei colonne: la materia e le ore dal primo al quinto
  anno. Il trattino `-` vuol dire che in quell'anno la materia non c'è.
- `== SCIENZE APPLICATE ==`, `== LICEO MATEMATICO ==`, `== LICEO
  DIGITALE ==`: i testi di ciascuna pagina di percorso:
  - `spiegazione`: il testo sotto il titolo;
  - `impara`: "Che cosa si impara", un elenco: **una riga per voce**,
    ripetendo ogni volta `impara:`;
  - `come-si-studia`: "Come si studia", un paragrafo;
  - `a-chi`: "A chi si rivolge", un elenco: **una riga per voce**,
    ripetendo ogni volta `a-chi:`;
  - `dopo-il-diploma`: la sezione "Dopo il diploma", un paragrafo.

  I titoli dei blocchi (`titolo-impara`, `titolo-studio`,
  `titolo-a-chi`, `titolo-dopo`) stanno nella sezione `LICEO` e valgono
  per tutte e tre le pagine.

  **Un blocco senza testo non compare.** Per nasconderlo basta mettere
  un `#` davanti alle sue righe; se mancano tutti e tre i blocchi "Che
  cosa si impara", "Come si studia" e "A chi si rivolge", sparisce anche
  la loro sezione. Oggi Scienze applicate e Liceo Matematico hanno le
  righe pronte con il `#` davanti e `[DA COMPLETARE]`: per riempirle si
  toglie il `#` e si scrive il testo.

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
