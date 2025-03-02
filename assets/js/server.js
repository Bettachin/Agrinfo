const express = require("express");
const cors = require("cors");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

const API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";
const API_KEY = "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"; // Replace with your key

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;
        console.log("Received message:", userMessage);

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
            return res.status(500).json({ error: "Failed to fetch AI response" });
        }

        const data = await response.json();
        console.log("AI Response:", data);

        if (!Array.isArray(data) || data.length === 0 || !data[0].generated_text) {
            console.error("Invalid AI response format:", data);
            return res.status(500).json({ error: "Invalid response from AI" });
        }

        res.json(data); // Send AI response to frontend
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
