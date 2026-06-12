import { Category, StorageData } from "@/types";

const KEY = "karley-quiz-data";

const defaultData: StorageData = {
  bestStreak: 0,
  bestTimedScore: 0,
  totalStudied: 0,
  missedCardIds: [],
  missedCardCounts: {},
  categoryAccuracy: {
    Science: { correct: 0, total: 0 },
    Math: { correct: 0, total: 0 },
    "U.S. History": { correct: 0, total: 0 },
    Geography: { correct: 0, total: 0 },
    "Literature & Vocabulary": { correct: 0, total: 0 },
    "Arts & Music": { correct: 0, total: 0 },
  },
};

export function loadData(): StorageData {
  if (typeof window === "undefined") return defaultData;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(defaultData);
    const parsed = JSON.parse(raw) as Partial<StorageData>;
    return { ...structuredClone(defaultData), ...parsed };
  } catch {
    return structuredClone(defaultData);
  }
}

export function saveData(data: StorageData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function recordAnswer(
  questionId: number,
  category: Category,
  correct: boolean
): void {
  const data = loadData();
  data.totalStudied++;
  data.categoryAccuracy[category].total++;
  if (correct) {
    data.categoryAccuracy[category].correct++;
    // Track consecutive correct for missed-card clearing
    if (data.missedCardIds.includes(questionId)) {
      data.missedCardCounts[questionId] =
        (data.missedCardCounts[questionId] ?? 0) + 1;
      if (data.missedCardCounts[questionId] >= 2) {
        data.missedCardIds = data.missedCardIds.filter(
          (id) => id !== questionId
        );
        delete data.missedCardCounts[questionId];
      }
    }
  } else {
    if (!data.missedCardIds.includes(questionId)) {
      data.missedCardIds.push(questionId);
    }
    data.missedCardCounts[questionId] = 0;
  }
  saveData(data);
}

export function updateBestStreak(streak: number): void {
  const data = loadData();
  if (streak > data.bestStreak) {
    data.bestStreak = streak;
    saveData(data);
  }
}

export function updateBestTimedScore(score: number): void {
  const data = loadData();
  if (score > data.bestTimedScore) {
    data.bestTimedScore = score;
    saveData(data);
  }
}
