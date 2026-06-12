"use client";

import { useState, useMemo } from "react";
import { getQuestions, shuffle, CATEGORIES, DIFFICULTIES } from "@/lib/questions";
import { recordAnswer } from "@/lib/storage";
import { playCorrect, playMiss, playStreak } from "@/lib/sounds";
import FlashCard from "@/components/FlashCard";
import FilterPanel from "@/components/FilterPanel";
import Confetti from "@/components/Confetti";
import { GameFilters } from "@/types";

export default function StudyPage() {
  const [filters, setFilters] = useState<GameFilters>({
    categories: [],
    difficulties: [],
  });
  const [deck, setDeck] = useState<ReturnType<typeof getQuestions> | null>(null);
  const [index, setIndex] = useState(0);
  const [sessionStreak, setSessionStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const available = useMemo(() => getQuestions(filters), [filters]);

  function startDeck() {
    setDeck(shuffle(available));
    setIndex(0);
    setSessionStreak(0);
    setCorrect(0);
    setTotal(0);
  }

  function handleCorrect() {
    const q = deck![index];
    recordAnswer(q.id, q.category, true);
    const newStreak = sessionStreak + 1;
    setSessionStreak(newStreak);
    setCorrect((c) => c + 1);
    setTotal((t) => t + 1);
    if (newStreak > 0 && newStreak % 5 === 0) {
      playStreak();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      playCorrect();
    }
    next();
  }

  function handleMiss() {
    const q = deck![index];
    recordAnswer(q.id, q.category, false);
    setSessionStreak(0);
    setTotal((t) => t + 1);
    playMiss();
    next();
  }

  function next() {
    setIndex((i) => i + 1);
  }

  if (!deck) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-extrabold text-indigo-700">📖 Study Mode</h1>
        <FilterPanel filters={filters} onChange={setFilters} questionCount={available.length} />
        <button
          onClick={startDeck}
          disabled={available.length === 0}
          className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-xl font-bold rounded-2xl shadow transition-all active:scale-95"
        >
          Start Studying!
        </button>
      </div>
    );
  }

  if (index >= deck.length) {
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    const perfect = pct === 100 && total > 0;
    return (
      <div className="text-center space-y-6 py-10">
        <Confetti active={perfect} />
        <div className="text-6xl">{perfect ? "🏆" : pct >= 70 ? "🌟" : "💪"}</div>
        <h2 className="text-3xl font-extrabold text-indigo-700">
          {perfect ? "Perfect Round!" : "Nice work!"}
        </h2>
        <p className="text-xl text-gray-600">
          You got <strong>{correct}</strong> out of <strong>{total}</strong> correct ({pct}%)
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={startDeck}
            className="px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-2xl shadow text-lg transition-all active:scale-95"
          >
            Shuffle Again
          </button>
          <button
            onClick={() => setDeck(null)}
            className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-2xl shadow text-lg transition-all active:scale-95"
          >
            Change Filters
          </button>
        </div>
      </div>
    );
  }

  const q = deck[index];
  return (
    <div className="space-y-6">
      <Confetti active={showConfetti} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-indigo-700">📖 Study Mode</h1>
        <div className="text-sm font-bold text-gray-500">
          {index + 1} / {deck.length}
          {sessionStreak > 0 && (
            <span className="ml-3 text-orange-500">🔥 {sessionStreak}</span>
          )}
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-indigo-500 h-2 rounded-full transition-all"
          style={{ width: `${((index) / deck.length) * 100}%` }}
        />
      </div>
      <FlashCard question={q} onCorrect={handleCorrect} onMiss={handleMiss} />
    </div>
  );
}
