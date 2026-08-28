const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// --- OMNIROUTE CONFIGURATION ---
const OMNIROUTE_API_KEY = "YOUR_OMNIROUTE_API_KEY_HERE"; 
const OMNIROUTE_URL = "https://api.omniroute.com/v1/chat/completions"; // Example endpoint

app.post('/api/generate', async (req, res) => {
    const { prompt, template } = req.body;
    
    console.log("---- INCOMING REQUEST ----");
    console.log(`Template Selected: ${template}`);
    console.log(`System Prompt: ${prompt}`);
    console.log("Contacting OmniRoute AI Gateway...");
    
    try {
        // 1. Construct the highly-specific System Prompt
        const systemInstruction = `
        You are an expert full-stack developer. The user wants to build a ${template} application.
        Additional user requirements: ${prompt}
        
        You must generate the full codebase for this website.
        CRITICAL: You must respond ONLY with a valid JSON object. Do not include any conversational text, markdown formatting, or explanations.
        
        Use this exact JSON structure:
        {
          "files": [
            {
              "path": "index.html",
              "content": "<!DOCTYPE html>..."
            },
            {
              "path": "styles.css",
              "content": "body { ... }"
            }
          ]
        }
        `;

        // 2. Send the request to OmniRoute (using standard OpenAI-compatible formatting)
        const response = await fetch(OMNIROUTE_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OMNIROUTE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "anthropic/claude-3-5-sonnet", // Or your preferred model via OmniRoute
                messages: [
                    { role: "system", content: systemInstruction },
                    { role: "user", content: "Generate the application code now." }
                ],
                temperature: 0.2 // Low temperature for coding accuracy
            })
        });

        if (!response.ok) {
            throw new Error(`OmniRoute API Error: ${response.status}`);
        }

        const aiData = await response.json();
        
        // 3. Extract the generated code from the response
        const generatedCode = aiData.choices[0].message.content;
        console.log("---- OMNIROUTE GENERATION COMPLETE ----");

        // Send the AI's code back to our React frontend
        res.json({ 
            message: "Website generated successfully!",
            code: generatedCode 
        });

    } catch (error) {
        console.error("Generation Failed:", error);
        res.status(500).json({ message: "Failed to communicate with OmniRoute.", error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Orchestrator backend running on http://localhost:${PORT}`);
});