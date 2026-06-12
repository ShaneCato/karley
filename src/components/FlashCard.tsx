"use client";

import { Category, Question } from "@/types";
import { useEffect, useState } from "react";
import { playFlip } from "@/lib/sounds";

const CATEGORY_BG: Record<Category, string> = {
  Science: "from-green-400 to-emerald-500",
  Math: "from-blue-400 to-indigo-500",
  "U.S. History": "from-red-400 to-rose-500",
  Geography: "from-yellow-400 to-amber-500",
  "Literature & Vocabulary": "from-purple-400 to-violet-500",
  "Arts & Music": "from-pink-400 to-fuchsia-500",
};

interface Props {
  question: Question;
  onCorrect?: () => void;
  onMiss?: () => void;
  extraBack?: React.ReactNode;
}

export default function FlashCard({
  question,
  onCorrect,
  onMiss,
  extraBack,
}: Props) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
  }, [question.id]);

  function flip() {
    setFlipped((f) => !f);
    playFlip();
  }

  return (
    <div className="w-full max-w-2xl mx-auto" style={{ perspective: "1000px" }}>
      <div
        className="relative w-full cursor-pointer"
        style={{
          height: "clamp(280px, 40vw, 400px)",
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        onClick={!flipped ? flip : undefined}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 rounded-3xl shadow-xl bg-gradient-to-br ${CATEGORY_BG[question.category]} flex flex-col items-center justify-center p-8 text-white`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-xs font-bold uppercase tracking-widest opacity-75 mb-4">
            {question.category} · {question.difficulty}
          </span>
          <p className="text-2xl sm:text-3xl font-bold text-center leading-snug">
            {question.question}
          </p>
          <span className="mt-6 text-sm opacity-60 font-medium">
            Tap to reveal answer
          </span>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-3xl shadow-xl bg-white flex flex-col items-center justify-center p-8"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
            Answer
          </span>
          <p className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800">
            {question.answer}
          </p>
          {question.alternates.length > 0 && (
            <p className="mt-3 text-sm text-gray-400 text-center">
              Also accepted: {question.alternates.join(", ")}
            </p>
          )}
          {extraBack}
          {(onCorrect || onMiss) && (
            <div className="flex gap-4 mt-6">
              {onCorrect && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCorrect();
                  }}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold rounded-2xl text-lg shadow transition-all"
                >
                  ✓ Got it!
                </button>
              )}
              {onMiss && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMiss();
                  }}
                  className="px-6 py-3 bg-rose-400 hover:bg-rose-500 active:scale-95 text-white font-bold rounded-2xl text-lg shadow transition-all"
                >
                  ✗ Missed it
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
