"use client";

interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: {
    id: string;
    title: string;
    description: string;
  } | null;
}

export default function ResourceModal({
  isOpen,
  onClose,
  resource,
}: ResourceModalProps) {
  if (!resource) return null;

  return (
    <div
      className={`modal ${isOpen ? "show" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-card">
        <div className="modal-head">
          <h3 style={{ margin: 0 }}>{resource.title}</h3>
          <button className="btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <p style={{ color: "var(--muted)" }}>{resource.description}</p>
        <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
          <button className="btn">Open official site</button>
          <button className="btn primary">Ask Knuut about this</button>
        </div>
      </div>
    </div>
  );
}

