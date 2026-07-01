"use client";

import { motion, type Variants } from "framer-motion";

/**
 * Industries / services ticker — a continuous horizontal marquee.
 * Two identical rows scroll left; at -50% the second row sits exactly where the
 * first began, so the loop is seamless. On first view the words write in
 * letter-by-letter. Pauses for prefers-reduced-motion.
 */

const WORDS = [
  "Healthcare",
  "Tech",
  "Finance",
  "Real Estate",
  "Construction",
  "Retail & E-Commerce",
  "Food & Beverage",
  "Hospitality & Travel",
  "Education",
  "Manufacturing & Industrial",
  "Agriculture & Sustainability",
  "Entertainment",
  "Beauty & Lifestyle",
  "Nonprofit",
  "Sports",
  "B2B",
  "Art",
  "Cryptocurrency",
  "Digital Marketing",
];

const rowV: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};
const wordV: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.018 } },
};
const charV: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};

function Row({ ariaHidden }: { ariaHidden: boolean }) {
  return (
    <motion.div
      className="flex shrink-0 items-center"
      aria-hidden={ariaHidden}
      variants={rowV}
      initial="hidden"
      animate="show"
    >
      {WORDS.map((word) => (
        <motion.span key={word} className="flex items-center" variants={wordV}>
          <span className="flex whitespace-nowrap font-display text-[20px] font-medium uppercase leading-[1.3] tracking-wide text-resort md:text-[32px]">
            {Array.from(word).map((ch, i) => (
              <motion.span
                key={i}
                variants={charV}
                className="inline-block whitespace-pre"
              >
                {ch}
              </motion.span>
            ))}
          </span>
          <motion.span
            variants={charV}
            className="mx-6 text-xl text-resort/70 md:mx-8 md:text-2xl"
          >
            &bull;
          </motion.span>
        </motion.span>
      ))}
    </motion.div>
  );
}

export default function IndustryMarquee() {
  return (
    <section
      className="relative overflow-hidden border-y border-resort/10 bg-black py-9 md:py-14"
      aria-label="What we do"
    >
      {/* soft fade on the edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to right, #000 0%, transparent 12%, transparent 88%, #000 100%)",
        }}
      />

      <div className="flex w-max animate-marquee">
        <Row ariaHidden={false} />
        <Row ariaHidden={true} />
      </div>
    </section>
  );
}
