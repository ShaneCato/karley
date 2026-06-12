import allQuestions from "@/data/questions.json";
import { Category, Difficulty, GameFilters, Question } from "@/types";

export const CATEGORIES: Category[] = [
  "Science",
  "Math",
  "U.S. History",
  "Geography",
  "Literature & Vocabulary",
  "Arts & Music",
];

export const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

export function getQuestions(filters?: GameFilters): Question[] {
  let qs = allQuestions as Question[];
  if (filters?.categories && filters.categories.length > 0) {
    qs = qs.filter((q) => filters.categories.includes(q.category));
  }
  if (filters?.difficulties && filters.difficulties.length > 0) {
    qs = qs.filter((q) => filters.difficulties.includes(q.difficulty));
  }
  return qs;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function checkAnswer(userAnswer: string, question: Question): boolean {
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, "");
  const ua = normalize(userAnswer);
  const correct = [question.answer, ...question.alternates].map(normalize);
  return correct.some((c) => c === ua || c.includes(ua) || ua.includes(c));
}
