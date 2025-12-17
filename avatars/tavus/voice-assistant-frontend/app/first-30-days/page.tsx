"use client";

import { useState, useEffect } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import { useUserProfile } from "@/context/UserProfileContext";
import { motion } from "framer-motion";
import VideoPlaceholder from "@/components/VideoPlaceholder";

export type ChecklistItem = {
  id: string;
  title: string;
  description: string;
  urgency: "critical" | "important" | "helpful";
  timeframe: string;
  completed: boolean;
  resources?: Array<{ label: string; href: string }>;
};

export const FIRST_WEEK_CHECKLIST: ChecklistItem[] = [
  {
    id: "week1-1",
    title: "Register your address with DVV",
    description: "Essential for getting your personal identity code and accessing services",
    urgency: "critical",
    timeframe: "Within 7 days",
    completed: false,
    resources: [
      { label: "DVV Registration Guide", href: "https://dvv.fi/en/registration-of-foreign-residents" },
      { label: "Book appointment", href: "https://dvv.fi/en/book-an-appointment" },
    ],
  },
  {
    id: "week1-2",
    title: "Open a bank account",
    description: "Needed for receiving salary, benefits, and daily transactions",
    urgency: "critical",
    timeframe: "Within 7 days",
    completed: false,
    resources: [
      { label: "OP Bank Guide", href: "https://www.op.fi/en/private-customers/banking/accounts" },
      { label: "Nordea Guide", href: "https://www.nordea.fi/en/personal/our-services/account-and-cards" },
    ],
  },
  {
    id: "week1-3",
    title: "Apply for Kela card (social security)",
    description: "Gives you access to healthcare and social benefits",
    urgency: "critical",
    timeframe: "Within 7 days",
    completed: false,
    resources: [
      { label: "Kela Application", href: "https://www.kela.fi/web/en/moving-to-finland" },
      { label: "Required documents", href: "https://www.kela.fi/web/en/moving-to-finland#documents" },
    ],
  },
  {
    id: "week1-4",
    title: "Get a tax card from Vero",
    description: "Required before you can start working legally",
    urgency: "critical",
    timeframe: "Before first job",
    completed: false,
    resources: [
      { label: "Apply for tax card", href: "https://www.vero.fi/en/individuals/tax-cards-and-tax-returns/tax-card/" },
    ],
  },
  {
    id: "week1-5",
    title: "Find emergency contacts",
    description: "Know who to call if something goes wrong",
    urgency: "critical",
    timeframe: "Day 1",
    completed: false,
    resources: [
      { label: "Emergency: 112", href: "tel:112" },
      { label: "Kajaani Info Point", href: "https://www.kajaani.fi/en/" },
    ],
  },
  {
    id: "week1-6",
    title: "Join a community meetup",
    description: "Meet other newcomers and get support from people who understand",
    urgency: "important",
    timeframe: "Within 7 days",
    completed: false,
    resources: [
      { label: "View events", href: "/events" },
      { label: "Find groups", href: "/groups" },
    ],
  },
];

export const FIRST_MONTH_CHECKLIST: ChecklistItem[] = [
  {
    id: "month1-1",
    title: "Get a Finnish ID card",
    description: "Makes daily life easier (opening accounts, proving identity)",
    urgency: "important",
    timeframe: "Within 30 days",
    completed: false,
    resources: [
      { label: "Police ID Card", href: "https://poliisi.fi/en/identity-card" },
    ],
  },
  {
    id: "month1-2",
    title: "Connect with Duunijobs",
    description: "Get help finding work and connect with job advisors",
    urgency: "important",
    timeframe: "Within 30 days",
    completed: false,
    resources: [
      { label: "Contact Duunijobs", href: "/work-opportunities" },
      { label: "Find Work", href: "/work-opportunities" },
    ],
  },
  {
    id: "month1-3",
    title: "Find a language practice partner",
    description: "Practice Finnish through conversation, not just classes",
    urgency: "important",
    timeframe: "Within 30 days",
    completed: false,
    resources: [
      { label: "Find a mentor", href: "/groups" },
      { label: "Language café events", href: "/events" },
    ],
  },
  {
    id: "month1-4",
    title: "Explore job opportunities",
    description: "Start looking for work, even if your Finnish isn't perfect yet",
    urgency: "important",
    timeframe: "Within 30 days",
    completed: false,
    resources: [
      { label: "Jobs for newcomers", href: "/work-opportunities?filter=work-now" },
      { label: "Job shadowing", href: "/work-opportunities?filter=shadowing" },
    ],
  },
  {
    id: "month1-5",
    title: "Learn essential Finnish phrases",
    description: "Start with practical phrases you'll use every day",
    urgency: "helpful",
    timeframe: "Ongoing",
    completed: false,
    resources: [
      { label: "Practice with Knuut AI", href: "/knuut-voice" },
      { label: "Learn Finnish", href: "/learn-finnish" },
    ],
  },
  {
    id: "month1-6",
    title: "Connect with a peer mentor",
    description: "Find someone who's been where you are and succeeded",
    urgency: "important",
    timeframe: "Within 30 days",
    completed: false,
    resources: [
      { label: "Find a mentor", href: "/groups?filter=mentors" },
    ],
  },
];

// City-specific office locations and contacts
const CITY_SPECIFIC_INFO: Record<string, {
  dvvOffice: { name: string; address: string; phone: string; link: string };
  kelaOffice: { name: string; address: string; phone: string; link: string };
  cityServices: { name: string; address: string; phone: string; link: string };
  emergencyContacts: Array<{ name: string; phone: string; description: string }>;
}> = {
  Kajaani: {
    dvvOffice: {
      name: "DVV Kajaani Service Point",
      address: "Kauppakatu 18, 87100 Kajaani",
      phone: "+358 295 536 000",
      link: "https://dvv.fi/en/contact-information",
    },
    kelaOffice: {
      name: "Kela Kajaani",
      address: "Kauppakatu 18, 87100 Kajaani",
      phone: "+358 20 634 0200",
      link: "https://www.kela.fi/web/en/contact-information",
    },
    cityServices: {
      name: "Kajaani City Services",
      address: "Kauppakatu 25, 87100 Kajaani",
      phone: "+358 8 615 611",
      link: "https://www.kajaani.fi/en/",
    },
    emergencyContacts: [
      { name: "Emergency", phone: "112", description: "Police, fire, ambulance" },
      { name: "Kajaani Hospital", phone: "+358 8 615 611", description: "24/7 emergency care" },
      { name: "Non-emergency Police", phone: "+358 295 419 200", description: "General inquiries" },
    ],
  },
  Helsinki: {
    dvvOffice: {
      name: "DVV Helsinki Service Point",
      address: "Mannerheimintie 15, 00100 Helsinki",
      phone: "+358 295 536 000",
      link: "https://dvv.fi/en/contact-information",
    },
    kelaOffice: {
      name: "Kela Helsinki",
      address: "Nordenskiöldinkatu 12, 00250 Helsinki",
      phone: "+358 20 634 0200",
      link: "https://www.kela.fi/web/en/contact-information",
    },
    cityServices: {
      name: "Helsinki City Services",
      address: "Pohjoisesplanadi 11-13, 00170 Helsinki",
      phone: "+358 9 310 1691",
      link: "https://www.hel.fi/en",
    },
    emergencyContacts: [
      { name: "Emergency", phone: "112", description: "Police, fire, ambulance" },
      { name: "Helsinki Hospital", phone: "+358 9 4711", description: "24/7 emergency care" },
      { name: "Non-emergency Police", phone: "+358 295 419 200", description: "General inquiries" },
    ],
  },
  Tampere: {
    dvvOffice: {
      name: "DVV Tampere Service Point",
      address: "Hämeenkatu 13, 33100 Tampere",
      phone: "+358 295 536 000",
      link: "https://dvv.fi/en/contact-information",
    },
    kelaOffice: {
      name: "Kela Tampere",
      address: "Hämeenkatu 13, 33100 Tampere",
      phone: "+358 20 634 0200",
      link: "https://www.kela.fi/web/en/contact-information",
    },
    cityServices: {
      name: "Tampere City Services",
      address: "Keskustori 10, 33100 Tampere",
      phone: "+358 3 5656 0000",
      link: "https://www.tampere.fi/en/",
    },
    emergencyContacts: [
      { name: "Emergency", phone: "112", description: "Police, fire, ambulance" },
      { name: "Tampere Hospital", phone: "+358 3 311 611", description: "24/7 emergency care" },
      { name: "Non-emergency Police", phone: "+358 295 419 200", description: "General inquiries" },
    ],
  },
};

export default function First30DaysPage() {
  const { state } = useUserProfile();
  const [room] = useState(new Room());
  
  const userCity = state.city || "Kajaani";

  return (
    <RoomContext.Provider value={room}>
      <div className="app">
        <Sidebar activeTab="start-here" onTabChange={() => {}} />

        <main
          style={{
            flex: 1,
            padding: "32px 28px",
            background: "#f8fafc",
            minHeight: "100vh",
            overflowY: "auto",
          }}
        >
          <div style={{ display: "grid", gap: 24 }}>
            {/* Entry Path Selection */}
            <section
              style={{
                borderRadius: 24,
                padding: "32px",
                background: "#ffffff",
                border: "2px solid #e2e8f0",
                boxShadow: "0 12px 24px rgba(15,23,42,0.08)",
                marginBottom: 24,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                <div style={{ fontSize: 48 }}>📍</div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
                    Where do I begin?
                  </h2>
                  <p style={{ margin: "8px 0 0 0", fontSize: 16, color: "#64748b" }}>
                    Choose the path that fits your situation
                  </p>
                </div>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                <button
                  onClick={() => {
                    window.location.href = "/new-in-finland";
                  }}
                  style={{
                    padding: "24px",
                    borderRadius: 16,
                    border: "2px solid #e2e8f0",
                    background: "#ffffff",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#667eea";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(102,126,234,0.15)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🆕</div>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
                    I am new in Finland
                  </h3>
                  <p style={{ margin: 0, fontSize: 14, color: "#64748b", lineHeight: 1.5 }}>
                    Just arrived? Start here with your first steps.
                  </p>
                </button>

                <button
                  onClick={() => {
                    window.location.href = "/getting-unstuck";
                  }}
                  style={{
                    padding: "24px",
                    borderRadius: 16,
                    border: "2px solid #e2e8f0",
                    background: "#ffffff",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#667eea";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(102,126,234,0.15)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ fontSize: 40, marginBottom: 12 }}>💪</div>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
                    I have been here but feel stuck
                  </h3>
                  <p style={{ margin: 0, fontSize: 14, color: "#64748b", lineHeight: 1.5 }}>
                    Need help moving forward? Find your path.
                  </p>
                </button>
              </div>
            </section>

            {/* Essential Information for Everyone */}
            <section
              style={{
                borderRadius: 24,
                padding: "32px",
                background: "#ffffff",
                border: "2px solid #e2e8f0",
                boxShadow: "0 12px 24px rgba(15,23,42,0.08)",
                marginBottom: 24,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                <div style={{ fontSize: 48 }}>⭐</div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
                    Essential Information
                  </h2>
                  <p style={{ margin: "8px 0 0 0", fontSize: 16, color: "#64748b" }}>
                    Important things everyone should know
                  </p>
                </div>
              </div>

              <div style={{ display: "grid", gap: 20 }}>
                {/* Emergency Contacts */}
                <div style={{ padding: "20px", borderRadius: 16, background: "#fef2f2", border: "2px solid #fecaca" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <span style={{ fontSize: 32 }}>🆘</span>
                    <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
                      Emergency: Call 112
                    </h3>
                  </div>
                  <p style={{ margin: 0, fontSize: 15, color: "#475569", lineHeight: 1.6 }}>
                    For police, fire, or medical emergencies. Available 24/7. Free call.
                  </p>
                </div>

                {/* Key Services */}
                <div style={{ padding: "20px", borderRadius: 16, background: "#f0f9ff", border: "2px solid #bae6fd" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <span style={{ fontSize: 32 }}>🏛️</span>
                    <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
                      Key Services
                    </h3>
                  </div>
                  <div style={{ display: "grid", gap: 12 }}>
                    <div>
                      <strong style={{ color: "#0f172a" }}>DVV</strong> — Register your address
                      <br />
                      <span style={{ fontSize: 13, color: "#64748b" }}>Needed for ID number and services</span>
                    </div>
                    <div>
                      <strong style={{ color: "#0f172a" }}>Kela</strong> — Social security & healthcare
                      <br />
                      <span style={{ fontSize: 13, color: "#64748b" }}>Apply for benefits and healthcare card</span>
                    </div>
                    <div>
                      <strong style={{ color: "#0f172a" }}>Vero</strong> — Tax administration
                      <br />
                      <span style={{ fontSize: 13, color: "#64748b" }}>Get tax card before working</span>
                    </div>
                  </div>
                </div>

                {/* Quick Help */}
                <div style={{ padding: "20px", borderRadius: 16, background: "#f0fdf4", border: "2px solid #bbf7d0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <span style={{ fontSize: 32 }}>💬</span>
                    <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
                      Need Help Right Now?
                    </h3>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                    <button
                      onClick={() => window.location.href = "/work-opportunities?focus=cv-mentors-meetups"}
                      style={{
                        padding: "10px 20px",
                        borderRadius: 12,
                        border: "2px solid #22c55e",
                        background: "#ffffff",
                        color: "#16a34a",
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: "pointer",
                      }}
                    >
                      Talk to a Coach →
                    </button>
                    <button
                      onClick={() => window.location.href = "/events"}
                      style={{
                        padding: "10px 20px",
                        borderRadius: 12,
                        border: "2px solid #22c55e",
                        background: "#ffffff",
                        color: "#16a34a",
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: "pointer",
                      }}
                    >
                      Find Events →
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </RoomContext.Provider>
  );
}

