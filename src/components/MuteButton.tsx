"use client";

import { useEffect, useState } from "react";
import { getMuted, setMuted } from "@/lib/sounds";

export default function MuteButton() {
  const [muted, setMutedState] = useState(false);

  useEffect(() => {
    setMutedState(getMuted());
  }, []);

  function toggle() {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
  }

  return (
    <button
      onClick={toggle}
      title={muted ? "Unmute sounds" : "Mute sounds"}
      className="fixed bottom-4 right-4 z-40 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform active:scale-95"
    >
      {muted ? "🔇" : "🔊"}
    </button>
  );
}
