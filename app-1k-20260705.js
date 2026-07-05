// HealthLens Stage 1K Professional Atlas
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const STORE_KEY = 'healthlens.profile.1k';

const state = {
  layer: 'organs',
  item: null,
  tab: 'overview',
  zoom: 1,
  x: 0,
  y: 0,
  dragging: false,
  startX: 0,
  startY: 0,
  baseX: 0,
  baseY: 0
};

async function killCaches(){
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

const data = {
  organs: {
    label:'Organen',
    image:'assets/organs.png',
    note:'Realistisch orgaanoverzicht',
    items:{
      brain:{x:50,y:8,r:3.8,title:'Hersenen',system:'Organen / zenuwstelsel',summary:'Controlecentrum voor denken, waarneming, geheugen, beweging, stemming en autonome functies.',overview:['Verwerkt zintuigen en stuurt beweging aan.','Reguleert via hypothalamus en hypofyse ook hormonale functies.','Klachten kunnen neurologisch, hormonaal, psychisch of metabool beïnvloed zijn.'],symptoms:['Hoofdpijn','Duizeligheid','Verwardheid','Geheugen- of concentratieproblemen','Uitval van arm, been, spraak of gezicht'],redflags:['Plots scheve mond, spraakproblemen of krachtsverlies.','Nieuwe epileptische aanval of bewustzijnsdaling.','Ernstige plotselinge hoofdpijn.'],prevention:['Slaap, beweging, niet roken, bloeddruk/cholesterol/suiker controleren.','Bescherm hoofd bij risicosporten.']},
      trachea:{x:50,y:19,r:2.4,title:'Luchtpijp',system:'Ademhaling',summary:'Vervoert lucht van keel naar bronchiën en longen.',overview:['Onderdeel van de centrale luchtwegen.','Kan geïrriteerd raken door infectie, rook, reflux of allergie.'],symptoms:['Hoesten','Heesheid','Benauwdheid','Branderig gevoel'],redflags:['Ernstige benauwdheid of gierende ademhaling.','Bloed ophoesten of verslikking met ademnood.'],prevention:['Niet roken, irritante dampen vermijden, reflux/allergie behandelen waar relevant.']},
      leftLung:{x:41,y:29,r:5.2,title:'Linkerlong',system:'Ademhaling',summary:'Belangrijk voor zuurstofopname en koolzuurafgifte.',overview:['Gaswisseling vindt plaats in longblaasjes.','Longklachten moeten samen met ademhaling, koorts, pijn en inspanning worden beoordeeld.'],symptoms:['Hoesten','Benauwdheid','Piepende ademhaling','Pijn bij ademhalen','Sputum'],redflags:['Acuut ernstige benauwdheid.','Blauwe lippen, sufheid of verwardheid.','Bloed ophoesten of scherpe borstpijn met kortademigheid.'],prevention:['Niet roken, bewegen, vaccinaties waar relevant, luchtvervuiling vermijden.']},
      rightLung:{x:59,y:29,r:5.2,title:'Rechterlong',system:'Ademhaling',summary:'Grotere long met drie kwabben, belangrijk voor gaswisseling.',overview:['De rechterlong heeft meestal drie kwabben.','Pijn rechts kan ook van ribben, spieren, lever of galblaas komen.'],symptoms:['Hoesten','Koorts met hoest','Benauwdheid','Pijn bij diepe ademhaling'],redflags:['Acuut forse kortademigheid of pijn op de borst.','Ernstige koorts, verwardheid of snelle ademhaling.'],prevention:['Rookstop, conditie opbouwen, infecties serieus nemen bij risico.']},
      heart:{x:51,y:37,r:4.1,title:'Hart',system:'Circulatie',summary:'Pompt bloed rond en voorziet organen van zuurstof en voedingsstoffen.',overview:['Vier kamers, kleppen en elektrische prikkelgeleiding werken samen.','Klachten kunnen zich uiten als druk, benauwdheid, hartkloppingen, duizeligheid of vermoeidheid.','Bij vrouwen, ouderen en mensen met diabetes kunnen hartklachten atypischer presenteren.'],symptoms:['Drukkende pijn op de borst','Hartkloppingen','Kortademigheid','Zweten/misselijkheid','Uitstraling naar arm, rug, kaak of schouder'],redflags:['Nieuwe drukkende borstpijn of benauwdheid.','Flauwvallen of bijna-flauwvallen.','Borstpijn met zweten, misselijkheid of uitstraling.'],prevention:['Beweeg, rook niet, let op bloeddruk, cholesterol en diabetes.','Ken je familiegeschiedenis en zoek snel hulp bij alarmsignalen.']},
      liver:{x:44,y:48,r:6.0,title:'Lever',system:'Stofwisseling',summary:'Breekt stoffen af, maakt eiwitten, produceert gal en slaat energie op.',overview:['Ligt rechtsboven in de buik.','Werkt nauw samen met galblaas, darmen en alvleesklier.','Leverklachten zijn soms vaag: moeheid, jeuk, misselijkheid, geelzucht of drukgevoel.'],symptoms:['Pijn/druk rechtsboven','Misselijkheid','Jeuk','Donkere urine','Gele huid/ogen','Moeheid'],redflags:['Gele huid/ogen met sufheid, koorts of ernstige buikpijn.','Bloedbraken, zwarte ontlasting of verwardheid.'],prevention:['Matig alcohol, gezond gewicht, medicatiebewustzijn, hepatitispreventie.']},
      stomach:{x:57,y:51,r:4.8,title:'Maag',system:'Spijsvertering',summary:'Breekt voedsel af, mengt met maagzuur en voert door naar de dunne darm.',overview:['Reflux, gastritis, maagzweer en functionele klachten kunnen op elkaar lijken.','Klachten hangen vaak samen met eten, stress, medicatie of infectie.'],symptoms:['Branden achter borstbeen','Maagpijn','Misselijkheid','Opboeren','Vol gevoel'],redflags:['Bloed braken, zwarte ontlasting of plots hevige buikpijn.','Onverklaard gewichtsverlies of slikproblemen.'],prevention:['Regelmaat, matig alcohol, niet roken, voorzichtig met NSAID’s.']},
      pancreas:{x:53,y:54,r:3.1,title:'Alvleesklier',system:'Spijsvertering / hormonen',summary:'Maakt verteringsenzymen en hormonen zoals insuline.',overview:['Ligt diep in de bovenbuik.','Heeft zowel spijsverterings- als bloedsuikerfunctie.'],symptoms:['Bovenbuikpijn','Misselijkheid/braken','Vettige ontlasting','Bloedsuikerschommelingen'],redflags:['Hevige bovenbuikpijn uitstralend naar rug met braken.','Gele huid/ogen of ernstige ziek indruk.'],prevention:['Alcohol matigen, gezond gewicht, galsteenrisico beperken, diabetes opvolgen.']},
      spleen:{x:67,y:48,r:3.0,title:'Milt',system:'Afweer / bloed',summary:'Filtert bloed en speelt rol in afweer.',overview:['Ligt linksboven in de buik.','Kan vergroot zijn bij infecties, bloedziekten of ontstekingsprocessen.'],symptoms:['Pijn linksboven','Vol gevoel','Uitstraling naar linkerschouder'],redflags:['Buiktrauma met pijn linksboven, duizeligheid of flauwvallen.'],prevention:['Bij bekende miltproblemen: bespreek vaccinaties en contactsport met arts.']},
      leftKidney:{x:42,y:59,r:3.2,title:'Linkernier',system:'Urinewegen / bloeddruk',summary:'Filtert afvalstoffen, regelt vocht, zouten en bloeddruk.',overview:['Nieren geven vaak flankklachten of indirecte klachten via urine, bloeddruk of vochtbalans.'],symptoms:['Flankpijn','Bloed in urine','Koorts','Pijn bij plassen','Moeheid'],redflags:['Koorts met flankpijn.','Niet kunnen plassen of ernstige zwelling/benauwdheid.'],prevention:['Voldoende drinken, bloeddruk controleren, diabetes goed behandelen.']},
      rightKidney:{x:58,y:59,r:3.2,title:'Rechternier',system:'Urinewegen / bloeddruk',summary:'Filtert bloed en maakt urine.',overview:['Samen met linkernier essentieel voor afvalstoffen en bloeddruk.'],symptoms:['Flankpijn','Urinewegklachten','Misselijkheid','Koorts'],redflags:['Koorts, ziek gevoel en flankpijn.','Bloed in urine na trauma.'],prevention:['Voldoende vocht, bloeddruk/suiker volgen, medicatiebewustzijn.']},
      colon:{x:50,y:69,r:8.2,title:'Dikke darm',system:'Spijsvertering',summary:'Onttrekt vocht aan ontlasting en vervoert naar endeldarm.',overview:['Speelt rol bij ontlastingsritme, microbiome en vochtbalans.','Klachten kunnen functioneel zijn, maar alarmsignalen vragen beoordeling.'],symptoms:['Verstopping','Diarree','Bloed/slijm','Buikkrampen','Veranderde ontlasting'],redflags:['Aanhoudend bloedverlies, nachtelijke klachten, onbedoeld gewichtsverlies of bloedarmoede.'],prevention:['Vezels, beweging, vocht, screening op leeftijd/risico.']},
      smallBowel:{x:50,y:74,r:6.0,title:'Dunne darm',system:'Spijsvertering',summary:'Belangrijkste plaats voor opname van voedingsstoffen.',overview:['Neemt voedingsstoffen en veel vocht op.','Klachten kunnen komen door infectie, intolerantie, ontsteking of obstructie.'],symptoms:['Krampen','Diarree','Opgeblazen gevoel','Misselijkheid','Voedselintolerantie'],redflags:['Uitdroging, bloed bij ontlasting, hevige aanhoudende pijn, opgezette buik met braken.'],prevention:['Vezels passend bij tolerantie, voldoende drinken, voedselveiligheid.']},
      bladder:{x:50,y:84,r:3.7,title:'Blaas',system:'Urinewegen',summary:'Slaat urine tijdelijk op.',overview:['Klachten kunnen passen bij infectie, irritatie, prostaat/bekkenbodem of neurologische factoren.'],symptoms:['Pijn bij plassen','Vaak kleine beetjes','Aandrang','Bloed in urine','Onderbuikpijn'],redflags:['Koorts met urineklachten, flankpijn of niet kunnen plassen.','Zichtbaar bloed in urine zonder duidelijke verklaring.'],prevention:['Voldoende drinken, niet lang ophouden, urineweginfecties tijdig behandelen.']}
    }
  },
  skeleton: {
    label:'Skelet',
    image:'assets/skeleton.png',
    note:'Skeletlaag',
    items:{
      skull:{x:50,y:6,r:4,title:'Schedel',system:'Skelet',summary:'Beschermt hersenen en zintuigen.',overview:['Bestaat uit meerdere schedelbeenderen.','Beschermt hersenen en vormt gezichtsskelet.'],symptoms:['Pijn na stoot/val','Kaakpijn','Hoofdpijn'],redflags:['Bewustzijnsverlies, braken of uitval na hoofdletsel.'],prevention:['Helm bij risico, valpreventie.']},
      ribcage:{x:50,y:25,r:8,title:'Ribbenkast',system:'Skelet',summary:'Beschermt hart en longen.',overview:['Ribben, borstbeen en thoracale wervels.'],symptoms:['Pijn bij ademhalen','Drukpijn','Pijn na hoesten/stoot'],redflags:['Kortademigheid na trauma of hevige borstpijn.'],prevention:['Core training, botgezondheid, gordelgebruik.']},
      spine:{x:50,y:37,r:4,title:'Wervelkolom',system:'Skelet / zenuwstelsel',summary:'Draagt romp en beschermt ruggenmerg.',overview:['Cervicaal, thoracaal, lumbaal en sacraal.'],symptoms:['Rugpijn','Uitstraling','Stijfheid'],redflags:['Rijbroekgevoel, incontinentie, snel toenemende uitval.'],prevention:['Corekracht, bewegen, ergonomie.']},
      pelvis:{x:50,y:48,r:6,title:'Bekken',system:'Skelet',summary:'Draagt lichaamsgewicht en beschermt bekkenorganen.',overview:['Belangrijk voor houding, lopen, zwangerschap en bekkenbodem.'],symptoms:['Heuppijn','Liespijn','Bekkenpijn'],redflags:['Niet kunnen lopen na val.'],prevention:['Krachttraining, valpreventie, botgezondheid.']},
      leftShoulder:{x:31,y:21,r:3.2,title:'Linkerschouder',system:'Gewricht',summary:'Complex gewricht voor armbeweging.',overview:['Bestaat uit kop, kom, sleutelbeen en schouderblad.'],symptoms:['Pijn bij heffen','Instabiliteit','Krachtverlies'],redflags:['Uit de kom, hevige pijn na val, gevoelsverlies.'],prevention:['Schouderbladcontrole, geleidelijke belasting.']},
      leftHand:{x:22,y:57,r:3.2,title:'Linkerhand',system:'Skelet',summary:'Fijne botten voor grip en precisie.',overview:['Carpalia, metacarpalia en vingerkootjes.'],symptoms:['Pijn bij grijpen','Tintelingen','Zwelling'],redflags:['Bleke/gevoelloze vingers na letsel.'],prevention:['Ergonomie, beschermingsmateriaal.']},
      leftKnee:{x:46,y:79,r:3,title:'Linkerknie',system:'Gewricht',summary:'Complex scharniergewricht voor lopen en traplopen.',overview:['Bot, kraakbeen, meniscus en banden werken samen.'],symptoms:['Zwelling','Slotklachten','Pijn bij traplopen'],redflags:['Niet kunnen belasten of fors slot na trauma.'],prevention:['Quadriceps/hamstrings trainen, belasting opbouwen.']},
      leftFoot:{x:44,y:94,r:3.5,title:'Linkervoet',system:'Skelet',summary:'Draagt gewicht en ondersteunt balans.',overview:['Veel kleine botten, pezen en gewrichten.'],symptoms:['Voetpijn','Pijn bij stappen','Zwelling'],redflags:['Open letsel, niet kunnen staan, koude/bleke voet.'],prevention:['Goed schoeisel, voetkracht, diabetes voetcontrole.']}
    }
  },
  circulatory: {
    label:'Bloedvaten',
    image:'assets/circulatory.png',
    note:'Arteriën en venen',
    items:{
      brainVessels:{x:50,y:8,r:3.5,title:'Hersenvaten',system:'Bloedvaten',summary:'Voeden hersenen met zuurstof en glucose.',overview:['Kwetsbaar bij hoge bloeddruk, stolsels en vaatziekte.'],symptoms:['TIA/CVA-klachten','Duizeligheid','Plots uitval'],redflags:['Scheve mond, spraakprobleem, krachtsverlies.'],prevention:['Bloeddruk, cholesterol, beweging, niet roken.']},
      heartVessels:{x:52,y:29,r:4.2,title:'Hart en grote vaten',system:'Bloedvaten',summary:'Centrale pomp en doorvoer van grote vaten.',overview:['Aorta, vena cava en longcirculatie werken samen.'],symptoms:['Borstdruk','Kortademigheid','Hartkloppingen'],redflags:['Acuut drukkende borstpijn of flauwvallen.'],prevention:['Rookstop, beweging, bloeddruk/cholesterol.']},
      renalVessels:{x:50,y:45,r:4,title:'Nierdoorbloeding',system:'Bloedvaten',summary:'Sterke doorbloeding voor filtering en bloeddrukregeling.',overview:['Nieren zijn gevoelig voor bloeddruk, diabetes en medicatie.'],symptoms:['Vaak indirect via nierfunctie','Hoge bloeddruk'],redflags:['Ernstige nierfunctiedaling of hevige flankpijn.'],prevention:['Bloeddruk/suiker behandelen, medicatiebewustzijn.']},
      abdominalAorta:{x:50,y:54,r:3.5,title:'Buikaorta',system:'Bloedvaten',summary:'Hoofdslagader in de buik.',overview:['Geeft takken naar buikorganen en benen.'],symptoms:['Vaak geen klachten','Buik/rugpijn'],redflags:['Plots hevige buik/rugpijn of collaps.'],prevention:['Rookstop en vaatrisico’s behandelen.']},
      armVessels:{x:25,y:44,r:5,title:'Armvaten',system:'Bloedvaten',summary:'Voorzien arm en hand van bloed.',overview:['Slagaders en aders naar hand en vingers.'],symptoms:['Koude hand','Kleurverandering','Tintelingen'],redflags:['Plots bleke, koude, pijnlijke arm.'],prevention:['Beweeg, afknelling vermijden.']},
      legVessels:{x:50,y:86,r:6,title:'Beenvaten',system:'Bloedvaten',summary:'Doorbloeding van benen en voeten.',overview:['Belangrijk voor lopen, wondgenezing en temperatuur.'],symptoms:['Zware benen','Kramp bij lopen','Zwelling'],redflags:['Acuut dik pijnlijk been of koud wit been.'],prevention:['Bewegen, rookstop, compressie waar geadviseerd.']}
    }
  },
  nervous: {
    label:'Zenuwstelsel',
    image:'assets/nervous.png',
    note:'Centrale en perifere zenuwen',
    dark:true,
    items:{
      brainN:{x:50,y:7,r:3.5,title:'Hersenen',system:'Zenuwstelsel',summary:'Centrale verwerking en aansturing.',overview:['Onderdeel van centrale zenuwstelsel.','Stuurt cognitie, gedrag, beweging en autonome functies.'],symptoms:['Hoofdpijn','Concentratieproblemen','Uitval','Tintelingen'],redflags:['Acute neurologische uitval, insult, hevige acute hoofdpijn.'],prevention:['Slaap, beweging, cardiovasculaire preventie.']},
      cranial:{x:50,y:13,r:3,title:'Aangezichtszenuwen',system:'Zenuwstelsel',summary:'Zenuwen voor gezicht, slikken, ogen en gehoor.',overview:['Belangrijk voor mimiek, gevoel en specifieke functies.'],symptoms:['Tintelingen gezicht','Dubbelzien','Aangezichtspijn'],redflags:['Plots scheef gezicht of slikproblemen.'],prevention:['Snelle beoordeling bij acute uitval.']},
      brachial:{x:50,y:25,r:7,title:'Brachiale plexus',system:'Zenuwstelsel',summary:'Zenuwknooppunt voor schouder, arm en hand.',overview:['Kan klachten geven bij nek/schouderproblemen of beknelling.'],symptoms:['Tintelingen arm/hand','Krachtsverlies','Brandende pijn'],redflags:['Plots fors krachtsverlies of doof gevoel.'],prevention:['Houding, ergonomie, belasting variëren.']},
      spinalCord:{x:50,y:41,r:4.5,title:'Ruggenmerg',system:'Zenuwstelsel',summary:'Centrale zenuwbaan in de wervelkolom.',overview:['Verbindt hersenen met lichaam.','Kwetsbaar bij letsel of druk.'],symptoms:['Uitstralende pijn','Gevoelsstoornis','Loopproblemen'],redflags:['Nieuwe incontinentie, rijbroekgevoel, snel toenemende uitval.'],prevention:['Rugbelasting verstandig opbouwen; spoed bij ernstige uitval.']},
      sciatic:{x:50,y:66,r:5,title:'Heup- en beenzenuwen',system:'Zenuwstelsel',summary:'Zenuwbanen voor motoriek en gevoel in benen.',overview:['O.a. nervus ischiadicus.'],symptoms:['Uitstralende pijn naar bil/been','Brandende zenuwpijn'],redflags:['Onhoudbare pijn met uitval of voethefferszwakte.'],prevention:['Bewegen, rug/heupspieren, ergonomie.']},
      footNerves:{x:50,y:92,r:6,title:'Voetzenuwen',system:'Zenuwstelsel',summary:'Belangrijk voor gevoel, lopen en balans.',overview:['Kwetsbaar bij diabetes, beknelling of zenuwschade.'],symptoms:['Doof gevoel voeten','Brandende pijn','Loopinstabiliteit'],redflags:['Voetval of plots niet goed kunnen lopen.'],prevention:['Voetcontrole, diabeteszorg, geschikt schoeisel.']}
    }
  }
};

const knowledge = [
  {cat:'Hart',title:'Hartklachten serieus nemen',text:'Drukkende borstpijn, benauwdheid, zweten, misselijkheid of uitstraling naar arm/kaak zijn alarmsignalen.'},
  {cat:'Ademhaling',title:'Longen en benauwdheid',text:'Ernstige kortademigheid, blauwe lippen, sufheid of bloed ophoesten vraagt snelle beoordeling.'},
  {cat:'Buik',title:'Buikpijn context',text:'Locatie, duur, koorts, braken, ontlasting, urine en zwangerschap/context bepalen urgentie.'},
  {cat:'Jongeren',title:'Puberteit normaliseren',text:'Borstgroei, haargroei, stemverandering, lichaamsgeur en verschillen in ontwikkeling variëren sterk en zijn vaak normaal.'},
  {cat:'Jongeren',title:'SOA/STI zonder beeld',text:'Jongeren moeten klachten veilig kunnen beschrijven. Onder 16 worden geen intieme beelden verwerkt.'},
  {cat:'Hormonen',title:'Perimenopauze-context',text:'Slaapstoornis, brain fog, hartkloppingen, opvliegers en cyclusverandering kunnen hormonale context hebben zonder andere oorzaken uit te sluiten.'},
  {cat:'Privacy',title:'Atlas versus gebruikerbeeld',text:'Atlas Studio is educatief en wordt niet geblurd. AR, uploads en screenshots van echte personen vallen onder SafeBlur.'}
];
const redFlags = ['druk op borst','benauwd','koorts','flauwvallen','scheve mond','krachtsverlies','spraakproblemen','hevige bloeding','bloed braken','zwarte ontlasting','bloed in urine','niet kunnen plassen'];

function getLayer(){ return data[state.layer]; }
function getItem(){ return state.item ? getLayer().items[state.item] : null; }

async function killCaches(){
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
  const bg=p.background||'prefer-not';
  const overlay=$('#representationOverlay');
  overlay.className='representation-overlay';
  if(bg && bg!=='prefer-not') overlay.classList.add(bg);
  const child=Number(p.age)>0 && Number(p.age)<16;
  $('#childSafeOverlay').classList.toggle('hidden',!child);
  $('#profileStatus').textContent=child?'Kindprofiel: atlas met ondergoedlaag':'Atlasprofiel: biologisch educatief beeld';
}

function transformString(){ return `translate(-50%, -50%) translate(${state.x}px, ${state.y}px) scale(${state.zoom})`; }
function applyTransform(){
  $('#atlasImage').style.transform=transformString();
  $('#hotspotLayer').style.transform=`translate(${state.x}px, ${state.y}px) scale(${state.zoom})`;
  $('#hotspotLayer').style.transformOrigin='50% 50%';
}

function renderLayerTabs(){
  $('#layerTabs').innerHTML=Object.entries(data).map(([k,l])=>`<button class="layer-btn ${k===state.layer?'active':''}" data-layer="${k}">${l.label}</button>`).join('');
  $$('#layerTabs button').forEach(b=>b.onclick=()=>{state.layer=b.dataset.layer;state.item=null;state.zoom=1;state.x=0;state.y=0;renderAll();});
}
function renderAll(){
  const layer=getLayer();
  $('#layerTitle').textContent=layer.label;
  $('#selectedBreadcrumb').textContent=state.item?`${layer.label} › ${getItem().title}`:'Volledig lichaam';
  $('#viewer').style.background=layer.dark?'#06101e':'linear-gradient(180deg,#fbfdff,#eaf4fb)';
  $('#atlasImage').src=`${layer.image}?v=1k`;
  renderHotspots();
  renderDetail();
  updateSelectionChip();
  applyTransform();
  renderLayerTabs();
}
function renderHotspots(){
  const layer=getLayer();
  const host=$('#hotspotLayer');
  host.innerHTML='';
  Object.entries(layer.items).forEach(([id,item])=>{
    const h=document.createElement('button');
    h.className='hotspot'+(id===state.item?' active':'');
    h.dataset.id=id; h.dataset.label=item.title;
    h.style.left=item.x+'%'; h.style.top=item.y+'%';
    const size=Math.max(18, item.r*7);
    h.style.width=size+'px'; h.style.height=size+'px';
    h.onclick=(e)=>{e.stopPropagation();selectItem(id);};
    host.appendChild(h);
  });
}
function selectItem(id){
  state.item=id;
  const item=getItem();
  state.zoom=Math.max(1.8, item.r<4 ? 2.45 : 2.05);
  const rect=$('#viewer').getBoundingClientRect();
  state.x=(50-item.x)*rect.width/100*state.zoom;
  state.y=(50-item.y)*rect.height/100*state.zoom;
  renderHotspots(); renderDetail(); updateSelectionChip(); applyTransform();
}
function renderTabs(){
  const tabs={overview:'Functie',symptoms:'Klachten',redflags:'Alarmsignalen',prevention:'Preventie'};
  $('#detailTabs').innerHTML=Object.entries(tabs).map(([k,v])=>`<button class="detail-tab ${state.tab===k?'active':''}" data-tab="${k}">${v}</button>`).join('');
  $$('#detailTabs button').forEach(b=>b.onclick=()=>{state.tab=b.dataset.tab;renderDetail();});
}
function renderDetail(){
  renderTabs();
  const item=getItem();
  if(!item){
    $('#detailTitle').textContent='Kies een structuur';
    $('#detailSummary').textContent='Tik op een hotspot of gebruik de zoekfunctie.';
    $('#detailBody').innerHTML=`<div class="card"><strong>Professionele atlas-flow</strong><ul><li>Geen amateuristisch pseudo-3D-poppetje.</li><li>Realistische medische atlasbeelden.</li><li>Pan & zoom met muis of vinger.</li><li>Kleine hotspots en directe detailkaarten.</li><li>Atlas Studio wordt niet geblurd.</li></ul></div>`;
    return;
  }
  $('#detailTitle').textContent=item.title;
  $('#detailSummary').textContent=item.summary;
  $('#selectedBreadcrumb').textContent=`${getLayer().label} › ${item.title}`;
  const labels={overview:'Functie en context',symptoms:'Veelvoorkomende klachten',redflags:'Wanneer alarmerend?',prevention:'Preventie'};
  $('#detailBody').innerHTML=`<div class="card"><strong>Systeem</strong><div>${item.system}</div></div><div class="card"><strong>${labels[state.tab]}</strong><ul>${item[state.tab].map(x=>`<li>${x}</li>`).join('')}</ul></div><div class="card"><strong>Indicatief</strong><br/>Deze informatie is educatief en vervangt geen arts of spoedzorg.</div>`;
}
function updateSelectionChip(){
  const item=getItem();
  $('#activeSelectionChip').textContent=item?`Atlasselectie: ${item.title} (${item.system})`:'Nog geen atlasselectie gekozen';
}
function setupPanZoom(){
  const viewer=$('#viewer');
  viewer.addEventListener('pointerdown',e=>{
    state.dragging=true; state.startX=e.clientX; state.startY=e.clientY; state.baseX=state.x; state.baseY=state.y; viewer.setPointerCapture(e.pointerId);
  });
  viewer.addEventListener('pointermove',e=>{
    if(!state.dragging) return;
    state.x=state.baseX+(e.clientX-state.startX);
    state.y=state.baseY+(e.clientY-state.startY);
    applyTransform();
  });
  viewer.addEventListener('pointerup',()=>state.dragging=false);
  viewer.addEventListener('pointercancel',()=>state.dragging=false);
  viewer.addEventListener('wheel',e=>{
    e.preventDefault();
    const old=state.zoom;
    state.zoom=Math.max(1,Math.min(4,state.zoom+(e.deltaY<0?.15:-.15)));
    const factor=state.zoom/old;
    state.x*=factor; state.y*=factor;
    applyTransform();
  },{passive:false});
}
function renderRedFlags(){
  $('#redFlags').innerHTML=redFlags.map(f=>`<button class="layer-btn redflag" data-flag="${f}">${f}</button>`).join('');
  $$('.redflag').forEach(b=>b.onclick=()=>b.classList.toggle('active'));
}
function renderKnowledge(){
  const cats=['Alles',...new Set(knowledge.map(k=>k.cat))];
  $('#knowledgeFilters').innerHTML=cats.map(c=>`<button class="layer-btn ${c==='Alles'?'active':''}" data-cat="${c}">${c}</button>`).join('');
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
    const results=[];
    Object.entries(data).forEach(([lk,layer])=>Object.entries(layer.items).forEach(([id,item])=>{
      const hay=[item.title,item.system,item.summary,id,layer.label].join(' ').toLowerCase();
      if(hay.includes(q)) results.push({lk,id,item});
    }));
    $('#searchResults').innerHTML=results.slice(0,10).map(r=>`<button data-layer="${r.lk}" data-id="${r.id}"><strong>${r.item.title}</strong><br><small>${data[r.lk].label}</small></button>`).join('')||'<button>Geen resultaat</button>';
    $('#searchResults').classList.remove('hidden');
    $$('#searchResults button[data-layer]').forEach(b=>b.onclick=()=>{state.layer=b.dataset.layer;renderLayerTabs();renderAll();selectItem(b.dataset.id);input.value='';$('#searchResults').classList.add('hidden');});
  });
}
function analyze(){
  const item=getItem(), profile=getProfile(), flags=$$('.redflag.active').map(x=>x.dataset.flag);
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
  $('#forceBtn').onclick=async()=>{await killCaches(); location.href='stage1k.html?v='+Date.now();};
  $('#zoomInBtn').onclick=()=>{state.zoom=Math.min(4,state.zoom+.25);applyTransform();};
  $('#zoomOutBtn').onclick=()=>{state.zoom=Math.max(1,state.zoom-.25);applyTransform();};
  $('#resetBtn').onclick=()=>{state.zoom=1;state.x=0;state.y=0;state.item=null;renderHotspots();renderDetail();updateSelectionChip();applyTransform();};
  $('#useForSymptoms').onclick=()=>{location.hash='symptoms';const item=getItem(); if(item) $('#symptomText').value=`Klacht bij ${item.title}: `; $('#symptomText').focus();};
  $('#showPrevention').onclick=()=>{state.tab='prevention';renderDetail();};
  $('#analyzeBtn').onclick=analyze;
}
async function init(){
  await killCaches();
  const p=loadProfile(); if(!p) showProfile();
  renderLayerTabs(); renderAll(); renderRedFlags(); renderKnowledge(); setupSearch(); setupPanZoom(); bind();
}
document.addEventListener('DOMContentLoaded',init);
