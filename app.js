const $ = (q, root = document) => root.querySelector(q);
const $$ = (q, root = document) => [...root.querySelectorAll(q)];

const state = {
  route: 'home',
  layers: new Set(['skin', 'organs', 'skeleton']),
  xp: Number(localStorage.getItem('healthlens_xp') || 0),
  quizIndex: 0,
};

const layerData = [
  ['skin', 'Huid', 'Barrière, wondzorg, huidtypebewuste observatie'],
  ['organs', 'Organen', 'Hart, longen, lever, darmen, nieren en meer'],
  ['skeleton', 'Skelet', 'Botten, gewrichten, houding en breukcontext'],
  ['muscles', 'Spieren', 'Beweging, sportblessures en pezen'],
  ['vessels', 'Bloedvaten', 'Circulatie, bloeddruk, trombose en beroertecontext'],
  ['nerves', 'Zenuwen', 'Uitstraling, tintelingen, kracht en gevoel'],
  ['hormones', 'Hormonen', 'Levensfasen, metabolisme, stress en cycluscontext'],
];

const zoneInfo = {
  head: {
    title: 'Hoofd & zenuwstelsel',
    structures: ['Hersenen', 'Ogen/oren', 'Zenuwen', 'Schedel', 'Bloedvaten'],
    symptoms: ['Hoofdpijn', 'Duizeligheid', 'Verwardheid', 'Uitval', 'Zicht/spraakverandering'],
    prevention: ['Slaap', 'Hydratatie', 'Bloeddrukbewustzijn', 'Helm bij sport', 'Schermpauzes'],
    urgent: 'Plots scheve mond, spraakproblemen, krachtsverlies, verwardheid of ergste hoofdpijn ooit: direct spoedhulp.'
  },
  chest: {
    title: 'Borst, hart & longen',
    structures: ['Hart', 'Longen', 'Ribben', 'Slokdarm', 'Grote bloedvaten'],
    symptoms: ['Druk/pijn', 'Benauwdheid', 'Hartkloppingen', 'Hoesten', 'Uitstraling'],
    prevention: ['Bewegen', 'Niet roken', 'Bloeddruk/cholesterol', 'Stressmanagement', 'Slaap'],
    urgent: 'Drukkende pijn met benauwdheid, zweten, misselijkheid of uitstraling: direct spoedhulp.'
  },
  abdomen: {
    title: 'Buik & spijsvertering',
    structures: ['Maag', 'Lever', 'Galblaas', 'Darmen', 'Nieren', 'Alvleesklier'],
    symptoms: ['Pijn', 'Misselijkheid', 'Diarree/obstipatie', 'Koorts', 'Bloedverlies'],
    prevention: ['Vezels', 'Hydratatie', 'Beweging', 'Alcoholbewust', 'Screening bij leeftijd/familiecontext'],
    urgent: 'Ernstige buikpijn, harde buik, bloedverlies, uitdroging, koorts of snelle verslechtering: medische hulp.'
  },
  pelvis: {
    title: 'Bekken & gevoelige gezondheid',
    structures: ['Blaas', 'Darmen', 'Voortplantingsorganen', 'Bekkenbodem', 'Zenuwen'],
    symptoms: ['Pijn bij plassen', 'Jeuk', 'Afscheiding', 'Cyclusklachten', 'Pijn/zwelling'],
    prevention: ['Veilige seksuele gezondheid', 'Bekkenbodem', 'Testen bij risico', 'Menstruatie/cyclusbewustzijn', 'Praat met arts bij zorgen'],
    urgent: 'Onder 16: geen intieme beelden. Wel veilige symptoomomschrijving en hulpadvies. Bij dwang/onveiligheid: zoek direct hulp.'
  },
  arms: {
    title: 'Armen, handen & gewrichten',
    structures: ['Schouder', 'Elleboog', 'Pols', 'Spieren', 'Pezen', 'Zenuwen'],
    symptoms: ['Pijn', 'Tintelingen', 'Krachtsverlies', 'Zwelling', 'Bewegingsbeperking'],
    prevention: ['Krachttraining', 'Ergonomie', 'Warming-up', 'Herstel', 'Valpreventie'],
    urgent: 'Plots krachtsverlies, ernstige zwelling, standsafwijking of koude/blauwe vingers: medische hulp.'
  },
  legs: {
    title: 'Benen, knieën & circulatie',
    structures: ['Heup', 'Knie', 'Enkel', 'Spieren', 'Aders', 'Zenuwen'],
    symptoms: ['Pijn', 'Zwelling', 'Rood/warm been', 'Instabiliteit', 'Tintelingen'],
    prevention: ['Beweging', 'Mobiliteit', 'Kracht', 'Schoeisel', 'Tromboserisico bewustzijn'],
    urgent: 'Eén rood, warm, gezwollen been of kortademigheid erbij: met spoed laten beoordelen.'
  }
};

const lifeCards = [
  {icon:'🫀', title:'Orgaangezondheid', body:'Per orgaan: functie, veelvoorkomende klachten, alarmsignalen en preventieve gewoonten.', tags:['hart','lever','darmen','huid']},
  {icon:'🌗', title:'Levensfasen', body:'Leeftijd, ontwikkeling, hormonale veranderingen en normale variatie worden als context meegenomen zonder de hoofdapp te versmallen.', tags:['puberteit','volwassen','ouder']},
  {icon:'🧒', title:'Jongerenvoorlichting', body:'Veilige uitleg over groei, lichaam, onzekerheid, grenzen en seksuele gezondheid. Geen intieme beelden onder 16.', tags:['veilig','tekstflow','geruststelling']},
  {icon:'🧬', title:'Familiecontext', body:'Familiegeschiedenis kan relevant zijn voor preventie en wanneer je iets met een arts bespreekt.', tags:['erfelijkheid','risico','preventie']},
  {icon:'🥗', title:'Voeding & leefstijl', body:'Algemene tips over bewegen, slaap, stress, alcohol/roken, huidzorg en orgaanonderhoud.', tags:['voeding','beweging','slaap']},
  {icon:'🌍', title:'Internationaal taalmodel', body:'Medische termen moeten lokaal begrijpelijk zijn: gewone woorden, artsentaal en synoniemen per taal.', tags:['NL','EN','21 talen']},
];

const firstAidCards = [
  {icon:'❤️', title:'Reanimatie oefenen', body:'Bel noodnummer, start compressies, gebruik AED indien beschikbaar. Stage 2 maakt dit interactiever.'},
  {icon:'🧠', title:'Beroerte herkennen', body:'Scheve mond, armzwakte, spraakproblemen: tijd telt. Direct spoedhulp.'},
  {icon:'🩸', title:'Ernstige bloeding', body:'Druk op de wond, bel hulp, blijf druk houden en voorkom afkoeling.'},
  {icon:'🔥', title:'Brandwond', body:'Koel met lauw stromend water, verwijder geen vastzittende kleding, beoordeel ernst.'},
  {icon:'🌬️', title:'Benauwdheid', body:'Ernstige benauwdheid, blauwe lippen of verwardheid: direct spoedhulp.'},
  {icon:'🦴', title:'Val of breuk', body:'Niet onnodig bewegen bij ernstige pijn, standsafwijking of hoofd/nekletsel.'},
];

const roadmap = [
  'Premium mobile-first home met duidelijke hoofdmodules en app-gevoel.',
  'PWA-basis: manifest, favicon, service worker en install-ready structuur.',
  'Algemene publieke appomschrijving zonder te specifieke medische modulelijst.',
  'Body Atlas uitgebreid met lagen voor huid, organen, skelet, spieren, vaten, zenuwen en hormonen.',
  'Klikbare lichaamskaart met regio-informatie, klachtencontext, preventie en alarmsignalen.',
  'Symptoomflow met profiel, gebied, klachttekst, alarmsignalen en veilige uitkomst.',
  'Onder 16: intieme beelden blokkeren, maar symptoomomschrijving via tekst toestaan.',
  'Veilige jongerenvoorlichting en geruststelling over normale lichaamsvariatie als productprincipe.',
  'Seksuele gezondheid als veilige tekstmodule zonder intieme beeldverwerking bij minderjarigen.',
  'Levensfasen en hormonale context verwerkt als onderliggende slimme contextlaag.',
  'Familiegeschiedenis en erfelijke risico’s opgenomen als preventieve context, niet als diagnoseclaim.',
  'Privacy Shield prominent met local-first, no-cloud, consent en blur-engine concept.',
  'Volwassen gevoelige-zone flow met expliciete toestemming en minimale dataverwerking.',
  'EHBO-module met oefenkaarten voor noodsituaties en offline-first richting.',
  'Quiz met XP, levels en internationale rankingconcepten voor terugkeerwaarde.',
  'Taalstrategie: Nederlands plus wereldtalen, gewone termen én medische termen.',
  'Resultaten structureren als mogelijke richting, alarmsignalen, actieadvies en disclaimer.',
  'Mobiele navigatie via bottom tabs en drawer, geschikt voor iOS/Android wrapper later.',
  'Documentatie en changelog bijgewerkt zodat de baseline niet verloren gaat.',
  'Stage-gate aanpak behouden: snelle bouw, maar werkende baseline telkens locken.'
];

const quiz = [
  {q:'Welk orgaan pompt bloed door het lichaam?', a:['Long','Hart','Lever','Nier'], correct:1, why:'Het hart pompt bloed via bloedvaten naar het lichaam.'},
  {q:'Wat is een alarmsignaal bij plotselinge neurologische klachten?', a:['Hikken','Scheve mond of spraakproblemen','Droge huid','Lichte spierpijn'], correct:1, why:'Scheve mond, armzwakte of spraakproblemen kunnen op een beroerte wijzen.'},
  {q:'Wat doet HealthLens bij intieme beelden van iemand onder 16?', a:['Blurren en analyseren','Uploaden met toestemming','Blokkeren: niet analyseren of opslaan','Delen met ranglijst'], correct:2, why:'Onder 16 geldt nultolerantie voor intieme beelden. Symptomen kunnen wel via tekst.'},
  {q:'Welke laag helpt bij tintelingen en uitstralende pijn?', a:['Zenuwen','Huidkleur','Maag','Tandglazuur'], correct:0, why:'Zenuwbanen helpen klachten zoals tintelingen of uitstraling te begrijpen.'},
  {q:'Wat is de veiligste formulering voor een app-uitkomst?', a:['Je hebt zeker ziekte X','Kan passen bij, let op alarmsignalen','Negeer het','Google het later'], correct:1, why:'HealthLens geeft indicatieve duiding, geen definitieve diagnose.'}
];

function routeTo(route){
  state.route = route;
  $$('.screen').forEach(s => s.classList.toggle('active', s.id === route));
  $$('[data-route]').forEach(b => b.classList.toggle('active', b.dataset.route === route));
  $('#sideDrawer').classList.remove('open');
  $('#drawerBackdrop').classList.remove('open');
  $('#app').focus({preventScroll:true});
  history.replaceState(null, '', `#${route}`);
}

function renderLayers(){
  const root = $('#layerToggles');
  root.innerHTML = layerData.map(([key,label,desc]) => `<button class="${state.layers.has(key)?'active':''}" data-layer="${key}"><strong>${label}</strong><br><small>${desc}</small></button>`).join('');
  root.addEventListener('click', e => {
    const btn = e.target.closest('[data-layer]');
    if(!btn) return;
    const key = btn.dataset.layer;
    state.layers.has(key) ? state.layers.delete(key) : state.layers.add(key);
    updateLayerVisuals();
    renderLayers();
  }, {once:true});
  updateLayerVisuals();
}
function updateLayerVisuals(){
  layerData.forEach(([key]) => {
    const el = $(`.layer-visual.${key}`);
    if(el) el.classList.toggle('on', state.layers.has(key));
  });
  const confidence = Math.max(55, 100 - Math.max(0, state.layers.size - 3) * 7);
  $('#confidenceBar').style.width = confidence + '%';
  $('#confidenceText').textContent = `${state.layers.size} lagen actief. 3D Atlas-modus: ${confidence >= 80 ? 'hoge' : 'redelijke'} overzichtelijkheid. AR-confidence komt later.`;
}
function renderZone(zoneKey){
  const z = zoneInfo[zoneKey];
  $('#atlasInfo').innerHTML = `
    <h3>${z.title}</h3>
    <p>${z.urgent}</p>
    <h4>Wat zit hier?</h4>
    <ul class="info-list">${z.structures.map(x=>`<li>${x}</li>`).join('')}</ul>
    <h4>Klachten die hier vaak worden geplaatst</h4>
    <ul class="info-list">${z.symptoms.map(x=>`<li>${x}</li>`).join('')}</ul>
    <h4>Gezond houden</h4>
    <ul class="info-list">${z.prevention.map(x=>`<li>${x}</li>`).join('')}</ul>
    <button class="secondary" data-route="symptoms">Beschrijf klacht in deze regio</button>
  `;
}

function renderCards(){
  $('#lifeCards').innerHTML = lifeCards.map(c => `
    <article class="card"><h3>${c.icon} ${c.title}</h3><p>${c.body}</p><div class="tag-list">${c.tags.map(t=>`<span>${t}</span>`).join('')}</div></article>
  `).join('');
  $('#firstAidCards').innerHTML = firstAidCards.map(c => `
    <article class="card"><h3>${c.icon} ${c.title}</h3><p>${c.body}</p><div class="tag-list"><span>educatief</span><span>nood: bel hulp</span></div></article>
  `).join('');
  $('#roadmapList').innerHTML = roadmap.map((r,i) => `<article class="roadmap-item"><b>${i+1}</b><span>${r}</span></article>`).join('');
}

function symptomOutcome(data){
  const redflags = data.getAll('redflag');
  const profile = data.get('profile');
  const area = data.get('area');
  const complaint = (data.get('complaint') || '').trim();
  const urgent = redflags.includes('urgent') || redflags.includes('breath');
  const unsafe = redflags.includes('unsafe');
  let html = '<h3>Veilige duiding</h3>';
  if(unsafe){
    html += `<div class="alert bad"><strong>Veiligheid eerst.</strong><p>Als je je onveilig voelt, gedwongen bent of bang bent: praat direct met een vertrouwde volwassene, arts, schoolarts of lokale hulpdienst. Bij direct gevaar: bel het noodnummer.</p></div>`;
  }
  if(urgent){
    html += `<div class="alert bad"><strong>Alarmsignaal.</strong><p>Plots ernstige klachten, benauwdheid, flauwvallen, verwardheid of snelle verslechtering moeten direct medisch beoordeeld worden.</p></div>`;
  } else if(redflags.includes('fever')) {
    html += `<div class="alert warn"><strong>Laat beoordelen.</strong><p>Koorts of ernstig ziek gevoel kan bij meerdere aandoeningen passen. Neem contact op met een arts bij aanhoudende of verergerende klachten.</p></div>`;
  } else {
    html += `<div class="alert good"><strong>Indicatieve richting.</strong><p>Er zijn geen geselecteerde spoed-alarmen, maar HealthLens stelt geen diagnose. Houd ontwikkeling bij en zoek hulp bij twijfel of verslechtering.</p></div>`;
  }
  if(profile === 'minor' && area === 'sensitive'){
    html += `<div class="alert warn"><strong>Onder 16: geen intieme beelden.</strong><p>Je mag klachten wel veilig omschrijven met woorden. Maak geen foto of scan van intieme delen. Bij pijn, jeuk, afscheiding, branderig plassen, wondjes of zorgen na seksueel contact: bespreek dit met een arts of betrouwbare volwassene. Een SOA kan alleen met testen betrouwbaar worden vastgesteld.</p></div>`;
  }
  if(profile === 'hormonal' || area === 'general'){
    html += `<div class="alert warn"><strong>Contextlaag.</strong><p>Vage klachten kunnen soms samenhangen met slaap, stress, hormonen, schildklier, bloedwaarden, medicatie of levensfase. De app moet dit later slimmer uitvragen zonder klachten te snel weg te verklaren.</p></div>`;
  }
  if(area === 'skin'){
    html += `<div class="alert warn"><strong>Huid/foto later.</strong><p>Stage 1C bevat nog geen echte beeldanalyse. Bij veranderende moedervlek, infectietekenen, snelle uitbreiding, pijn of bloeding: laat beoordelen.</p></div>`;
  }
  html += `<h4>Samenvatting</h4><p>${complaint ? complaint.replace(/[<>]/g,'') : 'Geen klachttekst ingevuld.'}</p><h4>Volgende stap</h4><ul class="info-list"><li>Let op alarmsignalen.</li><li>Maak eventueel een lokale notitie voor huisarts.</li><li>Gebruik geen gevoelige foto’s waar dat niet veilig of toegestaan is.</li><li>Bij twijfel: professionele medische hulp.</li></ul><small>Educatief en indicatief. Geen definitieve diagnose.</small>`;
  return html;
}

function renderQuiz(){
  const item = quiz[state.quizIndex % quiz.length];
  $('#xpValue').textContent = `${state.xp} XP`;
  $('#levelValue').textContent = `Level ${Math.floor(state.xp / 100) + 1}`;
  $('#quizQuestion').textContent = item.q;
  $('#quizAnswers').innerHTML = item.a.map((a,i)=>`<button data-answer="${i}">${a}</button>`).join('');
  $('#quizFeedback').textContent = '';
}
function answerQuiz(i){
  const item = quiz[state.quizIndex % quiz.length];
  const correct = i === item.correct;
  if(correct){ state.xp += 25; localStorage.setItem('healthlens_xp', state.xp); }
  $('#quizFeedback').textContent = `${correct ? 'Goed. +' : 'Bijna. '} ${item.why}`;
  setTimeout(()=>{ state.quizIndex++; renderQuiz(); }, 1450);
}

function renderScanScenario(scenario='adultSkin'){
  $$('#scanScenario button').forEach(b=>b.classList.toggle('active', b.dataset.scenario === scenario));
  const result = {
    adultSkin: `<div class="alert good"><strong>Toegestaan met privacycheck.</strong><p>Analyse alleen na preview, metadata verwijderen en geen cloudopslag tenzij gebruiker kiest.</p></div>`,
    minorSensitive: `<div class="alert bad"><strong>Geblokkeerd.</strong><p>Onder 16: geen intieme beelden. Niet analyseren, niet opslaan, niet uploaden. Gebruik veilige tekstvragen en hulpadvies.</p></div>`,
    adultSensitive: `<div class="alert warn"><strong>Strikte volwassen flow.</strong><p>Alleen eigen beeld, expliciete toestemming, lokale verwerking waar mogelijk, blur van niet-relevante zones en geen automatische opslag.</p></div>`
  }[scenario];
  $('#scanResult').innerHTML = result;
}

function init(){
  $$('[data-route]').forEach(btn => btn.addEventListener('click', () => routeTo(btn.dataset.route)));
  $('#menuButton').addEventListener('click', () => { $('#sideDrawer').classList.add('open'); $('#drawerBackdrop').classList.add('open'); });
  $('#drawerClose').addEventListener('click', () => { $('#sideDrawer').classList.remove('open'); $('#drawerBackdrop').classList.remove('open'); });
  $('#drawerBackdrop').addEventListener('click', () => { $('#sideDrawer').classList.remove('open'); $('#drawerBackdrop').classList.remove('open'); });
  renderLayers(); renderCards(); renderQuiz(); renderScanScenario();
  $('#humanFigure').addEventListener('click', e => { const z = e.target.closest('[data-zone]'); if(z) renderZone(z.dataset.zone); });
  $('#symptomForm').addEventListener('submit', e => { e.preventDefault(); $('#symptomResult').innerHTML = symptomOutcome(new FormData(e.currentTarget)); });
  $('#quizAnswers').addEventListener('click', e => { const btn = e.target.closest('[data-answer]'); if(btn) answerQuiz(Number(btn.dataset.answer)); });
  $('#scanScenario').addEventListener('click', e => { const btn = e.target.closest('[data-scenario]'); if(btn) renderScanScenario(btn.dataset.scenario); });
  if('serviceWorker' in navigator){ navigator.serviceWorker.register('./service-worker.js').catch(()=>{}); }
  const initial = location.hash?.replace('#','');
  if(initial && $("#"+CSS.escape(initial))) routeTo(initial);
}

document.addEventListener('DOMContentLoaded', init);
