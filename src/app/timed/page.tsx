"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { getQuestions, shuffle, CATEGORIES, DIFFICULTIES } from "@/lib/questions";
import { recordAnswer, updateBestTimedScore } from "@/lib/storage";
import { playCorrect, playMiss, playStreak, playTimerWarning } from "@/lib/sounds";
import FilterPanel from "@/components/FilterPanel";
import Confetti from "@/components/Confetti";
import { GameFilters, Question } from "@/types";

type TimerSetting = 10 | 20 | 30;

const QUESTION_COUNT = 10;

export default function TimedPage() {
  const [filters, setFilters] = useState<GameFilters>({
    categories: [],
    difficulties: [],
  });
  const [timerSetting, setTimerSetting] = useState<TimerSetting>(20);
  const [phase, setPhase] = useState<"setup" | "playing" | "done">("setup");
  const [deck, setDeck] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const available = useMemo(() => getQuestions(filters), [filters]);

  function startGame() {
    const qs = shuffle(available).slice(0, QUESTION_COUNT);
    setDeck(qs);
    setIndex(0);
    setResults([]);
    setRevealed(false);
    setTimeLeft(timerSetting);
    setPhase("playing");
  }

  const handleTimeout = useCallback(() => {
    if (deck[index]) {
      recordAnswer(deck[index].id, deck[index].category, false);
    }
    playMiss();
    setResults((r) => [...r, false]);
    advance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, deck]);

  const advance = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRevealed(false);
    setIndex((i) => i + 1);
    setTimeLeft(timerSetting);
  }, [timerSetting]);

  useEffect(() => {
    if (phase !== "playing") return;
    if (index >= QUESTION_COUNT) {
      setPhase("done");
      return;
    }
    if (revealed) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 4 && t > 1) playTimerWarning();
        if (t <= 1) {
          handleTimeout();
          return timerSetting;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, index, revealed, handleTimeout, timerSetting]);

  useEffect(() => {
    if (phase === "done") {
      const score = results.filter(Boolean).length;
      updateBestTimedScore(score);
      if (score === QUESTION_COUNT) {
        playStreak();
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
    }
  }, [phase, results]);

  function handleCorrect() {
    if (timerRef.current) clearInterval(timerRef.current);
    recordAnswer(deck[index].id, deck[index].category, true);
    playCorrect();
    setResults((r) => [...r, true]);
    advance();
  }

  function handleMiss() {
    if (timerRef.current) clearInterval(timerRef.current);
    recordAnswer(deck[index].id, deck[index].category, false);
    playMiss();
    setResults((r) => [...r, false]);
    advance();
  }

  function revealAnswer() {
    if (timerRef.current) clearInterval(timerRef.current);
    setRevealed(true);
  }

  if (phase === "setup") {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-extrabold text-orange-600">⏱️ Timed Challenge</h1>
        <FilterPanel filters={filters} onChange={setFilters} questionCount={available.length} />
        <div className="rounded-2xl bg-white/80 backdrop-blur p-4 shadow-md">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
            Time per question
          </p>
          <div className="flex gap-3">
            {([10, 20, 30] as TimerSetting[]).map((t) => (
              <button
                key={t}
                onClick={() => setTimerSetting(t)}
                className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all ${
                  timerSetting === t
                    ? "bg-orange-500 text-white shadow"
                    : "bg-gray-100 text-gray-500 hover:bg-orange-50"
                }`}
              >
                {t}s
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={startGame}
          disabled={available.length < QUESTION_COUNT}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xl font-bold rounded-2xl shadow transition-all active:scale-95"
        >
          {available.length < QUESTION_COUNT
            ? `Need at least ${QUESTION_COUNT} questions (have ${available.length})`
            : "Start Challenge!"}
        </button>
      </div>
    );
  }

  if (phase === "done") {
    const score = results.filter(Boolean).length;
    const perfect = score === QUESTION_COUNT;
    return (
      <div className="text-center space-y-6 py-8">
        <Confetti active={showConfetti} />
        <div className="text-6xl">{perfect ? "🏆" : score >= 7 ? "🌟" : "💪"}</div>
        <h2 className="text-3xl font-extrabold text-orange-600">
          {perfect ? "Perfect Score!" : "Time&apos;s Up!"}
        </h2>
        <p className="text-2xl font-bold text-gray-700">
          {score} / {QUESTION_COUNT} correct
        </p>
        <div className="flex gap-2 justify-center">
          {results.map((r, i) => (
            <span key={i} className={`text-2xl ${r ? "text-emerald-500" : "text-rose-400"}`}>
              {r ? "✓" : "✗"}
            </span>
          ))}
        </div>
        <div className="flex gap-4 justify-center">
          <button
            onClick={startGame}
            className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow text-lg transition-all active:scale-95"
          >
            Play Again
          </button>
          <button
            onClick={() => setPhase("setup")}
            className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-2xl shadow text-lg transition-all active:scale-95"
          >
            Change Settings
          </button>
        </div>
      </div>
    );
  }

  if (index >= deck.length) return null;
  const q = deck[index];
  const pct = (timeLeft / timerSetting) * 100;
  const urgent = timeLeft <= 5;

  return (
    <div className="space-y-4">
      <Confetti active={showConfetti} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-orange-600">⏱️ Timed Challenge</h1>
        <span className="text-sm font-bold text-gray-500">
          {index + 1} / {QUESTION_COUNT}
        </span>
      </div>

      {/* Countdown ring */}
      <div className="flex items-center justify-center">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="10" />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke={urgent ? "#f43f5e" : "#f97316"}
              strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - pct / 100)}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.3s" }}
            />
          </svg>
          <div
            className={`absolute inset-0 flex items-center justify-center text-3xl font-extrabold ${
              urgent ? "text-rose-500" : "text-orange-500"
            } ${urgent ? "animate-pulse" : ""}`}
          >
            {timeLeft}
          </div>
        </div>
      </div>

      {/* Question card */}
      <div className="rounded-3xl bg-gradient-to-br from-orange-400 to-amber-500 p-8 text-white shadow-xl min-h-48 flex flex-col items-center justify-center">
        <span className="text-xs font-bold uppercase tracking-widest opacity-75 mb-4">
          {q.category} · {q.difficulty}
        </span>
        <p className="text-2xl sm:text-3xl font-bold text-center leading-snug">
          {q.question}
        </p>
      </div>

      {!revealed ? (
        <button
          onClick={revealAnswer}
          className="w-full py-4 bg-white border-2 border-orange-300 hover:bg-orange-50 text-orange-600 font-bold text-lg rounded-2xl shadow transition-all active:scale-95"
        >
          Reveal Answer
        </button>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-6 text-center shadow">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Answer</p>
            <p className="text-3xl font-extrabold text-gray-800">{q.answer}</p>
            {q.alternates.length > 0 && (
              <p className="text-sm text-gray-400 mt-2">Also: {q.alternates.join(", ")}</p>
            )}
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleCorrect}
              className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg rounded-2xl shadow transition-all active:scale-95"
            >
              ✓ Got it!
            </button>
            <button
              onClick={handleMiss}
              className="flex-1 py-4 bg-rose-400 hover:bg-rose-500 text-white font-bold text-lg rounded-2xl shadow transition-all active:scale-95"
            >
              ✗ Missed it
            </button>
          </div>
        </div>
      )}

      {/* Previous results dots */}
      {results.length > 0 && (
        <div className="flex gap-2 justify-center mt-2">
          {results.map((r, i) => (
            <span key={i} className={`text-xl ${r ? "text-emerald-500" : "text-rose-400"}`}>
              {r ? "✓" : "✗"}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
