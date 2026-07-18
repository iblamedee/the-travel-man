var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_config = require("dotenv/config");
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var app = (0, import_express.default)();
var PORT = 3e3;
var PYTHON_API_URL = process.env.PYTHON_API_URL || "http://127.0.0.1:8000";
app.use(import_express.default.json());
app.get("/api/config", (req, res) => {
  res.json({
    hasApiKey: true
  });
});
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
    const data = await response.json();
    res.json({ text: data.text });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error.message || "Failed to generate chat response" });
  }
});
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
  } catch (error) {
    console.error("Itinerary generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate itinerary" });
  }
});
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
  } catch (error) {
    console.error("Explore details error:", error);
    res.status(500).json({ error: error.message || "Failed to generate destination details" });
  }
});
async function serveApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
serveApp();
//# sourceMappingURL=server.cjs.map
