# Karley's Quiz Practice

A quiz-bowl flash-card game for 5th graders. Built with Next.js (App Router) + Tailwind CSS.  
Fully static — no backend, no accounts. Deploys to Vercel in one click.

---

## Getting Started

```bash
npm install
npm run dev        # dev server at http://localhost:3000
npm run build      # production build → ./out/
```

---

## Game Modes

| Mode | Description |
|------|-------------|
| **Study Mode** | Flip cards at your own pace; self-grade with Got it / Missed it |
| **Timed Challenge** | 10 questions with a configurable countdown (10 / 20 / 30 s) |
| **Streak Mode** | Sudden death — keep answering until you miss one |
| **Review Missed** | Replays only cards you've missed; clears after 2 consecutive correct |
| **Stats** | Accuracy by category, best streak, best timed score |

---

## Adding / Editing Questions

**`src/data/questions.json`** is the single source of truth.

Each entry follows this shape:

```json
{
  "id": 301,
  "category": "Science",
  "difficulty": "medium",
  "question": "What is the chemical formula for table salt?",
  "answer": "NaCl",
  "alternates": ["sodium chloride"]
}
```

| Field | Type | Notes |
|-------|------|-------|
| `id` | `number` | Must be unique across all questions |
| `category` | `string` | Must be one of the six categories below |
| `difficulty` | `"easy"` \| `"medium"` \| `"hard"` | |
| `question` | `string` | The question text shown on the card |
| `answer` | `string` | The primary (canonical) answer |
| `alternates` | `string[]` | Other accepted answers (can be `[]`) |

### Valid Categories

- `Science`
- `Math`
- `U.S. History`
- `Geography`
- `Literature & Vocabulary`
- `Arts & Music`

### Answer Matching

Answers are matched case-insensitively with punctuation stripped. A user's response
is accepted if it exactly matches (or contains / is contained by) the canonical answer
or any alternate. Add common abbreviations or alternate spellings to `alternates`.

---

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import the repo in the Vercel dashboard — no extra settings needed.
3. Vercel detects Next.js automatically and uses `output: "export"` for a fully static site.

---

## Privacy

The site uses only the name **"Karley's Quiz Practice"** — no last name, school name,
photos, or personal details appear anywhere on the site.  
All progress data is stored in `localStorage` only — nothing is sent to any server.
