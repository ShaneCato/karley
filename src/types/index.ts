export type Difficulty = "easy" | "medium" | "hard";

export type Category =
  | "Science"
  | "Math"
  | "U.S. History"
  | "Geography"
  | "Literature & Vocabulary"
  | "Arts & Music";

export interface Question {
  id: number;
  category: Category;
  difficulty: Difficulty;
  question: string;
  answer: string;
  alternates: string[];
}

export interface GameFilters {
  categories: Category[];
  difficulties: Difficulty[];
}

export interface StorageData {
  bestStreak: number;
  bestTimedScore: number;
  totalStudied: number;
  missedCardIds: number[];
  missedCardCounts: Record<number, number>; // id -> consecutive correct count
  categoryAccuracy: Record<Category, { correct: number; total: number }>;
}
