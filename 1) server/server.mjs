import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(express.json({ limit: "1mb" }));

// --- CORS ---
const defaultOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  // add your HF Space URL here:
  "https://huggingface.co/spaces/hewad-ai/hewad-ai-chat"
];

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const origins = [...new Set([...defaultOrigins, ...allowedOrigins])];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || origins.some(o => origin.startsWith(o))) return cb(null, true);
    return cb(null, true); // relax for now; tighten later if you want
  }
}));

// --- Health check ---
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// --- Chat endpoint ---
app.post("/api/chat", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    }
    const messages = req.body?.messages ?? [];

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages
      })
    });

    const data = await r.json();
    if (!r.ok) return res.status(r.status).json(data);

    const reply = data?.choices?.[0]?.message?.content ?? "";
    res.json({ reply, raw: data });
  } catch (e) {
    res.status(500).json({ error: "server_error", detail: String(e) });
  }
});

// --- Text-to-speech endpoint ---
app.post("/api/speech", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    }
    const text = (req.body?.text || "").toString().slice(0, 10_000);
    if (!text) return res.status(400).json({ error: "No text" });

    const r = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice: "alloy",
        input: text
      })
    });

    if (!r.ok) {
      const err = await r.text();
      return res.status(r.status).send(err);
    }

    const buf = Buffer.from(await r.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(buf);
  } catch (e) {
    res.status(500).json({ error: "server_error", detail: String(e) });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("✅ Hewad AI server running on", port));
