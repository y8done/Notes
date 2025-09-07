async function summarization(req, res) {
  try {
    const genai = require("@google/genai");
    const GoogleGenAI = genai.GoogleGenAI || genai.default.GoogleGenAI;
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const { text } = req.body;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Summarize this text: " + text,
    });
    res.json({ summary: response.text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { summarization };
