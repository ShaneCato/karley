"use client";

let muted = false;

export function setMuted(val: boolean) {
  muted = val;
  if (typeof window !== "undefined") {
    localStorage.setItem("karley-muted", val ? "1" : "0");
  }
}

export function getMuted(): boolean {
  if (typeof window !== "undefined") {
    return localStorage.getItem("karley-muted") === "1";
  }
  return false;
}

function beep(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.3
) {
  if (muted) return;
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Web Audio not available
  }
}

export function playCorrect() {
  beep(523, 0.15);
  setTimeout(() => beep(659, 0.15), 120);
  setTimeout(() => beep(784, 0.2), 240);
}

export function playMiss() {
  beep(220, 0.3, "sawtooth", 0.2);
}

export function playFlip() {
  beep(400, 0.08, "sine", 0.15);
}

export function playStreak() {
  const notes = [523, 587, 659, 698, 784];
  notes.forEach((n, i) => setTimeout(() => beep(n, 0.12), i * 80));
}

export function playTimerWarning() {
  beep(440, 0.1, "square", 0.15);
}
