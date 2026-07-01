"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * A 3D "coverflow" hero carousel: a fanned row of portrait cards where the
 * center card is upright and large, and the neighbours recede on a perspective
 * rotation. Arrows, dots, card-clicks and arrow-keys all navigate.
 *
 * Content lives in SLIDES below — swap the image / title / subtitle freely.
 * Images are served from /public/carousel.
 */

type Slide = {
  id: string;
  image: string;
  /** small label over the active card (a category / brand kicker) */
  kicker: string;
  /** the big headline; use \n to break onto a second line */
  title: string;
  subtitle: string;
};

const SLIDES: Slide[] = [
  {
    id: "matcha",
    image: "/carousel/matcha.jpg",
    kicker: "B'Rave",
    title: "Matcha\nSupplier",
    subtitle: "Sourced for serious cafés",
  },
  {
    id: "padel",
    image: "/carousel/padel.jpg",
    kicker: "Hirostar",
    title: "Control\nor Power",
    subtitle: "Find the racket for your game",
  },
  {
    id: "valor",
    image: "/carousel/valor.jpg",
    kicker: "Valor",
    title: "Frozen\nin Focus",
    subtitle: "Engineered to stay cool",
  },
  {
    id: "diffuser",
    image: "/carousel/diffuser.jpg",
    kicker: "Lanaform",
    title: "Diffuser\n& Lamp",
    subtitle: "Calm for every summer night",
  },
  {
    id: "scrubs",
    image: "/carousel/scrubs.jpg",
    kicker: "Vitole",
    title: "Green\nScrubs",
    subtitle: "Designed for the long shift",
  },
];

export default function CoverflowHero() {
  const [active, setActive] = useState(2); // start on the middle card
  const count = SLIDES.length;

  const go = useCallback(
    (dir: number) => setActive((i) => (i + dir + count) % count),
    [count]
  );

  // Arrow-key navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  // Whisper-quiet parallax for the studio light — a few px of drift that
  // tracks the cursor, gentle enough not to tire the eye.
  const bgXSrc = useMotionValue(0);
  const bgYSrc = useMotionValue(0);
  const bgX = useSpring(bgXSrc, { stiffness: 35, damping: 22 });
  const bgY = useSpring(bgYSrc, { stiffness: 35, damping: 22 });

  const handleBgMove = (e: React.MouseEvent<HTMLElement>) => {
    const px = e.clientX / window.innerWidth - 0.5;
    const py = e.clientY / window.innerHeight - 0.5;
    bgXSrc.set(px * 12); // ±6px
    bgYSrc.set(py * 12);
  };

  return (
    <section
      onMouseMove={handleBgMove}
      className="relative flex min-h-screen flex-col overflow-hidden bg-black text-resort"
      aria-label="Featured work"
    >
      {/* Studio backdrop — black with a soft white light bloom behind the cards.
          The bloom drifts a few px with the cursor (subtle parallax). */}
      <motion.div
        style={{ x: bgX, y: bgY }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-[40%] h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-white/18 blur-[140px]" />
        <div className="absolute left-1/2 top-[36%] h-[46%] w-[40%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-white/22 blur-[90px]" />
      </motion.div>

      {/* Stage */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4">
        {/* Arrows */}
        <button
          aria-label="Previous"
          onClick={() => go(-1)}
          className="absolute left-3 z-30 grid h-12 w-12 place-items-center rounded-full border border-resort/25 text-resort/80 backdrop-blur-sm transition-all hover:border-resort/60 hover:text-resort md:left-10"
        >
          <Chevron dir="left" />
        </button>
        <button
          aria-label="Next"
          onClick={() => go(1)}
          className="absolute right-3 z-30 grid h-12 w-12 place-items-center rounded-full border border-resort/25 text-resort/80 backdrop-blur-sm transition-all hover:border-resort/60 hover:text-resort md:right-10"
        >
          <Chevron dir="right" />
        </button>

        {/* The fanned cards, laid out in 3D space */}
        <div
          className="relative h-[560px] w-full max-w-6xl md:h-[700px]"
          style={{ perspective: "1600px" }}
        >
          {SLIDES.map((slide, i) => (
            <Card
              key={slide.id}
              slide={slide}
              offset={shortestOffset(i, active, count)}
              isActive={i === active}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Layout tuning — cards spaced fully apart and angled INWARD toward the centre.
const STEP_PX = 300; // fixed horizontal gap between card centres, in px (> card width = no overlap)
const SIDE_ANGLE = 30; // degrees each side card turns to face the centre
const HOVER_TILT = 9; // max degrees the centre card dips under the cursor (both axes)
const GLOW_SIZE = 560; // diameter (px) of the white light that follows the cursor

/** One card, positioned by its signed distance from the active card. */
function Card({
  slide,
  offset,
  isActive,
  onClick,
}: {
  slide: Slide;
  offset: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const abs = Math.abs(offset);
  const hidden = abs > 2; // only show 2 cards on each side

  // rotateX / rotateY are their own springs so the centre card can follow the
  // cursor on hover (both axes) without fighting the positional animation below.
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 90, damping: 20 });
  const rotateY = useSpring(tiltY, { stiffness: 90, damping: 20 });
  const [hovering, setHovering] = useState(false);

  // Resting angle: 0 for the centre card; neighbours turn INWARD to face the
  // centre (negative sign = right cards lean left, left cards lean right).
  const restAngle = isActive ? 0 : -offset * SIDE_ANGLE;

  useEffect(() => {
    if (!(isActive && hovering)) {
      tiltY.set(restAngle);
      tiltX.set(0);
    }
  }, [isActive, hovering, restAngle, tiltX, tiltY]);

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 … 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 … 0.5
    // Press model: the point under the cursor dips down/forward toward the viewer.
    tiltY.set(px * 2 * HOVER_TILT);
    tiltX.set(py * 2 * HOVER_TILT);
  };

  const scale = isActive ? 1 : abs === 1 ? 0.9 : 0.78;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false);
        tiltY.set(restAngle);
        tiltX.set(0);
      }}
      onMouseMove={handleMove}
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
      className="absolute left-1/2 top-1/2 h-full w-[270px] origin-center md:w-[320px]"
      initial={false}
      animate={{
        x: `calc(-50% + ${offset * STEP_PX}px)`,
        y: "-50%",
        scale,
        opacity: hidden ? 0 : 1,
        zIndex: 10 - abs,
        // all cards stay sharp; side cards are only dimmed for depth
        filter: isActive ? "brightness(1)" : "brightness(0.65)",
      }}
      transition={{ type: "tween", duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
        cursor: isActive ? "default" : "pointer",
      }}
    >
      {/* Card face — top portion of the button; reflection occupies the rest. */}
      <div className="absolute inset-x-0 top-0 h-[80%] overflow-hidden rounded-2xl">
        <Image
          src={slide.image}
          alt={slide.title.replace("\n", " ")}
          fill
          sizes="320px"
          className="object-cover"
        />
        {/* darken inactive cards a touch more */}
        <span
          className={`pointer-events-none absolute inset-0 ${
            isActive ? "bg-black/10" : "bg-black/30"
          }`}
        />
        {isActive && (
          <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-resort/15" />
        )}
      </div>

      {/* Floor reflection — lives inside the 3D button, so it keeps each card's
          perspective. Flipped vertically and faded out toward the ground. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[80%] h-[20%] overflow-hidden rounded-b-2xl"
        style={{
          transform: "scaleY(-1)",
          maskImage:
            "linear-gradient(to top, rgba(0,0,0,0.45), transparent 78%)",
          WebkitMaskImage:
            "linear-gradient(to top, rgba(0,0,0,0.45), transparent 78%)",
        }}
      >
        <Image
          src={slide.image}
          alt=""
          fill
          sizes="320px"
          className="object-cover object-bottom"
        />
      </div>
    </motion.button>
  );
}

/** Wrap-around offset so the fan stays balanced as you loop past the ends. */
function shortestOffset(i: number, active: number, count: number) {
  let d = i - active;
  if (d > count / 2) d -= count;
  if (d < -count / 2) d += count;
  return d;
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: dir === "right" ? "rotate(180deg)" : undefined }}
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
