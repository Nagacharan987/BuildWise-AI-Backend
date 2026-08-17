import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors({ origin: true, methods: ["GET", "POST", "OPTIONS"] }));
app.use(express.json({ limit: "1mb" }));

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || "gpt-5";
const openai = apiKey ? new OpenAI({ apiKey }) : null;

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "BuildWise AI backend", aiConfigured: Boolean(openai) });
});

app.post("/api/ask", async (req, res) => {
  try {
    const question = typeof req.body?.question === "string" ? req.body.question.trim() : "";
    if (!question) return res.status(400).json({ error: "Please provide a question." });
    if (question.length > 4000) return res.status(413).json({ error: "Question is too long." });
    if (!openai) return res.status(503).json({ error: "AI backend is not configured yet." });

    const response = await openai.responses.create({
      model,
      store: false,
      instructions:
        "You are BuildWise AI, an assistant for early-stage construction planning. " +
        "Give clear, practical, structured guidance for homeowners. " +
        "Do not provide final structural, legal, electrical, or financial decisions. " +
        "Clearly distinguish preliminary estimates from professional engineering work. " +
        "Recommend qualified professionals for site-specific structural design, soil testing, permits, and final quantities.",
      input: question
    });

    res.json({ answer: response.output_text || "No text answer was generated." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "The AI service could not complete the request." });
  }
});

app.use((_req, res) => res.status(404).json({ error: "Route not found." }));

app.listen(port, () => {
  console.log(`BuildWise AI backend running on http://localhost:${port}`);
});
