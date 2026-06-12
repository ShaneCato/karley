"use client";

import { useEffect, useState } from "react";
import { loadData } from "@/lib/storage";
import { CATEGORIES } from "@/lib/questions";
import { Category, StorageData } from "@/types";

const CATEGORY_COLORS: Record<Category, string> = {
  Science: "bg-green-400",
  Math: "bg-blue-400",
  "U.S. History": "bg-red-400",
  Geography: "bg-yellow-400",
  "Literature & Vocabulary": "bg-purple-400",
  "Arts & Music": "bg-pink-400",
};

export default function StatsPage() {
  const [data, setData] = useState<StorageData | null>(null);

  useEffect(() => {
    setData(loadData());
  }, []);

  if (!data) return null;

  const total = data.totalStudied;
  const overall =
    total > 0
      ? Math.round(
          (CATEGORIES.reduce(
            (sum, cat) => sum + data.categoryAccuracy[cat].correct,
            0
          ) /
            CATEGORIES.reduce(
              (sum, cat) => sum + data.categoryAccuracy[cat].total,
              0
            )) *
            100
        )
      : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-teal-600">📊 My Stats</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Cards Studied", value: total, color: "bg-indigo-100 text-indigo-700" },
          { label: "Overall Accuracy", value: `${isNaN(overall) ? 0 : overall}%`, color: "bg-teal-100 text-teal-700" },
          { label: "Best Streak", value: data.bestStreak, color: "bg-rose-100 text-rose-700" },
          { label: "Best Timed Score", value: `${data.bestTimedScore}/10`, color: "bg-orange-100 text-orange-700" },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-2xl p-4 ${color} text-center`}>
            <p className="text-2xl font-extrabold">{value}</p>
            <p className="text-xs font-bold mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Missed cards count */}
      <div className="rounded-2xl bg-white/80 p-4 shadow-md flex items-center justify-between">
        <div>
          <p className="font-bold text-gray-700">Missed Cards Queue</p>
          <p className="text-sm text-gray-400">Cards waiting in Review Mode</p>
        </div>
        <span className="text-3xl font-extrabold text-rose-500">{data.missedCardIds.length}</span>
      </div>

      {/* Category breakdown */}
      <div className="space-y-3">
        <h2 className="font-extrabold text-gray-700 text-lg">Accuracy by Category</h2>
        {CATEGORIES.map((cat) => {
          const { correct, total: t } = data.categoryAccuracy[cat];
          const pct = t > 0 ? Math.round((correct / t) * 100) : null;
          return (
            <div key={cat} className="rounded-2xl bg-white/80 p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-700 text-sm">{cat}</span>
                <span className="text-sm font-bold text-gray-500">
                  {pct !== null ? `${correct}/${t} (${pct}%)` : "Not studied yet"}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${CATEGORY_COLORS[cat]}`}
                  style={{ width: pct !== null ? `${pct}%` : "0%" }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => {
          if (confirm("Reset all stats and progress? This cannot be undone.")) {
            localStorage.removeItem("karley-quiz-data");
            setData(loadData());
          }
        }}
        className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-500 font-bold rounded-2xl transition-all text-sm"
      >
        Reset All Progress
      </button>
    </div>
  );
}
