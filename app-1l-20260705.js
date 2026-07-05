// HealthLens Stage 1L — 3D asset architecture with procedural fallback
const $=s=>document.querySelector(s);
const $$=s=>Array.from(document.querySelectorAll(s));
const STORE_KEY='healthlens.profile.1l';

const state={layer:'none',selected:null,tab:'overview',autoRotate:false,threeReady:false,objects:{},rayTargets:[],camera:null,scene:null,renderer:null,group:null,rotating:false,startX:0,startRot:0};

async function killCaches(){
  try{
    if('serviceWorker' in navigator){const regs=await navigator.serviceWorker.getRegistrations();for(const reg of regs) await reg.unregister();}
    if('caches' in window){const keys=await caches.keys();await Promise.all(keys.map(k=>caches.delete(k)));}
  }catch(e){}
}

const skinTones={
  'prefer-not':0xc58c72,european:0xd39b7e,african:0x6b3a26,mena:0xaa6a47,'south-asian':0x8b5638,'east-asian':0xc58b63,'se-asian':0x8c5a38,latin:0x9a6040,other:0x8f5c3e
};

const layers=[
  {key:'none',label:'Default persoon'},
  {key:'organs',label:'Organen'},
  {key:'skeleton',label:'Skelet'},
  {key:'vessels',label:'Bloedvaten'},
  {key:'nerves',label:'Zenuwen'},
  {key:'hormones',label:'Hormonen'}
];

const A={
  head:{title:'Hoofd',system:'Regio',x:0,y:1.85,z:0,summary:'Hoofdregio met hersenen, schedel, aangezicht, bloedvaten en zenuwen.',overview:['Bevat hersenen, zintuigen, schedel, aangezichtszenuwen en bloedvaten.','Klik dieper op hersenen of schedel zodra de juiste laag zichtbaar is.'],symptoms:['Hoofdpijn','Duizeligheid','Verwardheid','Aangezichtsklachten'],redflags:['Scheve mond, spraakproblemen, krachtsverlies, bewustzijnsdaling.'],prevention:['Slaap, helm waar nodig, bloeddrukcontrole.'],questions:['Wanneer begon het?','Is er sprake van uitval, spraakprobleem of scheef gezicht?','Was er trauma?'],differentials:['Spanningshoofdpijn/migraine','Beroerte/TIA bij acute uitval','Infectie/trauma afhankelijk van context']},
  chest:{title:'Borstkas',system:'Regio',x:0,y:.85,z:0,summary:'Borstregio met hart, longen, ribben, grote vaten en spieren.',overview:['Belangrijke regio voor hart, longen en borstwand.','Borstklachten worden altijd beoordeeld op urgentiesignalen.'],symptoms:['Borstdruk','Benauwdheid','Hoesten','Pijn bij ademhalen'],redflags:['Drukkende borstpijn, ernstige benauwdheid, flauwvallen, uitstraling naar arm/kaak.'],prevention:['Rookstop, beweging, bloeddruk/cholesterol, conditie.'],questions:['Is de pijn drukkend, stekend of bewegingsafhankelijk?','Straalt het uit naar arm, rug, kaak of schouder?','Is er benauwdheid of zweten?'],differentials:['Hartgerelateerde pijn','Longprobleem zoals infectie/embolie/astma','Spier/rib/borstwandpijn']},
  abdomen:{title:'Buik',system:'Regio',x:0,y:.05,z:0,summary:'Buikregio met lever, maag, darmen, pancreas, nieren en grote vaten.',overview:['Locatie, duur, koorts, ontlasting, urine en eten zijn belangrijk.'],symptoms:['Buikpijn','Misselijkheid','Diarree','Verstopping','Geelzucht'],redflags:['Hevige pijn, harde buik, bloedverlies, aanhoudend braken, geelzucht met ziek zijn.'],prevention:['Vezels, vocht, beweging, alcohol matigen, hygiëne.'],questions:['Waar zit de pijn precies?','Is er koorts, braken, diarree of bloed?','Relatie met eten, plassen of ontlasting?'],differentials:['Maag/darmklachten','Lever/gal/pancreasgebied afhankelijk van locatie','Urineweg/nier bij flank of plasklachten']},
  pelvis:{title:'Bekken',system:'Regio',x:0,y:-.75,z:0,summary:'Bekkenregio met blaas, bekkenbodem, voortplantings-/hormooncontext en bekkenbotten.',overview:['Belangrijk voor plassen, ontlasting, bekkenbodem en seksuele gezondheid.'],symptoms:['Onderbuikpijn','Plasklachten','Bekkenpijn'],redflags:['Niet kunnen plassen, zwangerschap met pijn/bloeding, ernstige pijn/koorts.'],prevention:['Vocht, bekkenbodemzorg, veilige seksuele gezondheid.'],questions:['Zijn er plasklachten?','Is er koorts of bloed in urine?','Is zwangerschap mogelijk?'],differentials:['Blaas/urineweg','Bekkenbodem/spier','Gynaecologische/urologische context afhankelijk profiel']},
  heart:{title:'Hart',system:'Organen',x:0.05,y:.82,z:.2,summary:'Pompt bloed rond en voorziet organen van zuurstof en voedingsstoffen.',overview:['Vier kamers, kleppen en elektrische geleiding werken samen.','Bij vrouwen, ouderen en mensen met diabetes kunnen hartklachten atypischer zijn.'],symptoms:['Drukkende pijn op de borst','Kortademigheid','Hartkloppingen','Zweten/misselijkheid','Uitstraling arm/kaak'],redflags:['Nieuwe drukkende borstpijn of benauwdheid.','Flauwvallen.','Borstpijn met zweten, misselijkheid of uitstraling.'],prevention:['Beweeg, rook niet, controleer bloeddruk/cholesterol/diabetes.'],questions:['Is het drukkend of stekend?','Hoe lang duurt het?','Uitstraling naar arm/kaak/rug?','Benauwd of zweten?'],differentials:['Angina/infarct bij typische alarmsignalen','Ritmestoornis bij hartkloppingen/flauwvallen','Borstwand/long/maag als alternatief afhankelijk klachten']},
  leftLung:{title:'Linkerlong',system:'Organen',x:-.28,y:.9,z:.05,summary:'Belangrijk voor zuurstofopname en koolzuurafgifte.',overview:['Gaswisseling vindt plaats in longblaasjes.','Klachten hangen samen met ademhaling, infectie, allergie of vaatproblemen.'],symptoms:['Hoesten','Benauwdheid','Piepende ademhaling','Pijn bij ademhalen'],redflags:['Ernstige kortademigheid, blauwe lippen, sufheid, bloed ophoesten.'],prevention:['Niet roken, bewegen, vaccinaties waar relevant.'],questions:['Hoest je?','Is er koorts?','Pijn bij ademhalen?','Benauwd in rust?'],differentials:['Luchtweginfectie','Astma/COPD/reactieve luchtwegen','Longembolie/klaplong bij acute ernstige klachten']},
  rightLung:{title:'Rechterlong',system:'Organen',x:.28,y:.9,z:.05,summary:'Grotere long met drie kwabben, belangrijk voor ademhaling.',overview:['Pijn rechts kan ook uit ribben, spieren, lever of gal komen.'],symptoms:['Hoesten','Benauwdheid','Koorts met hoest','Pijn bij diepe ademhaling'],redflags:['Acuut forse kortademigheid of pijn op borst.'],prevention:['Rookstop, conditie, infecties bij risico laten beoordelen.'],questions:['Hoest/koorts?','Pijn bij ademhaling?','Acute benauwdheid?'],differentials:['Infectie','Borstwand/ribpijn','Longembolie/klaplong bij acute alarmsignalen']},
  liver:{title:'Lever',system:'Organen',x:.26,y:.22,z:.12,summary:'Stofwisselingsorgaan dat stoffen afbreekt, eiwitten maakt, gal produceert en energie opslaat.',overview:['Ligt rechtsboven in de buik.','Klachten kunnen vaag zijn: moeheid, jeuk, misselijkheid of geelzucht.'],symptoms:['Pijn rechtsboven','Misselijkheid','Jeuk','Donkere urine','Geelzucht'],redflags:['Gele huid/ogen met sufheid, koorts of ernstige buikpijn.','Bloedbraken of zwarte ontlasting.'],prevention:['Alcohol matigen, gezond gewicht, medicatiebewustzijn, hepatitispreventie.'],questions:['Gele ogen/huid?','Donkere urine of lichte ontlasting?','Alcohol/medicatie/koorts?'],differentials:['Lever/galwegprobleem','Galblaaskoliek/ontsteking','Maag/darm of spierpijn afhankelijk context']},
  stomach:{title:'Maag',system:'Organen',x:-.18,y:.18,z:.15,summary:'Mengkamer voor voedsel en maagzuur.',overview:['Reflux, gastritis en maagzweer kunnen overlappende klachten geven.'],symptoms:['Maagpijn','Branden','Misselijkheid','Opboeren','Vol gevoel'],redflags:['Bloed braken, zwarte ontlasting, onverklaard gewichtsverlies.'],prevention:['Regelmatig eten, alcohol matigen, voorzichtig met NSAID’s.'],questions:['Relatie met eten?','Branderig of krampend?','Zwarte ontlasting of bloed?'],differentials:['Reflux/gastritis','Maagzweer bij alarmsignalen/NSAID','Gal/pancreas/hart afhankelijk lokalisatie']},
  pancreas:{title:'Alvleesklier',system:'Organen / hormonen',x:.05,y:.05,z:.18,summary:'Maakt verteringsenzymen en hormonen zoals insuline.',overview:['Ligt diep in de bovenbuik en verbindt spijsvertering met bloedsuikerhuishouding.'],symptoms:['Bovenbuikpijn','Misselijkheid/braken','Vettige ontlasting','Bloedsuikerschommelingen'],redflags:['Hevige bovenbuikpijn uitstralend naar rug met braken.'],prevention:['Alcohol matigen, gezond gewicht, diabetescontrole.'],questions:['Straalt pijn naar rug?','Braken?','Alcohol/galstenen bekend?'],differentials:['Pancreatitis bij hevige bovenbuikpijn naar rug','Maag/galproblemen','Diabetesgerelateerde context']},
  colon:{title:'Dikke darm',system:'Spijsvertering',x:0,y:-.25,z:.12,summary:'Onttrekt vocht aan ontlasting en vervoert naar endeldarm.',overview:['Belangrijk voor ontlastingsritme en microbiome.'],symptoms:['Verstopping','Diarree','Bloed/slijm','Buikkrampen'],redflags:['Aanhoudend bloedverlies, nachtelijke klachten, onbedoeld gewichtsverlies.'],prevention:['Vezels, beweging, vocht, screening op leeftijd/risico.'],questions:['Diarree of obstipatie?','Bloed/slijm?','Nachtelijke klachten of gewichtsverlies?'],differentials:['Functionele darmklachten','Infectie/ontsteking','Screenings-/alarmsignaalcontext bij bloed/gewichtsverlies']},
  leftKidney:{title:'Linkernier',system:'Urinewegen',x:-.28,y:-.02,z:.05,summary:'Filtert afvalstoffen en regelt vocht, zouten en bloeddruk.',overview:['Nierklachten geven vaak flankpijn, urineklachten of koorts.'],symptoms:['Flankpijn','Bloed in urine','Koorts','Pijn bij plassen'],redflags:['Koorts met flankpijn.','Niet kunnen plassen.'],prevention:['Voldoende drinken, bloeddruk en diabetes goed behandelen.'],questions:['Flankpijn?','Koorts?','Bloed in urine of pijn bij plassen?'],differentials:['Niersteen','Nierbekkenontsteking','Spier/rugpijn']},
  rightKidney:{title:'Rechternier',system:'Urinewegen',x:.28,y:-.02,z:.05,summary:'Filtert bloed en maakt urine.',overview:['Samen met linkernier essentieel voor afvalstoffen en bloeddruk.'],symptoms:['Flankpijn','Urinewegklachten','Koorts'],redflags:['Koorts, ziek gevoel en flankpijn.'],prevention:['Voldoende vocht, bloeddruk/suiker controleren.'],questions:['Flankpijn?','Koorts?','Bloed in urine of pijn bij plassen?'],differentials:['Niersteen','Nierbekkenontsteking','Spier/rugpijn']},
  bladder:{title:'Blaas',system:'Urinewegen',x:0,y:-.75,z:.12,summary:'Slaat urine tijdelijk op.',overview:['Klachten kunnen infectie, irritatie of bekkenbodemcontext hebben.'],symptoms:['Pijn bij plassen','Aandrang','Vaak kleine beetjes','Bloed in urine'],redflags:['Koorts met urineklachten, flankpijn of niet kunnen plassen.'],prevention:['Voldoende drinken, niet lang ophouden.'],questions:['Pijn/branden bij plassen?','Vaak kleine beetjes?','Koorts of flankpijn?'],differentials:['Blaasontsteking','Nierbekkenontsteking bij koorts/flankpijn','Bekkenbodem/prostaat/gynaecologische context']},
  skull:{title:'Schedel',system:'Skelet',x:0,y:1.87,z:0,summary:'Beschermt hersenen en zintuigen.',overview:['Meerdere schedelbeenderen beschermen hersenen.'],symptoms:['Pijn na stoot/val','Hoofdpijn','Kaakpijn'],redflags:['Bewustzijnsverlies, braken of uitval na hoofdletsel.'],prevention:['Helm bij risico, valpreventie.'],questions:['Trauma?','Bewustzijnsverlies?','Braken of suf?'],differentials:['Contusie','Hersenschudding','Ernstiger hoofdletsel bij alarmsignalen']},
  ribcage:{title:'Ribbenkast',system:'Skelet',x:0,y:.82,z:0,summary:'Beschermt hart en longen.',overview:['Ribben, borstbeen en wervels vormen de borstkas.'],symptoms:['Pijn bij ademhalen','Drukpijn','Pijn na hoesten/stoot'],redflags:['Kortademigheid na trauma of hevige borstpijn.'],prevention:['Core, botgezondheid, gordelgebruik.'],questions:['Trauma?','Pijn bij diepe ademhaling?','Drukpijn?'],differentials:['Ribkneuzing/breuk','Borstwandspier','Long/hart afhankelijk alarmsignalen']},
  spine:{title:'Wervelkolom',system:'Skelet / zenuwstelsel',x:0,y:.25,z:-.02,summary:'Draagt romp en beschermt ruggenmerg.',overview:['Cervicaal, thoracaal, lumbaal en sacraal.'],symptoms:['Rugpijn','Uitstraling','Stijfheid','Tintelingen'],redflags:['Rijbroekgevoel, incontinentie, snel toenemende uitval.'],prevention:['Corekracht, bewegen, ergonomie.'],questions:['Uitstraling naar been/arm?','Krachtsverlies?','Incontinentie of rijbroekgevoel?'],differentials:['Aspecifieke rugpijn','Zenuwwortelprikkeling','Cauda/ernstige neurologie bij rode vlaggen']}
};

const layerItems={
  none:['head','chest','abdomen','pelvis'],
  organs:['brain','heart','leftLung','rightLung','liver','stomach','pancreas','colon','leftKidney','rightKidney','bladder'],
  skeleton:['skull','ribcage','spine'],
  vessels:['heart','leftKidney','rightKidney','chest','abdomen'],
  nerves:['brain','spine','head','pelvis'],
  hormones:['brain','pancreas','bladder','pelvis']
};

const redFlags=['druk op borst','benauwd','koorts','flauwvallen','scheve mond','krachtsverlies','spraakproblemen','hevige bloeding','bloed braken','zwarte ontlasting','bloed in urine','niet kunnen plassen'];

const modules=[
  {cat:'Urgentie',title:'Rode vlaggen eerst',text:'HealthLens moet altijd eerst spoedsignalen herkennen: borstdruk, ernstige benauwdheid, neurologische uitval, hevig bloedverlies, shock, ernstige uitdroging of bewustzijnsdaling.'},
  {cat:'Hart',title:'Hartklachten',text:'Bij borstdruk met benauwdheid, zweten, misselijkheid of uitstraling is hartcontext urgent. Bij vrouwen/ouderen/diabetes kunnen klachten atypisch zijn.'},
  {cat:'Buik',title:'Buikpijn systematisch',text:'Buikpijn wordt gekoppeld aan locatie, duur, koorts, ontlasting, urine, braken, zwangerschap/context, medicatie en alarmsignalen.'},
  {cat:'Kind',title:'Kinderen',text:'Kindprofielen krijgen veilige atlasweergave; intieme beelden worden niet verwerkt. Tekstuele klachten en educatie blijven wel mogelijk.'},
  {cat:'Hormonen',title:'Perimenopauze',text:'Slaap, stemming, cyclus, hartkloppingen, brain fog en opvliegers kunnen hormonale context hebben zonder andere oorzaken uit te sluiten.'},
  {cat:'Erfelijkheid',title:'Familiegeschiedenis',text:'Familiegeschiedenis kan risico-inschatting beïnvloeden, maar geeft nooit zelfstandig een diagnose.'},
  {cat:'Privacy',title:'SafeBlur',text:'Alleen AR/camera/uploads/screenshot van echte mensen zijn privacygevoelig. Atlas Studio is educatief en wordt niet geblurd.'}
];

function saveProfile(){const p={age:$('#age').value,sex:$('#sex').value,background:$('#background').value,language:$('#language').value,updated:new Date().toISOString()};localStorage.setItem(STORE_KEY,JSON.stringify(p));applyProfile(p);}
function loadProfile(){try{const p=JSON.parse(localStorage.getItem(STORE_KEY)||'null');if(!p)return null;$('#age').value=p.age||'';$('#sex').value=p.sex||'prefer-not';$('#background').value=p.background||'prefer-not';$('#language').value=p.language||'nl';applyProfile(p);return p;}catch{return null}}
function getProfile(){try{return JSON.parse(localStorage.getItem(STORE_KEY)||'{}')}catch{return {}}}
function showProfile(force=false){$('#profileGate').classList.remove('hidden');if(force)$('#profileForm').reset();}
function hideProfile(){$('#profileGate').classList.add('hidden');}
function applyProfile(p=getProfile()){const child=Number(p.age)>0&&Number(p.age)<16;$('#childOverlay').classList.toggle('hidden',!child);$('#profileStatus').textContent=child?'Kindprofiel: veilige atlasmodus':'Profiel: atlas op gebruiker afgestemd';updateSkinTone();}

function renderLayerSwitcher(){
  $('#layerSwitcher').innerHTML=layers.map(l=>`<button class="layer-btn ${l.key===state.layer?'active':''}" data-layer="${l.key}">${l.label}</button>`).join('');
  $$('#layerSwitcher button').forEach(b=>b.onclick=()=>{state.layer=b.dataset.layer;state.selected=null;rebuildScene();renderLayerSwitcher();renderDetails();updateLinkedFlow();});
  $('#viewerTitle').textContent=layers.find(l=>l.key===state.layer).label;
}

function renderTabs(){const tabs={overview:'Uitleg',symptoms:'Klachten',redflags:'Alarmsignalen',prevention:'Preventie'};$('#detailTabs').innerHTML=Object.entries(tabs).map(([k,v])=>`<button class="detail-tab ${state.tab===k?'active':''}" data-tab="${k}">${v}</button>`).join('');$$('#detailTabs button').forEach(b=>b.onclick=()=>{state.tab=b.dataset.tab;renderDetails();});}
function selectedData(){return state.selected?A[state.selected]:null;}
function renderDetails(){
  renderTabs();
  const d=selectedData();
  if(!d){
    $('#detailTitle').textContent='Geen selectie';
    $('#detailSummary').textContent='Klik overal op het lichaam. Niet alleen rondjes: de 3D-body selecteert de anatomische regio/structuur.';
    $('#detailBody').innerHTML=`<div class="card"><strong>Nieuw in Stage 1L</strong><ul><li>Default is een gewone persoon.</li><li>Schillen komen pas na keuze.</li><li>3D-assetarchitectuur met object-selectie.</li><li>Klachtenflow koppelt live aan atlasselectie.</li><li>Analyse geeft indicatieve differentiaal en triage.</li></ul></div>`;
    $('#selectedBreadcrumb').textContent='Klik op een lichaamsgebied of kies een laag';
    return;
  }
  $('#detailTitle').textContent=d.title;
  $('#detailSummary').textContent=d.summary;
  $('#selectedBreadcrumb').textContent=`${layers.find(l=>l.key===state.layer).label} › ${d.title}`;
  const map={overview:d.overview,symptoms:d.symptoms,redflags:d.redflags,prevention:d.prevention};
  const labels={overview:'Educatieve uitleg',symptoms:'Relevante klachten',redflags:'Rode vlaggen',prevention:'Preventie en zelfzorg'};
  $('#detailBody').innerHTML=`<div class="card"><strong>Systeem</strong><div>${d.system}</div></div><div class="card"><strong>${labels[state.tab]}</strong><ul>${(map[state.tab]||[]).map(x=>`<li>${x}</li>`).join('')}</ul></div><div class="card"><strong>Verdieping</strong><ul>${(d.questions||[]).map(x=>`<li>${x}</li>`).join('')}</ul></div>`;
}
function updateLinkedFlow(){
  const d=selectedData();
  $('#activeSelectionChip').textContent=d?`Geselecteerd: ${d.title} · ${d.system}`:'Nog geen atlasselectie gekozen';
  $('#dynamicPrompt').innerHTML=d?`<strong>Gerichte vragen voor ${d.title}:</strong><br>${(d.questions||[]).join(' · ')}`:'Selecteer eerst een gebied of orgaan voor gerichtere vragen.';
  renderEducation();
}
function renderEducation(){
  const d=selectedData();
  if(!d){$('#educationPanel').innerHTML='<div class="card">Selecteer een structuur voor contextuele educatie.</div>';return;}
  $('#educationPanel').innerHTML=`<div class="card"><strong>${d.title}: basis</strong><p>${d.summary}</p></div><div class="card"><strong>Mogelijke verklaringsrichtingen</strong><ul>${(d.differentials||[]).map(x=>`<li>${x}</li>`).join('')}</ul></div><div class="card"><strong>Wat HealthLens nog moet uitvragen</strong><ul>${(d.questions||[]).map(x=>`<li>${x}</li>`).join('')}</ul></div>`;
}

function renderRedFlags(){$('#redFlags').innerHTML=redFlags.map(f=>`<button class="layer-btn redflag" data-flag="${f}">${f}</button>`).join('');$$('.redflag').forEach(b=>b.onclick=()=>b.classList.toggle('active'));}
function renderKnowledge(){const cats=['Alles',...new Set(modules.map(m=>m.cat))];$('#knowledgeFilters').innerHTML=cats.map(c=>`<button class="layer-btn ${c==='Alles'?'active':''}" data-cat="${c}">${c}</button>`).join('');const draw=(cat='Alles')=>{$$('#knowledgeFilters button').forEach(b=>b.classList.toggle('active',b.dataset.cat===cat));const list=cat==='Alles'?modules:modules.filter(m=>m.cat===cat);$('#knowledgeCards').innerHTML=list.map(m=>`<div class="mini-card"><b>${m.title}</b><small>${m.text}</small></div>`).join('');};$$('#knowledgeFilters button').forEach(b=>b.onclick=()=>draw(b.dataset.cat));draw();}

function analyze(){
  const d=selectedData(), txt=$('#symptomText').value.trim(), profile=getProfile(), flags=$$('.redflag.active').map(x=>x.dataset.flag);
  const emergency=['druk op borst','benauwd','flauwvallen','scheve mond','krachtsverlies','spraakproblemen','hevige bloeding'];
  let level='okText', title='Indicatief: niet-spoedeisend / observeer of plan beoordeling';
  if(flags.length){level='warnText';title='Indicatief: medische beoordeling aanbevolen';}
  if(flags.some(f=>emergency.includes(f))){level='dangerText';title='Indicatief: spoedbeoordeling kan nodig zijn';}
  const diff=d?(d.differentials||[]):['Locatie nog onbekend: selecteer eerst op de atlas voor betere differentiaal.'];
  const notes=[];
  if(d) notes.push(`Atlascontext: ${d.title} — ${d.summary}`);
  if(Number(profile.age)>0&&Number(profile.age)<16) notes.push('Onder 16: geen intieme beelden; tekstuele klachten kunnen veilig worden besproken.');
  if(profile.sex==='female'&&Number(profile.age)>=38&&Number(profile.age)<=55) notes.push('Profielcontext: hormonale/perimenopauzale context kan relevant zijn, maar andere oorzaken moeten uitgesloten blijven.');
  if(profile.background&&profile.background!=='prefer-not') notes.push('Achtergrond/afkomst wordt alleen als nuance gebruikt voor presentatie en risico, nooit als diagnose.');
  $('#analysisResult').innerHTML=`<h3 class="${level}">${title}</h3><p>${txt?`Klachtomschrijving: ${txt}`:'Geen vrije tekst ingevuld. Voeg duur, ernst, locatie en bijkomende klachten toe.'}</p><p>Rode vlaggen: ${flags.length?flags.join(', '):'geen geselecteerd'}</p><div class="card"><strong>Indicatieve differentiaal</strong><ol>${diff.map(x=>`<li>${x}</li>`).join('')}</ol></div>${notes.map(n=>`<div class="card">${n}</div>`).join('')}<div class="card"><strong>Volgende stap</strong><br>${flags.some(f=>emergency.includes(f))?'Bij acute of ernstige klachten: neem direct contact op met spoedzorg.':'Vul gerichte vragen in en monitor ontwikkeling. Bij twijfel, verergering of alarmsignalen: medische hulp.'}</div>`;
}

function setupSearch(){
  $('#atlasSearch').addEventListener('input',()=>{
    const q=$('#atlasSearch').value.trim().toLowerCase();
    if(q.length<2){$('#searchResults').classList.add('hidden');return;}
    const results=Object.entries(A).filter(([id,d])=>[id,d.title,d.system,d.summary,...(d.symptoms||[])].join(' ').toLowerCase().includes(q)).slice(0,10);
    $('#searchResults').innerHTML=results.map(([id,d])=>`<button data-id="${id}"><strong>${d.title}</strong><br><small>${d.system}</small></button>`).join('')||'<button>Geen resultaat</button>';
    $('#searchResults').classList.remove('hidden');
    $$('#searchResults button[data-id]').forEach(b=>b.onclick=()=>{selectId(b.dataset.id);$('#atlasSearch').value='';$('#searchResults').classList.add('hidden');});
  });
}

/* 3D engine: loads Three.js dynamically. If CDN is unavailable, falls back to the image atlas. */
function loadScript(src){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=rej;document.head.appendChild(s);});}
async function init3D(){
  try{
    await loadScript('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js');
    state.threeReady=!!window.THREE;
    if(!state.threeReady) throw new Error('THREE unavailable');
    $('#engineStatus').textContent='3D engine actief';
    buildThree();
  }catch(e){
    $('#engineStatus').textContent='Fallback atlas actief';
    $('#threeCanvas').style.display='none';
    $('#fallbackAtlas').classList.remove('hidden');
  }
}
function mat(color,opacity=1){return new THREE.MeshStandardMaterial({color,roughness:.55,metalness:.05,transparent:opacity<1,opacity});}
function addMesh(id,mesh){mesh.userData.id=id;state.group.add(mesh);state.objects[id]=mesh;state.rayTargets.push(mesh);return mesh;}
function buildThree(){
  const canvas=$('#threeCanvas'), viewer=$('#viewer'), w=viewer.clientWidth, h=viewer.clientHeight;
  state.scene=new THREE.Scene(); state.scene.background=new THREE.Color(0x091426);
  state.camera=new THREE.PerspectiveCamera(42,w/h,.1,100); state.camera.position.set(0,0.35,5.1);
  state.renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false}); state.renderer.setSize(w,h); state.renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  state.scene.add(new THREE.HemisphereLight(0xffffff,0x223344,1.4));
  const dir=new THREE.DirectionalLight(0xffffff,1.6); dir.position.set(3,5,4); state.scene.add(dir);
  state.group=new THREE.Group(); state.scene.add(state.group);
  rebuildScene();
  const raycaster=new THREE.Raycaster(), mouse=new THREE.Vector2();
  canvas.addEventListener('pointerdown',e=>{state.rotating=true;state.startX=e.clientX;state.startRot=state.group.rotation.y;});
  window.addEventListener('pointermove',e=>{if(!state.rotating)return;state.group.rotation.y=state.startRot+(e.clientX-state.startX)*0.008;});
  window.addEventListener('pointerup',()=>state.rotating=false);
  canvas.addEventListener('click',e=>{
    const rect=canvas.getBoundingClientRect();mouse.x=((e.clientX-rect.left)/rect.width)*2-1;mouse.y=-((e.clientY-rect.top)/rect.height)*2+1;raycaster.setFromCamera(mouse,state.camera);
    const hits=raycaster.intersectObjects(state.rayTargets,true);
    if(hits[0]) selectId(hits[0].object.userData.id || nearestByY(hits[0].point.y));
  });
  canvas.addEventListener('wheel',e=>{e.preventDefault();state.camera.position.z=Math.max(3.2,Math.min(7,state.camera.position.z+(e.deltaY>0?.25:-.25)));},{passive:false});
  window.addEventListener('resize',()=>{const w=viewer.clientWidth,h=viewer.clientHeight;state.camera.aspect=w/h;state.camera.updateProjectionMatrix();state.renderer.setSize(w,h);});
  animate();
}
function nearestByY(y){if(y>1.35)return'head';if(y>.55)return'chest';if(y>-.35)return'abdomen';return'pelvis';}
function updateSkinTone(){
  if(!state.threeReady||!state.objects.body)return;
  const p=getProfile(), tones={'prefer-not':0xc58c72,european:0xd39b7e,african:0x6b3a26,mena:0xaa6a47,'south-asian':0x8b5638,'east-asian':0xc58b63,'se-asian':0x8c5a38,latin:0x9a6040,other:0x8f5c3e};
  state.objects.body.material.color.setHex(tones[p.background||'prefer-not']||0xc58c72);
  if(state.objects.head)state.objects.head.material.color.setHex(tones[p.background||'prefer-not']||0xc58c72);
}
function clearGroup(){if(!state.group)return;while(state.group.children.length){const c=state.group.children.pop();c.geometry?.dispose?.();}state.objects={};state.rayTargets=[];}
function rebuildScene(){
  if(!state.threeReady){$('#fallbackImage').src=state.layer==='none'?'assets/organs.png':(state.layer==='skeleton'?'assets/skeleton.png':state.layer==='vessels'?'assets/circulatory.png':state.layer==='nerves'?'assets/nervous.png':'assets/organs.png');return;}
  clearGroup();
  const p=getProfile(), tone=skinTones[p.background||'prefer-not']||0xc58c72, child=Number(p.age)>0&&Number(p.age)<16;
  const skin=mat(tone,.95), ghost=mat(tone,state.layer==='none'?1:.28);
  addMesh('chest',new THREE.Mesh(new THREE.CapsuleGeometry(.63,1.15,16,32), state.layer==='none'?skin:ghost)).position.y=.55;
  state.objects.body=state.objects.chest;
  addMesh('head',new THREE.Mesh(new THREE.SphereGeometry(.32,32,24),skin)).position.y=1.62; state.objects.head=state.objects.head;
  addMesh('pelvis',new THREE.Mesh(new THREE.SphereGeometry(.46,32,20),state.layer==='none'?skin:ghost)).position.y=-.42;
  const armGeo=new THREE.CapsuleGeometry(.10,1.15,10,16), legGeo=new THREE.CapsuleGeometry(.13,1.45,10,18);
  const la=addMesh('left-arm',new THREE.Mesh(armGeo,state.layer==='none'?skin:ghost));la.position.set(-.75,.48,0);la.rotation.z=-.18;
  const ra=addMesh('right-arm',new THREE.Mesh(armGeo,state.layer==='none'?skin:ghost));ra.position.set(.75,.48,0);ra.rotation.z=.18;
  const ll=addMesh('left-leg',new THREE.Mesh(legGeo,skin));ll.position.set(-.22,-1.25,0);
  const rl=addMesh('right-leg',new THREE.Mesh(legGeo,skin));rl.position.set(.22,-1.25,0);
  if(child){const u=mat(0xeef7ff,.92);const top=new THREE.Mesh(new THREE.BoxGeometry(.62,.12,.08),u);top.position.set(0,.73,.42);state.group.add(top);const bot=new THREE.Mesh(new THREE.BoxGeometry(.48,.16,.08),u);bot.position.set(0,-.55,.43);state.group.add(bot);}
  if(state.layer==='organs') addOrgans();
  if(state.layer==='skeleton') addSkeleton();
  if(state.layer==='vessels') addVessels();
  if(state.layer==='nerves') addNerves();
  if(state.layer==='hormones') addHormones();
}
function addOrgans(){
  addMesh('heart',new THREE.Mesh(new THREE.SphereGeometry(.16,32,20),mat(0xd8344d))).position.set(.05,.78,.48);
  let l=addMesh('leftLung',new THREE.Mesh(new THREE.SphereGeometry(.24,32,20),mat(0xff8fa1,.86)));l.scale.set(.75,1.45,.45);l.position.set(-.25,.9,.35);
  let r=addMesh('rightLung',new THREE.Mesh(new THREE.SphereGeometry(.24,32,20),mat(0xff8fa1,.86)));r.scale.set(.75,1.45,.45);r.position.set(.28,.9,.35);
  let liver=addMesh('liver',new THREE.Mesh(new THREE.SphereGeometry(.25,32,20),mat(0x90482d)));liver.scale.set(1.45,.55,.45);liver.position.set(.25,.23,.45);
  let stomach=addMesh('stomach',new THREE.Mesh(new THREE.SphereGeometry(.18,32,20),mat(0xf0a58d)));stomach.scale.set(.85,1.15,.5);stomach.position.set(-.18,.15,.48);
  let pancreas=addMesh('pancreas',new THREE.Mesh(new THREE.CapsuleGeometry(.055,.42,10,16),mat(0xe6a767)));pancreas.rotation.z=1.35;pancreas.position.set(.04,.02,.52);
  let colon=addMesh('colon',new THREE.Mesh(new THREE.TorusGeometry(.32,.035,12,64),mat(0xc47455)));colon.scale.set(1,1.3,.25);colon.position.set(0,-.32,.48);
  addMesh('leftKidney',new THREE.Mesh(new THREE.SphereGeometry(.12,24,16),mat(0xa24d46))).position.set(-.28,-.02,.38);
  addMesh('rightKidney',new THREE.Mesh(new THREE.SphereGeometry(.12,24,16),mat(0xa24d46))).position.set(.28,-.02,.38);
  let bladder=addMesh('bladder',new THREE.Mesh(new THREE.SphereGeometry(.13,24,16),mat(0xcf6b62)));bladder.position.set(0,-.78,.44);
  addMesh('brain',new THREE.Mesh(new THREE.SphereGeometry(.22,32,20),mat(0xf3a070))).position.set(0,1.64,.05);
}
function addSkeleton(){
  const bone=mat(0xf1dfb2,.92);
  addMesh('skull',new THREE.Mesh(new THREE.SphereGeometry(.27,32,20),bone)).position.set(0,1.62,.03);
  let spine=addMesh('spine',new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,1.65,16),bone));spine.position.set(0,.35,.05);
  let ribs=addMesh('ribcage',new THREE.Mesh(new THREE.TorusGeometry(.42,.025,10,64),bone));ribs.scale.set(.9,1.25,.2);ribs.rotation.x=Math.PI/2;ribs.position.set(0,.76,.1);
  let pelvis=addMesh('pelvis',new THREE.Mesh(new THREE.TorusGeometry(.32,.035,10,48),bone));pelvis.scale.set(1,.62,.25);pelvis.position.set(0,-.45,.1);
}
function addVessels(){
  const red=mat(0xd72436), blue=mat(0x1f72d1);
  let a=addMesh('chest',new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,1.9,16),red));a.position.set(.03,.2,.56);
  let v=addMesh('abdomen',new THREE.Mesh(new THREE.CylinderGeometry(.027,.027,1.9,16),blue));v.position.set(-.04,.2,.55);
  addMesh('heart',new THREE.Mesh(new THREE.SphereGeometry(.13,24,16),mat(0xd8344d))).position.set(.05,.78,.6);
  addMesh('leftKidney',new THREE.Mesh(new THREE.SphereGeometry(.08,16,12),red)).position.set(-.28,-.05,.56);
  addMesh('rightKidney',new THREE.Mesh(new THREE.SphereGeometry(.08,16,12),red)).position.set(.28,-.05,.56);
}
function addNerves(){
  const nerve=mat(0xf7c948);
  let cord=addMesh('spine',new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,2.05,16),nerve));cord.position.set(0,.35,.62);
  addMesh('brain',new THREE.Mesh(new THREE.SphereGeometry(.18,24,16),nerve)).position.set(0,1.62,.22);
  let plex=addMesh('chest',new THREE.Mesh(new THREE.TorusGeometry(.42,.018,8,48),nerve));plex.scale.set(1,.55,.12);plex.position.set(0,.63,.62);
  addMesh('pelvis',new THREE.Mesh(new THREE.TorusGeometry(.36,.018,8,48),nerve)).position.set(0,-.5,.62);
}
function addHormones(){
  const gland=mat(0xb685ff);
  addMesh('brain',new THREE.Mesh(new THREE.SphereGeometry(.07,16,12),gland)).position.set(0,1.56,.33);
  addMesh('pelvis',new THREE.Mesh(new THREE.SphereGeometry(.12,16,12),gland)).position.set(0,-.75,.48);
  addMesh('pancreas',new THREE.Mesh(new THREE.CapsuleGeometry(.04,.38,8,12),gland)).position.set(.05,.02,.55);
}
function selectId(id){if(!A[id]) id='chest';state.selected=id;renderDetails();updateLinkedFlow();if(state.objects[id]){state.objects[id].material.emissive?.setHex?.(0x224455);}}
function animate(){requestAnimationFrame(animate);if(state.autoRotate&&state.group)state.group.rotation.y+=.006;state.renderer?.render(state.scene,state.camera);}
function bind(){
  $('#profileBtn').onclick=()=>showProfile();$('#bottomProfileBtn').onclick=e=>{e.preventDefault();showProfile();};
  $('#profileForm').onsubmit=e=>{e.preventDefault();saveProfile();hideProfile();rebuildScene();};
  $('#skipProfile').onclick=()=>{hideProfile();localStorage.setItem(STORE_KEY,JSON.stringify({age:'',sex:'prefer-not',background:'prefer-not',language:'nl'}));applyProfile({});rebuildScene();};
  $('#wipeProfile').onclick=()=>{localStorage.removeItem(STORE_KEY);$('#profileForm').reset();alert('Lokale gegevens gewist.');};
  $('#forceBtn').onclick=async()=>{await killCaches();location.href='stage1l.html?v='+Date.now();};
  $('#resetBtn').onclick=()=>{state.selected=null;state.layer='none';state.autoRotate=false;renderLayerSwitcher();rebuildScene();renderDetails();updateLinkedFlow();};
  $('#autoRotateBtn').onclick=()=>{state.autoRotate=!state.autoRotate;$('#autoRotateBtn').textContent=state.autoRotate?'Stop rotate':'Auto rotate';};
  $('#useForSymptoms').onclick=()=>{location.hash='symptoms';const d=selectedData();if(d&&!$('#symptomText').value.trim())$('#symptomText').value=`Klacht bij ${d.title}: `;$('#symptomText').focus();};
  $('#showEducation').onclick=()=>{location.hash='education';renderEducation();};
  $('#analyzeBtn').onclick=analyze;
}
async function init(){await killCaches();const p=loadProfile();if(!p)showProfile();renderLayerSwitcher();renderTabs();renderDetails();updateLinkedFlow();renderRedFlags();renderKnowledge();setupSearch();bind();await init3D();}
document.addEventListener('DOMContentLoaded',init);
