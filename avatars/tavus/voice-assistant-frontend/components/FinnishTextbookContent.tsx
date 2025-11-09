"use client";

import { useCallback, useMemo, useState } from "react";

type LevelKey = "A1" | "A2" | "B1" | "B2" | "C1";

type Drill = {
  id: string;
  question: string;
  answer: string;
  hint?: string;
  sample?: string;
};

type LevelSummary = {
  label: string;
  tagline: string;
  message: string;
  focusAreas: string[];
  vocabulary: Array<{ finnish: string; english: string }>;
  phrases: Array<{ finnish: string; english: string }>;
  grammar: Array<{ title: string; bullets: string[] }>;
  practice: Array<{ title: string; description: string }>;
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
    practice: [
      {
        title: "Mini dialogue",
        description: "Order coffee and a bun at a café. Greet, order, pay, and thank the cashier in Finnish.",
      },
      {
        title: "Numbers drill",
        description: "Practice reading prices aloud from a grocery flyer (esim. 3,49 €).",
      },
      {
        title: "Listening tip",
        description: "Watch Yle Uutiset selkosuomeksi for 3 minutes and write down five new words.",
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
    practice: [
      {
        title: "Schedule builder",
        description: "Write your weekday routine using at least five time expressions and verbs in present tense.",
      },
      {
        title: "Role-play: pharmacy",
        description: "Explain symptoms, ask for medicine, and confirm instructions.",
      },
      {
        title: "Listening challenge",
        description: "Listen to a short Finnish podcast (3 min) and note three new words.",
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
    practice: [
      {
        title: "Interview prep",
        description: "Record answers to three Finnish interview questions and note useful vocabulary.",
      },
      {
        title: "Meeting summary",
        description: "Write a six-sentence summary of a meeting or class you recently attended.",
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
    practice: [
      {
        title: "Opinion column",
        description: "Write 150 words about a local issue. Present pros and cons, then state your recommendation.",
      },
      {
        title: "Panel prep",
        description: "Prepare three arguments for and against remote work. Practice saying them aloud.",
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
    practice: [
      {
        title: "Executive summary",
        description: "Summarise a Finnish article in 200 words, highlighting key recommendations and next steps.",
      },
      {
        title: "Facilitation script",
        description: "Design opening remarks for a community workshop using inclusive language and advanced vocabulary.",
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

