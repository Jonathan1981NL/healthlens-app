
/* HealthLens - privacy helpers */
(function(){
  const PREFIX = 'healthlens_';
  const P = {};

  P.PREFIX = PREFIX;

  P.collectStoredData = function(){
    const out = {};
    for(let i=0; i<localStorage.length; i++){
      const k = localStorage.key(i);
      if(k && k.startsWith(PREFIX)){
        try { out[k] = JSON.parse(localStorage.getItem(k)); }
        catch(e){ out[k] = localStorage.getItem(k); }
      }
    }
    return out;
  };

  P.listStorageUsage = function(){
    const list = [];
    for(let i=0; i<localStorage.length; i++){
      const k = localStorage.key(i);
      if(k && k.startsWith(PREFIX)){
        const v = localStorage.getItem(k) || '';
        list.push({key:k, bytes: (k.length + v.length)});
      }
    }
    return list.sort((a,b)=> b.bytes - a.bytes);
  };

  P.exportData = function(){
    const data = P.collectStoredData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const d = new Date();
    const stamp = d.getFullYear() +
      String(d.getMonth()+1).padStart(2,'0') +
      String(d.getDate()).padStart(2,'0');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'healthlens-export-' + stamp + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(()=> URL.revokeObjectURL(url), 1000);
  };

  P.wipeAll = function(){
    const keys = [];
    for(let i=0; i<localStorage.length; i++){
      const k = localStorage.key(i);
      if(k && k.startsWith(PREFIX)) keys.push(k);
    }
    keys.forEach(k => localStorage.removeItem(k));
    location.reload();
  };

  window.Privacy = P;
})();
