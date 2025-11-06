"use client";

import { useState } from "react";

interface SkillsExchangeContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  exchange: {
    id: string;
    title: string;
    skills_offered: string[];
    skills_wanted: string[];
    location: string;
  };
  onSubmit: (data: SkillsExchangeContactData) => Promise<void>;
}

export interface SkillsExchangeContactData {
  exchange_id: string;
  your_name: string;
  your_email: string;
  your_phone?: string;
  message: string;
  your_skills: string;
  privacy_consent: boolean;
}

export default function SkillsExchangeContactModal({
  isOpen,
  onClose,
  exchange,
  onSubmit,
}: SkillsExchangeContactModalProps) {
  const [formData, setFormData] = useState<SkillsExchangeContactData>({
    exchange_id: exchange.id,
    your_name: "",
    your_email: "",
    your_phone: "",
    message: "",
    your_skills: "",
    privacy_consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.privacy_consent) {
      setError("You must agree to the privacy policy to contact this user");
      return;
    }

    if (!formData.your_name || !formData.your_email || !formData.message) {
      setError("Please fill in all required fields (Name, Email, Message)");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      
      // Reset form
      setFormData({
        exchange_id: exchange.id,
        your_name: "",
        your_email: "",
        your_phone: "",
        message: "",
        your_skills: "",
        privacy_consent: false,
      });
      
      // Close modal after successful submission
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "30px",
          maxWidth: "600px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#1a1a1a" }}>
            Contact Skills Exchange
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#666",
              padding: "0",
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: "20px", padding: "15px", background: "#fef3c7", borderRadius: "8px", borderLeft: "4px solid #f59e0b" }}>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#666", marginBottom: "8px" }}>
            <strong>Exchange:</strong> {exchange.title}
          </p>
          <div style={{ fontSize: "0.85rem", color: "#666" }}>
            <div><strong>They offer:</strong> {exchange.skills_offered.join(", ")}</div>
            <div><strong>They want:</strong> {exchange.skills_wanted.join(", ")}</div>
          </div>
        </div>

        <div style={{ marginBottom: "20px", padding: "12px", background: "#eff6ff", borderRadius: "8px", fontSize: "0.85rem", color: "#1e40af" }}>
          🔒 <strong>Privacy Notice:</strong> Your contact information will only be shared with the person who posted this exchange after they accept your message. Your email will not be displayed publicly.
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#374151" }}>
                Your Name <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="text"
                required
                value={formData.your_name}
                onChange={(e) => setFormData({ ...formData, your_name: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#667eea")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#374151" }}>
                Your Email <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="email"
                required
                value={formData.your_email}
                onChange={(e) => setFormData({ ...formData, your_email: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#667eea")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
              />
              <p style={{ marginTop: "5px", fontSize: "0.8rem", color: "#666" }}>
                This will only be shared if the exchange poster accepts your message
              </p>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#374151" }}>
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={formData.your_phone}
                onChange={(e) => setFormData({ ...formData, your_phone: e.target.value })}
                placeholder="+358..."
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#667eea")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#374151" }}>
                Your Skills/What You Can Offer
              </label>
              <textarea
                value={formData.your_skills}
                onChange={(e) => setFormData({ ...formData, your_skills: e.target.value })}
                rows={3}
                placeholder="Describe what skills or knowledge you can share..."
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                  resize: "vertical",
                  transition: "border-color 0.2s",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#667eea")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#374151" }}>
                Your Message <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                placeholder="Introduce yourself and explain why you're interested in this exchange..."
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                  resize: "vertical",
                  transition: "border-color 0.2s",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#667eea")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
              />
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <input
                type="checkbox"
                id="privacy-consent"
                checked={formData.privacy_consent}
                onChange={(e) => setFormData({ ...formData, privacy_consent: e.target.checked })}
                style={{ marginTop: "4px", cursor: "pointer" }}
                required
              />
              <label htmlFor="privacy-consent" style={{ fontSize: "0.9rem", color: "#374151", cursor: "pointer" }}>
                I agree that my contact information will only be shared with the exchange poster if they accept my message. 
                I understand that Knuut AI moderates messages for safety and content appropriateness. 
                <span style={{ color: "#ef4444" }}>*</span>
              </label>
            </div>

            {error && (
              <div style={{ padding: "12px", background: "#fee2e2", borderRadius: "8px", color: "#dc2626" }}>
                {error}
              </div>
            )}

            {isSubmitting && (
              <div style={{ padding: "12px", background: "#dbeafe", borderRadius: "8px", color: "#1e40af", textAlign: "center" }}>
                Sending your message... (This may take a moment for moderation review)
              </div>
            )}

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                style={{
                  padding: "12px 24px",
                  background: "#f3f4f6",
                  color: "#374151",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.5 : 1,
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.privacy_consent}
                style={{
                  padding: "12px 24px",
                  background: isSubmitting || !formData.privacy_consent ? "#9ca3af" : "#f59e0b",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: isSubmitting || !formData.privacy_consent ? "not-allowed" : "pointer",
                }}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

