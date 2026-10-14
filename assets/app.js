/* ADI Part 3 Study Guide — app logic (vanilla JS, no build step needed at runtime) */
(function () {
  "use strict";
  const D = window.ADI;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------------- storage (safe) ---------------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    del(k) { try { localStorage.removeItem(k); } catch (e) {} }
  };

  const state = {
    lang: store.get("adi3-lang", "both"),
    tab: "dashboard",
    scores: store.get("adi3-scores", {}),
    open: new Set(store.get("adi3-open", ["p1-b0"])),
    phaseFilter: "all",
    scenario: "ours",
    localVideos: {} // scene n -> object URL (this session only)
  };

  /* ---------------- i18n helpers ---------------- */
  const UI = {
    dashboard: { en: "Dashboard", bn: "ড্যাশবোর্ড" },
    exam: { en: "Exam Day", bn: "পরীক্ষার দিন" },
    lesson: { en: "Lesson Plan & Script", bn: "লেসন প্ল্যান ও স্ক্রিপ্ট" },
    videos: { en: "Video Guide", bn: "ভিডিও গাইড" },
    checklist: { en: "Examiner Checklist", bn: "এক্সামিনার চেকলিস্ট" },
    copy: { en: "Copy", bn: "কপি" },
    copied: { en: "Copied to clipboard", bn: "ক্লিপবোর্ডে কপি হয়েছে" },
    coach: { en: "Examiner tip", bn: "পরামর্শ" },
    lines: { en: "lines", bn: "লাইন" },
    expandAll: { en: "Expand all", bn: "সব খুলুন" },
    collapseAll: { en: "Collapse all", bn: "সব বন্ধ করুন" },
    copyAll: { en: "Copy full script", bn: "পুরো স্ক্রিপ্ট কপি" },
    copyPhase: { en: "Copy phase", bn: "ফেজ কপি" }
  };
  const isBn = () => state.lang === "bn";
  // Render bilingual text: en | bn | both (English first, Bengali underneath)
  function T(o, cls = "") {
    if (!o) return "";
    if (typeof o === "string") return o;
    if (state.lang === "en") return `<span class="${cls}">${o.en}</span>`;
    if (state.lang === "bn") return `<span lang="bn" class="${cls}">${o.bn}</span>`;
    return `<span class="${cls}">${o.en}</span><span lang="bn" class="mt-0.5 block text-[0.93em] font-normal text-slate-500 dark:text-slate-400">${o.bn}</span>`;
  }
  // Single-language pick (for compact labels like buttons/chips)
  const t1 = (o) => (typeof o === "string" ? o : isBn() ? `<span lang="bn">${o.bn}</span>` : o.en);
  const tPlain = (o) => (typeof o === "string" ? o : o.en);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const bnNum = (n) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

  /* ---------------- icons ---------------- */
  const I = {
    copy: '<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
    chev: '<svg class="acc-chevron h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    arrow: '<svg class="h-3.5 w-3.5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    user: '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    search: '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    shield: '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',
    play: '<svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>',
    replay: '<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
    check: '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>',
    x: '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>'
  };

  const AREA = {
    lp: { bar: "bg-sky-500", text: "text-sky-700 dark:text-sky-300", soft: "bg-sky-50 dark:bg-sky-950/40", ring: "border-sky-200 dark:border-sky-900" },
    rm: { bar: "bg-rose-500", text: "text-rose-700 dark:text-rose-300", soft: "bg-rose-50 dark:bg-rose-950/40", ring: "border-rose-200 dark:border-rose-900" },
    tls: { bar: "bg-violet-500", text: "text-violet-700 dark:text-violet-300", soft: "bg-violet-50 dark:bg-violet-950/40", ring: "border-violet-200 dark:border-violet-900" }
  };
  const PHASE_COLOR = {
    p1: { dot: "bg-sky-500", text: "text-sky-700 dark:text-sky-300", hex: "#0ea5e9" },
    p2: { dot: "bg-rose-500", text: "text-rose-700 dark:text-rose-300", hex: "#f43f5e" },
    p3: { dot: "bg-blue-600", text: "text-blue-700 dark:text-blue-300", hex: "#2563eb" },
    p4: { dot: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-300", hex: "#10b981" }
  };

  /* ---------------- scores ---------------- */
  function totals() {
    const by = { lp: 0, rm: 0, tls: 0 };
    let scored = 0;
    D.competencies.forEach((c) => {
      const v = state.scores[c.n];
      if (typeof v === "number") { by[c.area] += v; scored++; }
    });
    const total = by.lp + by.rm + by.tls;
    let grade = "Fail";
    if (total >= 43) grade = "A"; else if (total >= 31) grade = "B";
    const rmFail = scored > 0 && by.rm <= 7;
    if (rmFail) grade = "Fail";
    return { by, total, scored, grade, rmFail };
  }
  function gradeBadge(g, scored) {
    if (!scored) return `<span class="chip">—</span>`;
    const map = {
      A: "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
      B: "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
      Fail: "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300"
    };
    const label = g === "Fail" ? (isBn() ? "ফেল" : "Fail") : (isBn() ? `গ্রেড ${g === "A" ? "এ" : "বি"}` : `Grade ${g}`);
    return `<span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${map[g]}">${label}</span>`;
  }

  /* ================================================================
     DASHBOARD
     ================================================================ */
  function renderDashboard() {
    const tt = totals();
    const s = D.scoring;
    const pct = (n) => (n / 51) * 100;

    const breakdownBar = s.areas.map((a) => `<div class="${AREA[a.key].bar} h-full" style="width:${pct(a.max)}%" title="${a.en}: ${a.max}"></div>`).join("");
    const areaCards = s.areas.map((a) => `
      <div class="rounded-xl border ${AREA[a.key].ring} ${AREA[a.key].soft} p-4">
        <div class="flex items-center gap-2"><span class="h-2.5 w-2.5 rounded-full ${AREA[a.key].bar}"></span><p class="text-sm font-bold ${AREA[a.key].text}">${t1(a)}</p></div>
        <p class="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">${a.max}<span class="text-base font-semibold text-slate-400"> / 51</span></p>
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">${isBn() ? `${bnNum(a.count)}টি দক্ষতা × ০–৩` : `${a.count} competencies × 0–3`}${a.key === "rm" ? (isBn() ? " · ন্যূনতম ৮" : " · minimum 8") : ""}</p>
      </div>`).join("");

    const marker = tt.scored ? `<div class="absolute -top-1 bottom-[-4px] w-0.5 bg-slate-900 dark:bg-white" style="left:calc(${pct(tt.total)}% - 1px)"><span class="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold text-white dark:bg-white dark:text-slate-900">${isBn() ? "আপনি" : "You"} ${tt.total}</span></div>` : "";

    const principles = D.principles.map((p) => `
      <article class="card flex flex-col p-5">
        <div class="flex items-center gap-3">
          <span class="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white">${I[p.icon]}</span>
          <h3 class="font-extrabold leading-tight text-slate-900 dark:text-white">${T({ en: p.en, bn: p.bn })}</h3>
        </div>
        <p class="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">${T(p.body)}</p>
        <ul class="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
          ${p.points.map((pt) => `<li class="flex gap-2"><span class="mt-0.5 text-emerald-600 dark:text-emerald-400">${I.check}</span><span>${T(pt)}</span></li>`).join("")}
        </ul>
      </article>`).join("");

    const timeline = D.phases.map((p) => `
      <a href="#lesson/${p.id}" class="group relative block rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold ${PHASE_COLOR[p.id].text}">${isBn() ? "ফেজ" : "Phase"} ${p.num}</span>
          <span class="chip">${p.time}</span>
        </div>
        <p class="mt-2 font-bold leading-snug text-slate-900 dark:text-white">${T(p.title)}</p>
        <span class="absolute inset-x-4 bottom-0 h-0.5 rounded-full ${PHASE_COLOR[p.id].dot} opacity-0 transition group-hover:opacity-100"></span>
      </a>`).join("");

    $("#panel-dashboard").innerHTML = `
      <div class="grid grid-cols-1 gap-6">
        <!-- Hero -->
        <section class="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-xl sm:p-10 dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
          <svg class="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18]" preserveAspectRatio="none" viewBox="0 0 800 300" aria-hidden="true">
            <path d="M-20 250 C 200 180, 420 300, 820 120" stroke="#fbbf24" stroke-width="3" stroke-dasharray="26 18" fill="none" class="anim-dash"/>
            <path d="M-20 290 C 220 220, 440 340, 820 170" stroke="#fff" stroke-width="2" fill="none"/>
            <path d="M-20 210 C 180 140, 400 260, 820 70" stroke="#fff" stroke-width="2" fill="none"/>
          </svg>
          <div class="relative">
            <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-300">DVSA · ADI Part 3 · Standards Check</p>
            <h1 class="mt-3 max-w-3xl text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">${T(D.meta.topic)}</h1>
            <p class="mt-3 text-sm text-slate-300">${isBn() ? "ইনস্ট্রাক্টর" : "Instructor"} <b class="text-white">Mohammed</b> · ${isBn() ? "শিক্ষার্থী" : "Pupil"} <b class="text-white">Jamil</b> · ${isBn() ? "রুট: গুডমেইজ / ইলফোর্ড, কিলডোয়ান রোড টেস্ট সেন্টার" : "Route: Goodmayes / Ilford, Kildowan Road Test Centre"}</p>
            <div class="mt-6 grid gap-3 sm:grid-cols-3">
              <div class="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                <p class="text-xs font-semibold text-slate-300">${isBn() ? "লক্ষ্য" : "Target"}</p>
                <p class="mt-1 text-3xl font-extrabold">43+<span class="text-base font-semibold text-slate-400"> / 51</span></p>
                <p class="text-xs text-emerald-300">${isBn() ? "গ্রেড এ" : "Grade A"}</p>
              </div>
              <div class="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                <p class="text-xs font-semibold text-slate-300">${isBn() ? "রিস্ক ম্যানেজমেন্ট" : "Risk Management"}</p>
                <p class="mt-1 text-3xl font-extrabold">8+<span class="text-base font-semibold text-slate-400"> / 15</span></p>
                <p class="text-xs text-rose-300">${isBn() ? "৭ বা কম = সরাসরি ফেল" : "7 or less = automatic fail"}</p>
              </div>
              <a href="#checklist" class="block rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 transition hover:bg-white/15">
                <p class="text-xs font-semibold text-slate-300">${isBn() ? "আপনার সেলফ-স্কোর" : "Your self-score"}</p>
                <p class="mt-1 text-3xl font-extrabold">${tt.scored ? tt.total : "—"}<span class="text-base font-semibold text-slate-400"> / 51</span></p>
                <p class="text-xs text-slate-300">${tt.scored ? `${tt.scored}/17 ${isBn() ? "স্কোর করা হয়েছে" : "scored"} · ${tt.grade === "Fail" ? (isBn() ? "ফেল" : "Fail") : (isBn() ? "গ্রেড " : "Grade ") + tt.grade}` : (isBn() ? "চেকলিস্টে স্কোর দিন →" : "Score yourself in the checklist →")}</p>
              </a>
            </div>
          </div>
        </section>

        <!-- Score breakdown -->
        <section class="card p-5 sm:p-7">
          <p class="eyebrow">${isBn() ? "স্কোর বিভাজন" : "Score breakdown"}</p>
          <h2 class="h2 mt-1">${isBn() ? "১৭টি দক্ষতা, মোট ৫১ নম্বর" : "17 competencies, 51 marks"}</h2>
          <div class="mt-5 flex h-4 overflow-hidden rounded-full ring-1 ring-slate-200 dark:ring-slate-700">${breakdownBar}</div>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">${areaCards}</div>

          <div class="mt-7">
            <p class="text-sm font-bold text-slate-900 dark:text-white">${isBn() ? "গ্রেড ব্যান্ড" : "Grade bands"}</p>
            <div class="relative mt-8 flex h-9 overflow-visible text-[11px] font-bold">
              <div class="flex items-center justify-center rounded-l-lg bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300" style="width:${pct(31)}%">${t1(s.bands[0])}</div>
              <div class="flex items-center justify-center bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300" style="width:${pct(12)}%">${isBn() ? "বি ৩১–৪২" : "B 31–42"}</div>
              <div class="flex items-center justify-center rounded-r-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300" style="width:${pct(8)}%">A 43+</div>
              ${marker}
            </div>
          </div>

          <ul class="mt-6 grid gap-2 text-sm">
            ${s.rules.map((r) => `<li class="flex gap-2"><span class="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"></span><span>${T(r)}</span></li>`).join("")}
          </ul>
          <div class="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
            ${T({ en: "<b>Note:</b> the brief listed 15 / 15 / 21. The official DVSA form has 4 Lesson Planning, 5 Risk Management and 8 Teaching &amp; Learning competencies, so the correct split is <b>12 / 15 / 24</b>.", bn: "<b>নোট:</b> ব্রিফে ১৫ / ১৫ / ২১ লেখা ছিল। অফিসিয়াল DVSA ফর্মে লেসন প্ল্যানিং ৪টি, রিস্ক ম্যানেজমেন্ট ৫টি ও টিচিং-লার্নিং ৮টি দক্ষতা — তাই সঠিক বিভাজন <b>১২ / ১৫ / ২৪</b>।" })}
          </div>
        </section>

        <!-- Principles -->
        <section>
          <p class="eyebrow">${isBn() ? "মূল নীতি" : "Core instructor principles"}</p>
          <h2 class="h2 mt-1">${isBn() ? "তিনটি নীতি যা গ্রেড এ এনে দেয়" : "Three principles behind a Grade A lesson"}</h2>
          <div class="mt-4 grid gap-4 md:grid-cols-3">${principles}</div>
        </section>

        <!-- Lesson at a glance -->
        <section>
          <div class="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p class="eyebrow">${isBn() ? "এক নজরে লেসন" : "Lesson at a glance"}</p>
              <h2 class="h2 mt-1">${isBn() ? "৪ ফেজ · ৪৫ মিনিট · আত্মবিশ্বাস ৫ → ৮" : "4 phases · 45 minutes · confidence 5 → 8"}</h2>
            </div>
            <div class="flex flex-wrap gap-2">
              <a href="#lesson" class="btn">${isBn() ? "পুরো স্ক্রিপ্ট" : "Full script"}</a>
              <a href="#exam" class="btn btn-primary">${isBn() ? "পরীক্ষার দিনের রান-শিট" : "Exam-day run sheet"} ${I.arrow.replace("text-slate-400", "text-white")}</a>
            </div>
          </div>
          <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">${timeline}</div>
        </section>
      </div>`;
  }

  /* ================================================================
     LESSON PLAN & SCRIPT
     ================================================================ */
  const SPEAKER = {
    M: { name: "Mohammed", init: "M", av: "bg-blue-600 text-white" },
    J: { name: "Jamil", init: "J", av: "bg-slate-700 text-white dark:bg-slate-600" },
    E: { name: "Examiner", init: "E", av: "bg-amber-500 text-white" }
  };
  const FCPS_LABEL = { F: "Fault", C: "Cause", P: "Problem / risk", S: "Solution" };
  const FCPS_BN = { F: "ভুল", C: "কারণ", P: "ঝুঁকি", S: "সমাধান" };
  const FCPS_CLS = { F: "bg-rose-600", C: "bg-amber-500", P: "bg-violet-600", S: "bg-emerald-600" };

  function lineHTML(l) {
    const [sp, text, f] = l;
    if (sp === "N") {
      return `<li class="flex justify-center"><p class="max-w-xl rounded-full border border-dashed border-slate-300 px-3 py-1 text-center text-xs italic text-slate-500 dark:border-slate-700 dark:text-slate-400">${text}</p></li>`;
    }
    const s = SPEAKER[sp];
    const right = sp === "J";
    const badge = f ? `<span class="ml-2 inline-flex items-center gap-1 rounded-full ${FCPS_CLS[f]} px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white">${f} · ${isBn() ? `<span lang="bn">${FCPS_BN[f]}</span>` : FCPS_LABEL[f]}</span>` : "";
    if (sp === "E") {
      return `<li class="flex items-start gap-2.5"><span class="avatar ${s.av}" aria-hidden="true">E</span><p class="rounded-2xl rounded-tl-md bg-amber-50 px-4 py-2.5 text-sm italic text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">${text}</p></li>`;
    }
    return `<li class="flex items-start gap-2.5 ${right ? "flex-row-reverse" : ""}">
      <span class="avatar ${s.av}" aria-hidden="true">${s.init}</span>
      <div class="min-w-0 ${right ? "text-right" : ""}">
        <p class="mb-1 text-[11px] font-bold uppercase tracking-wide text-slate-400">${s.name}${badge}</p>
        <p class="bubble ${right ? "bubble-j text-left" : "bubble-m"}">${text}</p>
      </div>
    </li>`;
  }

  function accordion(id, headHTML, bodyHTML, copyKey, count) {
    const open = state.open.has(id);
    return `<div class="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60" data-acc-item="${id}">
      <div class="flex items-center gap-2 pr-2">
        <button type="button" class="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left" aria-expanded="${open}" aria-controls="acc-${id}" data-acc="${id}">
          <span class="min-w-0 flex-1 font-semibold leading-snug text-slate-900 dark:text-white">${headHTML}</span>
          ${count ? `<span class="hidden shrink-0 text-xs text-slate-400 sm:inline">${count} ${t1(UI.lines)}</span>` : ""}
          <span class="shrink-0 text-slate-400">${I.chev}</span>
        </button>
        ${copyKey ? `<button type="button" class="btn shrink-0" data-copy="${copyKey}" aria-label="Copy">${I.copy}<span class="hidden sm:inline">${t1(UI.copy)}</span></button>` : ""}
      </div>
      <div class="acc-panel" id="acc-${id}" data-open="${open}"><div><div class="border-t border-slate-100 px-4 pb-5 pt-4 dark:border-slate-800">${bodyHTML}</div></div></div>
    </div>`;
  }

  function blockBody(b) {
    const coach = b.coach && state.lang !== "en"
      ? `<div class="mb-4 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100"><span class="shrink-0 font-bold">💡</span><div>${T(b.coach)}</div></div>`
      : b.coach ? `<div class="mb-4 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100"><span class="shrink-0 font-bold">💡</span><div><b>${tPlain(UI.coach)}:</b> ${b.coach.en}</div></div>` : "";
    const fcps = b.fcps ? `<div class="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">${["F", "C", "P", "S"].map((k) => `<div class="rounded-lg ${FCPS_CLS[k]} px-3 py-2 text-white"><p class="text-lg font-extrabold leading-none">${k}</p><p class="mt-1 text-xs font-semibold opacity-90">${state.lang === "bn" ? `<span lang="bn">${FCPS_BN[k]}</span>` : FCPS_LABEL[k] + (state.lang === "both" ? ` · <span lang="bn">${FCPS_BN[k]}</span>` : "")}</p></div>`).join("")}</div>` : "";
    return `${coach}${fcps}<ol class="space-y-3">${b.lines.map(lineHTML).join("")}</ol>`;
  }

  function routeHTML(route) {
    return `<ol class="flex flex-wrap items-center gap-1.5">${route.map((r, i) => `<li class="flex items-center gap-1.5">${i ? I.arrow : ""}<span class="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 ${i === 0 || i === route.length - 1 ? "ring-1 ring-blue-400/50" : ""}">${r}</span></li>`).join("")}</ol>`;
  }

  function confidenceScale(c) {
    const ticks = Array.from({ length: 10 }, (_, i) => i + 1);
    const pos = (v) => ((v - 1) / 9) * 100;
    const mk = (v, label, cls) => `<div class="absolute top-0 -translate-x-1/2 text-center" style="left:${pos(v)}%"><div class="mx-auto h-5 w-5 rounded-full border-[3px] border-white ${cls} shadow dark:border-slate-900"></div><p class="mt-1 whitespace-nowrap text-[11px] font-bold text-slate-600 dark:text-slate-300">${label}</p></div>`;
    return `<div class="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <p class="text-sm font-bold text-slate-900 dark:text-white">${T({ en: "Confidence scale", bn: "আত্মবিশ্বাস স্কেল" })}</p>
      <div class="relative mx-3 mt-5 h-14">
        <div class="absolute left-0 right-0 top-2 h-1.5 rounded-full bg-gradient-to-r from-rose-300 via-amber-300 to-emerald-400"></div>
        <div class="absolute left-0 right-0 top-6 flex justify-between text-[10px] font-semibold text-slate-400">${ticks.map((t) => `<span class="w-0 text-center">${t}</span>`).join("")}</div>
      </div>
      <div class="relative mx-3 -mt-12 h-16">
        ${mk(c.start, isBn() ? "শুরু ৫" : "Start 5", "bg-rose-500")}
        ${mk(c.mid, isBn() ? "মাঝে ৭" : "Mid 7", "bg-amber-500")}
        ${mk(c.end, isBn() ? "শেষ ৮" : "End 8", "bg-emerald-500")}
      </div>
    </div>`;
  }

  /* ---- Interactive road diagram (Phase 2) ---- */
  const SCEN = {
    ours: {
      label: { en: "Parked on our side", bn: "আমাদের পাশে পার্ক করা" },
      verdict: { en: "Hold back in the gap. The oncoming driver has the clearer route.", bn: "গ্যাপে অপেক্ষা করুন। বিপরীত দিকের চালকের রাস্তা পরিষ্কার।" },
      parkedTop: [300, 378, 456], parkedBot: [],
      gap: { x: 190, y: 56, w: 96 },
      us: { from: 10, to: 206 }, them: { from: 650, to: 60 }, door: 300
    },
    theirs: {
      label: { en: "Parked on their side", bn: "তাদের পাশে পার্ক করা" },
      verdict: { en: "We may have priority — proceed with care, never force it. They should wait.", bn: "আমাদের অগ্রাধিকার থাকতে পারে — সাবধানে এগোন, জোর করবেন না। তারা অপেক্ষা করবে।" },
      parkedTop: [], parkedBot: [250, 328, 406],
      gap: { x: 486, y: 150, w: 96 },
      us: { from: 10, to: 620 }, them: { from: 650, to: 504 }, door: null
    },
    both: {
      label: { en: "Parked on both sides", bn: "দুই পাশেই পার্ক করা" },
      verdict: { en: "Negotiate. Use the first safe gap on your side and let them through.", bn: "সমঝোতা করুন। আপনার পাশের প্রথম নিরাপদ গ্যাপে থেমে তাদের যেতে দিন।" },
      parkedTop: [120, 198, 420, 498], parkedBot: [290, 368, 560],
      gap: { x: 278, y: 56, w: 132 },
      us: { from: 10, to: 300 }, them: { from: 650, to: 30 }, door: 420
    }
  };
  function carSVG(x, y, color, dir, extra = "") {
    // dir: 1 = facing right, -1 = facing left
    const ws = dir === 1 ? `<rect x="44" y="5" width="10" height="20" rx="3" fill="#cbd5e1" opacity=".9"/>` : `<rect x="10" y="5" width="10" height="20" rx="3" fill="#cbd5e1" opacity=".9"/>`;
    return `<g ${extra} style="transform:translate(${x}px,${y}px)"><rect width="64" height="30" rx="8" fill="${color}"/>${ws}<rect x="22" y="6" width="20" height="18" rx="3" fill="#000" opacity=".12"/></g>`;
  }
  function roadDiagram() {
    const sc = SCEN[state.scenario];
    const parked = (xs, y) => xs.map((x) => `<g transform="translate(${x},${y})"><rect width="70" height="32" rx="7" class="fill-slate-300 dark:fill-slate-500"/><rect x="8" y="6" width="12" height="20" rx="3" class="fill-slate-400/60 dark:fill-slate-600"/></g>`).join("");
    const door = sc.door !== null ? `<g transform="translate(${sc.door + 10},88)"><line x1="0" y1="0" x2="16" y2="10" stroke="#f43f5e" stroke-width="4" stroke-linecap="round"/></g>
      <g transform="translate(${sc.door - 4},88)"><line x1="0" y1="0" x2="0" y2="24" stroke="#f59e0b" stroke-width="2" marker-start="url(#ah)" marker-end="url(#ah)"/><text x="-6" y="16" text-anchor="end" font-size="11" font-weight="700" class="fill-amber-600 dark:fill-amber-400">≈1 m</text></g>` : "";
    return `
      <svg viewBox="0 0 720 240" class="h-auto w-full" role="img" aria-label="${tPlain(sc.label)} — ${tPlain(sc.verdict)}">
        <defs><marker id="ah" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" fill="#f59e0b"/></marker></defs>
        <rect width="720" height="240" class="fill-slate-200 dark:fill-slate-800"/>
        <rect y="48" width="720" height="144" class="fill-slate-600 dark:fill-slate-700"/>
        <line x1="0" x2="720" y1="120" y2="120" stroke="#fff" stroke-width="3" stroke-dasharray="22 16" opacity=".8"/>
        <text x="12" y="38" font-size="12" font-weight="700" class="fill-slate-500 dark:fill-slate-400">${isBn() ? "আমাদের লেন →" : "Our lane →"}</text>
        <text x="708" y="214" text-anchor="end" font-size="12" font-weight="700" class="fill-slate-500 dark:fill-slate-400">${isBn() ? "← বিপরীতমুখী" : "← Oncoming"}</text>
        ${parked(sc.parkedTop, 54)}${parked(sc.parkedBot, 154)}
        <g><rect x="${sc.gap.x}" y="${sc.gap.y}" width="${sc.gap.w}" height="34" rx="8" fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-dasharray="6 5"/>
          <rect x="${sc.gap.x}" y="${sc.gap.y}" width="${sc.gap.w}" height="34" rx="8" fill="#fbbf24" opacity=".18" class="pulse-ring"/>
          <text x="${sc.gap.x + sc.gap.w / 2}" y="${sc.gap.y < 100 ? sc.gap.y - 6 : sc.gap.y + 48}" text-anchor="middle" font-size="12" font-weight="800" fill="#f59e0b">${isBn() ? "অপেক্ষার গ্যাপ" : "WAIT GAP"}</text></g>
        ${door}
        ${carSVG(sc.us.from, 60, "#2563eb", 1, 'id="carUs" class="road-car"')}
        ${carSVG(sc.them.from, 152, "#f59e0b", -1, 'id="carThem" class="road-car"')}
      </svg>`;
  }
  function playScenario() {
    const sc = SCEN[state.scenario];
    const us = $("#carUs"), them = $("#carThem");
    if (!us || !them) return;
    [us, them].forEach((el) => (el.style.transition = "none"));
    us.style.transform = `translate(${sc.us.from}px,60px)`;
    them.style.transform = `translate(${sc.them.from}px,152px)`;
    void us.getBoundingClientRect();
    requestAnimationFrame(() => {
      [us, them].forEach((el) => (el.style.transition = ""));
      if (state.scenario === "theirs") {
        // they stop in their gap first, then we pass
        them.style.transform = `translate(${sc.them.to}px,152px)`;
        setTimeout(() => (us.style.transform = `translate(${sc.us.to}px,60px)`), 700);
      } else {
        us.style.transform = `translate(${sc.us.to}px,60px)`;
        setTimeout(() => (them.style.transform = `translate(${sc.them.to}px,152px)`), 900);
      }
    });
  }

  function phase2Extras(p) {
    const st = p.stopping;
    const facts = p.keyFacts.map((f) => `<div class="rounded-xl border border-slate-200 p-3 dark:border-slate-800"><p class="text-sm font-bold text-slate-900 dark:text-white">${T(f.label)}</p><p class="mt-1 text-sm text-slate-600 dark:text-slate-300">${T(f.value)}</p></div>`).join("");
    const ladder = p.dualControl.map((d) => `<li class="flex gap-3"><span class="grid h-7 w-7 shrink-0 place-items-center rounded-full ${["bg-sky-500", "bg-amber-500", "bg-rose-600", "bg-emerald-600"][d.step - 1]} text-xs font-extrabold text-white">${d.step}</span><p class="pt-0.5 text-sm">${T(d)}</p></li>`).join("");
    return `
      <div class="grid gap-4 lg:grid-cols-5">
        <div class="rounded-xl border border-slate-200 p-4 lg:col-span-3 dark:border-slate-800">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <p class="text-sm font-bold text-slate-900 dark:text-white">${T({ en: "Briefing diagram — who waits?", bn: "ব্রিফিং ডায়াগ্রাম — কে অপেক্ষা করবে?" })}</p>
            <button type="button" class="btn" data-replay>${I.replay}${isBn() ? "আবার চালান" : "Replay"}</button>
          </div>
          <div class="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Scenario">
            ${Object.keys(SCEN).map((k) => `<button type="button" data-scen="${k}" aria-pressed="${state.scenario === k}" class="rounded-full border px-3 py-1 text-xs font-semibold transition ${state.scenario === k ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 text-slate-600 hover:border-blue-300 dark:border-slate-700 dark:text-slate-300"}">${t1(SCEN[k].label)}</button>`).join("")}
          </div>
          <div class="mt-3 overflow-hidden rounded-lg" id="roadWrap">${roadDiagram()}</div>
          <p class="mt-3 rounded-lg bg-blue-50 p-3 text-sm font-semibold text-blue-900 dark:bg-blue-950/50 dark:text-blue-100" id="scenVerdict">${T(SCEN[state.scenario].verdict)}</p>
        </div>
        <div class="grid gap-4 lg:col-span-2">
          <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <p class="text-sm font-bold text-slate-900 dark:text-white">${T({ en: `Stopping distance at ${st.mph} mph`, bn: `${bnNum(st.mph)} মাইল/ঘণ্টায় থামার দূরত্ব` })}</p>
            <div class="mt-3 space-y-3 text-xs font-semibold">
              <div><div class="mb-1 flex justify-between"><span>${isBn() ? "শুকনো" : "Dry"}</span><span>${st.dry} m · ${isBn() ? "≈৬ গাড়ির দৈর্ঘ্য" : "≈6 car lengths"}</span></div>
                <div class="h-3 rounded-full bg-slate-100 dark:bg-slate-800"><div class="flex h-3 overflow-hidden rounded-full" style="width:${(st.dry / st.wet) * 100}%"><div class="h-full bg-sky-300" style="width:${(9 / 23) * 100}%" title="Thinking 9 m"></div><div class="h-full bg-sky-600" style="width:${(14 / 23) * 100}%" title="Braking 14 m"></div></div></div>
                <p class="mt-1 font-normal text-slate-500">${isBn() ? "চিন্তা ৯ মি + ব্রেকিং ১৪ মি" : "Thinking 9 m + braking 14 m"}</p></div>
              <div><div class="mb-1 flex justify-between"><span>${isBn() ? "ভেজা (কমপক্ষে দ্বিগুণ)" : "Wet (at least double)"}</span><span>${st.wet} m</span></div>
                <div class="h-3 rounded-full bg-blue-700 dark:bg-blue-500"></div></div>
            </div>
          </div>
          <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <p class="text-sm font-bold text-slate-900 dark:text-white">${T({ en: "Dual-control safety protocol", bn: "ডুয়াল-কন্ট্রোল নিরাপত্তা প্রোটোকল" })}</p>
            <ol class="mt-3 space-y-3">${ladder}</ol>
          </div>
        </div>
      </div>
      <div class="grid gap-3 sm:grid-cols-2">${facts}</div>`;
  }

  function phase1Extras(p) {
    const smart = p.smart.map((s) => `<div class="rounded-xl border border-slate-200 p-3 dark:border-slate-800"><span class="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-sm font-extrabold text-white">${s.k}</span><p class="mt-2 text-sm">${T(s)}</p></div>`).join("");
    return `<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">${smart}</div>${confidenceScale(p.confidence)}`;
  }

  function blocksHTML(prefix, blocks, copyPrefix) {
    return blocks.map((b, i) => accordion(`${prefix}-b${i}`, T(b.title), blockBody(b), `${copyPrefix}:${i}`, b.lines.length)).join("");
  }

  function renderLesson() {
    const phases = D.phases.map((p) => {
      let extras = "", body = "";
      if (p.id === "p1") extras = phase1Extras(p);
      if (p.id === "p2") extras = phase2Extras(p);
      if (p.id === "p3") {
        body = `<div class="rounded-xl border border-dashed border-slate-300 p-3 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">${T(p.routeNote)}</div>` +
          p.levels.map((lv) => `
          <div class="scroll-mt-44 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-950/40" id="lesson-${lv.id}">
            <div class="flex flex-wrap items-center gap-2">
              <span class="rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-extrabold text-white">${isBn() ? "লেভেল" : "Level"} ${lv.level}</span>
              <h4 class="font-extrabold text-slate-900 dark:text-white">${t1(lv.name)}</h4>
              <span class="ml-auto"></span>
              <button type="button" class="btn" data-copy="level:${lv.id}">${I.copy}${isBn() ? "লেভেল কপি" : "Copy level"}</button>
            </div>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">${T(lv.desc)}</p>
            <div class="mt-3">${routeHTML(lv.route)}</div>
            <div class="mt-4 grid gap-2">${blocksHTML(`${lv.id}`, lv.blocks, `lvl:${lv.id}`)}</div>
          </div>`).join("");
      } else {
        body = blocksHTML(p.id, p.blocks, `blk:${p.id}`);
      }
      return `
      <section class="card scroll-mt-44 p-5 sm:p-7" id="lesson-${p.id}">
        <div class="flex flex-wrap items-start gap-3">
          <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl ${PHASE_COLOR[p.id].dot} text-lg font-extrabold text-white">${p.num}</span>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-bold uppercase tracking-wider ${PHASE_COLOR[p.id].text}">${isBn() ? "ফেজ" : "Phase"} ${p.num} · ${p.area}</p>
            <h3 class="mt-0.5 text-lg font-extrabold leading-snug text-slate-900 sm:text-xl dark:text-white">${T(p.title)}</h3>
          </div>
          <div class="flex w-full items-center gap-2 pl-14 sm:w-auto sm:pl-0">
            <span class="chip">⏱ ${p.time}</span>
            <button type="button" class="btn" data-copy="phase:${p.id}">${I.copy}${t1(UI.copyPhase)}</button>
          </div>
        </div>
        <p class="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">${T(p.summary)}</p>
        ${extras ? `<div class="mt-5 grid gap-4">${extras}</div>` : ""}
        <div class="mt-5 grid gap-3">${body}</div>
      </section>`;
    }).join("");

    $("#panel-lesson").innerHTML = `
      <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p class="eyebrow">${isBn() ? "৪-ফেজ লেসন প্ল্যান" : "4-phase lesson plan"}</p>
          <h2 class="h2 mt-1">${isBn() ? "সম্পূর্ণ স্ক্রিপ্ট: মোহাম্মদ ও জামিল" : "Exact script: Mohammed & Jamil"}</h2>
        </div>
        <div class="flex flex-wrap gap-2">
          <button type="button" class="btn" data-expand="all">${t1(UI.expandAll)}</button>
          <button type="button" class="btn" data-expand="none">${t1(UI.collapseAll)}</button>
          <button type="button" class="btn btn-primary" data-copy="all">${I.copy}${t1(UI.copyAll)}</button>
        </div>
      </div>
      <nav class="no-scrollbar sticky top-[106px] z-20 -mx-4 mb-5 flex gap-2 overflow-x-auto bg-slate-50/90 px-4 py-2 backdrop-blur dark:bg-slate-950/90" aria-label="Phases">
        ${D.phases.map((p) => `<a href="#lesson/${p.id}" class="flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-blue-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"><span class="h-2 w-2 rounded-full ${PHASE_COLOR[p.id].dot}"></span>${p.num}. ${t1(p.title)} <span class="text-slate-400">${p.time}</span></a>`).join("")}
      </nav>
      <div class="grid grid-cols-1 gap-6">${phases}</div>`;
    playScenario();
  }

  /* ================================================================
     VIDEO GUIDE
     ================================================================ */
  function promptFor(s) {
    const chars = s.chars.map((tag) => { const c = D.characters.find((x) => x.tag === tag); return c ? `${tag}: ${c.en}` : tag; }).join(" ");
    return `${D.style}\nScene ${s.n} — ${s.title.en}.\nCharacters: ${chars}\nAction: ${s.action}\nCamera: ${s.camera}.\nLighting: ${s.lighting}.`;
  }
  function videoEmbed(url) {
    const u = String(url).trim();
    let m = u.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/);
    if (m) return `<iframe class="h-full w-full" src="https://www.youtube-nocookie.com/embed/${esc(m[1])}" title="Scene video" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe>`;
    m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (m) return `<iframe class="h-full w-full" src="https://player.vimeo.com/video/${esc(m[1])}" title="Scene video" allow="fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
    return `<video class="h-full w-full bg-black object-contain" src="${esc(u)}" controls playsinline preload="metadata"></video>`;
  }
  function placeholderSVG(s) {
    const c = PHASE_COLOR[s.phase].hex;
    const bend = s.n === 8;
    return `<svg viewBox="0 0 320 180" class="h-full w-full" aria-hidden="true">
      <defs><linearGradient id="sky${s.n}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}" stop-opacity=".55"/><stop offset="1" stop-color="#0f172a"/></linearGradient></defs>
      <rect width="320" height="180" fill="url(#sky${s.n})"/>
      <g opacity=".35" fill="#0f172a">${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${i * 56 - 6} 92 l26 -22 l26 22 v14 h-52z"/>`).join("")}</g>
      <path d="${bend ? "M120 180 C 140 130, 230 120, 240 92 L 270 92 C 262 130, 190 140, 200 180 Z" : "M80 180 L150 92 L170 92 L240 180 Z"}" fill="#334155"/>
      <path d="${bend ? "M160 180 C 175 140, 240 125, 255 92" : "M160 180 L160 92"}" stroke="#fbbf24" stroke-width="2" stroke-dasharray="8 8" fill="none" class="anim-dash"/>
      <rect x="${bend ? 128 : 98}" y="146" width="22" height="12" rx="3" fill="#94a3b8"/><rect x="${bend ? 210 : 206}" y="132" width="18" height="10" rx="3" fill="#94a3b8"/>
      <text x="16" y="34" font-size="26" font-weight="800" fill="#fff" font-family="Manrope, sans-serif">${String(s.n).padStart(2, "0")}</text>
    </svg>`;
  }
  function sceneCard(s) {
    const url = state.localVideos[s.n] || store.get(`adi3-video-${s.n}`, "");
    const media = url
      ? `<div class="aspect-video overflow-hidden rounded-t-2xl bg-black">${videoEmbed(url)}</div>`
      : `<div class="relative aspect-video overflow-hidden rounded-t-2xl">${placeholderSVG(s)}
          <div class="absolute inset-0 grid place-items-center"><span class="grid h-14 w-14 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur">${I.play}</span></div>
          <span class="absolute bottom-2 right-2 rounded-md bg-black/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">${isBn() ? "ভিডিও যোগ করা হয়নি" : "No video yet"}</span></div>`;
    const body = `
      <dl class="grid gap-3 text-sm">
        <div><dt class="text-xs font-bold uppercase tracking-wide text-slate-400">${isBn() ? "চরিত্র" : "Characters"}</dt><dd class="mt-1 flex flex-wrap gap-1">${s.chars.map((c) => `<span class="chip font-mono">${c}</span>`).join("")}</dd></div>
        <div><dt class="text-xs font-bold uppercase tracking-wide text-slate-400">${isBn() ? "অ্যাকশন" : "Action"}</dt><dd class="mt-1">${s.action}</dd></div>
        <div class="grid gap-3 sm:grid-cols-2">
          <div><dt class="text-xs font-bold uppercase tracking-wide text-slate-400">🎥 ${isBn() ? "ক্যামেরা অ্যাঙ্গেল" : "Camera angle"}</dt><dd class="mt-1">${s.camera}</dd></div>
          <div><dt class="text-xs font-bold uppercase tracking-wide text-slate-400">💡 ${isBn() ? "লাইটিং" : "Lighting"}</dt><dd class="mt-1">${s.lighting}</dd></div>
        </div>
        <div><dt class="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-slate-400"><span>${isBn() ? "পূর্ণ এআই প্রম্পট" : "Full AI prompt"}</span><button type="button" class="btn normal-case tracking-normal" data-copy="prompt:${s.n}">${I.copy}${t1(UI.copy)}</button></dt>
          <dd class="mt-2 whitespace-pre-wrap rounded-lg bg-slate-900 p-3 font-mono text-[12px] leading-relaxed text-slate-100 dark:bg-black/60">${esc(promptFor(s))}</dd></div>
      </dl>`;
    return `
      <article class="card flex flex-col" data-scene="${s.n}">
        ${media}
        <div class="flex flex-1 flex-col gap-3 p-4">
          <div class="flex items-start gap-2">
            <span class="mt-1 h-2 w-2 shrink-0 rounded-full ${PHASE_COLOR[s.phase].dot}"></span>
            <h3 class="flex-1 font-bold leading-snug text-slate-900 dark:text-white">${T(s.title)}</h3>
          </div>
          <form class="flex gap-2" data-video-form="${s.n}">
            <input type="url" inputmode="url" placeholder="${isBn() ? "ভিডিও লিংক (MP4, YouTube, Vimeo)" : "Video link (MP4, YouTube, Vimeo)"}" value="${esc(store.get(`adi3-video-${s.n}`, ""))}" class="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-800" aria-label="Video URL for scene ${s.n}" />
            <button class="btn" type="submit">${isBn() ? "সেভ" : "Save"}</button>
            <label class="btn cursor-pointer" title="${isBn() ? "ডিভাইস থেকে ফাইল (শুধু এই সেশনে)" : "Local file (this session only)"}">📁<input type="file" accept="video/*" class="sr-only" data-video-file="${s.n}" /></label>
            ${url ? `<button class="btn" type="button" data-video-clear="${s.n}" aria-label="Remove video">${I.x}</button>` : ""}
          </form>
          ${accordion(`scene-${s.n}`, `<span class="text-sm">${isBn() ? "সিন ব্রেকডাউন ও প্রম্পট" : "Scene breakdown & prompt"}</span>`, body, null)}
        </div>
      </article>`;
  }
  function renderVideos() {
    const chars = D.characters.map((c) => `
      <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
        <div class="flex items-center justify-between gap-2"><p class="font-mono text-sm font-bold text-blue-700 dark:text-blue-300">${c.tag}</p><button type="button" class="btn" data-copy="char:${c.tag}" aria-label="Copy">${I.copy}</button></div>
        <p class="mt-0.5 text-xs font-semibold text-slate-500">${c.name}</p>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">${T({ en: c.en, bn: c.bn })}</p>
      </div>`).join("");
    const scenes = D.scenes.filter((s) => state.phaseFilter === "all" || s.phase === state.phaseFilter);
    const filters = [["all", isBn() ? "সব (১২)" : "All (12)"]].concat(D.phases.map((p) => [p.id, `${isBn() ? "ফেজ" : "Phase"} ${p.num}`]));
    $("#panel-videos").innerHTML = `
      <div class="grid grid-cols-1 gap-6">
        <div>
          <p class="eyebrow">${isBn() ? "অ্যানিমেশন গাইড" : "Video animation guide"}</p>
          <h2 class="h2 mt-1">${isBn() ? "১২টি অ্যানিমেটেড ৩ডি সিন" : "12 animated 3D scenes"}</h2>
          <p class="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">${T({ en: "Each scene has a player slot, camera angle, lighting and a ready-to-paste AI prompt. Paste a video link (MP4, YouTube or Vimeo) to attach your rendered clip — links are saved in this browser.", bn: "প্রতিটি সিনে প্লেয়ার, ক্যামেরা অ্যাঙ্গেল, লাইটিং ও কপি করার মতো এআই প্রম্পট আছে। রেন্ডার করা ক্লিপ যোগ করতে ভিডিও লিংক (MP4, YouTube বা Vimeo) পেস্ট করুন — লিংক এই ব্রাউজারে সেভ থাকবে।" })}</p>
        </div>
        <section class="card p-5">
          <div class="flex flex-wrap items-center justify-between gap-2"><p class="font-bold text-slate-900 dark:text-white">${isBn() ? "স্টাইল ও চরিত্র" : "Global style & characters"}</p><button type="button" class="btn" data-copy="style">${I.copy}${isBn() ? "স্টাইল কপি" : "Copy style"}</button></div>
          <p class="mt-2 rounded-lg bg-slate-100 p-3 font-mono text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200">${D.style}</p>
          <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">${chars}</div>
        </section>
        <div class="flex flex-wrap gap-2" role="group" aria-label="Filter scenes">
          ${filters.map(([k, l]) => `<button type="button" data-filter="${k}" aria-pressed="${state.phaseFilter === k}" class="rounded-full border px-3 py-1.5 text-xs font-semibold transition ${state.phaseFilter === k ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"}">${l}</button>`).join("")}
        </div>
        <div class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">${scenes.map(sceneCard).join("")}</div>
      </div>`;
  }

  /* ================================================================
     EXAMINER CHECKLIST
     ================================================================ */
  function renderChecklist() {
    const tt = totals();
    const areaRow = (a) => {
      const v = tt.by[a.key];
      const pct = (v / a.max) * 100;
      const extra = a.key === "rm" && tt.scored ? (tt.rmFail ? `<span class="text-rose-600 dark:text-rose-400">${I.x}</span>` : `<span class="text-emerald-600 dark:text-emerald-400">${I.check}</span>`) : "";
      return `<div><div class="flex items-center justify-between text-xs font-semibold"><span class="${AREA[a.key].text}">${t1(a)}</span><span class="flex items-center gap-1">${extra}${v} / ${a.max}</span></div>
        <div class="mt-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800"><div class="h-2 rounded-full ${AREA[a.key].bar} transition-all" style="width:${pct}%"></div></div></div>`;
    };
    const status = (ok, en, bn) => `<li class="flex items-center gap-2 text-sm ${ok ? "text-emerald-700 dark:text-emerald-300" : "text-slate-500 dark:text-slate-400"}"><span class="grid h-5 w-5 place-items-center rounded-full ${ok ? "bg-emerald-100 dark:bg-emerald-900/60" : "bg-slate-100 dark:bg-slate-800"}">${ok ? I.check : "<span class='h-1.5 w-1.5 rounded-full bg-current'></span>"}</span>${isBn() ? `<span lang="bn">${bn}</span>` : en}</li>`;

    const groups = D.scoring.areas.map((a) => {
      const items = D.competencies.filter((c) => c.area === a.key).map((c) => {
        const v = state.scores[c.n];
        const lab = typeof v === "number" ? D.scoreLabels[v] : null;
        return `<li class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900" data-comp="${c.n}">
          <div class="flex gap-3">
            <span class="grid h-8 w-8 shrink-0 place-items-center rounded-lg ${AREA[a.key].soft} text-sm font-extrabold ${AREA[a.key].text}">${c.n}</span>
            <div class="min-w-0 flex-1">
              <p class="font-semibold leading-snug text-slate-900 dark:text-white">${T({ en: c.en, bn: c.bn })}</p>
              <p class="mt-2 text-sm text-slate-600 dark:text-slate-300"><span class="font-semibold text-slate-500">${isBn() ? "এই লেসনে:" : "In this lesson:"}</span> ${T(c.evidence)}</p>
              <div class="mt-3 flex flex-wrap items-center gap-2">
                <div class="flex gap-1.5" role="group" aria-label="Score for competency ${c.n}">
                  ${[0, 1, 2, 3].map((n) => `<button type="button" class="score-btn" data-score="${c.n}" data-v="${n}" aria-pressed="${v === n}" title="${D.scoreLabels[n].en}">${n}</button>`).join("")}
                </div>
                <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">${lab ? t1(lab) : (isBn() ? "স্কোর দেওয়া হয়নি" : "Not scored")}</span>
              </div>
            </div>
          </div>
        </li>`;
      }).join("");
      return `<section>
        <div class="mb-3 flex items-center gap-2"><span class="h-3 w-3 rounded-full ${AREA[a.key].bar}"></span><h3 class="font-extrabold text-slate-900 dark:text-white">${t1(a)}</h3><span class="chip">${tt.by[a.key]} / ${a.max}</span></div>
        <ul class="grid gap-3">${items}</ul>
      </section>`;
    }).join("");

    $("#panel-checklist").innerHTML = `
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div class="order-2 grid min-w-0 gap-8 lg:order-1">
          <div>
            <p class="eyebrow">${isBn() ? "১৭টি DVSA দক্ষতা" : "17 DVSA competencies"}</p>
            <h2 class="h2 mt-1">${isBn() ? "এক্সামিনার চেকলিস্ট" : "Examiner checklist"}</h2>
            <p class="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">${T({ en: "Score each competency 0–3 after a practice run, exactly as the examiner would. Scores are saved in this browser.", bn: "প্র্যাকটিসের পরে এক্সামিনারের মতো প্রতিটি দক্ষতায় ০–৩ স্কোর দিন। স্কোর এই ব্রাউজারে সেভ থাকবে।" })}</p>
          </div>
          ${groups}
        </div>
        <aside class="order-1 lg:order-2">
          <div class="card sticky top-[120px] p-5">
            <div class="flex items-center justify-between"><p class="text-sm font-bold text-slate-900 dark:text-white">${isBn() ? "আপনার স্কোর" : "Your score"}</p>${gradeBadge(tt.grade, tt.scored)}</div>
            <p class="mt-2 text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">${tt.total}<span class="text-xl font-semibold text-slate-400"> / 51</span></p>
            <p class="text-xs text-slate-500">${tt.scored} / 17 ${isBn() ? "স্কোর করা হয়েছে" : "scored"}</p>
            <div class="mt-4 grid gap-3">${D.scoring.areas.map(areaRow).join("")}</div>
            <ul class="mt-5 grid gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
              ${status(tt.scored === 17, "All 17 competencies scored", "১৭টি দক্ষতাই স্কোর করা হয়েছে")}
              ${status(tt.scored > 0 && !tt.rmFail, "Risk Management 8+ (no auto-fail)", "রিস্ক ম্যানেজমেন্ট ৮+ (সরাসরি ফেল নয়)")}
              ${status(tt.total >= 31 && !tt.rmFail, "Pass — Grade B or above (31+)", "পাস — গ্রেড বি বা তার উপরে (৩১+)")}
              ${status(tt.total >= 43 && !tt.rmFail, "Target met — Grade A (43+)", "লক্ষ্য অর্জিত — গ্রেড এ (৪৩+)")}
            </ul>
            <div class="mt-5 flex gap-2">
              <button type="button" class="btn flex-1" data-fill="3">${isBn() ? "সব ৩ দিন" : "Set all to 3"}</button>
              <button type="button" class="btn flex-1" data-reset>${isBn() ? "রিসেট" : "Reset"}</button>
            </div>
          </div>
        </aside>
      </div>`;
  }

  /* ================================================================
     EXAM DAY — run sheet + rehearsal
     ================================================================ */
  const X = window.EXAM;
  const LEVEL_CLS = {
    1: { badge: "bg-sky-500", text: "text-sky-700 dark:text-sky-300", line: "bg-sky-200 dark:bg-sky-900" },
    2: { badge: "bg-violet-500", text: "text-violet-700 dark:text-violet-300", line: "bg-violet-200 dark:bg-violet-900" },
    3: { badge: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-300", line: "bg-emerald-200 dark:bg-emerald-900" }
  };
  state.examMode = store.get("adi3-exam-mode", "read");
  state.ticks = new Set(store.get("adi3-ticks", []));
  state.deckFilter = store.get("adi3-deck-filter", "all");
  state.deckIdx = 0;
  state.reveal = false;
  let timerStart = null, timerIv = null;

  const sayBubble = (text, label) => `<div class="flex items-start gap-2"><span class="avatar bg-blue-600 text-white" aria-hidden="true">M</span><div class="min-w-0"><p class="mb-1 text-[11px] font-bold uppercase tracking-wide text-slate-400">${label || "Say"}</p><p class="bubble bubble-m">${text}</p></div></div>`;
  const miniList = (label, arr, cls) => arr && arr.length ? `<div class="mt-3"><p class="text-[11px] font-bold uppercase tracking-wide ${cls || "text-slate-400"}">${label}</p><ul class="mt-1.5 grid gap-1.5">${arr.map((q) => `<li class="flex gap-2 text-sm"><span class="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500"></span><span>“${q}”</span></li>`).join("")}</ul></div>` : "";
  const tipBox = (o) => o ? `<div class="mt-4 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100"><span class="shrink-0">💡</span><div>${T(o)}</div></div>` : "";
  const stageHead = (icon, title, time, id, copyKey) => `
    <div class="flex flex-wrap items-center gap-3">
      <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-900 text-xl dark:bg-slate-800" aria-hidden="true">${icon}</span>
      <h3 class="min-w-0 flex-1 text-lg font-extrabold leading-snug text-slate-900 sm:text-xl dark:text-white">${T(title)}</h3>
      <div class="flex w-full items-center gap-2 pl-14 sm:w-auto sm:pl-0">
        ${time ? `<span class="chip">⏱ ${time}</span>` : ""}
        ${copyKey ? `<button type="button" class="btn" data-copy="${copyKey}">${I.copy}${t1(UI.copy)}</button>` : ""}
      </div>
    </div>`;

  function stepHTML(s) {
    const L = LEVEL_CLS[s.level];
    const bend = s.branch ? `
      <div class="mt-4 grid gap-3 lg:grid-cols-2">
        ${["fault", "good"].map((k) => `<div class="rounded-xl border ${k === "fault" ? "border-rose-200 dark:border-rose-900" : "border-emerald-200 dark:border-emerald-900"} p-3">
          <p class="mb-3 text-sm font-bold ${k === "fault" ? "text-rose-700 dark:text-rose-300" : "text-emerald-700 dark:text-emerald-300"}">${k === "fault" ? "⚠️" : "✅"} ${T(X.bend[k].title)}</p>
          <ol class="space-y-3">${X.bend[k].lines.map(lineHTML).join("")}</ol></div>`).join("")}
      </div>` : "";
    return `<li class="relative flex gap-3 pb-6 last:pb-0">
      <span class="absolute left-[15px] top-9 bottom-0 w-0.5 ${L.line}" aria-hidden="true"></span>
      <span class="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full ${L.badge} text-xs font-extrabold text-white">${s.n}</span>
      <div class="min-w-0 flex-1">
        <p class="pt-1 font-extrabold text-slate-900 dark:text-white">${s.road}</p>
        <p class="mt-0.5 text-sm text-slate-600 dark:text-slate-300">${T(s.focus)}</p>
        <div class="mt-3">${sayBubble(s.dir, isBn() ? "দিকনির্দেশনা" : "Direction")}</div>
        ${miniList(isBn() ? "জিজ্ঞেস করুন" : "Ask", s.say)}
        ${miniList(isBn() ? "অপেক্ষার সময়" : "While waiting", s.wait, "text-amber-600 dark:text-amber-400")}
        ${miniList(isBn() ? "মোড়ের পরে" : "After the turn", s.after)}
        ${s.jamil ? `<p class="mt-3 text-sm text-slate-500 dark:text-slate-400"><b class="text-slate-600 dark:text-slate-300">${isBn() ? "জামিলের সম্ভাব্য উত্তর:" : "Jamil might say:"}</b> “${s.jamil}”</p>` : ""}
        ${s.praise ? `<p class="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"><b>${isBn() ? "প্রশংসা:" : "Praise:"}</b> “${s.praise}”</p>` : ""}
        ${s.note ? `<p class="mt-2 text-xs font-semibold text-amber-700 dark:text-amber-400">⚑ ${T(s.note)}</p>` : ""}
        ${bend}
      </div>
    </li>`;
  }

  function checklistHTML(c, si, ci) {
    return `<div class="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <p class="text-sm font-bold text-slate-900 dark:text-white">${T(c.title)}</p>
      <ul class="mt-3 grid gap-2">${c.items.map((it, ii) => {
        const id = `${si}-${ci}-${ii}`; const on = state.ticks.has(id);
        return `<li><button type="button" data-tick="${id}" aria-pressed="${on}" class="flex w-full items-start gap-2.5 rounded-lg p-1.5 text-left text-sm transition hover:bg-slate-50 dark:hover:bg-slate-800/60">
          <span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border ${on ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300 dark:border-slate-600"}">${on ? I.check : ""}</span>
          <span class="${on ? "text-slate-400 line-through" : ""}">${T(it)}</span></button></li>`;
      }).join("")}</ul></div>`;
  }

  function renderExamRead() {
    const before = X.stages[0], arrive = X.stages[1], intro = X.stages[2];
    const levels = [1, 2, 3].map((lv) => `
      <section class="card scroll-mt-44 p-5 sm:p-7" id="exam-l${lv}">
        <div class="flex flex-wrap items-center gap-2">
          <span class="rounded-lg ${LEVEL_CLS[lv].badge} px-2.5 py-1 text-xs font-extrabold text-white">${isBn() ? "রুট" : "Route"}</span>
          <h3 class="flex-1 text-lg font-extrabold text-slate-900 dark:text-white">${t1(X.levels[lv])}</h3>
          <button type="button" class="btn" data-copy="exam:l${lv}">${I.copy}${t1(UI.copy)}</button>
        </div>
        <div class="mt-3">${routeHTML(X.route.filter((s) => s.level === lv).map((s) => s.road))}</div>
        <ol class="mt-6">${X.route.filter((s) => s.level === lv).map(stepHTML).join("")}</ol>
      </section>`).join("");

    return `
      <div class="grid grid-cols-1 gap-6">
        <section class="card scroll-mt-44 p-5 sm:p-7" id="exam-rules">
          <p class="eyebrow">${isBn() ? "গ্রেড এ-র ১০টি নিয়ম" : "10 rules for a Grade A"}</p>
          <ol class="mt-4 grid gap-3 md:grid-cols-2">${X.golden.map((g, i) => `<li class="flex gap-3"><span class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-600 text-xs font-extrabold text-white">${i + 1}</span><p class="text-sm">${T(g)}${g.src ? ` <span class="chip ml-1 align-middle">${g.src}</span>` : ""}</p></li>`).join("")}</ol>
        </section>

        <section class="card scroll-mt-44 p-5 sm:p-7" id="exam-before">
          ${stageHead(before.icon, before.title, before.time)}
          <p class="mt-3 text-sm text-slate-600 dark:text-slate-300">${T(before.intro)}</p>
          <div class="mt-4 grid gap-3 lg:grid-cols-3">${before.checklists.map((c, ci) => checklistHTML(c, 0, ci)).join("")}</div>
        </section>

        <section class="card scroll-mt-44 p-5 sm:p-7" id="exam-arrive">
          ${stageHead(arrive.icon, arrive.title, arrive.time, "arrive", "exam:arrive")}
          <p class="mt-3 text-sm text-slate-600 dark:text-slate-300">${T(arrive.intro)}</p>
          <ol class="mt-5 space-y-3">${arrive.lines.map(lineHTML).join("")}</ol>
          ${tipBox(arrive.tip)}
        </section>

        <section class="card scroll-mt-44 p-5 sm:p-7" id="exam-intro">
          ${stageHead(intro.icon, intro.title, intro.time, "intro", "exam:intro")}
          <p class="mt-3 text-sm text-slate-600 dark:text-slate-300">${T(intro.intro)}</p>
          <div class="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-slate-900 p-3 text-white dark:bg-slate-800">
            <span class="text-xs font-semibold text-slate-300">${isBn() ? "প্র্যাকটিস টাইমার" : "Practice timer"}</span>
            <span id="introTimer" class="font-mono text-2xl font-extrabold tabular-nums">0:00</span>
            <span class="text-xs text-slate-400">/ 3:00</span>
            <span class="flex-1"></span>
            <button type="button" class="btn" data-timer="toggle">${timerIv ? (isBn() ? "থামান" : "Pause") : (isBn() ? "শুরু" : "Start")}</button>
            <button type="button" class="btn" data-timer="reset">${isBn() ? "রিসেট" : "Reset"}</button>
          </div>
          <ol class="mt-5 space-y-3">${intro.lines.map(lineHTML).join("")}</ol>
          ${tipBox(intro.tip)}
        </section>

        ${levels}

        <section class="card scroll-mt-44 p-5 sm:p-7" id="exam-debrief">
          ${stageHead("🪞", X.debrief.title, "≤ 3 min", "debrief", "exam:debrief")}
          <p class="mt-3 text-sm text-slate-600 dark:text-slate-300">${T(X.debrief.intro)}</p>
          <ol class="mt-5 space-y-3">${X.debrief.lines.map(lineHTML).join("")}</ol>
          ${tipBox(X.debrief.tip)}
        </section>

        <section class="card scroll-mt-44 p-5 sm:p-7" id="exam-after">
          ${stageHead("🏆", X.after.title, "")}
          <ul class="mt-4 grid gap-2">${X.after.items.map((it) => `<li class="flex gap-2 text-sm"><span class="mt-0.5 text-emerald-600 dark:text-emerald-400">${I.check}</span><span>${T(it)}</span></li>`).join("")}</ul>
        </section>

        <section class="scroll-mt-44" id="exam-talk">
          <p class="eyebrow">${isBn() ? "থেমে থাকলে বা লম্বা রাস্তায়" : "Stopped, waiting or on a long road"}</p>
          <h3 class="h2 mt-1">${isBn() ? "যখন কী বলবেন" : "What to say when…"}</h3>
          <div class="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">${X.talk.map((c) => `
            <article class="card flex flex-col p-5">
              <div class="flex items-start gap-3"><span class="text-2xl" aria-hidden="true">${c.icon}</span><h4 class="flex-1 font-bold leading-snug text-slate-900 dark:text-white">${T(c.title)}</h4><button type="button" class="btn" data-copy="talk:${c.id}" aria-label="Copy">${I.copy}</button></div>
              <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">${T(c.why)}</p>
              <ul class="mt-3 grid gap-2">${c.lines.map((l) => `<li class="bubble bubble-m text-sm">${l.startsWith("[") ? `<i>${l}</i>` : `“${l}”`}</li>`).join("")}</ul>
            </article>`).join("")}</div>
        </section>

        <section class="scroll-mt-44" id="exam-fixes">
          <p class="eyebrow">${isBn() ? "আপনার স্ক্রিপ্ট" : "Your master script"}</p>
          <h3 class="h2 mt-1">${isBn() ? "নম্বর বাঁচানোর ৬টি সংশোধন" : "6 fixes that protect your marks"}</h3>
          <div class="mt-4 grid gap-4 lg:grid-cols-2">${X.fixes.map((f) => `
            <article class="card p-5">
              <div class="flex items-center gap-2"><span class="h-2.5 w-2.5 rounded-full ${AREA[f.area].bar}"></span><h4 class="font-bold text-slate-900 dark:text-white">${t1(f.what)}</h4></div>
              <p class="mt-3 rounded-lg border-l-4 border-rose-400 bg-rose-50 px-3 py-2 text-sm text-rose-900 dark:bg-rose-950/40 dark:text-rose-200"><b>${isBn() ? "আগে:" : "Before:"}</b> ${f.before}</p>
              <p class="mt-2 rounded-lg border-l-4 border-emerald-500 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"><b>${isBn() ? "পরে:" : "After:"}</b> ${f.after}</p>
              <p class="mt-3 text-sm text-slate-600 dark:text-slate-300">${T(f.why)}</p>
            </article>`).join("")}</div>
        </section>
      </div>`;
  }

  /* ---- Rehearsal deck ---- */
  function buildDeck() {
    const deck = [];
    const fromLines = (section, ctxLabel, lines) => {
      let prev = null;
      lines.forEach((l) => {
        if (l[0] === "M") deck.push({ section, ctx: ctxLabel, cue: prev ? (prev[0] === "J" ? { who: "Jamil", text: prev[1] } : prev[0] === "M" ? { who: "you", text: prev[1] } : { text: prev[1] }) : { text: isBn() ? "শুরু করুন" : "You start." }, answer: [l[1]] });
        prev = l;
      });
    };
    fromLines("arrive", tPlain(X.stages[1].title), X.stages[1].lines);
    fromLines("intro", tPlain(X.stages[2].title), X.stages[2].lines);
    X.route.forEach((s) => {
      const ctx = `${s.n}. ${s.road}`;
      const sec = `l${s.level}`;
      deck.push({ section: sec, ctx, cue: { text: (isBn() ? "দিকনির্দেশনা দিন: " : "Give the direction: ") + s.road }, answer: [s.dir] });
      if (s.say) deck.push({ section: sec, ctx, cue: { text: tPlain(s.focus) }, answer: s.say });
      if (s.wait) deck.push({ section: sec, ctx, cue: { text: isBn() ? "আপনারা থেমে আছেন। কী বলবেন?" : "You're stopped and waiting. What do you say?" }, answer: s.wait });
      if (s.after) deck.push({ section: sec, ctx, cue: { text: isBn() ? "মোড়টা শেষ হলো। কী জিজ্ঞেস করবেন?" : "The turn is done. What do you ask?" }, answer: s.after });
      if (s.praise) deck.push({ section: sec, ctx, cue: { text: isBn() ? "সে এটা ভালোভাবে করল। প্রশংসা করুন।" : "He did it well. Praise him." }, answer: [s.praise] });
      if (s.branch) fromLines(sec, `${ctx} — ${tPlain(X.bend.fault.title)}`, X.bend.fault.lines);
    });
    fromLines("debrief", tPlain(X.debrief.title), X.debrief.lines);
    X.talk.forEach((c) => deck.push({ section: "talk", ctx: tPlain(c.title), cue: { text: tPlain(c.why) }, answer: c.lines }));
    return deck.filter((c) => state.deckFilter === "all" || c.section === state.deckFilter);
  }

  function renderRehearse() {
    const deck = buildDeck();
    if (state.deckIdx >= deck.length) state.deckIdx = 0;
    const c = deck[state.deckIdx];
    const filters = [["all", isBn() ? "সব" : "All"], ["arrive", isBn() ? "আগমন" : "Arrival"], ["intro", isBn() ? "শুরু" : "Opening"], ["l1", isBn() ? "লেভেল ১" : "Level 1"], ["l2", isBn() ? "লেভেল ২" : "Level 2"], ["l3", isBn() ? "লেভেল ৩" : "Level 3"], ["debrief", isBn() ? "রিফ্লেকশন" : "Reflection"], ["talk", isBn() ? "কী বলব" : "What to say"]];
    const pct = deck.length ? ((state.deckIdx + 1) / deck.length) * 100 : 0;
    return `
      <div class="mx-auto max-w-2xl">
        <div class="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1" role="group" aria-label="Section">
          ${filters.map(([k, l]) => `<button type="button" data-deck="${k}" aria-pressed="${state.deckFilter === k}" class="shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${state.deckFilter === k ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"}">${l}</button>`).join("")}
        </div>
        <div class="mt-4 flex items-center gap-3 text-xs font-semibold text-slate-500">
          <span class="tabular-nums">${state.deckIdx + 1} / ${deck.length}</span>
          <div class="h-1.5 flex-1 rounded-full bg-slate-200 dark:bg-slate-800"><div class="h-1.5 rounded-full bg-blue-600 transition-all" style="width:${pct}%"></div></div>
        </div>
        <article class="card mt-4 overflow-hidden" aria-live="polite">
          <div class="border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900/80">${c ? c.ctx : ""}</div>
          <div class="p-5 sm:p-7">
            ${c ? `
            <p class="text-[11px] font-bold uppercase tracking-wide text-slate-400">${c.cue.who === "Jamil" ? (isBn() ? "জামিল বলছে" : "Jamil says") : c.cue.who === "you" ? (isBn() ? "আপনি এইমাত্র বললেন" : "You just said") : (isBn() ? "পরিস্থিতি" : "Situation")}</p>
            <p class="mt-2 text-lg font-semibold leading-relaxed text-slate-900 dark:text-white">${c.cue.who ? `“${c.cue.text}”` : c.cue.text}</p>
            <div class="mt-6 rounded-2xl border-2 border-dashed ${state.reveal ? "border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/40" : "border-slate-200 dark:border-slate-700"} p-4">
              <p class="text-[11px] font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">${isBn() ? "আপনি (মোহাম্মদ) বলবেন" : "You (Mohammed) say"}</p>
              ${state.reveal ? `<ul class="mt-2 grid gap-2">${c.answer.map((a) => `<li class="text-[17px] leading-relaxed text-slate-900 dark:text-white">${a.startsWith("[") ? `<i>${a}</i>` : `“${a}”`}</li>`).join("")}</ul>`
                : `<button type="button" data-reveal class="mt-2 w-full rounded-xl bg-white py-6 text-sm font-semibold text-slate-500 ring-1 ring-slate-200 transition hover:text-blue-700 dark:bg-slate-900 dark:ring-slate-700">${isBn() ? "আগে জোরে বলুন, তারপর এখানে চাপুন (Space)" : "Say it out loud first, then tap to check (Space)"}</button>`}
            </div>` : `<p>${isBn() ? "কোনো কার্ড নেই" : "No cards"}</p>`}
          </div>
          <div class="flex items-center gap-2 border-t border-slate-100 p-3 dark:border-slate-800">
            <button type="button" class="btn" data-nav="-1">← ${isBn() ? "আগের" : "Prev"}</button>
            <span class="flex-1"></span>
            ${state.reveal ? "" : `<button type="button" class="btn" data-reveal>${isBn() ? "দেখুন" : "Reveal"}</button>`}
            <button type="button" class="btn btn-primary" data-nav="1">${isBn() ? "পরের" : "Next"} →</button>
          </div>
        </article>
        <p class="mt-3 text-center text-xs text-slate-400">${isBn() ? "কীবোর্ড: ← → নেভিগেট, Space দেখুন" : "Keyboard: ← → to move, Space to reveal"}</p>
      </div>`;
  }

  function renderExam() {
    const nav = [["rules", isBn() ? "নিয়ম" : "Rules"], ["before", isBn() ? "আগের দিন" : "Before"], ["arrive", isBn() ? "আগমন" : "Arrive"], ["intro", isBn() ? "শুরু" : "Opening"], ["l1", isBn() ? "লেভেল ১" : "Level 1"], ["l2", isBn() ? "লেভেল ২" : "Level 2"], ["l3", isBn() ? "লেভেল ৩" : "Level 3"], ["debrief", isBn() ? "রিফ্লেকশন" : "Reflection"], ["talk", isBn() ? "কী বলব" : "What to say"], ["fixes", isBn() ? "সংশোধন" : "Fixes"]];
    $("#panel-exam").innerHTML = `
      <div class="mb-5">
        <p class="eyebrow">${isBn() ? "পরীক্ষার দিন" : "Exam day"}</p>
        <h2 class="h2 mt-1">${isBn() ? "আগমন থেকে ফলাফল — প্রতিটি কথা, প্রতিটি রাস্তা" : "Arrival to result — every word, every road"}</h2>
        <p class="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">${T({ en: "Your master script, turned into a run sheet and timed to DVSA rules. Read it through, then use Rehearse to practise your lines until they're automatic.", bn: "আপনার মাস্টার স্ক্রিপ্ট, DVSA নিয়ম অনুযায়ী সময় মিলিয়ে রান-শিটে সাজানো। পড়ে নিন, তারপর রিহার্স মোডে লাইনগুলো মুখস্থ হওয়া পর্যন্ত প্র্যাকটিস করুন।" })}</p>
        <div class="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">${X.timing.map((t) => `<div class="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"><p class="text-xl font-extrabold text-slate-900 dark:text-white">${t.k}</p><p class="text-xs text-slate-500 dark:text-slate-400">${t1(t)}</p></div>`).join("")}</div>
        <div class="mt-4 inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 text-sm font-semibold dark:border-slate-700 dark:bg-slate-800" role="group" aria-label="Mode">
          <button type="button" data-xmode="read" aria-pressed="${state.examMode === "read"}" class="rounded-lg px-4 py-2 ${state.examMode === "read" ? "bg-white text-blue-700 shadow-sm dark:bg-slate-950 dark:text-blue-300" : "text-slate-500"}">📖 ${isBn() ? "পড়ুন" : "Read"}</button>
          <button type="button" data-xmode="rehearse" aria-pressed="${state.examMode === "rehearse"}" class="rounded-lg px-4 py-2 ${state.examMode === "rehearse" ? "bg-white text-blue-700 shadow-sm dark:bg-slate-950 dark:text-blue-300" : "text-slate-500"}">🎙️ ${isBn() ? "রিহার্স" : "Rehearse"}</button>
        </div>
        ${state.examMode === "read" ? `<button type="button" class="btn btn-primary ml-2 align-top" data-copy="exam:all">${I.copy}${isBn() ? "পুরো রান-শিট কপি" : "Copy full run sheet"}</button>` : ""}
      </div>
      ${state.examMode === "read" ? `
        <nav class="no-scrollbar sticky top-[106px] z-20 -mx-4 mb-5 flex gap-2 overflow-x-auto bg-slate-50/90 px-4 py-2 backdrop-blur dark:bg-slate-950/90" aria-label="Exam stages">
          ${nav.map(([k, l]) => `<a href="#exam/${k}" class="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-blue-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">${l}</a>`).join("")}
        </nav>
        ${renderExamRead()}` : renderRehearse()}`;
    updateTimer();
  }

  function updateTimer() {
    const el = $("#introTimer");
    if (!el) return;
    const sec = timerStart ? Math.floor((Date.now() - timerStart.t0) / 1000) + timerStart.acc : (state.timerAcc || 0);
    el.textContent = `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
    el.className = `font-mono text-2xl font-extrabold tabular-nums ${sec >= 180 ? "text-rose-400" : sec >= 150 ? "text-amber-300" : ""}`;
  }

  function examText(part) {
    const L = (lines) => lines.map((l) => (l[0] === "N" ? `[${l[1]}]` : `${{ M: "MOHAMMED", J: "JAMIL", E: "EXAMINER" }[l[0]]}: ${l[1]}`)).join("\n");
    const step = (s) => {
      let o = `${s.n}. ${s.road}\n   SAY: ${s.dir}\n   FOCUS: ${s.focus.en}`;
      if (s.say) o += `\n   ASK: ${s.say.join(" / ")}`;
      if (s.wait) o += `\n   WHILE WAITING: ${s.wait.join(" / ")}`;
      if (s.after) o += `\n   AFTER: ${s.after.join(" / ")}`;
      if (s.praise) o += `\n   PRAISE: ${s.praise}`;
      if (s.branch) o += `\n   IF FAULT:\n${L(X.bend.fault.lines)}\n   IF GOOD:\n${L(X.bend.good.lines)}`;
      return o;
    };
    const lvl = (n) => `${X.levels[n].en.toUpperCase()}\n${X.route.filter((s) => s.level === n).map(step).join("\n")}`;
    if (part === "arrive") return `${X.stages[1].title.en}\n${L(X.stages[1].lines)}`;
    if (part === "intro") return `${X.stages[2].title.en} (≤ 3 min)\n${L(X.stages[2].lines)}`;
    if (part === "debrief") return `${X.debrief.title.en}\n${L(X.debrief.lines)}`;
    if (/^l\d$/.test(part)) return lvl(+part[1]);
    if (part === "all") return [`ADI PART 3 — EXAM DAY RUN SHEET (Mohammed & Jamil)`, examText("arrive"), examText("intro"), lvl(1), lvl(2), lvl(3), examText("debrief")].join("\n\n");
    return "";
  }

  /* ================================================================
     Copy text builders
     ================================================================ */
  const lineText = (l) => (l[0] === "N" ? `[${l[1]}]` : `${SPEAKER[l[0]].name.toUpperCase()}: ${l[1]}`);
  // (exam texts built by examText)
  const blockText = (b) => `${b.title.en}\n\n${b.lines.map(lineText).join("\n")}`;
  function phaseText(p) {
    let out = `PHASE ${p.num}: ${p.title.en.toUpperCase()} (${p.time})\n\n`;
    if (p.levels) out += p.levels.map(levelText).join("\n\n");
    else out += p.blocks.map(blockText).join("\n\n");
    return out;
  }
  function levelText(lv) {
    return `LEVEL ${lv.level} — ${lv.name.en.toUpperCase()}\nRoute: ${lv.route.join(" → ")}\n\n${lv.blocks.map(blockText).join("\n\n")}`;
  }
  function copyText(key) {
    const [kind, a, b] = key.split(":");
    if (kind === "all") return `ADI PART 3 — ${D.meta.topic.en}\nInstructor: Mohammed · Pupil: Jamil\n\n` + D.phases.map(phaseText).join("\n\n————————\n\n");
    if (kind === "phase") return phaseText(D.phases.find((p) => p.id === a));
    if (kind === "blk") return blockText(D.phases.find((p) => p.id === a).blocks[+b]);
    if (kind === "level") return levelText(D.phases[2].levels.find((l) => l.id === a));
    if (kind === "lvl") return blockText(D.phases[2].levels.find((l) => l.id === a).blocks[+b]);
    if (kind === "prompt") return promptFor(D.scenes.find((s) => s.n === +a));
    if (kind === "char") { const tag = key.slice(5); const c = D.characters.find((x) => x.tag === tag); return `${c.tag} ${c.en}`; }
    if (kind === "style") return D.style;
    if (kind === "exam") return examText(a);
    if (kind === "talk") { const c = X.talk.find((x) => x.id === a); return `${c.title.en}\n${c.lines.map((l) => "- " + l).join("\n")}`; }
    return "";
  }
  async function doCopy(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
      else throw new Error("fallback");
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (err) {}
      ta.remove();
    }
    toast(isBn() ? UI.copied.bn : UI.copied.en);
  }
  let toastTimer;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg; el.dataset.show = "true";
    clearTimeout(toastTimer); toastTimer = setTimeout(() => (el.dataset.show = "false"), 1800);
  }

  /* ================================================================
     Shell: tabs, language, theme, events
     ================================================================ */
  const RENDER = { dashboard: renderDashboard, exam: renderExam, lesson: renderLesson, videos: renderVideos, checklist: renderChecklist };
  function renderChrome() {
    $$("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === state.lang)));
    $$("[data-tab]").forEach((b) => {
      b.innerHTML = t1(UI[b.dataset.tab]);
      b.setAttribute("aria-selected", String(b.dataset.tab === state.tab));
      b.tabIndex = b.dataset.tab === state.tab ? 0 : -1;
    });
    document.documentElement.lang = state.lang === "bn" ? "bn" : "en";
  }
  function show(tab, sub) {
    state.tab = RENDER[tab] ? tab : "dashboard";
    $$(".panel").forEach((p) => (p.hidden = p.id !== `panel-${state.tab}`));
    RENDER[state.tab]();
    renderChrome();
    if (sub) {
      const el = document.getElementById(`${state.tab}-${sub}`);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
    } else window.scrollTo({ top: 0 });
  }
  function fromHash() {
    const [tab, sub] = location.hash.replace("#", "").split("/");
    show(tab || "dashboard", sub);
  }
  function rerender() { RENDER[state.tab](); renderChrome(); }
  function saveOpen() { store.set("adi3-open", Array.from(state.open)); }

  document.addEventListener("click", (e) => {
    const el = e.target.closest("button, a");
    if (!el) return;
    const d = el.dataset;

    if (d.tab) { if (location.hash !== `#${d.tab}`) location.hash = d.tab; else show(d.tab); return; }
    if (d.lang) { state.lang = d.lang; store.set("adi3-lang", d.lang); rerender(); return; }
    if (el.id === "themeBtn") {
      const dark = document.documentElement.classList.toggle("dark");
      store.set("adi3-theme", dark ? "dark" : "light");
      return;
    }
    if (d.acc) {
      const open = el.getAttribute("aria-expanded") !== "true";
      el.setAttribute("aria-expanded", String(open));
      $(`#acc-${d.acc}`).dataset.open = String(open);
      open ? state.open.add(d.acc) : state.open.delete(d.acc);
      saveOpen();
      return;
    }
    if (d.copy) { doCopy(copyText(d.copy)); return; }
    if (d.expand) {
      $$("#panel-lesson [data-acc]").forEach((b) => {
        const open = d.expand === "all";
        b.setAttribute("aria-expanded", String(open));
        $(`#acc-${b.dataset.acc}`).dataset.open = String(open);
        open ? state.open.add(b.dataset.acc) : state.open.delete(b.dataset.acc);
      });
      saveOpen();
      return;
    }
    if (d.scen) {
      state.scenario = d.scen;
      $$("[data-scen]").forEach((b) => {
        const on = b.dataset.scen === d.scen;
        b.setAttribute("aria-pressed", String(on));
        b.className = `rounded-full border px-3 py-1 text-xs font-semibold transition ${on ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 text-slate-600 hover:border-blue-300 dark:border-slate-700 dark:text-slate-300"}`;
      });
      $("#roadWrap").innerHTML = roadDiagram();
      $("#scenVerdict").innerHTML = T(SCEN[d.scen].verdict);
      playScenario();
      return;
    }
    if ("replay" in d) { playScenario(); return; }
    if (d.xmode) { state.examMode = d.xmode; store.set("adi3-exam-mode", d.xmode); renderExam(); return; }
    if (d.deck) { state.deckFilter = d.deck; state.deckIdx = 0; state.reveal = false; store.set("adi3-deck-filter", d.deck); renderExam(); return; }
    if ("reveal" in d) { state.reveal = true; renderExam(); return; }
    if (d.nav) { const n = buildDeck().length; state.deckIdx = (state.deckIdx + +d.nav + n) % n; state.reveal = false; renderExam(); return; }
    if (d.tick) { state.ticks.has(d.tick) ? state.ticks.delete(d.tick) : state.ticks.add(d.tick); store.set("adi3-ticks", Array.from(state.ticks)); const y = window.scrollY; renderExam(); window.scrollTo({ top: y }); return; }
    if (d.timer) {
      if (d.timer === "reset") { clearInterval(timerIv); timerIv = null; timerStart = null; state.timerAcc = 0; }
      else if (timerIv) { state.timerAcc = Math.floor((Date.now() - timerStart.t0) / 1000) + timerStart.acc; clearInterval(timerIv); timerIv = null; timerStart = null; }
      else { timerStart = { t0: Date.now(), acc: state.timerAcc || 0 }; timerIv = setInterval(updateTimer, 250); }
      const tb = $('[data-timer="toggle"]');
      if (tb) tb.textContent = timerIv ? (isBn() ? "থামান" : "Pause") : (isBn() ? "শুরু" : "Start");
      updateTimer(); return;
    }
    if (d.filter) { state.phaseFilter = d.filter; renderVideos(); return; }
    if (d.videoClear) {
      const n = +d.videoClear;
      store.del(`adi3-video-${n}`);
      if (state.localVideos[n]) { URL.revokeObjectURL(state.localVideos[n]); delete state.localVideos[n]; }
      renderVideos(); return;
    }
    if (d.score) {
      const n = +d.score, v = +d.v;
      if (state.scores[n] === v) delete state.scores[n]; else state.scores[n] = v;
      store.set("adi3-scores", state.scores);
      const y = window.scrollY; renderChecklist(); window.scrollTo({ top: y });
      return;
    }
    if (d.fill) { D.competencies.forEach((c) => (state.scores[c.n] = +d.fill)); store.set("adi3-scores", state.scores); renderChecklist(); return; }
    if ("reset" in d) { state.scores = {}; store.set("adi3-scores", {}); renderChecklist(); return; }
  });

  document.addEventListener("submit", (e) => {
    const f = e.target.closest("[data-video-form]");
    if (!f) return;
    e.preventDefault();
    const n = +f.dataset.videoForm;
    const url = f.querySelector("input[type=url]").value.trim();
    if (url) store.set(`adi3-video-${n}`, url); else store.del(`adi3-video-${n}`);
    renderVideos();
  });
  document.addEventListener("change", (e) => {
    const inp = e.target.closest("[data-video-file]");
    if (!inp || !inp.files || !inp.files[0]) return;
    const n = +inp.dataset.videoFile;
    if (state.localVideos[n]) URL.revokeObjectURL(state.localVideos[n]);
    state.localVideos[n] = URL.createObjectURL(inp.files[0]);
    renderVideos();
  });

  // Keyboard navigation for tabs (left/right arrows)
  $("#tabs").addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const tabs = $$("[data-tab]");
    const i = tabs.findIndex((t) => t.dataset.tab === state.tab);
    const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    location.hash = next.dataset.tab;
    next.focus();
  });

  // Rehearse mode keyboard: ←/→ move, Space/Enter reveal
  document.addEventListener("keydown", (e) => {
    if (state.tab !== "exam" || state.examMode !== "rehearse") return;
    if (e.target.closest("input, textarea, [role=tablist]")) return;
    const n = buildDeck().length;
    if (e.key === "ArrowRight") { state.deckIdx = (state.deckIdx + 1) % n; state.reveal = false; renderExam(); e.preventDefault(); }
    else if (e.key === "ArrowLeft") { state.deckIdx = (state.deckIdx - 1 + n) % n; state.reveal = false; renderExam(); e.preventDefault(); }
    else if ((e.key === " " || e.key === "Enter") && !state.reveal && !e.target.closest("button")) { state.reveal = true; renderExam(); e.preventDefault(); }
  });

  window.addEventListener("hashchange", fromHash);
  fromHash();
})();
