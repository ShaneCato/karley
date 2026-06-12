"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "🏠 Home" },
  { href: "/study", label: "📖 Study" },
  { href: "/timed", label: "⏱️ Timed" },
  { href: "/streak", label: "🔥 Streak" },
  { href: "/review", label: "🔁 Review" },
  { href: "/stats", label: "📊 Stats" },
];

export default function NavBar() {
  const path = usePathname();
  return (
    <nav className="bg-white/90 backdrop-blur sticky top-0 z-30 shadow-sm">
      <div className="max-w-3xl mx-auto px-4 py-2 flex flex-wrap gap-1 justify-center">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`px-3 py-2 rounded-xl text-sm font-bold transition-all ${
              path === href
                ? "bg-indigo-500 text-white shadow"
                : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
