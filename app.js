
(function(){
'use strict';
const K_ACK='healthlens_1r_ack', K_PROF='healthlens_1r_profile', K_LANG='healthlens_1r_lang';
const $=(s,e=document)=>e.querySelector(s), $$=(s,e=document)=>Array.from(e.querySelectorAll(s));
const langs=[
 ['nl','Nederlands'],['en','English'],['de','Deutsch'],['fr','Français'],['es','Español'],['pt','Português'],['it','Italiano'],['pl','Polski'],['tr','Türkçe'],['ar','العربية'],['hi','हिन्दी'],['bn','বাংলা'],['ur','اردو'],['zh','中文'],['ja','日本語'],['ko','한국어'],['ru','Русский'],['id','Bahasa Indonesia'],['vi','Tiếng Việt'],['th','ไทย'],['sw','Kiswahili']
];
const layers=[
 {key:'lichaam',label:'Lichaam',img:'assets/body.svg',title:'Lichaam',sub:'Buitenkant, huid en algemene regio’s.'},
 {key:'organen',label:'Organen',img:'assets/organs.svg',title:'Alle organen',sub:'Belangrijkste organen in één samenhangende laag.'},
 {key:'bloedbaan',label:'Bloedbaan',img:'assets/circulatory.svg',title:'Bloedbaan',sub:'Hart en bloedvaten.'},
 {key:'zenuw',label:'Zenuwstelsel',img:'assets/nervous.svg',title:'Zenuwstelsel',sub:'Hersenen, ruggenmerg en perifere zenuwen.'},
 {key:'lymfe',label:'Lymfestelsel',img:'assets/lymphatic.svg',title:'Lymfestelsel',sub:'Lymfebanen, milt en klieren.'},
 {key:'spier',label:'Spieren',img:'assets/muscular.svg',title:'Spierstelsel',sub:'Spiergroepen en bewegingsketens.'},
 {key:'skelet',label:'Skelet',img:'assets/skeletal.svg',title:'Skelet',sub:'Botten, ribbenkast, wervelkolom en gewrichten.'},
 {key:'adem',label:'Ademhaling',img:'assets/respiratory.svg',title:'Ademhaling',sub:'Luchtwegen en longen.'},
 {key:'spijs',label:'Spijsvertering',img:'assets/digestive.svg',title:'Spijsvertering',sub:'Maag, lever, gal, pancreas en darmen.'},
 {key:'urin',label:'Urinewegen',img:'assets/urinary.svg',title:'Urinewegen',sub:'Nieren, urineleiders en blaas.'},
 {key:'endo',label:'Endocrien',img:'assets/organs.svg',title:'Endocrien',sub:'Hormoonorganen zoals schildklier, bijnier en pancreas.'},
 {key:'huid',label:'Huid',img:'assets/body.svg',title:'Huid',sub:'Huid, kleurveranderingen, wond- en moedervlekcontext.'}
];
const extraDB={
 bloedvaten:{naam:'Bloedvaten',systeem:'Hart en vaten',omschrijving:'Netwerk van arteriën, venen en haarvaten dat bloed door het lichaam vervoert.',functie:'Transport van zuurstof, voedingsstoffen, afvalstoffen en hormonen.',klachten:['Zwelling','Koude ledematen','Kleurverandering','Pijn bij lopen'],rodeVlaggen:['Acuut koud pijnlijk been/arm','Plots eenzijdig dik pijnlijk been','Kortademigheid met pijn','Bleek/blauw ledemaat'],preventie:['Beweging','Rookstop','Lang stilzitten onderbreken','Risicofactoren behandelen'],eersteHulp:['Acuut circulatieverlies is spoed.'],differentiaal:['Trombosecontext','Vaatvernauwing','Lymfoedeem','Spier-/orthopedische oorzaak'],leren:'Bloedvaten vormen de logistieke infrastructuur van het lichaam.',follow_up:['Is één been dikker?','Is er kleurverschil?','Is er kortademigheid?']},
 lymfeklieren:{naam:'Lymfeklieren',systeem:'Lymfestelsel',omschrijving:'Filterstations van het immuunsysteem verspreid door het lichaam.',functie:'Filteren van lymfe en activeren van immuunreacties.',klachten:['Opgezette klier','Pijnlijke klier','Zwelling'],rodeVlaggen:['Onverklaarde hardnekkige klierzwelling','Nachtzweten','Onbedoeld afvallen','Koorts zonder verklaring'],preventie:['Wondzorg','Infectiepreventie','Huidzorg'],eersteHulp:['Langdurige of snel toenemende zwelling laten beoordelen.'],differentiaal:['Reactieve klier','Infectie','Lymfoedeem','Systemische oorzaak'],leren:'Lymfeklieren kunnen tijdelijk groter worden bij infecties.',follow_up:['Sinds wanneer?','Pijnlijk of hard?','Koorts of gewichtsverlies?']},
 knie:{naam:'Knie',systeem:'Skelet / gewricht',omschrijving:'Groot scharniergewricht tussen bovenbeen en onderbeen.',functie:'Belasting, lopen, buigen en strekken.',klachten:['Pijn','Zwelling','Slotklachten','Instabiliteit'],rodeVlaggen:['Niet kunnen belasten','Ernstige zwelling na trauma','Koorts met rood warm gewricht'],preventie:['Krachttraining','Rustige trainingsopbouw','Goede schoenen'],eersteHulp:['Na trauma: koelen, ontzien en beoordelen bij niet kunnen belasten.'],differentiaal:['Meniscusletsel','Bandletsel','Kneuzing','Artrose','Ontsteking'],leren:'Knieklachten hangen vaak samen met belasting, trauma of stand van heup/enkel.',follow_up:['Trauma?','Slotklachten?','Zwelling?']},
 schouder:{naam:'Schouder',systeem:'Skelet / spiergroep',omschrijving:'Zeer beweeglijk gewricht met spieren, pezen en kapsel.',functie:'Armheffing, reiken, dragen en rotatie.',klachten:['Pijn bij heffen','Stijfheid','Krachtsverlies'],rodeVlaggen:['Niet kunnen gebruiken na trauma','Misvorming','Gevoelloosheid of koude arm'],preventie:['Schouderbladcontrole','Rustige opbouw','Ergonomie'],eersteHulp:['Bij trauma of misvorming beoordeling zoeken.'],differentiaal:['Peesirritatie','Frozen shoulder','Luxatie','Nekuitstraling'],leren:'De schouder offert stabiliteit op voor bewegingsvrijheid.',follow_up:['Trauma?','Pijnboog?','Nekklachten?']}
};
const layerMap={
 lichaam:['huid','oog','oor','schouder','knie'],
 organen:['hersenen','longen','hart','lever','galblaas','alvleesklier','maag','dunne_darm','dikke_darm','nieren','blaas','milt'],
 bloedbaan:['hart','bloedvaten'],
 zenuw:['hersenen','ruggenmerg'],
 lymfe:['milt','lymfeklieren'],
 spier:['spieren','schouder','knie'],
 skelet:['skelet','ribbenkast','wervelkolom','bekken','schouder','knie'],
 adem:['longen'],
 spijs:['maag','lever','galblaas','alvleesklier','dunne_darm','dikke_darm'],
 urin:['nieren','blaas'],
 endo:['schildklier','bijnier','alvleesklier'],
 huid:['huid','oog','oor']
};
const shapes={
 hart:['ellipse',53,27,5,5], longen:['rect',38,18,24,18,8], hersenen:['ellipse',50,8,7,6], ruggenmerg:['rect',48,12,4,58,3],
 lever:['rect',37,34,18,9,5], galblaas:['ellipse',52,41,3,4], alvleesklier:['rect',49,42,14,4,2], maag:['ellipse',58,39,5,6],
 dunne_darm:['rect',43,47,16,11,5], dikke_darm:['rect',38,44,24,18,7], nieren:['rect',40,52,20,9,5], blaas:['ellipse',50,74,5,4],
 milt:['ellipse',63,38,4,6], schildklier:['ellipse',50,16,5,3], bijnier:['rect',42,50,16,4,2], huid:['rect',28,6,44,82,20],
 oog:['ellipse',46,8,2,1.5], oor:['ellipse',59,9,2,3], spieren:['rect',28,13,44,72,18], skelet:['rect',33,10,34,76,14],
 ribbenkast:['rect',38,22,24,18,8], wervelkolom:['rect',48,12,4,63,3], bekken:['rect',39,61,22,13,6], knie:['ellipse',50,82,8,5],
 schouder:['rect',32,20,36,7,4], bloedvaten:['rect',43,14,14,59,7], lymfeklieren:['rect',38,18,24,55,10]
};
const edu=[
 ['Anatomie per laag','Verken lichaam, organen, bloedbaan, zenuwen, lymfe, spieren en skelet.'],
 ['Organen en functies','Leer per orgaan wat het doet en hoe systemen samenwerken.'],
 ['Alarmsignalen herkennen','Rode vlaggen leren herkennen per systeem.'],
 ['Preventie per systeem','Concrete leefstijl- en follow-upadviezen per orgaan.'],
 ['Eerste hulp','Wat nu bij borstpijn, benauwdheid, bloeding, letsel, flauwvallen en uitval.'],
 ['Kinderen en puberteit','Veilige uitleg over groei, puberteit, normale variatie en wanneer hulp nodig is.'],
 ['Seksuele gezondheid','SOA/STI-klachten, testen, consent en geruststellende uitleg zonder stigma.'],
 ['Perimenopauze','Vage klachten, hormonen en het voorkomen dat andere oorzaken gemist worden.'],
 ['Erfelijkheid & familie','Familiegeschiedenis als context, nooit als zelfstandige diagnose.'],
 ['Huid en wondzorg','Huidbeelden, wondgenezing, kleurverschillen en wanneer beoordelen.'],
 ['Medicatiebewustzijn','Pijnstillers, interacties, allergieën en veilig medicijngebruik.'],
 ['Internationale zorg','Later: lokale termen en zorgpaden per land.']
];
let state={layer:'lichaam',selected:null,dtab:'uitleg'};
function db(){ return Object.assign({}, window.MEDDB||{}, extraDB); }
function getD(id){ return db()[id]; }
function currentIds(){ return (layerMap[state.layer]||[]).filter(id=>getD(id)); }
function init(){
 $('#language').innerHTML=langs.map(([c,n])=>`<option value="${c}">${n}</option>`).join('');
 $('#language').value=localStorage.getItem(K_LANG)||'nl';
 $('#language').onchange=()=>localStorage.setItem(K_LANG,$('#language').value);
 $('#ackCheck').onchange=()=>$('#acceptDisclaimer').disabled=!$('#ackCheck').checked;
 $('#acceptDisclaimer').onclick=()=>{localStorage.setItem(K_ACK,'1');hide($('#disclaimerGate'));show($('#app'));maybeProfile();};
 if(localStorage.getItem(K_ACK)==='1'){hide($('#disclaimerGate'));show($('#app'));}
 bindTabs(); bindControls(); loadProfile(); renderAll(); renderEdu(); renderStorage(); maybeProfile();
}
function maybeProfile(){ if(!localStorage.getItem(K_PROF)) setTimeout(()=>activateTab('profile'),100); }
function activateTab(key){$$('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===key));$$('.panel').forEach(p=>p.classList.toggle('active',p.id==='panel-'+key)); if(key==='privacy')renderStorage();}
function bindTabs(){ $$('.tab').forEach(b=>b.onclick=()=>activateTab(b.dataset.tab));}
function bindControls(){
 $('#themeToggle').onclick=()=>{const cur=document.documentElement.dataset.theme||'light';document.documentElement.dataset.theme=cur==='light'?'dark':'light';};
 $('#refreshBtn').onclick=()=>location.href='stage1r.html?v='+Date.now();
 $('#atlasMode').onchange=()=>$('#atlasFrame').classList.toggle('clinical',$('#atlasMode').value==='clinical');
 $('#atlasDetail').onchange=renderDetail;
 $('#useInComplaint').onclick=()=>{activateTab('complaints'); if(state.selected&&!$('#symptomText').value.trim())$('#symptomText').value='Klacht bij '+getD(state.selected).naam+': '; $('#symptomText').focus();};
 $('#painScore').oninput=()=>$('#painVal').textContent=$('#painScore').value;
 $('#analyzeBtn').onclick=analyze;
 $('#saveProfile').onclick=saveProfile; $('#clearProfile').onclick=clearProfile; $('#exportProfile').onclick=()=>downloadJSON('healthlens-profile.json',getProfile());
 $('#exportAll').onclick=()=>downloadJSON('healthlens-local-export.json',collectStorage());
 $('#wipeAll').onclick=()=>{if(confirm('Alle lokale HealthLens-data wissen?')){Object.keys(localStorage).filter(k=>k.startsWith('healthlens')).forEach(k=>localStorage.removeItem(k));location.reload();}};
}
function renderAll(){renderLayers(); renderAtlas(); renderChips(); renderDetail(); renderFlags(); renderContext(); applyProfileVisuals();}
function renderLayers(){ $('#layerList').innerHTML=layers.map(l=>`<button class="layer-btn ${l.key===state.layer?'active':''}" data-layer="${l.key}">${l.label}</button>`).join(''); $$('.layer-btn').forEach(b=>b.onclick=()=>{state.layer=b.dataset.layer;state.selected=null; const l=layers.find(x=>x.key===state.layer); $('#atlasImage').src=l.img; $('#layerTitle').textContent=l.title; $('#layerSubtitle').textContent=l.sub; renderAll();});}
function shape(id){const s=shapes[id]; if(!s)return ''; const active=state.selected===id?' active':''; const title=getD(id).naam; if(s[0]==='ellipse') return `<ellipse class="hit${active}" data-id="${id}" cx="${s[1]}" cy="${s[2]}" rx="${s[3]}" ry="${s[4]}"><title>${title}</title></ellipse>`; return `<rect class="hit${active}" data-id="${id}" x="${s[1]}" y="${s[2]}" width="${s[3]}" height="${s[4]}" rx="${s[5]||3}"><title>${title}</title></rect>`;}
function renderAtlas(){ $('#hitSvg').innerHTML=currentIds().map(shape).join(''); $$('#hitSvg .hit').forEach(el=>el.onclick=()=>select(el.dataset.id)); positionLabel(); }
function renderChips(){ $('#structureChips').innerHTML=currentIds().map(id=>`<button class="chip ${state.selected===id?'active':''}" data-id="${id}">${getD(id).naam}</button>`).join(''); $$('#structureChips .chip').forEach(b=>b.onclick=()=>select(b.dataset.id)); $('#selectedMini').textContent=state.selected?getD(state.selected).naam:'Geen selectie'; }
function select(id){state.selected=id; renderAll();}
function positionLabel(){const lab=$('#selectionLabel'); if(!state.selected||!shapes[state.selected]){hide(lab);return} const s=shapes[state.selected]; let x=s[0]==='ellipse'?s[1]:(s[1]+s[3]/2), y=s[0]==='ellipse'?s[2]:(s[2]); lab.textContent=getD(state.selected).naam; lab.style.left=Math.min(80,x+4)+'%'; lab.style.top=Math.max(4,y-4)+'%'; show(lab);}
function tabs(){return [['uitleg','Uitleg'],['klachten','Klachten'],['alarm','Alarmsignalen'],['preventie','Preventie'],['eerstehulp','Eerste hulp'],['oorzaken','Oorzaken'],['leren','Leren']];}
function renderDetail(){ $('#detailTabs').innerHTML=tabs().map(([k,n])=>`<button class="dtab ${state.dtab===k?'active':''}" data-tab="${k}">${n}</button>`).join(''); $$('.dtab').forEach(b=>b.onclick=()=>{state.dtab=b.dataset.tab;renderDetail();}); const d=state.selected?getD(state.selected):null; if(!d){$('#detailTitle').textContent='Selecteer een structuur';$('#detailSystem').textContent='';$('#detailSummary').textContent='Kies een orgaan, bot, spiergroep, zenuw, regio of systeem.';$('#detailBody').innerHTML=info('Startpunt',['Claude’s sterke medische database is geïntegreerd, maar met onze statische gecentreerde atlas en zonder zichtbare rondjes.']);return;} $('#detailTitle').textContent=d.naam; $('#detailSystem').textContent=d.systeem; $('#detailSummary').textContent=d.omschrijving; const expert=$('#atlasDetail').value==='expert'; let html=''; if(state.dtab==='uitleg') html=info('Functie',[d.functie||d.omschrijving])+(expert&&d.leren?info('Leren',[d.leren]):''); if(state.dtab==='klachten') html=listBlock('Veelvoorkomende klachten',d.klachten)+listBlock('Vervolgvragen',d.follow_up); if(state.dtab==='alarm') html=listBlock('Rode vlaggen',d.rodeVlaggen); if(state.dtab==='preventie') html=listBlock('Preventie',d.preventie); if(state.dtab==='eerstehulp') html=listBlock('Eerste hulp',d.eersteHulp); if(state.dtab==='oorzaken') html=listBlock('Indicatieve differentiaal',d.differentiaal,'ol'); if(state.dtab==='leren') html=info('Educatieve uitleg',[d.leren||d.functie||d.omschrijving])+listBlock('Vervolgvragen',d.follow_up); $('#detailBody').innerHTML=html; updateComplaintContext();}
function info(title,items){return `<div class="info"><h4>${title}</h4>${items.map(x=>`<p>${esc(x)}</p>`).join('')}</div>`}
function listBlock(title,items,tag='ul'){if(!items||!items.length)return info(title,['Nog niet uitgewerkt.']); return `<div class="info"><h4>${title}</h4><${tag}>${items.map(x=>`<li>${esc(x)}</li>`).join('')}</${tag}></div>`}
function renderFlags(){const flags=[...new Set([...(state.selected&&getD(state.selected).rodeVlaggen?getD(state.selected).rodeVlaggen:[]),'Bewustzijnsverlies','Ernstige benauwdheid','Snel zieker worden','Verwardheid','Hevige of ondraaglijke pijn'])]; $('#redFlags').innerHTML=flags.map(f=>`<label><input type="checkbox" value="${esc(f)}"> ${esc(f)}</label>`).join('');}
function updateComplaintContext(){const d=state.selected?getD(state.selected):null; $('#complaintSelection').textContent=d?`${d.naam} · ${d.systeem}`:'Nog geen atlasselectie'; $('#guidedQuestions').innerHTML=d&&d.follow_up?'<strong>Gerichte vragen:</strong><br>'+d.follow_up.map(esc).join(' · '):'Selecteer een structuur in de atlas voor gerichtere vragen.';}
function infer(text){text=text.toLowerCase();let s=0,h=[]; if(/borst|druk|benauw|kaak|arm|zwet/.test(text)){s+=3;h.push('tekst bevat borst-/hartalarmsignalen')} if(/spraak|scheve|uitval|krachtsverlies|verlamming|verward/.test(text)){s+=4;h.push('tekst bevat neurologische alarmsignalen')} if(/bloed|zwart|braken|niet plassen|flauw|collaps/.test(text)){s+=3;h.push('tekst bevat mogelijke rode vlaggen')} if(/koorts|suf|erger|plots/.test(text)){s+=2;h.push('tekst bevat algemene alarmsignalen')} return {s,h};}
function analyze(){const d=state.selected?getD(state.selected):null, txt=$('#symptomText').value.trim(), pain=+$('#painScore').value, onset=$('#onset').value, course=$('#course').value, imp=$('#impression').value, checked=$$('#redFlags input:checked').map(x=>x.value), prof=getProfile(), inf=infer(txt); let score=inf.s+checked.length*2+(pain>=8?3:pain>=5?1:0)+(onset==='sudden'?2:0)+(course==='worse'?2:0)+(imp==='ill'?3:imp==='limited'?1:0); if(+prof.p_age>=65||prof.p_type==='older')score+=1; let cls='urg-low', title='Indicatief: niet-spoedeisend / monitoren of reguliere beoordeling plannen'; if(score>=5){cls='urg-mid';title='Indicatief: medische beoordeling aanbevolen'} if(score>=9||checked.some(f=>['Drukkende borstpijn','Ernstige benauwdheid','Flauwvallen','Bewustzijnsverlies','Scheve mond / spraakprobleem','Niet kunnen plassen'].includes(f))){cls='urg-high';title='Indicatief: spoedbeoordeling kan nodig zijn'} const diff=d?.differentiaal||[], flags=d?.rodeVlaggen||[]; const ctx=[]; if(d)ctx.push(`Atlasselectie: ${d.naam} (${d.systeem}).`); ctx.push(`Pijnscore ${pain}/10, begin: ${onset}, verloop: ${course}, algemene indruk: ${imp}.`); if(+prof.p_age>=65||prof.p_type==='older')ctx.push('Oudere-volwassenencontext: lagere drempel voor beoordeling.'); if(prof.p_type==='child'||prof.p_type==='teen')ctx.push('Kind/tienercontext: gedrag, hydratatie en snelle achteruitgang extra meewegen.'); if(prof.p_conditions)ctx.push('Bekende aandoeningen opgegeven: betrek dit bij professionele beoordeling.'); if(prof.p_meds)ctx.push('Medicatie opgegeven: interacties/bijwerkingen kunnen relevant zijn.'); if(prof.p_allergies)ctx.push('Allergieën opgegeven: belangrijk bij huid, ademhaling en medicatie.'); if(prof.p_family)ctx.push('Familiegeschiedenis opgegeven: context, geen diagnosegrond.'); const next=cls==='urg-high'?'Zoek direct professionele/spoedbeoordeling als klachten actueel zijn, ernstig zijn of verergeren.':cls==='urg-mid'?'Plan medische beoordeling of neem laagdrempelig contact op bij aanhouden, verergering of twijfel.':'Observeer het beloop; zoek hulp bij verergering, aanhouden of nieuwe rode vlaggen.'; $('#analysisOutput').className='analysis-output'; $('#analysisOutput').innerHTML=`<h3 class="${cls}">${title}</h3>${info('Gebaseerd op',[txt||'Geen vrije tekst ingevuld.'])}${listBlock('Geselecteerde rode vlaggen',checked.length?checked:['Geen geselecteerd'])}${listBlock('Indicatieve differentiaal',diff,'ol')}${listBlock('Rode vlaggen om actief uit te sluiten',flags.slice(0,6))}${listBlock('Contextuele interpretatie',[...ctx,...inf.h])}${info('Adviesrichting',[next,'HealthLens geeft indicatieve educatie en vervangt geen arts of spoedzorg.'])}`;}
function renderContext(){ $('#contextPanel').innerHTML=info('Sterk overgenomen uit Claude',['Modulaire medische database met veel meer organen en velden.','Privacydashboard met lokale opslag, export en wissen.','Uitgebreider profiel met medicatie, aandoeningen, allergieën en familiegeschiedenis.','Educatief Centrum met bredere modulelijst.','AR/houdingscheck als gescheiden lab-optie in plaats van onderdeel van de stabiele atlas.'])+info('Bewust verbeterd t.o.v. Claude',['Atlas blijft statisch en gecentreerd.','Geen draai-/bewegingsinterface in de hoofd-atlas.','Geen zichtbare blauwe rondjes. Selectie is onzichtbaar tot highlight.','Atlas gebruikt de visuele lagen uit onze eerdere HealthLens-richting.']);}
function renderEdu(){ $('#eduCards').innerHTML=edu.map(([t,b])=>`<article class="edu-card"><h3>${esc(t)}</h3><p>${esc(b)}</p></article>`).join('');}
function getProfile(){try{return JSON.parse(localStorage.getItem(K_PROF)||'{}')}catch(e){return {}}}
function loadProfile(){const p=getProfile(); ['p_age','p_sex','p_display','p_bg','p_type','p_focus','p_height','p_weight','p_conditions','p_meds','p_allergies','p_family'].forEach(id=>{if($( '#'+id)&&p[id]!==undefined)$('#'+id).value=p[id]}); applyProfileVisuals();}
function saveProfile(){const p={}; ['p_age','p_sex','p_display','p_bg','p_type','p_focus','p_height','p_weight','p_conditions','p_meds','p_allergies','p_family'].forEach(id=>p[id]=$('#'+id).value); localStorage.setItem(K_PROF,JSON.stringify(p)); $('#profileMsg').textContent='Opgeslagen (lokaal).'; applyProfileVisuals(); renderContext();}
function clearProfile(){localStorage.removeItem(K_PROF); location.reload();}
function applyProfileVisuals(){const p=getProfile(); const tint=$('#profileTint'); tint.className='profile-tint'; if(p.p_bg)tint.classList.add(p.p_bg); $('#modestyOverlay').classList.toggle('hidden',!(p.p_type==='child'||p.p_type==='teen')); const sex=p.p_display||p.p_sex||'neutral'; const typ=p.p_type||'adult'; $('#profileStatus').textContent=`${labelType(typ)} · ${labelSex(sex)} · lokaal`; updateComplaintContext();}
function labelType(x){return {adult:'Volwassene',older:'Oudere volwassene',teen:'Tiener',child:'Kind'}[x]||'Volwassene'} function labelSex(x){return {female:'Vrouw',male:'Man',neutral:'Neutraal',other:'Anders','prefer-not':'Niet opgegeven'}[x]||'Neutraal'}
function renderStorage(){const items=Object.keys(localStorage).filter(k=>k.startsWith('healthlens')).map(k=>`${k} — ${(localStorage.getItem(k)||'').length} tekens`); $('#storageUsage').innerHTML=items.length?items.map(x=>`<div>${esc(x)}</div>`).join(''):'Nog geen HealthLens-data opgeslagen.';}
function collectStorage(){const o={};Object.keys(localStorage).filter(k=>k.startsWith('healthlens')).forEach(k=>{try{o[k]=JSON.parse(localStorage.getItem(k))}catch(e){o[k]=localStorage.getItem(k)}});return o;}
function downloadJSON(name,obj){const blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
window.addEventListener('DOMContentLoaded',init);
})();
