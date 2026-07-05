// HealthLens Stage 1J
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const STORE_KEY = 'healthlens.profile.1j';
const active = { item: null, tab: 'overview', visibleLayers: new Set(['skin','organ']), rotation: 0, tilt: 0, opacity: .92 };

async function unregisterOldCaches(){
  try{
    if('serviceWorker' in navigator){
      const regs = await navigator.serviceWorker.getRegistrations();
      for(const reg of regs) await reg.unregister();
    }
    if('caches' in window){
      const keys = await caches.keys();
      await Promise.all(keys.map(k=>caches.delete(k)));
    }
  }catch(e){}
}

const layerConfig = [
  {key:'skin', label:'Biologisch lichaam', group:'skinLayer'},
  {key:'muscle', label:'Spieren', group:'muscleLayer'},
  {key:'skeleton', label:'Skelet', group:'skeletonLayer'},
  {key:'organ', label:'Organen', group:'organLayer'},
  {key:'vessel', label:'Bloedvaten', group:'vesselLayer'},
  {key:'nerve', label:'Zenuwen', group:'nerveLayer'},
  {key:'hormone', label:'Hormonen', group:'hormoneLayer'},
];

const info = {
  head:{title:'Hoofd / schedelregio',system:'Lichaam',summary:'Algemene hoofdregio met huid, schedel, hersenen, bloedvaten en zenuwen.',overview:['Bevat hersenen, schedel, ogen, oren, neus, mond en belangrijke bloedvaten/zenuwen.'],symptoms:['Hoofdpijn','Duizeligheid','Huidafwijking','Letsel'],redflags:['Plots uitval, scheve mond, verwardheid of bewustzijnsdaling.'],prevention:['Helm waar nodig, slaap, bloeddrukcontrole.'],sub:['Hersenen','Schedel','Aangezichtszenuwen']},
  torso:{title:'Romp',system:'Lichaam',summary:'Borst- en buikgebied met vitale organen.',overview:['Bevat hart, longen, lever, maag, darmen, nieren en grote vaten.'],symptoms:['Buikpijn','Borstpijn','Benauwdheid','Rugpijn'],redflags:['Drukkende borstpijn, ernstige benauwdheid, hevige buikpijn.'],prevention:['Beweging, voeding, rookstop, screening waar relevant.'],sub:['Borstkas','Bovenbuik','Onderbuik']},
  pelvis:{title:'Bekkenregio',system:'Lichaam',summary:'Gebied met blaas, bekkenbodem, bekkenbotten en voortplantings-/hormooncontext.',overview:['Belangrijk voor plassen, ontlasting, voortplanting en houding.'],symptoms:['Onderbuikpijn','Plasklachten','Bekkenpijn'],redflags:['Niet kunnen plassen, hevige pijn, zwangerschap met pijn/bloeding.'],prevention:['Bekkenbodemzorg, vocht, veilige seksuele gezondheid.'],sub:['Blaas','Bekkenbodem','Geslachtshormonen']},
  'left-arm':{title:'Linker arm',system:'Lichaam',summary:'Armregio met spieren, botten, vaten en zenuwen.',overview:['Belangrijk voor kracht, grip en gevoel.'],symptoms:['Pijn','Tintelingen','Krachtsverlies','Zwelling'],redflags:['Koude bleke arm, acute krachtuitval, ernstige zwelling.'],prevention:['Ergonomie, spierkracht, belasting doseren.'],sub:['Schouder','Elleboog','Pols/hand']},
  'right-arm':{title:'Rechter arm',system:'Lichaam',summary:'Armregio met spieren, botten, vaten en zenuwen.',overview:['Belangrijk voor kracht, grip en gevoel.'],symptoms:['Pijn','Tintelingen','Krachtsverlies','Zwelling'],redflags:['Koude bleke arm, acute krachtuitval, ernstige zwelling.'],prevention:['Ergonomie, spierkracht, belasting doseren.'],sub:['Schouder','Elleboog','Pols/hand']},
  'left-leg':{title:'Linker been',system:'Lichaam',summary:'Beenregio met heup, knie, spieren, vaten en zenuwen.',overview:['Belangrijk voor lopen, balans en bloedcirculatie.'],symptoms:['Kniepijn','Kramp','Zwelling','Tintelingen'],redflags:['Acuut dik pijnlijk been, koud/wit been of niet kunnen belasten.'],prevention:['Bewegen, spierkracht, valpreventie, goed schoeisel.'],sub:['Heup','Knie','Enkel/voet']},
  'right-leg':{title:'Rechter been',system:'Lichaam',summary:'Beenregio met heup, knie, spieren, vaten en zenuwen.',overview:['Belangrijk voor lopen, balans en bloedcirculatie.'],symptoms:['Kniepijn','Kramp','Zwelling','Tintelingen'],redflags:['Acuut dik pijnlijk been, koud/wit been of niet kunnen belasten.'],prevention:['Bewegen, spierkracht, valpreventie, goed schoeisel.'],sub:['Heup','Knie','Enkel/voet']},
  brain:{title:'Hersenen',system:'Organen / zenuwstelsel',summary:'Controlecentrum voor denken, waarneming, geheugen, beweging, stemming en autonome functies.',overview:['Verwerkt zintuigen en stuurt beweging aan.','Reguleert via hypothalamus/hypofyse ook hormonale functies.'],symptoms:['Hoofdpijn','Verwardheid','Geheugenklachten','Uitval'],redflags:['Plots scheve mond, spraakproblemen, krachtsverlies of bewustzijnsdaling.'],prevention:['Slaap, beweging, bloeddruk/cholesterol/suiker controleren.'],sub:['Grote hersenen','Kleine hersenen','Hersenstam','Hypofyse']},
  trachea:{title:'Luchtpijp',system:'Ademhaling',summary:'Vervoert lucht van keel naar bronchiën en longen.',overview:['Onderdeel van de centrale luchtwegen.'],symptoms:['Hoesten','Heesheid','Benauwdheid'],redflags:['Ernstige benauwdheid of gierende ademhaling.'],prevention:['Niet roken, irritatie vermijden.'],sub:['Strottenhoofd','Bronchiën']},
  'left-lung':{title:'Linkerlong',system:'Ademhaling',summary:'Zorgt samen met rechterlong voor zuurstofopname en koolzuurafgifte.',overview:['Gaswisseling vindt plaats in longblaasjes.'],symptoms:['Hoesten','Benauwdheid','Pijn bij ademhalen'],redflags:['Blauwe lippen, ernstige kortademigheid, bloed ophoesten.'],prevention:['Niet roken, bewegen, vaccinaties waar relevant.'],sub:['Bovenkwab','Onderkwab','Bronchiën','Longblaasjes']},
  'right-lung':{title:'Rechterlong',system:'Ademhaling',summary:'Grotere long met drie kwabben, belangrijk voor gaswisseling.',overview:['Klachten kunnen ook van ribben, spieren, hart of lever/galblaas komen.'],symptoms:['Hoesten','Benauwdheid','Koorts met hoest'],redflags:['Ernstige kortademigheid of pijn op borst.'],prevention:['Rookstop, conditie opbouwen, infecties serieus nemen.'],sub:['Bovenkwab','Middenkwab','Onderkwab']},
  heart:{title:'Hart',system:'Circulatie',summary:'Pompt bloed rond en voorziet organen van zuurstof en voedingsstoffen.',overview:['Vier kamers, kleppen en elektrische geleiding werken samen.','Klachten kunnen bij vrouwen, ouderen en diabetes atypischer presenteren.'],symptoms:['Drukkende borstpijn','Kortademigheid','Hartkloppingen','Uitstraling arm/kaak'],redflags:['Nieuwe drukkende borstpijn, flauwvallen, benauwdheid of zweten.'],prevention:['Rookstop, beweging, bloeddruk/cholesterol, diabeteszorg.'],sub:['Linker ventrikel','Rechter ventrikel','Kleppen','Kransslagaders']},
  liver:{title:'Lever',system:'Stofwisseling',summary:'Breekt stoffen af, maakt eiwitten, produceert gal en slaat energie op.',overview:['Ligt rechtsboven in de buik.','Vage klachten kunnen moeheid, jeuk of misselijkheid zijn.'],symptoms:['Pijn rechtsboven','Misselijkheid','Jeuk','Geelzucht'],redflags:['Gele huid/ogen met sufheid, koorts of ernstige buikpijn.'],prevention:['Alcohol matigen, gezond gewicht, hepatitispreventie.'],sub:['Leverkwabben','Galwegen','Poortader','Galblaas']},
  stomach:{title:'Maag',system:'Spijsvertering',summary:'Mengkamer voor voedsel en maagzuur.',overview:['Reflux, gastritis en maagzweer kunnen overlappen.'],symptoms:['Maagpijn','Branden','Misselijkheid','Opboeren'],redflags:['Bloed braken, zwarte ontlasting, onverklaard gewichtsverlies.'],prevention:['Regelmatig eten, alcohol matigen, voorzichtig met NSAID’s.'],sub:['Maagmond','Maagwand','Pylorus']},
  spleen:{title:'Milt',system:'Afweer / bloed',summary:'Filtert bloed en speelt rol in afweer.',overview:['Ligt linksboven. Kan vergroten bij infecties of bloedziekten.'],symptoms:['Pijn linksboven','Vol gevoel'],redflags:['Buiktrauma met pijn linksboven of duizeligheid.'],prevention:['Bij bekende miltproblemen artsadvies over vaccinaties/sport.'],sub:['Miltkapsel','Bloedfiltering']},
  pancreas:{title:'Alvleesklier',system:'Spijsvertering / hormonen',summary:'Maakt verteringsenzymen en hormonen zoals insuline.',overview:['Verbindt vertering en bloedsuikerhuishouding.'],symptoms:['Bovenbuikpijn','Misselijkheid','Bloedsuikerschommelingen'],redflags:['Hevige bovenbuikpijn uitstralend naar rug met braken.'],prevention:['Alcohol matigen, gezond gewicht, diabetescontrole.'],sub:['Kop','Lichaam','Staart','Insulinefunctie']},
  'left-kidney':{title:'Linkernier',system:'Urinewegen / bloeddruk',summary:'Filtert afvalstoffen en regelt vocht, zouten en bloeddruk.',overview:['Klachten vaak via flankpijn, urine of bloeddruk.'],symptoms:['Flankpijn','Bloed in urine','Koorts','Pijn bij plassen'],redflags:['Koorts met flankpijn of niet kunnen plassen.'],prevention:['Voldoende vocht, bloeddruk en diabetes goed behandelen.'],sub:['Nierschors','Nierbekken','Urineleider']},
  'right-kidney':{title:'Rechternier',system:'Urinewegen / bloeddruk',summary:'Filtert afvalstoffen en maakt urine.',overview:['Samen met linkernier essentieel voor afvalstoffen en bloeddruk.'],symptoms:['Flankpijn','Urinewegklachten','Koorts'],redflags:['Koorts, ziek gevoel en flankpijn.'],prevention:['Voldoende drinken, bloeddruk/suiker controleren.'],sub:['Nierschors','Nierbekken','Urineleider']},
  'small-bowel':{title:'Dunne darm',system:'Spijsvertering',summary:'Belangrijkste plaats voor opname van voedingsstoffen.',overview:['Neemt voedingsstoffen en veel vocht op.'],symptoms:['Krampen','Diarree','Opgeblazen gevoel'],redflags:['Uitdroging, bloed bij ontlasting, hevige aanhoudende pijn.'],prevention:['Voeding, hygiëne, voldoende drinken.'],sub:['Twaalfvingerige darm','Jejunum','Ileum']},
  colon:{title:'Dikke darm',system:'Spijsvertering',summary:'Onttrekt vocht en vormt/vervoert ontlasting.',overview:['Belangrijk voor ontlastingsritme en microbiome.'],symptoms:['Verstopping','Diarree','Bloed/slijm','Krampen'],redflags:['Bloedverlies, nachtelijke klachten, gewichtsverlies.'],prevention:['Vezels, beweging, vocht, screening bij leeftijd/risico.'],sub:['Blindedarm','Opstijgende darm','Dwarslopende darm','Endeldarm']},
  bladder:{title:'Blaas',system:'Urinewegen',summary:'Slaat urine tijdelijk op.',overview:['Klachten kunnen infectie, irritatie of bekkenbodemcontext hebben.'],symptoms:['Pijn bij plassen','Aandrang','Bloed in urine'],redflags:['Koorts met urineklachten of niet kunnen plassen.'],prevention:['Voldoende drinken, niet lang ophouden.'],sub:['Blaaswand','Urinebuis','Bekkenbodem']},
  skull:{title:'Schedel',system:'Skelet',summary:'Beschermt de hersenen en vormt het gezichtsskelet.',overview:['Meerdere schedelbeenderen beschermen hersenen.'],symptoms:['Hoofdpijn na stoot','Kaakpijn'],redflags:['Bewustzijnsverlies, braken of uitval na hoofdletsel.'],prevention:['Helm bij risico, valpreventie.'],sub:['Voorhoofdsbeen','Kaak','Schedelbasis']},
  spine:{title:'Wervelkolom',system:'Skelet / zenuwstelsel',summary:'Draagt romp en beschermt ruggenmerg.',overview:['Cervicaal, thoracaal, lumbaal en sacraal.'],symptoms:['Rugpijn','Uitstraling','Stijfheid'],redflags:['Rijbroekgevoel, incontinentie, snel toenemende uitval.'],prevention:['Corekracht, bewegen, ergonomie.'],sub:['Halswervels','Borstwervels','Lendenwervels','Tussenwervelschijven']},
  ribcage:{title:'Ribbenkast',system:'Skelet',summary:'Beschermt hart en longen.',overview:['Ribben, borstbeen en wervels vormen de borstkas.'],symptoms:['Pijn bij ademhalen','Drukpijn'],redflags:['Kortademigheid na trauma of hevige borstpijn.'],prevention:['Core, botgezondheid, gordelgebruik.'],sub:['Ribben','Borstbeen','Sleutelbeen']},
  'pelvic-bone':{title:'Bekkenbot',system:'Skelet',summary:'Draagt gewicht en beschermt bekkenorganen.',overview:['Belangrijk voor lopen, houding en bekkenbodem.'],symptoms:['Heuppijn','Liespijn','Bekkenpijn'],redflags:['Niet kunnen lopen na val.'],prevention:['Valpreventie, krachttraining.'],sub:['Heupkom','Heiligbeen','Schaambeen']},
  aorta:{title:'Aorta',system:'Bloedvaten',summary:'Grootste slagader van het lichaam.',overview:['Verdeelt zuurstofrijk bloed naar organen en benen.'],symptoms:['Vaak geen klachten','Buik/rugpijn bij problemen'],redflags:['Plots hevige buik/rugpijn, collaps.'],prevention:['Rookstop, bloeddruk/cholesterol.'],sub:['Borst-aorta','Buik-aorta','Iliacale vaten']},
  'vena-cava':{title:'Vena cava',system:'Bloedvaten',summary:'Grote ader die bloed terugvoert naar het hart.',overview:['Onderdeel van centrale veneuze circulatie.'],symptoms:['Zwelling','Benauwdheid bij ernstige circulatieproblemen'],redflags:['Plots ernstige benauwdheid of collaps.'],prevention:['Beweging, tromboserisico’s beperken.'],sub:['Vena cava superior','Vena cava inferior']},
  carotids:{title:'Halsvaten',system:'Bloedvaten',summary:'Belangrijke bloedvaten tussen hart en hersenen.',overview:['Relevant voor hersendoorbloeding.'],symptoms:['Vaak geen klachten','TIA/CVA-klachten'],redflags:['Scheve mond, spraakproblemen, krachtsverlies.'],prevention:['Bloeddruk, cholesterol, niet roken.'],sub:['Carotiden','Jugularis']},
  'arm-vessels':{title:'Armvaten',system:'Bloedvaten',summary:'Bloedvoorziening van armen en handen.',overview:['Slagaders en aders lopen tot in vingers.'],symptoms:['Koude hand','Kleurverandering','Zwelling'],redflags:['Plots bleke koude arm of forse zwelling.'],prevention:['Beweging, afknelling vermijden.'],sub:['Brachialis','Radialis','Ulnaris']},
  'leg-vessels':{title:'Beenslagaders',system:'Bloedvaten',summary:'Voorzien benen en voeten van zuurstofrijk bloed.',overview:['Belangrijk voor lopen en wondgenezing.'],symptoms:['Kramp bij lopen','Koude voeten'],redflags:['Acuut koud/wit pijnlijk been.'],prevention:['Niet roken, bewegen, vaatrisico’s behandelen.'],sub:['Dijslagader','Knieholteslagader','Voetslagaders']},
  'leg-veins':{title:'Beenaders',system:'Bloedvaten',summary:'Voeren bloed uit benen terug naar hart.',overview:['Kleppen helpen bloed omhoog te krijgen.'],symptoms:['Zware benen','Zwelling','Spataderen'],redflags:['Acuut eenzijdig dik pijnlijk been.'],prevention:['Beweging, compressie waar geadviseerd.'],sub:['Diepe aders','Oppervlakkige aders']},
  'brain-nerves':{title:'Hersenen / centrale zenuwen',system:'Zenuwstelsel',summary:'Centrale verwerking en aansturing.',overview:['Stuurt cognitie, beweging en autonome functies.'],symptoms:['Hoofdpijn','Uitval','Tintelingen'],redflags:['Acute uitval, insult, bewustzijnsdaling.'],prevention:['Slaap, beweging, bloeddrukcontrole.'],sub:['Grote hersenen','Hersenstam','Craniale zenuwen']},
  'spinal-cord':{title:'Ruggenmerg',system:'Zenuwstelsel',summary:'Hoofdverbinding tussen hersenen en lichaam.',overview:['Loopt beschermd door wervelkolom.'],symptoms:['Uitstraling','Gevoelsstoornis','Loopproblemen'],redflags:['Incontinentie, rijbroekgevoel, snel toenemende uitval.'],prevention:['Rugbelasting doseren, spoed bij uitval.'],sub:['Hals','Borst','Lenden','Sacraal']},
  'brachial-plexus':{title:'Armzenuwen',system:'Zenuwstelsel',summary:'Zenuwnetwerk voor schouder, arm en hand.',overview:['Kan bekneld raken vanuit nek/schouder/pols.'],symptoms:['Tintelingen','Krachtsverlies','Brandende pijn'],redflags:['Plots fors krachtsverlies.'],prevention:['Ergonomie, houding, belasting variëren.'],sub:['Mediaan','Ulnair','Radiaal']},
  'sciatic-nerve':{title:'Heup-/beenzenuwen',system:'Zenuwstelsel',summary:'Belangrijk voor gevoel en motoriek van benen.',overview:['O.a. nervus ischiadicus.'],symptoms:['Uitstraling naar bil/been','Brandende pijn'],redflags:['Voethefferszwakte of ernstige uitval.'],prevention:['Core/heupkracht, bewegen, ergonomie.'],sub:['Ischiadicus','Femoraal','Tibiaal']},
  pectorals:{title:'Borstspieren',system:'Spieren',summary:'Spieren voor armbeweging en borstkasstabiliteit.',overview:['Spierpijn kan op borstklachten lijken; alarmsignalen blijven leidend.'],symptoms:['Pijn bij bewegen/druk','Verrekking'],redflags:['Drukkende borstpijn of benauwdheid.'],prevention:['Training rustig opbouwen.'],sub:['Pectoralis major','Tussenribspieren']},
  'abdominal-muscles':{title:'Buikspieren',system:'Spieren',summary:'Core-spieren voor rompstabiliteit.',overview:['Belangrijk voor houding, ademhaling en beweging.'],symptoms:['Pijn bij aanspannen','Kramp'],redflags:['Hevige buikpijn, koorts, harde buik.'],prevention:['Corekracht, belasting opbouwen.'],sub:['Rechte buikspier','Schuine buikspieren','Diepe core']},
  'left-thigh-muscle':{title:'Linker bovenbeenspieren',system:'Spieren',summary:'Belangrijk voor lopen, traplopen en springen.',overview:['Quadriceps, hamstrings en adductoren werken samen.'],symptoms:['Spierpijn','Verrekking','Kramp'],redflags:['Knappend gevoel met functieverlies.'],prevention:['Warming-up, krachtbalans.'],sub:['Quadriceps','Hamstrings','Adductoren']},
  'right-thigh-muscle':{title:'Rechter bovenbeenspieren',system:'Spieren',summary:'Belangrijk voor lopen, traplopen en springen.',overview:['Quadriceps, hamstrings en adductoren werken samen.'],symptoms:['Spierpijn','Verrekking','Kramp'],redflags:['Knappend gevoel met functieverlies.'],prevention:['Warming-up, krachtbalans.'],sub:['Quadriceps','Hamstrings','Adductoren']},
  pituitary:{title:'Hypofyse',system:'Hormonen',summary:'Kleine klier die veel hormonale assen aanstuurt.',overview:['Stuurt o.a. schildklier, bijnier en voortplantingshormonen aan.'],symptoms:['Vage hormonale klachten','Cyclusverandering','Soms hoofdpijn/zichtklachten'],redflags:['Nieuwe gezichtsvelduitval of ernstige hoofdpijn.'],prevention:['Bespreek onverklaarde hormonale klachten met arts.'],sub:['ACTH','TSH','LH/FSH','Prolactine']},
  thyroid:{title:'Schildklier',system:'Hormonen',summary:'Regelt stofwisseling en energiehuishouding.',overview:['Te traag of te snel kan veel vage klachten geven.'],symptoms:['Moeheid','Hartkloppingen','Kouwelijkheid/warmte','Gewichtsverandering'],redflags:['Ernstige hartkloppingen, verwardheid of halszwelling met benauwdheid.'],prevention:['Bij klachten bloedonderzoek via arts overwegen.'],sub:['T4/T3','TSH','Schildklierknobbels']},
  thymus:{title:'Thymus',system:'Afweer / hormoonachtig',summary:'Speelt vooral in de kindertijd een rol in afweerontwikkeling.',overview:['Belangrijk voor T-celrijping.'],symptoms:['Meestal geen directe klachten'],redflags:['Onverklaarde grote massa/benauwdheid medisch beoordelen.'],prevention:['Algemene immuungezondheid.'],sub:['T-cellen','Borstregio']},
  'pancreas-hormone':{title:'Pancreas / insuline',system:'Hormonen',summary:'Regelt bloedsuiker via insuline en glucagon.',overview:['Verbindt spijsvertering en hormoonhuishouding.'],symptoms:['Dorst','Veel plassen','Trillen/zweten bij lage suiker'],redflags:['Sufheid, verwardheid of ernstig ziek bij glucoseproblemen.'],prevention:['Voeding, beweging, diabetescontrole.'],sub:['Insuline','Glucagon','Bloedsuiker']},
  'left-adrenal':{title:'Linker bijnier',system:'Hormonen',summary:'Maakt o.a. cortisol en stresshormonen.',overview:['Belangrijk voor stressrespons, bloeddruk en zoutbalans.'],symptoms:['Moeheid','Duizeligheid','Bloeddrukklachten'],redflags:['Ernstige zwakte, uitdroging of lage bloeddruk bij bekende bijnierziekte.'],prevention:['Medicatie-instructies volgen bij bekende aandoening.'],sub:['Cortisol','Aldosteron','Adrenaline']},
  'right-adrenal':{title:'Rechter bijnier',system:'Hormonen',summary:'Maakt o.a. cortisol en stresshormonen.',overview:['Belangrijk voor stressrespons, bloeddruk en zoutbalans.'],symptoms:['Moeheid','Duizeligheid','Bloeddrukklachten'],redflags:['Ernstige zwakte, uitdroging of lage bloeddruk bij bekende bijnierziekte.'],prevention:['Medicatie-instructies volgen bij bekende aandoening.'],sub:['Cortisol','Aldosteron','Adrenaline']},
  'reproductive-hormones':{title:'Geslachtshormonen',system:'Hormonen',summary:'Spelen rol bij puberteit, cyclus, vruchtbaarheid, libido en levensfasen.',overview:['Bij jongeren is veel variatie normaal.','Bij volwassenen kan levensfasecontext relevant zijn.'],symptoms:['Cyclusklachten','Opvliegers','Puberteitsvragen','Libidoverandering'],redflags:['Hevig bloedverlies, zwangerschap met pijn/bloeding, onveilige situatie.'],prevention:['Betrouwbare voorlichting, laagdrempelig arts/contactpersoon bij zorgen.'],sub:['Oestrogeen','Testosteron','Progesteron','Puberteit','Perimenopauze']}
};

const redFlags=['druk op borst','benauwd','koorts','flauwvallen','scheve mond','krachtsverlies','spraakproblemen','hevige bloeding','bloed braken','zwarte ontlasting','bloed in urine','niet kunnen plassen'];
const knowledge=[
  {cat:'Atlas',title:'Atlasbeelden worden niet geblurd',text:'Atlas Studio is educatief biologisch materiaal. Blur is alleen voor echte gebruikerbeelden zoals AR, camera, upload en screenshots.'},
  {cat:'Kind',title:'Kindprofiel in ondergoed',text:'Bij leeftijd onder 16 toont de atlas automatisch een ondergoedlaag; intieme kinderbeelden worden nooit verwerkt.'},
  {cat:'Personalisatie',title:'Profielgestuurde representatie',text:'Huidtint en context passen lokaal aan op profielkeuzes. Achtergrond blijft optioneel en is geen diagnosefactor.'},
  {cat:'Hart',title:'Hartklachten',text:'Drukkende borstpijn, benauwdheid, zweten of uitstraling naar arm/kaak zijn alarmsignalen.'},
  {cat:'Hormonen',title:'Levensfasecontext',text:'Bij vrouwen rond 38–55 kunnen wisselende klachten hormonale context hebben, zonder andere oorzaken uit te sluiten.'},
  {cat:'Jongeren',title:'Puberteit en SOA/STI',text:'Veilige uitleg en symptoomvragen zijn nodig; intieme foto’s onder 16 blijven geblokkeerd.'}
];

function saveProfile(){
  const p={age:$('#age').value,sex:$('#sex').value,background:$('#background').value,language:$('#language').value,updated:new Date().toISOString()};
  localStorage.setItem(STORE_KEY,JSON.stringify(p));
  applyProfile(p);
}
function loadProfile(){
  try{
    const p=JSON.parse(localStorage.getItem(STORE_KEY)||'null');
    if(!p) return null;
    $('#age').value=p.age||''; $('#sex').value=p.sex||'prefer-not'; $('#background').value=p.background||'prefer-not'; $('#language').value=p.language||'nl';
    applyProfile(p);
    return p;
  }catch{return null}
}
function getProfile(){try{return JSON.parse(localStorage.getItem(STORE_KEY)||'{}')}catch{return {}}}
function showProfile(force=false){$('#profileGate').classList.remove('hidden'); if(force) $('#profileForm').reset();}
function hideProfile(){$('#profileGate').classList.add('hidden');}

function applyProfile(p=getProfile()){
  const tones={
    'prefer-not':['#ffd9c4','#c58c72','#7c5040'],
    european:['#ffe0cc','#d39b7e','#8b5a49'],
    african:['#c98d63','#7b432d','#3a1f18'],
    mena:['#e2ad82','#a66745','#5a3427'],
    'south-asian':['#d9a36e','#8b5638','#4f2d21'],
    'east-asian':['#ffe1c8','#c58b63','#7b4f38'],
    'se-asian':['#d8a16d','#8c5a38','#4b2c1d'],
    latin:['#e0a46f','#9a6040','#583424'],
    other:['#e1a978','#8f5c3e','#4a2e22']
  };
  const t=tones[p.background||'prefer-not']||tones['prefer-not'];
  $('#skinHi')?.setAttribute('stop-color',t[0]);
  $('#skinMid')?.setAttribute('stop-color',t[1]);
  $('#skinLow')?.setAttribute('stop-color',t[2]);
  const child=Number(p.age)>0 && Number(p.age)<16;
  $('#underwearLayer')?.classList.toggle('hidden',!child);
  const label=child?'Kindprofiel: atlas in ondergoed':'Volwassen/algemene atlas: biologisch lichaam zonder atlas-blur';
  $('#profileModePill').textContent=label;
}

function renderToggles(){
  $('#layerToggles').innerHTML=layerConfig.map(l=>`<button class="layer-toggle ${active.visibleLayers.has(l.key)?'active':''}" data-layer="${l.key}">${l.label}</button>`).join('');
  $$('#layerToggles button').forEach(btn=>btn.onclick=()=>{
    const key=btn.dataset.layer;
    if(active.visibleLayers.has(key)) active.visibleLayers.delete(key); else active.visibleLayers.add(key);
    if(active.visibleLayers.size===0) active.visibleLayers.add('skin');
    updateLayers();
    renderToggles();
  });
}
function updateLayers(){
  layerConfig.forEach(l=>{
    const g=document.getElementById(l.group);
    if(g) g.classList.toggle('visible',active.visibleLayers.has(l.key));
  });
  document.documentElement.style.setProperty('--layerOpacity',active.opacity);
}
function renderTabs(){
  const tabs={overview:'Functie',symptoms:'Klachten',redflags:'Alarmsignalen',prevention:'Preventie'};
  $('#detailTabs').innerHTML=Object.entries(tabs).map(([k,v])=>`<button class="detail-tab ${active.tab===k?'active':''}" data-tab="${k}">${v}</button>`).join('');
  $$('#detailTabs button').forEach(b=>b.onclick=()=>{active.tab=b.dataset.tab;renderDetail();});
}
function selectItem(id){
  active.item=id; active.tab='overview';
  $$('.selectable').forEach(el=>el.classList.toggle('selected',el.dataset.id===id));
  renderDetail(); updateSelectionChip();
}
function renderDetail(){
  renderTabs();
  const item=info[active.item];
  if(!item){
    $('#detailTitle').textContent='Tik op een structuur';
    $('#detailSubtitle').textContent='Zet lagen aan/uit, draai het lichaam en tik een structuur aan.';
    $('#detailBody').innerHTML=`<div class="card"><strong>Nieuw in Stage 1J</strong><ul><li>Geen blur op Atlas Studio.</li><li>Geharmoniseerde lagen op één lichaam.</li><li>3D-achtige rotatie via sliders en drag.</li><li>Profielgestuurde huidtint/representatie.</li><li>Kindprofiel toont ondergoedlaag.</li></ul></div>`;
    $('#substructures').innerHTML='';
    return;
  }
  $('#detailTitle').textContent=item.title;
  $('#detailSubtitle').textContent=item.summary;
  const map={overview:item.overview,symptoms:item.symptoms,redflags:item.redflags,prevention:item.prevention};
  $('#detailBody').innerHTML=`<div class="card"><strong>Systeem</strong><div>${item.system}</div></div><div class="card"><strong>${({overview:'Functie en context',symptoms:'Veelvoorkomende klachten',redflags:'Wanneer alarmerend?',prevention:'Preventie'})[active.tab]}</strong><ul>${map[active.tab].map(x=>`<li>${x}</li>`).join('')}</ul></div><div class="card"><strong>Let op</strong><br/>Indicatieve educatie, geen diagnose. Bij twijfel of alarmsignalen: professionele hulp.</div>`;
  $('#substructures').innerHTML=(item.sub||[]).map(s=>`<button>${s}<small> · verdiepingsniveau gepland</small></button>`).join('');
  $('#selectedBreadcrumb').textContent=`Geselecteerd · ${item.title}`;
}
function updateSelectionChip(){
  const item=info[active.item];
  $('#activeSelectionChip').textContent=item?`Atlasselectie: ${item.title} (${item.system})`:'Nog geen atlasselectie gekozen';
}
function applyView(){
  $('#body3d').style.transform=`rotateY(${active.rotation}deg) rotateX(${active.tilt}deg)`;
}
function renderRedFlags(){
  $('#redFlags').innerHTML=redFlags.map(f=>`<button class="layer-toggle redflag" data-flag="${f}">${f}</button>`).join('');
  $$('.redflag').forEach(b=>b.onclick=()=>b.classList.toggle('active'));
}
function renderKnowledge(){
  const cats=['Alles',...new Set(knowledge.map(k=>k.cat))];
  $('#knowledgeFilters').innerHTML=cats.map(c=>`<button class="layer-toggle ${c==='Alles'?'active':''}" data-cat="${c}">${c}</button>`).join('');
  const draw=(cat='Alles')=>{
    $$('#knowledgeFilters button').forEach(b=>b.classList.toggle('active',b.dataset.cat===cat));
    const list=cat==='Alles'?knowledge:knowledge.filter(k=>k.cat===cat);
    $('#knowledgeCards').innerHTML=list.map(k=>`<div class="mini-card"><b>${k.title}</b><small>${k.text}</small></div>`).join('');
  };
  $$('#knowledgeFilters button').forEach(b=>b.onclick=()=>draw(b.dataset.cat));
  draw('Alles');
}
function setupSearch(){
  const input=$('#atlasSearch');
  input.addEventListener('input',()=>{
    const q=input.value.trim().toLowerCase();
    if(q.length<2){$('#searchResults').classList.add('hidden');return;}
    const results=Object.entries(info).filter(([id,it])=>[id,it.title,it.system,it.summary,...(it.sub||[])].join(' ').toLowerCase().includes(q)).slice(0,10);
    $('#searchResults').innerHTML=results.map(([id,it])=>`<button data-id="${id}"><strong>${it.title}</strong><br><small>${it.system}</small></button>`).join('')||'<button>Geen resultaat</button>';
    $('#searchResults').classList.remove('hidden');
    $$('#searchResults button[data-id]').forEach(b=>b.onclick=()=>{selectItem(b.dataset.id);input.value='';$('#searchResults').classList.add('hidden');});
  });
}
function analyze(){
  const item=info[active.item], profile=getProfile(), flags=$$('.redflag.active').map(x=>x.dataset.flag);
  const emergencies=['druk op borst','benauwd','flauwvallen','scheve mond','krachtsverlies','spraakproblemen','hevige bloeding'];
  let tone='okText', title='Indicatief: zelfzorg of geplande beoordeling';
  if(flags.length){tone='warnText';title='Indicatief: laagdrempelig medische beoordeling overwegen';}
  if(flags.some(f=>emergencies.includes(f))){tone='dangerText';title='Indicatief: spoedbeoordeling kan nodig zijn';}
  const notes=[];
  if(item) notes.push(`Locatiecontext: ${item.title}. ${item.summary}`);
  if(Number(profile.age)>0 && Number(profile.age)<16) notes.push('Onder 16: geen intieme foto/scans. Gevoelige klachten mogen wel veilig met tekst worden omschreven.');
  if(profile.sex==='female' && Number(profile.age)>=38 && Number(profile.age)<=55) notes.push('Levensfasecontext: hormonale/perimenopauzale klachten kunnen meewegen, zonder andere oorzaken uit te sluiten.');
  if(profile.background && profile.background!=='prefer-not') notes.push('Achtergrond/afkomst wordt alleen als nuance gebruikt voor presentatie en risico, nooit als diagnose.');
  $('#analysisResult').innerHTML=`<h3 class="${tone}">${title}</h3><p>${$('#symptomText').value.trim()?`Omschrijving: ${$('#symptomText').value.trim()}`:'Voeg klachttekst toe voor betere duiding.'}</p><p>Alarmsignalen: ${flags.length?flags.join(', '):'geen geselecteerd'}</p>${notes.map(n=>`<div class="card">${n}</div>`).join('')}<div class="card"><strong>Belangrijk</strong><br/>Deze app geeft indicatieve educatie en vervangt geen arts.</div>`;
}
function bind(){
  $('#profileBtn').onclick=()=>showProfile();
  $('#bottomProfileBtn').onclick=e=>{e.preventDefault();showProfile();};
  $('#profileForm').onsubmit=e=>{e.preventDefault();saveProfile();hideProfile();};
  $('#skipProfile').onclick=()=>hideProfile();
  $('#wipeProfile').onclick=()=>{localStorage.removeItem(STORE_KEY);$('#profileForm').reset();applyProfile({});alert('Profiel gewist.');};
  $('#resetViewBtn').onclick=()=>{active.rotation=0;active.tilt=0;$('#rotateSlider').value=0;$('#tiltSlider').value=0;active.item=null;$$('.selectable').forEach(el=>el.classList.remove('selected'));renderDetail();updateSelectionChip();applyView();};
  $('#allLayersBtn').onclick=()=>{active.visibleLayers=new Set(layerConfig.map(l=>l.key));renderToggles();updateLayers();};
  $('#rotateSlider').oninput=e=>{active.rotation=Number(e.target.value);applyView();};
  $('#tiltSlider').oninput=e=>{active.tilt=Number(e.target.value);applyView();};
  $('#opacitySlider').oninput=e=>{active.opacity=Number(e.target.value)/100;updateLayers();};
  $('#symptomFromAtlas').onclick=()=>{location.hash='symptoms'; const item=info[active.item]; if(item) $('#symptomText').value=`Klacht bij ${item.title}: `; $('#symptomText').focus();};
  $('#preventionFromAtlas').onclick=()=>{active.tab='prevention';renderDetail();};
  $('#compareLayersBtn').onclick=()=>{active.visibleLayers=new Set(['skin','organ','vessel','nerve']);renderToggles();updateLayers();};
  $('#analyzeBtn').onclick=analyze;
  $('#hardRefreshBtn').onclick=async()=>{await unregisterOldCaches(); location.href='stage1j.html?v=' + Date.now();};
  $$('.selectable').forEach(el=>el.addEventListener('click',ev=>{ev.stopPropagation();selectItem(el.dataset.id);}));
  let dragging=false,startX=0,startRot=0;
  $('#viewerShell').addEventListener('pointerdown',e=>{dragging=true;startX=e.clientX;startRot=active.rotation;});
  window.addEventListener('pointermove',e=>{if(!dragging)return;active.rotation=Math.max(-42,Math.min(42,startRot+(e.clientX-startX)/5));$('#rotateSlider').value=active.rotation;applyView();});
  window.addEventListener('pointerup',()=>dragging=false);
}
async function init(){
  await unregisterOldCaches();
  const p=loadProfile(); if(!p) showProfile();
  renderToggles(); updateLayers(); renderDetail(); updateSelectionChip(); renderRedFlags(); renderKnowledge(); setupSearch(); bind(); applyView();
}
document.addEventListener('DOMContentLoaded',init);
