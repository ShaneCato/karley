import Link from "next/link";

const modes = [
  {
    href: "/study",
    emoji: "📖",
    label: "Study Mode",
    desc: "Flip cards at your own pace. Mark each one right or wrong.",
    color: "from-indigo-400 to-blue-500",
  },
  {
    href: "/timed",
    emoji: "⏱️",
    label: "Timed Challenge",
    desc: "10 questions, countdown clock, see your score at the end!",
    color: "from-orange-400 to-amber-500",
  },
  {
    href: "/streak",
    emoji: "🔥",
    label: "Streak Mode",
    desc: "Sudden death — keep going until you miss one. Beat your best!",
    color: "from-rose-400 to-pink-500",
  },
  {
    href: "/review",
    emoji: "🔁",
    label: "Review Missed",
    desc: "Only the cards you've missed. Clear them by getting them right twice.",
    color: "from-purple-400 to-violet-500",
  },
  {
    href: "/stats",
    emoji: "📊",
    label: "My Stats",
    desc: "See your accuracy by category and track your progress.",
    color: "from-teal-400 to-green-500",
  },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center py-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-700 mb-2">
          Karley&apos;s Quiz Practice 🌟
        </h1>
        <p className="text-gray-500 text-lg font-medium">
          Quiz Bowl Flash Cards — Pick a mode to get started!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {modes.map(({ href, emoji, label, desc, color }) => (
          <Link
            key={href}
            href={href}
            className={`group block rounded-3xl bg-gradient-to-br ${color} p-6 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all duration-200`}
          >
            <div className="text-4xl mb-3">{emoji}</div>
            <h2 className="text-xl font-extrabold mb-1">{label}</h2>
            <p className="text-sm opacity-90 font-medium">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
