"use client";

import { useState } from "react";

interface CreateEventFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    event_date: string;
    location_name: string;
  }) => void;
}

export default function CreateEventForm({ onSubmit }: CreateEventFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !eventDate || !location) {
      alert("Please fill in all fields.");
      return;
    }
    onSubmit({ title, description, event_date: eventDate, location_name: location });
    setTitle("");
    setDescription("");
    setEventDate("");
    setLocation("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "8px" }}>
      <div style={{ marginBottom: "12px" }}>
        <label
          htmlFor="title"
          style={{ display: "block", fontSize: "12px", marginBottom: "4px", fontWeight: "500" }}
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            fontSize: "14px",
          }}
          required
        />
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label
          htmlFor="description"
          style={{ display: "block", fontSize: "12px", marginBottom: "4px", fontWeight: "500" }}
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            fontSize: "14px",
            resize: "vertical",
          }}
          required
        ></textarea>
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label
          htmlFor="eventDate"
          style={{ display: "block", fontSize: "12px", marginBottom: "4px", fontWeight: "500" }}
        >
          Date & Time
        </label>
        <input
          type="datetime-local"
          id="eventDate"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            fontSize: "14px",
          }}
          required
        />
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label
          htmlFor="location"
          style={{ display: "block", fontSize: "12px", marginBottom: "4px", fontWeight: "500" }}
        >
          Location Name
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            fontSize: "14px",
          }}
          required
        />
      </div>
      <button
        type="submit"
        className="btn primary"
        style={{ width: "100%" }}
      >
        Create Event
      </button>
    </form>
  );
}

