"use client";

import {
  motion,
  MotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { Fragment, useEffect, useRef } from "react";

/**
 * Scrolling card field with a pinned headline.
 *  - Cards are spread across the whole (tall) section, so they scroll UP with
 *    the page while fresh ones keep entering from below. Each also drifts with
 *    the mouse (depth parallax).
 *  - The headline is pinned in the centre; line 1 fades out, then line 2 writes
 *    in letter-by-letter.
 */

const HEADLINE = "Creative Solutions";
const SUBTITLE = "visual content made to connect with the right audience";

type Card = {
  depth: number;
  top: string;
  left: string;
  img?: string; // present = real image; absent = grey placeholder
  video?: string; // present = video card: shows the poster, plays on hover
  poster?: string; // still shown over the video until hover
  taller?: boolean; // nudge this image card 4px taller so its art fits
  caption?: string; // hover panel text that slides out of the bottom
};

// fewer cards, spread across the full section height so they stream past the
// pinned text — the four real images keep their order (img1 → 3 → 6 → 8)
const CARDS: Card[] = [
  {
    top: "3%",
    left: "6%",
    depth: 30,
    video: "/video/lilylift-reel-eng-final.mp4",
    poster: "/gallery/Artboard%2013.jpg",
    caption: "AI Video Generation & AI-Powered Video Design",
  },
  { top: "9%", left: "72%", depth: 18 },
  { top: "16%", left: "40%", depth: 24 },
  {
    top: "22%",
    left: "calc(85% - 4px)",
    depth: 38,
    img: "/gallery/img12.png",
    taller: true,
    caption: "High-Converting Advertising Creatives",
  },
  {
    top: "29%",
    left: "12%",
    depth: 14,
    img: "/gallery/img14.jpg",
    caption: "Meta Ads Creatives & Campaign Assets",
  },
  { top: "35%", left: "62%", depth: 28 },
  {
    top: "42%",
    left: "80%",
    depth: 34,
    img: "/gallery/img6.jpg",
    caption: "AI Image Creation & Creative Editing",
  },
  { top: "48%", left: "28%", depth: 16 },
  {
    top: "55%",
    left: "6%",
    depth: 22,
    img: "/gallery/img11.jpg",
    caption: "Product Mock-up Creation",
  },
  {
    top: "61%",
    left: "54%",
    depth: 12,
    img: "/gallery/img8.jpg",
    caption: "Social Media & Marketing Content",
  },
  { top: "68%", left: "82%", depth: 26 },
];

export default function ParallaxGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const els = cardRefs.current;
    const state = CARDS.map((card, i) => ({
      el: els[i],
      depth: card.depth,
      cx: 0,
      cy: 0,
    }));

    let mx = 0;
    let my = 0;
    const intensity = 1;
    const smoothing = 0.06;

    const onMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onLeave = () => {
      mx = 0;
      my = 0;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    let raf = 0;
    const frame = () => {
      for (const c of state) {
        if (!c.el) continue;
        const tx = -mx * c.depth * intensity;
        const ty = -my * c.depth * intensity;
        c.cx += (tx - c.cx) * smoothing;
        c.cy += (ty - c.cy) * smoothing;
        c.el.style.transform = `translate3d(${c.cx.toFixed(2)}px, ${c.cy.toFixed(2)}px, 0)`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="service"
      className="relative h-[220vh] bg-black"
      aria-label="Exploration gallery"
    >
      {/* card field — fills the whole section, so it scrolls up with the page */}
      <div className="absolute inset-0">
        {CARDS.map((card, i) => {
          const isMedia = Boolean(card.img || card.video);
          return (
            <div
              key={i}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={`group absolute will-change-transform ${
                isMedia
                  ? card.taller
                    ? "h-[259px] w-[209px]"
                    : "h-[255px] w-[209px]"
                  : "h-[148px] w-[123px]"
              }`}
              style={{ top: card.top, left: card.left }}
              onMouseEnter={(e) => {
                const v = e.currentTarget.querySelector("video");
                if (v) v.play().catch(() => {});
              }}
              onMouseLeave={(e) => {
                const v = e.currentTarget.querySelector("video");
                if (v) {
                  v.pause();
                  v.currentTime = 0;
                }
              }}
            >
              {/* media tile (rounded, clips the image / video) */}
              <div className="relative h-full w-full overflow-hidden rounded-xl bg-neutral-800 shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
                {card.video ? (
                  <>
                    <video
                      src={card.video}
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    {card.poster && (
                      // poster shown until hover, then fades to reveal the video
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={card.poster}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                      />
                    )}
                  </>
                ) : card.img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={card.img}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>

              {/* hover caption — slides out of the bottom and grows in */}
              {isMedia && (
                <div className="pointer-events-none absolute inset-x-0 top-full z-20 mt-2 origin-top -translate-y-2 scale-y-90 rounded-xl border border-white/12 bg-neutral-900/95 px-3.5 py-3 text-center opacity-0 shadow-[0_16px_44px_rgba(0,0,0,0.55)] backdrop-blur-sm transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:scale-y-100 group-hover:opacity-100">
                  <p className="font-body text-[0.72rem] leading-snug text-white/85">
                    {card.caption ?? "Add hover text"}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* pinned headline — stays centred while the cards scroll past behind it */}
      <div className="pointer-events-none sticky top-0 z-30 flex h-screen items-center justify-center">
        {/* soft vignette keeps the text readable over the moving cards */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.25) 34%, transparent 60%)",
          }}
        />

        {/* single headline: letters write IN, hold, then write OUT — all while
            staying pinned dead-centre as the cards scroll past behind it */}
        <div className="relative z-10 w-[min(900px,90vw)] px-4 text-center">
          <AnimatedLine
            text={HEADLINE}
            progress={scrollYProgress}
            inStart={0.12}
            inEnd={0.4}
            outStart={0.62}
            outEnd={0.9}
            className="font-display text-[clamp(28px,4vw,46px)] font-light leading-[1.2] text-resort"
          />
          <AnimatedLine
            text={SUBTITLE}
            progress={scrollYProgress}
            inStart={0.2}
            inEnd={0.46}
            outStart={0.58}
            outEnd={0.86}
            className="mx-auto mt-4 block max-w-[34ch] font-body text-[clamp(13px,1.5vw,18px)] font-light leading-[1.4] text-resort/60"
          />
        </div>
      </div>
    </section>
  );
}

function AnimatedLine({
  text,
  progress,
  inStart,
  inEnd,
  outStart,
  outEnd,
  className,
}: {
  text: string;
  progress: MotionValue<number>;
  inStart: number;
  inEnd: number;
  outStart: number;
  outEnd: number;
  className: string;
}) {
  const lines = text.split("\n");
  const n = Math.max(text.replace(/\n/g, " ").length, 1);
  const inStep = (inEnd - inStart) / n;
  const outStep = (outEnd - outStart) / n;
  let index = 0;

  return (
    <span className={className} aria-label={text.replace(/\n/g, " ")}>
      {lines.map((line, lineIdx) => {
        const words = line.split(" ");
        const lineNode = (
          <span className="block">
            {words.map((word, wi) => {
              // letters of one word stay together so the word never breaks mid-way
              const wordNode = (
                <span className="inline-block whitespace-nowrap">
                  {Array.from(word).map((character, li) => {
                    const i = index;
                    index += 1;
                    return (
                      <Letter
                        key={li}
                        character={character}
                        progress={progress}
                        inStart={inStart + i * inStep}
                        inEnd={inStart + (i + 1.4) * inStep}
                        outStart={outStart + i * outStep}
                        outEnd={outStart + (i + 1.4) * outStep}
                      />
                    );
                  })}
                </span>
              );
              const isLastWord = wi === words.length - 1;
              if (!isLastWord) index += 1; // space between words
              return (
                <Fragment key={wi}>
                  {wordNode}
                  {isLastWord ? null : " "}
                </Fragment>
              );
            })}
          </span>
        );
        const isLastLine = lineIdx === lines.length - 1;
        if (!isLastLine) index += 1; // the line break counts like a space for timing
        return <Fragment key={lineIdx}>{lineNode}</Fragment>;
      })}
    </span>
  );
}

function Letter({
  character,
  progress,
  inStart,
  inEnd,
  outStart,
  outEnd,
}: {
  character: string;
  progress: MotionValue<number>;
  inStart: number;
  inEnd: number;
  outStart: number;
  outEnd: number;
}) {
  // one timeline per letter: fades/rises IN, holds, then rises/fades OUT
  const range = [inStart, inEnd, outStart, outEnd];
  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const y = useTransform(progress, range, [22, 0, 0, -22]);
  const blur = useTransform(progress, range, [8, 0, 0, 8]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);
  return (
    <motion.span
      aria-hidden="true"
      className="inline-block whitespace-pre"
      style={{ opacity, y, filter }}
    >
      {character}
    </motion.span>
  );
}
