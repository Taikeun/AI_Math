
import { solveMathProblemStream } from "../src/lib/gemini";
import fs from "fs";
import path from "path";

// Load environment variables manually
function loadEnv() {
    const envPath = path.resolve(process.cwd(), ".env.local");
    if (!fs.existsSync(envPath)) return {};

    const content = fs.readFileSync(envPath, "utf-8");
    const env: Record<string, string> = {};

    content.split("\n").forEach(line => {
        const parts = line.split("=");
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join("=").trim().replace(/^["']|["']$/g, "");
            if (key) env[key] = value;
        }
    });
    return env;
}

// Set global env for the library to read
const env = loadEnv();
process.env.NEXT_PUBLIC_GEMINI_API_KEY = env.NEXT_PUBLIC_GEMINI_API_KEY;

async function testStream() {
    const imagePath = "/Users/tcho/.gemini/antigravity/brain/86704791-6eac-4331-a9df-8f25e7b83fa1/uploaded_media_1769648105915.png";

    if (!fs.existsSync(imagePath)) {
        console.error("Image file not found:", imagePath);
        return;
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const base64Data = "data:image/png;base64," + imageBuffer.toString("base64");

    console.log("Starting stream test...");

    try {
        const stream = solveMathProblemStream(base64Data);

        let isFirstChunk = true;
        let fullText = "";

        for await (const chunk of stream) {
            if (isFirstChunk) {
                const match = chunk.match(/^\[MODEL: (.*?)\]\n/);
                if (match) {
                    console.log("\n>>> ✅ SUCCESS: DETECTED MODEL HEADER: " + match[1]);
                    console.log(">>> REMAINING FIRST CHUNK: " + chunk.replace(match[0], "").substring(0, 50) + "...\n");
                } else {
                    console.log("\n>>> ❌ FAILURE: NO MODEL HEADER FOUND IN FIRST CHUNK");
                    console.log("First chunk was:", chunk);
                }
                isFirstChunk = false;
            }
            process.stdout.write(chunk);
            fullText += chunk;
        }
        console.log("\n\nStream complete!");
    } catch (error) {
        console.error("Error during streaming:", error);
    }
}

testStream();
