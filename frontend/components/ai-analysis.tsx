"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Data } from "@/types/stats";
import ReactMarkdown from "react-markdown";
import { useOpenPanel } from "@openpanel/nextjs";

export default function AIAnalysis({ data }: { data: Data }) {
  const [analysis, setAnalysis] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const op = useOpenPanel();

  const handleGenerateAnalysis = async () => {
    op.track("ai_analysis_generate");
    setIsLoading(true);
    setError(null);
    setAnalysis("");

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to generate analysis");
      }
      const decoder = new TextDecoder();
      const reader = response.body?.getReader();

      if (!reader) {
        throw new Error("Failed to read response");
      }

      let accumulatedText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        accumulatedText += chunk;
        setAnalysis(accumulatedText);
      }
      op.track("ai_analysis_generated");
    } catch (err) {
      setError("Failed to generate AI analysis. Please try again.");
      console.error("Error generating AI analysis:", err);
      op.track("ai_analysis_failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-2 bg-black/50 backdrop-blur-sm border border-white/[0.08] rounded-lg p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold">Fun with AI</h2>
        <button
          onClick={handleGenerateAnalysis}
          disabled={isLoading}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 px-4 py-2 rounded-lg text-sm md:text-base"
        >
          <Sparkles className="w-4 h-4" />
          {isLoading ? "Generating..." : "Generate"}
        </button>
      </div>
      <div className="text-sm md:text-base text-muted-foreground">
        {error ? (
          <p className="text-red-400">{error}</p>
        ) : analysis ? (
          <div className="whitespace-pre-wrap text-white/80">
            <ReactMarkdown>{analysis}</ReactMarkdown>
          </div>
        ) : (
          "Click the button above to generate a fun analysis of your GitHub profile"
        )}
      </div>
    </div>
  );
}
