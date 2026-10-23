"use client";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [temp, setTemp] = useState(0.5);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim() || loading) return;
    const next = [...messages, { role: "user", content: input }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, temperature: temp }),
      });
      const data = await res.json();
      setMessages([
        ...next,
        { role: "assistant", content: data.reply || data.error || "Something went wrong." },
      ]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Network error, please try again." }]);
    }
    setLoading(false);
  }

  const label = temp < 0.3 ? "basic" : temp < 0.7 ? "balanced" : "rich";

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: 24, fontFamily: "sans-serif", color: "#111" }}>
      <h1>🐾 Animal Facts Chatbot</h1>

      <label>
        Creativity: {temp.toFixed(1)} ({label})
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={temp}
          onChange={(e) => setTemp(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </label>

      <div style={{ margin: "16px 0", minHeight: 300 }}>
        {messages.map((m, i) => (
          <p
            key={i}
            style={{
              background: m.role === "user" ? "#e8f0fe" : "#f1f8e9",
              padding: 10,
              borderRadius: 8,
              whiteSpace: "pre-wrap",
            }}
          >
            <b>{m.role === "user" ? "You" : "Bot"}:</b> {m.content}
          </p>
        ))}
        {loading && <p>Thinking…</p>}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
        placeholder="Ask about any animal…"
        style={{ width: "75%", padding: 8 }}
      />
      <button onClick={send} style={{ padding: 8, marginLeft: 8 }}>
        Send
      </button>
    </main>
  );
}
