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
  none` impedisce il grassetto finto. Testi ad almeno 16 px (di base
  17; claim degli indirizzi 19), interlinea 1,6. Non è più Arial: oggi lo usa la home;
  le altre pagine sono ancora in Arial finché non passano alla grafica
  nuova (punto 13).

## 6. Grafica

**Attenzione:** la home (`index.html`) ha la grafica nuova "a
cartolina", descritta al punto 13. Le regole di questo punto valgono
per le altre pagine, che usano ancora `stile.css`, finché non si
rifanno anche loro; le parti che parlano della home (fasce della home,
schede degli indirizzi, open day, serali, contatti, piede della home)
sono superate.

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
- Pagina del liceo (`liceo.html`): testata e piede della home; apertura
  verde centrata (i collegamenti "‹ Torna alla home" e, nei percorsi,
  "‹ Torna al liceo" sono nascosti su richiesta di Alessandra: righe
  commentate in `liceo.txt`), il quadratino blu con la lampadina, il claim del liceo (preso da
  `home.txt`) piccolo sopra il titolo; il titolo è un solo h1 su due
  righe, "titolo" e, al 60% della grandezza, "titolo-riga-2".
  Disposizione mista, solo con il CSS: sul telefono lampadina (quadratino
  di 80 pixel), claim, titolo e sottotitolo uno sotto l'altro; dai 600
  pixel in su claim in alto, poi lampadina e titolo affiancati (quadratino
  alto quanto le due righe del titolo, gruppo centrato), poi il
  sottotitolo. Fra 600 e circa 770 pixel il titolo rimpicciolisce per
  restare su due righe. Sotto,
  su fascia chiara, le tre schede dei percorsi, ognuna un unico link
  cliccabile per intero, nessun simbolo, con un bordo di 2 pixel nel
  tono del percorso:
  - parte alta piena nel tono del percorso (vedi più sotto), con il
    nome in Arial Black maiuscolo bianco centrato (24 pixel a 375 di
    schermo, 26 più largo, mai sotto 22: non deve andare a capo) e un
    filetto giallo decorativo di 56×5 pixel;
  - parte bianca con la spiegazione breve e la pillola "Scopri il
    percorso ›", nello stesso tono della parte alta, testo bianco in
    grassetto, larga quanto la scheda, in fondo. La pillola è solo
    grafica (nascosta al lettore di schermo), non un secondo link.
- Pagine dei percorsi (`liceo-scienze-applicate.html`,
  `liceo-matematico.html`, `liceo-digitale.html`): uguali fra loro,
  cambiano solo titolo e gli attributi `data-percorso` e `data-ore` del
  `<body>`. Fasce, in quest'ordine:
  1. apertura verde: etichetta e titolo centrati, sotto la spiegazione
     larga quanto la fascia interna;
  2. fascia chiara con tre schede: "Che cosa si impara" (elenco),
     "Come si studia" (paragrafo), "A chi si rivolge" (elenco). Stile
     delle schede dei percorsi di `liceo.html`: parte alta nel tono del
     percorso con il titolo (h2) bianco in Arial Black maiuscolo circa
     1.05rem, parte bianca con il retino, bordo di 2 pixel. Dagli 800
     pixel affiancate e alte uguali;
  3. quadro orario su fascia blu (tono del percorso);
  4. "Dopo il diploma", fascia chiara.
  Nelle pagine dei percorsi i titoli delle fasce ("Quadro orario", "Dopo
  il diploma") sono scritti in minuscolo, non in maiuscolo come nel resto
  del sito.
  Ogni blocco compare solo se c'è il suo testo in `liceo.txt`; senza
  nessuna delle tre schede sparisce la loro fascia. La fascia
  "Laboratori e progetti" non esiste più. Tutti i testi (spiegazione,
  schede, Dopo il diploma) sono giustificati, anche sul telefono, con
  la sillabazione automatica. Nella
  pagina del Liceo Digitale nessun collegamento al sito del Liceo
  Digitale.
- Grafia: sempre "Liceo scientifico, opzione Scienze applicate", con la
  virgola, nei testi, nei titoli delle schede del browser e nelle
  descrizioni delle pagine.
- Quadro orario: una vera tabella in una scheda bianca senza retino,
  che sul telefono sta in 375 pixel senza scorrere di lato.
  - La fascia del quadro orario (`fascia-quadro`) ha il fondo pieno nel
    tono del percorso, con il titolo "Quadro orario" giallo, centrato, scritto in minuscolo, e la
    tabella sulla sua scheda bianca.
  - Intestazione: una fascia piena nel tono del percorso, scritte in
    bianco grassetto, su due righe: i gruppi "Primo biennio", "Secondo
    biennio", "Quinto anno" (11 pixel sul telefono, 13 al computer,
    sempre su due righe: "Primo / biennio") e sotto "Materia" e gli
    anni. Due linee verticali di 2 pixel dividono i gruppi: bianche
    nell'intestazione, blu notte nel resto della tabella.
  - Colonne degli anni: le prime quattro larghe uguali (2,6rem sul
    telefono, il minimo perché "Quinto" ci entri; 4,5rem al computer),
    il quinto anno più largo (3,2rem; 5,5rem al computer). Righe
    bianche, numeri in grassetto blu notte, trattini grigi `#5B6B80`.
  - Ore in più (Matematico e Digitale): dopo il quadro base, sotto una
    riga-titolo "In più nel ..." nel tono del percorso, testo bianco
    maiuscolo. Niente giallo, niente legenda.
  - Ultima riga "Totale", con i totali calcolati dal sito in Arial
    Black.
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
- Percorsi del liceo: tre toni di blu, legati al percorso e non alla
  posizione, usati come fondo della parte alta delle schede e della
  pillola "Scopri il percorso", sempre con testo bianco grande o in
  grassetto (mai testo piccolo e sottile su questi fondi):
  - Scienze applicate: azzurro `#2A7AB0` (bianco 4,7)
  - Liceo Matematico: blu `#1F5FA8` (bianco 6,4)
  - Liceo Digitale: blu scuro `#0F3460` (bianco 12,5)
  Simboli previsti ma non ancora usati: beuta (Scienze applicate), π
  disegnato come forma (Liceo Matematico), `</>` (Liceo Digitale).
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
     Curvatura: stesso diploma, con più ore. Le ore stanno in
     `contenuti/liceo.txt`: quadro base di Scienze applicate e ore
     aggiuntive di Matematico e Digitale.
     Il sito del Liceo Digitale non compare né nella home né nelle
     pagine del liceo; il suo indirizzo resta in `comuni.txt`.
     La scheda del liceo nella home resta "in preparazione" finché
     Alessandra non dà il via libera.
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

## 12. La cartolina di presentazione

Decisa con Alessandra il 16 ottobre 2026. File: `cartolina.html`,
`cartolina.css`, `js/cartolina.js`, `js/qr.js` (copiato dal Liceo
Digitale) e `contenuti/cartolina.txt`.

- Cartolina fronte e retro, 10 × 15 cm verticale, da salvare in PDF con
  la funzione Stampa di Edge o Chrome. Nessuna pagina del sito la
  collega; ha il `noindex` come le altre.
- I testi si leggono dai file di contenuto, mai scritti nel codice:
  claim generale e schede da `home.txt`; nome, `città`, contatti e
  `sito-orientamento` da `comuni.txt`; la riga sotto il QR da
  `cartolina.txt`.
- **Fronte**, fondo verde `#026C37`: in alto il logo su un riquadro
  bianco con gli angoli tondi (sul verde il logo verde si vedeva male;
  la fascia verde scuro è stata provata e tolta), accanto nome della
  scuola e città in bianco; sotto le tre schede degli indirizzi una
  sotto l'altra, alte uguali. Parte alta, bassa, nel colore
  dell'indirizzo con il simbolo (10 mm) a sinistra e accanto tipo di
  scuola (bianco, maiuscolo piccolo) e nome (Arial Black maiuscolo
  bianco), senza filetto giallo (tolto su richiesta di Alessandra);
  parte bianca con il claim in verde, centrato, a 9,5 punti perché
  stia su una riga, e sotto, in blu notte a 8,5 punti, la frase "In questo
  indirizzo imparerai…" (colonna `frase` di `home.txt`, aggiunta su
  richiesta di Alessandra); bordo nel colore dell'indirizzo. Niente
  retino.
- **Retro**, a fasce come il sito (verde, chiaro, verde). In alto una
  fascia verde da bordo a bordo con il claim generale in giallo, Arial
  Black maiuscolo, a capo dopo la prima virgola ("Un'unica scuola," /
  "tanti modi di imparare."). Poi, su fondo chiaro `#F3F7EC`: i tre
  simboli degli indirizzi in fila, ognuno in un quadratino del colore
  dell'indirizzo con bordo sottile blu notte; il QR verso
  `sito-orientamento` (nero su riquadro bianco largo 45 mm, il codice
  di circa 3,3 cm, mai sotto 2,5); sotto il QR "Vieni a trovarci!" e,
  a capo, l'invito a inquadrare il QR (righe `sotto-qr` di
  `cartolina.txt`); indirizzo scritto
  per esteso del sito della scuola (campo `sito`, www.itisgiulionatta.it,
  scelta di Alessandra: il QR porta all'orientamento, la scritta al
  sito del Natta); fascia verde con telefono, email dell'orientamento e
  indirizzo.
- **Non ci vanno**: date
  degli open day, anno scolastico (la cartolina non deve scadere), i
  percorsi del liceo (avranno una cartolina a parte), una sezione sui
  serali.
- **Stampa**: misure in millimetri, caratteri in punti. Abbondanza di
  3 mm oltre il taglio (facciata 106 × 156 mm), testi ad almeno 5 mm
  dal taglio, Arial, nessun testo sotto gli 8 punti.
  - Versione tipografia: PDF di due pagine da 106 × 156 mm.
  - Versione scuola (`cartolina.html?foglio=a4`): A4 orizzontale, due
    cartoline uguali affiancate al centro del foglio, segni di taglio
    agli angoli; pagina 1 i fronti, pagina 2 i retri, fronte-retro
    capovolgendo sul lato corto.
- Il logo è un PNG di 231 pixel: sulla cartolina è largo 18 mm (circa
  325 punti per pollice) e non va ingrandito.
- Se cambia l'indirizzo del sito, prima di stampare si controlla che il
  QR porti a quello nuovo.
- Ancora aperti: tipografia o stampa a scuola e numero di copie,
  dominio del sito, logo in un file per la stampa.

## 13. La grafica "a cartolina" (home)

Decisa con Alessandra il 26 ottobre 2026, corretta la sera stessa.
Le decisioni complete, anche sulla nuova cartolina "Vieni a
trovarci", stanno in `docs/decisioni-grafica.md`: si leggono prima
di lavorare sulla grafica. Per ora la grafica nuova la ha solo la home;
le altre pagine passano dopo. Lo stato del sito prima del cambio è
segnato dall'etichetta Git `grafica-ottobre`; il lavoro sta sul ramo
`grafica-cartolina` finché Alessandra non dice di unirlo a `main`.
File: `grafica.css` (lo usa solo `index.html`; `stile.css` resta per
le altre pagine), `js/home.js`, `immagini/linee-scuola.svg`, `fonts/`.

- **Fondo tutto bianco.** Niente fasce verdi o chiare, niente retino,
  niente filetti gialli, niente schede colorate, niente simboli ad
  adesivo né icone. Le sezioni sono separate da un filetto grigio
  sottile (`#D5D9DE`, solo decorativo).
- **Verde** `#026C37` per titoli, pulsanti e link. Testo blu notte
  `#00193C`. Grigio `#5B6B80` (5,4 sul bianco) per tipo di scuola,
  anno dei serali, occhiello, "Pagina in preparazione" e nota dei
  turni.
- **Arancione, rosa e blu indicano solo i tre indirizzi** (Meccanica
  `#C2410C`, Grafica `#B8326F`, Liceo `#1F5FA8`) e non si usano per
  altro: le linee del disegno e il trattino accanto al nome. Nei
  serali il trattino ha il colore dell'indirizzo (Meccanica e
  meccatronica arancione, Grafica e comunicazione rosa).
- **Trattino**: corto (1,5rem × 3 px), accanto alla prima riga, solo
  nel colore di un indirizzo (le date degli open day non lo hanno).
- **Nome della scuola**: "IIS Giulio Natta", senza virgolette (campo
  `nome` di `comuni.txt`). Il maiuscolo "IIS GIULIO NATTA" solo nella
  testata (e lungo il timbro, che è un disegno).
- **Testata**: bianca, logo e nome della scuola in maiuscolo verde,
  filetto sotto.
- **Apertura**, centrata: occhiello "ORIENTAMENTO 2026/27" (campo
  `occhiello` di `home.txt` più l'anno degli open day); titolo = il
  `claim` di `home.txt`; sotto, il disegno delle tre linee; poi i
  pulsanti "Dopo la terza media" (pieno) e "Corsi serali per adulti"
  (vuoto): sul telefono uno sotto l'altro, larghi uguali, a tutta
  larghezza; al computer affiancati. Lo spazio fra le due torri del
  disegno resta vuoto (ancora aperto se accoglierà qualcosa).
- **Il disegno** `immagini/linee-scuola.svg` resta com'è (spessore
  1.6, quello della cartolina). `js/home.js` lo legge e lo mette nella
  pagina; lo spessore sullo schermo è sempre circa 2,4 px (lo ricalcola
  il JS al cambiare della larghezza). Il disegno è largo quanto la
  finestra; la scuola al centro al massimo 60rem. Quando la finestra è
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
  scritta). Poi la nota sui turni e il pulsante pieno "Prenota un open
  day". Una colonna sul telefono, due dai 48rem, tre dai 66rem (prima
  i turni non ci starebbero su una riga).
- **Indirizzi**: trattino del colore accanto a tipo di scuola (grigio,
  maiuscolo) e nome; sotto, allineati a loro, claim in verde, frase,
  "Pagina in preparazione" o il pulsante vuoto "Scopri di più". Al
  computer tutti e tre su una riga, mai due più uno, con tipo, nome,
  claim, testi e fondo su righe comuni (subgrid): ogni pezzo parte alla
  stessa altezza nelle tre colonne. Claim a 19 px.
- **Serali**: "Corsi serali per adulti", anno in grigio maiuscolo, "Per
  chi lavora o vuole riprendere gli studi.", i due percorsi con il
  trattino, "Pagina in preparazione" o il pulsante. Tono da adulti.
- **Contatti**: "Chiama", "Scrivi all'orientamento", "Come arrivare",
  link sottolineati in verde alti almeno 44 px, con il dato sotto,
  fuori dal link, così si copia. Niente icone. "Come arrivare" apre
  Google Maps in una nuova scheda, con il testo nascosto per il
  lettore di schermo. Al computer affiancati.
- **Piede**: bianco; il timbro rotondo blu inchiostro `#1F3A6B` (colore
  solo per il timbro) con il logo al centro tinto di blu e "IIS GIULIO
  NATTA · ORIENTAMENTO" lungo il cerchio, accanto ai dati della scuola
  (nome, indirizzo, telefono, email della segreteria, sito; link
  verdi). Il timbro è largo 110 px sul telefono e 120 al computer,
  scritta lungo il cerchio a 11 px sul telefono; è decorativo
  (`aria-hidden`), le parole vengono da `comuni.txt` e `home.txt`.
- **Pulsanti**: rettangolo ad angoli vivi, freccia "›" disegnata con
  il CSS (il "›" del Cutive Mono è uguale a ">"; scelta di Alessandra),
  nascosta al lettore di schermo; pieni verdi con testo bianco, oppure bianchi con
  bordo e testo verdi; altezza minima 44 px.
- **Focus da tastiera**: contorno blu notte di 3 px.
