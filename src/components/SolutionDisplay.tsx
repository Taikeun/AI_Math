"use client";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

interface SolutionDisplayProps {
    content: string;
}

export default function SolutionDisplay({ content }: SolutionDisplayProps) {
    return (
        <div className="w-full bg-white rounded-2xl shadow-lg p-6 mt-6 border border-blue-100">
            <h3 className="text-xl font-bold mb-4 text-blue-800 flex items-center gap-2">
                <span>✨ AI 선생님의 풀이</span>
            </h3>
            <div className="prose prose-blue max-w-none text-gray-800 leading-relaxed">
                <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                        // Override headers to keep font size consistent/clean
                        h1: ({ ...props }) => <h3 className="text-lg font-bold mt-4 mb-2 text-blue-900" {...props} />,
                        h2: ({ ...props }) => <h3 className="text-lg font-bold mt-4 mb-2 text-blue-900" {...props} />,
                        h3: ({ ...props }) => <h3 className="text-base font-bold mt-3 mb-2 text-blue-800" {...props} />,
                        // Ensure p tags have spacing and consistent size
                        p: ({ node, ...props }) => <p className="mb-3 text-base leading-7 text-gray-800" {...props} />,
                        li: ({ ...props }) => <li className="ml-4 list-disc pl-1 mb-1" {...props} />
                    }}
                >
                    {content || "결과를 기다리는 중..."}
                </ReactMarkdown>
            </div>
        </div>
    );
}
