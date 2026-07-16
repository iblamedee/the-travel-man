import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://127.0.0.1:8000";

app.use(express.json());

// API Routes
app.get("/api/config", (req, res) => {
  // Always active because our Python LangGraph server manages model logic
  res.json({
    hasApiKey: true
  });
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, preferences } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const response = await fetch(`${PYTHON_API_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, preferences })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || "Failed to generate chat response from Python agent");
    }

    const data: any = await response.json();
    res.json({ text: data.text });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error.message || "Failed to generate chat response" });
  }
});

// Itinerary generation endpoint
app.post("/api/itinerary/generate", async (req, res) => {
  try {
    const { destination, duration, budget, style, preferences } = req.body;
    if (!destination) {
      return res.status(400).json({ error: "Destination is required" });
    }

    const response = await fetch(`${PYTHON_API_URL}/api/itinerary/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destination, duration, budget, style, preferences })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || "Failed to generate itinerary from Python agent");
    }

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error("Itinerary generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate itinerary" });
  }
});

// Explore details endpoint
app.post("/api/explore/details", async (req, res) => {
  try {
    const { destination } = req.body;
    if (!destination) {
      return res.status(400).json({ error: "Destination is required" });
    }

    const response = await fetch(`${PYTHON_API_URL}/api/explore/details`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destination })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || "Failed to generate destination details from Python agent");
    }

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error("Explore details error:", error);
    res.status(500).json({ error: error.message || "Failed to generate destination details" });
  }
});

// Vite middleware for development / serving static files
async function serveApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

serveApp();
