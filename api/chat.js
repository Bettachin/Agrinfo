// api/chat.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  // Allow only POST requests
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }
  
  try {
    const userMessage = req.body.message;
    console.log("Received message:", userMessage);

    const API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";
    // Use an environment variable for the API key
    const API_KEY = process.env.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; 

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: userMessage })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Hugging Face API Error:", errorText);
      res.status(500).json({ error: "Failed to fetch AI response" });
      return;
    }

    const data = await response.json();
    console.log("AI Response:", data);

    if (!Array.isArray(data) || data.length === 0 || !data[0].generated_text) {
      console.error("Invalid AI response format:", data);
      res.status(500).json({ error: "Invalid response from AI" });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
