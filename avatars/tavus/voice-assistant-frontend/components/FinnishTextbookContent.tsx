"use client";

import { useCallback, useMemo, useState } from "react";

type LevelKey = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type Drill = {
  id: string;
  question: string;
  answer: string;
  hint?: string;
  sample?: string;
};

type LessonModule = {
  id: string;
  title: string;
  duration: string;
  outcomes: string[];
  resources: string[];
};

type ListeningResource = {
  id: string;
  title: string;
  type: "song" | "podcast" | "video";
  description: string;
  artist?: string;
  difficulty: string;
};

type CultureMoment = {
  id: string;
  title: string;
  description: string;
  activity: string;
};

type Assignment = {
  id: string;
  title: string;
  description: string;
  deliverable: string;
};

type LevelSummary = {
  label: string;
  tagline: string;
  message: string;
  focusAreas: string[];
  modules: LessonModule[];
  vocabulary: Array<{ finnish: string; english: string }>;
  phrases: Array<{ finnish: string; english: string }>;
  grammar: Array<{ title: string; bullets: string[] }>;
  listening: ListeningResource[];
  culture: CultureMoment[];
  assignments: Assignment[];
  drills: Drill[];
};

const LEVELS: Record<LevelKey, LevelSummary> = {
  A1: {
    label: "A1",
    tagline: "Survival basics",
    message: "Learn greetings, numbers, and daily routines. Build confidence with short dialogues.",
    focusAreas: [
      "Greetings & introductions",
      "Numbers, dates, and prices",
      "Simple questions: kuka, missä, mikä",
      "Essential service phrases (kauppa, apteekki, bussi)",
    ],
    modules: [
      {
        id: "a1-mod-1",
        title: "Meet & Greet",
        duration: "35 min",
        outcomes: ["Introduce yourself", "Ask someone's name", "Spell basic words"],
        resources: ["Alphabet deck", "Pronunciation audio warm-up"],
      },
      {
        id: "a1-mod-2",
        title: "Café Confidence",
        duration: "40 min",
        outcomes: ["Order food & drinks", "Use polite forms", "Handle payments"],
        resources: ["Menu role-play cards", "Tap-to-pay dialogue"],
      },
      {
        id: "a1-mod-3",
        title: "City Essentials",
        duration: "45 min",
        outcomes: ["Ask for directions", "Understand signage", "Use transport vocabulary"],
        resources: ["Map flashcards", "Kajaanin paikallisliikenne video"],
      },
    ],
    vocabulary: [
      { finnish: "Hei / Moi", english: "Hello / Hi" },
      { finnish: "Hyvää huomenta", english: "Good morning" },
      { finnish: "Hauska tutustua", english: "Nice to meet you" },
      { finnish: "Minä olen…", english: "I am…" },
      { finnish: "Mistä olet kotoisin?", english: "Where are you from?" },
      { finnish: "Haluan kahvin", english: "I would like a coffee" },
      { finnish: "Paljonko tämä maksaa?", english: "How much does this cost?" },
      { finnish: "Anteeksi", english: "Excuse me / sorry" },
      { finnish: "Voitko toistaa?", english: "Could you repeat?" },
      { finnish: "En ymmärrä", english: "I don't understand" },
    ],
    phrases: [
      { finnish: "Hei! Minä olen Alex Kajaanista.", english: "Hi! I am Alex from Kajaani." },
      { finnish: "Mitä sinulle kuuluu?", english: "How are you?" },
      { finnish: "Milloin bussi lähtee?", english: "When does the bus leave?" },
      { finnish: "Tässä on osoitteeni.", english: "Here is my address." },
      { finnish: "Tarvitsen apua lomakkeen kanssa.", english: "I need help with the form." },
    ],
    grammar: [
      {
        title: "Verb 'olla' (to be)",
        bullets: ["minä olen", "sinä olet", "hän on", "me olemme", "te olette", "he ovat"],
      },
      {
        title: "Yes / no questions",
        bullets: ["Oletko sinä Suomesta?", "Onko tämä bussipysäkki?"],
      },
      {
        title: "Possession",
        bullets: ["Minulla on lippu.", "Sinulla on avain.", "Hänellä on polkupyörä."],
      },
    ],
    listening: [
      {
        id: "a1-audio-1",
        title: "Hei Hei Kajaani",
        type: "song",
        description: "A cheerful greeting song introducing basic phrases.",
        artist: "Knuut Kids Ensemble",
        difficulty: "Very easy",
      },
      {
        id: "a1-audio-2",
        title: "Torilla tavataan",
        type: "podcast",
        description: "Short dialogues at the Kajaani market square with slow narration.",
        difficulty: "Easy",
      },
      {
        id: "a1-audio-3",
        title: "Supermarket Signs",
        type: "video",
        description: "Mini video explaining grocery words with visuals and captions.",
        difficulty: "Easy",
      },
    ],
    culture: [
      {
        id: "a1-culture-1",
        title: "Kahvihetki etiquette",
        description: "Understand how Finns share coffee breaks and polite small talk cues.",
        activity: "Watch the coffee break clip and note three polite phrases.",
      },
      {
        id: "a1-culture-2",
        title: "Finnish music warm-up",
        description: "Learn the chorus of the classic song 'Kultainen nuoruus'.",
        activity: "Sing along using the provided lyrics video and highlight unknown words.",
      },
    ],
    assignments: [
      {
        id: "a1-assignment-1",
        title: "Introduce yourself video",
        description: "Record a 45-second intro presenting your name, origin, and one hobby.",
        deliverable: "Upload MP4 or share link for mentor feedback.",
      },
      {
        id: "a1-assignment-2",
        title: "Café role-play",
        description: "Write a short dialogue ordering coffee and a pulla, include prices and polite endings.",
        deliverable: "Submit script + audio reading.",
      },
    ],
    drills: [
      {
        id: "a1-drill-1",
        question: "Translate to Finnish: 'Nice to meet you'.",
        answer: "Hauska tutustua",
        hint: "Use the phrase you say when you meet someone for the first time.",
      },
      {
        id: "a1-drill-2",
        question: "Fill in: '___ olet?' (Who are you?)",
        answer: "Kuka",
        hint: "Question word for 'who'.",
      },
      {
        id: "a1-drill-3",
        question: "How do you say 'I don't understand'?",
        answer: "En ymmärrä",
      },
    ],
  },
  A2: {
    label: "A2",
    tagline: "Daily routines",
    message: "Talk about schedules, shopping, and appointments. Practice longer questions and answers.",
    focusAreas: [
      "Explaining routines and schedules",
      "Booking appointments (ajanvaraus)",
      "Describing people, homes, and hobbies",
      "Using past tense for simple stories",
    ],
    modules: [
      {
        id: "a2-mod-1",
        title: "Week in Motion",
        duration: "45 min",
        outcomes: ["Describe routines", "Use time expressions", "Explain travel plans"],
        resources: ["Interactive planner", "Audio schedule prompts"],
      },
      {
        id: "a2-mod-2",
        title: "Appointments & Bookings",
        duration: "40 min",
        outcomes: ["Book doctor visits", "Change a reservation", "Confirm instructions"],
        resources: ["Dialogue cards", "Pharmacy listening drill"],
      },
      {
        id: "a2-mod-3",
        title: "Storytelling starter",
        duration: "50 min",
        outcomes: ["Use past tense", "Describe events", "Share weekend highlights"],
        resources: ["Timeline templates", "Selkokieli news clip"],
      },
    ],
    vocabulary: [
      { finnish: "Herään kello seitsemän", english: "I wake up at seven" },
      { finnish: "Menen töihin bussilla", english: "I go to work by bus" },
      { finnish: "Tarvitsen ajan lääkäriin", english: "I need a doctor appointment" },
      { finnish: "Mihin aikaan…?", english: "At what time…?" },
      { finnish: "Voinko maksaa kortilla?", english: "Can I pay by card?" },
      { finnish: "Ostan maitoa ja vihanneksia", english: "I buy milk and vegetables" },
      { finnish: "Pidän liikunnasta", english: "I like exercise" },
      { finnish: "Sää oli eilen aurinkoinen", english: "The weather was sunny yesterday" },
      { finnish: "Voimmeko tavata ensi viikolla?", english: "Can we meet next week?" },
    ],
    phrases: [
      { finnish: "Mitä sinä teet viikonloppuna?", english: "What are you doing this weekend?" },
      { finnish: "Voisinko siirtää tapaamista?", english: "Could I move the appointment?" },
      { finnish: "Asun kolmannessa kerroksessa.", english: "I live on the third floor." },
      { finnish: "Voisitko suositella jotain?", english: "Could you recommend something?" },
      { finnish: "Eilen kävin uimassa.", english: "Yesterday I went swimming." },
    ],
    grammar: [
      {
        title: "Past tense (imperfekti)",
        bullets: ["menin", "ostin", "olin", "teimme", "tapasimme"],
      },
      {
        title: "Partitive in requests",
        bullets: ["haluan kahvia", "etsi työpaikkaa", "tarvitsen apua"],
      },
      {
        title: "Time expressions",
        bullets: ["viime viikonloppuna", "ensi maanantaina", "kahden viikon päästä", "kolmen päivän ajan"],
      },
    ],
    listening: [
      {
        id: "a2-audio-1",
        title: "Aamu Kajaanissa",
        type: "podcast",
        description: "A Finn describes their typical morning routine with transcripts.",
        difficulty: "Easy",
      },
      {
        id: "a2-audio-2",
        title: "Kela soittaa",
        type: "audio",
        description: "Simulated phone call about changing an appointment.",
        difficulty: "Medium",
      },
      {
        id: "a2-audio-3",
        title: "Pop playlist: Arjen rytmi",
        type: "song",
        description: "Handpicked Finnish pop tracks with lyric annotations for daily actions.",
        artist: "Knuut AI Spotify Mix",
        difficulty: "Easy",
      },
    ],
    culture: [
      {
        id: "a2-culture-1",
        title: "Pharmacy etiquette",
        description: "Learn how to queue, request medicine, and thank the staff politely.",
        activity: "Watch the role-play and list three polite requests.",
      },
      {
        id: "a2-culture-2",
        title: "Finnish TV evening",
        description: "Preview subtitles from a YLE series to get used to spoken slang.",
        activity: "Match ten expressions from the clip with their English meaning.",
      },
    ],
    assignments: [
      {
        id: "a2-assignment-1",
        title: "Weekly planner",
        description: "Write a paragraph describing your week using six time expressions.",
        deliverable: "Submit text + audio reading for pronunciation notes.",
      },
      {
        id: "a2-assignment-2",
        title: "Appointment reschedule",
        description: "Create a short email or message moving a booked appointment, include reason and new time.",
        deliverable: "Upload email draft (Finnish) as PDF.",
      },
    ],
    drills: [
      {
        id: "a2-drill-1",
        question: "Translate: 'I would like to book an appointment'.",
        answer: "Haluaisin varata ajan",
      },
      {
        id: "a2-drill-2",
        question: "Fill in: 'Me ____ (eat) illalla pizzaa.'",
        answer: "syömme",
        hint: "Conjugate syödä in present tense for 'we'.",
      },
      {
        id: "a2-drill-3",
        question: "What does 'Ensi viikolla' mean?",
        answer: "Next week",
      },
    ],
  },
  B1: {
    label: "B1",
    tagline: "Working life",
    message: "Handle job interviews, school meetings, and Finnish paperwork with more complex sentences.",
    focusAreas: [
      "Explaining professional experience",
      "Describing strengths and weaknesses",
      "Formal vs informal language",
      "Storytelling in past tense",
    ],
    modules: [
      {
        id: "b1-mod-1",
        title: "Interview Lab",
        duration: "55 min",
        outcomes: ["Present work history", "Discuss strengths", "Ask follow-up questions"],
        resources: ["Interview question deck", "Model answers audio"],
      },
      {
        id: "b1-mod-2",
        title: "School & Community",
        duration: "45 min",
        outcomes: ["Talk about school meetings", "Understand school reports", "Coordinate events"],
        resources: ["Parents evening transcript", "Event planning worksheet"],
      },
      {
        id: "b1-mod-3",
        title: "Story Arc",
        duration: "50 min",
        outcomes: ["Narrate past events", "Use connectors", "Explain outcomes"],
        resources: ["Narrative timeline builder", "Audio example: volunteer story"],
      },
    ],
    vocabulary: [
      { finnish: "Työkokemus", english: "Work experience" },
      { finnish: "Vahvuuteni", english: "My strengths" },
      { finnish: "osallistun vanhempainiltaan", english: "I attend the parent evening" },
      { finnish: "Pystyn työskentelemään paineessa", english: "I can work under pressure" },
      { finnish: "Jatkokoulutus", english: "Further training" },
      { finnish: "Yhteistyökyky", english: "Cooperation skills" },
      { finnish: "Työhaastattelu", english: "Job interview" },
      { finnish: "Suosittelija", english: "Referee" },
    ],
    phrases: [
      { finnish: "Voitko kertoa lisää tehtävästä?", english: "Could you tell me more about the role?" },
      { finnish: "Sovitaanko uusi tapaaminen ensi viikolle?", english: "Shall we schedule a new meeting for next week?" },
      { finnish: "Pidän tärkeänä selkeää viestintää.", english: "I consider clear communication important." },
      { finnish: "Haluan kehittyä esimiehenä.", english: "I want to develop as a supervisor." },
    ],
    grammar: [
      {
        title: "Conditional mood",
        bullets: ["voisin", "haluaisin", "jos saan", "jos oppisin"],
      },
      {
        title: "Relative clauses",
        bullets: ["Työkokemus, jota hain", "Asiakas, jonka tapasin", "Yritys, jossa työskentelen"],
      },
      {
        title: "Passive voice",
        bullets: ["tässä yrityksessä arvostetaan", "palautetta kerätään", "päätös tehdään"],
      },
    ],
    listening: [
      {
        id: "b1-audio-1",
        title: "Työhaastattelun kulku",
        type: "podcast",
        description: "Recruiter explains common Finnish interview steps.",
        difficulty: "Medium",
      },
      {
        id: "b1-audio-2",
        title: "Kajaani Career Night",
        type: "video",
        description: "Panel discussion with subtitles focusing on networking phrases.",
        difficulty: "Medium",
      },
      {
        id: "b1-audio-3",
        title: "Suomi Soul Playlist",
        type: "song",
        description: "Playlist of modern Finnish soul music with lyric flashcards.",
        artist: "Curated by Knuut AI",
        difficulty: "Medium",
      },
    ],
    culture: [
      {
        id: "b1-culture-1",
        title: "Work fika vs kahvitauko",
        description: "Compare Swedish 'fika' and Finnish 'kahvitauko' cultures and discussion norms.",
        activity: "Fill the venn diagram with three similarities and differences.",
      },
      {
        id: "b1-culture-2",
        title: "Kainuu community events",
        description: "Preview local city events and practise small talk topics.",
        activity: "Match events with appropriate conversation starters.",
      },
    ],
    assignments: [
      {
        id: "b1-assignment-1",
        title: "Interview pitch",
        description: "Write and record a two-minute pitch for a job you want in Kajaani.",
        deliverable: "Submit script + video for mentor review.",
      },
      {
        id: "b1-assignment-2",
        title: "Meeting minutes",
        description: "Summarise a real or simulated meeting in 120 words, highlight action points.",
        deliverable: "Upload summary doc.",
      },
    ],
    drills: [
      {
        id: "b1-drill-1",
        question: "Translate: 'I am responsible for customer service'.",
        answer: "Vastaan asiakaspalvelusta",
      },
      {
        id: "b1-drill-2",
        question: "Which conditional form fits? 'Jos ______ (voida) auttaa, olisin kiitollinen.'",
        answer: "voisitte",
        hint: "Formal 'you'.",
      },
      {
        id: "b1-drill-3",
        question: "What does 'yhteistyökykyinen' mean?",
        answer: "Cooperative",
      },
    ],
  },
  B2: {
    label: "B2",
    tagline: "Fluent everyday expert",
    message: "Discuss complex topics such as politics, wellbeing, and community impact.",
    focusAreas: [
      "Presenting arguments and counterarguments",
      "Nuanced opinions and qualifiers",
      "Societal vocabulary",
      "Networking and professional events",
    ],
    modules: [
      {
        id: "b2-mod-1",
        title: "Argument Toolkit",
        duration: "55 min",
        outcomes: ["Present opinions", "Use advanced connectors", "Rebut counterarguments"],
        resources: ["Debate card set", "Opinion essay model"],
      },
      {
        id: "b2-mod-2",
        title: "Impact Finnish",
        duration: "50 min",
        outcomes: ["Discuss community initiatives", "Use civic vocabulary", "Propose solutions"],
        resources: ["Integration workshop clip", "Impact vocabulary deck"],
      },
      {
        id: "b2-mod-3",
        title: "Networking Mastery",
        duration: "45 min",
        outcomes: ["Facilitate introductions", "Follow up professionally", "Use nuance"],
        resources: ["LinkedIn message templates", "Networking audio simulation"],
      },
    ],
    vocabulary: [
      { finnish: "Kestävä kehitys", english: "Sustainable development" },
      { finnish: "Hyvinvointi", english: "Wellbeing" },
      { finnish: "Yhteisöllisyys", english: "Community spirit" },
      { finnish: "Työhyvinvointi", english: "Work wellbeing" },
      { finnish: "Vaikuttavuus", english: "Impact" },
      { finnish: "Sidosryhmä", english: "Stakeholder" },
      { finnish: "Osallistava", english: "Inclusive" },
      { finnish: "Jatkuva oppiminen", english: "Continuous learning" },
    ],
    phrases: [
      { finnish: "Uskon, että ratkaisu löytyy yhteistyöllä.", english: "I believe the solution is found through cooperation." },
      { finnish: "Voisimmeko tarkastella vaihtoehtoja yksityiskohtaisemmin?", english: "Could we examine the alternatives in more detail?" },
      { finnish: "Haluaisin nostaa esiin yhden huolen.", english: "I would like to raise one concern." },
    ],
    grammar: [
      {
        title: "Reported speech",
        bullets: ["Hän sanoi, että projekti valmistuu.", "Johtaja kertoi, että budjetti kasvaa."],
      },
      {
        title: "Participles",
        bullets: ["saadut tulokset", "tehty päätös", "laadittu suunnitelma"],
      },
      {
        title: "Advanced connectors",
        bullets: ["yhtäältä... toisaalta", "huolimatta siitä, että", "siitä huolimatta"],
      },
    ],
    listening: [
      {
        id: "b2-audio-1",
        title: "Taloustunti",
        type: "podcast",
        description: "Economics talk show discussing Finnish labour market trends.",
        difficulty: "Challenging",
      },
      {
        id: "b2-audio-2",
        title: "Kaupunki ja tulevaisuus",
        type: "video",
        description: "Panel on smart city development with dense technical vocabulary.",
        difficulty: "Challenging",
      },
      {
        id: "b2-audio-3",
        title: "FinnJazz Focus",
        type: "song",
        description: "Jazz playlist featuring Finnish artists to improve listening to natural rhythm.",
        artist: "FinnJazz Collective",
        difficulty: "Challenging",
      },
    ],
    culture: [
      {
        id: "b2-culture-1",
        title: "Boardroom etiquette",
        description: "Understand unspoken norms of Finnish professional meetings.",
        activity: "Watch briefing, then list three dos and don'ts.",
      },
      {
        id: "b2-culture-2",
        title: "Community grant pitch",
        description: "Learn how NGOs pitch to Finnish municipalities, practise persuasive language.",
        activity: "Draft a 90-second pitch outline.",
      },
    ],
    assignments: [
      {
        id: "b2-assignment-1",
        title: "Opinion column",
        description: "Write 180 words about a local issue, include two opposing viewpoints and recommendation.",
        deliverable: "Submit article draft + audio commentary.",
      },
      {
        id: "b2-assignment-2",
        title: "Networking follow-up",
        description: "Create a follow-up email summarising a professional meeting, use advanced connectors.",
        deliverable: "Upload email in Finnish.",
      },
    ],
    drills: [
      {
        id: "b2-drill-1",
        question: "Translate: 'Despite the challenge, we succeeded'.",
        answer: "Haasteesta huolimatta onnistuimme",
      },
      {
        id: "b2-drill-2",
        question: "Fill in: 'Työ on ______ (inclusive) ja osallistavaa.'",
        answer: "osallistavaa",
      },
      {
        id: "b2-drill-3",
        question: "What is 'sidosryhmä' in English?",
        answer: "Stakeholder",
      },
    ],
  },
  C1: {
    label: "C1",
    tagline: "Professional nuance",
    message: "Operate confidently in academic, professional, and community leadership contexts.",
    focusAreas: [
      "Abstract topics and persuasion",
      "Complex idioms",
      "Academic and corporate Finnish",
      "Facilitating workshops and negotiations",
    ],
    modules: [
      {
        id: "c1-mod-1",
        title: "Thought Leadership",
        duration: "60 min",
        outcomes: ["Chair discussions", "Use persuasive nuance", "Respond diplomatically"],
        resources: ["Leadership speech samples", "Facilitation checklist"],
      },
      {
        id: "c1-mod-2",
        title: "Academic Edge",
        duration: "55 min",
        outcomes: ["Analyse research", "Summarise complex texts", "Present findings"],
        resources: ["Academic article toolkit", "Note-taking templates"],
      },
      {
        id: "c1-mod-3",
        title: "Negotiation Finnish",
        duration: "60 min",
        outcomes: ["Negotiate terms", "Clarify conditions", "Document agreements"],
        resources: ["Contract language deck", "Negotiation role-play audio"],
      },
    ],
    vocabulary: [
      { finnish: "Kokonaisvaltainen", english: "Holistic" },
      { finnish: "Läpileikkaava kysymys", english: "Cross-cutting issue" },
      { finnish: "Merkityksellisyys", english: "Meaningfulness" },
      { finnish: "Strateginen kumppanuus", english: "Strategic partnership" },
      { finnish: "Osallistava johtaminen", english: "Inclusive leadership" },
      { finnish: "Kriittinen tarkastelu", english: "Critical review" },
      { finnish: "Vaikuttavuuden arviointi", english: "Impact assessment" },
    ],
    phrases: [
      { finnish: "Haluan korostaa muutamaa seikkaa...", english: "I would like to emphasize a few points..." },
      { finnish: "Voisimmeko tarkastella tätä ilmiötä laajemmin?", english: "Could we examine this phenomenon more broadly?" },
      { finnish: "Toimimme tiiviissä yhteistyössä sidosryhmien kanssa.", english: "We work closely with stakeholders." },
    ],
    grammar: [
      {
        title: "Advanced connectors",
        bullets: ["yhtäältä... toisaalta", "olettaen että", "mikäli mahdollista"],
      },
      {
        title: "Nominalisations",
        bullets: ["kehittäminen", "toteutuminen", "merkityksellisyys", "osallistuminen"],
      },
    ],
    listening: [
      {
        id: "c1-audio-1",
        title: "Yliopistostudio",
        type: "podcast",
        description: "Academic roundtable discussing social policy research.",
        difficulty: "Advanced",
      },
      {
        id: "c1-audio-2",
        title: "Johtajuus live",
        type: "video",
        description: "Livestream of a leadership summit with rapid-fire interviews.",
        difficulty: "Advanced",
      },
      {
        id: "c1-audio-3",
        title: "Finno-Beat Playlist",
        type: "song",
        description: "Blend of contemporary Finnish electro and indie with complex lyrics.",
        artist: "Knuut AI Sound Lab",
        difficulty: "Advanced",
      },
    ],
    culture: [
      {
        id: "c1-culture-1",
        title: "Finland in EU",
        description: "Explore Finland's role in EU negotiations and related terminology.",
        activity: "Analyse a news clip and list five negotiation phrases.",
      },
      {
        id: "c1-culture-2",
        title: "Academic networking",
        description: "Understand how Finnish academics collaborate and share results.",
        activity: "Plan a 3-minute research elevator pitch.",
      },
    ],
    assignments: [
      {
        id: "c1-assignment-1",
        title: "Executive summary",
        description: "Summarise a Finnish article in 200 words, highlighting key recommendations and next steps.",
        deliverable: "Submit PDF + voice-over summary.",
      },
      {
        id: "c1-assignment-2",
        title: "Facilitation script",
        description: "Design opening remarks for a community workshop using inclusive language and advanced vocabulary.",
        deliverable: "Upload agenda + script.",
      },
    ],
    drills: [
      {
        id: "c1-drill-1",
        question: "Translate: 'It requires a holistic approach'.",
        answer: "Se vaatii kokonaisvaltaista lähestymistapaa",
      },
      {
        id: "c1-drill-2",
        question: "What is 'vaikuttavuuden arviointi' in English?",
        answer: "Impact assessment",
      },
      {
        id: "c1-drill-3",
        question: "Fill in: 'Toimintaa tarkastellaan ______ (assuming that) resurssit riittävät.'",
        answer: "olettaen että",
      },
    ],
  },
  C2: {
    label: "C2",
    tagline: "Mastery & leadership",
    message: "Operate at native-level nuance across professional, academic, and cultural contexts while mentoring others.",
    focusAreas: [
      "Strategic persuasion & influence",
      "Specialised terminology across sectors",
      "High-context cultural cues",
      "Mentoring and coaching in Finnish",
    ],
    modules: [
      {
        id: "c2-mod-1",
        title: "Strategic Finnish",
        duration: "70 min",
        outcomes: ["Craft persuasive narratives", "Lead multi-party negotiations", "Frame impact stories"],
        resources: ["Case study bank", "Advanced rhetoric audio"],
      },
      {
        id: "c2-mod-2",
        title: "Media Masterclass",
        duration: "60 min",
        outcomes: ["Handle interviews", "Moderate panels", "Adapt language to audience"],
        resources: ["Press conference toolkit", "Media appearance checklists"],
      },
      {
        id: "c2-mod-3",
        title: "Mentor Playbook",
        duration: "55 min",
        outcomes: ["Coach newcomers", "Deliver feedback", "Design learning experiences"],
        resources: ["Mentor feedback templates", "Buddy support guides"],
      },
    ],
    vocabulary: [
      { finnish: "Yhteiskuntavastuu", english: "Corporate social responsibility" },
      { finnish: "Ratkaisukeskeinen", english: "Solution-oriented" },
      { finnish: "Luottamuksellisuus", english: "Confidentiality" },
      { finnish: "Sidosryhmädialogi", english: "Stakeholder dialogue" },
      { finnish: "Vaikuttavuusmittari", english: "Impact metric" },
      { finnish: "Skaalautuva", english: "Scalable" },
    ],
    phrases: [
      { finnish: "Haluan varmistaa, että kaikki näkökulmat tulevat esiin.", english: "I want to ensure every perspective is voiced." },
      { finnish: "Voimmeko syventyä tähän teemaan fasilitoidussa työpajassa?", english: "Could we delve deeper into this theme in a facilitated workshop?" },
      { finnish: "Arvioidaan vaikutuksia yhdessä kumppaneiden kanssa.", english: "Let’s assess the impacts together with partners." },
    ],
    grammar: [
      {
        title: "Nuanced modality",
        bullets: ["saattaisi olla", "näyttäisi siltä", "voinee todeta"],
      },
      {
        title: "High-level idioms",
        bullets: ["tarttua härkää sarvista", "mennä syvään päähän", "olla ajan hermolla"],
      },
    ],
    listening: [
      {
        id: "c2-audio-1",
        title: "Finlandia Forum",
        type: "podcast",
        description: "Weekly political analysis with fast-paced debate segments.",
        difficulty: "Expert",
      },
      {
        id: "c2-audio-2",
        title: "Symposium LIVE",
        type: "video",
        description: "Live-streamed academic symposium capturing spontaneous Q&A exchanges.",
        difficulty: "Expert",
      },
      {
        id: "c2-audio-3",
        title: "Nordic Soundscape",
        type: "song",
        description: "Modern orchestral and electronic fusion pieces to train comprehension at speed.",
        artist: "Knuut AI Sound Lab",
        difficulty: "Expert",
      },
    ],
    culture: [
      {
        id: "c2-culture-1",
        title: "Leading in Finnish",
        description: "Explore leadership expectations in Finnish organisations and how directness is balanced with empathy.",
        activity: "Analyse leadership case study and craft a response scenario.",
      },
      {
        id: "c2-culture-2",
        title: "Mentor circle facilitation",
        description: "Design and run multicultural peer circles with Finnish facilitation techniques.",
        activity: "Outline a 60-minute mentor session agenda.",
      },
    ],
    assignments: [
      {
        id: "c2-assignment-1",
        title: "Policy pitch deck",
        description: "Create a Finnish-language pitch deck advocating for a community innovation project.",
        deliverable: "Upload deck + voice-over narration.",
      },
      {
        id: "c2-assignment-2",
        title: "Mentor reflection blog",
        description: "Write a reflective blog post about guiding a mentee through Finnish integration milestones.",
        deliverable: "Submit blog draft + summary audio.",
      },
    ],
    drills: [
      {
        id: "c2-drill-1",
        question: "Translate: 'Stakeholder dialogue must remain transparent.'",
        answer: "Sidosryhmädialogin täytyy pysyä avoimena",
      },
      {
        id: "c2-drill-2",
        question: "What does 'olla ajan hermolla' mean?",
        answer: "To keep up with the times",
      },
      {
        id: "c2-drill-3",
        question: "Fill in: 'Ratkaisumme ______ (seems to be) skaalautuva.'",
        answer: "näyttäisi olevan",
      },
    ],
  },
};

const VIEWS = [
  { id: "overview", label: "Overview" },
  { id: "vocabulary", label: "Vocabulary" },
  { id: "phrases", label: "Useful phrases" },
  { id: "grammar", label: "Grammar focus" },
  { id: "practice", label: "Practice ideas" },
  { id: "drills", label: "Quick drills" },
] as const;

type ViewId = (typeof VIEWS)[number]["id"];

export default function FinnishTextbookContent() {
  const [level, setLevel] = useState<LevelKey>("A1");
  const [view, setView] = useState<ViewId>("overview");
  const [drillState, setDrillState] = useState<Record<string, { value: string; status: "idle" | "correct" | "incorrect" }>>({});

  const summary = LEVELS[level];

  const checkDrillAnswer = useCallback(
    (drillId: string) => {
      const drill = summary.drills.find((d) => d.id === drillId);
      if (!drill) return;

      const userAnswer = (drillState[drillId]?.value ?? "").trim();
      const isCorrect = userAnswer.toLowerCase() === drill.answer.toLowerCase();

      setDrillState((prev) => ({
        ...prev,
        [drillId]: { value: userAnswer, status: isCorrect ? "correct" : "incorrect" },
      }));
    },
    [summary, drillState],
  );

  const viewContent = useMemo(() => {
    switch (view) {
      case "vocabulary":
        return (
          <div style={{ display: "grid", gap: 12 }}>
            {summary.vocabulary.map((item) => (
              <div
                key={`${summary.label}-voc-${item.finnish}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(148,163,184,0.35)",
                  background: "#ffffff",
                }}
              >
                <span style={{ fontWeight: 700 }}>{item.finnish}</span>
                <span style={{ color: "#475569" }}>{item.english}</span>
              </div>
            ))}
          </div>
        );
      case "phrases":
        return (
          <div style={{ display: "grid", gap: 12 }}>
            {summary.phrases.map((item) => (
              <div
                key={`${summary.label}-phrase-${item.finnish}`}
                style={{
                  borderRadius: 12,
                  border: "1px solid rgba(148,163,184,0.35)",
                  background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
                  padding: "12px 14px",
                  display: "grid",
                  gap: 6,
                }}
              >
                <span style={{ fontWeight: 700 }}>{item.finnish}</span>
                <span style={{ color: "#475569" }}>{item.english}</span>
              </div>
            ))}
          </div>
        );
      case "grammar":
        return (
          <div style={{ display: "grid", gap: 16 }}>
            {summary.grammar.map((block) => (
              <div
                key={`${summary.label}-grammar-${block.title}`}
                style={{
                  borderRadius: 14,
                  border: "1px solid rgba(59,130,246,0.25)",
                  background: "#eef2ff",
                  padding: 16,
                  display: "grid",
                  gap: 8,
                }}
              >
                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e3a8a" }}>{block.title}</h4>
                <ul style={{ margin: 0, paddingInlineStart: 18, color: "#1f2937", lineHeight: 1.6 }}>
                  {block.bullets.map((line) => (
                    <li key={`${block.title}-${line}`}>{line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
      case "practice":
        return (
          <div style={{ display: "grid", gap: 16 }}>
            {summary.practice.map((task) => (
              <div
                key={`${summary.label}-practice-${task.title}`}
                style={{
                  borderRadius: 14,
                  border: "1px solid rgba(34,197,94,0.35)",
                  background: "rgba(240,253,244,0.9)",
                  padding: 16,
                  display: "grid",
                  gap: 6,
                }}
              >
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#166534" }}>{task.title}</h4>
                <p style={{ margin: 0, fontSize: 13.5, color: "#1f2937", lineHeight: 1.6 }}>{task.description}</p>
              </div>
            ))}
          </div>
        );
      case "drills":
        return (
          <div style={{ display: "grid", gap: 16 }}>
            {summary.drills.map((drill) => (
              <div
                key={drill.id}
                style={{
                  borderRadius: 14,
                  border: "1px solid rgba(148,163,184,0.35)",
                  background: "#f8fafc",
                  padding: 16,
                  display: "grid",
                  gap: 8,
                }}
              >
                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e3a8a" }}>{drill.question}</h4>
                <p style={{ margin: 0, fontSize: 13.5, color: "#475569", lineHeight: 1.6 }}>{drill.hint}</p>
                <input
                  type="text"
                  placeholder="Your answer..."
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid #cbd5f5",
                    background: "#ffffff",
                    fontSize: 13.5,
                    color: "#1e293b",
                  }}
                  value={drillState[drill.id]?.value || ""}
                  onChange={(e) => {
                    setDrillState(prev => ({
                      ...prev,
                      [drill.id]: { value: e.target.value, status: "idle" }
                    }));
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      checkDrillAnswer(drill.id);
                    }
                  }}
                />
                {drillState[drill.id]?.status === "correct" && (
                  <p style={{ margin: 0, fontSize: 13.5, color: "#166534", fontWeight: 600 }}>Correct!</p>
                )}
                {drillState[drill.id]?.status === "incorrect" && (
                  <p style={{ margin: 0, fontSize: 13.5, color: "#991b1b", fontWeight: 600 }}>Incorrect. Try again.</p>
                )}
                {drillState[drill.id]?.status === "idle" && (
                  <button
                    type="button"
                    onClick={() => checkDrillAnswer(drill.id)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: "1px solid #1d4ed8",
                      background: "#e0f2fe",
                      color: "#1d4ed8",
                      fontSize: 13.5,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Check Answer
                  </button>
                )}
              </div>
            ))}
          </div>
        );
      default:
        return (
          <div style={{ display: "grid", gap: 16 }}>
            <div
              style={{
                borderRadius: 16,
                border: "1px solid rgba(148,163,184,0.35)",
                background: "#ffffff",
                padding: 18,
                display: "grid",
                gap: 12,
              }}
            >
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a" }}>{summary.label} • {summary.tagline}</h3>
              <p style={{ margin: 0, fontSize: 14.5, color: "#475569", lineHeight: 1.6 }}>{summary.message}</p>
              <div style={{ display: "grid", gap: 6 }}>
                {summary.focusAreas.map((focus) => (
                  <div
                    key={`${summary.label}-focus-${focus}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13.5,
                      color: "#1d4ed8",
                      fontWeight: 600,
                    }}
                  >
                    <span>•</span>
                    <span>{focus}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  }, [summary, view, drillState, checkDrillAnswer]);

  return (
    <section
      style={{
        borderRadius: 20,
        border: "1px solid #e2e8f0",
        background: "#ffffff",
        boxShadow: "0 16px 32px rgba(15,23,42,0.08)",
        padding: 24,
        display: "grid",
        gap: 20,
        height: "100%",
      }}
    >
      <header style={{ display: "grid", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: 1.3, textTransform: "uppercase", color: "#475569" }}>
              My Finnish Journey
            </p>
            <h2 style={{ margin: "6px 0 0 0", fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
              Select a level to unlock curated lessons
            </h2>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              border: "1px solid rgba(59,130,246,0.25)",
              background: "rgba(59,130,246,0.1)",
              borderRadius: 12,
              padding: "10px 16px",
              fontWeight: 700,
              color: "#1d4ed8",
            }}
          >
            Skill Passport entries {summary.vocabulary.length >= 6 ? 2 : 1}
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {(Object.keys(LEVELS) as LevelKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setLevel(key);
                setView("overview");
              }}
              style={{
                padding: "8px 14px",
                borderRadius: 999,
                border: "1px solid #cbd5f5",
                background: key === level ? "linear-gradient(135deg, #2563eb, #7c3aed)" : "#f8fafc",
                color: key === level ? "#fff" : "#1e293b",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {LEVELS[key].label}
            </button>
          ))}
        </div>
      </header>

      <nav
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          borderBottom: "1px solid rgba(148,163,184,0.3)",
          paddingBottom: 8,
        }}
      >
        {VIEWS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setView(tab.id)}
            style={{
              padding: "6px 12px",
              borderRadius: 999,
              border: "1px solid transparent",
              background: view === tab.id ? "rgba(59,130,246,0.15)" : "transparent",
              color: view === tab.id ? "#1d4ed8" : "#475569",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div
        style={{
          maxHeight: "calc(80vh - 200px)",
          overflowY: "auto",
          paddingRight: 6,
          display: "grid",
          gap: 18,
        }}
      >
        {viewContent}
      </div>
    </section>
  );
}

