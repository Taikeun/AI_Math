
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

// Load environment variables manually without dotenv
function loadEnv() {
    const envPath = path.resolve(process.cwd(), ".env.local");
    if (!fs.existsSync(envPath)) return {};

    const content = fs.readFileSync(envPath, "utf-8");
    const env: Record<string, string> = {};

    content.split("\n").forEach(line => {
        const parts = line.split("=");
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join("=").trim().replace(/^["']|["']$/g, ""); // Remove quotes
            if (key) env[key] = value;
        }
    });
    return env;
}

const env = loadEnv();
const apiKey = env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
    console.error("API Key not found in .env.local");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

const SYSTEM_INSTRUCTION = `
당신은 초등학생과 중학생을 위한 친절하고 똑똑한 AI 수학 선생님입니다. 
사용자가 수학 문제 이미지(또는 그에 대한 설명)를 보내면, **인사말이나 문제 요약 없이** 바로 다음 단계에 따라 답변해주세요.

1. **단계별 풀이**: 학생들이 이해하기 쉽도록 친절한 어투(~해요, ~합니다)로 풀이 과정을 단계별로 설명해주세요. 복잡한 수식은 LaTeX 형식($...$)을 사용하여 명확하게 작성해주세요.
2. **정답 확인**: 마지막에 정답을 명확하게 한 번 더 강조해주세요.

**주의사항**:
- 답변은 한국어로 작성하세요.
- **인사말(안녕하세요 등)과 "문제 파악" 섹션을 절대 포함하지 마세요.**
- 바로 풀이부터 시작하세요.
- LaTeX 수식은 $E=mc^2$ 와 같이 달러 기호($)로 감싸주세요.
- 풀이는 너무 어렵지 않게 학년 수준(초등/중등)에 맞춰 설명해주세요.
- 학부모가 채점용으로 볼 것이므로, 격려 말보다는 정확한 풀이 위주로 작성해주세요.
`;

async function testStream() {
    const imagePath = "/Users/tcho/.gemini/antigravity/brain/86704791-6eac-4331-a9df-8f25e7b83fa1/uploaded_media_1769648105915.png";

    if (!fs.existsSync(imagePath)) {
        console.error("Image file not found:", imagePath);
        return;
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const base64Data = imageBuffer.toString("base64");
    const mimeType = "image/png";

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
        systemInstruction: SYSTEM_INSTRUCTION
    });

    const prompt = "이 수학 문제를 풀어주세요. 단계별로 설명해 주세요.";

    const imagePart = {
        inlineData: {
            data: base64Data,
            mimeType: mimeType,
        },
    };

    console.log("Starting stream...");
    try {
        const result = await model.generateContentStream([prompt, imagePart]);

        let fullText = "";
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            process.stdout.write(chunkText);
            fullText += chunkText;
        }
        console.log("\n\nStream complete!");
    } catch (error) {
        console.error("Error during streaming:", error);
    }
}

testStream();
