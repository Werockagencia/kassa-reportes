/* Visor HD: click en cualquier elemento con data-hd abre la pieza en alta resolución.
   Click o doble-tap = zoom al 100% · arrastrar para mover · ← → para navegar · Esc para cerrar */
(function () {
  const css = `
  .lb-thumb{cursor:zoom-in;transition:transform .15s,box-shadow .15s}
  .lb-thumb:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.25)}
  .lb{position:fixed;inset:0;background:rgba(5,8,15,.94);z-index:9999;display:none;flex-direction:column;font-family:Helvetica,Arial,sans-serif;color:#fff}
  .lb.on{display:flex}
  .lb-bar{display:flex;align-items:center;gap:10px;padding:12px 16px;flex:none}
  .lb-t{flex:1;font-size:14px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .lb-t small{display:block;font-weight:400;color:#94A3B8;font-size:12px}
  .lb-b{background:#1F2937;color:#fff;border:0;border-radius:8px;padding:9px 14px;font-size:13px;font-weight:700;cursor:pointer;text-decoration:none;white-space:nowrap}
  .lb-b:hover{background:#334155}.lb-b.g{background:#059669}
  .lb-st{flex:1;position:relative;overflow:hidden;touch-action:none}
  .lb-st img,.lb-st video{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);max-width:calc(100% - 24px);max-height:calc(100% - 24px);user-select:none;-webkit-user-drag:none;border-radius:6px;box-shadow:0 10px 40px rgba(0,0,0,.5)}
  .lb-st img{cursor:zoom-in}
  .lb-st.z{overflow:auto;cursor:grab}
  .lb-st.z img{position:static;transform:none;max-width:none;max-height:none;cursor:zoom-out;border-radius:0;margin:auto;display:block}
  .lb-nav{position:absolute;top:50%;transform:translateY(-50%);width:48px;height:64px;border:0;border-radius:10px;background:rgba(31,41,55,.8);color:#fff;font-size:28px;cursor:pointer;z-index:2}
  .lb-nav:hover{background:#334155}.lb-p{left:10px}.lb-n{right:10px}
  .lb-h{text-align:center;color:#94A3B8;font-size:12px;padding:8px;flex:none}
  @media (max-width:600px){.lb-b.hide-m{display:none}}
  @media print{.lb{display:none!important}}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const lb = document.createElement('div'); lb.className = 'lb';
  lb.innerHTML = `<div class="lb-bar"><div class="lb-t"></div><span class="lb-b hide-m lb-c"></span>
    <button class="lb-b lb-zb hide-m">🔍 Zoom 100%</button><a class="lb-b g lb-dl" download>⬇ Descargar HD</a><button class="lb-b lb-x">✕</button></div>
    <div class="lb-st"></div><button class="lb-nav lb-p">‹</button><button class="lb-nav lb-n">›</button>
    <div class="lb-h">Click en la imagen = zoom al 100% · arrastra para recorrerla · ← → para navegar · Esc para cerrar</div>`;
  document.body.appendChild(lb);
  const stage = lb.querySelector('.lb-st'), title = lb.querySelector('.lb-t'), cnt = lb.querySelector('.lb-c'), dl = lb.querySelector('.lb-dl');
  let items = [], idx = 0;

  function collect() { const all = [...document.querySelectorAll('[data-hd]')], seen = new Set(); all.forEach(el => el.classList.add('lb-thumb')); items = all.filter(el => !seen.has(el.dataset.hd) && seen.add(el.dataset.hd)); }
  function show(i) {
    idx = (i + items.length) % items.length; const el = items[idx], src = el.dataset.hd;
    stage.classList.remove('z'); stage.innerHTML = '';
    if (/\.mp4$/i.test(src)) { const v = document.createElement('video'); v.src = src; v.controls = true; v.autoplay = true; v.loop = true; v.playsInline = true; stage.appendChild(v); }
    else { const im = new Image(); im.src = src; im.alt = el.dataset.title || ''; im.addEventListener('click', toggleZoom); stage.appendChild(im); }
    title.innerHTML = (el.dataset.title || '') + (el.dataset.size ? `<small>${el.dataset.size}</small>` : '');
    cnt.textContent = `${idx + 1} / ${items.length}`; dl.href = src; dl.setAttribute('download', src.split('/').pop());
  }
  function toggleZoom(e) {
    const im = stage.querySelector('img'); if (!im) return;
    if (stage.classList.contains('z')) { stage.classList.remove('z'); return; }
    const r = im.getBoundingClientRect(), fx = e && e.clientX ? (e.clientX - r.left) / r.width : .5, fy = e && e.clientY ? (e.clientY - r.top) / r.height : .5;
    stage.classList.add('z');
    stage.scrollLeft = im.naturalWidth * fx - stage.clientWidth / 2; stage.scrollTop = im.naturalHeight * fy - stage.clientHeight / 2;
  }
  function open(el) { collect(); show(items.findIndex(x => x.dataset.hd === el.dataset.hd)); lb.classList.add('on'); document.body.style.overflow = 'hidden'; }
  function close() { lb.classList.remove('on'); stage.innerHTML = ''; document.body.style.overflow = ''; }

  // arrastrar para mover cuando hay zoom
  let drag = null;
  stage.addEventListener('pointerdown', e => { if (!stage.classList.contains('z')) return; drag = { x: e.clientX, y: e.clientY, l: stage.scrollLeft, t: stage.scrollTop, m: false }; });
  stage.addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (Math.abs(dx) + Math.abs(dy) > 4) drag.m = true; stage.scrollLeft = drag.l - dx; stage.scrollTop = drag.t - dy; });
  stage.addEventListener('pointerup', () => { setTimeout(() => drag = null, 0); });
  stage.addEventListener('click', e => { if (drag && drag.m) e.stopPropagation(); }, true);

  lb.querySelector('.lb-x').onclick = close;
  lb.querySelector('.lb-zb').onclick = () => toggleZoom();
  lb.querySelector('.lb-p').onclick = () => show(idx - 1);
  lb.querySelector('.lb-n').onclick = () => show(idx + 1);
  document.addEventListener('keydown', e => { if (!lb.classList.contains('on')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') show(idx - 1); if (e.key === 'ArrowRight') show(idx + 1); });
  document.addEventListener('click', e => { const el = e.target.closest('[data-hd]'); if (el && !lb.contains(el)) { e.preventDefault(); open(el); } });
  collect();
})();
