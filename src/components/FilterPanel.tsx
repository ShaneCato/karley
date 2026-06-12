"use client";

import { CATEGORIES, DIFFICULTIES } from "@/lib/questions";
import { Category, Difficulty, GameFilters } from "@/types";

const CATEGORY_COLORS: Record<Category, string> = {
  Science: "bg-green-100 text-green-800 border-green-300",
  Math: "bg-blue-100 text-blue-800 border-blue-300",
  "U.S. History": "bg-red-100 text-red-800 border-red-300",
  Geography: "bg-yellow-100 text-yellow-800 border-yellow-300",
  "Literature & Vocabulary": "bg-purple-100 text-purple-800 border-purple-300",
  "Arts & Music": "bg-pink-100 text-pink-800 border-pink-300",
};

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: "bg-emerald-100 text-emerald-800 border-emerald-300",
  medium: "bg-orange-100 text-orange-800 border-orange-300",
  hard: "bg-rose-100 text-rose-800 border-rose-300",
};

interface Props {
  filters: GameFilters;
  onChange: (f: GameFilters) => void;
  questionCount: number;
}

export default function FilterPanel({ filters, onChange, questionCount }: Props) {
  function toggleCategory(cat: Category) {
    const current = filters.categories;
    const next = current.includes(cat)
      ? current.filter((c) => c !== cat)
      : [...current, cat];
    onChange({ ...filters, categories: next });
  }

  function toggleDifficulty(d: Difficulty) {
    const current = filters.difficulties;
    const next = current.includes(d)
      ? current.filter((x) => x !== d)
      : [...current, d];
    onChange({ ...filters, difficulties: next });
  }

  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur p-4 shadow-md space-y-4">
      <div>
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
          Categories
        </p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const active = filters.categories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-3 py-1 rounded-full border-2 text-sm font-semibold transition-all ${
                  active
                    ? CATEGORY_COLORS[cat]
                    : "bg-gray-100 text-gray-400 border-gray-200"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
          Difficulty
        </p>
        <div className="flex gap-2">
          {DIFFICULTIES.map((d) => {
            const active = filters.difficulties.includes(d);
            return (
              <button
                key={d}
                onClick={() => toggleDifficulty(d)}
                className={`px-3 py-1 rounded-full border-2 text-sm font-semibold capitalize transition-all ${
                  active
                    ? DIFFICULTY_COLORS[d]
                    : "bg-gray-100 text-gray-400 border-gray-200"
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>
      <p className="text-sm text-gray-500 font-medium">
        {questionCount} question{questionCount !== 1 ? "s" : ""} available
      </p>
    </div>
  );
}
