
/* HealthLens - main SPA controller */
(function(){
  'use strict';

  const K_ACK   = 'healthlens_ack';
  const K_LANG  = 'healthlens_lang';
  const K_THEME = 'healthlens_theme';
  const K_PROF  = 'healthlens_profile';

  const VIEWS = ['front','right','back','left'];
  let viewIdx = 0;
  let currentLayer = 'lichaam';
  let currentOrgan = null;
  let currentDtab  = 'uitleg';

  // ============================================================
  // i18n
  // ============================================================
  function t(key){
    const lang = document.getElementById('language').value || 'nl';
    const dict = window.I18N || {};
    const fb = dict.__fallback || 'en';
    return (dict[lang] && dict[lang][key]) ||
           (dict[fb]   && dict[fb][key])   ||
           (dict.nl    && dict.nl[key])    || key;
  }
  function applyI18n(){
    const lang = document.getElementById('language').value || 'nl';
    const dict = window.I18N || {};
    const rtl = (dict.__rtl || []).includes(lang);
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr');
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const k = el.getAttribute('data-i18n');
      const v = t(k);
      if(v && v !== k) el.textContent = v;
    });
    // view label
    document.getElementById('viewLabel').textContent = t('view_' + VIEWS[viewIdx]);
    localStorage.setItem(K_LANG, lang);
  }

  // ============================================================
  // Disclaimer gate
  // ============================================================
  function initDisclaimer(){
    const modal = document.getElementById('disclaimer');
    const app   = document.getElementById('app');
    if(localStorage.getItem(K_ACK) === '1'){
      modal.remove(); app.hidden = false; return;
    }
    const chk = document.getElementById('ackChk');
    const btn = document.getElementById('acceptDisclaimer');
    chk.addEventListener('change', ()=> btn.disabled = !chk.checked);
    btn.addEventListener('click', ()=>{
      if(!chk.checked) return;
      localStorage.setItem(K_ACK, '1');
      modal.remove();
      app.hidden = false;
      onAppReady();
    });
  }

  // ============================================================
  // Theme
  // ============================================================
  function initTheme(){
    const saved = localStorage.getItem(K_THEME) || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    document.getElementById('themeToggle').addEventListener('click', ()=>{
      const cur = document.documentElement.getAttribute('data-theme');
      const nxt = cur === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', nxt);
      localStorage.setItem(K_THEME, nxt);
    });
  }

  // ============================================================
  // Tabs
  // ============================================================
  function initTabs(){
    document.querySelectorAll('.tab').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        const key = btn.dataset.tab;
        document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
        document.getElementById('panel-'+key).classList.add('active');
        if(key === 'ar')      lazyAR();
        if(key === 'privacy') renderStorage();
      });
    });
    document.querySelectorAll('.dtab').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        document.querySelectorAll('.dtab').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        currentDtab = btn.dataset.dtab;
        renderDetail();
      });
    });
  }

  // ============================================================
  // Atlas
  // ============================================================
  function renderAtlas(){
    const view = window.BODY_VIEWS[VIEWS[viewIdx]];
    const vis  = (window.LAYER_VISIBILITY[currentLayer] || []);
    let hitSvg = '';
    view.hitRegions.forEach(r=>{
      if(vis.length === 0) return;
      if(!vis.includes(r.organ)) return;
      hitSvg += `<path data-organ="${r.organ}" data-label="${r.label}" d="${r.path}"></path>`;
    });
    const canvas = document.getElementById('atlasCanvas');
    canvas.innerHTML = `
      <svg viewBox="0 0 400 800" xmlns="http://www.w3.org/2000/svg" aria-label="${t('layer_' + layerToKey(currentLayer))}">
        <g id="silhouette">${view.silhouette}</g>
        <g id="highlight-layer"></g>
        <g id="hit-regions" fill="transparent" stroke="transparent" style="cursor:pointer">
          ${hitSvg}
        </g>
      </svg>
    `;
    // Add click handlers
    canvas.querySelectorAll('#hit-regions path').forEach(p=>{
      p.addEventListener('click', ()=>{
        currentOrgan = p.dataset.organ;
        redrawHighlight();
        renderDetail();
        buildRedFlags();
      });
    });
    // Retain highlight if same organ still visible
    redrawHighlight();
  }
  function layerToKey(l){
    return ({
      lichaam:'body', organen:'organs', bloedbaan:'circ', zenuw:'nerve',
      lymfe:'lymph', spier:'muscle', skelet:'skel', adem:'resp',
      spijs:'dig', urin:'uri', endo:'endo', huid:'skin'
    })[l] || 'body';
  }
  function redrawHighlight(){
    const hl = document.getElementById('highlight-layer');
    if(!hl) return;
    hl.innerHTML = '';
    if(!currentOrgan) return;
    document.querySelectorAll(`#hit-regions path[data-organ="${currentOrgan}"]`).forEach(p=>{
      const clone = p.cloneNode(false);
      clone.setAttribute('class','selected-region');
      clone.removeAttribute('data-organ');
      hl.appendChild(clone);
    });
  }

  function initAtlas(){
    document.querySelectorAll('.layer-btn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        document.querySelectorAll('.layer-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        currentLayer = btn.dataset.layer;
        renderAtlas();
      });
    });
    document.getElementById('rotLeft').addEventListener('click', ()=> rotate(-1));
    document.getElementById('rotRight').addEventListener('click', ()=> rotate(1));
  }
  function rotate(d){
    const canvas = document.getElementById('atlasCanvas');
    canvas.classList.add('rotating');
    setTimeout(()=>{
      viewIdx = (viewIdx + d + VIEWS.length) % VIEWS.length;
      document.getElementById('viewLabel').textContent = t('view_' + VIEWS[viewIdx]);
      renderAtlas();
      canvas.classList.remove('rotating');
    }, 180);
  }

  // ============================================================
  // Detail panel
  // ============================================================
  function renderDetail(){
    const box   = document.getElementById('detail-content');
    const title = document.getElementById('detail-title');
    const sys   = document.getElementById('detail-system');
    if(!currentOrgan || !window.MEDDB[currentOrgan]){
      title.textContent = t('select_structure');
      sys.textContent   = '';
      box.innerHTML     = `<p class="muted">${t('no_selection')}</p>`;
      return;
    }
    const d = window.MEDDB[currentOrgan];
    title.textContent = d.naam;
    sys.textContent   = d.systeem;
    let html = '';
    switch(currentDtab){
      case 'uitleg':
        html = `<p>${d.omschrijving}</p><p><strong>Functie:</strong> ${d.functie}</p>`;
        break;
      case 'klachten':   html = list(d.klachten); break;
      case 'alarm':      html = list(d.rodeVlaggen, 'urg-high'); break;
      case 'preventie':  html = list(d.preventie); break;
      case 'eerstehulp': html = list(d.eersteHulp); break;
      case 'oorzaken':   html = list(d.differentiaal); break;
      case 'leren':
        html = `<p>${d.leren || ''}</p>` +
               (d.follow_up ? `<p class="muted"><strong>Vervolgvragen:</strong></p>${list(d.follow_up)}` : '');
        break;
    }
    box.innerHTML = html;
  }
  function list(arr, cls){
    if(!arr || !arr.length) return `<p class="muted">Geen informatie.</p>`;
    return '<ul>' + arr.map(x=>`<li${cls?` class="${cls}"`:''}>${esc(x)}</li>`).join('') + '</ul>';
  }
  function esc(s){
    return String(s).replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    })[c]);
  }

  // ============================================================
  // Complaint flow
  // ============================================================
  const GENERIC = [
    "Bewustzijnsverlies","Ernstige benauwdheid","Verwardheid",
    "Hoge koorts (>39.5°C)","Ernstige bloeding",
    "Plotseling ontstaan","Onverklaard gewichtsverlies"
  ];
  function buildRedFlags(){
    const wrap = document.getElementById('k_redflags');
    if(!wrap) return;
    let flags = GENERIC.slice();
    if(currentOrgan && window.MEDDB[currentOrgan]){
      flags = flags.concat(window.MEDDB[currentOrgan].rodeVlaggen);
    }
    wrap.innerHTML = flags.map(f =>
      `<label><input type="checkbox" value="${esc(f)}"> ${esc(f)}</label>`
    ).join('');
  }
  function initComplaint(){
    const pain = document.getElementById('k_pain');
    const val  = document.getElementById('k_pain_val');
    pain.addEventListener('input', ()=> val.textContent = pain.value);
    buildRedFlags();
    document.getElementById('k_analyze').addEventListener('click', analyze);
    document.getElementById('k_print').addEventListener('click', ()=> window.print());
  }
  function analyze(){
    const desc   = document.getElementById('k_desc').value.trim();
    const p      = +document.getElementById('k_pain').value;
    const onset  = document.getElementById('k_onset').value;
    const course = document.getElementById('k_course').value;
    const imp    = document.getElementById('k_impression').value;
    const checked = Array.from(document.querySelectorAll('#k_redflags input:checked'))
                         .map(x => x.value);
    const profile = getProfile();

    let score = 0;
    const reasons = [];
    if(p>=8){ score+=3; reasons.push(`Pijnscore ${p}/10 (zeer hoog)`); }
    else if(p>=5){ score+=2; reasons.push(`Pijnscore ${p}/10 (hoog)`); }
    else if(p>=3){ score+=1; reasons.push(`Pijnscore ${p}/10 (matig)`); }
    if(onset==='plots'){ score+=2; reasons.push('Plotseling begin'); }
    else if(onset==='uren'){ score+=1; reasons.push('Begin binnen uren'); }
    if(course==='erger'){ score+=2; reasons.push('Klachten worden erger'); }
    else if(course==='aanvallen'){ score+=1; reasons.push('Aanvalsgewijs verloop'); }
    if(imp==='ernstig'){ score+=3; reasons.push('Voelt zich ernstig ziek'); }
    else if(imp==='ziek'){ score+=2; reasons.push('Voelt zich ziek'); }
    else if(imp==='matig'){ score+=1; reasons.push('Matige indruk'); }
    if(checked.length){
      score += checked.length * 2;
      reasons.push(`${checked.length} alarmsignaal(en) aangevinkt`);
    }
    if(profile && profile.p_age && +profile.p_age >= 65){
      score += 1; reasons.push('Leeftijd ≥ 65 (extra alertheid)');
    }

    let urg='urg-low', label = t('urgency_low');
    if(score >= 8){ urg='urg-high'; label = t('urgency_high'); }
    else if(score >= 4){ urg='urg-mid'; label = t('urgency_mid'); }

    const diff = (currentOrgan && window.MEDDB[currentOrgan]) ? window.MEDDB[currentOrgan].differentiaal : [];
    const flagsToExclude = (currentOrgan && window.MEDDB[currentOrgan]) ? window.MEDDB[currentOrgan].rodeVlaggen : [];

    const out = document.getElementById('k_output');
    out.hidden = false;
    out.innerHTML = `
      <p><strong>Indicatie urgentie:</strong> <span class="${urg}">${esc(label)}</span></p>
      <p class="reasoning"><strong>Onderbouwing:</strong> ${reasons.length ? reasons.map(esc).join(' · ') : 'weinig risicofactoren'}</p>
      <p><strong>Uw omschrijving:</strong> ${esc(desc || '—')}</p>
      <p><strong>Aangevinkte alarmsignalen:</strong> ${checked.length ? checked.map(esc).join(', ') : 'geen'}</p>
      ${diff.length ? `<p><strong>Indicatieve mogelijke oorzaken:</strong> ${diff.map(esc).join(', ')}</p>` : ''}
      ${flagsToExclude.length ? `<p><strong>Actief uitsluiten:</strong> ${flagsToExclude.slice(0,4).map(esc).join(', ')}</p>` : ''}
      <p class="muted"><em>${esc(t('no_diagnosis_note'))}</em></p>
    `;
    out.scrollIntoView({behavior:'smooth', block:'nearest'});
  }

  // ============================================================
  // Profile
  // ============================================================
  const PFIELDS = ['p_age','p_sex','p_display','p_bg','p_type','p_height','p_weight',
                   'p_conditions','p_meds','p_allergies','p_family'];

  function getProfile(){
    try { return JSON.parse(localStorage.getItem(K_PROF) || '{}'); }
    catch(e){ return {}; }
  }
  function initProfile(){
    const data = getProfile();
    PFIELDS.forEach(f=>{
      if(data[f] !== undefined && document.getElementById(f)){
        document.getElementById(f).value = data[f];
      }
    });
    document.getElementById('p_save').addEventListener('click', ()=>{
      const d = {};
      PFIELDS.forEach(f => d[f] = document.getElementById(f).value);
      localStorage.setItem(K_PROF, JSON.stringify(d));
      document.getElementById('p_status').textContent = 'Opgeslagen (lokaal).';
    });
    document.getElementById('p_export').addEventListener('click', ()=> window.Privacy.exportData());
    document.getElementById('p_clear').addEventListener('click', ()=>{
      localStorage.removeItem(K_PROF);
      PFIELDS.forEach(f => { if(document.getElementById(f)) document.getElementById(f).value = ''; });
      document.getElementById('p_status').textContent = 'Gewist.';
    });
  }

  // ============================================================
  // Education
  // ============================================================
  const EDU_MODULES = [
    {title:"Anatomie per laag",         body:"Verken lichaam op laag: skelet, spieren, organen, zenuwen en meer."},
    {title:"Organen en functies",       body:"Wat doet elk orgaan en hoe werken ze samen in systemen."},
    {title:"Veelvoorkomende klachten",  body:"Overzicht van alledaagse klachten en hun context."},
    {title:"Alarmsignalen herkennen",   body:"Wanneer is direct hulp nodig? Leer de belangrijkste rode vlaggen."},
    {title:"Preventie per systeem",     body:"Praktische leefstijl- en screeningtips per orgaan­systeem."},
    {title:"Eerste hulp",               body:"Basisvaardigheden bij verwondingen, benauwdheid en flauwvallen."},
    {title:"Kinderen en puberteit",     body:"Veilige uitleg over lichamelijke ontwikkeling en normale variatie."},
    {title:"Seksuele gezondheid",       body:"SOA-symptomen, wanneer testen, en consent zonder stigma."},
    {title:"Perimenopauze",             body:"Hormonale veranderingen en herkennen van andere oorzaken."},
    {title:"Erfelijkheid & familie",    body:"Wanneer familiegeschiedenis reden is voor extra alertheid."},
    {title:"Huid en wondzorg",          body:"Verzorging, wondgenezing en wanneer een dokter nodig is."},
    {title:"Gezonde leefstijl",         body:"Beweging, voeding, slaap en stress als fundament van gezondheid."},
    {title:"Medicatiebewustzijn",       body:"Interacties, dosering, en verstandig omgaan met pijnstillers."},
    {title:"Wanneer huisarts of spoed", body:"Praktische beslissingsboom voor huisarts, HAP of 112."},
    {title:"Internationale zorg",       body:"Reizen, vaccinaties en toegang tot zorg in het buitenland."},
    {title:"Kennisquiz",                body:"Test uw kennis en herken lichaamsstructuren in korte oefeningen."}
  ];
  function initEducation(){
    const wrap = document.getElementById('eduCards');
    wrap.innerHTML = EDU_MODULES.map((m,i)=>`
      <article class="edu-card" data-idx="${i}">
        <h3>${esc(m.title)}</h3>
        <p>${esc(m.body)}</p>
      </article>
    `).join('');
    wrap.querySelectorAll('.edu-card').forEach(card=>{
      card.addEventListener('click', ()=>{
        const m = EDU_MODULES[+card.dataset.idx];
        openModal(m.title, `<p>${esc(m.body)}</p>
          <p class="muted">Deze module wordt in een volgende versie verder uitgebreid met interactieve inhoud en vertaalde tekst.</p>`);
      });
    });
  }

  // Modal helper
  function openModal(title, html){
    const overlay = document.createElement('div');
    overlay.className = 'modal';
    overlay.innerHTML = `
      <div class="modal-card">
        <h2>${esc(title)}</h2>
        ${html}
        <div class="row spread"><button class="btn primary" id="__closeModal">Sluiten</button></div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('#__closeModal').addEventListener('click', ()=> overlay.remove());
    overlay.addEventListener('click', e=>{ if(e.target === overlay) overlay.remove(); });
  }

  // ============================================================
  // Privacy panel
  // ============================================================
  function renderStorage(){
    const wrap = document.getElementById('storageUsage');
    const list = window.Privacy.listStorageUsage();
    if(!list.length){ wrap.textContent = 'Nog geen gegevens opgeslagen.'; return; }
    wrap.innerHTML = list.map(x =>
      `<div>${esc(x.key)} — ${x.bytes} bytes</div>`
    ).join('');
  }
  function initPrivacy(){
    document.getElementById('privExport').addEventListener('click', ()=> window.Privacy.exportData());
    document.getElementById('privWipe').addEventListener('click', ()=>{
      if(confirm('Weet u zeker dat u alle lokale HealthLens-gegevens wilt verwijderen?')){
        window.Privacy.wipeAll();
      }
    });
  }

  // ============================================================
  // AR lazy loader
  // ============================================================
  let arLoaded = false;
  function lazyAR(){
    if(arLoaded) return;
    arLoaded = true;
    const s = document.createElement('script');
    s.src = 'ar.js';
    s.onload = ()=> { if(window.Ar && window.Ar.init) window.Ar.init(); };
    document.body.appendChild(s);
  }

  // ============================================================
  // Service worker
  // ============================================================
  function initSW(){
    if('serviceWorker' in navigator){
      navigator.serviceWorker.register('sw.js').catch(()=>{});
    }
  }

  // ============================================================
  // Init
  // ============================================================
  function onAppReady(){
    // language
    const savedLang = localStorage.getItem(K_LANG) || 'nl';
    document.getElementById('language').value = savedLang;
    document.getElementById('language').addEventListener('change', ()=>{ applyI18n(); renderAtlas(); renderDetail(); buildRedFlags(); });

    initTheme();
    initTabs();
    initAtlas();
    initComplaint();
    initProfile();
    initEducation();
    initPrivacy();
    renderAtlas();
    renderDetail();
    applyI18n();
    initSW();
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    initDisclaimer();
    if(!document.getElementById('disclaimer')){
      onAppReady();
    }
  });
})();
