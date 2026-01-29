import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
    console.warn("Gemini API Key is missing!");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

// System instruction to guide the model behavior
// System instruction to guide the model behavior
const SYSTEM_INSTRUCTION = `
당신은 초등학생과 중학생을 위한 친절하고 똑똑한 AI 수학 선생님입니다. 
사용자가 수학 문제 이미지(또는 그에 대한 설명)를 보내면, **인사말이나 문제 요약 없이** 바로 다음 단계에 따라 답변해주세요.

1. **단계별 풀이**: 학생들이 이해하기 쉽도록 친절한 어투(~해요, ~합니다)로 풀이 과정을 단계별로 설명해주세요. 복잡한 수식은 LaTeX 형식($...$)을 사용하여 명확하게 작성해주세요. **여러 가지 풀이 방법을 제시하거나 문제의 모호함에 대해 논의하지 마세요. 가장 확실한 한 가지 방법으로만 처음부터 끝까지 명쾌하게 설명해주세요.**
2. **정답 확인**: 마지막에 정답을 명확하게 한 번 더 강조해주세요.

**주의사항**:
- 답변은 한국어로 작성하세요.
- **인사말(안녕하세요 등)과 "문제 파악" 섹션을 절대 포함하지 마세요.**
- **"다른 풀이", "참고", "만약 ~라면" 등의 가정을 덧붙여 설명을 길게 하지 마세요.**
- **해설 중에 "이 문제는 ~로 보입니다"와 같은 추측성 발언을 하지 말고, 확신을 가지고 설명하세요.**
- 바로 풀이부터 시작하세요.
- LaTeX 수식은 $E=mc^2$ 와 같이 달러 기호($)로 감싸주세요.
- 풀이는 너무 어렵지 않게 학년 수준(초등/중등)에 맞춰 설명해주세요.
- 학부모가 채점용으로 볼 것이므로, 격려 말보다는 정확한 풀이 위주로 작성해주세요.
`;

export async function solveMathProblem(base64Image: string): Promise<string> {
    if (!apiKey) {
        throw new Error("API Key가 설정되지 않았습니다.");
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite",
            systemInstruction: SYSTEM_INSTRUCTION
        });

        const base64Data = base64Image.split(",")[1];
        const mimeType = base64Image.split(";")[0].split(":")[1];

        const prompt = "이 수학 문제를 풀어주세요. 단계별로 설명해 주세요.";

        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: mimeType || "image/jpeg",
            },
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        return response.text();

    } catch (error) {
        console.error("Gemini API Error:", error);
        if ((error as Error).message?.includes("404") || (error as Error).message?.includes("not found")) {
            throw new Error("모델을 찾을 수 없습니다. 'gemini-2.5-flash'가 유효한지 확인해주세요. (혹시 1.5-flash를 의도하셨나요?)");
        }
        throw error;
    }
}

export async function* solveMathProblemStream(base64Image: string) {
    if (!apiKey) {
        throw new Error("API Key가 설정되지 않았습니다.");
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite",
            systemInstruction: SYSTEM_INSTRUCTION
        });

        const base64Data = base64Image.split(",")[1];
        const mimeType = base64Image.split(";")[0].split(":")[1];
        const prompt = "이 수학 문제를 풀어주세요. 단계별로 설명해 주세요.";

        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: mimeType || "image/jpeg",
            },
        };

        const result = await model.generateContentStream([prompt, imagePart]);

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            yield chunkText;
        }

    } catch (error) {
        console.error("Gemini API Stream Error:", error);
        if ((error as Error).message?.includes("404") || (error as Error).message?.includes("not found")) {
            throw new Error("모델을 찾을 수 없습니다. 'gemini-2.5-flash'가 유효한지 확인해주세요.");
        }
        throw error;
    }
}
