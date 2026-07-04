const $ = (q) => document.querySelector(q);
const $$ = (q) => [...document.querySelectorAll(q)];

const languages = [
  ['nl','Nederlands'],['en','English'],['zh','中文'],['hi','हिन्दी'],['es','Español'],['ar','العربية'],['fr','Français'],['bn','বাংলা'],['pt','Português'],['ru','Русский'],['ur','اردو'],['id','Bahasa Indonesia'],['de','Deutsch'],['ja','日本語'],['sw','Kiswahili'],['mr','मराठी'],['te','తెలుగు'],['tr','Türkçe'],['ta','தமிழ்'],['vi','Tiếng Việt'],['it','Italiano'],['pl','Polski']
];
languages.forEach(([code,name])=>{ const o=document.createElement('option'); o.value=code; o.textContent=name; $('#languageSelect').appendChild(o); });

function showScreen(id){
  $$('.screen').forEach(s=>s.classList.remove('active'));
  const target = $('#' + id);
  if(target) target.classList.add('active');
  $$('.top-nav button').forEach(b=>b.classList.toggle('active', b.dataset.screen===id));
  $('#topNav').classList.remove('open');
  window.scrollTo({top:0, behavior:'smooth'});
}
$$('[data-screen]').forEach(b=>b.addEventListener('click',(e)=>{e.preventDefault(); showScreen(b.dataset.screen);}));
$('#menuBtn').addEventListener('click',()=>$('#topNav').classList.toggle('open'));

function showModal(title,text){ $('#modalTitle').textContent=title; $('#modalText').textContent=text; $('#modal').classList.remove('hidden'); }
$('#closeModal').addEventListener('click',()=>$('#modal').classList.add('hidden'));
$('#modal').addEventListener('click',(e)=>{ if(e.target.id==='modal') $('#modal').classList.add('hidden'); });

const regions = {
  head:{title:'Hoofd & zenuwstelsel', text:'Hier liggen hersenen, schedel, ogen, oren, evenwichtsorgaan, zenuwen en bloedvaten. Belangrijk bij hoofdpijn, duizeligheid, verwardheid, uitval, koorts met nekstijfheid of hoofdletsel.', tags:['hersenen','schedel','beroerte-alert','zicht/gehoor'], prevention:'Slaap, bloeddruk, gehoor/zicht, helm bij risico, snelle actie bij FAST-signalen.'},
  chest:{title:'Borstkas', text:'Hier liggen hart, longen, ribben, borstspieren, slokdarm en grote bloedvaten. Drukkende borstpijn, benauwdheid, uitstraling, zweten of flauwvallen zijn alarmsignalen.', tags:['hart','longen','ribben','spoed bij alarmsignalen'], prevention:'Bewegen, niet roken, bloeddruk/cholesterol kennen, slaap en stressmanagement.'},
  abdomen:{title:'Buik', text:'Hier liggen maag, darmen, lever, galblaas, milt, alvleesklier, nieren en grote bloedvaten. Let op koorts, toenemende pijn, bloedverlies, geelzucht of hevig braken.', tags:['lever','darmen','nieren','galblaas'], prevention:'Vezels, hydratatie, alcohol beperken, gezond gewicht, bewegen en alarmsignalen niet negeren.'},
  pelvis:{title:'Bekken & gevoelige regio', text:'Klachten kunnen gaan over blaas, darmen, voortplantingsorganen, menstruatie, SOA/STI, zwangerschap, puberteit of seksuele gezondheid. Onder 16: geen intieme beelden; wel veilige tekstvragen.', tags:['blaas','menstruatie','SOA/STI','kindveilig zonder foto'], prevention:'Veilige seks, testadvies bij risico, menstruatiekennis, bekkenbodem, respect voor grenzen en consent.'},
  leg:{title:'Benen & gewrichten', text:'Hier zitten botten, spieren, pezen, bloedvaten en zenuwen. Let op zwelling, roodheid, warmte, onvermogen te lopen, gevoelloosheid of pijn na trauma.', tags:['spieren','botten','trombose-alert','sportblessure'], prevention:'Krachttraining, mobiliteit, opbouw belasting, herstel, schoenen en valpreventie.'}
};
let selectedRegion = null;
$$('[data-region]').forEach(el=>el.addEventListener('click',()=>selectRegion(el.dataset.region)));
function selectRegion(r){
  selectedRegion = r;
  const data = regions[r];
  $('#regionTitle').textContent = data.title;
  $('#regionText').textContent = data.text;
  $('#regionTags').innerHTML = data.tags.map(t=>`<span class="tag">${t}</span>`).join('');
  $('#regionPrevention').innerHTML = `<strong>Preventie:</strong> ${data.prevention}`;
  $('#regionPrevention').classList.remove('hidden');
}
$('#useRegionBtn').addEventListener('click',()=>{
  if(selectedRegion){
    const map = {head:'hoofd', chest:'borst', abdomen:'buik', pelvis:'gevoelige plek', leg:'gewrichten/spieren'};
    $('#bodyArea').value = map[selectedRegion] || 'buik'; showScreen('symptoms');
  } else showModal('Kies eerst een regio','Klik eerst op het lichaam om een gebied te selecteren.');
});

$$('.layerToggle').forEach(cb=>cb.addEventListener('change',()=>{
  $$(`.layer.${cb.value}`).forEach(el=>el.classList.toggle('visible', cb.checked));
}));

$('#startArBtn').addEventListener('click',()=>showModal('AR SafeScan prototype','Stage 1B simuleert AR. De echte AR-modus komt later met pose detection voor staand, zittend, liggend, slapend of gevallen lichaam, plus confidence overlay en privacyfilter vóór verwerking.'));

$('#profileSelect').addEventListener('change',e=>{
  const messages = {
    child:['Kindveilig profiel','Onder 16: geen intieme beelden of scans. Symptomen, puberteitsvragen en SOA/STI-zorgen kunnen wel veilig via tekst, keuzevragen en neutrale body maps worden besproken.'],
    teen:['Jongere 16–17','Meer volwassen seksuele gezondheidsinformatie is mogelijk, maar privacy blijft extra streng. Gevoelige beelden krijgen aparte local-first bescherming.'],
    femaleLife:['Hormonale context','Perimenopauze wordt meegenomen als context bij vage klachten zoals slaap, brain fog, opvliegers, hartkloppingen, stemmingswisselingen en gewrichtspijn. Alarmsignalen blijven leidend.'],
    senior:['Oudere context','Bij ouderen kunnen infecties, vallen, medicatieproblemen en neurologische klachten anders presenteren. De app verhoogt voorzichtigheid bij alarmsignalen.']
  };
  if(messages[e.target.value]) showModal(...messages[e.target.value]);
});

$('#analyzeBtn').addEventListener('click',()=>{
  const age = $('#ageGroup').value;
  const area = $('#bodyArea').value;
  const complaint = $('#complaint').value;
  const sev = $('#severity').value;
  const text = $('#symptomText').value.trim();
  let cls = 'result';
  let title = 'Indicatieve uitleg';
  const bullets = [];
  const actions = [];

  if($('#alarmUnsafe').checked){
    cls+=' urgent'; title='Veiligheid eerst';
    bullets.push('Wat je invult kan wijzen op een onveilige situatie, dwang of misbruik. Je verdient hulp en hoeft dit niet alleen op te lossen.');
    actions.push('Praat direct met een vertrouwde volwassene, huisarts, jeugdarts, schoolarts of lokale hulpdienst. Bij direct gevaar: bel het lokale alarmnummer.');
  } else if($('#alarmChest').checked || $('#alarmNeuro').checked || sev==='severe'){
    cls+=' urgent'; title='Alarmsignalen aanwezig';
    bullets.push('Bij plots ernstige klachten, borstpijn/benauwdheid/flauwvallen of neurologische uitval moet je direct professionele medische hulp inschakelen.');
    actions.push('Bel lokale spoedhulp of laat iemand anders bellen. Wacht niet op appadvies.');
  }

  if(age==='under16' && area==='gevoelige plek'){
    bullets.push('Onder 16: HealthLens verwerkt geen intieme foto’s of scans. Je kunt klachten wél veilig met woorden omschrijven.');
    actions.push('Bij pijn, wondjes, blaasjes, afscheiding, branderig plassen of zorgen na seksueel contact: bespreek dit met arts of betrouwbare volwassene en laat je zo nodig testen.');
  }
  if(age==='teen16' && area==='gevoelige plek'){
    bullets.push('Bij 16–17 jaar blijft privacy extra streng. Foto’s zijn niet nodig om eerste uitleg, testadvies of hulpverwijzing te geven.');
  }
  if(complaint==='mogelijke SOA/STI'){
    bullets.push('Een SOA/STI kan niet betrouwbaar worden uitgesloten op basis van klachten alleen. Soms zijn er geen klachten.');
    actions.push('Laat je testen bij risico, klachten, onbeschermd seksueel contact of twijfel. Gebruik geen intieme foto-upload.');
  }
  if(complaint==='onzeker over puberteit'){
    bullets.push('Veel verschillen in borstgroei, haargroei, penis/testikelontwikkeling, menstruatie, acne, lengte en lichaamsvorm zijn normaal.');
    actions.push('Zoek hulp bij pijn, plotselinge zwelling, bloedverlies, niet kunnen plassen, extreme zorgen of een onveilig gevoel.');
  }
  if($('#hormoneContext').checked || complaint==='vermoeid/brain fog'){
    bullets.push('Bij 38–55 jaar kunnen vage klachten zoals slaapverstoring, brain fog, opvliegers, hartkloppingen, stemmingswisselingen en gewrichtspijn passen bij perimenopauze.');
    actions.push('Gebruik perimenopauze als context, maar schrijf nieuwe of ernstige alarmsignalen niet automatisch aan hormonen toe.');
  }
  if($('#familyContext').checked || complaint==='familie/erfelijke ziekte'){
    bullets.push('Familiegeschiedenis kan relevant zijn bij hartziekten, kanker, cholesterol, stolling, auto-immuunziekten en zeldzame aandoeningen.');
    actions.push('Noteer welke familieleden, welke diagnose en op welke leeftijd. Bespreek dit met huisarts als meerdere familieleden of jonge leeftijd meespelen.');
  }
  if(area==='borst' && !cls.includes('urgent')) bullets.push('Borstklachten kunnen komen door spieren/ribben, maagzuur, stress, longen of hart. Let extra op druk, uitstraling, zweten, benauwdheid of flauwvallen.');
  if(area==='buik') bullets.push('Buikklachten kunnen uit maag/darmen, galblaas/lever, nieren/blaas, spieren of voortplantingsorganen komen. Toenemende pijn, koorts, bloedverlies of aanhoudend braken zijn redenen voor medische hulp.');
  if(area==='huid') bullets.push('Bij huid, wond of moedervlek: let op snelle verandering, bloeding, asymmetrie, kleurverschil, pus, roodheid/warmte of koorts. Fotoanalyse komt pas na privacyfundering.');
  if(text.length>0) bullets.push('Je omschrijving is meegenomen als context. In een latere versie wordt dit gestructureerd omgezet naar duur, locatie, karakter, triggers en risicofactoren.');
  if(!bullets.length) bullets.push('De app geeft educatieve en indicatieve informatie. Houd duur, ernst, locatie, koorts, medicatie en veranderingen bij en zoek medische hulp bij twijfel of verslechtering.');
  if(!actions.length) actions.push('Blijf klachten volgen. Bij twijfel, verslechtering of nieuwe alarmsignalen: neem contact op met een arts.');

  $('#triageResult').className = cls;
  $('#triageResult').innerHTML = `<h3>${title}</h3><h4>Wat dit kan betekenen</h4><ul>${bullets.map(b=>`<li>${b}</li>`).join('')}</ul><h4>Wat nu?</h4><ul>${actions.map(a=>`<li>${a}</li>`).join('')}</ul><p class="tiny">Geen definitieve diagnose. In noodsituaties: bel lokale spoedhulp.</p>`;
  $('#triageResult').classList.remove('hidden');
});

const lifeText = {
  normal:['Is dit normaal?','Lichamen ontwikkelen zich in verschillende tempo’s. Borsten kunnen ongelijk groeien, menstruaties zijn in het begin vaak onregelmatig, penissen/testikels verschillen sterk, haargroei start niet bij iedereen tegelijk en acne/lichaamsgeur horen vaak bij puberteit. Zoek hulp bij pijn, wondjes, plotselinge zwelling, niet kunnen plassen, bloedverlies, hevige zorgen of onveilig gevoel.'],
  sti:['SOA / STI veilige uitleg','SOA/STI-klachten kunnen jeuk, branderig plassen, afscheiding, blaasjes, wondjes, buikpijn of testikelpijn zijn, maar soms zijn er geen klachten. Testen is de enige betrouwbare manier om veel SOA’s uit te sluiten. Onder 16: geen foto’s, wel veilige vragen en hulpverwijzing.'],
  peri:['Perimenopauze context','Perimenopauze kan breed en wisselend zijn: slaap, brain fog, opvliegers, nachtzweten, stemming, hartkloppingen, gewrichtspijn, libido, urinewegklachten en cyclusverandering. Nieuwe, ernstige of plotselinge klachten blijven alarmsignalen.'],
  genetic:['Erfelijkheidslaag','Let op meerdere familieleden met dezelfde aandoening, diagnose op jonge leeftijd, plots overlijden, erfelijke kanker, hoog cholesterol, stollingsproblemen of bekende genetische aandoeningen. De app helpt dit structureren voor huisarts of genetisch counselor.'],
  prevention:['Preventie per orgaan','Elke orgaanpagina krijgt voeding, beweging, slaap, rook/alcohol, screening, alarmsignalen en praktische routines. Dit is preventief en educatief, geen behandelplan.'],
  inclusive:['Biaslaag','De app markeert waar klassieke medische data minder representatief zijn. Huiduitslag kan anders zichtbaar zijn op donkere huid; vrouwen, kinderen en ouderen presenteren klachten soms anders dan de historische standaard.']
};
$$('[data-life]').forEach(btn=>btn.addEventListener('click',()=>{
  const [title,text]=lifeText[btn.dataset.life];
  $('#lifeOutput').innerHTML = `<h3>${title}</h3><p>${text}</p>`;
  $('#lifeOutput').classList.remove('hidden');
}));

$('#simulatePhotoBtn').addEventListener('click',()=>{
  const age=$('#photoAge').value, type=$('#photoType').value;
  const out=$('#photoPolicyResult'); out.classList.remove('hidden');
  if(age==='under16' && type==='sensitive'){
    out.className='result urgent'; out.innerHTML='<h3>Geblokkeerd</h3><p>Onder 16 verwerkt HealthLens geen naakt/intiem beeldmateriaal. Niet opslaan, niet uploaden, niet analyseren. Gebruik veilige symptoomvragen zonder foto.</p>';
  } else if(age==='teen16' && type==='sensitive'){
    out.className='result warn'; out.innerHTML='<h3>Extra gevoelig</h3><p>Voor 16–17 geldt een strengere gevoelige-flow. Standaard geen cloud, duidelijke consent, lokale verwerking en waar mogelijk geen beeld maar tekstuele klachtenflow.</p>';
  } else if(age==='adult' && type==='sensitive'){
    out.className='result warn'; out.innerHTML='<h3>Alleen met expliciete toestemming</h3><p>Volwassen gevoelige beoordeling mag alleen via local-first verwerking, blur/masking, previewcontrole, geen automatische cloudopslag en duidelijke medische disclaimer.</p>';
  } else if(type==='face' || type==='background'){
    out.className='result warn'; out.innerHTML='<h3>Anonimiseren vóór verwerking</h3><p>Gezicht, herkenbare achtergrond, documenten, sieraden/tatoeages en metadata worden lokaal gemaskeerd of verwijderd vóór opslag of upload.</p>';
  } else {
    out.className='result'; out.innerHTML='<h3>Toegestaan onder privacyflow</h3><p>Niet-intieme/geklede foto kan doorgaan met metadata strippen, gezichts-/achtergrondblur en gebruikerscontrole vóór opslag of delen.</p>';
  }
});

const aid = {
  cpr:['Reanimatie','1. Check veiligheid. 2. Controleer reactie en ademhaling. 3. Bel lokale spoedhulp. 4. Start borstcompressies als iemand niet normaal ademt. 5. Gebruik AED zodra beschikbaar.'],
  stroke:['Beroerte','FAST: Face scheef? Arm zwak? Speech verward? Time: direct spoedhulp. Noteer wanneer klachten begonnen.'],
  bleeding:['Ernstige bloeding','Geef directe druk op de wond, laat iemand spoedhulp bellen, leg indien mogelijk neer, blijf druk houden en verwijder geen diep vastzittende objecten.'],
  burn:['Brandwond','Koel met lauw stromend water, verwijder knellende sieraden/kleding niet als vastgeplakt, dek schoon af. Spoed bij groot, diep, gezicht/handen/geslachtsdelen of kind.'],
  fall:['Val / hoofdletsel','Niet verplaatsen bij vermoeden nek/rugletsel. Spoed bij bewustzijnsverlies, verwardheid, braken, ernstige hoofdpijn, bloedverdunners of neurologische uitval.'],
  allergy:['Allergie','Spoed bij benauwdheid, zwelling lip/tong/keel, flauwvallen of snelle uitbreiding. Gebruik voorgeschreven adrenaline-auto-injector indien aanwezig en bel spoedhulp.']
};
$$('[data-aid]').forEach(btn=>btn.addEventListener('click',()=>{ const [t,x]=aid[btn.dataset.aid]; $('#aidOutput').innerHTML=`<h3>${t}</h3><p>${x}</p><p class="tiny">In echte nood: bel lokale spoedhulp. Deze kaart vervangt geen training of professionele hulp.</p>`; $('#aidOutput').classList.remove('hidden'); }));

const quiz = [
  {q:'Welk orgaan ligt vooral rechtsboven in de buik?', a:'Lever', o:['Lever','Hart','Blaas','Milt']},
  {q:'Wat is een alarmsignaal bij borstklachten?', a:'Benauwdheid met drukkende pijn', o:['Lichte spierpijn na sporten','Benauwdheid met drukkende pijn','Hik','Jeuk aan arm']},
  {q:'Wat doet HealthLens bij intieme foto’s van kinderen onder 16?', a:'Blokkeren en niet opslaan/uploaden', o:['Blurren en uploaden','Blokkeren en niet opslaan/uploaden','Delen met ranking','Altijd analyseren']},
  {q:'Welke klachten kunnen bij perimenopauze passen?', a:'Brain fog, slaapklachten en opvliegers', o:['Alleen gebroken botten','Brain fog, slaapklachten en opvliegers','Alleen hoesten','Alleen bij kinderen']},
  {q:'Kan een SOA/STI altijd worden uitgesloten zonder test?', a:'Nee', o:['Ja','Nee','Alleen met een selfie','Alleen door leeftijd']},
  {q:'Wat is het eerste doel van EHBO-kaarten?', a:'Snel veilig handelen en hulp inschakelen', o:['Ranking winnen','Snel veilig handelen en hulp inschakelen','Diagnose stellen','Foto uploaden']}
];
let qi=-1, xp=0;
function nextQuiz(){ qi=(qi+1)%quiz.length; const item=quiz[qi]; $('#quizQ').textContent=item.q; $('#quizFeedback').classList.add('hidden'); $('#quizOptions').innerHTML=item.o.map(x=>`<button>${x}</button>`).join(''); $$('#quizOptions button').forEach(b=>b.addEventListener('click',()=>{ const ok=b.textContent===item.a; if(ok){xp+=10; $('#xpScore').textContent=xp;} $('#quizFeedback').className='result '+(ok?'':'warn'); $('#quizFeedback').innerHTML= ok?'<strong>Goed!</strong> +10 HealthLens XP':'<strong>Nog niet.</strong> Het juiste antwoord is: '+item.a; $('#quizFeedback').classList.remove('hidden'); })); }
$('#nextQuizBtn').addEventListener('click',nextQuiz); nextQuiz();
