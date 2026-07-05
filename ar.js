
/* HealthLens - AR posture check (local only) */
(function(){
  const Ar = {};
  let stream = null, video = null, canvas = null, ctx = null;
  let pose = null, raf = 0, poseReady = false, arLayer = 'skeleton';

  function loadScript(src, timeout){
    return new Promise((res, rej)=>{
      const s = document.createElement('script');
      s.src = src; s.async = true;
      s.onload = ()=> res(true);
      s.onerror = ()=> rej(new Error('load fail ' + src));
      document.head.appendChild(s);
      if(timeout) setTimeout(()=> rej(new Error('timeout ' + src)), timeout);
    });
  }

  async function ensurePose(){
    if(poseReady) return true;
    try{
      await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js', 6000);
      await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js', 6000);
      await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js', 6000);
      poseReady = !!window.Pose;
      return poseReady;
    }catch(e){
      console.warn('Pose lib not available, fallback mode', e);
      return false;
    }
  }

  Ar.init = function(){
    video  = document.getElementById('arVideo');
    canvas = document.getElementById('arCanvas');
    if(!video || !canvas) return;
    ctx = canvas.getContext('2d');

    document.getElementById('arStart').addEventListener('click', Ar.start);
    document.getElementById('arStop').addEventListener('click', Ar.stop);
    document.getElementById('arSnap').addEventListener('click', Ar.snapshot);

    document.querySelectorAll('.seg').forEach(b=>{
      b.addEventListener('click', ()=>{
        document.querySelectorAll('.seg').forEach(x=> x.classList.remove('active'));
        b.classList.add('active');
        arLayer = b.dataset.arlayer;
      });
    });
  };

  Ar.start = async function(){
    try{
      stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'}, audio:false});
      video.srcObject = stream;
      await video.play();
      // Mirror for selfie look
      video.style.transform = 'scaleX(-1)';
      canvas.style.transform = 'scaleX(-1)';
      resize();
      document.getElementById('arConsent').hidden = true;
      document.getElementById('arStage').hidden = false;

      const ok = await ensurePose();
      if(ok){
        pose = new window.Pose({locateFile:(f)=>`https://cdn.jsdelivr.net/npm/@mediapipe/pose/${f}`});
        pose.setOptions({modelComplexity:1, smoothLandmarks:true, minDetectionConfidence:.5, minTrackingConfidence:.5});
        pose.onResults(onResults);
        loop();
      }else{
        // fallback: draw text overlay
        setBadges([{cls:'info', text:'Pose-model niet beschikbaar — camera-only modus. Informatief, geen diagnose.'}]);
        drawFallback();
      }
    }catch(err){
      console.error(err);
      setBadges([{cls:'warn', text:'Camera niet beschikbaar of geweigerd.'}]);
    }
  };

  function resize(){
    if(!video || !canvas) return;
    canvas.width  = video.videoWidth  || 480;
    canvas.height = video.videoHeight || 640;
  }

  async function loop(){
    if(!stream || !video) return;
    if(pose && video.readyState >= 2){
      await pose.send({image: video});
    }
    raf = requestAnimationFrame(loop);
  }

  function onResults(res){
    resize();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(!res.poseLandmarks) return;

    const lm = res.poseLandmarks;
    const W = canvas.width, H = canvas.height;

    // Draw landmarks
    ctx.fillStyle = 'rgba(20,184,166,.9)';
    ctx.strokeStyle = 'rgba(20,184,166,.9)';
    ctx.lineWidth = 2;
    // Simple stick figure
    const c = i => ({x: lm[i].x*W, y: lm[i].y*H});
    const line = (a,b)=>{ ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); };

    if(arLayer === 'skeleton'){
      // Torso
      line(c(11), c(12)); line(c(11), c(23)); line(c(12), c(24)); line(c(23), c(24));
      // Arms
      line(c(11), c(13)); line(c(13), c(15));
      line(c(12), c(14)); line(c(14), c(16));
      // Legs
      line(c(23), c(25)); line(c(25), c(27));
      line(c(24), c(26)); line(c(26), c(28));
      // Head
      line(c(0), {x:(c(11).x+c(12).x)/2, y:(c(11).y+c(12).y)/2});
      // Points
      [0,11,12,13,14,15,16,23,24,25,26,27,28].forEach(i=>{
        ctx.beginPath(); ctx.arc(lm[i].x*W, lm[i].y*H, 4, 0, Math.PI*2); ctx.fill();
      });
    }else if(arLayer === 'muscle'){
      // Coloured slabs for chest/abdomen
      ctx.fillStyle = 'rgba(220,38,38,.20)';
      const s=c(11), s2=c(12), h=c(23), h2=c(24);
      ctx.beginPath();
      ctx.moveTo(s.x,s.y); ctx.lineTo(s2.x,s2.y); ctx.lineTo(h2.x,h2.y); ctx.lineTo(h.x,h.y);
      ctx.closePath(); ctx.fill();
    }else if(arLayer === 'organ'){
      // Approximate heart and lungs in the chest area
      const s=c(11), s2=c(12), h=c(23), h2=c(24);
      const cx = (s.x+s2.x+h.x+h2.x)/4;
      const cy = (s.y+s2.y+h.y+h2.y)/4;
      const w  = Math.hypot(s.x-s2.x, s.y-s2.y);
      // Lungs
      ctx.fillStyle = 'rgba(59,130,246,.25)';
      ctx.beginPath(); ctx.ellipse(cx - w*0.22, cy - w*0.05, w*0.22, w*0.35, 0, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx + w*0.22, cy - w*0.05, w*0.22, w*0.35, 0, 0, Math.PI*2); ctx.fill();
      // Heart
      ctx.fillStyle = 'rgba(220,38,38,.55)';
      ctx.beginPath(); ctx.ellipse(cx - w*0.02, cy, w*0.14, w*0.18, 0, 0, Math.PI*2); ctx.fill();
    }

    // Analyse symmetry
    const angleDeg = (p1,p2)=> Math.atan2(p2.y-p1.y, p2.x-p1.x)*180/Math.PI;
    const shTilt  = Math.abs(angleDeg(c(11), c(12)));
    const hipTilt = Math.abs(angleDeg(c(23), c(24)));
    const headOff = Math.abs(lm[0].x - (lm[11].x+lm[12].x)/2) * 100;

    const badges = [
      classify('Schoudertilt', shTilt),
      classify('Bekkentilt',   hipTilt),
      classify('Hoofdpositie', headOff, 5, 12)
    ];
    badges.push({cls:'info', text:'Alleen informatief. Dit is geen diagnose.'});
    setBadges(badges);
  }

  function classify(label, val, low, high){
    low = low || 3; high = high || 8;
    let cls='chip ok', txt = `${label}: ${val.toFixed(1)}`;
    if(val > high){ cls='chip warn'; txt = `${label}: ${val.toFixed(1)} — asymmetrie waargenomen`; }
    else if(val > low){ cls='chip info'; txt = `${label}: ${val.toFixed(1)} — lichte afwijking`; }
    return {cls: cls.replace('chip ',''), text: txt};
  }

  function drawFallback(){
    if(!stream) return;
    resize();
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,.85)';
    ctx.fillText('Pose-detectie niet beschikbaar in deze modus.', 16, 28);
    raf = requestAnimationFrame(drawFallback);
  }

  function setBadges(items){
    const wrap = document.getElementById('arBadges');
    if(!wrap) return;
    wrap.innerHTML = items.map(i => `<span class="chip ${i.cls}">${i.text}</span>`).join('');
  }

  Ar.stop = function(){
    if(raf){ cancelAnimationFrame(raf); raf = 0; }
    if(stream){
      stream.getTracks().forEach(t => t.stop());
      stream = null;
    }
    if(video) video.srcObject = null;
    if(ctx && canvas) ctx.clearRect(0,0,canvas.width, canvas.height);
    document.getElementById('arStage').hidden = true;
    document.getElementById('arConsent').hidden = false;
    setBadges([]);
  };

  Ar.snapshot = function(){
    if(!video || !canvas || !video.videoWidth) return;
    const tmp = document.createElement('canvas');
    tmp.width  = video.videoWidth;
    tmp.height = video.videoHeight;
    const tctx = tmp.getContext('2d');
    // Mirror to match onscreen preview
    tctx.translate(tmp.width, 0);
    tctx.scale(-1, 1);
    tctx.drawImage(video, 0, 0, tmp.width, tmp.height);
    tctx.setTransform(1,0,0,1,0,0);
    tctx.drawImage(canvas, 0, 0, tmp.width, tmp.height);
    tmp.toBlob(blob=>{
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'healthlens-snapshot.png';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(()=> URL.revokeObjectURL(url), 1000);
    }, 'image/png');
  };

  window.Ar = Ar;
})();
