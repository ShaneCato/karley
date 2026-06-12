"use client";

import { useEffect, useMemo, useState } from "react";
import { getQuestions, shuffle } from "@/lib/questions";
import { loadData, recordAnswer } from "@/lib/storage";
import { playCorrect, playMiss } from "@/lib/sounds";
import FlashCard from "@/components/FlashCard";
import { Question } from "@/types";

export default function ReviewPage() {
  const [missedIds, setMissedIds] = useState<number[]>([]);
  const [deck, setDeck] = useState<Question[] | null>(null);
  const [index, setIndex] = useState(0);
  const [cleared, setCleared] = useState(0);

  useEffect(() => {
    const data = loadData();
    setMissedIds(data.missedCardIds);
  }, []);

  const allQuestions = useMemo(() => getQuestions(), []);

  const missedQuestions = useMemo(
    () =>
      shuffle(
        allQuestions.filter((q) => missedIds.includes(q.id))
      ),
    [allQuestions, missedIds]
  );

  function startDeck() {
    setDeck(missedQuestions);
    setIndex(0);
    setCleared(0);
  }

  function handleCorrect() {
    const q = deck![index];
    recordAnswer(q.id, q.category, true);
    // Check if cleared from missed list now
    const fresh = loadData();
    if (!fresh.missedCardIds.includes(q.id)) {
      setCleared((c) => c + 1);
    }
    playCorrect();
    setIndex((i) => i + 1);
  }

  function handleMiss() {
    const q = deck![index];
    recordAnswer(q.id, q.category, false);
    playMiss();
    setIndex((i) => i + 1);
  }

  if (missedIds.length === 0) {
    return (
      <div className="text-center space-y-4 py-16">
        <div className="text-6xl">🎉</div>
        <h1 className="text-3xl font-extrabold text-purple-600">No Missed Cards!</h1>
        <p className="text-gray-500 text-lg">
          You haven&apos;t missed any cards yet — or you&apos;ve cleared them all!
        </p>
        <p className="text-gray-400 text-sm">
          Play Study Mode, Timed, or Streak to build your missed list.
        </p>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-extrabold text-purple-600">🔁 Review Missed</h1>
        <div className="rounded-2xl bg-white/80 p-6 shadow-md space-y-3">
          <p className="text-gray-700 text-lg font-semibold">
            You have <strong className="text-rose-500">{missedIds.length}</strong> missed card
            {missedIds.length !== 1 ? "s" : ""} to review.
          </p>
          <p className="text-gray-500 text-sm">
            Get a card right <strong>twice in a row</strong> to clear it from this list.
          </p>
        </div>
        <button
          onClick={startDeck}
          className="w-full py-4 bg-purple-500 hover:bg-purple-600 text-white text-xl font-bold rounded-2xl shadow transition-all active:scale-95"
        >
          Start Review!
        </button>
      </div>
    );
  }

  if (index >= deck.length) {
    return (
      <div className="text-center space-y-6 py-10">
        <div className="text-6xl">{cleared === deck.length ? "🏆" : "💪"}</div>
        <h2 className="text-3xl font-extrabold text-purple-600">
          {cleared > 0 ? `Cleared ${cleared} card${cleared !== 1 ? "s" : ""}!` : "Round done!"}
        </h2>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => {
              const data = loadData();
              setMissedIds(data.missedCardIds);
              setDeck(null);
            }}
            className="px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-2xl shadow text-lg transition-all active:scale-95"
          >
            Review Again
          </button>
        </div>
      </div>
    );
  }

  const q = deck[index];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-purple-600">🔁 Review Missed</h1>
        <span className="text-sm font-bold text-gray-500">
          {index + 1} / {deck.length}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-purple-500 h-2 rounded-full transition-all"
          style={{ width: `${(index / deck.length) * 100}%` }}
        />
      </div>
      <FlashCard question={q} onCorrect={handleCorrect} onMiss={handleMiss} />
    </div>
  );
}
