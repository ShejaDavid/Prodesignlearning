"use client";

import { motion, useReducedMotion } from "framer-motion";

// Scroll-reveal wrapper for grid cards: fades + rises + eases in with a slight
// scale, staggered by index, and lifts on hover. Falls back to a plain, static
// container when the visitor prefers reduced motion.
export function RevealCard({
  children,
  index = 0,
}: {
  children: React.ReactNode;
  index?: number;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className="h-full">{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 36, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}
