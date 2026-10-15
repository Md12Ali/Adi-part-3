/* ADI Part 3 — full exam simulation (real-time 3D, Three.js)
 * Plays the whole Standards Check lesson: arrival → 3-minute opening → 33 route steps → reflection → feedback.
 * The roads are the REAL route geometry from TomTom (assets/route.js): every street is in its true place,
 * with its true length, bends and turn angles. Junction furniture (lights, give-way lines, roundabouts,
 * parked cars, houses) is modelled on top of it.
 */
import * as THREE from "./vendor/three.module.min.js";

const X = window.EXAM;
const G = window.ROUTE_GEO;

/* ------------------------------------------------------------------
   Per-step junction model (n = 1..33). The geometry comes from TomTom; this table says
   what kind of junction it is and what's on the road we turn into.
   type: L | R | S | RB1 | RB2      kind: T (end of road, give way) | side | X (crossroads) | lights | rb | mini | none | entry
------------------------------------------------------------------ */
const SPEC = {
  1: { type: "L", kind: "T", to: "Kildowan Road", parked: "both" },
  2: { type: "L", kind: "T", to: "Granton Road", parked: "both", meet: true },
  3: { type: "L", kind: "T", to: "Green Lane", parked: "right" },
  4: { type: "R", kind: "lights", to: "Goodmayes Lane", parked: "both" },
  5: { type: "S", kind: "mini", to: "Goodmayes Lane", parked: "both", virtual: (J) => J[4] + 270 },
  6: { type: "R", kind: "side", to: "Trenance Gardens", parked: "both", pre: { kind: "mini", back: 80 }, fault: true },
  7: { type: "S", kind: "none", to: "Trenance Gardens", parked: "both", school: true, virtual: (J) => J[8] - 70 },
  8: { type: "L", kind: "T", to: "Westrow Gardens", parked: "both", meet: true },
  9: { type: "L", kind: "T", to: "Levett Gardens", parked: "both", meet: true },
  10: { type: "L", kind: "T", to: "Goodmayes Lane", parked: "both" },
  11: { type: "L", kind: "side", to: "Trenance Gardens", parked: "both", pre: { kind: "lights", back: 45 } },
  12: { type: "L", kind: "T", to: "Westrow Gardens", parked: "both", meet: true },
  13: { type: "R", kind: "T", to: "Levett Gardens", parked: "both" },
  14: { type: "R", kind: "side", to: "Gyllyngdune Gardens", parked: "both", humps: true, meet: true },
  15: { type: "R", kind: "T", to: "Breamore Road", parked: "both" },
  16: { type: "L", kind: "side", to: "Oakwood Gardens", parked: "both" },
  17: { type: "L", kind: "X", to: "Green Lane", parked: "right" },
  18: { type: "R", kind: "lights", to: "New Road", parked: "both", pre: { kind: "lights", back: 150 } },
  19: { type: "R", kind: "lights", to: "High Road", parked: "none" },
  20: { type: "L", kind: "side", to: "High Road", parked: "none", pre: { kind: "lights", back: 14 } },
  21: { type: "L", kind: "T", to: "Cameron Road", parked: "both", meet: true },
  22: { type: "RB2", kind: "rb", to: "Aldborough Road South", parked: "right" },
  23: { type: "L", kind: "side", to: "Wards Road", parked: "both", stubsBefore: 4 },
  24: { type: "L", kind: "side", to: "Mafeking Avenue", parked: "both", stubsBefore: 1 },
  25: { type: "L", kind: "side", to: "Ladysmith Avenue", parked: "both", pullup: 85 },
  26: { type: "R", kind: "T", to: "Aldborough Road South", parked: "right" },
  27: { type: "RB1", kind: "rb", to: "Cameron Road", parked: "both" },
  28: { type: "R", kind: "lights", to: "High Road", parked: "none" },
  29: { type: "L", kind: "side", to: "Seven Kings Road", parked: "left", pre: { kind: "lights", back: 12 } },
  30: { type: "L", kind: "side", to: "Felbrigge Road", parked: "both", meet: true },
  31: { type: "L", kind: "T", to: "Granton Road", parked: "both" },
  32: { type: "R", kind: "side", to: "Kildowan Road", parked: "both" },
  33: { type: "R", kind: "entry", to: "Test centre", parked: "none", end: true }
};
const MAP_QUERY = { "1st roundabout": "Goodmayes Lane", "School sign": "Trenance Gardens", "Test centre": "Goodmayes Driving Test Centre, 98 Goodmayes Road", "Test centre exit": "Goodmayes Driving Test Centre, 98 Goodmayes Road" };
const mapUrl = (name) => `https://maps.google.com/maps?q=${encodeURIComponent((MAP_QUERY[name] || name) + ", Ilford IG3, UK")}&z=16&output=embed`;
const mapLink = (name) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((MAP_QUERY[name] || name) + ", Ilford IG3, UK")}`;

/* ------------------------------------------------------------------
   Chapters + dialogue
------------------------------------------------------------------ */
function buildChapters() {
  const ch = [];
  const conv = (lines) => lines.map((l) => ({ sp: l[0], t: l[1], f: l[2] }));
  ch.push({ id: "arrive", kind: "centre", stage: "Arrival", title: "Arrival at Goodmayes Test Centre", lines: conv(X.stages[1].lines) });
  ch.push({ id: "opening", kind: "kerb", stage: "Opening (≤ 3 min)", title: "Opening — goal, help level, risk", lines: conv(X.stages[2].lines) });
  X.route.forEach((s) => {
    const lines = [{ sp: "M", t: s.dir, dir: true }];
    (s.say || []).forEach((q) => lines.push({ sp: "M", t: q, gate: s.n === 25 ? "stop" : undefined }));
    if (s.jamil && !s.after) lines.push({ sp: "J", t: s.jamil, gate: s.n === 25 ? "stop" : undefined });
    if (s.branch) {
      X.bend.fault.lines.forEach((l, i) => {
        const gate = i === 0 ? "fault" : i >= 4 ? "stop" : undefined;
        lines.push({ sp: l[0], t: l[1], f: l[2], gate, ifHappens: true });
      });
    }
    (s.wait || []).forEach((q) => lines.push({ sp: "M", t: q, gate: "stop" }));
    if (s.n === 19 && s.jamil) lines.push({ sp: "J", t: s.jamil, gate: "stop" });
    (s.after || []).forEach((q) => lines.push({ sp: "M", t: q, gate: "turned" }));
    if (s.after && s.jamil) lines.push({ sp: "J", t: s.jamil, gate: "turned" });
    if (s.praise) lines.push({ sp: "M", t: s.praise, gate: "turned" });
    const seen = new Set();
    const uniq = lines.filter((l) => { const k = l.sp + l.t; if (seen.has(k)) return false; seen.add(k); return true; });
    ch.push({ id: "s" + s.n, kind: "drive", n: s.n, level: s.level, stage: X.levels[s.level].en, title: `${s.n}. ${s.road}`, road: s.road, step: s, spec: SPEC[s.n], lines: uniq });
  });
  ch.push({ id: "reflect", kind: "kerb", stage: "Reflection (≤ 3 min)", title: "Reflection at the test centre", lines: conv(X.debrief.lines) });
  ch.push({ id: "feedback", kind: "centre", stage: "Result", title: "The examiner's feedback", lines: X.after.items.map((it) => ({ sp: "N", t: it.en })) });
  return ch;
}

/* ------------------------------------------------------------------
   Small helpers
------------------------------------------------------------------ */
const V2 = (x, z) => ({ x, z });
const add = (a, b) => V2(a.x + b.x, a.z + b.z);
const sub = (a, b) => V2(a.x - b.x, a.z - b.z);
const mul = (a, k) => V2(a.x * k, a.z * k);
const len2 = (a) => Math.hypot(a.x, a.z);
const norm = (a) => { const l = len2(a) || 1; return V2(a.x / l, a.z / l); };
const leftOf = (d) => V2(d.z, -d.x); // left of travel direction (x,z)
const rightOf = (d) => V2(-d.z, d.x);
const smooth = (t) => t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t);
function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const HALF = 5;       // road half width (m)
const RB_R = 10;      // roundabout centre-line radius
const LANE = 1.5;     // our lateral offset (left of centre)
const PARK = 4.0;     // parked car lateral offset

/* Text sprite (street name plates, signs) */
function textSprite(text, { bg = "#ffffff", fg = "#111827", border = "#111827", w = 3.2 } = {}) {
  const c = document.createElement("canvas"); c.width = 512; c.height = 128;
  const g = c.getContext("2d");
  g.fillStyle = bg; g.fillRect(0, 0, 512, 128);
  g.strokeStyle = border; g.lineWidth = 10; g.strokeRect(5, 5, 502, 118);
  g.fillStyle = fg; g.font = "bold 54px Arial, Helvetica, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
  let size = 54; while (g.measureText(text).width > 470 && size > 26) { size -= 2; g.font = `bold ${size}px Arial, Helvetica, sans-serif`; }
  g.fillText(text, 256, 66);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthWrite: false }));
  sp.scale.set(w, w / 4, 1);
  return sp;
}

/* ------------------------------------------------------------------
   Geometry builders
------------------------------------------------------------------ */
const MAT = {};
function mats() {
  if (MAT.road) return MAT;
  const m = (c, o = {}) => new THREE.MeshLambertMaterial({ color: c, ...o });
  Object.assign(MAT, {
    grass: m(0x9cc58a), road: m(0x4b5563), pave: m(0xd6d3d1), kerb: m(0xf5f5f4), white: m(0xffffff), yellow: m(0xfacc15),
    island: m(0x6aa65a), house: new THREE.MeshLambertMaterial({ vertexColors: false }), roof: m(0x7c2d12), glass: m(0x1f2937), dark: m(0x111827),
    window: m(0xdbeafe), pole: m(0x374151), blue: m(0x1d4ed8), red: m(0xdc2626), route: new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.55, depthWrite: false })
  });
  return MAT;
}

function ribbon(points, half, y, mat, offset = 0) {
  // points: array of V2 (centre line) → flat strip from (offset-half) to (offset+half) laterally
  const pos = [], idx = [];
  for (let i = 0; i < points.length; i++) {
    const a = points[Math.max(0, i - 1)], b = points[Math.min(points.length - 1, i + 1)];
    const d = norm(sub(b, a)); const l = leftOf(d);
    const p = points[i];
    const L = add(p, mul(l, offset + half)), Rr = add(p, mul(l, offset - half));
    pos.push(L.x, y, L.z, Rr.x, y, Rr.z);
    if (i > 0) { const k = i * 2; idx.push(k - 2, k - 1, k, k - 1, k + 1, k); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx); g.computeVertexNormals();
  const mesh = new THREE.Mesh(g, mat);
  return mesh;
}

function stripData(points, half, y, offset = 0, base = 0, pos = [], idx = []) {
  for (let i = 0; i < points.length; i++) {
    const a = points[Math.max(0, i - 1)], b = points[Math.min(points.length - 1, i + 1)];
    const l = leftOf(norm(sub(b, a))); const p = points[i];
    const L = add(p, mul(l, offset + half)), Rr = add(p, mul(l, offset - half));
    pos.push(L.x, y, L.z, Rr.x, y, Rr.z);
    if (i > 0) { const k = base + i * 2; idx.push(k - 2, k - 1, k, k - 1, k + 1, k); }
  }
  return points.length * 2;
}
class Strips {
  constructor() { this.m = new Map(); }
  add(points, half, y, mat, offset = 0) { if (!this.m.has(mat)) this.m.set(mat, { pos: [], idx: [], n: 0 }); const e = this.m.get(mat); e.n += stripData(points, half, y, offset, e.n, e.pos, e.idx); }
  build(group) { this.m.forEach((e, mat) => { const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(e.pos, 3)); g.setIndex(e.idx); g.computeVertexNormals(); group.add(new THREE.Mesh(g, mat)); }); }
}

function resample(poly, step = 1) {
  const out = [poly[0]];
  for (let i = 1; i < poly.length; i++) {
    const a = poly[i - 1], b = poly[i]; const d = len2(sub(b, a)); const n = Math.max(1, Math.round(d / step));
    for (let k = 1; k <= n; k++) out.push(add(a, mul(sub(b, a), k / n)));
  }
  return out;
}

function makeCar(color = 0xffffff, learner = false) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.75, 4.1), new THREE.MeshLambertMaterial({ color }));
  body.position.y = 0.65; g.add(body);
  const cab = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 2.1), new THREE.MeshLambertMaterial({ color: 0x1f2937 }));
  cab.position.set(0, 1.3, 0.25); g.add(cab);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.08, 1.9), new THREE.MeshLambertMaterial({ color }));
  roof.position.set(0, 1.63, 0.25); g.add(roof);
  const wheelG = new THREE.CylinderGeometry(0.34, 0.34, 0.25, 14); wheelG.rotateZ(Math.PI / 2);
  const wm = new THREE.MeshLambertMaterial({ color: 0x111111 });
  [[-0.85, -1.3], [0.85, -1.3], [-0.85, 1.3], [0.85, 1.3]].forEach(([x, z]) => { const w = new THREE.Mesh(wheelG, wm); w.position.set(x, 0.34, z); g.add(w); });
  const lightG = new THREE.BoxGeometry(0.35, 0.15, 0.05);
  [[-0.6, -2.06, 0xfef9c3], [0.6, -2.06, 0xfef9c3], [-0.6, 2.06, 0xb91c1c], [0.6, 2.06, 0xb91c1c]].forEach(([x, z, c]) => { const l = new THREE.Mesh(lightG, new THREE.MeshBasicMaterial({ color: c })); l.position.set(x, 0.75, z); g.add(l); });
  if (learner) {
    const sign = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.3, 0.25), new THREE.MeshLambertMaterial({ color: 0x1d4ed8 }));
    sign.position.set(0, 1.82, 0.3); g.add(sign);
    const plate = (z) => { const c = document.createElement("canvas"); c.width = c.height = 64; const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, 64, 64); x.fillStyle = "#dc2626"; x.font = "bold 56px Arial"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("L", 32, 35); const m = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.32), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c) })); m.position.set(0, 0.68, z); if (z > 0) m.rotation.y = 0; else m.rotation.y = Math.PI; return m; };
    g.add(plate(2.07)); g.add(plate(-2.07));
  }
  return g;
}
const setHeading = (obj, d) => { obj.rotation.y = Math.atan2(-d.x, -d.z); };

function makePerson(color, accessory) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.9, 4, 10), new THREE.MeshLambertMaterial({ color }));
  body.position.y = 0.95; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 12), new THREE.MeshLambertMaterial({ color: 0xc68642 }));
  head.position.y = 1.85; g.add(head);
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2.2), new THREE.MeshLambertMaterial({ color: 0x1c1917 }));
  hair.position.y = 1.9; g.add(hair);
  if (accessory === "clipboard") { const cb = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.04), new THREE.MeshLambertMaterial({ color: 0xf5f5f4 })); cb.position.set(0.25, 1.1, -0.3); cb.rotation.x = -0.5; g.add(cb); }
  return g;
}


/* ------------------------------------------------------------------
   One persistent world built from the real TomTom route
------------------------------------------------------------------ */
function makeGrid(cell = 12) {
  const m = new Map();
  const key = (cx, cz) => cx + "," + cz;
  return {
    add(p, v = p) { const k = key(Math.floor(p.x / cell), Math.floor(p.z / cell)); if (!m.has(k)) m.set(k, []); m.get(k).push(v); },
    near(p, r) {
      const out = []; const c0 = Math.floor((p.x - r) / cell), c1 = Math.floor((p.x + r) / cell), d0 = Math.floor((p.z - r) / cell), d1 = Math.floor((p.z + r) / cell);
      for (let cx = c0; cx <= c1; cx++) for (let cz = d0; cz <= d1; cz++) { const a = m.get(key(cx, cz)); if (a) out.push(...a); }
      return out;
    }
  };
}

function buildWorld() {
  const M = mats();
  const group = new THREE.Group();
  const strips = new Strips();
  const toV = ([x, y]) => V2(x, -y); // z points south, so north is "up" in a top view
  const RR = RB_R;
  const rbC = toV(G.rb);

  /* --- centre line, with the roundabout passes turned into clockwise arcs --- */
  let base = G.pts.map(toV);
  {
    const out = []; let i = 0;
    while (i < base.length) {
      if (i > 0 && len2(sub(base[i], rbC)) < RR) {
        let j = i; while (j < base.length && len2(sub(base[j], rbC)) < RR) j++;
        const pin = base[i - 1], pout = base[Math.min(base.length - 1, j)];
        const a0 = Math.atan2(pin.z - rbC.z, pin.x - rbC.x); let a1 = Math.atan2(pout.z - rbC.z, pout.x - rbC.x);
        while (a1 <= a0 + 0.3) a1 += Math.PI * 2; // UK: clockwise seen from above (angle increases towards south)
        const n = Math.max(6, Math.ceil((a1 - a0) / 0.2));
        for (let k = 0; k <= n; k++) { const a = a0 + ((a1 - a0) * k) / n; out.push(V2(rbC.x + Math.cos(a) * RR, rbC.z + Math.sin(a) * RR)); }
        i = j; continue;
      }
      out.push(base[i]); i++;
    }
    base = out;
  }
  const C = resample(base, 1);
  const U = [0]; for (let i = 1; i < C.length; i++) U.push(U[i - 1] + len2(sub(C[i], C[i - 1])));
  const T = C.map((_, i) => norm(sub(C[Math.min(C.length - 1, i + 3)], C[Math.max(0, i - 3)])));
  const uEnd = U[U.length - 1];
  const idxOfU = (u) => { let lo = 0, hi = U.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (U[m] < u) lo = m; else hi = m; } return lo; };
  const ptAt = (u) => C[idxOfU(Math.max(0, Math.min(uEnd, u)))];
  const dirAt = (u) => T[idxOfU(Math.max(0, Math.min(uEnd, u)))];

  /* --- junction positions (forward search so repeated streets map to the right pass) --- */
  const J = {};
  let from = 0;
  for (let n = 1; n <= 33; n++) {
    if (!G.J[n]) continue;
    const q = toV(G.J[n]);
    let best = -1, bd = 1e9;
    for (let i = from; i < C.length; i++) {
      const d = len2(sub(C[i], q));
      if (d < bd) { bd = d; best = i; }
      if (bd < 14 && d > bd + 20) break;
    }
    J[n] = { n, u: U[best] }; from = best + 1;
  }
  J[5] = { n: 5, u: J[4].u + 270 };
  J[7] = { n: 7, u: J[8].u - 70 };
  for (let n = 1; n <= 33; n++) {
    const j = J[n], s = SPEC[n];
    j.c = ptAt(j.u); j.din = norm(sub(ptAt(j.u - 2), ptAt(j.u - 14))); j.dout = norm(sub(ptAt(j.u + 14), ptAt(j.u + 2)));
    j.spec = s; j.uTurned = j.u + 10;
    if (s.kind === "rb") {
      let a = idxOfU(j.u); while (a > 0 && len2(sub(C[a], rbC)) < RR + 5) a--;
      let b = idxOfU(j.u); while (b < C.length - 1 && len2(sub(C[b], rbC)) < RR + 5) b++;
      j.uIn = U[a]; j.uTurned = U[b] + 4; j.c = rbC; j.din = norm(sub(C[a], C[Math.max(0, a - 12)]));
    }
  }

  /* --- road segments (names, parked cars) --- */
  const segs = [{ u0: 0, u1: J[1].u, name: "Goodmayes Road", parked: "none" }];
  for (let n = 1; n <= 33; n++) segs.push({ u0: J[n].u, u1: n < 33 ? J[n + 1].u : uEnd, name: SPEC[n].to, parked: SPEC[n].parked, n, spec: SPEC[n] });
  const segAt = (u) => segs.find((s) => u >= s.u0 && u <= s.u1) || segs[segs.length - 1];

  /* --- events --- */
  const stops = []; const lat = [{ u: 0, v: LANE }]; const meets = []; const minis = []; const lightsAt = [];
  let uFault = null;
  for (let n = 1; n <= 33; n++) {
    const j = J[n], s = SPEC[n];
    if (s.kind === "T" || s.kind === "X") stops.push({ u: j.u - 7, type: "giveway", j, hold: 1.6, cross: true });
    if (s.kind === "lights") { stops.push({ u: j.u - 9, type: "lights", j, hold: 4.5 }); lightsAt.push({ u: j.u - 9, j }); }
    if (s.kind === "rb") stops.push({ u: j.uIn - 1, type: "giveway", j, hold: 1.2 });
    if (s.kind === "mini") { stops.push({ u: j.u - 7, type: "giveway", j, hold: 1.0 }); minis.push(j.u); }
    if (s.pre) {
      const pu = j.u - s.pre.back;
      if (s.pre.kind === "lights") { const pj = { c: ptAt(pu + 9), din: dirAt(pu), u: pu + 9, pre: true }; stops.push({ u: pu, type: "lights", j: pj, hold: 4.5 }); lightsAt.push({ u: pu, j: pj }); }
      if (s.pre.kind === "mini") { stops.push({ u: pu - 7, type: "giveway", j: { c: ptAt(pu), din: dirAt(pu) }, hold: 1.0 }); minis.push(pu); }
    }
    const next = n < 33 ? J[n + 1].u : uEnd;
    if (s.meet && next - j.uTurned > 130) { const mu = j.uTurned + 55; meets.push({ u: mu, n }); stops.push({ u: mu, type: "meet" }); lat.push({ u: mu - 14, v: LANE }, { u: mu - 3, v: 3.4 }, { u: mu + 2, v: 3.4 }, { u: mu + 14, v: LANE }); }
    if (s.fault) {
      const bq = toV(G.bend); let bi = idxOfU(j.u), bd = 1e9, bu = j.u + 70;
      for (let i = idxOfU(j.u); i < idxOfU(j.u + 200); i++) { const d = len2(sub(C[i], bq)); if (d < bd) { bd = d; bu = U[i]; } }
      void bi;
      uFault = bu - 4;
      lat.push({ u: uFault - 45, v: LANE }, { u: uFault - 18, v: -0.2 }, { u: uFault + 6, v: -0.2 }, { u: uFault + 22, v: LANE });
      stops.push({ u: uFault + 70, type: "pullup", hold: 0.5 });
      lat.push({ u: uFault + 50, v: LANE }, { u: uFault + 66, v: 3.2 }, { u: uFault + 74, v: 3.2 }, { u: uFault + 92, v: LANE });
    }
    if (s.pullup) { const pu = j.uTurned + s.pullup; stops.push({ u: pu, type: "end", hold: 0, n }); lat.push({ u: pu - 18, v: LANE }, { u: pu - 4, v: 3.4 }, { u: pu + 20, v: 3.4 }, { u: pu + 34, v: LANE }); }
    if (s.end) { stops.push({ u: uEnd - 6, type: "end", hold: 0, n }); }
  }
  stops.sort((a, b) => a.u - b.u); lat.sort((a, b) => a.u - b.u);
  const latAt = (u) => {
    for (let i = 0; i < lat.length - 1; i++) { const a = lat[i], b = lat[i + 1]; if (u >= a.u && u <= b.u) return a.v + (b.v - a.v) * smooth((u - a.u) / Math.max(0.01, b.u - a.u)); }
    return LANE;
  };
  const P = C.map((p, i) => add(p, mul(leftOf(T[i]), latAt(U[i]))));
  const PS = P.map((_, i) => { let x = 0, z = 0, n = 0; for (let k = -3; k <= 3; k++) { const q = P[Math.min(P.length - 1, Math.max(0, i + k))]; x += q.x; z += q.z; n++; } return V2(x / n, z / n); });
  const posAt = (u, latOverride) => {
    const uu = Math.max(0, Math.min(uEnd, u)); const a = idxOfU(uu), b = Math.min(U.length - 1, a + 1); const t = U[b] - U[a] ? (uu - U[a]) / (U[b] - U[a]) : 0;
    if (latOverride !== undefined) { const c = add(C[a], mul(sub(C[b], C[a]), t)); return { p: add(c, mul(leftOf(T[a]), latOverride)), d: T[a] }; }
    const p = add(PS[a], mul(sub(PS[b], PS[a]), t));
    const d = norm(sub(PS[Math.min(PS.length - 1, b + 2)], PS[Math.max(0, a - 2)]));
    return { p, d };
  };

  /* --- side-road stubs where the route doesn't already go --- */
  const roadGrid = makeGrid(12);
  for (let i = 0; i < C.length; i += 3) roadGrid.add(C[i]);
  const distToRoad = (p, r = 14) => { let best = 1e9; for (const q of roadGrid.near(p, r)) { const d = len2(sub(q, p)); if (d < best) best = d; } return best; };
  const stubs = [];
  const addStub = (c, d, length = 70) => {
    const probe = add(c, mul(d, 22));
    if (distToRoad(probe, 14) < 8) return;
    const pts = [add(c, mul(d, HALF)), add(c, mul(d, length))];
    stubs.push(pts);
  };
  for (let n = 1; n <= 33; n++) {
    const j = J[n], s = SPEC[n];
    if (s.kind === "T") addStub(j.c, mul(j.dout, -1));
    if (s.kind === "side") addStub(j.c, j.din);
    if (s.kind === "X" || s.kind === "lights") { addStub(j.c, j.din); addStub(j.c, mul(j.dout, -1)); }
    if (s.kind === "rb") [leftOf(j.din), rightOf(j.din), j.din].forEach((d) => addStub(add(rbC, mul(d, RR)), d, 60));
    if (s.stubsBefore) {
      const span = Math.min(420, j.u - J[n - 1].uTurned - 40);
      for (let k = 1; k <= s.stubsBefore; k++) { const u = j.u - (span * k) / (s.stubsBefore + 1); addStub(ptAt(u), leftOf(dirAt(u)), 50); }
    }
  }
  stubs.forEach((pts) => resample(pts, 3).forEach((p) => roadGrid.add(p)));

  /* --- ground, roads, pavements --- */
  let minX = 1e9, maxX = -1e9, minZ = 1e9, maxZ = -1e9; C.forEach((p) => { minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minZ = Math.min(minZ, p.z); maxZ = Math.max(maxZ, p.z); });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(maxX - minX + 1600, maxZ - minZ + 1600), M.grass);
  ground.rotation.x = -Math.PI / 2; ground.position.set((minX + maxX) / 2, -0.05, (minZ + maxZ) / 2); group.add(ground);
  const C2 = C.filter((_, i) => i % 2 === 0);
  strips.add(C2, HALF + 2.2, 0.0, M.pave);
  strips.add(C2, HALF, 0.05, M.road);
  stubs.forEach((pts) => { const r = resample(pts, 2); strips.add(r, HALF + 2.2, 0.0, M.pave); strips.add(r, HALF, 0.05, M.road); });
  // junction patches + markings
  for (let n = 1; n <= 33; n++) {
    const j = J[n], s = SPEC[n];
    if (["T", "X", "lights", "side", "entry"].includes(s.kind)) {
      const sq = new THREE.Mesh(new THREE.PlaneGeometry(HALF * 2 + 1.5, HALF * 2 + 1.5), M.road); sq.rotation.x = -Math.PI / 2; sq.rotation.z = Math.atan2(j.din.x, j.din.z); sq.position.set(j.c.x, 0.055, j.c.z); group.add(sq);
    }
    const sl = sub(j.c, mul(j.din, HALF + 1.5)); const l = leftOf(j.din);
    if (s.kind === "T" || s.kind === "X") for (let k = 0; k < 4; k++) { const a = add(sl, mul(l, 0.3 + k * 1.2)); strips.add([a, add(a, mul(l, 0.7))], 0.12, 0.08, M.white); strips.add([add(a, mul(j.din, -0.5)), add(add(a, mul(j.din, -0.5)), mul(l, 0.7))], 0.12, 0.08, M.white); }
  }
  lightsAt.forEach(({ u }) => { const p = ptAt(u + 1.5), d = dirAt(u); strips.add([p, add(p, mul(leftOf(d), HALF - 0.2))], 0.2, 0.08, M.white); });
  // big roundabout
  {
    const ring = new THREE.Mesh(new THREE.RingGeometry(RR - 4.2, RR + 5, 48), M.road); ring.rotation.x = -Math.PI / 2; ring.position.set(rbC.x, 0.06, rbC.z); group.add(ring);
    const isl = new THREE.Mesh(new THREE.CylinderGeometry(RR - 4.2, RR - 4.2, 0.25, 40), M.island); isl.position.set(rbC.x, 0.12, rbC.z); group.add(isl);
    const kerbR = new THREE.Mesh(new THREE.TorusGeometry(RR - 4.2, 0.12, 6, 48), M.kerb); kerbR.rotation.x = Math.PI / 2; kerbR.position.set(rbC.x, 0.2, rbC.z); group.add(kerbR);
  }
  // mini-roundabouts (painted white circles)
  minis.forEach((u) => {
    const p = ptAt(u); const disc = new THREE.Mesh(new THREE.CircleGeometry(1.4, 24), M.white); disc.rotation.x = -Math.PI / 2; disc.position.set(p.x, 0.09, p.z); group.add(disc);
    const ring = new THREE.Mesh(new THREE.RingGeometry(1.9, 2.15, 24), M.white); ring.rotation.x = -Math.PI / 2; ring.position.set(p.x, 0.09, p.z); group.add(ring);
  });

  /* --- parked cars (instanced) --- */
  const rand = rng(20261015);
  const carCols = [0x334155, 0x991b1b, 0x1e3a8a, 0xe5e7eb, 0x0f766e, 0x78350f, 0x111827, 0x6b7280, 0xb45309];
  const jPts = []; for (let n = 1; n <= 33; n++) if (SPEC[n].kind !== "none") jPts.push(J[n].c);
  minis.forEach((u) => jPts.push(ptAt(u))); jPts.push(rbC);
  stubs.forEach((pts) => jPts.push(sub(pts[0], mul(norm(sub(pts[1], pts[0])), HALF))));
  const nearJ = (p, d) => jPts.some((c) => len2(sub(c, p)) < d);
  const carGrid = makeGrid(8); const parked = [];
  const tryCar = (q, hd) => { if (carGrid.near(q, 4).some((o) => len2(sub(o, q)) < 4.6)) return; carGrid.add(q); parked.push({ x: q.x, z: q.z, ry: Math.atan2(-hd.x, -hd.z), c: carCols[Math.floor(rand() * carCols.length)] }); };
  segs.forEach((sg) => {
    if (sg.parked === "none") return;
    const sides = sg.parked === "both" ? [1, -1] : sg.parked === "left" ? [1] : [-1];
    sides.forEach((side) => {
      let u = sg.u0 + 13 + rand() * 4;
      while (u < sg.u1 - 13) {
        const p = ptAt(u), d = dirAt(u);
        const inGap = side === 1 && meets.some((m) => u > m.u - 6 && u < m.u + 6);
        const inFaultPull = side === 1 && uFault !== null && u > uFault + 58 && u < uFault + 82;
        const inPull = side === 1 && stops.some((s) => (s.type === "end" || s.type === "pullup") && u > s.u - 12 && u < s.u + 8);
        if (!inGap && !inFaultPull && !inPull && !nearJ(p, 13) && distToRoad(add(p, mul(leftOf(d), side * 10)), 6) > 4) {
          tryCar(add(p, mul(leftOf(d), side * PARK)), side === 1 ? d : mul(d, -1));
        }
        const block = side === 1 && meets.some((m) => u > m.u + 6 && u < m.u + 40);
        u += block ? 5 : rand() < 0.16 ? 13 + rand() * 4 : 5 + rand() * 1.5;
      }
    });
  });
  stubs.forEach((pts) => {
    const r = resample(pts, 1); const d = norm(sub(pts[1], pts[0]));
    for (let i = 10; i < r.length - 6; i += 6) if (rand() < 0.7) [1, -1].forEach((side) => { const q = add(r[i], mul(leftOf(d), side * PARK)); if (!nearJ(q, 12)) tryCar(q, side === 1 ? d : mul(d, -1)); });
  });
  {
    const n = parked.length;
    const bodyG = new THREE.BoxGeometry(1.8, 0.75, 4.1); bodyG.translate(0, 0.7, 0);
    const cabG = new THREE.BoxGeometry(1.6, 0.62, 2.1); cabG.translate(0, 1.38, 0.25);
    const baseG = new THREE.BoxGeometry(1.7, 0.5, 3.4); baseG.translate(0, 0.3, 0);
    const body = new THREE.InstancedMesh(bodyG, new THREE.MeshLambertMaterial({ color: 0xffffff }), Math.max(1, n));
    const cab = new THREE.InstancedMesh(cabG, new THREE.MeshLambertMaterial({ color: 0x1f2937 }), Math.max(1, n));
    const bas = new THREE.InstancedMesh(baseG, new THREE.MeshLambertMaterial({ color: 0x0b0b0b }), Math.max(1, n));
    const mm = new THREE.Matrix4(), qq = new THREE.Quaternion(), one = new THREE.Vector3(1, 1, 1), cc = new THREE.Color(), up = new THREE.Vector3(0, 1, 0);
    parked.forEach((pc, i) => { qq.setFromAxisAngle(up, pc.ry); mm.compose(new THREE.Vector3(pc.x, 0.05, pc.z), qq, one); body.setMatrixAt(i, mm); cab.setMatrixAt(i, mm); bas.setMatrixAt(i, mm); body.setColorAt(i, cc.setHex(pc.c)); });
    body.count = cab.count = bas.count = n;
    group.add(body, cab, bas);
  }

  /* --- houses (instanced) --- */
  const houseGrid = makeGrid(10); const houses = [];
  const addHouses = (pts) => {
    for (let i = 1; i < pts.length - 1; i++) {
      const d = norm(sub(pts[i + 1], pts[i - 1]));
      [1, -1].forEach((side) => {
        const q = add(pts[i], mul(leftOf(d), side * (HALF + 8.5)));
        if (distToRoad(q, 14) < HALF + 6) return;
        if (len2(sub(q, rbC)) < RR + 14) return;
        if (houseGrid.near(q, 7).some((h) => len2(sub(h, q)) < 6.5)) return;
        houseGrid.add(q); houses.push({ q, d });
      });
    }
  };
  addHouses(resample(C2, 7)); stubs.forEach((pts) => addHouses(resample(pts, 7)));
  const centreP = toV(G.centre);
  const hGeo = new THREE.BoxGeometry(6.4, 6.5, 8); hGeo.translate(0, 3.25, 0);
  const rGeo = new THREE.ConeGeometry(5.3, 2.6, 4); rGeo.rotateY(Math.PI / 4); rGeo.scale(1, 1, 1.25); rGeo.translate(0, 7.8, 0);
  const hs = houses.filter((h) => len2(sub(h.q, centreP)) > 22);
  const hm = new THREE.InstancedMesh(hGeo, new THREE.MeshLambertMaterial({ color: 0xffffff }), Math.max(1, hs.length));
  const rm = new THREE.InstancedMesh(rGeo, new THREE.MeshLambertMaterial({ color: 0xffffff }), Math.max(1, hs.length));
  {
    const m4 = new THREE.Matrix4(), qt = new THREE.Quaternion(), sc = new THREE.Vector3(1, 1, 1), col = new THREE.Color(), up = new THREE.Vector3(0, 1, 0);
    const hc = [0xb45f4b, 0xc9a27e, 0xe7dcc8, 0xa8574a, 0xd9cbb1, 0x9c6b56, 0xf1e9db], rc = [0x57534e, 0x7c2d12, 0x44403c, 0x92400e];
    hs.forEach((h, i) => { qt.setFromAxisAngle(up, Math.atan2(h.d.x, h.d.z)); m4.compose(new THREE.Vector3(h.q.x, 0, h.q.z), qt, sc); hm.setMatrixAt(i, m4); rm.setMatrixAt(i, m4); hm.setColorAt(i, col.setHex(hc[Math.floor(rand() * hc.length)])); rm.setColorAt(i, col.setHex(rc[Math.floor(rand() * rc.length)])); });
    hm.count = rm.count = hs.length;
  }
  group.add(hm, rm);
  strips.build(group);

  /* --- signs --- */
  for (let n = 1; n <= 33; n++) {
    const j = J[n], s = SPEC[n];
    if (s.kind === "none" || s.kind === "mini") continue;
    if (s.kind === "rb") {
      const p = add(sub(rbC, mul(j.din, RR + 16)), mul(leftOf(j.din), HALF + 1.4));
      const sp = textSprite(`${s.type === "RB1" ? "1st exit" : "2nd exit"} → ${s.to}`, { bg: "#1d4ed8", fg: "#fff", border: "#fff", w: 4.4 }); sp.position.set(p.x, 2.8, p.z); group.add(sp);
      continue;
    }
    const side = s.type === "R" ? rightOf(j.din) : leftOf(j.din);
    const p = add(add(j.c, mul(j.din, -(HALF + 3))), mul(side, HALF + 1.6));
    const sp = textSprite(s.to); sp.position.set(p.x, 2.6, p.z); group.add(sp);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.2, 6), M.pole); pole.position.set(p.x, 1.1, p.z); group.add(pole);
  }
  const blueSign = (u) => {
    const c = document.createElement("canvas"); c.width = c.height = 128; const x = c.getContext("2d");
    x.fillStyle = "#1d4ed8"; x.beginPath(); x.arc(64, 64, 60, 0, Math.PI * 2); x.fill(); x.strokeStyle = "#fff"; x.lineWidth = 8;
    for (let k = 0; k < 3; k++) { const a0 = k * 2.1 + 0.3; x.beginPath(); x.arc(64, 64, 32, a0, a0 + 1.4); x.stroke(); const a = a0 + 1.4; x.fillStyle = "#fff"; x.beginPath(); x.moveTo(64 + Math.cos(a) * 44, 64 + Math.sin(a) * 44); x.lineTo(64 + Math.cos(a) * 20, 64 + Math.sin(a) * 20); x.lineTo(64 + Math.cos(a + 0.45) * 32, 64 + Math.sin(a + 0.45) * 32); x.fill(); }
    const s2 = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c) })); s2.scale.set(1.3, 1.3, 1);
    const p = add(ptAt(u), mul(leftOf(dirAt(u)), HALF + 1.4)); s2.position.set(p.x, 2.4, p.z); group.add(s2);
  };
  minis.forEach((u) => blueSign(u - 28)); blueSign(J[22].uIn - 22); blueSign(J[27].uIn - 22);
  {
    const u = J[7].u - 60; const c = document.createElement("canvas"); c.width = c.height = 128; const x = c.getContext("2d");
    x.fillStyle = "#fff"; x.strokeStyle = "#dc2626"; x.lineWidth = 12; x.beginPath(); x.moveTo(64, 10); x.lineTo(120, 112); x.lineTo(8, 112); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = "#111"; x.beginPath(); x.arc(52, 58, 7, 0, 7); x.arc(76, 62, 7, 0, 7); x.fill(); x.fillRect(46, 66, 12, 26); x.fillRect(70, 70, 12, 22);
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c) })); s.scale.set(1.6, 1.6, 1);
    const p = add(ptAt(u), mul(leftOf(dirAt(u)), HALF + 1.4)); s.position.set(p.x, 2.5, p.z); group.add(s);
  }
  // speed humps on Gyllyngdune Gardens
  [70, 200, 330].forEach((k) => { const u = J[14].uTurned + k; if (u > J[15].u - 30) return; const a = ptAt(u), d = dirAt(u); const hs2 = new Strips(); hs2.add([a, add(a, mul(d, 2.2))], HALF - 0.4, 0.09, M.road); for (let t = -3; t <= 3; t += 2) { const b = add(a, mul(leftOf(d), t)); hs2.add([b, add(b, mul(d, 2.2))], 0.25, 0.12, M.white); } hs2.build(group); });
  // test centre building (98 Goodmayes Road)
  {
    const d = dirAt(uEnd - 4); const side = rightOf(d);
    const bp = add(centreP, mul(side, 6));
    const b = new THREE.Mesh(new THREE.BoxGeometry(18, 7, 12), new THREE.MeshLambertMaterial({ color: 0xe7e5e4 }));
    b.position.set(bp.x - side.x * 6, 3.5, bp.z - side.z * 6); b.position.set(centreP.x + side.x * 16, 3.5, centreP.z + side.z * 16); b.rotation.y = Math.atan2(d.x, d.z); group.add(b);
    const sg = textSprite("Goodmayes Driving Test Centre", { bg: "#0f172a", fg: "#fff", border: "#0f172a", w: 7.5 }); sg.position.set(centreP.x + side.x * 9.5, 6, centreP.z + side.z * 9.5); group.add(sg);
  }

  /* --- traffic lights --- */
  const lightsObjs = [];
  lightsAt.forEach(({ u, j }) => {
    const d = dirAt(u); const p = add(ptAt(u), mul(leftOf(d), HALF + 0.9));
    const g = new THREE.Group(); g.position.set(p.x, 0, p.z);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 3.2, 8), M.pole); pole.position.y = 1.6; g.add(pole);
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.25, 0.35), M.dark); box.position.y = 3.6; g.add(box);
    const bulbs = [0xef4444, 0xf59e0b, 0x22c55e].map((c, i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 8), new THREE.MeshBasicMaterial({ color: 0x1f2937 })); m.position.set(0, 4.0 - i * 0.4, 0.2); m.userData.on = c; g.add(m); return m; });
    g.rotation.y = Math.atan2(d.x, d.z);
    group.add(g); lightsObjs.push({ u, j, bulbs });
  });

  return { group, C, U, T, PS, posAt, ptAt, dirAt, J, stops, latAt, uFault, meets, uEnd, lightsObjs, segs, segAt, stubs, rbC };
}

/* Route line for the current chapter (rebuilt when the chapter changes) */
function routeLine(world, u0, u1) {
  const pts = [];
  for (let u = Math.max(0, u0); u <= Math.min(world.uEnd, u1); u += 1.5) pts.push(world.posAt(u).p);
  if (pts.length < 2) return null;
  return ribbon(pts, 0.28, 0.1, mats().route);
}

function buildStatic(kind) {
  const M = mats();
  const group = new THREE.Group();
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), M.grass); ground.rotation.x = -Math.PI / 2; ground.position.y = -0.05; group.add(ground);
  const lot = new THREE.Mesh(new THREE.PlaneGeometry(46, 30), M.road); lot.rotation.x = -Math.PI / 2; lot.position.set(0, 0.02, 0); group.add(lot);
  for (let i = -3; i <= 3; i++) { const l = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 5.5), M.white); l.rotation.x = -Math.PI / 2; l.position.set(i * 3.2, 0.04, -4); group.add(l); }
  const b = new THREE.Mesh(new THREE.BoxGeometry(30, 7, 10), new THREE.MeshLambertMaterial({ color: 0xe7e5e4 })); b.position.set(0, 3.5, -14); group.add(b);
  const roofM = new THREE.Mesh(new THREE.BoxGeometry(31, 0.5, 11), M.dark); roofM.position.set(0, 7.2, -14); group.add(roofM);
  for (let i = -3; i <= 3; i++) { const w = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.6), M.window); w.position.set(i * 4, 4, -8.95); group.add(w); }
  const door = new THREE.Mesh(new THREE.PlaneGeometry(2, 2.6), M.glass); door.position.set(0, 1.3, -8.94); group.add(door);
  const sg = textSprite("Driving Test Centre · Kildowan Road", { bg: "#0f172a", fg: "#fff", border: "#0f172a", w: 9 }); sg.position.set(0, 6, -8.6); group.add(sg);
  const road = ribbon(resample([V2(-200, 14), V2(200, 14)], 4), HALF, 0.03, M.road); group.add(road);
  const pave = ribbon(resample([V2(-200, 14), V2(200, 14)], 4), HALF + 2.2, 0.0, M.pave); group.add(pave);
  const car = makeCar(0xffffff, true); car.position.set(0, 0.05, -3.8); group.add(car);
  const people = [];
  if (kind === "centre") {
    const mo = makePerson(0x1e3a8a); mo.position.set(-2.2, 0, 0.2); mo.rotation.y = 0.6; group.add(mo);
    const ja = makePerson(0x9ca3af); ja.position.set(-1.0, 0, 1.4); ja.rotation.y = 0.2; group.add(ja);
    const ex = makePerson(0x374151, "clipboard"); ex.position.set(1.6, 0, 0.6); ex.rotation.y = -0.9; group.add(ex);
    people.push(mo, ja, ex);
  }
  // a few trees
  for (let i = 0; i < 10; i++) { const t = new THREE.Group(); const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 2.5, 6), new THREE.MeshLambertMaterial({ color: 0x78350f })); tr.position.y = 1.25; const lf = new THREE.Mesh(new THREE.SphereGeometry(1.8, 10, 8), new THREE.MeshLambertMaterial({ color: 0x4d7c0f })); lf.position.y = 3.6; t.add(tr, lf); t.position.set(-26 + (i % 5) * 13, 0, i < 5 ? -24 : 24); group.add(t); }
  return { group, car, people };
}

/* ------------------------------------------------------------------
   Speech (hardened for Chrome/Edge/Safari quirks)
------------------------------------------------------------------ */
const Speech = (() => {
  const synth = window.speechSynthesis; let refs = []; let token = 0; let voices = [];
  const load = () => { if (synth) { const v = synth.getVoices(); if (v.length) voices = v; } };
  if (synth) { load(); synth.addEventListener ? synth.addEventListener("voiceschanged", load) : (synth.onvoiceschanged = load); }
  const pick = () => voices.find((v) => /en[-_]GB/i.test(v.lang) && /male|daniel|george|ryan|google uk english male/i.test(v.name)) || voices.find((v) => /en[-_]GB/i.test(v.lang)) || voices.find((v) => /^en/i.test(v.lang)) || null;
  const chunks = (t) => (t.match(/[^.!?]+[.!?]*\s*/g) || [t]).map((s) => s.trim()).filter(Boolean);
  return {
    ok: !!(synth && typeof SpeechSynthesisUtterance !== "undefined"),
    stop() { token++; refs = []; if (synth) synth.cancel(); },
    speak(text, { pitch = 1, rate = 1 } = {}, done) {
      if (!this.ok) { done && done(); return; }
      this.stop(); const my = token; const parts = chunks(text.replace(/\[[^\]]*\]/g, "")); let i = 0; load(); const v = pick();
      const next = () => {
        if (my !== token) return;
        if (i >= parts.length) { refs = []; done && done(); return; }
        const u = new SpeechSynthesisUtterance(parts[i++]); u.lang = "en-GB"; u.pitch = pitch; u.rate = rate; if (v) u.voice = v;
        u.onend = next; u.onerror = (e) => { if (e && (e.error === "interrupted" || e.error === "canceled")) return; next(); };
        refs.push(u); if (synth.paused) synth.resume(); synth.speak(u);
      };
      setTimeout(() => { if (my === token) next(); }, 120);
    }
  };
})();

/* ------------------------------------------------------------------
   Player
------------------------------------------------------------------ */
export function mountSim(root) {
  const chapters = buildChapters();
  const lang = () => { try { return JSON.parse(localStorage.getItem("adi3-lang") || '"both"'); } catch (e) { return "both"; } };
  const st = { i: 0, playing: false, speed: 1, voice: Speech.ok, cam: "chase", route: true, map: false, started: false };
  try { const s = JSON.parse(localStorage.getItem("adi3-sim") || "{}"); Object.assign(st, { cam: s.cam || "chase", voice: s.voice !== undefined ? s.voice && Speech.ok : Speech.ok, speed: s.speed || 1, route: s.route !== false, i: Math.min(chapters.length - 1, s.i || 0) }); } catch (e) {}
  const save = () => { try { localStorage.setItem("adi3-sim", JSON.stringify({ cam: st.cam, voice: st.voice, speed: st.speed, route: st.route, i: st.i })); } catch (e) {} };

  root.innerHTML = `
  <div class="sim-wrap relative overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-slate-800" data-sim>
    <div class="relative aspect-[4/5] w-full max-h-[78vh] sm:aspect-video" data-stage>
      <canvas class="absolute inset-0 h-full w-full" data-canvas></canvas>
      <div class="pointer-events-none absolute left-3 top-3 max-w-[60%] rounded-xl bg-black/55 px-3 py-2 text-white backdrop-blur" data-chap>
        <p class="hidden text-[10px] font-bold uppercase tracking-widest text-sky-300 sm:block" data-stage-label></p>
        <p class="text-sm font-extrabold leading-tight sm:text-base" data-title></p>
      </div>
      <canvas class="pointer-events-none absolute right-3 top-3 h-24 w-24 rounded-xl bg-black/45 ring-1 ring-white/15 sm:h-36 sm:w-36" width="288" height="288" data-mini></canvas>
      <div class="pointer-events-none absolute left-3 right-3 top-[7.4rem] hidden items-center justify-center gap-2 rounded-2xl bg-blue-600/95 px-3 py-1.5 text-white shadow-xl sm:left-1/2 sm:right-auto sm:top-20 sm:-translate-x-1/2 sm:gap-3 sm:px-4 sm:py-2" data-banner>
        <span class="text-xl font-black leading-none sm:text-3xl" data-arrow></span><span class="text-xs font-extrabold sm:text-base" data-btext></span>
      </div>
      <div class="pointer-events-none absolute right-3 top-[10.2rem] hidden rounded-full bg-rose-600 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white sm:top-44" data-if>If this happens</div>
      <div class="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-3 pb-3 pt-10 sm:px-6 sm:pb-5" data-subs>
        <div class="mx-auto max-w-3xl text-center">
          <p class="text-[11px] font-extrabold uppercase tracking-widest" data-speaker></p>
          <p class="mt-1 text-[15px] font-semibold leading-snug text-white sm:text-xl" data-line></p>
          <p class="mt-1 hidden text-xs text-slate-300 sm:block sm:text-sm" lang="bn" data-bn></p>
        </div>
      </div>
      <div class="absolute inset-0 hidden place-items-center bg-black/40" data-card></div>
      <button type="button" class="absolute inset-0 grid place-items-center bg-slate-950/70 text-white" data-start>
        <span class="flex flex-col items-center gap-3 px-6 text-center">
          <span class="grid h-20 w-20 place-items-center rounded-full bg-blue-600 shadow-2xl ring-8 ring-blue-600/30"><svg class="ml-1 h-9 w-9" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg></span>
          <span class="text-lg font-extrabold sm:text-2xl">Play the full exam simulation</span>
          <span class="max-w-md text-xs text-slate-300 sm:text-sm">Arrival → opening → all 33 turns → Trenance Gardens → reflection. ${chapters.length} chapters. Turn on sound for the voices.</span>
        </span>
      </button>
    </div>
    <div class="flex flex-wrap items-center gap-2 border-t border-white/10 bg-slate-900 px-3 py-2 text-white">
      <button type="button" class="sim-btn" data-act="prev" aria-label="Previous chapter">⏮</button>
      <button type="button" class="sim-btn sim-btn-primary w-11" data-act="play" aria-label="Play or pause">▶</button>
      <button type="button" class="sim-btn" data-act="next" aria-label="Next chapter">⏭</button>
      <select class="sim-select min-w-0 flex-1 sm:max-w-xs" data-select aria-label="Chapter"></select>
      <span class="hidden text-xs tabular-nums text-slate-400 sm:inline" data-count></span>
      <span class="flex-1"></span>
      <div class="flex rounded-lg bg-white/10 p-0.5 text-xs font-semibold" role="group" aria-label="Camera">
        <button type="button" class="sim-seg" data-cam="chase">Chase</button>
        <button type="button" class="sim-seg" data-cam="top">Top</button>
        <button type="button" class="sim-seg" data-cam="driver">Driver</button>
      </div>
      <button type="button" class="sim-btn" data-act="route" title="Show the route line">Route</button>
      <button type="button" class="sim-btn" data-act="speed" title="Playback speed"></button>
      <button type="button" class="sim-btn" data-act="voice" title="Voice on/off"></button>
      <button type="button" class="sim-btn" data-act="map" title="Show the real road on Google Maps">🗺 Real map</button>
      <button type="button" class="sim-btn" data-act="full" aria-label="Fullscreen">⛶</button>
    </div>
    <div class="h-1 bg-white/10"><div class="h-1 bg-sky-400 transition-all" data-progress></div></div>
  </div>
  <div class="mt-3 hidden overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" data-mappanel>
    <div class="flex items-center justify-between gap-2 px-4 py-2 text-sm"><p class="font-bold text-slate-900 dark:text-white">Real road: <span data-mapname></span></p><a class="btn" target="_blank" rel="noopener" data-maplink>Open in Google Maps ↗</a></div>
    <iframe class="h-72 w-full border-0 sm:h-96" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Google Map of the current road" data-iframe></iframe>
  </div>
  <div class="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto pb-1" data-strip></div>`;

  const q = (s) => root.querySelector(s);
  const canvas = q("[data-canvas]"), stage = q("[data-stage]");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbfdcf2); scene.fog = new THREE.Fog(0xbfdcf2, 120, 420);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x6b8e5a, 1.25));
  const sun = new THREE.DirectionalLight(0xffffff, 1.4); sun.position.set(60, 120, 40); scene.add(sun);
  const camera = new THREE.PerspectiveCamera(55, 16 / 9, 0.1, 1200);
  let world = null, ourCar = null, oncoming = null, crosser = null, staticInfo = null, driveWorld = null, chRange = null, chStops = [], rLine = null;
  const statics = {};
  const sim = { u: 0, v: 0, holdT: 0, holding: null, cleared: new Set(), onU: null, crossT: null, braking: false, t: 0 };
  const dlg = { idx: -1, playing: false, waitStart: 0, lineEnd: 0, done: false, gateWait: 0 };
  let chapEndTimer = null;

  const resize = () => {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(stage);

  /* ---------- chapter select + strip ---------- */
  const sel = q("[data-select]");
  let lastStage = "";
  sel.innerHTML = chapters.map((c, i) => { const og = c.stage !== lastStage ? `${lastStage ? "</optgroup>" : ""}<optgroup label="${c.stage}">` : ""; lastStage = c.stage; return `${og}<option value="${i}">${c.title}</option>`; }).join("") + "</optgroup>";
  q("[data-strip]").innerHTML = chapters.map((c, i) => `<button type="button" data-goto="${i}" class="sim-chip">${c.kind === "drive" ? c.n + ". " + c.road : c.title.split(" — ")[0]}</button>`).join("");

  /* ---------- worlds (built once, then reused) ---------- */
  function ensureDrive() {
    if (driveWorld) return driveWorld;
    driveWorld = buildWorld();
    ourCar = makeCar(0xffffff, true); driveWorld.group.add(ourCar);
    oncoming = makeCar(0xdc2626); oncoming.visible = false; driveWorld.group.add(oncoming);
    crosser = makeCar(0x0ea5e9); crosser.visible = false; driveWorld.group.add(crosser);
    driveWorld.group.visible = false; scene.add(driveWorld.group);
    return driveWorld;
  }
  function ensureStatic(kind) {
    if (!statics[kind]) { statics[kind] = buildStatic(kind); statics[kind].group.visible = false; scene.add(statics[kind].group); }
    return statics[kind];
  }
  function chapterRange(c, w) {
    const n = c.n, J = w.J, j = J[n];
    const prevT = n > 1 ? J[n - 1].uTurned : 0;
    const u0 = n === 1 ? 0 : Math.max(0, Math.min(prevT + 15, j.u - 75));
    let u1 = n === 33 ? w.uEnd - 2 : j.uTurned + 45;
    if (n < 33 && J[n + 1].u - j.uTurned > 60) u1 = Math.min(u1, J[n + 1].u - 18);
    const pull = w.stops.find((s) => s.type === "end" && s.n === n); if (pull) u1 = pull.u + 1;
    if (n === 6 && w.uFault !== null) u1 = Math.max(u1, w.uFault + 95);
    return { u0, u1, j };
  }

  /* ---------- load chapter ---------- */
  function load(i, autoplay) {
    clearTimeout(chapEndTimer); chapEndTimer = null;
    Speech.stop();
    st.i = Math.max(0, Math.min(chapters.length - 1, i)); save();
    const c = chapters[st.i];
    Object.assign(sim, { u: 0, v: 0, holdT: 0, holding: null, cleared: new Set(), onU: null, onFor: null, crossT: null, braking: false, t: 0 });
    Object.assign(dlg, { idx: -1, playing: false, lineEnd: 0, done: false, gateWait: 0 });
    hideCard(); q("[data-banner]").classList.add("hidden"); q("[data-if]").classList.add("hidden");
    Object.values(statics).forEach((s) => (s.group.visible = false));
    if (driveWorld) driveWorld.group.visible = false;
    if (rLine) { rLine.parent && rLine.parent.remove(rLine); rLine.geometry.dispose(); rLine = null; }
    if (c.kind === "drive") {
      const w = ensureDrive(); world = w; w.group.visible = true;
      chRange = chapterRange(c, w);
      chStops = w.stops.filter((s) => s.u >= chRange.u0 + 2 && s.u <= chRange.u1 + 0.5);
      if (!chStops.some((s) => s.type === "end")) chStops.push({ u: chRange.u1, type: "end", hold: 0, soft: true });
      sim.u = chRange.u0; sim.v = c.n === 1 ? 0 : 6;
      const p0 = w.posAt(sim.u); ourCar.position.set(p0.p.x, 0.05, p0.p.z); setHeading(ourCar, p0.d);
      oncoming.visible = false; crosser.visible = false;
      rLine = routeLine(w, chRange.u0, chRange.u1 + 30); if (rLine) w.group.add(rLine);
    } else {
      staticInfo = ensureStatic(c.kind); staticInfo.group.visible = true; world = { group: staticInfo.group };
    }
    camera.userData.look = null;
    snapCamera();
    q("[data-title]").textContent = c.title;
    q("[data-stage-label]").textContent = c.stage;
    sel.value = String(st.i);
    q("[data-count]").textContent = `${st.i + 1} / ${chapters.length}`;
    q("[data-progress]").style.width = `${((st.i + 1) / chapters.length) * 100}%`;
    root.querySelectorAll("[data-goto]").forEach((b) => b.setAttribute("aria-current", String(+b.dataset.goto === st.i)));
    const chip = root.querySelector(`[data-goto="${st.i}"]`); if (chip) chip.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    setSub(null);
    updateMap();
    if (autoplay !== undefined) st.playing = autoplay;
    syncButtons();
  }

  /* ---------- dialogue ---------- */
  const SPK = { M: ["Mohammed", "#60a5fa"], J: ["Jamil", "#e2e8f0"], E: ["Examiner", "#fbbf24"], N: ["", "#94a3b8"] };
  function setSub(line) {
    const c = chapters[st.i];
    if (!line) { q("[data-speaker]").textContent = ""; q("[data-line]").textContent = ""; q("[data-bn]").textContent = lang() !== "en" && c.step ? c.step.focus.bn : ""; return; }
    const [name, color] = SPK[line.sp] || SPK.N;
    q("[data-speaker]").textContent = name + (line.f ? ` · ${{ F: "Fault", C: "Cause", P: "Problem / risk", S: "Solution" }[line.f]}` : "");
    q("[data-speaker]").style.color = color;
    const el = q("[data-line]"); el.textContent = line.sp === "N" || line.sp === "E" ? line.t : `“${line.t}”`;
    el.style.fontStyle = line.sp === "N" || line.sp === "E" ? "italic" : "normal";
    q("[data-bn]").textContent = lang() !== "en" && c.step ? c.step.focus.bn : "";
    q("[data-if]").classList.toggle("hidden", !line.ifHappens);
    // cards
    if (/\[Show the card\]/.test(line.t)) showCard("diagram");
    else if (/out of ten/i.test(line.t) && c.kind === "kerb") showCard("scale", /Eight/i.test(line.t) ? 8 : /Five/i.test(line.t) ? 5 : null);
    else if (line.sp === "M" && c.kind === "kerb") hideCard();
    if (line.dir) showBanner(c);
  }
  function showBanner(c) {
    const s = c.spec;
    const icon = { L: "↰", R: "↱", S: "↑", RB1: "⟲¹", RB2: "⟲²" }[s.type];
    const words = { L: "Turn LEFT", R: "Turn RIGHT", S: s.kind === "mini" ? "Mini-roundabout · straight on" : "Follow the road", RB1: "Roundabout · 1st exit", RB2: "Roundabout · 2nd exit" }[s.type];
    const pre = s.pre ? (s.pre.kind === "lights" ? "Through the lights, then " : "Mini-roundabout, then ") : "";
    q("[data-arrow]").textContent = icon;
    q("[data-btext]").textContent = `${pre}${words} → ${s.to}`;
    q("[data-banner]").classList.remove("hidden"); q("[data-banner]").classList.add("flex");
  }
  function showCard(kind, v) {
    const el = q("[data-card]");
    if (kind === "diagram") el.innerHTML = `<div class="mx-4 w-full max-w-md rounded-2xl bg-white p-4 shadow-2xl"><p class="text-xs font-bold uppercase tracking-widest text-blue-700">Briefing card</p><svg viewBox="0 0 400 160" class="mt-2 w-full"><rect width="400" height="160" fill="#e2e8f0"/><rect y="30" width="400" height="100" fill="#475569"/><line x1="0" x2="400" y1="80" y2="80" stroke="#fff" stroke-dasharray="14 10" stroke-width="2"/>${[60, 110, 250, 300].map((x) => `<rect x="${x}" y="34" width="44" height="22" rx="5" fill="#cbd5e1"/>`).join("")}${[150, 200, 330].map((x) => `<rect x="${x}" y="104" width="44" height="22" rx="5" fill="#cbd5e1"/>`).join("")}<rect x="160" y="34" width="84" height="22" rx="6" fill="none" stroke="#f59e0b" stroke-width="3" stroke-dasharray="6 4"/><text x="202" y="26" text-anchor="middle" font-size="11" font-weight="700" fill="#b45309">SAFE GAP</text><rect x="12" y="58" width="40" height="18" rx="4" fill="#2563eb"/><rect x="350" y="84" width="40" height="18" rx="4" fill="#f59e0b"/></svg><p class="mt-2 text-sm font-semibold text-slate-700">Look far ahead · find the gap early · who should wait?</p></div>`;
    else el.innerHTML = `<div class="mx-4 w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"><p class="text-xs font-bold uppercase tracking-widest text-blue-700">Confidence · out of 10</p><div class="mt-4 flex justify-between">${Array.from({ length: 10 }, (_, k) => `<span class="grid h-8 w-8 place-items-center rounded-full text-sm font-extrabold ${k + 1 === v ? "bg-blue-600 text-white ring-4 ring-blue-200" : "bg-slate-100 text-slate-500"}">${k + 1}</span>`).join("")}</div></div>`;
    el.classList.remove("hidden"); el.classList.add("grid");
  }
  function hideCard() { const el = q("[data-card]"); el.classList.add("hidden"); el.classList.remove("grid"); }

  const gateOk = (line) => {
    const c = chapters[st.i];
    if (!line.gate || c.kind !== "drive") return true;
    if (line.gate === "stop") return !!sim.holding;
    if (line.gate === "fault") return world.uFault !== null && sim.u >= world.uFault - 22;
    if (line.gate === "turned") return sim.u >= chRange.j.uTurned;
    return true;
  };
  function dlgTick(now) {
    const c = chapters[st.i];
    if (dlg.done || dlg.playing) return;
    const next = c.lines[dlg.idx + 1];
    if (!next) { dlg.done = true; return; }
    if (!gateOk(next)) { if (!dlg.gateWait) dlg.gateWait = now; if (now - dlg.gateWait < 30000 / st.speed) return; }
    dlg.gateWait = 0; dlg.idx++; dlg.playing = true;
    setSub(next);
    const words = next.t.split(/\s+/).length;
    const fallback = (next.sp === "N" ? 1.6 + words / 4 : 0.8 + words / 2.6) * 1000 / st.speed;
    const finish = () => { if (dlg.playing) { dlg.playing = false; } };
    if (st.voice && (next.sp === "M" || next.sp === "J")) {
      let ended = false;
      const t0 = now;
      Speech.speak(next.t, { pitch: next.sp === "J" ? 1.18 : 0.88, rate: Math.min(1.6, 0.98 * st.speed) }, () => { ended = true; setTimeout(finish, 300 / st.speed); });
      // safety net if speech never reports back
      dlg.lineEnd = t0 + fallback * 2.2 + 4000;
      dlg.check = () => !ended;
    } else {
      dlg.lineEnd = now + fallback; dlg.check = null;
    }
  }
  function dlgPoll(now) {
    if (dlg.playing && now >= dlg.lineEnd) { dlg.playing = false; Speech.stop(); }
    if (!dlg.playing && dlg.check === null) { /* timed lines finish via lineEnd */ }
  }

  /* ---------- car simulation ---------- */
  function simTick(dt) {
    const c = chapters[st.i];
    if (c.kind !== "drive" || !world) return;
    const w = world, n = c.n, jMain = chRange.j;
    const nextStop = chStops.find((s) => !sim.cleared.has(s) && s.u >= sim.u - 0.3);
    // speed target
    const seg = w.segAt(sim.u);
    let cruise = seg.parked === "none" ? 10.5 : 8.5;
    for (let k = Math.max(1, n - 2); k <= Math.min(33, n + 2); k++) { const jj = w.J[k]; const r = jj.spec.kind === "rb" ? 24 : jj.spec.kind === "none" ? 0 : 14; if (Math.abs(sim.u - jj.u) < r) cruise = 4.6; }
    if (n === 6 && w.uFault !== null) {
      if (sim.u > w.uFault - 50 && sim.u < w.uFault - 22) cruise = 12; // too fast into the bend
      if (sim.u >= w.uFault - 22 && sim.u < w.uFault + 30) cruise = 3.5; // "slow down now" + dual brake
    }
    const meetsHere = w.meets.filter((m) => m.u > chRange.u0 && m.u <= chRange.u1);
    if (meetsHere.some((m) => sim.u > m.u - 40 && sim.u < m.u)) cruise = Math.min(cruise, 6);
    if (sim.u > jMain.uTurned + 20 && !dlg.done) cruise = Math.min(cruise, 4.5);
    let target = cruise;
    if (nextStop) target = Math.min(target, Math.sqrt(Math.max(0, 2 * 2.4 * (nextStop.u - sim.u))));
    // hold logic
    if (sim.holding) {
      sim.v = 0; sim.holdT += dt;
      const h = sim.holding;
      let ok = sim.holdT >= (h.hold || 0);
      if (h.type === "meet") ok = sim.onU !== null && sim.onU < h.u - 8;
      if (h.type === "end") ok = false;
      const cur = c.lines[dlg.idx], nxt = c.lines[dlg.idx + 1];
      if ((dlg.playing && cur && cur.gate === "stop") || (nxt && nxt.gate === "stop" && !dlg.done)) ok = false;
      if (ok) { sim.cleared.add(h); sim.holding = null; sim.holdT = 0; }
    } else {
      const a = target > sim.v ? 1.8 : 3.6;
      sim.v += Math.sign(target - sim.v) * Math.min(Math.abs(target - sim.v), a * dt);
      sim.u += sim.v * dt;
      if (nextStop && sim.u >= nextStop.u - 0.25 && sim.v < 0.6) { sim.u = nextStop.u; sim.holding = nextStop; sim.holdT = 0; sim.v = 0; if (nextStop.cross) sim.crossT = 0; }
    }
    const { p, d } = w.posAt(sim.u);
    ourCar.position.set(p.x, 0.05, p.z); setHeading(ourCar, d);
    // meeting traffic
    meetsHere.forEach((m) => { if (sim.onFor !== m && sim.u > m.u - 38 && sim.u < m.u) { sim.onFor = m; sim.onU = m.u + 95; oncoming.visible = true; } });
    if (sim.onU !== null) {
      sim.onU -= 7.5 * dt;
      if (sim.onU < chRange.u0 - 10) { oncoming.visible = false; }
      else { const o = w.posAt(sim.onU, -LANE); oncoming.position.set(o.p.x, 0.05, o.p.z); setHeading(oncoming, mul(o.d, -1)); }
    }
    // crossing traffic at give-way (from the right, in the near lane)
    if (sim.crossT !== null && sim.holding && sim.holding.cross) {
      sim.crossT += dt; const j = sim.holding.j; const l = leftOf(j.din);
      const k = -55 + sim.crossT * 26; const near = sub(j.c, mul(j.din, 1.6));
      const pp = add(near, mul(l, k)); crosser.visible = k < 60; crosser.position.set(pp.x, 0.05, pp.z); setHeading(crosser, l);
    } else if (!sim.holding) crosser.visible = false;
    // traffic lights
    w.lightsObjs.forEach(({ u, bulbs }) => {
      if (u < chRange.u0 - 5 || u > chRange.u1 + 5) { bulbs[0].material.color.setHex(0x1f2937); bulbs[1].material.color.setHex(0x1f2937); bulbs[2].material.color.setHex(bulbs[2].userData.on); return; }
      const stop = chStops.find((s) => s.type === "lights" && Math.abs(s.u - u) < 0.5);
      const green = !stop || sim.cleared.has(stop) || (sim.holding === stop && sim.holdT > (stop.hold - 0.9)) || sim.u > u + 1;
      const amber = stop && sim.holding === stop && sim.holdT > stop.hold - 1.6 && !green;
      bulbs[0].material.color.setHex(!green && !amber ? bulbs[0].userData.on : 0x1f2937);
      bulbs[1].material.color.setHex(amber ? bulbs[1].userData.on : 0x1f2937);
      bulbs[2].material.color.setHex(green ? bulbs[2].userData.on : 0x1f2937);
    });
    if (rLine) rLine.visible = st.route;
    if (sim.u > jMain.uTurned + 4) { q("[data-banner]").classList.add("hidden"); q("[data-banner]").classList.remove("flex"); }
  }

  /* ---------- camera ---------- */
  const camPos = new THREE.Vector3(), camLook = new THREE.Vector3();
  function desiredCam(out, look, t) {
    const c = chapters[st.i];
    if (c.kind !== "drive") {
      const a = Math.sin(t * 0.12) * 0.9; const r = c.kind === "centre" ? 15 : 9.5;
      out.set(Math.sin(a) * r, c.kind === "centre" ? 5 : 3.2, -3.8 + Math.cos(a) * r);
      look.set(0, 1.1, -3.8); return;
    }
    const p = ourCar.position; const fw = new THREE.Vector3(-Math.sin(ourCar.rotation.y), 0, -Math.cos(ourCar.rotation.y));
    if (st.cam === "top") { out.set(p.x - fw.x * 6, 78, p.z - fw.z * 6); look.set(p.x + fw.x * 18, 0, p.z + fw.z * 18); camera.up.set(fw.x, 0, fw.z); return; }
    camera.up.set(0, 1, 0);
    if (st.cam === "driver") { const rt = new THREE.Vector3(-fw.z, 0, fw.x); out.set(p.x + fw.x * 0.2 + rt.x * 0.38, 1.25, p.z + fw.z * 0.2 + rt.z * 0.38); look.set(p.x + fw.x * 30, 1.0, p.z + fw.z * 30); return; }
    out.set(p.x - fw.x * 11, 5.2, p.z - fw.z * 11); look.set(p.x + fw.x * 9, 1.0, p.z + fw.z * 9);
  }
  function snapCamera() { if (chapters[st.i].kind === "drive" && !ourCar) return; desiredCam(camPos, camLook, 0); camera.position.copy(camPos); camera.lookAt(camLook); }

  /* ---------- minimap: the real route, north up ---------- */
  const mini = q("[data-mini]"); const mg = mini.getContext("2d");
  function drawMini() {
    const c = chapters[st.i]; mg.clearRect(0, 0, 288, 288);
    if (c.kind !== "drive" || !world || !chRange) { mini.style.opacity = 0; return; }
    mini.style.opacity = 1;
    const w = world;
    const span = Math.max(160, Math.min(520, chRange.u1 - chRange.u0 + 80));
    const cx0 = ourCar.position.x, cz0 = ourCar.position.z;
    const s = 250 / span; const tx = (p) => [144 + (p.x - cx0) * s, 144 + (p.z - cz0) * s];
    mg.lineCap = "round"; mg.lineJoin = "round";
    // all streets we know: the full route + side-road stubs
    mg.strokeStyle = "rgba(226,232,240,.55)"; mg.lineWidth = Math.max(4, HALF * 2 * s);
    mg.beginPath(); w.C.forEach((p, i) => { if (i % 3) return; const [x, y] = tx(p); i ? mg.lineTo(x, y) : mg.moveTo(x, y); }); mg.stroke();
    w.stubs.forEach((pts) => { mg.beginPath(); pts.forEach((p, i) => { const [x, y] = tx(p); i ? mg.lineTo(x, y) : mg.moveTo(x, y); }); mg.stroke(); });
    { const [x, y] = tx(w.rbC); mg.beginPath(); mg.arc(x, y, RB_R * s, 0, Math.PI * 2); mg.stroke(); }
    // this chapter's path
    mg.strokeStyle = "#38bdf8"; mg.lineWidth = 4; mg.beginPath();
    for (let u = chRange.u0; u <= chRange.u1 + 20; u += 3) { const [x, y] = tx(w.posAt(u).p); u === chRange.u0 ? mg.moveTo(x, y) : mg.lineTo(x, y); }
    mg.stroke();
    // junction marker
    { const [x, y] = tx(chRange.j.c); mg.fillStyle = "#f59e0b"; mg.beginPath(); mg.arc(x, y, 6, 0, Math.PI * 2); mg.fill(); }
    // car
    const [cx, cy] = tx({ x: cx0, z: cz0 });
    mg.fillStyle = "#fff"; mg.strokeStyle = "#1d4ed8"; mg.lineWidth = 3; mg.beginPath(); mg.arc(cx, cy, 8, 0, Math.PI * 2); mg.fill(); mg.stroke();
    // street names near the car
    mg.font = "bold 15px Arial"; mg.textAlign = "center"; mg.fillStyle = "#fff"; mg.strokeStyle = "rgba(15,23,42,.85)"; mg.lineWidth = 4;
    const seen = new Set();
    w.segs.forEach((sg) => {
      if (seen.has(sg.name) || sg.u1 - sg.u0 < 25) return;
      const p = w.ptAt((sg.u0 + sg.u1) / 2); const [x, y] = tx(p);
      if (x < 30 || x > 258 || y < 20 || y > 270) return;
      seen.add(sg.name); mg.strokeText(sg.name, x, y); mg.fillText(sg.name, x, y);
    });
    // north arrow
    mg.fillStyle = "rgba(255,255,255,.85)"; mg.font = "bold 14px Arial"; mg.fillText("N", 270, 22); mg.beginPath(); mg.moveTo(270, 28); mg.lineTo(265, 40); mg.lineTo(275, 40); mg.fill();
  }

  /* ---------- map panel ---------- */
  function updateMap() {
    const c = chapters[st.i]; const name = c.kind === "drive" ? c.road : "Test centre";
    q("[data-mapname]").textContent = name;
    q("[data-maplink]").href = mapLink(name);
    const panel = q("[data-mappanel]"); panel.classList.toggle("hidden", !st.map);
    if (st.map) { const f = q("[data-iframe]"); const u = mapUrl(name); if (f.dataset.src !== u) { f.dataset.src = u; f.src = u; } }
  }

  /* ---------- buttons ---------- */
  function syncButtons() {
    q('[data-act="play"]').textContent = st.playing ? "❚❚" : "▶";
    q('[data-act="speed"]').textContent = `${st.speed}×`;
    q('[data-act="voice"]').textContent = st.voice ? "🔊 Voice" : "🔇 Voice";
    q('[data-act="voice"]').disabled = !Speech.ok;
    q('[data-act="route"]').setAttribute("aria-pressed", String(st.route));
    q('[data-act="map"]').setAttribute("aria-pressed", String(st.map));
    root.querySelectorAll("[data-cam]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.cam === st.cam)));
  }
  root.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.hasAttribute("data-start")) { b.remove(); st.started = true; st.playing = true; load(st.i, true); return; }
    const act = b.dataset.act;
    if (b.dataset.goto) { removeStart(); load(+b.dataset.goto, true); return; }
    if (b.dataset.cam) { st.cam = b.dataset.cam; save(); syncButtons(); return; }
    if (act === "play") { removeStart(); st.playing = !st.playing; if (!st.playing) { Speech.stop(); if (dlg.playing) { dlg.playing = false; dlg.idx--; } } syncButtons(); return; }
    if (act === "prev") { removeStart(); load(st.i - 1, true); return; }
    if (act === "next") { removeStart(); load(st.i + 1, true); return; }
    if (act === "speed") { st.speed = st.speed === 1 ? 1.5 : st.speed === 1.5 ? 2 : 1; save(); syncButtons(); return; }
    if (act === "voice") { st.voice = !st.voice; if (!st.voice) Speech.stop(); save(); syncButtons(); return; }
    if (act === "route") { st.route = !st.route; save(); syncButtons(); return; }
    if (act === "map") { st.map = !st.map; updateMap(); syncButtons(); return; }
    if (act === "full") { const el = q("[data-sim]"); if (document.fullscreenElement) document.exitFullscreen(); else if (el.requestFullscreen) el.requestFullscreen(); return; }
  });
  sel.addEventListener("change", () => { removeStart(); load(+sel.value, true); });
  function removeStart() { const s = q("[data-start]"); if (s) s.remove(); st.started = true; }

  /* ---------- main loop ---------- */
  let last = performance.now(), visible = true;
  new IntersectionObserver((ents) => { visible = ents[0].isIntersecting; }).observe(stage);
  function frame(now) {
    if (!root.isConnected) { renderer.dispose(); Speech.stop(); return; }
    requestAnimationFrame(frame);
    const dt = Math.min(0.25, (now - last) / 1000); last = now;
    if (!visible && !document.fullscreenElement) return;
    const c = chapters[st.i];
    if (st.playing) {
      sim.t += dt * st.speed;
      const steps = Math.max(1, Math.ceil((dt * st.speed) / 0.034));
      for (let k = 0; k < steps; k++) simTick((dt * st.speed) / steps);
      dlgTick(now); dlgPoll(now);
      // chapter end
      const carDone = c.kind !== "drive" || (sim.holding && sim.holding.type === "end") || sim.u >= chRange.j.uTurned + 30;
      if (dlg.done && !dlg.playing && carDone && !chapEndTimer) {
        chapEndTimer = setTimeout(() => { chapEndTimer = null; if (st.playing && st.i < chapters.length - 1) load(st.i + 1, true); else if (st.i >= chapters.length - 1) { st.playing = false; syncButtons(); } }, 1200 / st.speed);
      }
    } else if (c.kind !== "drive") sim.t += dt * 0.3;
    if (c.kind === "drive" && ourCar) {
      desiredCam(camPos, camLook, sim.t);
      const k = 1 - Math.pow(0.0025, dt);
      camera.position.lerp(camPos, st.cam === "driver" ? 1 : k);
      camera.userData.look = (camera.userData.look || camLook.clone()).lerp(camLook, st.cam === "driver" ? 1 : k);
      camera.lookAt(camera.userData.look);
      drawMini();
    } else { desiredCam(camPos, camLook, sim.t); camera.up.set(0, 1, 0); camera.position.copy(camPos); camera.lookAt(camLook); drawMini(); }
    renderer.render(scene, camera);
  }
  resize();
  load(st.i, false);
  syncButtons();
  requestAnimationFrame(frame);

  // expose for testing
  root.__sim = { st, sim, dlg, chapters, load, get world() { return world; }, get range() { return chRange; }, pause() { if (!st.playing) return; st.playing = false; Speech.stop(); if (dlg.playing) { dlg.playing = false; dlg.idx--; } syncButtons(); } };
  return root.__sim;
}
