/* ADI Part 3 — Standards Check Study Guide
 * Instructor: Mohammed · Pupil: Jamil
 * Topic: Meeting oncoming traffic on narrow roads with parked vehicles
 * All lesson content lives here so it can be edited without touching app logic.
 */
window.ADI = {
  meta: {
    instructor: "Mohammed",
    pupil: "Jamil",
    topic: {
      en: "Meeting oncoming traffic on narrow roads with parked vehicles",
      bn: "পার্ক করা গাড়ি সহ সরু রাস্তায় বিপরীত দিক থেকে আসা গাড়ির মুখোমুখি হওয়া (Meeting traffic)"
    },
    target: { total: 43, max: 51, rmMin: 8 }
  },

  /* ---------- DVSA scoring (official form: 17 competencies × 0–3) ---------- */
  scoring: {
    areas: [
      { key: "lp",  en: "Lesson Planning", bn: "লেসন প্ল্যানিং", count: 4, max: 12, color: "sky" },
      { key: "rm",  en: "Risk Management", bn: "রিস্ক ম্যানেজমেন্ট", count: 5, max: 15, color: "rose" },
      { key: "tls", en: "Teaching & Learning Strategies", bn: "টিচিং ও লার্নিং স্ট্র্যাটেজি", count: 8, max: 24, color: "violet" }
    ],
    bands: [
      { from: 0,  to: 30, grade: "Fail", en: "Fail (0–30)", bn: "ফেল (০–৩০)" },
      { from: 31, to: 42, grade: "B",    en: "Grade B (31–42)", bn: "গ্রেড বি (৩১–৪২)" },
      { from: 43, to: 51, grade: "A",    en: "Grade A (43–51)", bn: "গ্রেড এ (৪৩–৫১)" }
    ],
    rules: [
      { en: "Each of the 17 competencies is marked 0–3, so the maximum is 51.",
        bn: "১৭টি দক্ষতার প্রতিটিতে ০ থেকে ৩ নম্বর — মোট সর্বোচ্চ ৫১।" },
      { en: "Risk Management of 7 or less (out of 15) is an automatic fail, whatever the total. Aim for 8+, ideally 12+.",
        bn: "মোট নম্বর যাই হোক, রিস্ক ম্যানেজমেন্টে ৭ বা তার কম পেলে সরাসরি ফেল। কমপক্ষে ৮, ভালো হয় ১২+।" },
      { en: "Timing (gov.uk): about 45-minute lesson. Goals and risk agreement no more than 3 minutes, Jamil drives about 40 minutes, his reflection no more than 3 minutes.",
        bn: "সময় (gov.uk): প্রায় ৪৫ মিনিটের লেসন। লক্ষ্য ও ঝুঁকি চুক্তি ৩ মিনিটের বেশি নয়, জামিল প্রায় ৪০ মিনিট ড্রাইভ করবে, শেষের রিফ্লেকশন ৩ মিনিটের বেশি নয়।" },
      { en: "The examiner can also stop the lesson (automatic fail) if anyone is put in danger.",
        bn: "কাউকে বিপদে ফেললে এক্সামিনার লেসন থামিয়ে দিতে পারেন — সেটাও সরাসরি ফেল।" }
    ]
  },

  /* ---------- Core instructor principles ---------- */
  principles: [
    {
      icon: "user",
      en: "Pupil-centred learning",
      bn: "শিক্ষার্থী-কেন্দ্রিক শিক্ষা (Client-centred learning)",
      body: {
        en: "Jamil sets the goal, rates his own confidence, analyses his own faults and decides how much help he wants. Mohammed guides with open questions (What? Why? How?) rather than telling.",
        bn: "জামিল নিজেই লক্ষ্য ঠিক করে, নিজের আত্মবিশ্বাস রেট করে, নিজের ভুল বিশ্লেষণ করে এবং কতটা সাহায্য চায় তা বলে। মোহাম্মদ সরাসরি বলে দেন না — খোলা প্রশ্ন (কী? কেন? কীভাবে?) দিয়ে পথ দেখান।"
      },
      points: [
        { en: "Agree the goal together — never impose it", bn: "লক্ষ্য একসাথে ঠিক করুন — চাপিয়ে দেবেন না" },
        { en: "Confidence scale at start (5/10) and end (8/10)", bn: "শুরুতে (৫/১০) ও শেষে (৮/১০) আত্মবিশ্বাস স্কেল" },
        { en: "Ask, listen, then adapt the plan", bn: "প্রশ্ন করুন, শুনুন, তারপর প্ল্যান মানিয়ে নিন" }
      ]
    },
    {
      icon: "search",
      en: "FCPS fault analysis",
      bn: "এফসিপিএস ভুল বিশ্লেষণ পদ্ধতি",
      body: {
        en: "Fault → Cause → Problem (risk) → Solution. Pull up safely, then let Jamil identify each step through questions. He owns the solution, so he remembers it.",
        bn: "ফল্ট (কী ভুল হলো) → কজ (কেন হলো) → প্রবলেম/রিস্ক (কী বিপদ হতে পারত) → সলিউশন (পরের বার কী করবে)। নিরাপদে গাড়ি থামিয়ে প্রশ্নের মাধ্যমে জামিলকে দিয়েই প্রতিটি ধাপ বলান।"
      },
      points: [
        { en: "F — What happened?", bn: "F — কী ঘটেছিল?" },
        { en: "C — Why did it happen?", bn: "C — কেন ঘটেছিল?" },
        { en: "P — What could have happened?", bn: "P — কী বিপদ হতে পারত?" },
        { en: "S — What will you do next time?", bn: "S — পরের বার কী করবে?" }
      ]
    },
    {
      icon: "shield",
      en: "Dynamic risk management",
      bn: "গতিশীল ঝুঁকি ব্যবস্থাপনা (Dynamic risk management)",
      body: {
        en: "Agree up front how responsibility for risk is shared, then raise or lower the level of help as the road and Jamil's performance change: full prompting → shared → independent, and back again if needed.",
        bn: "শুরুতেই ঝুঁকির দায়িত্ব কীভাবে ভাগ হবে তা একমত হোন। তারপর রাস্তা ও জামিলের পারফরম্যান্স অনুযায়ী সাহায্যের মাত্রা বাড়ান বা কমান: পূর্ণ প্রম্পটিং → যৌথ দায়িত্ব → স্বাধীন ড্রাইভিং — দরকার হলে আবার আগের ধাপে।"
      },
      points: [
        { en: "Directions clear and in good time", bn: "দিকনির্দেশনা পরিষ্কার ও সময়মতো" },
        { en: "Verbal → physical intervention only when needed", bn: "প্রয়োজনে মৌখিক → শারীরিক হস্তক্ষেপ" },
        { en: "Explain every intervention afterwards", bn: "প্রতিটি হস্তক্ষেপের পরে কারণ ব্যাখ্যা করুন" }
      ]
    }
  ],

  /* ---------- 4-phase lesson plan ---------- */
  // speaker: "M" = Mohammed, "J" = Jamil, "N" = stage direction
  phases: [
    {
      id: "p1",
      num: 1,
      title: { en: "Recap & SMART goal setting", bn: "রিক্যাপ ও স্মার্ট (SMART) লক্ষ্য নির্ধারণ" },
      time: "≈ 1.5 min",
      area: "Lesson Planning",
      summary: {
        en: "Find out what Jamil did last time, what he wants from today, and agree a SMART goal together. Use a confidence scale so progress can be measured at the end.",
        bn: "গত লেসনে জামিল কী করেছিল, আজ কী শিখতে চায় তা জানুন এবং একসাথে একটি SMART লক্ষ্য ঠিক করুন। শেষে অগ্রগতি মাপতে আত্মবিশ্বাস স্কেল ব্যবহার করুন।"
      },
      smart: [
        { k: "S", en: "Specific — meet oncoming traffic safely on narrow roads with parked vehicles on one or both sides.", bn: "নির্দিষ্ট — এক বা দুই পাশে পার্ক করা গাড়ি সহ সরু রাস্তায় বিপরীতমুখী গাড়ির সাথে নিরাপদে মোকাবিলা।" },
        { k: "M", en: "Measurable — choose a safe waiting gap early, without a prompt, in most meeting situations on the Level 3 route; confidence from 5/10 to 8/10.", bn: "পরিমাপযোগ্য — লেভেল ৩ রুটে বেশিরভাগ ক্ষেত্রে প্রম্পট ছাড়াই আগে থেকে নিরাপদ গ্যাপ বেছে নেওয়া; আত্মবিশ্বাস ৫/১০ থেকে ৮/১০।" },
        { k: "A", en: "Achievable — builds on last lesson's junction observation work.", bn: "অর্জনযোগ্য — গত লেসনের জাংশন অবজারভেশনের উপর ভিত্তি করে।" },
        { k: "R", en: "Relevant — Jamil's own request; common on Ilford/Goodmayes residential roads.", bn: "প্রাসঙ্গিক — জামিলের নিজের অনুরোধ; ইলফোর্ড/গুডমেইজের আবাসিক রাস্তায় খুবই সাধারণ।" },
        { k: "T", en: "Time-bound — by the end of today's lesson.", bn: "সময়সীমা — আজকের লেসন শেষ হওয়ার মধ্যে।" }
      ],
      confidence: { start: 5, mid: 7, end: 8 },
      blocks: [
        {
          title: { en: "Recap and goal", bn: "রিক্যাপ ও লক্ষ্য" },
          coach: { en: "Open questions only. Let Jamil describe the difficulty in his own words — that is your evidence for competency 1 (learning goals and needs).", bn: "শুধু খোলা প্রশ্ন করুন। জামিলকে নিজের ভাষায় সমস্যাটা বলতে দিন — এটাই দক্ষতা ১-এর (লক্ষ্য ও চাহিদা) প্রমাণ।" },
          lines: [
            ["M", "Hi Jamil, good to see you again. Before we start, can you remind me what we worked on last lesson and how you felt it went?"],
            ["J", "We worked on observation and judgement at junctions. I felt mostly comfortable, but sometimes I was a little late spotting what was happening ahead."],
            ["M", "Thanks for explaining that. Is there anything in particular you would like to improve today?"],
            ["J", "I'd like to get better at meeting oncoming traffic on narrow roads, especially when cars are parked on both sides. I sometimes spot the other vehicle late and then I'm not sure which gap is safest."],
            ["M", "That makes sense. What do you think makes it difficult?"],
            ["J", "I can become focused on the parked cars close to me, so I don't always look far enough ahead. I may also approach a bend a little too quickly."],
            ["M", "Good reflection. On a scale of one to ten, how confident do you feel about choosing a safe place to wait when an oncoming vehicle appears?"],
            ["J", "About five out of ten."]
          ]
        },
        {
          title: { en: "Agree the SMART goal and level of help", bn: "SMART লক্ষ্য ও সাহায্যের মাত্রা নিয়ে একমত হওয়া" },
          coach: { en: "Say the goal back to him so it is clearly agreed. Offer the three levels of help and let him choose — this is competency 2 (lesson structure).", bn: "লক্ষ্যটা তাকে আবার বলে শোনান যাতে স্পষ্টভাবে একমত হওয়া যায়। তিন ধাপের সাহায্যের কথা বলুন এবং তাকে বেছে নিতে দিন — এটা দক্ষতা ২ (লেসন কাঠামো)।" },
          lines: [
            ["M", "What would you like to be able to do by the end of the lesson?"],
            ["J", "I'd like to spot oncoming vehicles earlier, judge who should wait, and choose a safe gap without rushing."],
            ["M", "So our goal is: by the end of today, you'll spot oncoming traffic early and choose a safe place to wait on narrow roads, mostly without prompts from me — and we'd like your confidence to move from five towards eight. Does that sound right?"],
            ["J", "Yes, that's exactly it."],
            ["M", "We'll begin with more guidance from me, then share the decisions, and if it's safe and you're ready, you'll handle it independently. How does that sound?"],
            ["J", "That sounds good. I'd like some prompts at the start, then a chance to make the decisions myself."]
          ]
        }
      ]
    },
    {
      id: "p2",
      num: 2,
      title: { en: "Interactive briefing & risk agreement", bn: "ইন্টারঅ্যাক্টিভ ব্রিফিং ও ঝুঁকি চুক্তি" },
      time: "≈ 1.5 min",
      area: "Risk Management",
      summary: {
        en: "Use a quick diagram to agree priority rules, clearance and wet-weather stopping distances. Agree exactly how responsibility for risk is shared and how the dual controls will be used.",
        bn: "একটি ছোট ডায়াগ্রাম দিয়ে অগ্রাধিকারের নিয়ম, ক্লিয়ারেন্স ও ভেজা রাস্তায় থামার দূরত্ব নিয়ে আলোচনা করুন। ঝুঁকির দায়িত্ব কীভাবে ভাগ হবে এবং ডুয়াল কন্ট্রোল কখন ব্যবহার হবে তা স্পষ্টভাবে একমত হোন।"
      },
      keyFacts: [
        { label: { en: "Obstruction on OUR side", bn: "বাধা আমাদের পাশে" }, value: { en: "Be ready to give way — the oncoming driver usually has the clearer route.", bn: "অপেক্ষা করার জন্য প্রস্তুত থাকুন — সাধারণত বিপরীত দিকের চালকের রাস্তা পরিষ্কার।" } },
        { label: { en: "Obstruction on THEIR side", bn: "বাধা তাদের পাশে" }, value: { en: "We may have priority, but never force our way through.", bn: "আমাদের অগ্রাধিকার থাকতে পারে, কিন্তু কখনো জোর করে যাবেন না।" } },
        { label: { en: "Parked on BOTH sides", bn: "দুই পাশেই পার্ক করা" }, value: { en: "Assess, communicate and negotiate — whoever has a safe gap first should be ready to wait.", bn: "মূল্যায়ন করুন ও সমঝোতা করুন — যার কাছে আগে নিরাপদ গ্যাপ আছে, সে অপেক্ষার জন্য প্রস্তুত থাকবে।" } },
        { label: { en: "Clearance", bn: "ক্লিয়ারেন্স" }, value: { en: "About 1 metre (a door's width) from parked cars. Less space → less speed, or wait.", bn: "পার্ক করা গাড়ি থেকে প্রায় ১ মিটার (একটি দরজার প্রস্থ)। জায়গা কম হলে → গতি কম, অথবা অপেক্ষা।" } }
      ],
      stopping: { mph: 30, dry: 23, wet: 46 },
      dualControl: [
        { step: 1, en: "Prompt — a question or reminder (\"What can you see ahead?\")", bn: "প্রম্পট — প্রশ্ন বা মনে করিয়ে দেওয়া (\"সামনে কী দেখছ?\")" },
        { step: 2, en: "Instruction — clear, direct verbal command (\"Ease off now… brake gently\")", bn: "নির্দেশ — পরিষ্কার, সরাসরি মৌখিক আদেশ (\"এখন গতি কমাও… আস্তে ব্রেক করো\")" },
        { step: 3, en: "Physical — dual brake or light steering assistance, only if the verbal step is not enough or there is no time", bn: "শারীরিক — ডুয়াল ব্রেক বা হালকা স্টিয়ারিং সহায়তা, শুধুমাত্র মৌখিক নির্দেশ যথেষ্ট না হলে বা সময় না থাকলে" },
        { step: 4, en: "Explain — pull up safely and explain why you intervened (feeds into FCPS)", bn: "ব্যাখ্যা — নিরাপদে থেমে কেন হস্তক্ষেপ করলেন তা বুঝিয়ে বলুন (FCPS-এর অংশ)" }
      ],
      blocks: [
        {
          title: { en: "Risk responsibility agreement", bn: "ঝুঁকির দায়িত্ব চুক্তি" },
          coach: { en: "Competency 5: make sure Jamil can say back how risk is shared. Ask him — don't just tell him.", bn: "দক্ষতা ৫: জামিল যেন নিজের মুখে বলতে পারে ঝুঁকি কীভাবে ভাগ হচ্ছে। শুধু বলে দেবেন না — জিজ্ঞেস করুন।" },
          lines: [
            ["M", "Before we move off, who is responsible for the safety of everyone in this car and other road users?"],
            ["J", "We share it. I need to drive safely and follow your instructions, and you're responsible for the overall safety of the lesson. You may need to step in if there's danger."],
            ["M", "Correct. I'll give directions in good time. Otherwise, follow the road, signs and markings, and keep scanning ahead. If I say 'Stop', respond promptly and safely."],
            ["M", "If I feel the situation is becoming unsafe, I'll first prompt you, then give a clear instruction, and only if it's needed I'll use the dual brake or help with the steering. Afterwards I'll always explain why. Is that okay with you?"],
            ["J", "Yes, that's clear."]
          ]
        },
        {
          title: { en: "Diagram briefing — gaps, priority and hazards", bn: "ডায়াগ্রাম ব্রিফিং — গ্যাপ, অগ্রাধিকার ও বিপদ" },
          coach: { en: "Point at the diagram while asking. Let Jamil find the gaps and hazards himself before you confirm.", bn: "প্রশ্ন করার সময় ডায়াগ্রামে দেখান। নিশ্চিত করার আগে জামিলকে নিজেই গ্যাপ ও বিপদগুলো খুঁজে বের করতে দিন।" },
          lines: [
            ["M", "Let's look at this road layout. There are parked vehicles on both sides, a bend, and a few possible gaps. What would you look for first?"],
            ["J", "I'd look well ahead for oncoming traffic and identify possible places where I could wait."],
            ["M", "Why identify the gaps early rather than waiting until the last moment?"],
            ["J", "It gives me time to choose a suitable gap and avoid braking or steering suddenly."],
            ["M", "Good. What else could be hidden around parked vehicles?"],
            ["J", "Pedestrians, cyclists, children, someone opening a door, or a vehicle pulling out."],
            ["M", "Exactly. Look through windows, beneath vehicles for feet or movement, and for reflections or headlights. A bend restricts what we can see, so our speed must let us stop within the distance we can see to be clear."],
            ["M", "When passing parked vehicles, try to leave about a metre — roughly a door's width. What if that clearance isn't available?"],
            ["J", "I should slow down, or wait, rather than squeeze through."],
            ["M", "Good. If the obstruction is on our side, the oncoming driver usually has the clearer route, so be prepared to hold back. If it's on their side, we may have priority, but we never force our way through. With cars on both sides, we assess and negotiate."]
          ]
        },
        {
          title: { en: "Wet weather and final check", bn: "ভেজা আবহাওয়া ও শেষ যাচাই" },
          coach: { en: "Technical information must be accurate (competency 13). Highway Code: 23 m typical stopping distance at 30 mph in the dry; in the wet it can be at least double.", bn: "টেকনিক্যাল তথ্য সঠিক হতে হবে (দক্ষতা ১৩)। হাইওয়ে কোড: শুকনো রাস্তায় ৩০ মাইল/ঘণ্টায় থামার দূরত্ব ২৩ মিটার; ভেজা রাস্তায় কমপক্ষে দ্বিগুণ।" },
          lines: [
            ["M", "The road's damp today. At 30 miles per hour, the typical stopping distance in the dry is about 23 metres — roughly six car lengths. What happens in the wet?"],
            ["J", "It can be at least double — around 46 metres. So I need to reduce my speed and leave more space."],
            ["M", "Correct. We'll adapt to the actual conditions. Any questions before we move off?"],
            ["J", "No, I'm ready."],
            ["M", "Please move off when it's safe and convenient."]
          ]
        }
      ]
    },
    {
      id: "p3",
      num: 3,
      title: { en: "Core driving phase", bn: "মূল ড্রাইভিং পর্ব" },
      time: "≈ 40 min",
      area: "Risk Management · Teaching & Learning",
      summary: {
        en: "Three levels of instruction, each on its own route. Reduce help as Jamil's decisions improve — and step back up after the blind-bend fault at Trenance Gardens.",
        bn: "তিন ধাপের নির্দেশনা, প্রতিটির নিজস্ব রুট। জামিলের সিদ্ধান্ত যত ভালো হবে, সাহায্য তত কমবে — আর ট্রেনান্স গার্ডেন্সের ব্লাইন্ড বেন্ডের ভুলের পরে আবার সাহায্য বাড়ান।"
      },
      routeNote: {
        en: "This tab is the teaching script. Every turn, with exact directions, is in the Exam Day tab. Confirm road names on your dry run.",
        bn: "এই ট্যাবটি টিচিং স্ক্রিপ্ট। প্রতিটি মোড় ও সঠিক দিকনির্দেশনা 'পরীক্ষার দিন' ট্যাবে। ড্রাই রানে রাস্তার নাম মিলিয়ে নিন।"
      },
      levels: [
        {
          id: "l1",
          level: 1,
          name: { en: "Full prompting", bn: "সম্পূর্ণ প্রম্পটিং" },
          desc: { en: "Mohammed talks Jamil through each meeting situation with questions and prompts.", bn: "মোহাম্মদ প্রতিটি পরিস্থিতিতে প্রশ্ন ও প্রম্পট দিয়ে জামিলকে গাইড করেন।" },
          route: ["Kildowan Road", "Granton Road", "Green Lane", "Goodmayes Lane", "Trenance Gardens", "Westrow Gardens", "Levett Gardens", "Goodmayes Lane", "Terence Road", "Westrow Gardens", "Levett Gardens"],
          blocks: [
            {
              title: { en: "Kildowan Road → Granton Road → Green Lane: prompted scanning", bn: "কিলডোয়ান রোড → গ্র্যান্টন রোড → গ্রিন লেন: প্রম্পট সহ স্ক্যানিং" },
              coach: { en: "Ask questions that make Jamil look further ahead. Praise specific good decisions.", bn: "এমন প্রশ্ন করুন যাতে জামিল আরও দূরে তাকায়। নির্দিষ্ট ভালো সিদ্ধান্তের প্রশংসা করুন।" },
              lines: [
                ["N", "Moving off on Kildowan Road; directions given in good time onto Granton Road."],
                ["M", "We're coming onto Granton Road. Start scanning ahead now — as far as you can see. What can you see?"],
                ["J", "There are parked cars on both sides and a vehicle coming towards us in the distance."],
                ["M", "Good. Where are the possible gaps? Which one looks safest for us to wait in if we need to?"],
                ["J", "There's a gap just beyond the blue car on our left. I need to check it's long enough and that nobody is behind or beside it."],
                ["M", "Good planning. Ease off early and keep a position that gives you room to assess. Don't commit past the obstruction until you've decided there's enough space."],
                ["J", "I'm slowing down and checking the gap."],
                ["M", "What do you think the oncoming driver is likely to do?"],
                ["J", "They may continue because the parked cars are on our side, but I shouldn't assume. I'll watch their speed and position."],
                ["M", "Exactly. Is the gap still available?"],
                ["J", "Yes, it's clear, and I can stop there without blocking a junction or a driveway."],
                ["M", "Good. Hold back and let the oncoming vehicle pass."],
                ["J", "It's passed. I'll check again and move through when it's safe."],
                ["M", "Well done. How did slowing down early help you?"],
                ["J", "It gave me time to compare the gaps and decide without rushing."]
              ]
            },
            {
              title: { en: "Green Lane → Goodmayes Lane: priority and clearance", bn: "গ্রিন লেন → গুডমেইজ লেন: অগ্রাধিকার ও ক্লিয়ারেন্স" },
              coach: { en: "Check his understanding of priority — he should not rely on priority alone.", bn: "অগ্রাধিকার সম্পর্কে তার বোঝাপড়া যাচাই করুন — শুধু অগ্রাধিকারের উপর নির্ভর করা চলবে না।" },
              lines: [
                ["M", "As we head along towards Goodmayes Lane, look further along. What do you notice about the parked vehicles and the space?"],
                ["J", "There are cars parked on our side, and the road narrows by the van. There's a car approaching."],
                ["M", "Who has the clearer route here, and what will you base your decision on?"],
                ["J", "The obstruction's on our side, so I should be ready to wait. I'll check the distance to the oncoming car, the gap behind the van, and whether anyone could step out."],
                ["M", "What clearance should you try to keep from the parked vehicles?"],
                ["J", "About a metre — a door's width — where the road allows. If there isn't room, I slow down or wait."],
                ["M", "Good. Watch the windows of the parked cars. What might a reflection tell you?"],
                ["J", "It might show movement or headlights before I can see the vehicle directly."]
              ]
            },
            {
              title: { en: "Trenance Gardens: blind bend — spontaneous fault & intervention", bn: "ট্রেনান্স গার্ডেন্স: ব্লাইন্ড বেন্ড — হঠাৎ ভুল ও হস্তক্ষেপ" },
              fcps: true,
              coach: { en: "This is your key Risk Management evidence (competencies 7, 8 and 9). Verbal instruction first; dual brake only because the speed was too high for the view. Then pull up and run FCPS with questions.", bn: "এটাই আপনার মূল রিস্ক ম্যানেজমেন্ট প্রমাণ (দক্ষতা ৭, ৮ ও ৯)। প্রথমে মৌখিক নির্দেশ; দৃষ্টিসীমার তুলনায় গতি বেশি থাকায় ডুয়াল ব্রেক। তারপর থেমে প্রশ্নের মাধ্যমে FCPS করুন।" },
              lines: [
                ["M", "We're approaching the bend in Trenance Gardens with parked cars. What can you see beyond it?"],
                ["J", "Not much. The parked cars block my view of the bend."],
                ["J", "I'm going to keep this speed and move a bit towards the centre so I can see better."],
                ["N", "Speed too high for the view; car drifting towards the centre before the bend."],
                ["M", "Jamil, ease off now and keep to your side. Brake gently for me."],
                ["N", "Mohammed applies the dual brake lightly to bring the speed down before the bend."],
                ["M", "I'm helping with the brake because our view is limited and the speed is too high for what we can see. We'll pull up on the left once we're clear."],
                ["J", "Okay. I didn't realise how quickly the view disappeared."],
                ["N", "Pulled up safely on the left. FCPS fault analysis begins."],
                ["M", "Thanks, Jamil. Let's understand that together. What happened as we approached the bend?", "F"],
                ["J", "I didn't slow down early enough, and I moved towards the centre before I knew the road ahead was clear.", "F"],
                ["M", "That's the fault. Why do you think you made that decision?", "C"],
                ["J", "I was concentrating on getting past the parked cars and thought moving out would help me see. I didn't plan for an oncoming vehicle.", "C"],
                ["M", "What could have happened?", "P"],
                ["J", "A car could have come round the bend with too little room to stop or get back. It could have been a head-on collision or an emergency stop.", "P"],
                ["M", "Exactly. So what will you do differently next time?", "S"],
                ["J", "Scan earlier, slow down before the bend, stay on my side, and only go at a speed where I can stop in the distance I can see is clear. If I can't see enough, I'll wait.", "S"],
                ["M", "That's Fault, Cause, Problem and Solution. Are you happy to carry on with a bit more guidance from me for the next section?"],
                ["J", "Yes. I'll slow down sooner and find a safe gap before moving around anything."]
              ]
            }
          ]
        },
        {
          id: "l2",
          level: 2,
          name: { en: "Shared responsibility", bn: "যৌথ দায়িত্ব" },
          desc: { en: "Mohammed asks questions; Jamil makes and explains his own decisions. Prompts only when needed.", bn: "মোহাম্মদ প্রশ্ন করেন; জামিল নিজের সিদ্ধান্ত নেয় ও ব্যাখ্যা করে। প্রয়োজন হলেই কেবল প্রম্পট।" },
          route: ["Gyllyngdune Gardens", "Beamere Road", "Oakwood Gardens", "Green Lane", "New Road", "High Road", "Cameron Road", "Aldborough Road South", "Ward Road", "Mafeking Avenue"],
          blocks: [
            {
              title: { en: "Gyllyngdune Gardens → Beamere Road → Oakwood Gardens: applying the FCPS solution", bn: "গিলিংডিউন গার্ডেন্স → বিমিয়ার রোড → ওকউড গার্ডেন্স: FCPS সমাধান প্রয়োগ" },
              coach: { en: "Let him talk through his plan. Only step in if the plan is unsafe. Check that his Trenance Gardens solution is now being used.", bn: "তাকে নিজের পরিকল্পনা বলতে দিন। পরিকল্পনা অনিরাপদ হলেই কেবল হস্তক্ষেপ করুন। ট্রেনান্স গার্ডেন্সের সমাধান এখন ব্যবহার হচ্ছে কিনা দেখুন।" },
              lines: [
                ["M", "There's another restricted bend coming up. Talk me through what you'll do."],
                ["J", "The view is limited by the bend and the parked cars, so I'll reduce speed before I reach it."],
                ["M", "What speed is right?"],
                ["J", "One where I can stop safely within the distance I can see to be clear — not a fixed number."],
                ["M", "Where will you position the car?"],
                ["J", "On my side, with enough room from the parked cars, without cutting towards the centre."],
                ["J", "I can see an oncoming vehicle now. There's a gap behind the parked car on my left — I'll slow down and hold back there."],
                ["M", "Is the gap suitable?"],
                ["J", "It looks long enough and it's clear. I won't block a junction. I'll wait for them to pass."],
                ["J", "They've passed. The route's clear, so I'll go through carefully."],
                ["M", "That was a much safer plan. What did you change from Trenance Gardens?"],
                ["J", "I slowed down earlier, kept a safer position and chose my waiting place before the bend."]
              ]
            },
            {
              title: { en: "Green Lane → New Road → High Road", bn: "গ্রিন লেন → নিউ রোড → হাই রোড" },
              coach: { en: "Busier roads — keep checking his scanning and mirror use. Use positive, specific feedback (competency 14).", bn: "ব্যস্ত রাস্তা — তার স্ক্যানিং ও মিরর ব্যবহার দেখতে থাকুন। ইতিবাচক ও নির্দিষ্ট ফিডব্যাক দিন (দক্ষতা ১৪)।" },
              lines: [
                ["M", "The oncoming car on New Road has slowed. What do you need to check before you go?"],
                ["J", "That they're actually waiting for me, that the gap is clear, and that I can pass without making them move."],
                ["M", "Good. Move through slowly with enough room."],
                ["J", "I'm through, and the road's opening up."],
                ["M", "How did you decide to go?"],
                ["J", "I looked at the space and the other driver's behaviour rather than just assuming I had priority."],
                ["M", "Well judged. As we join the busier roads towards High Road, keep the same approach and keep checking your mirrors."]
              ]
            },
            {
              title: { en: "Cameron Road → Aldborough Road South → Ward Road → Mafeking Avenue: confidence check", bn: "ক্যামেরন রোড → অলডবরো রোড সাউথ → ওয়ার্ড রোড → মাফেকিং অ্যাভিনিউ: আত্মবিশ্বাস যাচাই" },
              coach: { en: "Mid-lesson confidence check (7/10) — this is evidence for competency 4 (adapting the plan).", bn: "লেসনের মাঝে আত্মবিশ্বাস যাচাই (৭/১০) — এটা দক্ষতা ৪-এর (প্ল্যান মানিয়ে নেওয়া) প্রমাণ।" },
              lines: [
                ["M", "Jamil, you're making much better decisions. How confident do you feel now about meeting oncoming traffic?"],
                ["J", "About seven out of ten. I'm looking further ahead and choosing a gap earlier."],
                ["M", "Good. For the next route, I'll mainly give directions and you'll handle the traffic yourself. I'll still step in if safety needs it. Happy to continue?"],
                ["J", "Yes."]
              ]
            }
          ]
        },
        {
          id: "l3",
          level: 3,
          name: { en: "Independent driving", bn: "স্বাধীন ড্রাইভিং" },
          desc: { en: "Directions only. Jamil plans and commentates. Mohammed observes quietly and stays ready to intervene.", bn: "শুধু দিকনির্দেশনা। জামিল নিজে পরিকল্পনা করে ও কমেন্ট্রি দেয়। মোহাম্মদ চুপচাপ পর্যবেক্ষণ করেন, তবে হস্তক্ষেপের জন্য প্রস্তুত।" },
          route: ["Ladysmith Avenue", "Aldborough Road South", "Cameron Road", "High Road", "Electric Parade", "Felbridge Road", "Granton Road", "Kildowan Road Test Centre"],
          blocks: [
            {
              title: { en: "Ladysmith Avenue → Aldborough Road South → Cameron Road → High Road → Electric Parade", bn: "লেডিস্মিথ অ্যাভিনিউ → অলডবরো রোড সাউথ → ক্যামেরন রোড → হাই রোড → ইলেকট্রিক প্যারেড" },
              coach: { en: "Stay quiet unless needed. Silence is a teaching tool here — he must show the goal independently.", bn: "প্রয়োজন ছাড়া চুপ থাকুন। এখানে নীরবতাই শিক্ষার কৌশল — তাকে স্বাধীনভাবে লক্ষ্য অর্জন দেখাতে হবে।" },
              lines: [
                ["J", "There's a parked van on my side and a car approaching. I'll hold back in the gap before the van."],
                ["N", "Mohammed observes quietly."],
                ["J", "The car's passed. The gap's clear and I have room to pass the van. I'll go slowly and keep a safe clearance."],
                ["M", "Thank you. Continue when it's safe."],
                ["J", "Another narrow section ahead. There's a gap on the left, but it's close to a junction, so I won't use it. I'll wait at the wider gap behind the next car."],
                ["N", "Mohammed observes quietly."],
                ["J", "The other driver's stopped and is giving way. I'll make sure it's clear before I go through."],
                ["M", "Good decision."]
              ]
            },
            {
              title: { en: "Felbridge Road → Granton Road → Kildowan Road Test Centre", bn: "ফেলব্রিজ রোড → গ্র্যান্টন রোড → কিলডোয়ান রোড টেস্ট সেন্টার" },
              coach: { en: "Wet-road decisions and pedestrian awareness without prompting = SMART goal achieved.", bn: "প্রম্পট ছাড়াই ভেজা রাস্তার সিদ্ধান্ত ও পথচারী সচেতনতা = SMART লক্ষ্য অর্জিত।" },
              lines: [
                ["J", "The road's wet, so I'll keep my speed down and leave extra room. No sudden steering or braking."],
                ["M", "Follow the road back towards Granton Road, please."],
                ["J", "Checking mirrors before changing position and watching for pedestrians between the parked cars."],
                ["N", "Minimal prompts. Mohammed observes scanning, speed choice and gap selection on the way back to Kildowan Road Test Centre."],
                ["M", "Please pull up on the left when it's safe and convenient."]
              ]
            }
          ]
        }
      ]
    },
    {
      id: "p4",
      num: 4,
      title: { en: "Debrief & self-evaluation", bn: "ডিব্রিফ ও আত্ম-মূল্যায়ন" },
      time: "≤ 3 min",
      area: "Teaching & Learning",
      summary: {
        en: "Jamil reflects first. Re-check the confidence score against the start, confirm the key learning points, and agree the next step.",
        bn: "প্রথমে জামিল নিজে মূল্যায়ন করবে। শুরুর তুলনায় আত্মবিশ্বাস স্কোর আবার যাচাই করুন, মূল শিক্ষণীয় বিষয় নিশ্চিত করুন এবং পরবর্তী ধাপ ঠিক করুন।"
      },
      blocks: [
        {
          title: { en: "Pupil reflection", bn: "শিক্ষার্থীর প্রতিফলন" },
          coach: { en: "Competency 17: Jamil must reflect on his own performance — ask before you tell.", bn: "দক্ষতা ১৭: জামিলকে নিজের পারফরম্যান্স নিয়ে ভাবতে হবে — বলার আগে জিজ্ঞেস করুন।" },
          lines: [
            ["M", "Thank you. How do you feel the lesson went overall?"],
            ["J", "I feel more confident. I was rushing at the bend in Trenance Gardens, but slowing down earlier helped me plan and choose a gap."],
            ["M", "At the start you rated yourself five out of ten. Where would you put yourself now?"],
            ["J", "Around eight out of ten. I'm better at spotting oncoming vehicles and choosing where to wait. I still need practice on blind bends."]
          ]
        },
        {
          title: { en: "Key learning points", bn: "মূল শিক্ষণীয় বিষয়" },
          coach: { en: "Let Jamil summarise the rules in his own words — this confirms learning against the SMART goal.", bn: "জামিলকে নিজের ভাষায় নিয়মগুলো সংক্ষেপে বলতে দিন — এতে SMART লক্ষ্য অনুযায়ী শেখা নিশ্চিত হয়।" },
          lines: [
            ["M", "What are the main things you'll remember when you meet oncoming traffic on a narrow road?"],
            ["J", "Look well ahead, adjust speed early, find safe gaps and decide who should wait. If the obstruction is on my side, be ready to hold back. Never force my way through."],
            ["M", "And when passing parked vehicles?"],
            ["J", "Leave about a metre where I can, watch for doors and pedestrians, and don't move out unless I know the space is safe."],
            ["M", "What will you do when a bend restricts your view?"],
            ["J", "Slow down before the bend and drive at a speed where I can stop in the distance I can see is clear. If I'm not sure, I'll hold back."]
          ]
        },
        {
          title: { en: "Next step", bn: "পরবর্তী ধাপ" },
          coach: { en: "Link to the next lesson so the learning continues.", bn: "পরের লেসনের সাথে সংযোগ করুন যাতে শেখা চলতে থাকে।" },
          lines: [
            ["M", "Exactly. Next time we could practise tighter bends and narrow roads with the same focus on early planning. Any questions?"],
            ["J", "No. I understand why I need to plan earlier now."],
            ["M", "Good work today, Jamil. You made progress because you reflected on that bend and changed your approach. We'll build on that next lesson."]
          ]
        }
      ]
    }
  ],

  /* ---------- Animation guide: characters + 12 scenes ---------- */
  characters: [
    { tag: "[INSTRUCTOR]", name: "Mohammed", en: "Male driving instructor in his 30s, short neat black hair and trimmed beard, warm brown skin, navy polo shirt with a small L-plate badge, calm encouraging expression. Sits in the front passenger seat with feet near the dual-control brake.", bn: "৩০-এর কোঠার পুরুষ ড্রাইভিং ইনস্ট্রাক্টর, ছোট পরিপাটি কালো চুল ও ছাঁটা দাড়ি, নেভি পোলো শার্ট, শান্ত ও উৎসাহী মুখভঙ্গি। সামনের যাত্রী আসনে, পা ডুয়াল ব্রেকের কাছে।" },
    { tag: "[JAMIL]", name: "Jamil", en: "Learner driver in his early 20s, short wavy dark hair, light grey hoodie, slightly nervous at first and growing in confidence. Hands at ten-to-two on the wheel.", bn: "২০-এর শুরুর দিকের শিক্ষার্থী চালক, ছোট ঢেউ খেলানো কালো চুল, হালকা ধূসর হুডি, শুরুতে একটু নার্ভাস, ধীরে ধীরে আত্মবিশ্বাসী।" },
    { tag: "[EXAMINER]", name: "DVSA examiner", en: "Neutral middle-aged examiner with glasses, plain dark jacket and lanyard, holding a clipboard with the standards check form. Sits in the rear seat, observing quietly.", bn: "চশমা পরা মধ্যবয়সী এক্সামিনার, সাধারণ গাঢ় জ্যাকেট ও ল্যানিয়ার্ড, হাতে ক্লিপবোর্ড। পেছনের আসনে চুপচাপ পর্যবেক্ষণ করেন।" },
    { tag: "[CAR]", name: "Tuition car", en: "Compact white five-door hatchback, right-hand drive, UK number plates, red L-plates front and rear, blue driving-school roof sign, dual controls visible in the passenger footwell.", bn: "ছোট সাদা পাঁচ-দরজার হ্যাচব্যাক, রাইট-হ্যান্ড ড্রাইভ, ইউকে নম্বর প্লেট, সামনে-পেছনে লাল L-প্লেট, ছাদে নীল ড্রাইভিং স্কুল সাইন, ডুয়াল কন্ট্রোল দৃশ্যমান।" }
  ],
  style: "Stylised 3D animated feature-film look (Pixar-style), soft global illumination, rounded friendly character design, realistic UK suburban streets of Ilford/Goodmayes, terraced houses, cars parked on both sides, 16:9, 24 fps, 8–12 second shot.",
  scenes: [
    { n: 1,  phase: "p1", title: { en: "Arrival at Kildowan Road Test Centre", bn: "কিলডোয়ান রোড টেস্ট সেন্টারে আগমন" }, chars: ["[CAR]", "[INSTRUCTOR]", "[JAMIL]", "[EXAMINER]"], camera: "Wide establishing shot, slow dolly-in from across the road", lighting: "Overcast morning, soft diffused light, damp pavement reflections", action: "[CAR] parks outside the test centre. [EXAMINER] with clipboard greets [INSTRUCTOR]; [JAMIL] waves from the driver's seat." },
    { n: 2,  phase: "p1", title: { en: "Recap of last lesson", bn: "গত লেসনের রিক্যাপ" }, chars: ["[INSTRUCTOR]", "[JAMIL]"], camera: "Interior two-shot from the dashboard, eye level", lighting: "Soft window light, warm tones on faces", action: "[INSTRUCTOR] turns towards [JAMIL] and asks about last lesson; [JAMIL] gestures as he explains junctions felt mostly fine." },
    { n: 3,  phase: "p1", title: { en: "Confidence scale & SMART goal", bn: "আত্মবিশ্বাস স্কেল ও SMART লক্ষ্য" }, chars: ["[INSTRUCTOR]", "[JAMIL]"], camera: "Over-the-shoulder on [JAMIL], cut to close-up of a 1–10 scale card", lighting: "Same soft interior light; scale card gently highlighted", action: "[JAMIL] points to 5 on a 1–10 card. Animated SMART letters appear and settle above the dashboard." },
    { n: 4,  phase: "p2", title: { en: "Whiteboard diagram briefing", bn: "হোয়াইটবোর্ড ডায়াগ্রাম ব্রিফিং" }, chars: ["[INSTRUCTOR]", "[JAMIL]"], camera: "Top-down insert of a mini whiteboard, then medium shot of both", lighting: "Bright, clean light on the board", action: "[INSTRUCTOR] draws a narrow road with parked cars on both sides, circles the gaps and draws a 1-metre arrow from a parked car door." },
    { n: 5,  phase: "p2", title: { en: "Risk agreement & dual controls", bn: "ঝুঁকি চুক্তি ও ডুয়াল কন্ট্রোল" }, chars: ["[INSTRUCTOR]", "[JAMIL]", "[CAR]"], camera: "Low angle in passenger footwell showing the dual brake, tilt up to faces", lighting: "Subtle rim light on the pedal; calm tone", action: "[INSTRUCTOR] explains prompt → instruction → dual brake; [JAMIL] nods. On-screen text: 23 m dry vs 46 m wet at 30 mph." },
    { n: 6,  phase: "p3", title: { en: "Level 1: Kildowan Road → Granton Road", bn: "লেভেল ১: কিলডোয়ান রোড → গ্র্যান্টন রোড" }, chars: ["[CAR]", "[INSTRUCTOR]", "[JAMIL]"], camera: "Chase cam behind [CAR], then windscreen POV down the street", lighting: "Grey daylight, wet road sheen", action: "[CAR] moves off. An oncoming car appears far ahead; [INSTRUCTOR] points ahead prompting [JAMIL] to scan." },
    { n: 7,  phase: "p3", title: { en: "Green Lane / Goodmayes Lane: waiting in the gap", bn: "গ্রিন লেন / গুডমেইজ লেন: গ্যাপে অপেক্ষা" }, chars: ["[CAR]", "[JAMIL]"], camera: "Drone shot looking down the narrow road, cars parked both sides", lighting: "Soft overcast, long subtle shadows", action: "[CAR] slows early and tucks into a gap on the left with a 1-metre clearance; oncoming car passes; [CAR] continues." },
    { n: 8,  phase: "p3", title: { en: "Trenance Gardens: blind bend fault", bn: "ট্রেনান্স গার্ডেন্স: ব্লাইন্ড বেন্ডে ভুল" }, chars: ["[CAR]", "[INSTRUCTOR]", "[JAMIL]"], camera: "Tense side tracking shot, cut to close-up of the dual brake being pressed", lighting: "Slightly cooler grade, view beyond the bend hidden by parked cars", action: "[CAR] approaches the bend too fast and drifts to the centre. [INSTRUCTOR] says 'Ease off now' and lightly presses the dual brake; an oncoming car appears and passes safely." },
    { n: 9,  phase: "p3", title: { en: "FCPS conversation at the kerb", bn: "কার্বে থেমে FCPS আলোচনা" }, chars: ["[INSTRUCTOR]", "[JAMIL]", "[EXAMINER]"], camera: "Static interior wide shot, [EXAMINER] visible in the rear writing notes", lighting: "Warm, reassuring tone returns", action: "Parked on the left. F, C, P, S labels animate in one by one as [JAMIL] answers each question." },
    { n: 10, phase: "p3", title: { en: "Level 2: shared decisions, Gyllyngdune Gardens → High Road", bn: "লেভেল ২: যৌথ সিদ্ধান্ত, গিলিংডিউন গার্ডেন্স → হাই রোড" }, chars: ["[CAR]", "[INSTRUCTOR]", "[JAMIL]"], camera: "Dashboard cam showing both faces, then exterior pull-back", lighting: "Brightening sky", action: "[JAMIL] talks through his plan before a bend; [INSTRUCTOR] gives a thumbs-up instead of instructions." },
    { n: 11, phase: "p3", title: { en: "Level 3: independent, Electric Parade → Kildowan Road", bn: "লেভেল ৩: স্বাধীন, ইলেকট্রিক প্যারেড → কিলডোয়ান রোড" }, chars: ["[CAR]", "[JAMIL]", "[INSTRUCTOR]"], camera: "Smooth Steadicam-style follow shot, intercut with [INSTRUCTOR] quietly observing", lighting: "Light drizzle, wet reflections, calm tone", action: "[JAMIL] rejects a gap near a junction, waits at a wider gap, checks mirrors and passes a pedestrian safely." },
    { n: 12, phase: "p4", title: { en: "Debrief: from 5 to 8 out of 10", bn: "ডিব্রিফ: ১০-এ ৫ থেকে ৮" }, chars: ["[INSTRUCTOR]", "[JAMIL]", "[EXAMINER]", "[CAR]"], camera: "Two-shot, then pull back out of the window to a wide shot of the test centre", lighting: "Sun breaks through the clouds, warm finish", action: "[JAMIL] moves the scale marker from 5 to 8 and smiles. [EXAMINER] closes the clipboard. [CAR] parked outside Kildowan Road Test Centre." }
  ],

  /* ---------- 17 DVSA competencies ---------- */
  competencies: [
    { n: 1,  area: "lp",  en: "Did the trainer identify the pupil's learning goals and needs?", bn: "ইনস্ট্রাক্টর কি শিক্ষার্থীর শেখার লক্ষ্য ও চাহিদা চিহ্নিত করেছেন?", evidence: { en: "Recap of last lesson; Jamil describes the difficulty in his own words; confidence 5/10.", bn: "গত লেসনের রিক্যাপ; জামিল নিজের ভাষায় সমস্যা বলে; আত্মবিশ্বাস ৫/১০।" } },
    { n: 2,  area: "lp",  en: "Was the agreed lesson structure appropriate for the pupil's experience and ability?", bn: "একমত হওয়া লেসন কাঠামো কি শিক্ষার্থীর অভিজ্ঞতা ও দক্ষতার উপযুক্ত ছিল?", evidence: { en: "Three levels of help agreed with Jamil: full prompting → shared → independent.", bn: "জামিলের সাথে তিন ধাপের সাহায্যে একমত: পূর্ণ প্রম্পটিং → যৌথ → স্বাধীন।" } },
    { n: 3,  area: "lp",  en: "Were the practice areas suitable?", bn: "অনুশীলনের এলাকাগুলো কি উপযুক্ত ছিল?", evidence: { en: "Narrow residential roads with parked cars (Granton Road, Goodmayes Lane, Trenance Gardens) before busier High Road.", bn: "ব্যস্ত হাই রোডের আগে পার্ক করা গাড়ি সহ সরু আবাসিক রাস্তা (গ্র্যান্টন রোড, গুডমেইজ লেন, ট্রেনান্স গার্ডেন্স)।" } },
    { n: 4,  area: "lp",  en: "Was the lesson plan adapted, when appropriate, to help the pupil work towards their learning goals?", bn: "প্রয়োজনে কি লেসন প্ল্যান পরিবর্তন করে শিক্ষার্থীকে লক্ষ্যের দিকে সাহায্য করা হয়েছে?", evidence: { en: "More guidance after the Trenance Gardens fault; less once confidence reached 7/10.", bn: "ট্রেনান্স গার্ডেন্সের ভুলের পরে বেশি সাহায্য; আত্মবিশ্বাস ৭/১০ হলে কম।" } },
    { n: 5,  area: "rm",  en: "Did the trainer ensure that the pupil fully understood how the responsibility for risk would be shared?", bn: "ইনস্ট্রাক্টর কি নিশ্চিত করেছেন যে শিক্ষার্থী ঝুঁকির দায়িত্ব ভাগাভাগি পুরোপুরি বুঝেছে?", evidence: { en: "Jamil explains in his own words how risk is shared; dual-control protocol agreed before moving off.", bn: "জামিল নিজের ভাষায় ঝুঁকি ভাগাভাগি ব্যাখ্যা করে; চলার আগে ডুয়াল কন্ট্রোল প্রোটোকলে একমত।" } },
    { n: 6,  area: "rm",  en: "Were directions and instructions given to the pupil clear and given in good time?", bn: "দিকনির্দেশনা ও নির্দেশ কি পরিষ্কার এবং সময়মতো দেওয়া হয়েছে?", evidence: { en: "Route directions given early on every road; 'Ease off now' given clearly at the bend.", bn: "প্রতিটি রাস্তায় আগেভাগে রুটের নির্দেশনা; বেন্ডে স্পষ্টভাবে 'এখন গতি কমাও'।" } },
    { n: 7,  area: "rm",  en: "Was the trainer aware of the surroundings and the pupil's actions?", bn: "ইনস্ট্রাক্টর কি চারপাশ ও শিক্ষার্থীর কাজ সম্পর্কে সচেতন ছিলেন?", evidence: { en: "Spots the speed and position error approaching the Trenance Gardens bend before it becomes dangerous.", bn: "ট্রেনান্স গার্ডেন্সের বেন্ডে বিপদ হওয়ার আগেই গতি ও পজিশনের ভুল ধরেন।" } },
    { n: 8,  area: "rm",  en: "Was any verbal or physical intervention by the trainer timely and appropriate?", bn: "ইনস্ট্রাক্টরের মৌখিক বা শারীরিক হস্তক্ষেপ কি সময়মতো ও যথাযথ ছিল?", evidence: { en: "Verbal instruction first, then light dual brake only because speed was too high for the view.", bn: "প্রথমে মৌখিক নির্দেশ, তারপর দৃষ্টিসীমার তুলনায় গতি বেশি থাকায় হালকা ডুয়াল ব্রেক।" } },
    { n: 9,  area: "rm",  en: "Was sufficient feedback given to help the pupil understand any potential safety critical incidents?", bn: "সম্ভাব্য নিরাপত্তা-ঝুঁকিপূর্ণ ঘটনা বুঝতে কি যথেষ্ট ফিডব্যাক দেওয়া হয়েছে?", evidence: { en: "Pulled up and ran FCPS; Jamil identifies the head-on collision risk himself.", bn: "থেমে FCPS করা হয়; জামিল নিজেই মুখোমুখি সংঘর্ষের ঝুঁকি চিহ্নিত করে।" } },
    { n: 10, area: "tls", en: "Was the teaching style suited to the pupil's learning style and current ability?", bn: "শিক্ষাদানের ধরন কি শিক্ষার্থীর শেখার ধরন ও বর্তমান দক্ষতার উপযুক্ত ছিল?", evidence: { en: "Visual diagram briefing plus question-and-answer coaching that fits Jamil's preference for prompts, then independence.", bn: "ভিজ্যুয়াল ডায়াগ্রাম ব্রিফিং ও প্রশ্নোত্তর কোচিং — জামিলের পছন্দ অনুযায়ী প্রথমে প্রম্পট, পরে স্বাধীনতা।" } },
    { n: 11, area: "tls", en: "Was the pupil encouraged to analyse problems and take responsibility for their learning?", bn: "শিক্ষার্থীকে কি সমস্যা বিশ্লেষণ ও নিজের শেখার দায়িত্ব নিতে উৎসাহিত করা হয়েছে?", evidence: { en: "Jamil works out the fault, cause, risk and solution himself; talks through his plans in Level 2.", bn: "জামিল নিজেই ভুল, কারণ, ঝুঁকি ও সমাধান বের করে; লেভেল ২-এ নিজের পরিকল্পনা বলে।" } },
    { n: 12, area: "tls", en: "Were opportunities and examples used to clarify learning outcomes?", bn: "শেখার ফলাফল স্পষ্ট করতে কি সুযোগ ও উদাহরণ ব্যবহার করা হয়েছে?", evidence: { en: "Real gaps, vans and reflections on the route used as live examples; the bend is reattempted.", bn: "রুটের আসল গ্যাপ, ভ্যান ও প্রতিফলন জীবন্ত উদাহরণ হিসেবে ব্যবহৃত; বেন্ড আবার চেষ্টা করা হয়।" } },
    { n: 13, area: "tls", en: "Was the technical information given comprehensive, accurate and appropriate?", bn: "দেওয়া টেকনিক্যাল তথ্য কি পূর্ণাঙ্গ, সঠিক ও উপযুক্ত ছিল?", evidence: { en: "Priority rules, ~1 m clearance, 23 m dry / at least double in the wet at 30 mph, stopping within the distance you can see to be clear.", bn: "অগ্রাধিকারের নিয়ম, ~১ মিটার ক্লিয়ারেন্স, ৩০ মাইলে শুকনোয় ২৩ মি / ভেজায় কমপক্ষে দ্বিগুণ, দেখা যাওয়া দূরত্বের মধ্যে থামা।" } },
    { n: 14, area: "tls", en: "Was the pupil given appropriate and timely feedback during the session?", bn: "সেশনের মধ্যে শিক্ষার্থীকে কি যথাযথ ও সময়মতো ফিডব্যাক দেওয়া হয়েছে?", evidence: { en: "Specific praise after each good gap choice ('Well judged'); feedback immediately after the bend.", bn: "প্রতিটি ভালো গ্যাপ বাছাইয়ের পরে নির্দিষ্ট প্রশংসা ('Well judged'); বেন্ডের পরপরই ফিডব্যাক।" } },
    { n: 15, area: "tls", en: "Were the pupil's queries followed up and answered?", bn: "শিক্ষার্থীর প্রশ্নগুলোর কি উত্তর ও ফলো-আপ দেওয়া হয়েছে?", evidence: { en: "Invites questions after the briefing and in the debrief; answers any query fully.", bn: "ব্রিফিং ও ডিব্রিফের পরে প্রশ্ন করতে আমন্ত্রণ; যেকোনো প্রশ্নের পূর্ণ উত্তর।" } },
    { n: 16, area: "tls", en: "Did the trainer maintain an appropriate non-discriminatory manner throughout the session?", bn: "পুরো সেশনে কি ইনস্ট্রাক্টর যথাযথ ও বৈষম্যহীন আচরণ বজায় রেখেছেন?", evidence: { en: "Calm, respectful, encouraging tone, including straight after the intervention.", bn: "শান্ত, সম্মানজনক ও উৎসাহব্যঞ্জক স্বর — হস্তক্ষেপের ঠিক পরেও।" } },
    { n: 17, area: "tls", en: "At the end of the session — was the pupil encouraged to reflect on their own performance?", bn: "সেশনের শেষে — শিক্ষার্থীকে কি নিজের পারফরম্যান্স নিয়ে ভাবতে উৎসাহিত করা হয়েছে?", evidence: { en: "Jamil reflects first, re-rates himself 8/10 and names his next step (blind bends).", bn: "জামিল প্রথমে নিজে মূল্যায়ন করে, নিজেকে ৮/১০ দেয় এবং পরবর্তী ধাপ (ব্লাইন্ড বেন্ড) বলে।" } }
  ],
  scoreLabels: [
    { v: 0, en: "No evidence", bn: "কোনো প্রমাণ নেই" },
    { v: 1, en: "Demonstrated in a few elements", bn: "কিছু ক্ষেত্রে দেখানো হয়েছে" },
    { v: 2, en: "Demonstrated in most elements", bn: "বেশিরভাগ ক্ষেত্রে দেখানো হয়েছে" },
    { v: 3, en: "Demonstrated in all elements", bn: "সব ক্ষেত্রে দেখানো হয়েছে" }
  ]
};
