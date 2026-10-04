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

- **Il sito è in bozza.** Ogni pagina ha nella testa
  `<meta name="robots" content="noindex, nofollow">`, così i motori di
  ricerca non la mostrano. Si mette anche nelle pagine nuove, e si
  toglie da tutte solo quando Alessandra dice che il sito è approvato.

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
- Contrasto almeno **4,5:1** per il testo.
- Testo alternativo per le immagini, `alt=""` per quelle solo decorative.
- **Nessun testo dentro le immagini.**
- Tutto usabile da tastiera, con l'elemento attivo ben visibile.
- Carattere **Arial** (`Arial, Helvetica, sans-serif`), testo di base
  almeno 16 px. Titoli in **Arial Black** maiuscolo: sui telefoni dove
  manca compare il carattere più nero disponibile.

## 6. Grafica

- **Un solo tema, chiaro.** Il tema scuro è stato eliminato: niente
  interruttore, niente regole CSS o codice JavaScript per il tema scuro.
- **Grafica a fasce**: fasce piene da bordo a bordo, alternate verdi e
  chiare, senza sfumature.
  - testata e piede: verde scuro `#014A26`, testo bianco; nella testata
    il logo con lo sfondo trasparente, senza riquadro;
  - **fascia verde** `#026C37`: titoli gialli `#FFF33F` in Arial Black
    maiuscolo, testo bianco, pulsante a pillola bianco con testo verde;
  - **fascia chiara** `#F3F7EC`: titoli verdi `#026C37` in Arial Black
    maiuscolo, testo blu notte `#00193C`, pulsante a pillola verde con
    testo bianco;
  - riquadro in evidenza: giallo `#FFF33F`, testo blu notte `#00193C`;
  - schede bianche con angoli tondi e retino (la trama di pallini); sulle
    fasce chiare anche un bordo tenue e un'ombra, perché il bianco su
    `#F3F7EC` ha contrasto 1,1;
  - sulle schede: un quadratino colorato con il simbolo, un'etichetta
    piccola in maiuscolo, il testo in Arial.
- Il titolo grande dell'apertura ("ORIENTAMENTO I.I.S. Giulio Natta")
  non viene trasformato in maiuscolo: compare come è scritto in
  `home.txt`, così il nome della scuola resta in minuscolo con le
  iniziali maiuscole. Gli altri titoli delle fasce restano in maiuscolo
  automatico.
- Nella home le fasce sono: testata; apertura verde (l'unica con il
  testo centrato, con i pulsanti "Dopo la terza media" e "Corsi serali
  per adulti"); open day chiara (subito dopo l'apertura, perché le date
  scadono); indirizzi verde (tre schede di pari importanza, tutte e tre
  su una riga al computer, mai due più una); serali chiara (separata dagli
  indirizzi del diurno: una sola scheda con gli stessi pezzi di quelle
  degli indirizzi, disposta come una striscia orizzontale lunga e
  bassa, simbolo a sinistra, testi al centro e "Pagina in preparazione"
  o il pulsante a destra; sul telefono simbolo accanto ai testi; porta
  alla pagina dei serali); contatti verde; piede.
- Contatti: tre pulsanti d'azione (Scrivi all'orientamento, Chiamaci,
  Dove siamo), ognuno un unico link cliccabile per intero: scheda
  bianca alta almeno 64 pixel, quadratino verde con icona a linea,
  azione in grassetto verde e dato sotto in blu notte, niente
  sottolineature a riposo; al passaggio del mouse l'azione si
  sottolinea e il fondo diventa chiaro; focus da tastiera giallo.
  "Dove siamo" apre Google Maps in una nuova scheda, con un testo
  nascosto per il lettore di schermo; niente freccina né riga "Apri la
  mappa" (tolte su richiesta di Alessandra); nessuna mappa
  incorporata. Negli indirizzi email si va a capo solo dopo la
  chiocciola.
- Piede: nome, indirizzo, telefono, email della segreteria e sito, con
  telefono, email e sito come link bianchi sottolineati. Al telefono
  una voce per riga, al computer separate da un punto medio.
- Open day: un'unica scheda bianca con le date come foglietti da
  calendario (striscia verde con il mese, numero del giorno in Arial
  Black blu notte, bordo sottile blu notte, niente ombra: non si
  cliccano e non devono sembrarlo) e, in fondo, il pulsante a pillola
  verde per prenotare. Ogni turno ha una spunta verde se è libero, una
  croce rossa con la scritta "Esaurito" se è pieno (nel file:
  "esaurito" dopo l'orario; la scritta sta nel campo `esaurito`). Il rosso `#B91C1C` (contrasto 6,5 sul
  bianco) si usa solo qui e sempre insieme a forma e scritta, mai da
  solo: per chi è daltonico rosso e verde si confondono.
- I serali hanno tono da adulti: nei loro testi non si usa il "tu". I
  loro testi stanno in `contenuti/serali.txt`.
- **Il colore della scuola è il verde** `#026C37`: fasce verdi, pulsanti,
  link. Il verde lime `#8DC73C` è solo decorativo, mai per il testo.
- Il teal `#00596B` non si usa più.
- Un colore per indirizzo, usato **solo come fondo del quadratino** con
  il simbolo, **sempre con un bordo sottile blu notte** `#00193C`:
  - Meccanica: ambra `#F59E0B`, simbolo blu notte, rotella
  - Grafica: rosa `#F472B6`, simbolo blu notte, occhio
  - Liceo: blu `#1F5FA8`, simbolo bianco, lampadina
  - Serali: ardesia `#3A4756`, simbolo bianco, luna
- Percorsi del liceo, per le pagine future: tutti blu `#1F5FA8` con
  simbolo bianco. Simboli: beuta (Scienze applicate), π disegnato come
  forma (Liceo Matematico), `</>` (Liceo Digitale).
- I colori sono stati verificati per contrasto (testo almeno 4,5:1) e per
  deuteranopia e protanopia. **Non si cambiano senza dirlo ad
  Alessandra.**
- Il giallo non si usa mai come colore del testo su fondo chiaro.
- **Icone a linea per le funzioni, simboli pieni a adesivo per
  l'identità di indirizzi, serali e percorsi del liceo.** Tutti
  disegnati a mano in SVG, in `immagini/simboli.svg`.
  - Simboli a adesivo: figure piene con interno bianco e contorno blu
    notte spesso, forme semplici e generose, nello spirito di un
    fumetto, leggibili anche a 24 pixel. Ingranaggio grande con un
    secondo più piccolo che ingrana (Meccanica), occhio con l'iride
    piena (Grafica), lampadina con filamento e attacco a righe (Liceo),
    falce di luna con una stella (Serali). Su ogni fondo almeno uno fra
    contorno e interno supera 3:1.
  - Icone a linea, un solo colore: luogo, telefono, busta, globo,
    spunta e croce dei turni,
    calendario.
- Nelle schede di indirizzi e serali il quadratino è di circa 56 pixel,
  angoli poco arrotondati, bordo sottile blu notte, niente ombra, in
  alto a sinistra con accanto tipo di scuola e nome.
- Il logo è `immagini/logo-natta.png`, con sfondo trasparente. È piccolo
  (231×155 pixel): non va ingrandito molto. Se arriva l'originale in alta
  risoluzione, si sostituisce.

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
     sulla stessa base scientifica: Scienze applicate; Liceo Matematico,
     con più ore di matematica; Liceo Digitale, curvatura con ore in più
     di intelligenza artificiale, coding, diritto e pensiero critico.
     Curvatura: stesso diploma, con più ore (quante: da definire).
     Il sito del Liceo Digitale non compare nella home: il suo indirizzo
     resta in `comuni.txt` per la futura pagina del liceo.
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
