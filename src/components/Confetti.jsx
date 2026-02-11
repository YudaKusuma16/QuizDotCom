import { useEffect } from "react";
import confetti from "canvas-confetti";

// Confetti patterns
export const patterns = {
  burst: () => {
    const end = Date.now() + 1500;

    const colors = ["#6366f1", "#8b5cf6", "#a855f7", "#29AB00", "#f59e0b"];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  },

  sides: () => {
    const defaults = {
      origin: { y: 0.7 },
      colors: ["#6366f1", "#8b5cf6", "#a855f7", "#29AB00", "#f59e0b"],
    };

    const left = () => {
      confetti({
        ...defaults,
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
    };

    const right = () => {
      confetti({
        ...defaults,
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    };

    left();
    setTimeout(right, 250);
    setTimeout(left, 500);
    setTimeout(right, 750);
  },

  fireworks: () => {
    const duration = 3000;
    const end = Date.now() + duration;
    const colors = ["#6366f1", "#8b5cf6", "#a855f7", "#29AB00", "#f59e0b"];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: Math.random(), y: Math.random() * 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: Math.random(), y: Math.random() * 0.5 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  },

  rain: () => {
    const end = Date.now() + 2000;
    const colors = ["#6366f1", "#8b5cf6", "#a855f7", "#29AB00"];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 270,
        spread: 30,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: colors,
        gravity: 0.5,
        scalar: 0.8,
        drift: 1,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  },

  perfect: () => {
    // Special celebration for perfect score
    const end = Date.now() + 3000;
    const colors = ["#FFD700", "#FFA500", "#FF6347", "#6366f1", "#29AB00"];

    (function frame() {
      confetti({
        particleCount: 8,
        spread: 100,
        origin: { y: 0.6 },
        colors: colors,
        shapes: ["circle", "star"],
        scalar: 1.2,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  },
};

export default function Confetti({ pattern = "burst", trigger = true }) {
  useEffect(() => {
    if (trigger) {
      if (typeof pattern === "string") {
        patterns[pattern]?.();
      } else if (typeof pattern === "function") {
        pattern();
      }
    }
  }, [trigger, pattern]);

  return null; // This component doesn't render anything
}
