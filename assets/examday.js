/* Exam-day run sheet: from arriving at Kildowan Road Test Centre to the examiner's feedback.
 * Based on Mohammed's master script, tightened to DVSA timings (gov.uk/adi-part-3-test):
 *   - goals + risk management at the start: no more than 3 minutes
 *   - pupil drives for about 40 minutes (lesson about 45 minutes)
 *   - pupil reflection at the end: no more than 3 minutes
 * Speakers: "M" Mohammed, "J" Jamil, "E" examiner, "N" note/action.
 */
window.EXAM = {
  timing: [
    { k: "≤ 3 min", en: "Goals + risk agreement", bn: "লক্ষ্য + ঝুঁকি চুক্তি" },
    { k: "≈ 40 min", en: "Jamil drives", bn: "জামিল ড্রাইভ করবে" },
    { k: "≤ 3 min", en: "Jamil reflects", bn: "জামিলের রিফ্লেকশন" },
    { k: "≈ 45 min", en: "Whole lesson", bn: "পুরো লেসন" }
  ],

  /* ---- Ten rules for a Grade A (DVSA guidance + DVSA's top-5 fail reasons, turned around) ---- */
  golden: [
    { en: "Keep the opening to 3 minutes. Goal, help level, risk, move off.", bn: "শুরুর আলোচনা ৩ মিনিটে শেষ করুন। লক্ষ্য, সাহায্যের মাত্রা, ঝুঁকি, তারপর চলা শুরু।", src: "gov.uk" },
    { en: "Adapt to what really happens — not to the script. This is DVSA's #1 reason instructors lose marks.", bn: "স্ক্রিপ্ট নয়, বাস্তবে যা ঘটছে তার সাথে মানিয়ে নিন — DVSA-র মতে নম্বর হারানোর এক নম্বর কারণ এটাই।", src: "DVSA" },
    { en: "Ask, don't tell. Let Jamil work out what went wrong and what to do next.", bn: "বলে দেবেন না, জিজ্ঞেস করুন। কী ভুল হলো আর পরে কী করবে — জামিলকে নিজেই বের করতে দিন।", src: "DVSA" },
    { en: "Give feedback during the lesson, at safe moments — not only at the end.", bn: "শুধু শেষে নয় — লেসনের মাঝেই নিরাপদ মুহূর্তে ফিডব্যাক দিন।", src: "DVSA" },
    { en: "After anything unsafe, make sure Jamil can say what the risk was.", bn: "অনিরাপদ কিছু ঘটলে নিশ্চিত করুন জামিল নিজে বলতে পারে ঝুঁকিটা কী ছিল।", src: "DVSA" },
    { en: "Directions early and clear: 'At the end of the road, turn left, please.'", bn: "দিকনির্দেশনা আগেভাগে ও পরিষ্কার: 'At the end of the road, turn left, please.'", src: "" },
    { en: "Talk when it is safe (stopped, straight road). Stay quiet at junctions and roundabouts.", bn: "নিরাপদ সময়ে কথা বলুন (থামা অবস্থায়, সোজা রাস্তায়)। জাংশন ও রাউন্ডঅ্যাবাউটে চুপ থাকুন।", src: "" },
    { en: "Silence is fine when he is driving well. Over-talking is worse than a quiet minute.", bn: "ভালো চালালে চুপ থাকা ঠিক আছে। বেশি কথা বলা এক মিনিট চুপ থাকার চেয়ে খারাপ।", src: "" },
    { en: "Keep linking back to the goal: early spotting, safe gap, speed on bends.", bn: "বারবার লক্ষ্যের সাথে যুক্ত করুন: আগে দেখা, নিরাপদ গ্যাপ, বাঁকে গতি।", src: "" },
    { en: "Never ask Jamil to make a mistake on purpose. It is unsafe, and examiners can tell.", bn: "জামিলকে কখনো ইচ্ছাকৃত ভুল করতে বলবেন না। এটা বিপজ্জনক, আর এক্সামিনার বুঝতে পারেন।", src: "" }
  ],

  /* ---- Stages, in order ---- */
  stages: [
    {
      id: "before",
      icon: "📋",
      time: "Day before",
      title: { en: "Before the day", bn: "পরীক্ষার আগের দিন" },
      intro: { en: "Most of the 'nerves' disappear when the car, papers and route are already sorted.", bn: "গাড়ি, কাগজপত্র আর রুট আগে থেকে ঠিক থাকলে বেশিরভাগ নার্ভাসনেস চলে যায়।" },
      checklists: [
        {
          title: { en: "Car rules (gov.uk — test is cancelled if not met)", bn: "গাড়ির নিয়ম (gov.uk — না মানলে টেস্ট বাতিল)" },
          items: [
            { en: "No warning lights showing (e.g. airbag light)", bn: "কোনো ওয়ার্নিং লাইট জ্বলছে না (যেমন এয়ারব্যাগ লাইট)" },
            { en: "No tyre damage, legal tread on every tyre, no space-saver spare fitted", bn: "টায়ারে ক্ষতি নেই, সব টায়ারে আইনসম্মত ট্রেড, স্পেস-সেভার স্পেয়ার লাগানো নয়" },
            { en: "Roadworthy", bn: "রাস্তায় চলার উপযুক্ত" },
            { en: "Extra interior rear-view mirror fitted", bn: "অতিরিক্ত ভেতরের রিয়ার-ভিউ মিরর লাগানো" },
            { en: "Passenger seatbelt and proper head restraint for the examiner (no slip-on types)", bn: "এক্সামিনারের জন্য সিটবেল্ট ও আসল হেড রেস্ট্রেইন্ট (স্লিপ-অন নয়)" },
            { en: "Can reach at least 62 mph, mph speedometer", bn: "কমপক্ষে ৬২ মাইল/ঘণ্টা গতি, mph স্পিডোমিটার" },
            { en: "4 wheels, within the maximum authorised mass", bn: "৪ চাকা, সর্বোচ্চ অনুমোদিত ওজনের মধ্যে" }
          ]
        },
        {
          title: { en: "Take with you", bn: "সাথে নিন" },
          items: [
            { en: "Jamil (your pupil) — and his licence if he is a learner", bn: "জামিল (আপনার শিক্ষার্থী) — শিক্ষার্থী চালক হলে তার লাইসেন্স" },
            { en: "Your trainee instructor licence — or UK driving licence / passport if you don't have one", bn: "আপনার ট্রেইনি ইনস্ট্রাক্টর লাইসেন্স — না থাকলে ইউকে ড্রাইভিং লাইসেন্স / পাসপোর্ট" },
            { en: "L-plates front and back (if Jamil is a learner)", bn: "সামনে-পেছনে L-প্লেট (জামিল শিক্ষার্থী হলে)" },
            { en: "Pre-drawn diagram card (narrow road, parked cars both sides, gaps, a bend) — drawing it live wastes your 3 minutes", bn: "আগে থেকে আঁকা ডায়াগ্রাম কার্ড (সরু রাস্তা, দুই পাশে পার্ক, গ্যাপ, বাঁক) — গাড়িতে আঁকলে ৩ মিনিট নষ্ট হয়" },
            { en: "1–10 confidence card, pen, Jamil's lesson record", bn: "১–১০ আত্মবিশ্বাস কার্ড, কলম, জামিলের লেসন রেকর্ড" }
          ]
        },
        {
          title: { en: "Preparation", bn: "প্রস্তুতি" },
          items: [
            { en: "Drive the full route at the same time of day and time it — Jamil needs about 40 minutes of driving", bn: "একই সময়ে পুরো রুট চালিয়ে সময় মাপুন — জামিলের প্রায় ৪০ মিনিট ড্রাইভিং দরকার" },
            { en: "Road names are now checked against TomTom: Breamore Road, Wards Road, Felbrigge Road, Seven Kings Road, and Trenance Gardens (not 'Terence Road')", bn: "রাস্তার নাম TomTom দিয়ে যাচাই করা: Breamore Road, Wards Road, Felbrigge Road, Seven Kings Road, আর Trenance Gardens ('Terence Road' নয়)" },
            { en: "Tell Jamil: it's a normal lesson, the examiner is watching me, not you. Just drive as you normally do.", bn: "জামিলকে বলুন: এটা সাধারণ লেসন, এক্সামিনার আমাকে দেখছেন, তোমাকে না। স্বাভাবিকভাবে চালাও।" },
            { en: "Rehearse the 3-minute opening out loud with a timer (use Rehearse mode below)", bn: "টাইমার দিয়ে ৩ মিনিটের শুরুটা জোরে জোরে প্র্যাকটিস করুন (নিচের রিহার্স মোড)" }
          ]
        }
      ]
    },
    {
      id: "arrive",
      icon: "🏁",
      time: "Arrive 15 min early",
      title: { en: "At Goodmayes Driving Test Centre (98 Goodmayes Road, by Kildowan Road)", bn: "গুডমেইজ ড্রাইভিং টেস্ট সেন্টারে (৯৮ গুডমেইজ রোড, কিলডোয়ান রোডের পাশে)" },
      intro: { en: "Calm, polite and brief. The examiner will check documents and the car, and may ask about your pupil. Have a 20-second summary ready.", bn: "শান্ত, ভদ্র ও সংক্ষিপ্ত থাকুন। এক্সামিনার কাগজপত্র ও গাড়ি দেখবেন, আর শিক্ষার্থী সম্পর্কে জিজ্ঞেস করতে পারেন। ২০ সেকেন্ডের একটা সারাংশ তৈরি রাখুন।" },
      lines: [
        ["M", "Good morning. I'm Mohammed, and this is Jamil, my pupil."],
        ["E", "[Checks your licence and the car. May ask about the pupil and the lesson.]"],
        ["M", "Jamil has had [number] lessons with me. Last time we worked on junctions. Today he'd like to work on meeting traffic on narrow roads with parked cars, and we'll agree the details together in the car."],
        ["M", "The extra mirror is set up, and the rear seat has a head restraint. Is there anything you need from me before we start?"],
        ["N", "In the car: Jamil adjusts the seat and mirrors. Check he's comfortable. Then start the opening — your 3 minutes begin."]
      ],
      tip: { en: "Don't over-plan the lesson in front of the examiner. Say what Jamil asked for, then agree it with him in the car — that is client-centred.", bn: "এক্সামিনারের সামনে লেসন পুরোপুরি ঠিক করে ফেলবেন না। জামিল কী চেয়েছে সেটা বলুন, তারপর গাড়িতে তার সাথে একমত হোন — এটাই ক্লায়েন্ট-সেন্টার্ড।" }
    },
    {
      id: "intro",
      icon: "🎯",
      time: "≤ 3 min",
      title: { en: "Opening: goal, help level and risk", bn: "শুরু: লক্ষ্য, সাহায্যের মাত্রা ও ঝুঁকি" },
      intro: { en: "Your full script takes about 6–7 minutes to say. DVSA allows no more than 3. This is the same content, cut to about 3 minutes. Show the pre-drawn card instead of drawing.", bn: "আপনার পুরো স্ক্রিপ্ট বলতে প্রায় ৬–৭ মিনিট লাগে। DVSA সর্বোচ্চ ৩ মিনিট দেয়। এখানে একই বিষয় প্রায় ৩ মিনিটে আনা হয়েছে। আঁকার বদলে আগে আঁকা কার্ড দেখান।" },
      lines: [
        ["M", "Right Jamil, last lesson we worked on junctions. How do you feel it went?"],
        ["J", "It went well. I was comfortable with my observation."],
        ["M", "Good. What would you like to work on today?"],
        ["J", "Roads with parked cars on both sides. I sometimes see the oncoming car late, so I'm not sure which gap to use."],
        ["M", "Why do you think you see them late?"],
        ["J", "I'm looking at the parked cars next to me — and I'm a bit fast."],
        ["M", "So, speed, and looking further ahead. Out of ten, how confident are you on those roads right now?"],
        ["J", "Five out of ten."],
        ["M", "What would you like to be able to do by the end of today?"],
        ["J", "Spot oncoming vehicles earlier and choose a safe gap to stop in."],
        ["M", "Let's make that our goal. [Show the card] You've just turned into this road. What's the first thing you look for?"],
        ["J", "Oncoming vehicles, and the gaps I could use."],
        ["M", "Good. Why find the gaps early?"],
        ["J", "So when I see a car coming, I already know where to stop."],
        ["M", "And what else could be hiding between the parked cars — or on a bend?"],
        ["J", "Pedestrians, cyclists, a door opening. On a bend I'll slow down and look for reflections and through the car windows."],
        ["M", "Exactly. How much help would you like from me today?"],
        ["J", "Prompt me at the start, then let me do it on my own."],
        ["M", "Perfect. I'll prompt at first, then step back. We share the safety: you drive and make the decisions; I'll give directions in good time, and if anything looks unsafe I'll step in — by voice or with the dual controls — and we'll talk about it afterwards. If I say 'stop', stop. Is that okay?"],
        ["J", "Yes."],
        ["N", "Only if the road is wet ↓"],
        ["M", "The road's wet today. What happens to your stopping distance?"],
        ["J", "It's at least double."],
        ["M", "Right — at 30 it's about 23 metres in the dry, so at least 46 in the wet. Any questions?"],
        ["J", "No."],
        ["M", "Then move off when it's safe and convenient. At the exit, turn left, please."]
      ],
      tip: { en: "Practise this with a timer. If you go over 3 minutes, cut the hazard questions — keep goal, help level and risk.", bn: "টাইমার দিয়ে প্র্যাকটিস করুন। ৩ মিনিট পার হলে বিপদের প্রশ্নগুলো ছোট করুন — লক্ষ্য, সাহায্যের মাত্রা আর ঝুঁকি রাখুন।" }
    }
  ],

  /* ---- Route: every turn, what to say, what to watch ---- */
  // level: 1 instructor-led (prompting), 2 shared, 3 pupil-led
  route: [
    { n: 1, level: 1, road: "Kildowan Road", dir: "At the exit, turn left, please.",
      focus: { en: "Settle him in. Mirrors before signalling, smooth move-off.", bn: "স্থির হতে দিন। সিগন্যালের আগে মিরর, মসৃণভাবে চলা শুরু।" },
      say: ["Take your time and settle in. Look well down the road as we go."] },
    { n: 2, level: 1, road: "Granton Road", dir: "At the end of the road, turn left, please.",
      focus: { en: "First narrow road. Full prompting: scanning far ahead, finding gaps.", bn: "প্রথম সরু রাস্তা। পূর্ণ প্রম্পটিং: দূরে তাকানো, গ্যাপ খোঁজা।" },
      say: ["As you turn in, stay on your side and consider your speed. Look right to the end of the road — what can you see?", "Where's your first safe gap if something comes?"],
      after: ["How did that feel? What helped you decide it was safe?"],
      jamil: "I was slow and on my side, so I had more time to decide.",
      praise: "Well done — slowing early gave you that time." },
    { n: 3, level: 1, road: "Green Lane", dir: "At the end of the road, turn left, please.",
      focus: { en: "Busier road. If he has to wait: headlights and eye contact.", bn: "ব্যস্ত রাস্তা। অপেক্ষা করতে হলে: হেডলাইট দেখা ও চোখে চোখ রাখা।" },
      wait: ["If you're waiting, look at their headlights and try to make eye contact where you can — it tells you what they're going to do."] },
    { n: 4, level: 1, road: "Goodmayes Lane", dir: "At the traffic lights, turn right, please.",
      focus: { en: "Right turn at signals: position, give way to oncoming, don't cut the corner.", bn: "সিগন্যালে ডানে মোড়: পজিশন, বিপরীতমুখীকে আগে যেতে দেওয়া, কোণ না কাটা।" },
      wait: ["While we wait — on Goodmayes Lane, what do you think we'll meet?"],
      praise: "That was a well-timed right turn — good position." },
    { n: 5, level: 1, road: "1st roundabout", dir: "At the roundabout, go straight ahead — that's the second exit, please.",
      focus: { en: "Ask about the blue circle sign on the approach — not while he's on the roundabout.", bn: "রাউন্ডঅ্যাবাউটে ঢোকার আগে নীল বৃত্ত সাইন নিয়ে জিজ্ঞেস করুন — রাউন্ডঅ্যাবাউটে থাকার সময় নয়।" },
      say: ["What does that blue circle sign tell you?"],
      jamil: "Blue circles give an order — it's something I must do.",
      note: { en: "Check the exit number for 'straight ahead' on your dry run.", bn: "ড্রাই রানে 'সোজা' কোন এক্সিট সেটা মিলিয়ে নিন।" } },
    { n: 6, level: 1, road: "Trenance Gardens", dir: "At the next roundabout, go straight on, then take the first road on the right, please.",
      focus: { en: "The bend. Watch speed and position BEFORE the bend. Be ready, but don't expect a fault.", bn: "বাঁক। বাঁকের আগেই গতি ও পজিশন দেখুন। প্রস্তুত থাকুন, তবে ভুল আশা করবেন না।" },
      say: ["There's a bend coming. What will you do before you reach it?"],
      branch: true },
    { n: 7, level: 1, road: "School sign", dir: "Follow the road, please.",
      focus: { en: "Hazard awareness near the school.", bn: "স্কুলের কাছে বিপদ সচেতনতা।" },
      say: ["What did that sign tell us? What changes for you here?"],
      jamil: "There could be children, so I'll slow down and watch between the parked cars." },
    { n: 8, level: 1, road: "Westrow Gardens", dir: "At the end of the road, turn left, please." ,
      focus: { en: "Start reducing prompts — ask, then wait for his answer.", bn: "প্রম্পট কমাতে শুরু করুন — জিজ্ঞেস করে উত্তরের অপেক্ষা করুন।" } },
    { n: 9, level: 1, road: "Levett Gardens", dir: "At the end of the road, turn left, please.",
      focus: { en: "Praise the left turn — be specific.", bn: "বাম মোড়ের প্রশংসা — নির্দিষ্টভাবে।" },
      praise: "Nice left turn — good speed on the approach and you stayed close to the kerb." },
    { n: 10, level: 1, road: "Goodmayes Lane", dir: "At the end of the road, turn left, please.",
      focus: { en: "Ask about speed.", bn: "গতি নিয়ে জিজ্ঞেস করুন।" },
      say: ["What's the speed limit here — and is that the right speed for this road right now?"] },
    { n: 11, level: 1, road: "Trenance Gardens (again)", dir: "Just after the traffic lights, take the road on the left, please.",
      focus: { en: "Back to the Trenance Gardens bend, as promised. Praise the bend if it's well handled.", bn: "কথামতো আবার ট্রেনান্স গার্ডেন্সের বাঁকে। বাঁক ভালোভাবে নিলে প্রশংসা করুন।" },
      praise: "That bend was much better — you slowed down before it and stayed on your side.",
      note: { en: "Your script called this 'Terence Road' — TomTom confirms it is Trenance Gardens (the bend from step 6).", bn: "স্ক্রিপ্টে 'Terence Road' লেখা — TomTom নিশ্চিত করেছে এটা ট্রেনান্স গার্ডেন্স (৬ নম্বর ধাপের বাঁক)।" } },
    { n: 12, level: 1, road: "Westrow Gardens", dir: "At the end of the road, turn left, please.",
      focus: { en: "Praise the left turn. (Your script says 'Westow' — it's Westrow Gardens.)", bn: "বাম মোড়ের প্রশংসা। (স্ক্রিপ্টে 'Westow' — আসলে ওয়েস্ট্রো গার্ডেন্স।)" } },
    { n: 13, level: 1, road: "Levett Gardens", dir: "At the end of the road, turn right, please.",
      focus: { en: "Hand over more responsibility. Quick check-in (at a safe moment).", bn: "আরও দায়িত্ব দিন। নিরাপদ মুহূর্তে ছোট্ট চেক-ইন।" },
      say: ["You're spotting things much earlier now. From here I'll ask questions rather than tell you — is that okay?"] },
    { n: 14, level: 2, road: "Gyllyngdune Gardens", dir: "Take the first road on the right, please.",
      focus: { en: "Shared decisions. Speed limit sign, hazards far ahead, road humps.", bn: "যৌথ সিদ্ধান্ত। গতিসীমার সাইন, দূরের বিপদ, স্পিড হাম্প।" },
      say: ["How do you know the speed limit here?", "Locate the vehicles or hazards as far ahead as you can — what might happen?", "What do the humps mean for your speed?"] },
    { n: 15, level: 2, road: "Breamore Road", dir: "At the end of the road, turn right, please.",
      focus: { en: "Let him talk through his plan.", bn: "তাকে নিজের পরিকল্পনা বলতে দিন।" },
      say: ["Talk me through what you're looking at."] },
    { n: 16, level: 2, road: "Oakwood Gardens", dir: "Take the immediate left, please.",
      focus: { en: "Short notice turn — give the direction early.", bn: "হঠাৎ মোড় — আগেভাগে দিক বলুন।" } },
    { n: 17, level: 2, road: "Green Lane", dir: "At the crossroads, turn left, please.",
      focus: { en: "Crossroads observation, then busier road.", bn: "ক্রসরোডে পর্যবেক্ষণ, তারপর ব্যস্ত রাস্তা।" } },
    { n: 18, level: 2, road: "New Road", dir: "At the second set of traffic lights, turn right, please.",
      focus: { en: "If waiting: headlights and eye contact.", bn: "অপেক্ষায়: হেডলাইট ও চোখে চোখ।" },
      wait: ["Who are you waiting for, and what are you looking at to decide?"] },
    { n: 19, level: 2, road: "High Road", dir: "At the end of the road, at the traffic lights, turn right, please.",
      focus: { en: "Long red light = best moment to talk. Discuss priority with oncoming traffic.", bn: "লম্বা লাল বাতি = কথা বলার সেরা সময়। বিপরীতমুখী গাড়ির সাথে অগ্রাধিকার নিয়ে আলোচনা।" },
      wait: ["While we wait: when we turn right here, who has priority?", "And on a narrow road, if the parked cars are on your side — who should wait?", "How confident are you now, out of ten?"],
      jamil: "Oncoming traffic has priority when I turn right. If the parked cars are on my side, I should be ready to wait." },
    { n: 20, level: 2, road: "High Road", dir: "After the first traffic lights, take the immediate left, please.",
      focus: { en: "Early direction — immediate turns need more notice.", bn: "আগেভাগে দিক — হঠাৎ মোড়ে বেশি সময় দিন।" } },
    { n: 21, level: 2, road: "Cameron Road", dir: "Then turn left again, please.",
      focus: { en: "Narrow road practice — let him decide.", bn: "সরু রাস্তার প্র্যাকটিস — তাকে সিদ্ধান্ত নিতে দিন।" } },
    { n: 22, level: 2, road: "Aldborough Road South", dir: "At the roundabout, take the second exit, please.",
      focus: { en: "Roundabout — quiet while he negotiates it. Praise lane/island use afterwards.", bn: "রাউন্ডঅ্যাবাউট — চলার সময় চুপ। পরে লেন/আইল্যান্ড ব্যবহারের প্রশংসা।" },
      praise: "Good use of the roundabout — right lane, and you signalled off at the right time." },
    { n: 23, level: 2, road: "Wards Road", dir: "Take the fifth road on the left, please.",
      focus: { en: "Count the roads together. Praise lane arrows.", bn: "রাস্তা গুনতে সাহায্য করুন। লেন অ্যারো ব্যবহারের প্রশংসা।" },
      praise: "You followed the arrows perfectly there." },
    { n: 24, level: 2, road: "Mafeking Avenue", dir: "Take the second road on the left, please.",
      focus: { en: "Last shared section — notice how little you're prompting.", bn: "শেষ যৌথ অংশ — দেখুন কত কম প্রম্পট লাগছে।" } },
    { n: 25, level: 3, road: "Ladysmith Avenue", dir: "Take the first road on the left, then pull up on the left when it's safe, please.",
      focus: { en: "Handover to pupil-led driving. Short stop, check confidence, agree the new level.", bn: "স্বাধীন ড্রাইভিংয়ে হস্তান্তর। ছোট্ট বিরতি, আত্মবিশ্বাস যাচাই, নতুন মাত্রায় একমত।" },
      say: ["How do you feel about your driving so far?", "Out of ten?", "From here, how about you handle it on your own? I'll just give directions. If I don't say anything, follow the road. I'll still step in if it's unsafe, and we'll talk about it after. Happy to carry on?"],
      jamil: "About seven. Yes, I'd like to do it myself." },
    { n: 26, level: 3, road: "Aldborough Road South", dir: "At the end of the road, turn right, please.",
      focus: { en: "Directions only. Observe quietly.", bn: "শুধু দিকনির্দেশনা। চুপচাপ পর্যবেক্ষণ।" } },
    { n: 27, level: 3, road: "Cameron Road", dir: "At the roundabout, take the first exit, please.",
      focus: { en: "Praise a well-timed signal briefly.", bn: "সময়মতো সিগন্যালের ছোট্ট প্রশংসা।" },
      praise: "Well-timed signal — that helped the driver behind." },
    { n: 28, level: 3, road: "High Road", dir: "At the traffic lights, turn right, please.",
      focus: { en: "If stopped at red: one short question, then let him concentrate.", bn: "লাল বাতিতে থামলে: একটা ছোট প্রশ্ন, তারপর মনোযোগ দিতে দিন।" },
      wait: ["Which meeting situation today are you most pleased with?"] },
    { n: 29, level: 3, road: "Seven Kings Road", dir: "After the next traffic lights, take the immediate left, please.",
      focus: { en: "Shops, pedestrians, doors. Let him find them.", bn: "দোকান, পথচারী, দরজা। তাকেই খুঁজে বের করতে দিন।" } },
    { n: 30, level: 3, road: "Felbrigge Road", dir: "Take the first road on the left, please.",
      focus: { en: "Narrow road — the goal test. Is he choosing gaps early without you?", bn: "সরু রাস্তা — লক্ষ্যের আসল পরীক্ষা। আপনার সাহায্য ছাড়াই কি আগে গ্যাপ বাছছে?" } },
    { n: 31, level: 3, road: "Granton Road", dir: "At the end of the road, turn left, please.",
      focus: { en: "Same road as the start — compare.", bn: "শুরুর একই রাস্তা — তুলনা করুন।" },
      after: ["That's the road we started on. What did you do differently this time?"] },
    { n: 32, level: 3, road: "Kildowan Road", dir: "Take the next road on the right, please.",
      focus: { en: "Nearly back. Stay alert — don't relax early.", bn: "প্রায় ফিরে এসেছি। সতর্ক থাকুন — আগেভাগে ঢিলে দেবেন না।" } },
    { n: 33, level: 3, road: "Test centre", dir: "Turn into the test centre and park in a bay when it's safe, please.",
      focus: { en: "Secure the car, then start the reflection (≤ 3 min).", bn: "গাড়ি সুরক্ষিত করুন, তারপর রিফ্লেকশন শুরু (≤ ৩ মিনিট)।" } }
  ],
  levels: {
    1: { en: "Level 1 · Instructor-led (prompting)", bn: "লেভেল ১ · ইনস্ট্রাক্টর-নেতৃত্বে (প্রম্পটিং)" },
    2: { en: "Level 2 · Shared responsibility", bn: "লেভেল ২ · যৌথ দায়িত্ব" },
    3: { en: "Level 3 · Pupil-led (independent)", bn: "লেভেল ৩ · শিক্ষার্থী-নেতৃত্বে (স্বাধীন)" }
  },

  /* ---- Trenance Gardens: both outcomes ---- */
  bend: {
    fault: {
      title: { en: "If he takes the bend too fast or too far right", bn: "যদি সে বাঁকে খুব দ্রুত বা বেশি ডানে যায়" },
      lines: [
        ["M", "Jamil, slow down now, and move to your left."],
        ["N", "Dual brake only if he doesn't respond in time."],
        ["M", "When we're past the bend, pull up on the left when it's safe, please."],
        ["N", "Pull up using LADA: Look, Assess, Decide, Act."],
        ["M", "Do you know why I asked you to stop?", "F"],
        ["J", "Because I was too fast and too far out on the bend.", "F"],
        ["M", "What made you do that?", "C"],
        ["J", "I couldn't see round it, and I moved out to try to see.", "C"],
        ["M", "What was the risk?", "P"],
        ["J", "A car could suddenly come the other way, with no room to stop.", "P"],
        ["M", "Exactly. If you stay on your side, you've got more room to react. How could you plan earlier next time?", "S"],
        ["J", "Slow down before the bend, stay left, observe, then go.", "S"],
        ["M", "Well done. Shall we come back round to this bend so you can try it again?"],
        ["J", "Yes, please."],
        ["M", "Great. Any questions? … Happy to carry on? Then move off when it's safe and convenient."],
        ["N", "Adapt: give a bit more prompting for the next few roads, then step back again."]
      ]
    },
    good: {
      title: { en: "If he handles the bend well", bn: "যদি সে বাঁক ভালোভাবে নেয়" },
      lines: [
        ["M", "That was a really well-handled bend. What did you do that made it safe?"],
        ["J", "I slowed down before it, stayed on my side, and looked for reflections."],
        ["M", "Exactly — that's the plan we talked about. Keep doing that on every bend today."],
        ["N", "Don't invent a fault. Reflecting on success is equally good evidence of pupil analysis."]
      ]
    }
  },

  /* ---- Debrief ---- */
  debrief: {
    title: { en: "Reflection at the test centre (≤ 3 min)", bn: "টেস্ট সেন্টারে রিফ্লেকশন (≤ ৩ মিনিট)" },
    intro: { en: "Jamil talks first. Re-check the score, name what worked, agree the next step. Keep it short.", bn: "আগে জামিল বলবে। স্কোর আবার যাচাই, কী ভালো হলো, পরের ধাপ। সংক্ষেপে রাখুন।" },
    lines: [
      ["M", "So Jamil, that's the end of today's lesson. How do you feel about meeting traffic now, compared to the start?"],
      ["J", "Much better — I know how to handle it now."],
      ["M", "At the start you said five out of ten. What would you give yourself now?"],
      ["J", "Eight out of ten."],
      ["M", "That's great progress. Which part are you most confident with?"],
      ["J", "Spotting the gap early and stopping in time."],
      ["M", "Agreed — on Felbrigge Road you chose your gap before I could say anything. What would you still like to improve?"],
      ["J", "I got one bend wrong today. Can we practise more bends next lesson?"],
      ["M", "Of course — next lesson we'll work on bendy roads, with the same early planning. Well done today, Jamil."]
    ],
    tip: { en: "If he didn't make the bend mistake, change his last answer to what really happened ('I'd like more practice on busier roads', etc.).", bn: "যদি সে বাঁকে ভুল না করে থাকে, তার শেষ উত্তর বাস্তব অনুযায়ী বদলান (যেমন 'ব্যস্ত রাস্তায় আরও প্র্যাকটিস চাই')।" }
  },

  after: {
    title: { en: "After the lesson: the examiner's feedback", bn: "লেসনের পরে: এক্সামিনারের ফিডব্যাক" },
    items: [
      { en: "Thank Jamil and let him go first.", bn: "জামিলকে ধন্যবাদ দিন, তাকে আগে যেতে দিন।" },
      { en: "Listen to the result and feedback without arguing. Take notes.", bn: "তর্ক না করে ফলাফল ও ফিডব্যাক শুনুন। নোট নিন।" },
      { en: "Ask one useful question: 'Which competency would most improve my score?'", bn: "একটা কাজের প্রশ্ন করুন: 'কোন দক্ষতায় উন্নতি করলে আমার স্কোর সবচেয়ে বাড়বে?'" },
      { en: "Thank the examiner.", bn: "এক্সামিনারকে ধন্যবাদ দিন।" }
    ]
  },

  /* ---- What to say when… (stationary / long roads / surprises) ---- */
  talk: [
    { id: "red", icon: "🚦", title: { en: "Stopped at red lights (High Road, Green Lane, New Road)", bn: "লাল বাতিতে থামা (হাই রোড, গ্রিন লেন, নিউ রোড)" },
      why: { en: "The safest time to talk. Ask one or two questions linked to the goal — then let him watch the lights.", bn: "কথা বলার সবচেয়ে নিরাপদ সময়। লক্ষ্যের সাথে যুক্ত এক-দুটো প্রশ্ন — তারপর বাতির দিকে মন দিতে দিন।" },
      lines: ["How did that last narrow road go, out of ten?", "On the next road, where do you think the first problem might be?", "When we turn right here, who has priority?", "Is the level of help right for you, or would you like less?"] },
    { id: "queue", icon: "🚗", title: { en: "Stuck in a queue for 2–3 minutes", bn: "২–৩ মিনিট জ্যামে আটকে থাকা" },
      why: { en: "Use it for a mini-review — never chit-chat about unrelated things.", bn: "ছোট্ট রিভিউয়ের জন্য ব্যবহার করুন — অপ্রাসঙ্গিক গল্প নয়।" },
      lines: ["While we're waiting — what's gone well so far?", "Which gap today was the hardest to judge, and why?", "If a car came round that corner now, where would you wait?", "What will you look for on the next narrow road?"] },
    { id: "straight", icon: "🛣️", title: { en: "Long straight road, driving well", bn: "লম্বা সোজা রাস্তা, ভালো চালাচ্ছে" },
      why: { en: "Silence is fine. One short prompt at most, then let him concentrate.", bn: "চুপ থাকা ঠিক আছে। বড়জোর একটা ছোট প্রম্পট, তারপর মনোযোগ দিতে দিন।" },
      lines: ["What can you see at the end of the road?", "Talk me through what you're looking at.", "[Or say nothing — let him drive.]"] },
    { id: "gap", icon: "⏸️", title: { en: "Waiting in a gap for an oncoming car", bn: "গ্যাপে বিপরীতমুখী গাড়ির অপেক্ষা" },
      why: { en: "Reinforce the decision while it's fresh.", bn: "সিদ্ধান্তটা টাটকা থাকতেই মজবুত করুন।" },
      lines: ["Good choice of gap. Why did you pick this one?", "What's the other driver doing?", "Look at their headlights and try to make eye contact."] },
    { id: "perfect", icon: "⭐", title: { en: "He's doing everything right", bn: "সে সবকিছু ঠিকঠাক করছে" },
      why: { en: "Adapt! Reduce help earlier or raise the challenge. Examiners look for this.", bn: "মানিয়ে নিন! আগেভাগে সাহায্য কমান বা চ্যালেঞ্জ বাড়ান। এক্সামিনার এটাই খোঁজেন।" },
      lines: ["You're making these decisions really well. Shall I stop prompting from here?", "Let's try a busier road and see if you can keep it up."] },
    { id: "struggle", icon: "🔁", title: { en: "He keeps struggling", bn: "সে বারবার সমস্যায় পড়ছে" },
      why: { en: "Step back a level. That's adapting the plan, not failing.", bn: "এক ধাপ পিছিয়ে যান। এটা প্ল্যান মানিয়ে নেওয়া, ব্যর্থতা নয়।" },
      lines: ["Let's go back to me prompting for a few roads — is that okay?", "Let's pull up for a minute and look at the card again."] },
    { id: "minor", icon: "✏️", title: { en: "Minor fault (not dangerous)", bn: "ছোট ভুল (বিপজ্জনক নয়)" },
      why: { en: "Don't jump in. Ask at the next safe moment.", bn: "সাথে সাথে হস্তক্ষেপ নয়। পরের নিরাপদ মুহূর্তে জিজ্ঞেস করুন।" },
      lines: ["On that last road, how was your speed when the van appeared?", "What would you do differently there?"] },
    { id: "serious", icon: "⚠️", title: { en: "Serious or dangerous fault", bn: "গুরুতর বা বিপজ্জনক ভুল" },
      why: { en: "Act first, explain after: voice → dual controls → pull up (LADA) → FCPS.", bn: "আগে ব্যবস্থা, পরে ব্যাখ্যা: কণ্ঠ → ডুয়াল কন্ট্রোল → থামা (LADA) → FCPS।" },
      lines: ["Hold on the brake for me — we'll wait for that car first.", "Pull up on the left when it's safe, please.", "Do you know why I stopped you?"] },
    { id: "rain", icon: "🌧️", title: { en: "It starts to rain", bn: "বৃষ্টি শুরু হলো" },
      why: { en: "Real conditions = perfect teaching opportunity.", bn: "বাস্তব পরিস্থিতি = শেখানোর সেরা সুযোগ।" },
      lines: ["The road's getting wet — what changes for you now?", "So what does that mean for the gaps you choose?"] },
    { id: "surprise", icon: "🚑", title: { en: "Road closed, diversion, emergency vehicle", bn: "রাস্তা বন্ধ, ডাইভারশন, জরুরি গাড়ি" },
      why: { en: "Stay calm, give clear directions, discuss it afterwards.", bn: "শান্ত থাকুন, পরিষ্কার দিক বলুন, পরে আলোচনা করুন।" },
      lines: ["Follow the diversion signs, please — I'll guide you back.", "That was an ambulance — what did you do, and why was that right?"] },
    { id: "stall", icon: "😬", title: { en: "Stall or nerves", bn: "স্টল বা নার্ভাস" },
      why: { en: "Reassure and slow things down.", bn: "আশ্বস্ত করুন, ধীরে চলুন।" },
      lines: ["No problem — secure the car and take your time.", "You're doing well. There's no rush."] },
    { id: "examiner", icon: "📝", title: { en: "The examiner is writing in the back", bn: "এক্সামিনার পেছনে লিখছেন" },
      why: { en: "Ignore it. Focus on Jamil. Don't talk to the examiner during the lesson.", bn: "উপেক্ষা করুন। জামিলের দিকে মন দিন। লেসনের সময় এক্সামিনারের সাথে কথা বলবেন না।" },
      lines: ["[Keep coaching Jamil exactly as you would without the examiner.]"] }
  ],

  /* ---- Fixes to the master script ---- */
  fixes: [
    { area: "rm",
      what: { en: "Risk responsibility", bn: "ঝুঁকির দায়িত্ব" },
      before: "Who is responsible for the safety of everyone in the car and other road users? — Me. — Correct.",
      after: "We share the safety: you drive and make the decisions; I give directions in good time and step in if anything looks unsafe. Is that okay?",
      why: { en: "Agreeing that the pupil alone is responsible is inaccurate and is exactly what competency 5 checks. Make the sharing clear.", bn: "শুধু শিক্ষার্থী দায়ী বলে মেনে নেওয়া সঠিক নয় — দক্ষতা ৫ ঠিক এটাই যাচাই করে। ভাগাভাগিটা পরিষ্কার করুন।" } },
    { area: "lp",
      what: { en: "Opening length", bn: "শুরুর দৈর্ঘ্য" },
      before: "About 880 words in the opening (≈ 6–7 minutes spoken).",
      after: "The 3-minute opening in this tab (goal, help level, risk, wet roads).",
      why: { en: "gov.uk: goals and risk management should take no more than 3 minutes.", bn: "gov.uk: লক্ষ্য ও ঝুঁকি আলোচনা ৩ মিনিটের বেশি নয়।" } },
    { area: "tls",
      what: { en: "Accurate wording", bn: "সঠিক শব্দ" },
      before: "At 30 mph if the road is dry then a safe distance is 23 metres…",
      after: "At 30 the stopping distance is about 23 metres in the dry, so at least 46 in the wet.",
      why: { en: "It's the stopping distance, not a 'safe distance'. Competency 13 needs accurate information.", bn: "এটা থামার দূরত্ব, 'নিরাপদ দূরত্ব' নয়। দক্ষতা ১৩-এ সঠিক তথ্য দরকার।" } },
    { area: "tls",
      what: { en: "Ask, don't tell", bn: "বলবেন না, জিজ্ঞেস করুন" },
      before: "So when you enter a road with both side cars parked you need to apply appropriate speed and look for a safe gap.",
      after: "So what would help — what could you change about your speed and where you look?",
      why: { en: "Let Jamil reach the answer himself (competency 11).", bn: "জামিলকে নিজেই উত্তরে পৌঁছাতে দিন (দক্ষতা ১১)।" } },
    { area: "tls",
      what: { en: "Extra passenger", bn: "অতিরিক্ত যাত্রী" },
      before: "There are three of us in the car… I will need more gas for progression and more time for braking.",
      after: "Drop it, or: 'With an extra person in the car, it's a little heavier — so move off smoothly and brake early.'",
      why: { en: "Takes time from your 3 minutes and isn't central to the goal.", bn: "৩ মিনিট থেকে সময় নেয়, আর লক্ষ্যের মূল অংশ নয়।" } },
    { area: "rm",
      what: { en: "The planned mistake", bn: "পরিকল্পিত ভুল" },
      before: "[Mistake at the bend with speed and position, so intervene]",
      after: "Prepare both outcomes for Trenance Gardens: a fault, or a good bend. React to what really happens.",
      why: { en: "Never ask a pupil to drive unsafely on purpose. A scripted fault also looks staged — examiners reward genuine adaptation.", bn: "শিক্ষার্থীকে কখনো ইচ্ছা করে অনিরাপদভাবে চালাতে বলবেন না। সাজানো ভুল ধরা পড়ে — এক্সামিনার আসল মানিয়ে নেওয়াকে নম্বর দেন।" } }
  ]
};
