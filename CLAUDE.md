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
- Gli stessi file servono anche per volantini e cartoline: oggi per la
  cartolina di presentazione (vedi il punto 12). Altri volantini e
  cartoline si fanno solo quando li decide Alessandra.

## 4. Pagine non ancora pronte

- Ogni scheda che porta a una pagina ha un campo `stato`: `pronta` oppure
  `in preparazione`.
- `in preparazione`: la scheda compare **senza link**, con la scritta
  "Pagina in preparazione". Così nessuno finisce sulla pagina di errore.
- Prima di ogni push si controlla che ogni pagina `pronta` esista davvero.
  La home lo controlla anche da sola: se il server risponde che la
  pagina non c'è (404), al posto del pulsante mette "Pagina in
  preparazione". Con altre risposte il pulsante resta, perché alcuni
  servizi di anteprima (raw.githack.com) rifiutano il controllo anche
  quando la pagina c'è.

## 5. Prima lo smartphone, accessibilità sempre

- Si progetta per lo smartphone, poi per computer e LIM.
- Contrasto almeno **4,5:1** per il testo.
- Testo alternativo per le immagini, `alt=""` per quelle solo decorative.
- **Nessun testo dentro le immagini.**
- Tutto usabile da tastiera, con l'elemento attivo ben visibile.
- **Un solo carattere in tutto il sito: Cutive Mono** (licenza SIL OFL,
  testo in `fonts/OFL.txt`). Il file è `fonts/cutive-mono-regular.ttf`,
  caricato con `@font-face` in `grafica.css`: nessun collegamento a
  Google Fonts. Ha un solo spessore, senza grassetto: titoli e nomi si
  distinguono per grandezza, colore e maiuscolo, e `font-synthesis:
  none` impedisce il grassetto finto. Niente legature
  (`font-variant-ligatures: none` in `grafica.css`,
  `cartolina-facciate.css` e `cartolina.css`): "fi" resta di due
  lettere, come vuole la griglia del Cutive Mono. Nel sito il testo ha
  un contorno di 0,3 px nel suo colore (`-webkit-text-stroke` in
  `grafica.css`), che lo rende un po' più pieno: non sul timbro e non
  sulla cartolina (dal 27 ottobre 2026 sera). Testi ad almeno 16 px (di base
  17; claim degli indirizzi 19), interlinea 1,6. Non è più Arial: lo
  usano la home e le pagine del liceo (punto 13); solo la vecchia
  cartolina resta in Arial. Eccezioni volute sotto i 16 px: i turni
  degli open day e la tabella del quadro orario sul telefono (14), le
  intestazioni della tabella (12-13), la scritta del timbro.

## 6. Grafica

**Attenzione:** la home (`index.html`) e le quattro pagine del liceo
hanno la grafica nuova "a cartolina", descritta al punto 13, e usano
`grafica.css`. Le regole sulla grafica "a fasce" di questo punto non
valgono più per nessuna pagina del sito: restano come memoria della
versione precedente (etichetta Git `grafica-ottobre`). `stile.css` e
`immagini/simboli.svg` non li usa più nessuna pagina; restano finché
il ramo `grafica-cartolina` non viene unito a `main`. Valgono ancora,
di questo punto, le regole su colori, contrasti, grafia e contenuti.

- **Un solo tema, chiaro.** Il tema scuro è stato eliminato: niente
  interruttore, niente regole CSS o codice JavaScript per il tema scuro.
- **Grafica a fasce**: fasce piene da bordo a bordo, alternate verdi e
  chiare, senza sfumature.
  - testata e piede: verde scuro `#014A26`, testo bianco; nella testata
    il logo con lo sfondo trasparente, senza riquadro; nelle pagine
    interne logo e nome sono un collegamento alla home (nella home no);
  - **fascia verde** `#026C37`: titoli gialli `#FFF33F` in Arial Black
    maiuscolo, testo bianco, pulsante a pillola bianco con testo verde;
  - **fascia chiara** `#F3F7EC`: titoli verdi `#026C37` in Arial Black
    maiuscolo, testo blu notte `#00193C`, pulsante a pillola verde con
    testo bianco;
  - riquadro in evidenza: giallo `#FFF33F`, testo blu notte `#00193C`;
  - schede bianche con angoli tondi e retino (la trama di pallini); sulle
    fasce chiare anche un bordo tenue e un'ombra, perché il bianco su
    `#F3F7EC` ha contrasto 1,1;
  - sulle schede: il simbolo (sulla parte alta colorata, o in un
    quadratino colorato per i serali), un'etichetta piccola in
    maiuscolo, il testo in Arial.
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
- Pagina del liceo (`liceo.html`), grafica a cartolina (punto 13):
  testata e piede della home, con logo e nome che portano alla home.
  Apertura bianca centrata: il titolo è un solo h1 su due righe,
  "titolo" e, al 60% della grandezza, "titolo-riga-2", tutte e due nel
  blu del liceo `#1F5FA8` (dal 27 ottobre 2026 sera: l'unico titolo di
  pagina non verde; le pagine dei percorsi restano verdi); sotto
  il claim del liceo (preso da `home.txt`) in verde, niente occhiello;
  poi il disegno della scuola della home con le stesse linee e la
  stessa animazione, ma nei tre toni dei percorsi (esterna azzurro
  `#1B7DB5`, centrale blu `#2563B3`, interna blu violetto `#2348D6`), con
  i tratti esterni fino ai bordi al computer: l'apertura finisce con
  il disegno. Sul telefono circa 20 pixel fra il titolo e il claim. I
  collegamenti "‹ Torna alla home" e, nei percorsi, "‹ Torna al liceo"
  sono nascosti su richiesta di Alessandra (righe commentate in
  `liceo.txt`). Ordine della pagina: apertura, percorsi, "Le ore a
  confronto", "Vieni a trovarci.", piede.
  - Percorsi: in testa un titolo di livello 2 "I tre percorsi", visibile
    solo ai lettori di schermo (campo `titolo-percorsi` di `liceo.txt`),
    e il sottotitolo, allineato a sinistra, su una riga al computer e con
    le righe pareggiate sul telefono; poi i tre percorsi come gli
    indirizzi della home: trattino corto nel tono del percorso, nome in
    blu notte (titolo di livello 3), spiegazione breve, pulsante secondario
    "Scopri il percorso ›". Ogni percorso è un unico collegamento,
    cliccabile per intero (il link sul nome si allarga a tutto il
    percorso); il pulsante è solo grafico, nascosto al lettore di
    schermo. Sul telefono uno sotto l'altro, al computer tre colonne con
    nome, spiegazione e pulsante su righe comuni (subgrid).
  - "Le ore a confronto" (`id="confronto"`): titolo e riga grigia
    "Ore di lezione alla settimana, anno per anno."; una tabella nello
    stile del quadro orario con una riga per percorso (trattino nel tono
    e nome) e le ore totali alla settimana anno per anno, calcolate dal
    sito: QUADRO BASE più le ore della colonna "ore in più" della
    tabella PERCORSI di `liceo.txt`, mai scritte a mano. Sotto, il
    pulsante secondario "Le materie in più ›", fatto con details/summary
    (niente JavaScript): chiuso all'apertura; aperto, la freccia ruota di
    90 gradi (senza movimento con `prefers-reduced-motion`) e compaiono
    la riga grigia "Le ore in più alla settimana rispetto a Scienze
    applicate, che è il quadro di base." e una tabella con la stessa
    intestazione: per ogni percorso con ore in più una riga-titolo con
    trattino e nome maiuscolo nel tono, poi le materie con "+2", "+1" in
    verde e il trattino grigio dove non ce ne sono. Tutto in 375 pixel.
    Il confronto fra indirizzi (tecnici e liceo) si rimanda a quando ci
    saranno i quadri dei tecnici: ore totali e ore di laboratorio, non
    materia per materia.
  - "Vieni a trovarci." (anche in fondo alle pagine dei percorsi): i
    foglietti delle date, con lo stesso componente e gli stessi dati
    della home (`Grafica.listaDate` in `js/grafica.js`: date passate
    nascoste, stessa disposizione su telefono e computer), poi la nota
    sui turni se c'è (oggi tolta: vedi "Open day" al punto 13), poi il
    pulsante pieno "Prenota un open day ›", tutto da
    `comuni.txt`; se non resta nessuna data futura, solo la frase
    `nessuna-data`, senza foglietti né pulsante.
- Pagine dei percorsi (`liceo-scienze-applicate.html`,
  `liceo-matematico.html`, `liceo-digitale.html`): uguali fra loro,
  cambiano solo titolo e l'attributo `data-percorso` del `<body>` (le
  ore in più stanno nella tabella PERCORSI di `liceo.txt`). Sezioni, in
  quest'ordine, separate dai filetti grigi:
  1. apertura bianca centrata: occhiello grigio maiuscolo "Liceo
     scientifico, opzione Scienze applicate", il nome del percorso in
     verde, poi la spiegazione in blu notte allineata a sinistra;
  2. "Che cosa si impara" (elenco), "Come si studia" (paragrafo), "A chi
     si rivolge" (elenco): non sono schede, ma tre parti con il titolo
     in verde e il testo sotto; le voci degli elenchi hanno un trattino
     grigio `#5B6B80`. Sul telefono una sotto l'altra separate dal
     filetto, con il titolo sopra; al computer (dai 56rem) tre righe una
     sotto l'altra, separate dal filetto, con il titolo a sinistra (un
     terzo della larghezza) e il testo giustificato a destra (due terzi,
     al massimo 46rem);
  3. "Quadro orario" e sotto il pulsante secondario "Confronta i
     percorsi ›" (su una riga anche a 375 pixel), che porta a
     `liceo.html#confronto`;
  4. "Dopo il diploma", sezione normale con il titolo in verde;
  5. "Vieni a trovarci." come in `liceo.html` e, sotto, la riga grigia
     maiuscola "Gli altri percorsi" con i collegamenti agli altri due,
     ognuno con il trattino nel suo tono e il nome sottolineato in verde.
  Ogni blocco compare solo se c'è il suo testo in `liceo.txt`; senza
  nessuna delle tre parti sparisce la loro sezione. La fascia
  "Laboratori e progetti" non esiste più. I segnaposto `[DA COMPLETARE]`
  di Scienze applicate e Liceo Matematico restano visibili. Nella
  pagina del Liceo Digitale nessun collegamento al sito del Liceo
  Digitale.
- **Giustificato: l'unica eccezione all'allineamento a sinistra, solo al
  computer (dai 56rem in su).** Sotto i 56rem (telefono, tablet stretti)
  tutto resta a sinistra. Scelta di Alessandra; da verificare con Chrome
  o Edge su Windows e da riprovare sul telefono, anche su Android.
  - Paragrafi larghi, sillabazione solo per parole di almeno 10 lettere
    con almeno 4 lettere prima e dopo il taglio (`hyphenate-limit-chars:
    10 4 4`):
    - la spiegazione delle pagine dei percorsi e "Dopo il diploma", se
      lunghi almeno 350 caratteri (classe `testo-lungo`, messa da
      `js/liceo.js`): dai 66rem occupano tutta la larghezza del
      contenuto su due colonne (distanza 2.5rem); il sito divide il
      paragrafo alla fine della frase più vicina alla metà dei caratteri,
      così nessuna frase passa da una colonna all'altra e le colonne
      possono finire ad altezze diverse; nell'apertura le due colonne
      stanno centrate sotto il titolo. Sotto i 66rem, e per i testi più
      corti, una colonna sola larga al massimo 46rem, allineata a
      sinistra. Il testo in `liceo.txt` resta intero;
  - Colonne strette, sillabazione più frequente (`hyphenate-limit-chars:
    6 3 3`) per non lasciare buchi fra le parole: le frasi "In questo
    indirizzo imparerai…" degli indirizzi nella home e le spiegazioni
    brevi dei tre percorsi in `liceo.html`; e il testo dei tre blocchi
    delle pagine dei percorsi, nelle righe con il titolo a sinistra (con
    10 4 4 restavano righe con spazi molto larghi); nelle voci degli
    elenchi il trattino grigio resta fuori, a sinistra.
  - Le parole con il trattino ("post-diploma") non si spezzano mai, né
    dopo il trattino né con la sillabazione: `js/grafica.js`
    (`Grafica.paroleIntere`) le chiude in un pezzo intero, senza
    cambiare i file di testo.
  - Restano allineati a sinistra: titoli, occhielli, claim (anche quelli
    degli indirizzi), contatti, piede, tabelle, date degli open day,
    pulsanti e ogni riga breve.
- Grafia: sempre "Liceo scientifico, opzione Scienze applicate", con la
  virgola, nei testi, nei titoli delle schede del browser e nelle
  descrizioni delle pagine.
- Quadro orario: una tabella classica anche sul telefono, che sta in
  375 pixel senza scorrere di lato (testo della tabella a 14 pixel sul
  telefono, 16 dai 40rem; al computer larga al massimo 50rem). Titolo
  "Quadro orario" in verde, senza nessuna riga sotto (scelta di
  Alessandra); niente fascia colorata, niente scheda bianca, niente
  intestazione piena.
  - Intestazione in grigio `#5B6B80` maiuscolo piccolo (12 pixel sul
    telefono, 13 al computer), su due righe: i gruppi "Primo biennio",
    "Secondo biennio", "Quinto anno" (sempre su due righe: "Primo /
    biennio") e sotto "Materia" e gli anni.
  - Righe separate da filetti grigi sottili; due linee verticali di 1
    pixel blu notte `#00193C` fra primo biennio, secondo biennio e
    quinto anno, dall'intestazione al totale.
  - Colonne degli anni: le prime quattro larghe uguali (2,3rem sul
    telefono, 4,5rem al computer), il quinto anno più largo (3,3rem;
    5,5rem al computer). Numeri in blu notte, trattini grigi.
  - Ore in più (Matematico e Digitale): dopo il quadro base, la riga
    "In più nel Liceo Matematico" / "In più nel Liceo Digitale" con un
    trattino e la scritta maiuscola nel tono del percorso, senza fondo
    pieno. Niente giallo, niente legenda.
  - Ultima riga "Totale", con un filetto blu notte sopra e i totali,
    calcolati dal sito, in verde `#026C37`.
- I serali hanno tono da adulti: nei loro testi non si usa il "tu". I
  loro testi stanno in `contenuti/serali.txt`.
- **Il colore della scuola è il verde** `#026C37`: fasce verdi, pulsanti,
  link. Il verde lime `#8DC73C` è solo decorativo, mai per il testo.
- Il teal `#00596B` non si usa più.
- Un colore per indirizzo. Nella home è il fondo della parte alta della
  scheda dell'indirizzo, con il testo bianco, e il bordo di 3 pixel
  della scheda; per i serali è il fondo del quadratino con il simbolo,
  con un bordo sottile blu notte `#00193C`:
  - Meccanica: arancione bruciato `#C2410C` (bianco 5,2), rotella
  - Grafica: rosa scuro `#B8326F` (bianco 5,6), occhio
  - Liceo: blu `#1F5FA8` (bianco 6,4), lampadina
  - Serali: ardesia `#3A4756`, luna (colore da rivedere)
- Percorsi del liceo: tre toni del blu del liceo, legati al percorso e
  non alla posizione, usati solo nelle pagine del liceo per le linee
  del disegno, il trattino accanto al nome, il nome stesso in
  `liceo.html` e la riga "In più nel ..." del quadro orario (sul
  bianco: azzurro 4,5, blu 6,0, blu violetto 7,1; mai sotto 4,5, perché
  la riga "In più nel ..." è a 13 px). Schiariti il 27 ottobre 2026
  sera: prima erano `#2A7AB0`, `#1F5FA8` e `#0F3460`, e il blu scuro
  sembrava nero. Il Liceo Digitale ha poi preso un blu vivo che tende
  al violetto, perché risalti più degli altri due.
  - Scienze applicate: azzurro `#1B7DB5`
  - Liceo Matematico: blu `#2563B3`
  - Liceo Digitale: blu violetto `#2348D6`
  Nessun simbolo per i percorsi.
- I colori sono stati verificati per contrasto (testo almeno 4,5:1) e per
  deuteranopia e protanopia. **Non si cambiano senza dirlo ad
  Alessandra.**
- Il giallo non si usa mai come colore del testo su fondo chiaro.
- **Icone a linea per le funzioni, simboli pieni a adesivo per
  l'identità di indirizzi, serali e percorsi del liceo.** Tutti
  disegnati a mano in SVG, in `immagini/simboli.svg`.
  - Simboli di identità: figure piene in bianco e blu notte, forme
    semplici e generose, leggibili anche a 24 pixel. Disegnati sul
    modello scelto da Alessandra:
    - Meccanica: ingranaggio blu notte a otto denti con, al centro, un
      anello e un fulmine bianchi;
    - Grafica: occhio bianco con contorno blu notte e iride blu, dentro
      i quattro angoli bianchi di un mirino;
    - Liceo: lampadina bianca con contorno blu notte, filamento a Y,
      attacco blu notte e cinque raggi bianchi;
    - Serali: falce di luna con una stella (ancora nello stile vecchio
      ad adesivo).
    Su ogni fondo almeno uno fra bianco e blu notte supera 3:1.
  - Icone a linea, un solo colore: luogo, telefono, busta, globo,
    spunta e croce dei turni,
    calendario.
- Schede degli indirizzi nella home, in due parti:
  - in alto, su fondo pieno nel colore dell'indirizzo e centrati: il
    simbolo di circa 3.4rem senza quadratino, il tipo di scuola bianco
    piccolo maiuscolo spaziato, il nome in Arial Black maiuscolo bianco
    (circa 1.25rem), un filetto giallo di 56×5 pixel;
  - sotto, la parte bianca con il retino: claim verde, frase e in fondo
    "Pagina in preparazione" o il pulsante "Scopri di più" centrato.
  Bordo di 3 pixel nel colore dell'indirizzo. Al computer, con le
  schede affiancate, le tre parti alte sono alte uguali (subgrid).
- Nella scheda dei serali il quadratino è di circa 56 pixel, angoli poco
  arrotondati, bordo sottile blu notte, niente ombra, a sinistra
  accanto a tipo di scuola e nome. La scheda ha un bordo di 3 pixel
  ardesia, come le schede degli indirizzi nel loro colore.
- Il logo è `immagini/logo-natta.png`, con sfondo trasparente. È piccolo
  (231×155 pixel): non va ingrandito molto. Se arriva l'originale in alta
  risoluzione, si sostituisce.

## 7. Come si scrive

- Frasi brevi.
- I termini scolastici si spiegano la prima volta che compaiono
  (curvatura, biennio, articolazione, PCTO, ITS). Eccezione voluta:
  "biennio" nell'intestazione del quadro orario (e delle tabelle del
  confronto) non si spiega.
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
     Curvatura: stesso diploma, con più ore. Le ore stanno in
     `contenuti/liceo.txt`: quadro base di Scienze applicate e ore
     aggiuntive di Matematico e Digitale.
     Il sito del Liceo Digitale non compare né nella home né nelle
     pagine del liceo; il suo indirizzo resta in `comuni.txt`.
     La scheda del liceo nella home è "pronta" dal 27 ottobre 2026 (via
     libera di Alessandra con la pubblicazione della grafica a
     cartolina).
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

## 12. La cartolina "Vieni a trovarci"

Decisa con Alessandra il 26 ottobre 2026, fatta il 27 (sostituisce la
cartolina del 16 ottobre, che resta nell'etichetta Git
`grafica-ottobre`). File:
- `cartolina-facciate.css` e `js/cartolina-facciate.js`: l'aspetto e il
  disegno di fronte e retro. Li usano sia la pagina da stampare sia
  `orientatori.html`, così la cartolina è una sola. Le regole del CSS
  valgono solo dentro la cartolina (cominciano con `.facciata`) e non
  toccano il sito;
- `cartolina.html`, `cartolina.css` e `js/cartolina.js`: la pagina da
  stampare (comandi, fogli, versione A4, versione per i docenti,
  stampa);
- `js/qr.js` (copiato dal Liceo Digitale), `js/grafica.js` (il
  timbro), `contenuti/cartolina.txt`, `immagini/firma-natta.png`.

Il modello, in PDF, è
`materiali-grezzi/cartolina-modello-NON-PUBBLICARE.pdf`: resta solo sul
computer di Alessandra.

- Cartolina fronte e retro, 15 × 10 cm orizzontale, fondo bianco, da
  salvare in PDF con la funzione Stampa di Edge o Chrome. Nessuna
  pagina del sito la collega; ha il `noindex` come le altre. Ai
  docenti la cartolina arriva da `orientatori.html` (punto 13), con
  l'anteprima che si gira e il PDF da scaricare.
- I testi si leggono dai file di contenuto, mai scritti nel codice:
  tipo e nome dei tre indirizzi da `home.txt` (nello stesso ordine
  della home) e l'occhiello per il timbro; nome, `città`, indirizzo,
  telefono, email dell'orientamento e `sito-orientamento` da
  `comuni.txt`; invito, saluto e destinatario da `cartolina.txt`.
- Un solo carattere, Cutive Mono (`fonts/cutive-mono-regular.ttf`).
  Misure in millimetri e caratteri in punti; i colori sono quelli del
  sito, scritti anche in `cartolina.css`.
- **Fronte**: il disegno della scuola con le tre linee nei colori degli
  indirizzi (`immagini/linee-scuola.svg`), largo quanto la facciata, con
  le linee di 0,4 mm che entrano ed escono dai bordi, abbondanza
  compresa. Al posto della vetrata, sotto il tetto curvo fra le due
  torri, il codice QR largo 25 mm (margine bianco compreso), blu notte
  `#00193C` su riquadro bianco, a circa 5 mm dalle linee; porta a
  `sito-orientamento`. Sotto, centrato, "IIS GIULIO NATTA · RIVOLI" in
  maiuscolo spaziato, 9 pt.
- **Retro**, come una cartolina postale, diviso a metà da un filetto
  verticale grigio `#C9C9C4`:
  - a sinistra "Vieni a trovarci." in verde (18 pt, perché stia su una
    riga); i tre indirizzi, ognuno con il trattino corto del suo colore,
    il tipo in grigio `#5B6B80` (7,5 pt) e sotto il nome in blu notte
    (8,5 pt), come nella home (il modello aveva prima il nome); poi "Ti
    aspettiamo," e la firma di Giulio Natta in blu notte, larga 37 mm;
  - a destra, in alto, le onde di annullo nei tre colori, il timbro
    rotondo blu inchiostro `#1F3A6B` leggermente ruotato (lo stesso del
    piede del sito, con il logo e "IIS GIULIO NATTA · ORIENTAMENTO") e
    il francobollo verde (17,7 × 21 mm, bordo dentellato, cornice
    tratteggiata bianca, logo bianco); sotto "DESTINATARIO" in grigio
    maiuscolo, "Al futuro studente" e "o alla futura studentessa" su due
    righe con il filetto sotto e una terza riga vuota per il nome;
  - in basso, a tutta larghezza, il sottopancia dopo un filetto:
    indirizzo, telefono ed email dell'orientamento, 7 pt, grigio, su una
    riga.
- **Firma di Giulio Natta**: `immagini/firma-natta.png`, già blu notte
  `#00193C` su fondo bianco pieno, senza trasparenze (dal 27 ottobre
  2026 sera: con la trasparenza nel PDF compariva un riquadro sottile
  intorno alla firma). La stessa in `orientatori.html`. È pubblicata con la
  cartolina per decisione di Alessandra; restano da verificare la
  licenza del file originale su Wikimedia Commons e il parere della
  dirigente. Il repository pubblico conserva la cronologia: una volta
  pubblicata resta consultabile anche se poi la si toglie.
- **Logo**: il PNG piccolo (231 × 155 pixel), largo al massimo 11 mm.
  Sulla cartolina due immagini già colorate, senza trasparenze, fatte
  da `immagini/logo-natta.png`: `immagini/logo-timbro.png` (blu
  inchiostro su bianco) e `immagini/logo-francobollo.png` (bianco sul
  verde del francobollo). Con il logo colorato dal CSS (maschera) alcuni
  lettori PDF disegnavano due rettangoli. Nel piede del sito il logo
  resta colorato dal CSS. Prima di stampare servirà il file originale.
- **Non ci vanno**, per scelta di Alessandra: mittente, claim generale,
  invito scritto a inquadrare il QR, date degli open day, anno
  scolastico (la cartolina non deve scadere).
- **Stampa**: abbondanza di 3 mm oltre il taglio (facciata 156 × 106
  mm), testi ad almeno 5 mm dal taglio. Qui i caratteri scendono sotto
  gli 8 punti per scelta (7 e 7,5 pt): da verificare su una prova di
  stampa.
  - Versione tipografia: PDF di due pagine da 156 × 106 mm.
  - Versione scuola (`cartolina.html?foglio=a4`): A4 verticale, due
    cartoline uguali una sopra l'altra al centro del foglio, segni di
    taglio agli angoli; pagina 1 i fronti, pagina 2 i retri,
    fronte-retro capovolgendo sul lato lungo.
  - Versione per i docenti (`cartolina.html?foglio=docenti`): A4
    verticale come la versione scuola: due cartoline uguali una sopra
    l'altra, con i segni di taglio; sotto la seconda, fuori dai segni,
    due righe grigie `#5B6B80` a 8 pt (`pdf-riga-1` e `pdf-riga-2`
    della sezione `ORIENTATORI` di `comuni.txt`). Pagina 1 i fronti,
    pagina 2 i retri. È il PDF
    `materiali/cartolina-natta.pdf`, che si scarica da
    `orientatori.html`; oggi è una versione non definitiva.
- **Nomi degli indirizzi**: le ultime due parole non si separano mai
  (`Pezzi.nomeIntero` in `js/comuni.js`), così "Meccanica, meccatronica
  ed energia" va a capo prima di "ed energia", nella home e sul retro.
  Nei file di testo resta lo spazio normale.
- Se cambia l'indirizzo del sito, prima di stampare si controlla che il
  QR porti a quello nuovo. Per ora il QR porta alla home del sito di
  orientamento; da decidere prima della stampa se portare direttamente
  agli open day.
- Ancora aperti: tipografia o stampa a scuola e numero di copie,
  timbro ufficiale (da proporre alla dirigente), file originale del
  logo, leggibilità dei contatti in Cutive Mono su una prova di stampa.

## 13. La grafica "a cartolina" (home, pagine del liceo, docenti orientatori)

Decisa con Alessandra il 26 ottobre 2026, corretta la sera stessa.
Le decisioni complete, anche sulla nuova cartolina "Vieni a
trovarci", stanno in `docs/decisioni-grafica.md`: si leggono prima
di lavorare sulla grafica. La grafica nuova la hanno la home e le
quattro pagine del liceo (le regole del liceo sono al punto 6);
mancano ancora le pagine degli indirizzi tecnici e dei serali. Lo stato del sito prima del cambio è
segnato dall'etichetta Git `grafica-ottobre`; il lavoro sta sul ramo
`grafica-cartolina` finché Alessandra non dice di unirlo a `main`.
File: `grafica.css` (tutte le pagine del sito tranne la cartolina),
`js/grafica.js` (il disegno delle linee, il piede e il timbro, per la
home, il liceo e `orientatori.html`), `js/home.js`, `js/liceo.js`,
`js/orientatori.js`, `immagini/linee-scuola.svg`, `fonts/`.

- **Fondo tutto bianco.** Niente fasce verdi o chiare, niente retino,
  niente filetti gialli, niente schede colorate, niente simboli ad
  adesivo né icone. Le sezioni sono separate da un filetto grigio
  sottile (`#D5D9DE`, solo decorativo).
- **Verde** `#026C37` per titoli, pulsanti e link. Testo blu notte
  `#00193C`. Grigio `#5B6B80` (5,4 sul bianco) per tipo di scuola,
  anno dei serali, occhiello, "Pagina in preparazione" e nota dei
  turni.
- **Arancione, rosa e blu indicano solo i tre indirizzi** (Meccanica
  `#B45309`, Grafica `#A3288C`, Liceo `#1F5FA8`; sul bianco 5,0, 6,5
  e 6,4) e non si usano per
  altro: le linee del disegno, il trattino accanto al nome e, nella
  home, il nome dell'indirizzo (dal 27 ottobre 2026 sera; "opzione"
  davanti a "Scienze applicate" resta in blu notte). Arancione e rosa
  cambiati il 27 ottobre 2026 sera, perché erano troppo simili: prima
  `#C2410C` e `#B8326F`; l'arancione ora tende al giallo, il rosa al
  viola. Valgono anche per il disegno (`immagini/linee-scuola.svg`) e
  per la cartolina. Nei
  serali il trattino ha il colore dell'indirizzo (Meccanica e
  meccatronica arancione, Grafica e comunicazione rosa).
- **Trattino**: corto (1,5rem × 3 px), accanto alla prima riga, solo
  nel colore di un indirizzo (le date degli open day non lo hanno).
- **Righe pareggiate**: titoli e testi brevi centrati (titolo della
  pagina, occhiello, claim del liceo, titoli delle sezioni) hanno
  `text-wrap: balance`, così nessuna parola resta sola a capo.
- **Nome della scuola**: "IIS Giulio Natta", senza virgolette (campo
  `nome` di `comuni.txt`). Il maiuscolo "IIS GIULIO NATTA" solo nella
  testata (e lungo il timbro, che è un disegno).
- **Testata**: bianca, logo e nome della scuola in maiuscolo verde,
  filetto sotto.
- **Apertura**, centrata: occhiello "ORIENTAMENTO 2026/27" (campo
  `occhiello` di `home.txt` più l'anno degli open day); titolo "The
  next step is yours." (campo `titolo-inglese` di `home.txt`) che si
  gira e diventa "Il prossimo passo è tuo." (`titolo-italiano`).
  Deciso il 27 ottobre 2026; il `claim` resta in `home.txt` ma non
  compare.
  - Stesso posto e stile del titolo di prima: verde, centrato, 24
    pixel sul telefono. Le due frasi occupano lo stesso spazio (una
    sopra l'altra nella stessa casella), al massimo due righe ciascuna
    sul telefono, con `text-wrap: balance`; la più corta sta in mezzo
    allo spazio.
  - Un tocco o un clic sul titolo lo gira di 180 gradi in orizzontale
    in 0,8 secondi, come la cartolina; un secondo tocco torna
    all'inglese. Nessun segno indica che il titolo si gira, per scelta
    di Alessandra (27 ottobre 2026 sera): niente freccia circolare e
    niente pulsante "In italiano ›" / "In English ›". Da tastiera il
    titolo non si gira; il lettore di schermo legge comunque le due
    frasi.
  - Quando le tre linee del disegno hanno finito di disegnarsi, il
    titolo fa da solo un giro di andata e ritorno (in italiano per
    circa 2 secondi), una volta sola e solo se la persona non l'ha già
    toccato.
  - Un unico h1 con le due frasi: il lettore di schermo le legge tutte
    e due; la frase inglese ha `lang="en"`.
  - Con `prefers-reduced-motion` niente giro automatico e niente
    rotazione: il tocco scambia le frasi.
  Sotto, il disegno delle tre linee; poi i
  pulsanti "Dopo la terza media" (pieno) e "Corsi serali per adulti"
  (vuoto): sul telefono uno sotto l'altro, larghi uguali, a tutta
  larghezza; al computer affiancati. Lo spazio fra le due torri del
  disegno resta vuoto (ancora aperto se accoglierà qualcosa).
- **Il disegno** `immagini/linee-scuola.svg` resta com'è (spessore
  1.6, quello della cartolina). `js/grafica.js` lo legge e lo mette nella
  pagina; lo spessore sullo schermo è 1,4 px sotto i 40rem (telefono) e 2,4 px dai 40rem in su (lo ricalcola
  il JS al cambiare della larghezza). Il disegno è largo quanto la
  finestra; la scuola al centro al massimo 44rem, perché al computer
  pulsanti e percorsi restino nella prima schermata. Quando la finestra è
  più larga, il JS allunga solo i tratti orizzontali esterni delle tre
  linee fino ai bordi, alle stesse altezze. Sul telefono la scuola è
  già larga quanto lo schermo. Le linee si disegnano
  all'apertura, una dopo l'altra (arancione, rosa, blu); con
  `prefers-reduced-motion` compaiono già intere. `aria-hidden`.
- **Ordine delle sezioni**: apertura, open day (subito dopo, perché le
  date scadono), indirizzi ("Dopo la terza media"), serali, contatti.
  Le date passate il sito le nasconde da solo (l'anno si ricava da
  `anno` di `comuni.txt`: settembre-dicembre il primo, gennaio-agosto
  il secondo; una data sparisce dal giorno dopo). Quando non ne resta
  nessuna, la sezione degli open day scende dopo gli indirizzi e mostra
  solo la frase `nessuna-data`, senza nota e senza pulsante.
- **Open day**: per ogni data un foglietto da calendario (contorno di
  1 px blu notte, angoli vivi, largo 58 px; dentro il mese abbreviato
  maiuscolo grigio a 12 px, spaziato, e il numero del giorno a 30 px in
  verde; niente anellini, niente striscia piena; `aria-hidden`, la data
  per intero è scritta per il lettore di schermo). Accanto il giorno
  della settimana e sotto i due turni su una riga, separati da " · "; un
  turno non si spezza mai; la riga va a capo solo dopo il punto medio
  e solo se non ci sta (un turno esaurito sul telefono). Turni a 14 px
  sul telefono, 16 dai 40rem. Turno esaurito con la scritta rossa
  "Esaurito" accanto (rosso `#B91C1C` solo qui, sempre con la
  scritta). Poi la nota sui turni (campo `nota-turni` di `comuni.txt`;
  dal 27 ottobre 2026 tolta su richiesta di Alessandra: la riga ha il #
  davanti) e il pulsante pieno "Prenota un open
  day". Una colonna sul telefono, due dai 48rem, tre dai 66rem (prima
  i turni non ci starebbero su una riga).
- **Indirizzi**: trattino del colore accanto a tipo di scuola (grigio,
  maiuscolo) e nome; sotto, allineati a loro, claim in verde, frase,
  "Pagina in preparazione" o il pulsante vuoto "Scopri di più" (per il
  lettore di schermo "Scopri di più: tipo, nome", per esempio "Scopri
  di più: Liceo scientifico, opzione Scienze applicate"). Al
  computer tutti e tre su una riga, mai due più uno, con tipo, nome,
  claim, testi e fondo su righe comuni (subgrid): ogni pezzo parte alla
  stessa altezza nelle tre colonne. Claim a 19 px.
- **Serali**: "Corsi serali per adulti", anno in grigio maiuscolo, "Per
  chi lavora o vuole riprendere gli studi.", i due percorsi con il
  trattino; in fondo il pulsante verso la pagina dei serali se è
  "pronta", altrimenti, finché la pagina non c'è, il pulsante
  secondario "Come iscriversi ›" (scritta e link dai campi
  `pulsante` e `link` della sezione PAGINA di `serali.txt`), che si apre
  in una nuova scheda con il testo nascosto per il lettore di schermo.
  Tono da adulti.
- **Contatti**: "Chiama", "Scrivi all'orientamento", "Come arrivare",
  link sottolineati in verde alti almeno 44 px, con il dato sotto,
  fuori dal link, così si copia. Niente icone. "Come arrivare" apre
  Google Maps in una nuova scheda, con il testo nascosto per il
  lettore di schermo. Al computer affiancati.
- **Piede**: bianco; il timbro rotondo blu inchiostro `#1F3A6B` (colore
  solo per il timbro) con il logo al centro tinto di blu e "IIS GIULIO
  NATTA · ORIENTAMENTO" lungo il cerchio. Uguale in tutte le pagine.
  Niente dati della scuola (nome, indirizzo, centralino, segreteria,
  sito): ripetevano quasi uguali la sezione Contatti della home e sono
  stati tolti da tutte le pagine (scelta di Alessandra, 27 ottobre 2026
  sera). Nelle pagine del liceo quindi non c'è nessun recapito; in
  `orientatori.html` resta "Scrivi all'orientamento". Le etichette del
  piede restano in `comuni.txt`, non usate.
  - Accanto al timbro la riga "Sei un docente
    orientatore?" in grigio e il link verde sottolineato "Scarica la
    cartolina del Natta ›" verso `orientatori.html` (sezione
    `ORIENTATORI` di `comuni.txt`; la freccia la aggiunge il sito).
    Non compare su `orientatori.html` stessa. Interruttore: `stato`
    della sezione. Con "in preparazione" la riga non compare su
    nessuna pagina. Dal 27 ottobre 2026 sera è "pronta", con il PDF
    non definitivo, per scelta di Alessandra.
- **Testata**: dove logo e nome portano alla home, il link si chiama
  per il lettore di schermo "IIS Giulio Natta, pagina iniziale"
  (`aria-label` messo da `js/comuni.js`), senza il maiuscolo e senza lo
  spazio prima della virgola. Nel titolo di `liceo.html` la virgola
  nascosta sta attaccata alla prima riga (`.solo-lettori-in-riga`): si
  sente "Liceo scientifico, opzione Scienze applicate".
- **Pagina per i docenti orientatori** (`orientatori.html`, con
  `noindex`): testata e piede come le altre pagine; al centro il
  titolo "Per i docenti orientatori", l'anteprima della cartolina
  "Vieni a trovarci" (larga al massimo 42rem, proporzioni 3:2, bordo
  sottile grigio e ombra leggera; si vede la cartolina rifilata, senza
  abbondanza) e sotto i pulsanti "Scarica la cartolina in PDF ›"
  (pieno, con sotto la riga grigia "Versione non definitiva." a 14 px)
  e "Gira la cartolina ›" (vuoto): affiancati al computer, sul
  telefono uno sotto l'altro a tutta larghezza. Sotto i pulsanti
  "Scrivi all'orientamento", sottolineato in verde, con sotto
  l'indirizzo email, come nei contatti della home. Le scritte stanno
  nella sezione `ORIENTATORI` di `comuni.txt`.
  - Fronte e retro li disegna `js/cartolina-facciate.js`, lo stesso
    codice di `cartolina.html`, con gli stessi file: niente immagini
    copiate. `cartolina.html` resta la pagina da stampare.
  - La cartolina non è un pulsante: con il mouse o con il dito si gira
    toccandola; da tastiera si gira solo con il pulsante "Gira la
    cartolina". 180 gradi in orizzontale in 0,8 secondi; con
    `prefers-reduced-motion` il cambio di faccia è immediato.
  - Il lettore di schermo legge solo la faccia che si vede (l'altra ha
    `aria-hidden`): del fronte la descrizione "Fronte: il disegno della
    scuola tracciato da tre linee e un codice QR che porta al sito di
    orientamento."; del retro tutto il testo della cartolina, letto dai
    file di contenuto. Dopo ogni giro un testo nascosto avvisa "Ora si
    vede il retro." oppure "Ora si vede il fronte.".
  - Il PDF è `materiali/cartolina-natta.pdf` (va online, a differenza di
    `materiali-grezzi/`), salvato da `cartolina.html?foglio=docenti`
    con la funzione Stampa di Edge. Se il file non c'è, il pulsante non
    compare. Il QR porta all'indirizzo di GitHub Pages
    (`sito-orientamento`): se il sito cambia indirizzo, le copie già
    stampate porteranno al vecchio.
  Il timbro è largo 110 px sul telefono e 120 al computer,
  scritta lungo il cerchio a 11 px sul telefono; è decorativo
  (`aria-hidden`), le parole vengono da `comuni.txt` e `home.txt`.
- **Pulsanti**: rettangolo ad angoli vivi, freccia "›" disegnata con
  il CSS (il "›" del Cutive Mono è uguale a ">"; scelta di Alessandra),
  nascosta al lettore di schermo; pieni verdi con testo bianco, oppure bianchi con
  bordo e testo verdi; altezza minima 44 px.
- **Focus da tastiera**: contorno blu notte di 3 px.
