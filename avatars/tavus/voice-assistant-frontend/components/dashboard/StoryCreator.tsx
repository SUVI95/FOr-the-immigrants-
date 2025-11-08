"use client";

import { useMemo, useState } from "react";
import { useUserProfile } from "@/context/UserProfileContext";

type StoryType = "My Finnish Story" | "Event Review";

type StoryPost = {
  id: string;
  title: string;
  type: StoryType;
  content: string;
  createdAt: string;
  aiVersion?: string;
  likes: number;
};

const INITIAL_POSTS: StoryPost[] = [
  {
    id: "story-sample-1",
    title: "How Kajaani Library Became My First Friend",
    type: "My Finnish Story",
    content:
      "I arrived two months ago. The language café at Kajaani Library made me less nervous. Volunteers slowed down the words and gave me a useful phrase sheet. Now I help welcome other newcomers on Tuesdays.",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 18,
  },
  {
    id: "story-sample-2",
    title: "Event Review: Digital Skills Sprint",
    type: "Event Review",
    content:
      "The Fast Integration Track on digital skills helped me set up Suomi.fi, Kela and bank credentials in one weekend. The AI coach also nudged me to book a mentoring session. Highly recommend for anyone job hunting!",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 26,
  },
];

function simplifyToPlainLanguage(text: string) {
  if (!text.trim()) return "";
  const replacements: Array<[RegExp, string]> = [
    [/utilise/gi, "use"],
    [/in order to/gi, "to"],
    [/regarding/gi, "about"],
    [/assistance/gi, "help"],
    [/approximately/gi, "about"],
    [/prior to/gi, "before"],
    [/assure/gi, "make sure"],
    [/endeavour/gi, "try"],
    [/facilitate/gi, "help"],
    [/participated/gi, "joined"],
    [/residence permit/gi, "permit to stay"],
  ];

  const sentences = text
    .replace(/\s+/g, " ")
    .split(/[.!?]/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .map((sentence) => {
      let processed = sentence;
      replacements.forEach(([pattern, replacement]) => {
        processed = processed.replace(pattern, replacement);
      });
      processed = processed.replace(/\bcan't\b/gi, "cannot").replace(/\bwon't\b/gi, "will not");
      if (!processed.match(/(i|I)\b/)) {
        processed = `I ${processed.charAt(0).toLowerCase()}${processed.slice(1)}`;
      }
      processed = processed.replace(/\bSuomi\.fi\b/g, "Suomi.fi");
      return processed.charAt(0).toUpperCase() + processed.slice(1);
    });

  const limited = sentences.slice(0, 4);
  return `${limited.join(". ")}.`.replace(/\.\./g, ".");
}

const formatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function StoryCreator() {
  const {
    state: { settings },
    recordAction,
  } = useUserProfile();
  const [storyType, setStoryType] = useState<StoryType>("My Finnish Story");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState<string>("");
  const [posts, setPosts] = useState<StoryPost[]>(INITIAL_POSTS);
  const [isGenerating, setIsGenerating] = useState(false);

  const plainLanguageEnabled = settings.plainLanguage;

  const orderedPosts = useMemo(
    () =>
      [...posts].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }),
    [posts],
  );

  const handleGenerateSuggestion = () => {
    if (!content.trim()) {
      setAiSuggestion("Write a short story first so I can simplify it.");
      return;
    }
    setIsGenerating(true);
    window.setTimeout(() => {
      const simplified = simplifyToPlainLanguage(content);
      setAiSuggestion(simplified);
      setIsGenerating(false);
    }, 400);
  };

  const handlePublish = () => {
    if (!title.trim() || !content.trim()) {
      alert("Please add a title and your story before publishing.");
      return;
    }

    const id = `story-${Date.now()}`;
    const newPost: StoryPost = {
      id,
      title: title.trim(),
      type: storyType,
      content: content.trim(),
      aiVersion: aiSuggestion && aiSuggestion !== content ? aiSuggestion : undefined,
      createdAt: new Date().toISOString(),
      likes: Math.floor(Math.random() * 12) + 4,
    };

    const newPosts = [newPost, ...posts];
    setPosts(newPosts);

    const isFirstPost = posts.length === 0;
    const isFifthPost = posts.length === 4;

    recordAction({
      id,
      label: `Published ${storyType}`,
      category: "story",
      xp: 40,
      impactPoints: 35,
      impactHours: storyType === "Event Review" ? 0.25 : 0.15,
      badgeLabel: isFirstPost ? "Storyteller" : isFifthPost ? "Community Contributor" : undefined,
      skill: {
        id: `skill-story-${id}`,
        title: `${storyType} contribution`,
        category: "Community",
        details: "Story published via Create + AI helper",
        source: "story",
      },
      reminder: {
        title: "Follow up: respond to comments on your story",
        dueAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        channel: "in-app",
      },
    });

    setTitle("");
    setContent("");
    setAiSuggestion("");
  };

  const handleReport = (post: StoryPost) => {
    recordAction({
      id: `story-report-${post.id}`,
      label: `Reported story ${post.id}`,
      category: "safety",
      xp: 0,
      impactPoints: 5,
      metadata: { reason: "user_flagged_story" },
    });
    alert("Thanks for keeping the space safe. Moderators will review this post shortly.");
  };

  return (
    <section
      aria-labelledby="story-creator"
      style={{
        borderRadius: 20,
        padding: 24,
        background: "#fff",
        border: "1px solid #e2e8f0",
        boxShadow: "0 16px 32px rgba(15, 23, 42, 0.08)",
        display: "grid",
        gridTemplateColumns: "minmax(280px, 1fr) minmax(320px, 1.4fr)",
        gap: 28,
        alignItems: "start",
      }}
    >
      <div>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: 1.3, textTransform: "uppercase", color: "#475569" }}>
          Create
        </p>
        <h2 id="story-creator" style={{ margin: "6px 0 12px 0", fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
          Share your Finnish story
        </h2>
        <p style={{ color: "#475569", lineHeight: 1.6, marginBottom: 14 }}>
          Tell the community how you are settling in or review an event you joined. The AI helper rewrites your post in clear Finnish (Selkokieli). Each story earns XP, improves your Skill Passport and nudges your Impact Wallet automatically.
        </p>

        <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: "#0f172a", marginBottom: 8 }}>
          Story type
          <select
            value={storyType}
            onChange={(event) => setStoryType(event.target.value as StoryType)}
            style={{
              width: "100%",
              marginTop: 6,
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #cbd5f5",
              fontSize: 14,
            }}
          >
            <option value="My Finnish Story">My Finnish Story</option>
            <option value="Event Review">Event Review</option>
          </select>
        </label>

        <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: "#0f172a", marginBottom: 12 }}>
          Title
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Give your story a short title"
            style={{
              width: "100%",
              marginTop: 6,
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid #cbd5f5",
              fontSize: 15,
            }}
          />
        </label>

        <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: "#0f172a", marginBottom: 10 }}>
          Your story
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="What happened? Who helped you? How did Knuut AI support the journey?"
            rows={8}
            style={{
              width: "100%",
              marginTop: 6,
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid #cbd5f5",
              fontSize: 15,
              lineHeight: 1.6,
            }}
          />
        </label>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
          <button
            type="button"
            onClick={handleGenerateSuggestion}
            disabled={isGenerating}
            style={{
              padding: "10px 16px",
              borderRadius: 12,
              border: "1px solid #4338ca",
              background: "rgba(79, 70, 229, 0.08)",
              color: "#4338ca",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {isGenerating ? "Rewriting…" : "AI helper: simplify"}
          </button>
          {aiSuggestion && aiSuggestion !== content && (
            <button
              type="button"
              onClick={() => setContent(aiSuggestion)}
              style={{
                padding: "10px 16px",
                borderRadius: 12,
                border: "1px solid #22c55e",
                background: "rgba(34, 197, 94, 0.08)",
                color: "#166534",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Apply suggestion
            </button>
          )}
          <button
            type="button"
            onClick={handlePublish}
            style={{
              padding: "10px 18px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg, #1d4ed8 0%, #6366f1 100%)",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 16px 28px rgba(79, 70, 229, 0.28)",
            }}
          >
            Publish story
          </button>
        </div>

        {aiSuggestion && (
          <div
            style={{
              marginTop: 16,
              padding: 16,
              borderRadius: 16,
              border: "1px solid #bbf7d0",
              background: "rgba(34, 197, 94, 0.08)",
              fontSize: 14,
              color: "#14532d",
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 6 }}>AI Selkokieli suggestion:</div>
            <p style={{ margin: 0, lineHeight: 1.7 }}>{aiSuggestion}</p>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        {orderedPosts.map((post) => (
          <article
            key={post.id}
            style={{
              borderRadius: 18,
              padding: 20,
              border: "1px solid #e2e8f0",
              background: plainLanguageEnabled ? "#f8fafc" : "#ffffff",
              boxShadow: "0 12px 24px rgba(15, 23, 42, 0.06)",
              position: "relative",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    color: "#64748b",
                  }}
                >
                  {post.type}
                </p>
                <h3 style={{ margin: "6px 0 10px 0", fontSize: 18, fontWeight: 700, color: "#0f172a" }}>{post.title}</h3>
              </div>
              <span style={{ fontSize: 12, color: "#475569", fontWeight: 600 }}>{formatter.format(new Date(post.createdAt))}</span>
            </div>
            <p style={{ margin: 0, color: "#334155", lineHeight: 1.7 }}>
              {plainLanguageEnabled && post.aiVersion ? post.aiVersion : post.content}
            </p>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 14 }}>
              <button
                type="button"
                onClick={() =>
                  recordAction({
                    id: `story-like-${post.id}-${Date.now()}`,
                    label: `Reacted to ${post.id}`,
                    category: "story",
                    xp: 4,
                    impactPoints: 3,
                  })
                }
                style={{
                  padding: "8px 12px",
                  borderRadius: 999,
                  border: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                ❤️ {post.likes}
              </button>
              <button
                type="button"
                onClick={() => handleReport(post)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 999,
                  border: "1px solid #fecaca",
                  background: "#fef2f2",
                  color: "#b91c1c",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Report / Block
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default StoryCreator;


