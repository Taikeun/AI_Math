"use client";

import { useState, useEffect } from "react";
// We will move this to a component later
import { Lock } from "lucide-react";
import CameraInput from "@/components/CameraInput";

import SolutionDisplay from "@/components/SolutionDisplay";
import { solveMathProblem } from "@/lib/gemini";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);

  // Check session on mount
  useEffect(() => {
    const session = localStorage.getItem("ai_math_session");
    if (session === "access_granted") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded pin for MVP as per PRD "Simple Access Control"
    // In a real app, this would be env variable or hashed, but for "family/friends" usage:
    // Let's assume a default PIN '1234' or allow user to set it? 
    // The user said "처음에 비밀번호를 눌러야 해". 
    // I'll set a default PIN '1234' for now and mentioned it to the user later.
    if (password === "grace2015") {
      localStorage.setItem("ai_math_session", "access_granted");
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ai_math_session");
    setIsAuthenticated(false);
    setImage(null);
    setSolution(null);
  }

  const handleImageSelected = (file: File) => {
    setImage(file);
    setSolution(null);
    // Auto-scroll or UI update if needed
  };

  const handleSolve = async () => {
    if (!image) return;

    setLoading(true);
    try {
      // Convert image to Base64
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        try {
          const result = await solveMathProblem(base64data);
          setSolution(result);
        } catch (err) {
          console.error(err);
          alert("문제를 푸는 도중 오류가 발생했습니다. 다시 시도해주세요.\n" + (err as Error).message);
        } finally {
          setLoading(false);
        }
      };
    } catch (err) {
      console.error("Image processing error", err);
      setLoading(false);
    }
  };

  const handleRetake = () => {
    setImage(null);
    setSolution(null);
  }

  if (isAuthenticated) {
    return (
      <main className="flex flex-col items-center min-h-[100dvh] p-4 bg-gray-50 text-gray-900 pb-20">
        <div className="w-full max-w-md flex justify-between items-center mb-8 pt-2">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">AI Math</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-500 transition"
          >
            Logout
          </button>
        </div>

        <div className="w-full flex-1 flex flex-col items-center max-w-md">
          {!image ? (
            <CameraInput onImageSelected={handleImageSelected} />
          ) : (
            <div className="w-full fade-in">
              {/* Image Preview */}
              <div className="relative w-full aspect-[3/4] bg-black rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200 mb-6">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Problem to solve"
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={handleRetake}
                  className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition backdrop-blur-sm z-10"
                >
                  {/* X icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>
                </button>
              </div>

              {!solution && (
                <div className="w-full">
                  <button
                    onClick={handleSolve}
                    disabled={loading}
                    className={`w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition active:scale-95 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" />
                        AI 선생님이 생각하는 중...
                      </>
                    ) : (
                      "문제 풀기 (Solve)"
                    )}
                  </button>
                </div>
              )}

              {solution && (
                <div className="animate-in slide-in-from-bottom-5 fade-in duration-500 pb-10">
                  <SolutionDisplay content={solution} />
                  <div className="mt-8 flex flex-col gap-3">
                    <button
                      onClick={handleRetake}
                      className="w-full py-4 bg-white border-2 border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition shadow-sm"
                    >
                      다른 문제 풀기
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-[100dvh] bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h1 className="text-xl font-bold mb-2 text-gray-900">Access Restricted</h1>
        <p className="text-gray-500 mb-6 text-sm">Please enter the PIN to continue.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter PIN"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
              maxLength={4}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">Incorrect PIN. Try again.</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-md active:scale-95"
          >
            Enter
          </button>
        </form>
      </div>
    </main>
  );
}
