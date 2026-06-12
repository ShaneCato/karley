"use client";

import { useMemo, useState, useCallback } from "react";
import { getQuestions, shuffle, CATEGORIES, DIFFICULTIES } from "@/lib/questions";
import { loadData, recordAnswer, updateBestStreak } from "@/lib/storage";
import { playCorrect, playMiss, playStreak } from "@/lib/sounds";
import FlashCard from "@/components/FlashCard";
import FilterPanel from "@/components/FilterPanel";
import Confetti from "@/components/Confetti";
import { GameFilters, Question } from "@/types";

export default function StreakPage() {
  const [filters, setFilters] = useState<GameFilters>({
    categories: [],
    difficulties: [],
  });
  const [phase, setPhase] = useState<"setup" | "playing" | "dead">("setup");
  const [deck, setDeck] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestThisSession, setBestThisSession] = useState(0);
  const [allTimeBest, setAllTimeBest] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const available = useMemo(() => getQuestions(filters), [filters]);

  function startGame() {
    const data = loadData();
    setAllTimeBest(data.bestStreak);
    setDeck(shuffle(available));
    setIndex(0);
    setStreak(0);
    setBestThisSession(0);
    setPhase("playing");
    setShowConfetti(false);
  }

  const handleCorrect = useCallback(() => {
    const q = deck[index];
    recordAnswer(q.id, q.category, true);
    const newStreak = streak + 1;
    setStreak(newStreak);
    if (newStreak > bestThisSession) setBestThisSession(newStreak);
    updateBestStreak(newStreak);
    if (newStreak > allTimeBest) setAllTimeBest(newStreak);

    if (newStreak % 5 === 0) {
      playStreak();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
    } else {
      playCorrect();
    }

    if (index + 1 >= deck.length) {
      // Reshuffled deck — keep going!
      setDeck(shuffle(available));
      setIndex(0);
    } else {
      setIndex((i) => i + 1);
    }
  }, [deck, index, streak, bestThisSession, allTimeBest, available]);

  const handleMiss = useCallback(() => {
    const q = deck[index];
    recordAnswer(q.id, q.category, false);
    updateBestStreak(streak);
    playMiss();
    setPhase("dead");
  }, [deck, index, streak]);

  if (phase === "setup") {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-extrabold text-rose-600">🔥 Streak Mode</h1>
        <div className="rounded-2xl bg-white/80 p-4 shadow-md text-center">
          <p className="text-gray-500 text-sm font-medium">
            Answer correctly to keep the streak alive. One wrong answer ends the run!
          </p>
        </div>
        <FilterPanel filters={filters} onChange={setFilters} questionCount={available.length} />
        <button
          onClick={startGame}
          disabled={available.length === 0}
          className="w-full py-4 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white text-xl font-bold rounded-2xl shadow transition-all active:scale-95"
        >
          Start Streak!
        </button>
      </div>
    );
  }

  if (phase === "dead") {
    return (
      <div className="text-center space-y-6 py-10">
        <div className="text-6xl">💔</div>
        <h2 className="text-3xl font-extrabold text-rose-600">Streak Broken!</h2>
        <p className="text-xl text-gray-600">
          You got <strong>{streak}</strong> in a row!
        </p>
        {bestThisSession >= allTimeBest && bestThisSession > 0 && (
          <div className="rounded-2xl bg-yellow-100 border-2 border-yellow-300 p-4">
            <p className="text-yellow-800 font-bold text-lg">🏆 New all-time best: {bestThisSession}!</p>
          </div>
        )}
        <p className="text-gray-500">All-time best: {allTimeBest}</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={startGame}
            className="px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow text-lg transition-all active:scale-95"
          >
            Try Again!
          </button>
          <button
            onClick={() => setPhase("setup")}
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
        <h1 className="text-2xl font-extrabold text-rose-600">🔥 Streak Mode</h1>
        <div className="flex gap-4 text-sm font-bold">
          <span className="text-orange-500">🔥 {streak}</span>
          <span className="text-gray-400">Best: {allTimeBest}</span>
        </div>
      </div>
      {streak > 0 && streak % 5 === 0 && (
        <div className="text-center rounded-2xl bg-yellow-100 border-2 border-yellow-300 p-3 text-yellow-800 font-bold animate-bounce">
          🔥 {streak} in a row! Keep going!
        </div>
      )}
      <FlashCard question={q} onCorrect={handleCorrect} onMiss={handleMiss} />
    </div>
  );
}
