"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

/**
 * Services list. Hovering a row activates it: the row fills with the familiar
 * neutral grey and a softly rotated preview image eases in on the right,
 * poking slightly out past the card edges. Brand fonts only.
 */

type Service = { n: string; title: string; items: string[]; media: string };

const SERVICES: Service[] = [
  {
    n: "01",
    title: "Social Media",
    items: [
      "AI-generated Video design",
      "AI UGC & Performance Marketing Content",
      "AI Image Creation & Creative Editing",
      "AI-Powered Design Systems",
    ],
    media: "/gallery/img8.jpg",
  },
  {
    n: "02",
    title: "Meta Ads",
    items: [
      "Meta Ads Creatives & Campaign Assets",
      "Video and Static ads creation",
      "AI-powered Video ad features",
    ],
    media: "/gallery/img12.png",
  },
  {
    n: "03",
    title: "AI Development",
    items: [
      "AI Workflow Implementation",
      "AI Automation",
      "AI-powered products",
    ],
    media: "/gallery/img6.jpg",
  },
];

export default function ServicesList() {
  const [active, setActive] = useState(0);

  return (
    <section
      id="service"
      className="bg-black px-6 py-24 text-resort md:px-12 md:py-32"
      aria-label="Services"
    >
      <motion.div
        className="mx-auto max-w-[1120px]"
        initial={{ opacity: 0, y: 56 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* section header — same type sizes / weights / spacing as the Project section */}
        <div className="mb-16 md:mb-20">
          <h2 className="font-display text-[26px] font-medium uppercase leading-[1.3] text-white min-[1025px]:text-[56px] min-[1025px]:leading-[1.1]">
            How I Help Brands Grow
          </h2>
          <p className="mt-2.5 font-body font-light capitalize text-[16px] leading-[1.2] text-white/55 tracking-[0.02em] min-[1025px]:mt-7 min-[1025px]:text-[24px] min-[1025px]:leading-[1.35]">
            Helping brands grow through performance marketing and AI-powered
            systems.
          </p>
        </div>

        <div>
          {SERVICES.map((s, i) => {
            const on = active === i;
            return (
              <div
                key={s.n}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`relative grid cursor-pointer grid-cols-[auto_1fr] items-center gap-x-5 rounded-[1.6rem] border-t px-4 py-7 transition-colors duration-500 md:grid-cols-[auto_1.1fr_1.4fr] md:gap-x-8 md:px-9 md:py-9 md:pr-[210px] ${
                  on
                    ? "border-transparent bg-neutral-800"
                    : "border-resort/10"
                }`}
              >
                <span
                  className={`font-display text-lg transition-colors duration-500 ${
                    on ? "text-resort" : "text-stone"
                  }`}
                >
                  {s.n}
                </span>

                <h3
                  className={`font-display text-[20px] font-medium leading-[1.3] uppercase transition-colors duration-500 md:text-[32px] md:font-normal md:leading-tight ${
                    on ? "text-resort" : "text-stone"
                  }`}
                >
                  {s.title}
                </h3>

                <ul
                  className={`col-start-2 mt-3 font-body text-[14px] font-normal tracking-normal leading-[1.5] transition-colors duration-500 md:col-start-auto md:mt-0 md:block md:leading-relaxed ${
                    on ? "block" : "hidden"
                  } ${on ? "text-white/75" : "text-white/40"}`}
                >
                  {s.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>

                {/* softly rotated preview image — eases in on hover, poking out
                    past the card edges (top / bottom / right) */}
                <AnimatePresence>
                  {on && (
                    <motion.div
                      key={s.media}
                      initial={{ opacity: 0, scale: 0.82, rotate: -8, y: 12 }}
                      animate={{ opacity: 1, scale: 1, rotate: -5, y: 0 }}
                      exit={{ opacity: 0, scale: 0.88, rotate: -8 }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className="pointer-events-none absolute right-8 top-1/2 z-20 hidden h-[195px] w-[165px] -translate-y-1/2 overflow-hidden rounded-2xl border border-white/12 shadow-[0_24px_60px_rgba(0,0,0,0.6)] md:block"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.media}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
