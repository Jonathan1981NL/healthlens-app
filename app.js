
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const STORE_KEY = 'healthlens.profile.1h';
const active = { layer: 'organs', item: null, tab: 'overview', deep: true };

async function unregisterOldCaches() {
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const reg of regs) await reg.unregister();
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    }
  } catch (e) { console.log('Cache clear skipped', e); }
}

const make = (title, system, summary, overview, symptoms, redflags, prevention, sub=[]) =>
  ({title, system, summary, overview, symptoms, redflags, prevention, sub});

const layers = {
  organs: {
    label: 'Organen',
    image: 'assets/organs.png',
    dark: false,
    items: {
      brain: {short:'Hersenen',x:50,y:7,r:3.2, ...make('Hersenen','Organen','Controlecentrum voor denken, gevoel, beweging, waarneming, hormoonaansturing en automatische lichaamsfuncties.',
        ['Stuurt bewust gedrag, beweging, waarneming en geheugen aan.','Reguleert via hersenstam en hypothalamus ook basale functies zoals ademhaling, temperatuur en hormoonbalans.','Klachten kunnen neurologisch, hormonaal, psychisch of metabool worden beïnvloed.'],
        ['Hoofdpijn','Duizeligheid','Verwardheid','Geheugen- of concentratieproblemen','Uitval van arm, been, spraak of gezicht'],
        ['Plots scheve mond, spraakproblemen of krachtsverlies.','Nieuwe epileptische aanval of bewustzijnsdaling.','Ernstige plotselinge hoofdpijn, vooral “ergste ooit”.'],
        ['Slaap, beweging, niet roken, bloeddruk/cholesterol/suiker controleren.','Bescherm hoofd bij risicosporten.'],
        ['Grote hersenen','Hersenstam','Kleine hersenen','Hypothalamus / hypofyse'])},
      trachea: {short:'Luchtpijp',x:50,y:18,r:2.2, ...make('Luchtpijp','Ademhaling','Vervoert lucht van keel naar bronchiën en longen.',
        ['Onderdeel van de bovenste/centrale luchtwegen.','Kan geïrriteerd raken door infectie, rook, reflux of allergie.'],
        ['Hoesten','Heesheid','Branderig gevoel','Benauwdheid bij zwelling of obstructie'],
        ['Ernstige benauwdheid, gierende ademhaling of niet goed kunnen spreken.','Bloed ophoesten of verslikking met ademnood.'],
        ['Niet roken, irritante dampen vermijden, reflux/allergie behandelen waar relevant.'],
        ['Strottenhoofd','Trachea','Bronchiën'])},
      leftLung: {short:'Long L',x:41,y:27,r:4.6, ...make('Linkerlong','Ademhaling','Belangrijk voor zuurstofopname en koolzuurafgifte.',
        ['Gaswisseling vindt plaats in longblaasjes.','Longklachten moeten altijd samen met ademhaling, koorts, pijn en inspanning worden beoordeeld.'],
        ['Hoesten','Benauwdheid','Piepende ademhaling','Pijn bij ademhalen','Sputum'],
        ['Acuut ernstige benauwdheid.','Blauwe lippen, sufheid of verwardheid.','Bloed ophoesten of scherpe borstpijn met kortademigheid.'],
        ['Niet roken, bewegen, vaccinaties waar relevant, luchtvervuiling vermijden.'],
        ['Bovenkwab','Onderkwab','Bronchiën','Longblaasjes'])},
      rightLung: {short:'Long R',x:58,y:27,r:4.6, ...make('Rechterlong','Ademhaling','Grotere long met drie kwabben, belangrijk voor gaswisseling.',
        ['De rechterlong heeft meestal drie kwabben.','Pijn aan deze zijde kan ook van ribben, spieren, lever of galblaas komen.'],
        ['Hoesten','Koorts met hoest','Benauwdheid','Pijn bij diepe ademhaling'],
        ['Acuut forse kortademigheid of pijn op de borst.','Ernstige koorts, verwardheid of snelle ademhaling.'],
        ['Rookstop, conditie opbouwen, infecties tijdig laten beoordelen bij risico.'],
        ['Bovenkwab','Middenkwab','Onderkwab','Pulmonale vaten'])},
      heart: {short:'Hart',x:51,y:36,r:3.8, ...make('Hart','Circulatie','Pompt bloed rond en voorziet organen van zuurstof en voedingsstoffen.',
        ['Vier kamers, kleppen en elektrische prikkelgeleiding werken samen.','Klachten kunnen zich uiten als druk, benauwdheid, hartkloppingen, duizeligheid of vermoeidheid.','Bij vrouwen, ouderen en mensen met diabetes kunnen hartklachten atypischer presenteren.'],
        ['Drukkende pijn op de borst','Hartkloppingen','Kortademigheid','Zweten/misselijkheid','Uitstraling naar arm, rug, kaak of schouder'],
        ['Nieuwe drukkende borstpijn of benauwdheid.','Flauwvallen of bijna-flauwvallen.','Borstpijn met zweten, misselijkheid of uitstraling.'],
        ['Beweeg, rook niet, let op bloeddruk, cholesterol en diabetes.','Ken je familiegeschiedenis en zoek snel hulp bij alarmsignalen.'],
        ['Linker ventrikel','Rechter ventrikel','Boezems','Kleppen','Kransslagaders','Geleidingssysteem'])},
      liver: {short:'Lever',x:45,y:46,r:5.5, ...make('Lever','Stofwisseling','Stofwisselingsorgaan dat gifstoffen afbreekt, eiwitten maakt, gal produceert en energie opslaat.',
        ['Ligt rechtsboven in de buik.','Werkt nauw samen met galblaas, darmen en alvleesklier.','Leverklachten zijn soms vaag: moeheid, jeuk, misselijkheid, geelzucht of drukgevoel.'],
        ['Pijn/druk rechtsboven','Misselijkheid','Jeuk','Donkere urine','Gele huid/ogen','Moeheid'],
        ['Gele huid/ogen met sufheid, koorts of ernstige buikpijn.','Bloedbraken, zwarte ontlasting of verwardheid.'],
        ['Matig alcohol, gezond gewicht, medicatiebewustzijn, hepatitispreventie.'],
        ['Leverkwabben','Galwegen','Galblaas','Poortader','Leverfunctie'])},
      stomach: {short:'Maag',x:57,y:49,r:4.5, ...make('Maag','Spijsvertering','Breekt voedsel af, mengt met maagzuur en voert door naar de dunne darm.',
        ['Reflux, gastritis, maagzweer en functionele klachten kunnen op elkaar lijken.','Klachten hangen vaak samen met eten, stress, medicatie of infectie.'],
        ['Branden achter borstbeen','Maagpijn','Misselijkheid','Opboeren','Vol gevoel'],
        ['Bloed braken, zwarte ontlasting of plots hevige buikpijn.','Onverklaard gewichtsverlies of slikproblemen.'],
        ['Regelmaat, matig alcohol, niet roken, voorzichtig met NSAID’s.'],
        ['Maagmond','Maagwand','Pylorus','Refluxzone'])},
      spleen: {short:'Milt',x:67,y:46,r:2.8, ...make('Milt','Afweer/bloed','Filtert bloed en speelt rol in afweer.',
        ['Ligt linksboven in de buik.','Kan vergroot zijn bij infecties, bloedziekten of ontstekingsprocessen.'],
        ['Pijn linksboven','Vol gevoel','Uitstraling naar linkerschouder'],
        ['Buiktrauma met pijn linksboven, duizeligheid of flauwvallen.'],
        ['Bij bekende miltproblemen: bespreek vaccinaties en contactsport met arts.'],
        ['Miltkapsel','Bloedfiltering','Afweerfunctie'])},
      pancreas: {short:'Alvleesklier',x:53,y:53,r:3.2, ...make('Alvleesklier','Spijsvertering/hormonen','Maakt verteringsenzymen en hormonen zoals insuline.',
        ['Ligt diep in de bovenbuik.','Heeft zowel spijsverterings- als bloedsuikerfunctie.'],
        ['Bovenbuikpijn','Misselijkheid/braken','Vettige ontlasting','Bloedsuikerschommelingen'],
        ['Hevige bovenbuikpijn uitstralend naar rug met braken.','Gele huid/ogen of ernstige ziek indruk.'],
        ['Alcohol matigen, gezond gewicht, galsteenrisico beperken, diabetes opvolgen.'],
        ['Kop','Lichaam','Staart','Insulinefunctie','Enzymfunctie'])},
      leftKidney: {short:'Nier L',x:42,y:57,r:3.0, ...make('Linkernier','Urine/bloeddruk','Filtert afvalstoffen, regelt vocht, zouten en bloeddruk.',
        ['Nieren geven vaak flankklachten of indirecte klachten via urine, bloeddruk of vochtbalans.'],
        ['Flankpijn','Bloed in urine','Koorts','Pijn bij plassen','Moeheid'],
        ['Koorts met flankpijn.','Niet kunnen plassen of ernstige zwelling/benauwdheid.'],
        ['Voldoende drinken, bloeddruk controleren, diabetes goed behandelen.'],
        ['Nierschors','Nierbekken','Urineleider','Bloedfilter'])},
      rightKidney: {short:'Nier R',x:58,y:57,r:3.0, ...make('Rechternier','Urine/bloeddruk','Filtert bloed en maakt urine.',
        ['Samen met linkernier essentieel voor afvalstoffen en bloeddruk.'],
        ['Flankpijn','Urinewegklachten','Misselijkheid','Koorts'],
        ['Koorts, ziek gevoel en flankpijn.','Bloed in urine na trauma.'],
        ['Voldoende vocht, bloeddruk/suiker volgen, medicatiebewustzijn.'],
        ['Nierschors','Nierbekken','Urineleider','Bloedfilter'])},
      smallBowel: {short:'Dunne darm',x:50,y:71,r:6.0, ...make('Dunne darm','Spijsvertering','Belangrijkste plaats voor opname van voedingsstoffen.',
        ['Neemt voedingsstoffen en veel vocht op.','Klachten kunnen komen door infectie, intolerantie, ontsteking of obstructie.'],
        ['Krampen','Diarree','Opgeblazen gevoel','Misselijkheid','Voedselintolerantie'],
        ['Uitdroging, bloed bij ontlasting, hevige aanhoudende pijn, opgezette buik met braken.'],
        ['Vezels passend bij tolerantie, voldoende drinken, voedselveiligheid.'],
        ['Twaalfvingerige darm','Jejunum','Ileum','Opname voedingsstoffen'])},
      colon: {short:'Dikke darm',x:50,y:66,r:8.0, ...make('Dikke darm','Spijsvertering','Onttrekt vocht aan ontlasting en vervoert naar endeldarm.',
        ['Speelt rol bij ontlastingsritme, microbiome en vochtbalans.','Klachten kunnen functioneel zijn, maar alarmsignalen vragen beoordeling.'],
        ['Verstopping','Diarree','Bloed/slijm','Buikkrampen','Veranderde ontlasting'],
        ['Aanhoudend bloedverlies, nachtelijke klachten, onbedoeld gewichtsverlies of bloedarmoede.'],
        ['Vezels, beweging, vocht, screening op leeftijd/risico.'],
        ['Blindedarm','Opstijgende darm','Dwarslopende darm','Dalende darm','Endeldarm'])},
      bladder: {short:'Blaas',x:50,y:82,r:3.5, ...make('Blaas','Urinewegen','Slaat urine tijdelijk op.',
        ['Klachten kunnen passen bij infectie, irritatie, prostaat/bekkenbodem of neurologische factoren.'],
        ['Pijn bij plassen','Vaak kleine beetjes','Aandrang','Bloed in urine','Onderbuikpijn'],
        ['Koorts met urineklachten, flankpijn of niet kunnen plassen.','Zichtbaar bloed in urine zonder duidelijke verklaring.'],
        ['Voldoende drinken, niet lang ophouden, urineweginfecties tijdig behandelen.'],
        ['Blaaswand','Urinebuis','Bekkenbodem','Aandrangsignaal'])}
    }
  },
  skeleton: {
    label: 'Skelet',
    image: 'assets/skeleton.png',
    dark: false,
    items: {
      skull:{short:'Schedel',x:50,y:6,r:4, ...make('Schedel','Skelet','Beschermt hersenen en zintuigen.',
        ['Bestaat uit meerdere schedelbeenderen.','Beschermt hersenen en vormt gezichtsskelet.'],
        ['Pijn na stoot/val','Kaakpijn','Hoofdpijn'],['Bewustzijnsverlies, braken of uitval na hoofdletsel.'],['Helm bij risico, valpreventie.'],['Voorhoofdsbeen','Kaak','Oogkas','Schedelbasis'])},
      cervicalSpine:{short:'Nek',x:50,y:15,r:2.3, ...make('Halswervels','Skelet','Geven steun en beweeglijkheid aan hoofd en nek.',
        ['7 cervicale wervels, dicht bij zenuwen en bloedvaten.'],['Nekpijn','Stijfheid','Tintelingen arm'],['Nekpijn met krachtsverlies of na ernstig trauma.'],['Ergonomie, mobiliteit, houdingsafwisseling.'],['C1-C2','C3-C7','Tussenwervelschijven'])},
      ribcage:{short:'Ribbenkast',x:50,y:25,r:8.2, ...make('Ribbenkast','Skelet','Beschermt hart en longen.',
        ['Ribben, borstbeen en thoracale wervels.'],['Pijn bij ademhalen','Drukpijn','Pijn na hoesten/stoot'],['Kortademigheid na trauma of hevige borstpijn.'],['Core training, botgezondheid, gordelgebruik.'],['Ribben','Borstbeen','Sleutelbeen','Thoracale wervels'])},
      shoulderL:{short:'Schouder L',x:31,y:20,r:3.2, ...make('Linkerschouder','Gewricht','Complex gewricht voor armbeweging.',
        ['Bestaat uit kop, kom, sleutelbeen en schouderblad.'],['Pijn bij heffen','Instabiliteit','Krachtverlies'],['Uit de kom, hevige pijn na val, gevoelsverlies.'],['Schouderbladcontrole, geleidelijke belasting.'],['Sleutelbeen','Bovenarmkop','Schouderblad'])},
      handL:{short:'Hand L',x:22,y:57,r:3.2, ...make('Linkerhand','Skelet','Fijne botten voor grip en precisie.',
        ['Carpalia, metacarpalia en vingerkootjes.'],['Pijn bij grijpen','Tintelingen','Zwelling'],['Bleke/gevoelloze vingers na letsel.'],['Ergonomie, beschermingsmateriaal.'],['Pols','Middenhandsbeentjes','Vingers'])},
      pelvis:{short:'Bekken',x:50,y:46,r:6.3, ...make('Bekken','Skelet','Draagt lichaamsgewicht en beschermt bekkenorganen.',
        ['Belangrijk voor houding, lopen, zwangerschap en bekkenbodem.'],['Heuppijn','Liespijn','Bekkenpijn'],['Niet kunnen lopen na val.'],['Krachttraining, valpreventie, botgezondheid.'],['Heupkom','Heiligbeen','Schaambeen'])},
      kneeL:{short:'Knie L',x:46,y:78,r:3, ...make('Linkerknie','Gewricht','Complex scharniergewricht voor lopen en traplopen.',
        ['Bot, kraakbeen, meniscus en banden werken samen.'],['Zwelling','Slotklachten','Pijn bij traplopen'],['Niet kunnen belasten of fors slot na trauma.'],['Quadriceps/hamstrings trainen, belasting opbouwen.'],['Meniscus','Kruisbanden','Knieschijf'])},
      footL:{short:'Voet L',x:44,y:106,r:3.5, ...make('Linkervoet','Skelet','Draagt gewicht en ondersteunt balans.',
        ['Veel kleine botten, pezen en gewrichten.'],['Voetpijn','Pijn bij stappen','Zwelling'],['Open letsel, niet kunnen staan, koude/bleke voet.'],['Goed schoeisel, voetkracht, diabetes voetcontrole.'],['Hiel','Middenvoet','Tenen'])}
    }
  },
  circulatory: {
    label: 'Bloedvaten',
    image: 'assets/circulatory.png',
    dark: false,
    items: {
      brainVessels:{short:'Hersenvaten',x:50,y:8,r:3.4, ...make('Hersenvaten','Bloedvaten','Voeden hersenen met zuurstof en glucose.',
        ['Kwetsbaar bij hoge bloeddruk, stolsels en vaatziekte.'],['TIA/CVA-klachten','Duizeligheid','Plots uitval'],['Scheve mond, spraakprobleem, krachtsverlies.'],['Bloeddruk, cholesterol, beweging, niet roken.'],['Carotiden','Cirkel van Willis','Cerebrale arteriën'])},
      heartVessels:{short:'Hart/vaten',x:52,y:28,r:4.2, ...make('Hart en grote vaten','Bloedvaten','Centrale pomp en doorvoer van grote vaten.',
        ['Aorta, vena cava en longcirculatie werken samen.'],['Borstdruk','Kortademigheid','Hartkloppingen'],['Acuut drukkende borstpijn of flauwvallen.'],['Rookstop, beweging, bloeddruk/cholesterol.'],['Aorta','Vena cava','Kransslagaders','Longvaten'])},
      armVesselsL:{short:'Armvaten L',x:22,y:43,r:4.5, ...make('Linker armvaten','Bloedvaten','Voorzien arm en hand van bloed.',
        ['Slagaders en aders naar hand en vingers.'],['Koude hand','Kleurverandering','Tintelingen'],['Plots bleke, koude, pijnlijke arm.'],['Beweeg, afknelling vermijden.'],['Brachialis','Radialis','Ulnaris','Handvaten'])},
      renalVessels:{short:'Nierdoorbloeding',x:50,y:43,r:4, ...make('Nierdoorbloeding','Bloedvaten','Sterke doorbloeding voor filtering en bloeddrukregeling.',
        ['Nieren zijn gevoelig voor bloeddruk, diabetes en medicatie.'],['Vaak indirect via nierfunctie','Hoge bloeddruk'],['Ernstige nierfunctiedaling of hevige flankpijn.'],['Bloeddruk/suiker behandelen, medicatiebewustzijn.'],['Nierslagader','Nierader','Glomeruli'])},
      abdominalAorta:{short:'Buikaorta',x:50,y:52,r:3.2, ...make('Buikaorta','Bloedvaten','Hoofdslagader in de buik.',
        ['Geeft takken naar buikorganen en benen.'],['Vaak geen klachten','Buik/rugpijn'],['Plots hevige buik/rugpijn of collaps.'],['Rookstop en vaatrisico’s behandelen.'],['Aorta','Iliacale vaten','Mesenteriale vaten'])},
      legVessels:{short:'Beenvaten',x:50,y:87,r:6, ...make('Beenvaten','Bloedvaten','Doorbloeding van benen en voeten.',
        ['Belangrijk voor lopen, wondgenezing en temperatuur.'],['Zware benen','Kramp bij lopen','Zwelling'],['Acuut dik pijnlijk been of koud wit been.'],['Bewegen, rookstop, compressie waar geadviseerd.'],['Dijslagader','Knieholtevaten','Kuitvaten','Voetvaten'])}
    }
  },
  nervous: {
    label: 'Zenuwstelsel',
    image: 'assets/nervous.png',
    dark: true,
    items: {
      brainN:{short:'Hersenen',x:50,y:6.5,r:3.5, ...make('Hersenen','Zenuwstelsel','Centrale verwerking en aansturing.',
        ['Onderdeel van centrale zenuwstelsel.','Stuurt cognitie, gedrag, beweging en autonome functies.'],['Hoofdpijn','Concentratieproblemen','Uitval','Tintelingen'],['Acute neurologische uitval, insult, hevige acute hoofdpijn.'],['Slaap, beweging, cardiovasculaire preventie.'],['Grote hersenen','Kleine hersenen','Hersenstam'])},
      cranial:{short:'Aangezicht',x:50,y:13,r:3, ...make('Aangezichtszenuwen','Zenuwstelsel','Zenuwen voor gezicht, slikken, ogen en gehoor.',
        ['Belangrijk voor mimiek, gevoel en specifieke functies.'],['Tintelingen gezicht','Dubbelzien','Aangezichtspijn'],['Plots scheef gezicht of slikproblemen.'],['Snelle beoordeling bij acute uitval.'],['N. facialis','N. trigeminus','Oogzenuwen'])},
      brachial:{short:'Armplexus',x:50,y:25,r:7, ...make('Brachiale plexus','Zenuwstelsel','Zenuwknooppunt voor schouder, arm en hand.',
        ['Kan klachten geven bij nek/schouderproblemen of beknelling.'],['Tintelingen arm/hand','Krachtsverlies','Brandende pijn'],['Plots fors krachtsverlies of doof gevoel.'],['Houding, ergonomie, belasting variëren.'],['Mediaan','Ulnair','Radiaal'])},
      spinalCord:{short:'Ruggenmerg',x:50,y:41,r:4.5, ...make('Ruggenmerg','Zenuwstelsel','Centrale zenuwbaan in de wervelkolom.',
        ['Verbindt hersenen met lichaam.','Kwetsbaar bij letsel of druk.'],['Uitstralende pijn','Gevoelsstoornis','Loopproblemen'],['Nieuwe incontinentie, rijbroekgevoel, snel toenemende uitval.'],['Rugbelasting verstandig opbouwen; spoed bij ernstige uitval.'],['Cervicaal','Thoracaal','Lumbaal','Sacraal'])},
      sciatic:{short:'Ischias',x:50,y:66,r:5, ...make('Heup- en beenzenuwen','Zenuwstelsel','Zenuwbanen voor motoriek en gevoel in benen.',
        ['O.a. nervus ischiadicus.'],['Uitstralende pijn naar bil/been','Brandende zenuwpijn'],['Onhoudbare pijn met uitval of voethefferszwakte.'],['Bewegen, rug/heupspieren, ergonomie.'],['N. ischiadicus','N. femoralis','N. tibialis'])},
      footNerves:{short:'Voetzenuwen',x:50,y:92,r:6, ...make('Voetzenuwen','Zenuwstelsel','Belangrijk voor gevoel, lopen en balans.',
        ['Kwetsbaar bij diabetes, beknelling of zenuwschade.'],['Doof gevoel voeten','Brandende pijn','Loopinstabiliteit'],['Voetval of plots niet goed kunnen lopen.'],['Voetcontrole, diabeteszorg, geschikt schoeisel.'],['Zoolzenuwen','Teenzenuwen','Enkelkanaal'])}
    }
  },
  muscles: {
    label: 'Spieren',
    image: 'assets/organs.png',
    dark: false,
    overlay: true,
    items: {
      neckMuscles:{short:'Nekspieren',x:50,y:18,r:3.2, ...make('Nekspieren','Spieren','Spieren die hoofd en nek bewegen en stabiliseren.',
        ['Vaak betrokken bij spanningshoofdpijn en nekklachten.'],['Nekpijn','Stijfheid','Hoofdpijn vanuit nek'],['Krachtsverlies, koorts met stijve nek, trauma.'],['Houdingswissel, kracht/mobiliteit, pauzes.'],['Sternocleidomastoideus','Trapezius','Diepe nekflexoren'])},
      pectorals:{short:'Borstspieren',x:50,y:30,r:6, ...make('Borstspieren','Spieren','Borstspieren helpen armbeweging en stabiliteit.',
        ['Spierpijn kan lijken op borstklachten maar alarmsignalen blijven leidend.'],['Pijn bij bewegen/druk','Spierverrekking'],['Drukkende borstpijn, benauwdheid, uitstraling.'],['Training rustig opbouwen, warming-up.'],['Pectoralis major','Pectoralis minor','Tussenribspieren'])},
      abdominal:{short:'Buikspieren',x:50,y:50,r:7, ...make('Buikspieren','Spieren','Core-spieren voor rompstabiliteit.',
        ['Buikspierpijn hangt vaak samen met inspanning, hoesten of beweging.'],['Pijn bij aanspannen','Kramp','Lokale drukpijn'],['Hevige buikpijn, koorts, braken of harde buik.'],['Corekracht, geleidelijke belasting, ademhaling.'],['Rechte buikspier','Schuine buikspieren','Diepe core'])},
      shoulderMuscles:{short:'Schouders',x:31,y:22,r:4, ...make('Schouderspieren','Spieren','Sturen armheffing en schouderstabiliteit.',
        ['Rotator cuff en deltoid zijn vaak betrokken bij pijn.'],['Pijn bij heffen','Krachtverlies','Nachtpijn'],['Acute scheur/uit de kom of neurologische uitval.'],['Rotator cuff training, mobiliteit, belasting doseren.'],['Deltoid','Supraspinatus','Infraspinatus','Subscapularis'])},
      thighMuscles:{short:'Bovenbeen',x:50,y:70,r:7, ...make('Bovenbeenspieren','Spieren','Belangrijk voor lopen, springen en traplopen.',
        ['Quadriceps, hamstrings en adductoren werken samen.'],['Spierpijn','Verrekking','Kramp'],['Plots knappend gevoel met functieverlies of forse zwelling.'],['Warming-up, krachtbalans, herstel.'],['Quadriceps','Hamstrings','Adductoren'])}
    }
  },
  hormones: {
    label: 'Hormonen',
    image: 'assets/organs.png',
    dark: false,
    items: {
      pituitary:{short:'Hypofyse',x:50,y:8,r:2.4, ...make('Hypofyse','Hormonen','Kleine klier die veel hormonale assen aanstuurt.',
        ['Stuurt o.a. schildklier, bijnier en voortplantingshormonen aan.'],['Vage klachten','Cyclusverandering','Hoofdpijn/zichtklachten zelden'],['Nieuwe gezichtsvelduitval of ernstige hoofdpijn.'],['Bespreek onverklaarde hormonale klachten met arts.'],['ACTH','TSH','LH/FSH','Prolactine'])},
      thyroid:{short:'Schildklier',x:50,y:18,r:2.8, ...make('Schildklier','Hormonen','Regelt stofwisseling en energiehuishouding.',
        ['Te traag of te snel kan veel vage klachten geven.'],['Moeheid','Hartkloppingen','Kouwelijkheid/warmte','Gewichtsverandering'],['Ernstige hartkloppingen, verwardheid of zwelling in hals met benauwdheid.'],['Bij klachten bloedonderzoek overwegen via arts.'],['T4/T3','TSH','Schildklierknobbels'])},
      adrenals:{short:'Bijnieren',x:50,y:56,r:3.5, ...make('Bijnieren','Hormonen','Maken o.a. cortisol en adrenalineachtige hormonen.',
        ['Belangrijk voor stressrespons, zoutbalans en bloeddruk.'],['Moeheid','Duizeligheid','Bloeddrukklachten'],['Ernstige zwakte, uitdroging, lage bloeddruk bij bekende bijnierziekte.'],['Medicatie-instructies volgen bij bekende aandoening.'],['Cortisol','Aldosteron','Adrenaline'])},
      pancreasHormones:{short:'Insuline',x:53,y:53,r:3, ...make('Pancreas / insuline','Hormonen','Regelt bloedsuiker via insuline en glucagon.',
        ['Verbindt spijsvertering en hormoonhuishouding.'],['Dorst','Veel plassen','Trillen/zweten bij lage suiker'],['Sufheid, verwardheid of ernstig ziek bij glucoseprobleem.'],['Voeding, beweging, diabetescontrole.'],['Insuline','Glucagon','Bloedsuiker'])},
      reproductive:{short:'Geslachtshormonen',x:50,y:82,r:4, ...make('Geslachtshormonen','Hormonen','Spelen rol bij puberteit, cyclus, vruchtbaarheid, libido en levensfasen.',
        ['Bij jongeren is veel variatie normaal.','Bij volwassenen kan levensfasecontext relevant zijn.'],['Cyclusklachten','Opvliegers','Puberteitsvragen','Libidoverandering'],['Hevig bloedverlies, zwangerschap met pijn/bloeding, onveilige situatie.'],['Betrouwbare voorlichting, laagdrempelig arts/contactpersoon bij zorgen.'],['Oestrogeen','Testosteron','Progesteron','Puberteit','Perimenopauze'])}
    }
  }
};

const filters = ['Alles','Organen','Skelet','Bloedvaten','Zenuwstelsel','Spieren','Hormonen','Kind/Jongere','Privacy'];
const knowledge = [
  {cat:'Organen',title:'Hart',text:'Borstdruk, benauwdheid, zweten, misselijkheid of uitstraling naar arm/kaak zijn alarmsignalen. Atypische presentatie komt voor bij vrouwen, ouderen en diabetes.'},
  {cat:'Organen',title:'Lever/galblaasgebied',text:'Pijn rechtsboven, misselijkheid, jeuk of geelzucht kan meerdere oorzaken hebben. Geelzucht of koorts met buikpijn vraagt beoordeling.'},
  {cat:'Organen',title:'Darmen',text:'Diarree, verstopping en krampen zijn vaak onschuldig, maar bloedverlies, nachtelijke klachten of gewichtsverlies zijn alarmsignalen.'},
  {cat:'Skelet',title:'Knie',text:'Zwelling, slotklachten of instabiliteit na trauma vraagt andere aandacht dan geleidelijke overbelasting.'},
  {cat:'Zenuwstelsel',title:'Uitval herkennen',text:'Scheve mond, spraakprobleem of krachtsverlies: denk aan beroerte-alarm en zoek direct spoedhulp.'},
  {cat:'Kind/Jongere',title:'Puberteit normaliseren',text:'Borstgroei, haargroei, stemverandering, lichaamsgeur en verschillen in penis/testikelontwikkeling variëren sterk en zijn vaak normaal.'},
  {cat:'Kind/Jongere',title:'SOA/STI zonder beeld',text:'Jongeren moeten klachten veilig kunnen beschrijven. Onder 16 worden geen intieme beelden verwerkt.'},
  {cat:'Hormonen',title:'Perimenopauze-context',text:'Vage klachten zoals slaapstoornis, brain fog, hartkloppingen, opvliegers en cyclusverandering kunnen hormonale context hebben zonder andere oorzaken uit te sluiten.'},
  {cat:'Privacy',title:'Privacy-first',text:'Profiel en sessiegegevens blijven lokaal. Gevoelige beelden, zeker bij minderjarigen, worden geblokkeerd of streng beperkt.'}
];
const redFlags = ['druk op borst','benauwd','koorts','flauwvallen','scheve mond','krachtsverlies','spraakproblemen','hevige bloeding','bloed braken','zwarte ontlasting','bloed in urine','niet kunnen plassen'];

function getLayer(){ return layers[active.layer]; }
function getItem(){ const l=getLayer(); return active.item ? l.items[active.item] : null; }

function saveProfile(){
  localStorage.setItem(STORE_KEY, JSON.stringify({age:$('#age').value,sex:$('#sex').value,background:$('#background').value,language:$('#language').value,updated:new Date().toISOString()}));
}
function loadProfile(){
  try {
    const p=JSON.parse(localStorage.getItem(STORE_KEY)||'null');
    if(!p) return null;
    $('#age').value=p.age||''; $('#sex').value=p.sex||'prefer-not'; $('#background').value=p.background||'prefer-not'; $('#language').value=p.language||'nl';
    return p;
  } catch { return null; }
}
function showProfile(force=false){ $('#profileGate').classList.remove('hidden'); if(force) $('#profileForm').reset(); }
function hideProfile(){ $('#profileGate').classList.add('hidden'); }

function renderLayers(){
  $('#layerTabs').innerHTML='';
  Object.entries(layers).forEach(([key,l])=>{
    const b=document.createElement('button');
    b.className='layer-btn'+(key===active.layer?' active':'');
    b.textContent=l.label;
    b.onclick=()=>{active.layer=key;active.item=null;active.tab='overview';renderLayers();renderAtlas();renderDetail();};
    $('#layerTabs').appendChild(b);
  });
}
function renderAtlas(){
  const layer=getLayer();
  const canvas=$('#atlasCanvas');
  canvas.className='atlas-canvas'+(layer.dark?' dark':'');
  canvas.innerHTML='';
  $('#layerTitle').textContent=layer.label;
  $('#selectedBreadcrumb').textContent=active.item?`${layer.label} › ${layer.items[active.item].title}`:'Volledig lichaam';
  const img=document.createElement('img');
  img.className='atlas-image';
  img.src=`${layer.image}?v=1h`;
  img.alt=layer.label;
  if(layer.overlay){ img.style.opacity='.22'; }
  canvas.appendChild(img);

  Object.entries(layer.items).forEach(([key,item])=>{
    const h=document.createElement('button');
    h.className='hotspot'+(active.deep?' deep':'')+(active.item===key?' active':'');
    h.dataset.short=item.short;
    h.setAttribute('aria-label',item.title);
    h.style.left=item.x+'%';
    h.style.top=item.y+'%';
    const size = active.deep ? item.r*2.35 : item.r*1.55;
    h.style.width=size+'%'; h.style.height=size+'%';
    h.onclick=()=>selectItem(key);
    canvas.appendChild(h);
  });
  if(active.item) zoomTo(getItem()); else resetZoom(false);
}
function selectItem(key){
  active.item=key; active.tab='overview';
  zoomTo(getItem());
  renderAtlas(); renderDetail(); updateSelectionChip();
}
function zoomTo(item){
  const img=$('.atlas-image'); if(!img || !item) return;
  img.style.transformOrigin=`${item.x}% ${item.y}%`;
  const scale = item.r > 6 ? 1.8 : item.r > 4 ? 2.25 : 2.75;
  img.style.transform=`scale(${scale})`;
}
function resetZoom(clear=true){
  const img=$('.atlas-image'); if(img){img.style.transform='scale(1)';img.style.transformOrigin='50% 38%';}
  if(clear){active.item=null;renderAtlas();renderDetail();updateSelectionChip();}
}
function renderDetail(){
  const item=getItem();
  $('#detailTitle').textContent=item?item.title:'Kies een structuur';
  $('#detailSubtitle').textContent=item?item.summary:'Tik op een hotspot. Gebruik de zoekfunctie om direct naar organen, botten, vaten of zenuwen te springen.';
  const tabs={overview:'Functie',symptoms:'Klachten',redflags:'Alarmsignalen',prevention:'Preventie'};
  $('#detailTabs').innerHTML=Object.entries(tabs).map(([k,v])=>`<button class="detail-tab ${active.tab===k?'active':''}" data-tab="${k}">${v}</button>`).join('');
  $$('#detailTabs .detail-tab').forEach(b=>b.onclick=()=>{active.tab=b.dataset.tab;renderDetail();});
  if(!item){
    $('#detailBody').innerHTML=`<div class="card"><strong>Nieuwe interactie in 1H</strong><ul><li>Realistischere atlasbeelden.</li><li>Kleinere hotspots.</li><li>Direct inzoomen op je selectie.</li><li>Meer medische inhoud per structuur.</li><li>Zoeken zonder door schermen te klikken.</li></ul></div>`;
    $('#substructures').innerHTML='';
    return;
  }
  const map={overview:item.overview,symptoms:item.symptoms,redflags:item.redflags,prevention:item.prevention};
  $('#detailBody').innerHTML=`
    <div class="card"><strong>Systeem</strong><div>${item.system}</div></div>
    <div class="card"><strong>${tabs[active.tab]}</strong><ul>${map[active.tab].map(x=>`<li>${x}</li>`).join('')}</ul></div>
    <div class="card"><strong>Disclaimer</strong><br/>Deze informatie is educatief en indicatief. Ze vervangt geen arts of spoedzorg.</div>`;
  $('#substructures').innerHTML=(item.sub||[]).map(s=>`<button type="button">${s}<small> · verdiepingsniveau gepland</small></button>`).join('') || '<p class="muted">Geen substructuren beschikbaar.</p>';
}
function updateSelectionChip(){
  const item=getItem();
  $('#activeSelectionChip').textContent=item?`${getLayer().label} · ${item.title}`:'Nog geen atlasselectie gekozen';
}
function renderRedFlags(){
  $('#redFlags').innerHTML=redFlags.map(f=>`<button class="layer-btn redflag" data-flag="${f}">${f}</button>`).join('');
  $$('.redflag').forEach(b=>b.onclick=()=>b.classList.toggle('active'));
}
function renderKnowledge(filter='Alles'){
  $('#knowledgeFilters').innerHTML=filters.map(f=>`<button class="layer-btn ${f===filter?'active':''}" data-filter="${f}">${f}</button>`).join('');
  $$('#knowledgeFilters button').forEach(b=>b.onclick=()=>renderKnowledge(b.dataset.filter));
  const list=filter==='Alles'?knowledge:knowledge.filter(k=>k.cat===filter);
  $('#knowledgeCards').innerHTML=list.map(k=>`<div class="mini-card"><b>${k.title}</b><small>${k.text}</small></div>`).join('');
}
function setupSearch(){
  const input=$('#atlasSearch');
  input.addEventListener('input',()=>{
    const q=input.value.trim().toLowerCase();
    if(q.length<2){$('#searchResults').classList.add('hidden');return;}
    const results=[];
    Object.entries(layers).forEach(([lk,l])=>Object.entries(l.items).forEach(([ik,it])=>{
      const hay=[it.title,it.short,it.system,...(it.sub||[])].join(' ').toLowerCase();
      if(hay.includes(q)) results.push({lk,ik,it});
    }));
    $('#searchResults').innerHTML=results.slice(0,9).map(r=>`<button data-layer="${r.lk}" data-item="${r.ik}"><strong>${r.it.title}</strong><br><small>${layers[r.lk].label}</small></button>`).join('') || '<button>Geen resultaat</button>';
    $('#searchResults').classList.remove('hidden');
    $$('#searchResults button[data-layer]').forEach(b=>b.onclick=()=>{
      active.layer=b.dataset.layer; active.item=b.dataset.item; active.tab='overview'; input.value=''; $('#searchResults').classList.add('hidden'); renderLayers(); renderAtlas(); renderDetail(); updateSelectionChip();
    });
  });
}
function getProfile(){try{return JSON.parse(localStorage.getItem(STORE_KEY)||'{}')}catch{return {}}}
function analyze(){
  const text=$('#symptomText').value.trim();
  const flags=$$('.redflag.active').map(x=>x.dataset.flag);
  const profile=getProfile();
  const item=getItem();
  const emergencies=['druk op borst','benauwd','flauwvallen','scheve mond','krachtsverlies','spraakproblemen','hevige bloeding'];
  let tone='okText',title='Indicatief: zelfzorg of geplande beoordeling';
  if(flags.length){tone='warnText';title='Indicatief: laagdrempelig medische beoordeling overwegen';}
  if(flags.some(f=>emergencies.includes(f))){tone='dangerText';title='Indicatief: spoedbeoordeling kan nodig zijn';}
  const notes=[];
  if(item) notes.push(`Locatiecontext: ${item.title} (${item.system}). ${item.summary}`);
  if(Number(profile.age)<16 && profile.age) notes.push('Onder 16: geen intieme beelden. Gevoelige klachten kunnen wel veilig met tekst worden beschreven.');
  if(profile.sex==='female' && Number(profile.age)>=38 && Number(profile.age)<=55) notes.push('Levensfasecontext: hormonale/perimenopauzale klachten kunnen meewegen, maar sluiten andere oorzaken niet uit.');
  if(profile.background && profile.background!=='prefer-not') notes.push('Achtergrond/afkomst wordt alleen als nuance gebruikt voor presentatie en risico, nooit als harde diagnose.');
  $('#analysisResult').innerHTML=`
    <h3 class="${tone}">${title}</h3>
    <p>${text?`Omschrijving: ${text}`:'Voeg klachttekst toe voor betere duiding.'}</p>
    <p>Alarmsignalen: ${flags.length?flags.join(', '):'geen geselecteerd'}</p>
    ${notes.map(n=>`<div class="card">${n}</div>`).join('')}
    <div class="card"><strong>Wat nu?</strong><br/>Bij duidelijke alarmsignalen, snelle verslechtering of onzekerheid: neem contact op met professionele zorg of spoedhulp.</div>`;
}
function bind(){
  $('#profileBtn').onclick=()=>showProfile();
  $('#bottomProfileBtn').onclick=e=>{e.preventDefault();showProfile();};
  $('#profileForm').onsubmit=e=>{e.preventDefault();saveProfile();hideProfile();};
  $('#skipProfile').onclick=()=>hideProfile();
  $('#wipeProfile').onclick=()=>{localStorage.removeItem(STORE_KEY);$('#profileForm').reset();alert('Profiel gewist.');};
  $('#resetBtn').onclick=()=>resetZoom(true);
  $('#deepBtn').onclick=()=>{active.deep=!active.deep; $('#deepBtn').textContent=active.deep?'Detailmodus aan':'Detailmodus uit'; renderAtlas();};
  $('#symptomFromAtlas').onclick=()=>{location.hash='symptoms'; const item=getItem(); if(item) $('#symptomText').value=`Klacht bij ${item.title}: `; $('#symptomText').focus();};
  $('#preventionFromAtlas').onclick=()=>{active.tab='prevention'; renderDetail();};
  $('#compareLayersBtn').onclick=()=>{alert('Vergelijkmodus gepland: in de volgende stap tonen we twee lagen tegelijk met transparantie-slider.');};
  $('#analyzeBtn').onclick=analyze;
  $('#latestBtn').onclick=async()=>{await unregisterOldCaches(); alert('Oude caches zijn gewist. Open opnieuw met ?v=1h-latest als je telefoon oude inhoud toont.');};
}
async function init(){
  await unregisterOldCaches();
  const p=loadProfile(); if(!p) showProfile();
  renderLayers(); renderAtlas(); renderDetail(); updateSelectionChip(); renderRedFlags(); renderKnowledge(); setupSearch(); bind();
}
document.addEventListener('DOMContentLoaded', init);
