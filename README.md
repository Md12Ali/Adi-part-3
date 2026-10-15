# ADI Part 3 — Standards Check Study Guide

Interactive study and reference guide for the DVSA ADI Part 3 / Standards Check.

- **Instructor:** Mohammed · **Pupil:** Jamil
- **Topic:** Meeting oncoming traffic on narrow roads with parked vehicles
- **Target:** Grade A (43+/51) with at least 8/15 in Risk Management

Live site: https://adi-part-3.onrender.com

## Sections

1. **Dashboard** — DVSA score breakdown (Lesson Planning 12, Risk Management 15, Teaching & Learning 24), grade bands, core principles (pupil-centred learning, FCPS, dynamic risk management).
2. **Exam Day** — run sheet from arriving at Kildowan Road Test Centre to the examiner's feedback: 3-minute opening (with practice timer), all 33 turns with exact directions, what to ask, what to say while waiting, both outcomes at Trenance Gardens, reflection, 'what to say when…' cards, fixes to the master script, and a Rehearse mode (flashcards that hide your line).
3. **Lesson Plan & Script** — 4 phases with the full Mohammed/Jamil dialogue, SMART goal, confidence scale (5 → 7 → 8), interactive priority diagram, 23 m / 46 m stopping distances, dual-control protocol, and the three route levels with exact road names. Every block has a copy button.
4. **Video Guide** — a full 3D exam simulation (Three.js, runs in the browser): arrival, 3-minute opening, all 33 turns with the correct direction, meeting traffic, traffic lights, roundabouts, the Trenance Gardens bend and FCPS, handover, reflection and feedback — with subtitles, optional voice, chase/top/driver cameras, minimap and a Google Maps panel for the real road. Below it, 12 animated scenes with camera, lighting and a ready-to-paste AI prompt. Paste an MP4, YouTube or Vimeo link into any scene to play your rendered clip (saved in your browser).
5. **Examiner Checklist** — all 17 DVSA competencies with lesson-specific evidence and 0–3 self-scoring, live total, grade and Risk Management auto-fail check.

English, Bengali (বাংলা) or both side by side; light/dark mode; mobile-friendly.

## Files

```
index.html            page shell
assets/data.js        lesson content
assets/examday.js     exam-day run sheet, route and rehearsal content (edit to change scripts, scenes)
assets/app.js         app logic
assets/route.js       real route geometry from TomTom (8.1 km, every junction of the script)
assets/sim.js         3D exam simulation built on the real route (junction model per step in SPEC)
assets/vendor/        three.js r160 (vendored)
assets/styles.css     compiled Tailwind CSS (committed, so no build is needed to deploy)
src/input.css         Tailwind source
tailwind.config.js    Tailwind config
```

## Route data

The route was checked and drawn with TomTom (geocoding + routing through every junction in the master script). Corrected names: Beamere → Breamore Road, Terence Road → Trenance Gardens (second pass of the bend), Ward → Wards Road, Felbridge → Felbrigge Road, Electric Parade → Seven Kings Road. Test centre: Goodmayes Driving Test Centre, 98 Goodmayes Road.

## Editing styles

If you add new Tailwind classes, rebuild the CSS:

```bash
npm install
npm run build:css      # or: npm run watch:css while editing
```

## Deploying

**Render (current):** Static Site → repo `Md12Ali/Adi-part-3`, branch `main`, build command `echo static`, publish directory `./`.
Optional: set the build command to `npm install && npm run build:css` to rebuild the CSS on every deploy.

**GitHub Pages:** Settings → Pages → Deploy from branch → `main` / root.

---
Personal study aid. Not an official DVSA product. Scoring per the DVSA standards check form; stopping distances per the Highway Code.
