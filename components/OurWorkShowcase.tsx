"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

type Reel = {
  number: string;
  label: string;
  /** big-card title — use \n for a line break */
  title: string;
  video: string;
};

const REELS: Reel[] = [
  {
    number: "01",
    label: "Medical Scrubs",
    title: "Medical\nScrubs",
    video: "/video/reel-dubai.mp4",
  },
  {
    number: "02",
    label: "Beauty Tech",
    title: "Beauty\nTech",
    video: "/video/reel-fnb.mp4",
  },
  {
    number: "03",
    label: "Skincare",
    title: "Skincare",
    video: "/video/reel-skincare.mp4",
  },
  {
    number: "04",
    label: "Fashion",
    title: "Fashion",
    video: "/video/reel-fitness.mp4",
  },
];

export default function OurWorkShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0.08, 0.24], [0, 1], {
    clamp: true,
  });
  const y = useTransform(scrollYProgress, [0.08, 0.24], [96, 0], {
    clamp: true,
  });
  const cardScale = useTransform(scrollYProgress, [0.1, 0.32], [0.94, 1], {
    clamp: true,
  });

  const activeReel = REELS[active];
  const others = REELS.filter((_, i) => i !== active);

  return (
    <section
      ref={sectionRef}
      id="result"
      className="relative min-h-[125vh] overflow-hidden bg-black text-resort"
      aria-label="Results"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-32 h-32 bg-gradient-to-b from-transparent to-black"
      />

      <motion.div
        className="sticky top-0 z-10 flex min-h-screen items-center px-5 py-8 min-[1025px]:px-10 lg:px-12"
        style={{ opacity, y }}
      >
        <div className="mx-auto grid w-full max-w-[1320px] grid-cols-1 items-stretch gap-3 min-[1025px]:grid-cols-[auto_auto] min-[1025px]:justify-center min-[1025px]:gap-12">
          {/* Big featured card — shows the active reel */}
          <motion.article
            className="relative mx-auto aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-white/12 bg-neutral-950 min-[1025px]:aspect-auto min-[1025px]:h-full min-[1025px]:w-[400px]"
            style={{ scale: cardScale }}
          >
            <motion.video
              key={activeReel.video}
              src={activeReel.video}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45 }}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/78" />
            <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/18" />

            <div className="absolute left-7 top-5 flex items-center gap-3 font-body text-base font-semibold uppercase tracking-[0.2em] min-[1025px]:left-10 min-[1025px]:top-9 min-[1025px]:text-lg">
              <ReelIcon />
              <span>Reel</span>
              <span className="text-[#f4f2e4]">{activeReel.number}</span>
            </div>

            <div className="absolute inset-x-7 bottom-7 min-[1025px]:inset-x-10 min-[1025px]:bottom-9">
              <h2 className="font-display text-[clamp(1.6rem,6vw,2rem)] font-medium uppercase leading-[0.96] min-[1025px]:whitespace-nowrap min-[1025px]:text-[32px]">
                {activeReel.title.replace(/\n/g, " ")}
              </h2>
            </div>
          </motion.article>

          {/* Right column */}
          <div className="relative mx-auto flex w-full min-w-0 max-w-[560px] flex-col min-[1025px]:mx-0">
            <h2 className="mt-8 font-display text-[26px] font-medium uppercase leading-[1.3] text-white min-[1025px]:mt-0 min-[1025px]:text-[clamp(2.1rem,3.9vw,3.4rem)] min-[1025px]:leading-[1.1] min-[1025px]:whitespace-nowrap">
              Scroll-Stopping Ads.
              <br />
              Made To Convert.
            </h2>
            <p className="mt-2.5 max-w-[560px] font-body text-[16px] font-light leading-[1.2] text-white/55 tracking-[0.02em] min-[1025px]:mt-7 min-[1025px]:text-[clamp(1rem,1.35vw,1.25rem)] min-[1025px]:font-normal min-[1025px]:leading-[1.35]">
              Every ad is backed by strategy, creative direction, and
              optimization to turn attention into real business results.
            </p>

            <div className="mt-8 self-start">
              <a
                href="https://www.canva.com/design/DAHJ6ohD74E/HK2ZCnIs2hKbZAawFw28Cw/view?utm_content=DAHJ6ohD74E&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h62437ceb70#1"
                target="_blank"
                rel="noreferrer"
                title="Open Portfolio on Canva"
                className="inline-flex items-center gap-2.5 border-b border-resort/30 pb-1 font-body text-[14px] font-normal tracking-normal text-resort transition-colors hover:border-resort/60 hover:text-resort/80"
              >
                View Results
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/case-study/arrow-left.svg"
                  alt="arrow"
                  aria-hidden="true"
                  className="h-4 w-4 brightness-0 invert"
                />
              </a>
            </div>

            {/* Click a reel to swap it into the big card — a row of 3 on mobile
                (below the big card), a stacked column on desktop */}
            <div className="order-first grid grid-cols-3 gap-3 min-[1025px]:order-none min-[1025px]:mt-9 min-[1025px]:max-w-[330px] min-[1025px]:grid-cols-1">
              {others.map((reel, index) => (
                <SmallReel
                  key={reel.number}
                  reel={reel}
                  index={index}
                  onSelect={() => setActive(REELS.indexOf(reel))}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function SmallReel({
  reel,
  index,
  onSelect,
}: {
  reel: Reel;
  index: number;
  onSelect: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-label={`Show ${reel.label}`}
      className="group relative aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-2xl border border-white/18 bg-neutral-900 text-left transition-colors hover:border-white/45 min-[1025px]:aspect-[1.92] min-[1025px]:rounded-3xl"
      initial={{ opacity: 0, x: 42 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <video
        src={reel.video}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent min-[1025px]:bg-gradient-to-r min-[1025px]:from-black/65 min-[1025px]:via-black/18" />
      <div className="absolute left-3 top-3 font-body uppercase min-[1025px]:left-6 min-[1025px]:top-5">
        <p className="text-base font-bold leading-none text-[#f4f2e4] min-[1025px]:text-2xl">
          {reel.number}
        </p>
        <p className="mt-1 hidden text-[10px] font-bold leading-tight tracking-[0.2em] text-white min-[1025px]:mt-2 min-[1025px]:block min-[1025px]:text-sm">
          {reel.label}
        </p>
      </div>
      <div className="absolute bottom-3 left-3 min-[1025px]:bottom-5 min-[1025px]:left-6">
        <PlayButton />
      </div>
    </motion.button>
  );
}

function PlayButton({ large = false }: { large?: boolean }) {
  return (
    <span
      className={`grid place-items-center rounded-full border-2 border-[#f4f2e4] bg-black/18 text-white ${
        large
          ? "h-[4.5rem] w-[4.5rem] min-[1025px]:h-[5.5rem] min-[1025px]:w-[5.5rem]"
          : "h-9 w-9 min-[1025px]:h-12 min-[1025px]:w-12"
      }`}
      aria-hidden="true"
    >
      <span
        className={`ml-0.5 block h-0 w-0 border-y-transparent min-[1025px]:ml-1 ${
          large
            ? "border-y-[14px] border-l-[22px]"
            : "border-y-[6px] border-l-[10px] min-[1025px]:border-y-[9px] min-[1025px]:border-l-[15px]"
        } border-l-white`}
      />
    </span>
  );
}

function ReelIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M7 4v16M17 4v16M3 9h18" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="8.2" cy="7" r="1.1" fill="currentColor" />
      <circle cx="15.8" cy="7" r="1.1" fill="currentColor" />
    </svg>
  );
}
