# Regole del progetto "orientamento-natta"

Questo file contiene le regole che Claude deve rispettare **sempre** quando
lavora in questa cartella.

Repository: https://github.com/alessandraenrietta-ship-it/orientamento-natta
Sito online (dopo l'attivazione di GitHub Pages):
https://alessandraenrietta-ship-it.github.io/orientamento-natta/

Modello di riferimento: il sito del Liceo Digitale, nella cartella
`../liceo-digitale`. Si può leggere e se ne possono copiare file
(`stile.css`, `js/qr.js`, `anteprima.bat`, `anteprima.ps1`), ma **non si
modifica mai**.

## 1. Che cos'è

Il sito di orientamento in entrata dell'IIS "Giulio Natta" di Rivoli.
Pubblico: ragazzi di seconda e terza media, famiglie, docenti orientatori,
adulti interessati ai corsi serali.

## 2. Sito statico

- Solo **HTML, CSS e JavaScript** scritti a mano.
- **Nessuna libreria esterna**, **nessun font esterno**, **nessun passaggio
  di compilazione**: i file nella cartella sono esattamente quelli che
  finiscono online.
- **Solo percorsi relativi** per i file del sito (`stile.css`,
  `../index.html`, mai `/stile.css`). Gli indirizzi completi, che iniziano
  con `http`, si usano solo per i siti esterni, per esempio il Liceo
  Digitale o il sito della scuola.
- Prima di dare per buono un collegamento si controlla che il file esista
  con quel nome esatto, maiuscole comprese: il server di GitHub distingue
  `Foto.jpg` da `foto.jpg`, il computer di casa no.
- **Il numero `?v=`.** Quando cambia un file CSS o JS, si aumenta di uno il
  `?v=` in **tutte** le pagine che lo richiamano (esempio: `stile.css?v=3`
  diventa `?v=4`). Senza, i browser continuano a mostrare la versione
  vecchia.
- Nomi di file e cartelle **minuscoli**, con **trattini**, senza spazi né
  accenti.

## 3. Contenuti separati dal codice

- Testi, date e contatti stanno nella cartella `contenuti/`, in file `.txt`,
  modificabili da chi non programma. Il formato è spiegato in `LEGGIMI.md`:
  - righe `campo: testo`
  - sezioni `== NOME ==`
  - tabelle con le colonne separate dalla barra verticale `|`, una riga
    per elemento
  - le righe che iniziano con `#` sono commenti
- I dati comuni a più pagine (contatti, open day) stanno **solo** in
  `contenuti/comuni.txt`. Non si ricopiano altrove.
- Gli stessi file serviranno per volantini e cartoline, dopo
  l'approvazione del sito. Non ora.

## 4. Pagine non ancora pronte

- Ogni scheda che porta a una pagina ha un campo `stato`: `pronta` oppure
  `in preparazione`.
- `in preparazione`: la scheda compare **senza link**, con la scritta
  "Pagina in preparazione". Così nessuno finisce sulla pagina di errore.
- Prima di ogni push si controlla che ogni pagina `pronta` esista davvero.

## 5. Prima lo smartphone, accessibilità sempre

- Si progetta per lo smartphone, poi per computer e LIM.
- Contrasto almeno **4,5:1** per il testo, nel tema chiaro e nel tema scuro.
- Testo alternativo per le immagini, `alt=""` per quelle solo decorative.
- **Nessun testo dentro le immagini.**
- Tutto usabile da tastiera, con l'elemento attivo ben visibile.
- Carattere **Arial** (`Arial, Helvetica, sans-serif`), testo di base
  almeno 16 px.

## 6. Grafica

- Stesso sistema del Liceo Digitale: testata con logo, schede, tema chiaro
  e scuro.
- I colori si usano sempre con i nomi definiti in `stile.css`
  (`var(--verde)` e simili), mai con i codici scritti nelle pagine.
- Verde dell'istituto `#026C37` per testi e pulsanti. `#8DC73C` solo
  decorativo.
- Un accento per indirizzo:
  - Meccanica: blu `#1F5FA8`
  - Grafica: arancio `#C2410C`
  - Liceo: giallo `#F5C400` con testo blu notte `#00193C`
  - Serali: ardesia `#3A4756`
- Il giallo non si usa mai come colore del testo su fondo chiaro.
- Nel tema scuro gli accenti hanno una variante più chiara, controllata
  al contrasto.
- Simboli disegnati a mano in SVG: rotella (Meccanica), occhio (Grafica),
  lampadina (Liceo).

## 7. Come si scrive

- Frasi brevi.
- I termini scolastici si spiegano la prima volta che compaiono
  (curvatura, biennio, articolazione, PCTO, ITS).
- Niente slogan vuoti: ogni claim è seguito da informazioni concrete.
- Mai il trattino lungo al posto della virgola.
- Serali: tono e contenuti per adulti.
- **Mai inventare dati.** Dove un dato manca si scrive
  `[DA COMPLETARE: ...]` in modo visibile, e lo si segnala.

## 8. Decisioni sui contenuti

- Indirizzi:
  1. Istituto tecnico tecnologico **Meccanica, meccatronica ed energia**.
     Articolazioni dalla terza: Meccanica e meccatronica, Energia.
  2. Istituto tecnico tecnologico **Grafica e comunicazione**.
  3. **Liceo scientifico opzione Scienze applicate**, con tre percorsi
     sulla stessa base: Scienze applicate, Liceo Matematico, Liceo
     Digitale (curvatura, rimanda al suo sito).
  4. **Corsi serali per adulti 2026/27**: Meccanica e meccatronica;
     Grafica e comunicazione.
- Materie plastiche: **non si presenta** (decisione in corso).
- Quadri orari dei tecnici: solo **nuovo ordinamento (DM 29/2026)**, li
  fornisce Alessandra. La riga "Ore decise dalla scuola" si indica come
  "in definizione". **Mai** i quadri delle vecchie brochure.

## 9. Il repository è pubblico

Tutto quello che finisce qui dentro è visibile a chiunque, anche dopo
averlo cancellato (resta nella cronologia di Git). Quindi niente:

- dati personali di studenti, nomi di minori
- foto riconoscibili senza liberatoria
- email o numeri di telefono personali dei docenti: solo contatti
  istituzionali
- password, chiavi o token, nemmeno in un commento

Si segnalano i link non funzionanti e le immagini di provenienza o
licenza incerta. I materiali di lavoro stanno in `materiali-grezzi/` o
hanno `NON-PUBBLICARE` nel nome: `.gitignore` li tiene fuori dal sito.

## 10. Git e metodo di lavoro

- Si usa **sempre `git` da riga di comando**, **mai `gh`**.
- Prima di creare o modificare file si propone l'intervento e si aspetta
  la conferma. Piccoli passi verificabili.
- Prima di iniziare a lavorare: `git pull`.
- **Prima di ogni push**: elenco dei file modificati e di che cosa è
  cambiato, un messaggio di commit breve in italiano, poi si aspetta il
  **sì esplicito**. Dopo il push si dice dove controllare online.
- I messaggi di commit dicono **che cosa è cambiato**, non come.
- Se Git chiede di accedere a GitHub si spiega che cosa fare. **Mai
  chiedere password o token in chat.**
- Anteprima sul computer con `anteprima.bat`. Aprire `index.html` con un
  doppio clic non basta, perché le pagine leggono i file di testo.

## 11. Come parlare con Alessandra

- Alessandra non è una programmatrice. Parole semplici e termini tecnici
  corretti, spiegati la prima volta che compaiono.
- Mettere alla prova le sue idee, segnalare incertezze e dati da
  verificare, niente complimenti di maniera.
