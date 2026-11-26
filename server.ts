import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      service: "TaskScript Express API",
      timestamp: new Date().toISOString(),
    });
  });

  // Prompt Test & AI Runner using @google/genai
  app.post("/api/gemini/test-prompt", async (req, res) => {
    try {
      const { prompt, systemInstruction, temperature } = req.body;

      if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ error: "A valid prompt string is required." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(200).json({
          text: `[Simulation Mode: GEMINI_API_KEY is not configured in environment. In live deployment with an API key, this will return Gemini Flash output directly.]\n\nGenerated Sample Result for Prompt:\n---\n${prompt.slice(0, 300)}...\n\n✅ Task completed successfully according to standard operating procedure (SOP) guidelines.`,
          simulated: true,
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      let response;
      try {
        response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            systemInstruction:
              systemInstruction ||
              "You are an expert Virtual Assistant operating under standard operating procedures. Provide clean, professional, actionable outputs formatted cleanly for business use.",
            temperature: typeof temperature === "number" ? temperature : 0.7,
          },
        });
      } catch (genError: any) {
        // Fallback gracefully on quota exceeded or rate limit
        if (
          genError?.message?.includes("quota") ||
          genError?.message?.includes("resource_exhausted") ||
          genError?.status === 429
        ) {
          console.warn("Gemini API Quota exceeded. Returning simulated output fallback.");
          return res.json({
            text: `[Note: Gemini API rate limit or quota exceeded. Displaying simulated SOP deliverable]:\n\n=== EXECUTED DELIVERABLE ===\nTask completed according to standard operating procedure guidelines.\n\nSummary of assembled parameters:\n- Prompt executed cleanly\n- Key action items synthesized\n- Output formatted for immediate handover.`,
            simulated: true,
          });
        }
        throw genError;
      }

      return res.json({
        text: response.text || "No response text received from Gemini.",
        simulated: false,
      });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      return res.status(500).json({
        error: error.message || "Failed to generate AI response from Gemini.",
      });
    }
  });

  // Vite middleware for development vs Static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TaskScript Express server running on http://localhost:${PORT}`);
  });
}

startServer();
