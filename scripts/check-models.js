
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

// Load env
const envPath = path.resolve(process.cwd(), ".env.local");
const content = fs.readFileSync(envPath, "utf-8");
const env = {};
content.split("\n").forEach(line => {
    const parts = line.split("=");
    if (parts.length >= 2) env[parts[0].trim()] = parts.slice(1).join("=").trim().replace(/^["']|["']$/g, "");
});

const genAI = new GoogleGenerativeAI(env.NEXT_PUBLIC_GEMINI_API_KEY);

async function listModels() {
    try {
        const models = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).apiKey; // Hack to check auth, but specific listModels API exists on standard REST but SDK might obscure it.
        // Actually, SDK doesn't always expose listModels directly in the simplified "generative-ai" package used here. 
        // Let's try to infer or just assume 1.5-flash, 1.5-pro, 2.0-flash-exp.
        // However, I can try to make a raw request.
        console.log("Checking standard models...");

        // Testing specific models
        const candidates = [
            "gemini-2.0-flash-lite-preview-02-05",
            "gemini-2.0-flash",
            "gemini-2.0-pro-exp-02-05",
            "gemini-1.5-flash",
            "gemini-1.5-pro"
        ];

        for (const m of candidates) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("Test");
                console.log(`Model ${m}: AVAILABLE`);
            } catch (e) {
                console.log(`Model ${m}: ERROR - ${e.message.split(' ')[0]}...`);
            }
        }

    } catch (e) {
        console.error(e);
    }
}

listModels();
