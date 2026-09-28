export const motionPresets = {
  slam: {
    initial: { scale: 1.18, rotate: -5, opacity: 0 },
    animate: { scale: 1, rotate: 0, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  },
  circle: {
    initial: { clipPath: "circle(0% at 75% 65%)" },
    animate: { clipPath: "circle(150% at 75% 65%)" },
    exit: { opacity: 0, scale: 1.04 },
  },
  wipe: {
    initial: { clipPath: "inset(0 100% 0 0)" },
    animate: { clipPath: "inset(0 0% 0 0)" },
    exit: { opacity: 0, x: -35 },
  },
  soft: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
};
export const timing = { transition: 0.7, hold: 220, swipe: 45, maxDelta: 100 };
