/* ================= GALACTIC MAP ================= */
const PBASE = 132;
const MAP = (() => {
  let root, cv, ctx, svg, nodeLayer, labelLayer, regionLayer, sheet, coordsEl, mini, miniCtx, hintEl;
  let W = 0, H = 0, dpr = 1;
  const cam = { x: WORLD.w / 2, y: WORLD.h / 2, s: .3 };
  let target = null, minS = .2, maxS = 2.4, sel = null, dirty = true, running = false, built = false, visible = false;
  let neb, starL = [], galaxies = [], dust = [], nextBtn = null, vigC = null, frameN = 0, miniN = 0, c0 = null, lastBg = 0, wasMoving = false, shoot = null, fcv, fctx, fdpr = 1;
  const nodes = {}, labels = {}, routes = [];
  const toScreen = (x, y) => [(x - cam.x) * cam.s + W / 2, (y - cam.y) * cam.s + H / 2];
  const toWorld = (x, y) => [(x - W / 2) / cam.s + cam.x, (y - H / 2) / cam.s + cam.y];

  function buildNebula() {
    const NW = 1200, NH = 850, c = document.createElement("canvas"); c.width = NW; c.height = NH;
    const g = c.getContext("2d"), r = rng(77);
    g.fillStyle = "#02030a"; g.fillRect(0, 0, NW, NH);
    const blob = (x, y, rad, col, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, col.replace("A", a)); gr.addColorStop(1, col.replace("A", 0)); g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2); };
    g.globalCompositeOperation = "lighter";
    // galactic core glow + spiral arms
    blob(NW * .5, NH * .48, 380, "rgba(255,200,150,A)", .2);
    blob(NW * .5, NH * .48, 160, "rgba(255,230,200,A)", .28);
    for (let arm = 0; arm < 2; arm++) for (let i = 0; i < 260; i++) {
      const t = i / 260, ang = arm * Math.PI + t * 3.6, rad = 40 + t * 520;
      const x = NW * .5 + Math.cos(ang) * rad * 1.15 + (r() - .5) * 90 * t, y = NH * .48 + Math.sin(ang) * rad * .72 + (r() - .5) * 70 * t;
      const hue = [["rgba(120,170,255,A)"], ["rgba(190,120,255,A)"], ["rgba(255,140,200,A)"], ["rgba(100,220,230,A)"]][Math.floor(r() * 4)][0];
      blob(x, y, 30 + r() * 70, hue, .045 + r() * .04);
    }
    // big nebulae
    const NEB = [[.17, .3, "rgba(140,90,255,A)"], [.82, .25, "rgba(70,180,255,A)"], [.86, .7, "rgba(255,150,90,A)"], [.24, .78, "rgba(60,220,170,A)"], [.5, .12, "rgba(255,110,180,A)"], [.06, .52, "rgba(90,120,255,A)"]];
    for (const [nx, ny, col] of NEB) for (let i = 0; i < 26; i++) blob(NW * nx + (r() - .5) * 220, NH * ny + (r() - .5) * 160, 50 + r() * 130, col, .03 + r() * .05);
    // dust lanes
    g.globalCompositeOperation = "source-over";
    { // dust lanes drawn small, then upscaled once = cheap blur
      const dc = document.createElement("canvas"); dc.width = NW / 6; dc.height = NH / 6; const dg = dc.getContext("2d");
      for (let i = 0; i < 900; i++) { const t = r(), ang = t * 6.4, rad = 60 + t * 480; const x = NW * .5 + Math.cos(ang + .5) * rad * 1.15 + (r() - .5) * 60, y = NH * .48 + Math.sin(ang + .5) * rad * .72 + (r() - .5) * 40; dg.fillStyle = `rgba(0,0,6,${.025 + r() * .045})`; dg.beginPath(); dg.arc(x / 6, y / 6, (4 + r() * 10) / 6, 0, 7); dg.fill(); }
      g.imageSmoothingQuality = "high"; g.drawImage(dc, 0, 0, NW, NH);
    }
    g.globalCompositeOperation = "lighter";
    for (let i = 0; i < 2600; i++) { const x = r() * NW, y = r() * NH, a = r() * r() * .9; g.fillStyle = `rgba(${200 + r() * 55 | 0},${200 + r() * 55 | 0},255,${a})`; g.fillRect(x, y, r() > .97 ? 1.6 : .8, r() > .97 ? 1.6 : .8); }
    { // bake distant galaxies + galactic grid into the texture (drawn once, not every frame)
      const k = NW / WORLD.w; g.globalCompositeOperation = "lighter";
      for (const [x, y, rr, rot] of [[160, 1500, 60, 25], [2200, 150, 70, -30], [2280, 1580, 45, 60], [1050, 80, 40, 10]]) drawGalaxy(g, x * k, y * k, rr * k * 2.2, rot);
      g.globalCompositeOperation = "source-over"; g.strokeStyle = "rgba(120,170,255,.07)"; g.lineWidth = 1; g.beginPath();
      for (let x = 0; x <= WORLD.w; x += 200) { g.moveTo(x * k, 0); g.lineTo(x * k, NH); }
      for (let y = 0; y <= WORLD.h; y += 200) { g.moveTo(0, y * k); g.lineTo(NW, y * k); }
      g.stroke();
    }
    g.globalCompositeOperation = "destination-in";
    const fx = g.createLinearGradient(0, 0, NW, 0); fx.addColorStop(0, "rgba(0,0,0,0)"); fx.addColorStop(.12, "#000"); fx.addColorStop(.88, "#000"); fx.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = fx; g.fillRect(0, 0, NW, NH);
    const fy = g.createLinearGradient(0, 0, 0, NH); fy.addColorStop(0, "rgba(0,0,0,0)"); fy.addColorStop(.14, "#000"); fy.addColorStop(.86, "#000"); fy.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = fy; g.fillRect(0, 0, NW, NH);
    g.globalCompositeOperation = "source-over";
    neb = c;
    // parallax starfield layers (screen-space tiles)
    starL = [.15, .35, .6].map((depth, li) => { const n = [260, 160, 70][li], arr = []; for (let i = 0; i < n; i++) arr.push({ x: r() * 2000, y: r() * 2000, s: (li + 1) * (.5 + r() * .7), tw: r() * 6.28, c: r() > .85 ? (r() > .5 ? "#ffd9b0" : "#b0d0ff") : "#fff" }); return { depth, arr }; });
    galaxies = [];
    dust = Array.from({ length: 50 }, () => ({ x: r() * WORLD.w, y: r() * WORLD.h, r: 1 + r() * 2, v: .2 + r() * .4, a: r() * 6.28 }));
  }
  function drawGalaxy(g, x, y, rad, rot) {
    g.save(); g.translate(x, y); g.rotate(rot * Math.PI / 180); g.scale(1, .45);
    const gr = g.createRadialGradient(0, 0, 0, 0, 0, rad); gr.addColorStop(0, "rgba(255,240,220,.55)"); gr.addColorStop(.25, "rgba(200,180,255,.22)"); gr.addColorStop(1, "rgba(120,140,255,0)");
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, rad, 0, 7); g.fill();
    g.strokeStyle = "rgba(200,210,255,.18)"; g.lineWidth = rad * .08;
    for (let a = 0; a < 2; a++) { g.beginPath(); for (let t = 0; t < 1; t += .02) { const an = a * Math.PI + t * 5, rr = t * rad; g.lineTo(Math.cos(an) * rr, Math.sin(an) * rr); } g.stroke(); }
    g.restore();
  }
  function drawFx(time) {
    const g = fctx; g.setTransform(fdpr, 0, 0, fdpr, 0, 0); g.clearRect(0, 0, W, H);
    if (!LITE()) {
      g.fillStyle = "rgba(200,220,255,.35)";
      for (const d of dust) { d.a += .004; const [sx, sy] = toScreen(d.x + Math.cos(d.a) * 30, d.y + Math.sin(d.a * .7) * 20); if (sx < -10 || sy < -10 || sx > W + 10 || sy > H + 10) continue; g.globalAlpha = .25 + .2 * Math.sin(d.a * 3); g.beginPath(); g.arc(sx, sy, d.r * Math.max(.6, cam.s * 1.4), 0, 7); g.fill(); }
      g.globalAlpha = 1;
    }
    drawShips(g, time);
    // shooting stars
    if (!shoot && Math.random() < .004) shoot = { x: Math.random() * W, y: Math.random() * H * .5, a: .5 + Math.random() * .5, t0: time };
    if (shoot) {
      const k = (time - shoot.t0) / 900; if (k > 1) shoot = null; else {
        const len = 140, x = shoot.x + Math.cos(shoot.a) * k * 360, y = shoot.y + Math.sin(shoot.a) * k * 360, gr = g.createLinearGradient(x, y, x - Math.cos(shoot.a) * len, y - Math.sin(shoot.a) * len);
        gr.addColorStop(0, `rgba(255,255,255,${1 - k})`); gr.addColorStop(1, "rgba(255,255,255,0)"); g.strokeStyle = gr; g.lineWidth = 1.6; g.beginPath(); g.moveTo(x, y); g.lineTo(x - Math.cos(shoot.a) * len, y - Math.sin(shoot.a) * len); g.stroke();
      }
    }
  }
  function draw(time) {
    const g = ctx; g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = "#02030a"; g.fillRect(0, 0, W, H);
    const [x0, y0] = toScreen(0, 0);
    g.drawImage(neb, x0, y0, WORLD.w * cam.s, WORLD.h * cam.s);
    // parallax stars
    for (const L of starL) {
      const ox = -cam.x * cam.s * L.depth, oy = -cam.y * cam.s * L.depth;
      for (const st of L.arr) {
        let x = ((st.x + ox) % 2000 + 2000) % 2000, y = ((st.y + oy) % 2000 + 2000) % 2000;
        if (x > W + 4 || y > H + 4) continue;
        const a = .45 + .55 * Math.abs(Math.sin(st.tw));
        g.globalAlpha = a * (.5 + L.depth); g.fillStyle = st.c; g.fillRect(x, y, st.s, st.s);
      }
    }
    g.globalAlpha = 1;
    const step = 200;
    if (cam.s > .45) { g.fillStyle = "rgba(140,180,255,.22)"; g.font = "9px Orbitron, sans-serif"; for (let x = 0; x < WORLD.w; x += step) for (let y = 0; y < WORLD.h; y += step) { const [a, b] = toScreen(x, y); if (a > -20 && a < W && b > -20 && b < H) g.fillText(String.fromCharCode(65 + x / step) + "-" + (y / step + 1), a + 4, b + 11); } }
    // vignette
    if (!vigC || vigC.width !== Math.round(W / 4)) { vigC = document.createElement("canvas"); vigC.width = Math.round(W / 4); vigC.height = Math.round(H / 4); const vg2 = vigC.getContext("2d"), w4 = vigC.width, h4 = vigC.height, vg = vg2.createRadialGradient(w4 / 2, h4 / 2, Math.min(w4, h4) * .35, w4 / 2, h4 / 2, Math.max(w4, h4) * .75); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,.55)"); vg2.fillStyle = vg; vg2.fillRect(0, 0, w4, h4); }
    g.drawImage(vigC, 0, 0, W, H);
  }
  function bez(a, b, bend, t) {
    const A = LAYOUT[a], B = LAYOUT[b], mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2, dx = B.x - A.x, dy = B.y - A.y, cx = mx - dy * bend, cy = my + dx * bend, u = 1 - t;
    return [u * u * A.x + 2 * u * t * cx + t * t * B.x, u * u * A.y + 2 * u * t * cy + t * t * B.y];
  }
  function ship(g, x, y, ang, sc, col, alpha) {
    g.save(); g.translate(x, y); g.rotate(ang); g.scale(sc, sc); g.globalAlpha = alpha;
    const tr = g.createLinearGradient(-38, 0, -6, 0); tr.addColorStop(0, "rgba(120,200,255,0)"); tr.addColorStop(1, col);
    g.fillStyle = tr; g.fillRect(-38, -1.6, 32, 3.2);
    g.fillStyle = "#e8eef8"; g.beginPath(); g.moveTo(10, 0); g.lineTo(-6, -6); g.lineTo(-3, 0); g.lineTo(-6, 6); g.closePath(); g.fill();
    g.fillStyle = col; g.beginPath(); g.arc(-4, 0, 2.2, 0, 7); g.fill();
    g.restore(); g.globalAlpha = 1;
  }
  function drawShips(g, time) {
    const nx = nextPlanet(), from = nx && ORDER[ORDER.indexOf(nx) - 1];
    const sc = clamp(cam.s * 1.4, .55, 1.6);
    if (nx && from && S.visited[from]) {
      const r = routes.find(q => q.a === from && q.b === nx), bend = r ? r.bend : 0, t = (time % 4200) / 4200;
      const [x, y] = bez(from, nx, bend, t), [x2, y2] = bez(from, nx, bend, Math.min(1, t + .01));
      const [sx, sy] = toScreen(x, y), [sx2, sy2] = toScreen(x2, y2);
      ship(g, sx, sy, Math.atan2(sy2 - sy, sx2 - sx), sc, "#ffd98a", t < .1 ? t * 10 : t > .9 ? (1 - t) * 10 : 1);
    } else if (nx) {
      const L = LAYOUT[nx], a = time * .0009, R = L.r * 1.9;
      const [sx, sy] = toScreen(L.x + Math.cos(a) * R, L.y + Math.sin(a) * R * .55);
      ship(g, sx, sy, a + Math.PI / 2, sc, "#ffd98a", 1);
    }
    // ambient traffic
    for (let k = 0; k < 3; k++) {
      const r = routes[(k * 4 + 1) % LANE_EDGES.length]; if (!r) continue;
      const t = ((time * .00006 + k * .37) % 1), back = k % 2;
      const tt = back ? 1 - t : t, [x, y] = bez(r.a, r.b, r.bend, tt), [x2, y2] = bez(r.a, r.b, r.bend, clamp(tt + (back ? -.01 : .01), 0, 1));
      const [sx, sy] = toScreen(x, y), [sx2, sy2] = toScreen(x2, y2);
      ship(g, sx, sy, Math.atan2(sy2 - sy, sx2 - sx), sc * .6, "#7fd6ff", .55);
    }
  }
  function planetScreenSize(pid) { const r = LAYOUT[pid].r; return clamp(r * 2 * cam.s, 30, 200); }
  function place() {
    // regions
    for (const el of regionLayer.children) { const [x, y] = toScreen(+el.dataset.x, +el.dataset.y); el.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%) scale(${clamp(cam.s * 2.4, .7, 1.6)})`; el.style.opacity = cam.s < 1.1 ? 1 : clamp(1.6 - cam.s * .9, 0, 1); }
    const rects = [];
    const order = ORDER.slice().sort((a, b) => prio(b) - prio(a));
    for (const pid of ORDER) {
      const L = LAYOUT[pid], [x, y] = toScreen(L.x, L.y), d = planetScreenSize(pid), n = nodes[pid];
      const k = d / PBASE;
      n.style.transform = `translate(${x - PBASE / 2}px,${y - PBASE / 2}px) scale(${k})`;
      const inv = (1 / k).toFixed(3); if (n._inv !== inv) { n._inv = inv; n.style.setProperty("--inv", inv); }
      labels[pid]._pos = [x, y + d / 2 + 8];
    }
    for (const pid of order) {
      const lb = labels[pid], [x, y] = lb._pos;
      lb.style.transform = `translate(${x}px,${y}px) translate(-50%,0)`;
      const w = lb._w || (lb._w = lb.offsetWidth || 90), hh = lb._h || (lb._h = lb.offsetHeight || 34);
      const r = [x - w / 2, y, x + w / 2, y + hh];
      // also avoid covering other planets
      let hit = rects.some(q => r[0] < q[2] && r[2] > q[0] && r[1] < q[3] && r[3] > q[1]);
      if (!hit) for (const o of ORDER) { if (o === pid) continue; const [ox, oy] = toScreen(LAYOUT[o].x, LAYOUT[o].y), od = planetScreenSize(o) / 2; if (ox + od > r[0] && ox - od < r[2] && oy + od > r[1] && oy - od < r[3]) { hit = prio(o) >= prio(pid); if (hit) break; } }
      if (hit && pid !== sel) lb.setAttribute("data-hide", ""); else { lb.removeAttribute("data-hide"); rects.push(r); }
    }
    // routes
    for (const rt of routes) {
      const A = LAYOUT[rt.a], B = LAYOUT[rt.b], [ax, ay] = toScreen(A.x, A.y), [bx, by] = toScreen(B.x, B.y);
      const mx = (ax + bx) / 2, my = (ay + by) / 2, dx = bx - ax, dy = by - ay, k = rt.bend;
      const d = `M${ax},${ay} Q${mx - dy * k},${my + dx * k} ${bx},${by}`;
      rt.el.setAttribute("d", d); if (rt.on) rt.on.setAttribute("d", d);
    }
    const [wx, wy] = [cam.x, cam.y];
    coordsEl.innerHTML = `Coord ${String.fromCharCode(65 + clamp(Math.floor(wx / 200), 0, 25))}-${clamp(Math.floor(wy / 200) + 1, 1, 99)}<br>Zoom ×${(cam.s / minS).toFixed(1)}`;
    if (!(target || vel.active || ptrs.size) || (++miniN % 8) === 0) drawMini();
  }
  function prio(pid) { return (pid === sel ? 100 : 0) + (pid === nextPlanet() ? 50 : 0) + (S.visited[pid] ? 5 : 0) + LAYOUT[pid].r / 10; }
  function drawMini() {
    if (!mini) return; const g = miniCtx, mw = mini.width, mh = mini.height;
    g.clearRect(0, 0, mw, mh); g.drawImage(neb, 0, 0, mw, mh);
    for (const pid of ORDER) { const L = LAYOUT[pid]; g.fillStyle = S.visited[pid] ? LOOK[pid].atm : "rgba(255,255,255,.45)"; g.beginPath(); g.arc(L.x / WORLD.w * mw, L.y / WORLD.h * mh, pid === sel ? 4 : 2.4, 0, 7); g.fill(); }
    const [ax, ay] = toWorld(0, 0), [bx, by] = toWorld(W, H);
    g.strokeStyle = "rgba(255,217,138,.9)"; g.lineWidth = 1.5; g.strokeRect(ax / WORLD.w * mw, ay / WORLD.h * mh, (bx - ax) / WORLD.w * mw, (by - ay) / WORLD.h * mh);
  }
  function fitScale() { return Math.min(W / (WORLD.w * .92), H / (WORLD.h * .78)); }
  function clampCam() {
    cam.s = clamp(cam.s, minS, maxS);
    const mx = WORLD.w * .15, my = WORLD.h * .15;
    cam.x = clamp(cam.x, -mx, WORLD.w + mx); cam.y = clamp(cam.y, -my, WORLD.h + my);
  }
  function flyTo(x, y, s, dur = 900, done) {
    if (reduced()) dur = 1;
    target = { fx: cam.x, fy: cam.y, fs: cam.s, x, y, s: clamp(s, minS, maxS), t0: performance.now(), dur, done };
    kick();
  }
  function loop(t) {
    if (!visible) { running = false; return; }
    if (target) {
      const k = clamp((t - target.t0) / target.dur, 0, 1), e = easeInOut(k);
      // zoom out a bit mid-flight for a cinematic arc
      const arc = Math.sin(k * Math.PI) * .25 * Math.min(target.fs, target.s);
      cam.x = lerp(target.fx, target.x, e); cam.y = lerp(target.fy, target.y, e); cam.s = lerp(target.fs, target.s, e) - arc;
      if (k >= 1) { const d = target.done; target = null; d && d(); }
      dirty = true;
    } else if (vel.active) {
      cam.x -= vel.x / cam.s; cam.y -= vel.y / cam.s; vel.x *= .92; vel.y *= .92;
      if (Math.abs(vel.x) + Math.abs(vel.y) < .2) vel.active = false; clampCam(); dirty = true;
    }
    const moving = !!(target || vel.active || ptrs.size);
    if (wasMoving && !moving) dirty = true; wasMoving = moving;
    if (moving || dirty) {
      // while moving, let the GPU move the last drawn image; repaint only now and then
      const k = c0 ? cam.s / c0.s : 1, tx = c0 ? (c0.x - cam.x) * cam.s : 0, ty = c0 ? (c0.y - cam.y) * cam.s : 0;
      if (!moving || !c0 || t - lastBg > 220 || k < .85 || k > 1.25 || Math.abs(tx) > W * .3 || Math.abs(ty) > H * .3) { draw(t); c0 = { x: cam.x, y: cam.y, s: cam.s }; lastBg = t; cv.style.transform = ""; }
      else cv.style.transform = `translate(${tx}px,${ty}px) scale(${k})`;
    }
    if (moving || (++frameN % (LITE() ? 2 : 1)) === 0) drawFx(t);
    if (dirty) { place(); dirty = false; }
    requestAnimationFrame(loop);
  }
  function kick() { dirty = true; if (!running && visible) { running = true; requestAnimationFrame(loop); } }

  /* ---------- gestures ---------- */
  const ptrs = new Map(); let pinch = null, drag = null, moved = 0, lastTap = 0; const vel = { x: 0, y: 0, active: false };
  function onDown(e) {
    if (e.target.closest(".map-ui")) return;
    root.setPointerCapture && root.setPointerCapture(e.pointerId);
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY, t: performance.now() }); target = null; vel.active = false;
    if (ptrs.size === 1) { drag = { x: e.clientX, y: e.clientY, node: e.target.closest(".pnode") }; moved = 0; root.classList.add("dragging"); }
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), s: cam.s, w: toWorld((a.x + b.x) / 2, (a.y + b.y) / 2) }; drag = null; }
  }
  function onMove(e) {
    if (!ptrs.has(e.pointerId)) return;
    const p = ptrs.get(e.pointerId), dx = e.clientX - p.x, dy = e.clientY - p.y, now = performance.now();
    p.x = e.clientX; p.y = e.clientY;
    if (pinch && ptrs.size >= 2) {
      const [a, b] = [...ptrs.values()], d = Math.hypot(a.x - b.x, a.y - b.y), mxp = (a.x + b.x) / 2, myp = (a.y + b.y) / 2;
      cam.s = clamp(pinch.s * d / pinch.d, minS, maxS);
      cam.x = pinch.w[0] - (mxp - W / 2) / cam.s; cam.y = pinch.w[1] - (myp - H / 2) / cam.s; clampCam(); moved += 10; kick();
    } else if (drag) {
      moved += Math.abs(dx) + Math.abs(dy);
      if (moved > 6) { cam.x -= dx / cam.s; cam.y -= dy / cam.s; clampCam(); const dt = Math.max(1, now - p.t); vel.x = dx * 16 / dt; vel.y = dy * 16 / dt; kick(); }
      p.t = now;
    }
  }
  function onUp(e) {
    if (!ptrs.has(e.pointerId)) return;
    ptrs.delete(e.pointerId);
    if (ptrs.size < 2) pinch = null;
    if (ptrs.size === 0) {
      root.classList.remove("dragging");
      if (drag && moved <= 6) {
        const now = performance.now();
        if (drag.node) select(drag.node.dataset.id);
        else if (now - lastTap < 320) { const [wx, wy] = toWorld(e.clientX, e.clientY); flyTo(wx, wy, cam.s * 1.8, 450); }
        else if (sel) deselect();
        lastTap = now;
      } else if (drag && (Math.abs(vel.x) + Math.abs(vel.y) > 1)) { vel.active = true; kick(); }
      drag = null;
    }
  }
  function onWheel(e) {
    e.preventDefault();
    const f = Math.exp(-e.deltaY * (e.ctrlKey ? .01 : .0018)), w = toWorld(e.clientX, e.clientY);
    cam.s = clamp(cam.s * f, minS, maxS); cam.x = w[0] - (e.clientX - W / 2) / cam.s; cam.y = w[1] - (e.clientY - H / 2) / cam.s; clampCam(); target = null; kick();
  }
  function zoomBy(f) { flyTo(cam.x, cam.y, cam.s * f, 350); SFX.tap(); }

  /* ---------- selection & sheet ---------- */
  function select(pid) {
    if (!planetUnlocked(pid)) {
      SFX.bad(); droidSay(`Esa señal está cifrada. Visita ${10 - visitedCount() > 0 ? 10 - visitedCount() + " planeta" + (10 - visitedCount() > 1 ? "s" : "") + " más" : "más planetas"} y la ruta se revelará.`);
      return;
    }
    sel = pid; SFX.select();
    for (const id in nodes) nodes[id].toggleAttribute("data-sel", id === pid);
    const L = LAYOUT[pid], s = clamp(46 / L.r, minS * 2.2, 1.1);
    droidBubble && droidBubble.remove();
    const land = W > H && H < 560, oy = land ? 0 : 150 / s, ox = land ? 180 / s : 0; // keep planet clear of the sheet
    flyTo(L.x + ox, L.y + oy, s, 900);
    fillSheet(pid); sheet.setAttribute("data-open", ""); root.classList.add("has-sel"); root.classList.add("sheet-open"); document.body.classList.add("sheet-open");
    kick();
  }
  function deselect() {
    sel = null; for (const id in nodes) nodes[id].removeAttribute("data-sel");
    sheet.removeAttribute("data-open"); root.classList.remove("sheet-open", "has-sel"); document.body.classList.remove("sheet-open"); kick();
  }
  function fillSheet(pid) {
    const p = P[pid], L = LAYOUT[pid], ls = lettersOf(pid), un = unlockedSet(), got = ls.filter(l => un.has(l.id)).length, read = ls.filter(l => S.readLetters.includes(l.id)).length;
    const ms = MISSIONS[pid] || [], md = ms.filter(m => flag(m.flag)).length;
    sheet.replaceChildren(
      h("div", { class: "corners" }, h("i"), h("i"), h("i"), h("i")),
      h("button", { class: "x", "aria-label": "Cerrar", onclick: deselect }, "✕"),
      h("div", { class: "sector" }, `${L.region} · ${L.sector}`),
      h("div", { class: "sheet-h" }, h("div", { class: "mini" }, planetEl(pid, 62, { revealed: true })), h("div", { class: "grow" }, h("h2", null, p.name), h("p", null, p.tagline))),
      h("p", { class: "m-note", style: { fontSize: "13.5px", margin: 0 } }, p.description),
      h("div", { class: "sheet-stats" },
        h("div", { class: "stat" }, h("b", null, `${got}`), h("span", null, got === 1 ? "Carta" : "Cartas")),
        h("div", { class: "stat" }, h("b", null, `${read}`), h("span", null, "Leídas")),
        h("div", { class: "stat" }, h("b", null, `${md}/${ms.length}`), h("span", null, "Misiones"))),
      h("div", { class: "sheet-actions" },
        h("button", { class: "btn btn--primary", onclick: () => land(pid) }, S.visited[pid] ? "Viajar al planeta" : "Saltar al hiperespacio"),
        h("button", { class: "btn btn--icon", "aria-label": "Ver cartas de " + p.name, title: "Cartas", onclick: () => go("letters", { planet: pid }) }, icon("cards")))
    );
    sheet.querySelectorAll(".btn--icon svg").forEach(s => { s.setAttribute("width", 22); s.setAttribute("height", 22); s.style.cssText = "fill:none;stroke:currentColor;stroke-width:1.8"; });
  }
  function land(pid) {
    SFX.jump();
    hyperspace(() => { deselect(); go("planet", { id: pid }); });
  }
  function fitAll(dur = 900) { deselect(); flyTo(WORLD.w / 2, WORLD.h / 2 - 20, fitScale(), dur); SFX.tap(); }
  function centerOn() { const pid = sel || S.lastPlanet || nextPlanet() || "naboo"; if (sel) { const L = LAYOUT[pid], land = W > H && H < 560; flyTo(L.x + (land ? 180 / cam.s : 0), L.y + (land ? 0 : 150 / cam.s), cam.s, 500); } else select(pid); }

  function resize() {
    if (!cv) return;
    W = root.clientWidth || innerWidth; dpr = Math.min(LITE() ? 1.25 : (W * (root.clientHeight || innerHeight) > 600000 ? 1.25 : 1.5), window.devicePixelRatio || 1); H = root.clientHeight || innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; fdpr = Math.min(LITE() ? 1 : 1.5, window.devicePixelRatio || 1); fcv.width = W * fdpr; fcv.height = H * fdpr; minS = fitScale() * .85; maxS = Math.max(1.8, minS * 9);
    clampCam(); for (const id in labels) labels[id]._w = 0; kick();
  }
  function refresh() {
    if (!built) return; const nx = nextPlanet();
    for (const pid of ORDER) {
      const n = nodes[pid], lb = labels[pid], ms = MISSIONS[pid] || [], done = ms.length && ms.every(m => flag(m.flag));
      n.toggleAttribute("data-next", pid === nx); n.toggleAttribute("data-locked", !planetUnlocked(pid));
      lb.toggleAttribute("data-next", pid === nx); lb.toggleAttribute("data-done", !!done);
      const un = unlockedSet(), ls = lettersOf(pid), got = ls.filter(l => un.has(l.id)).length;
      lb.querySelector("small").textContent = !planetUnlocked(pid) ? "Se revela al visitar 10" : pid === nx ? (S.visited[pid] ? "▶ Sigue aquí" : "▶ Ve aquí") : done ? "Completado ✓" : S.visited[pid] ? nCartas(got) : "";
      lb.querySelector("b").textContent = `${ORDER.indexOf(pid) + 1} · ` + (planetUnlocked(pid) ? P[pid].name : "¿?");
      n.querySelector(".numtag").textContent = ORDER.indexOf(pid) + 1;
      lb._w = 0;
      const lockedRoute = routes.filter(r => r.a === pid || r.b === pid);
      for (const r of lockedRoute) r.el.style.opacity = planetUnlocked(r.a) && planetUnlocked(r.b) ? 1 : .25;
    }
    for (const r of routes) {
      if (!r.on) continue;
      const doneA = S.visited[r.a], doneB = S.visited[r.b], isNext = r.b === nx && doneA;
      r.on.style.display = (doneA && doneB) || isNext ? "" : "none";
      r.on.setAttribute("class", "route " + (isNext ? "route-next" : "route-on"));
    }
    if (nextBtn) { nextBtn.style.display = nx ? "" : "none"; if (nx) nextBtn.querySelector("b").textContent = `${ORDER.indexOf(nx) + 1} · ${P[nx].name}`, nextBtn.querySelector("small").textContent = S.visited[nx] ? "Te quedan misiones aquí" : visitedCount() ? "Siguiente parada del viaje" : "Empieza tu viaje aquí"; }
    if (sel) fillSheet(sel);
    kick();
  }

  function build() {
    root = h("div", { class: "map", role: "application", "aria-label": "Mapa galáctico. Arrastra para moverte, pellizca para acercar." });
    cv = h("canvas"); ctx = cv.getContext("2d", { alpha: false }); fcv = h("canvas", { class: "fx" }); fctx = fcv.getContext("2d");
    svg = s("svg", { class: "map-svg" });
    regionLayer = h("div", { class: "layer", style: { position: "absolute", inset: 0, pointerEvents: "none" } });
    for (const R of REGIONS) regionLayer.append(h("div", { class: "region", "data-x": R.x, "data-y": R.y, style: { left: 0, top: 0 } }, R.t, h("small", null, R.s)));
    nodeLayer = h("div", { style: { position: "absolute", inset: 0 } });
    labelLayer = h("div", { style: { position: "absolute", inset: 0, pointerEvents: "none" } });
    // routes
    const g1 = s("g"), g2 = s("g"), g3 = s("g");
    LANE_EDGES.forEach(([a, b], i) => { const el = s("path", { class: "route route-base" }), on = s("path", { class: "route route-on" }); g1.append(el); g2.append(on); routes.push({ a, b, el, on, bend: ((i % 2) ? .08 : -.08) }); });
    for (const e of DATA.effects) for (const f of e.requires) { const a = f.split(".")[0], b = e.effect.planet; if (a !== b && !routes.some(r => (r.a === a && r.b === b) || (r.a === b && r.b === a))) { const el = s("path", { class: "route route-link" }); g3.append(el); routes.push({ a, b, el, bend: .22, link: e }); } }
    svg.append(g3, g1, g2);
    for (const pid of ORDER) {
      const L = LOOK[pid];
      const n = h("button", { class: "pnode", "data-id": pid, "aria-label": P[pid].name + ": " + P[pid].tagline, style: { "--atm": L.atm } },
        h("div", { class: "halo" }),
        planetEl(pid, PBASE),
        h("span", { class: "numtag", "aria-hidden": "true" }),
        h("span", { class: "nextflag", "aria-hidden": "true" }, "▼"),
        h("div", { class: "reticle", html: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,217,138,.75)" stroke-width="1" stroke-dasharray="3 5"/><path d="M50 0v10M50 90v10M0 50h10M90 50h10" stroke="#ffd98a" stroke-width="2"/><path d="M14 14l8 8M86 14l-8 8M14 86l8-8M86 86l-8-8" stroke="rgba(255,217,138,.6)" stroke-width="1.5"/></svg><div class="pulse"></div>` }));
      n.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(pid); } });
      n.addEventListener("click", e => { if (e.detail === 0) select(pid); }); // keyboard activation
      n.style.width = n.style.height = PBASE + "px"; n.style.transformOrigin = "50% 50%";
      nodes[pid] = n; nodeLayer.append(n);
      const lb = h("div", { class: "plabel" }, h("b", null, P[pid].name), h("small", null, ""));
      labels[pid] = lb; labelLayer.append(lb);
    }
    // UI
    const ui = h("div", { class: "map-ui" });
    const head = h("div", { class: "map-head" },
      h("div", { class: "map-title", onclick: () => adminTap() }, h("h1", null, "Mapa Galáctico"), h("p", null, `Archivo de las estrellas perdidas · ${herName()}`)),
      langToggle("langsw--map"),
      h("button", { class: "mtool", "aria-label": "Ayuda: cómo funciona", onclick: () => openHelp() }, h("span", { style: { font: "700 20px var(--f-display)" } }, "?")),
      h("button", { class: "mtool", "aria-label": "Opciones", onclick: () => go("settings") }, icon("gear")));
    nextBtn = h("button", { class: "nextbtn holo", onclick: () => { const nx = nextPlanet(); if (nx) select(nx); } }, h("span", { class: "nb-ic" }, "▶"), h("span", { class: "nb-t" }, h("small"), h("b")));
    coordsEl = h("div", { class: "coords" });
    const tools = h("div", { class: "map-tools" },
      h("button", { class: "mtool", "aria-label": "Acercar", onclick: () => zoomBy(1.6) }, icon("plus")),
      h("button", { class: "mtool", "aria-label": "Alejar", onclick: () => zoomBy(1 / 1.6) }, icon("minus")),
      h("button", { class: "mtool", "aria-label": "Centrar el mapa", title: "Centrar", onclick: centerOn }, icon("target")),
      h("button", { class: "mtool", "aria-label": "Volver a la galaxia", title: "Toda la galaxia", onclick: () => fitAll() }, icon("galaxy")));
    mini = h("canvas", { width: 208, height: 148 }); miniCtx = mini.getContext("2d");
    const miniWrap = h("div", { class: "minimap", "aria-hidden": "true" }, mini);
    miniWrap.addEventListener("pointerdown", e => { const r = miniWrap.getBoundingClientRect(); flyTo((e.clientX - r.left) / r.width * WORLD.w, (e.clientY - r.top) / r.height * WORLD.h, cam.s, 500); });
    sheet = h("div", { class: "sheet holo", role: "dialog", "aria-label": "Planeta seleccionado" });
    hintEl = h("div", { class: "map-hint" }, "Toca un planeta · pellizca para acercar");
    ui.append(head, nextBtn, coordsEl, tools, miniWrap, hintEl, sheet);
    root.append(cv, fcv, svg, regionLayer, nodeLayer, labelLayer, ui);
    root.addEventListener("pointerdown", onDown); root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerup", onUp); root.addEventListener("pointercancel", onUp);
    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("keydown", e => { const k = e.key, st = 60 / cam.s; if (e.target.closest(".sheet")) return; if (k === "ArrowLeft") cam.x -= st; else if (k === "ArrowRight") cam.x += st; else if (k === "ArrowUp") cam.y -= st; else if (k === "ArrowDown") cam.y += st; else if (k === "+" || k === "=") return zoomBy(1.4); else if (k === "-") return zoomBy(1 / 1.4); else if (k === "Escape") return deselect(); else return; clampCam(); kick(); });
    window.addEventListener("resize", resize);
    if (window.visualViewport) visualViewport.addEventListener("resize", resize);
    buildNebula(); built = true;
    setTimeout(() => hintEl.style.opacity = 0, 6000);
    return root;
  }
  function show(container) {
    if (!built) container.append(build()); else if (!root.isConnected) container.append(root);
    root.style.display = ""; visible = true; resize();
    if (!show.once) {
      show.once = true; cam.s = fitScale() * .6; cam.x = WORLD.w / 2; cam.y = WORLD.h / 2;
      const portrait = H > W * 1.2, f = portrait ? Math.max(fitScale(), (H - 140) / (WORLD.h * 1.05)) : fitScale(), nx = LAYOUT[nextPlanet() || S.lastPlanet] || LAYOUT.naboo;
      flyTo(portrait ? clamp(nx.x, W / 2 / f - 100, WORLD.w - W / 2 / f + 100) : WORLD.w / 2, portrait ? WORLD.h / 2 + 30 : WORLD.h / 2 - 20, f, 1800);
    }
    refresh(); kick();
  }
  function hide() { visible = false; if (root) root.style.display = "none"; deselect && sel && deselect(); document.body.classList.remove("sheet-open"); }
  return { show, hide, refresh, select, fitAll, el: () => root };
})();

/* next destination suggestion */
function nextPlanet() {
  for (const pid of ORDER) { if (!planetUnlocked(pid)) continue; const ms = MISSIONS[pid] || []; if (!S.visited[pid] || ms.some(m => !flag(m.flag) && missionAvailable(m))) return pid; }
  return null;
}

/* ================= hyperspace effect ================= */
function hyperspace(mid) {
  if (reduced()) { mid(); return; }
  let el = $(".hyper"); if (!el) { el = h("div", { class: "hyper" }, h("canvas")); document.body.append(el, h("div", { class: "flash" })); }
  const cv = el.firstChild, g = cv.getContext("2d"), dpr = Math.min(2, devicePixelRatio || 1), W = innerWidth, H = innerHeight;
  cv.width = W * dpr; cv.height = H * dpr; g.scale(dpr, dpr);
  const st = Array.from({ length: 420 }, () => ({ a: Math.random() * 6.283, r: Math.random() * 40 + 2, v: Math.random() * .6 + .4, c: Math.random() > .7 ? "#bfe6ff" : "#ffffff" }));
  el.setAttribute("data-on", ""); const t0 = performance.now(), D = 1300; let called = false;
  (function fr(t) {
    const k = (t - t0) / D; g.fillStyle = `rgba(0,2,10,${k < .15 ? .35 : .25})`; g.fillRect(0, 0, W, H);
    const sp = k < .5 ? Math.pow(k * 2, 3) * 60 + 1 : 60, cx = W / 2, cy = H / 2;
    for (const p of st) {
      const r0 = p.r, r1 = p.r + sp * p.v * 2.4; p.r = r1 > Math.max(W, H) ? Math.random() * 30 + 2 : p.r + sp * p.v;
      g.strokeStyle = p.c; g.globalAlpha = clamp(r0 / 200, .15, 1); g.lineWidth = 1 + r0 / 400;
      g.beginPath(); g.moveTo(cx + Math.cos(p.a) * r0, cy + Math.sin(p.a) * r0); g.lineTo(cx + Math.cos(p.a) * r1, cy + Math.sin(p.a) * r1); g.stroke();
    }
    g.globalAlpha = 1;
    const gr = g.createRadialGradient(cx, cy, 0, cx, cy, Math.max(1, 160 * Math.min(1, k * 2))); gr.addColorStop(0, "rgba(180,220,255,.35)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    if (k > .72 && !called) { called = true; const f = $(".flash"); f.removeAttribute("data-on"); void f.offsetWidth; f.setAttribute("data-on", ""); mid(); }
    if (k < 1) requestAnimationFrame(fr); else { el.removeAttribute("data-on"); g.clearRect(0, 0, W, H); }
  })(t0);
}
