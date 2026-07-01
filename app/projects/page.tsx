"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import SiteHeader from "@/components/SiteHeader";

/**
 * /projects — the full portfolio.
 * Two clearly separated bodies of work: motion (video) and visual (image).
 * Same brand language as the home page (umbra/resort, PetrovSans) with small,
 * tasteful motion: staggered reveals on scroll, hover zoom, sliding labels.
 */

type Video = {
  src: string;
  title: string;
  tag: string;
  n: string;
  /** optional still that covers the card while idle (B&W), fading on hover */
  cover?: string;
};
type Visual = {
  src: string;
  tag: string;
  n: string;
  sub?: string;
  /** "contain" shows the whole poster (no edge crop) instead of filling */
  fit?: "contain";
};

const VIDEOS: Video[] = [
  { src: "/video/reel-dubai.mp4", title: "Video for Vitole", tag: "Health", n: "01", cover: "/gallery/img15.png" },
  { src: "/video/reel-fnb.mp4", title: "Reel/Story for Valor", tag: "Skincare", n: "02" },
  { src: "/video/reel-skincare.mp4", title: "Reel/Story for Valor", tag: "Skincare", n: "03" },
  { src: "/video/reel-fitness.mp4", title: "Ads for an Agency", tag: "Digital Marketing", n: "04" },
  { src: "/video/tolaab.mp4", title: "Video for Tolaab", tag: "Training", n: "05" },
];

const VISUALS: Visual[] = [
  { src: "/gallery/img1.jpg", sub: "Skincare", tag: "Product image for Valor", n: "01" },
  { src: "/gallery/img2.jpg", sub: "Wellness", tag: "Product image for B'Rave", n: "02" },
  { src: "/gallery/img3.jpg", sub: "Sport", tag: "Product image for Hirostar", n: "03" },
  { src: "/gallery/img4.jpg", sub: "Health", tag: "Poster for Vitole", n: "04" },
  { src: "/gallery/img5.jpg", sub: "Medical", tag: "Story for Vitole", n: "05" },
  { src: "/gallery/img6.jpg", sub: "Digital marketing", tag: "Instagram Reel", n: "06" },
  { src: "/gallery/img7.jpg", sub: "Health", tag: "Poster for Vitole", n: "07" },
  { src: "/gallery/img8.jpg", sub: "Food", tag: "Poster for Pure Plate", n: "08" },
  { src: "/gallery/img9.jpg", sub: "Beauty", tag: "Story for Vitole", n: "09" },
  { src: "/gallery/img10.jpg", sub: "Skincare", tag: "Story for Valor", n: "10" },
  { src: "/gallery/img11.jpg", sub: "Skincare", tag: "Product image for valor", n: "11" },
  { src: "/gallery/15.png", sub: "Real estate", tag: "marketing image for Azcension", n: "12" },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/** which gallery + which item is open in the lightbox */
type Active = { kind: "video" | "image"; index: number };

/** how many static cards show before "Load More" */
const VISUALS_PER_PAGE = 8;

export default function ProjectsPage() {
  const [active, setActive] = useState<Active | null>(null);
  const [visualsExpanded, setVisualsExpanded] = useState(false);
  const shownVisuals = visualsExpanded
    ? VISUALS
    : VISUALS.slice(0, VISUALS_PER_PAGE);

  // move forward/back within the open gallery, wrapping around the ends
  const step = useCallback((dir: number) => {
    setActive((a) => {
      if (!a) return a;
      const len = a.kind === "video" ? VIDEOS.length : VISUALS.length;
      return { ...a, index: (a.index + dir + len) % len };
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  return (
    <main className="min-h-screen bg-black text-resort">
      <SiteHeader />
      <Hero />

      <Section
        id="video"
        title="Video Projects"
        count={VIDEOS.length}
        blurb="A selection of videos crafted to capture attention and deliver results."
      >
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-4"
        >
          {VIDEOS.map((v, i) => (
            <VideoCard
              key={v.src}
              video={v}
              onOpen={() => setActive({ kind: "video", index: i })}
            />
          ))}
        </motion.div>
      </Section>

      <Section
        id="visual"
        title="Static Projects"
        count={VISUALS.length}
        blurb="Brand imagery, product shots and campaign keyframes."
      >
        {/* each card animates on its OWN mount (not via a staggered container
            or whileInView) — so cards added by "Load More" reliably fade in
            while the first 8 are left untouched (no re-flash) */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {shownVisuals.map((v, i) => (
            <VisualCard
              key={v.src}
              visual={v}
              onOpen={() => setActive({ kind: "image", index: i })}
            />
          ))}
        </div>

        {VISUALS.length > VISUALS_PER_PAGE && (
          <div className="mt-10 flex justify-center md:mt-12">
            <button
              type="button"
              onClick={() => setVisualsExpanded((v) => !v)}
              className="group inline-flex items-center gap-2.5 border-b border-resort/30 pb-1 font-body text-sm text-resort transition-colors hover:border-resort/60 hover:text-resort/80"
            >
              Load More
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className={`h-4 w-4 transition-transform duration-300 ${
                  visualsExpanded
                    ? "rotate-180"
                    : "group-hover:translate-y-0.5"
                }`}
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
      </Section>

      <Lightbox
        active={active}
        onClose={() => setActive(null)}
        onPrev={() => step(-1)}
        onNext={() => step(1)}
      />
    </main>
  );
}

function Hero() {
  return (
    <section className="px-6 pb-12 pt-[56px] md:px-12 md:pb-16 md:pt-[92px]">
      <div className="mt-[36px] md:mt-[20px] mb-[36px]">
        <Link
          href="/"
          className="group inline-flex items-center gap-[12px] font-body text-[14px] font-normal tracking-normal text-white transition-colors hover:text-white"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
            style={{ transform: "scaleX(-1)" }}
          >
            <path
              d="M14.4301 18.82C14.2401 18.82 14.0501 18.75 13.9001 18.6C13.6101 18.31 13.6101 17.83 13.9001 17.54L19.4401 12L13.9001 6.46C13.6101 6.17 13.6101 5.69 13.9001 5.4C14.1901 5.11 14.6701 5.11 14.9601 5.4L21.0301 11.47C21.3201 11.76 21.3201 12.24 21.0301 12.53L14.9601 18.6C14.8101 18.75 14.6201 18.82 14.4301 18.82Z"
              fill="currentColor"
            />
            <path
              d="M20.33 12.75H3.5C3.09 12.75 2.75 12.41 2.75 12C2.75 11.59 3.09 11.25 3.5 11.25H20.33C20.74 11.25 21.08 11.59 21.08 12C21.08 12.41 20.74 12.75 20.33 12.75Z"
              fill="currentColor"
            />
          </svg>
          Back Home
        </Link>
      </div>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-3xl"
      >
        <motion.h1
          variants={item}
          className="font-display text-[clamp(2.4rem,7vw,6.5rem)] font-medium uppercase leading-[0.92] tracking-tight text-white min-[1025px]:whitespace-nowrap"
        >
          Selected Work
        </motion.h1>
        <motion.p
          variants={item}
          className="mt-6 font-body text-[clamp(0.95rem,2.5vw,24px)] font-light leading-[1.4] text-white/55 tracking-[0.02em] min-[1025px]:whitespace-nowrap"
          style={{ fontWeight: 300 }}
        >
          A growing collection of AI-generated motion and static projects, each
          built to capture attention and move brands forward.
        </motion.p>
      </motion.div>
    </section>
  );
}

function Section({
  id,
  title,
  count,
  blurb,
  children,
}: {
  id: string;
  title: string;
  count: number;
  blurb: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="px-6 py-[clamp(3.5rem,10vw,120px)] md:px-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-9 flex items-end justify-between gap-6 border-b border-resort/10 pb-5"
      >
        <div className="min-w-0">
          <h2 className="font-display text-[26px] font-medium leading-[1.3] text-white uppercase min-[1025px]:text-[clamp(2rem,7vw,56px)] min-[1025px]:leading-[1.05]">
            {title}
          </h2>
          <p
            className="mt-2.5 max-w-md font-body text-[16px] leading-[1.2] text-white/50 tracking-[0.02em] min-[1025px]:mt-3 min-[1025px]:text-[clamp(0.95rem,2.5vw,24px)] min-[1025px]:leading-relaxed min-[1025px]:whitespace-nowrap"
            style={{ fontWeight: 300 }}
          >
            {blurb}
          </p>
        </div>
        <span className="shrink-0 font-display text-sm text-stone">
          ({String(count).padStart(2, "0")})
        </span>
      </motion.div>
      {children}
    </section>
  );
}

/** the first frame each card freezes on while idle */
const FREEZE_AT = 0.05;

function VideoCard({ video, onOpen }: { video: Video; onOpen: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // idle = frozen first frame in B&W; hover = play in colour
  const handleEnter = () => {
    videoRef.current?.play().catch(() => {});
  };
  const handleLeave = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = FREEZE_AT;
  };

  return (
    <motion.article
      variants={item}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      onClick={onOpen}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen()}
      aria-label={`View ${video.title}`}
      className="group relative aspect-[9/16] cursor-pointer overflow-hidden rounded-2xl border border-white/12 bg-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange"
    >
      <video
        ref={videoRef}
        src={video.src}
        loop
        muted
        playsInline
        preload="metadata"
        onLoadedMetadata={(e) => {
          // nudge off 0 so the browser paints the first frame as a frozen poster
          e.currentTarget.currentTime = FREEZE_AT;
        }}
        className="absolute inset-0 h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
      />
      {video.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={video.cover}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover grayscale transition-opacity duration-500 group-hover:opacity-0"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/80" />
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 transition-all duration-300 group-hover:ring-white/30" />

      <ExpandHint />

      <div className="absolute inset-x-4 bottom-4">
        <p className="font-body text-[12px] font-semibold uppercase tracking-[0.2em] text-white/70">
          {video.tag}
        </p>
        <h3 className="mt-1 font-display text-lg font-bold uppercase leading-tight text-white">
          {video.title}
        </h3>
      </div>
    </motion.article>
  );
}

function VisualCard({ visual, onOpen }: { visual: Visual; onOpen: () => void }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen()}
      aria-label={`View ${visual.tag} image`}
      className="group relative aspect-[9/16] cursor-pointer overflow-hidden rounded-2xl border border-white/12 bg-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={visual.src}
        alt=""
        loading="lazy"
        className={`absolute inset-0 h-full w-full grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0 ${
          visual.fit === "contain" ? "object-contain" : "object-cover"
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/80" />
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 transition-all duration-300 group-hover:ring-white/30" />

      <ExpandHint />

      <figcaption className="absolute inset-x-4 bottom-4">
        <p className="font-body text-[12px] font-semibold uppercase tracking-[0.2em] text-white/70">
          {visual.sub ?? "Visual"}
        </p>
        <h3 className="mt-1 font-display text-lg font-bold uppercase leading-tight text-white">
          {visual.tag}
        </h3>
      </figcaption>
    </motion.figure>
  );
}

/** small "expand" affordance that fades in on hover, signalling the card opens */
function ExpandHint() {
  return (
    <span className="pointer-events-none absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function Lightbox({
  active,
  onClose,
  onPrev,
  onNext,
}: {
  active: Active | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const isVideo = active?.kind === "video";
  const total = isVideo ? VIDEOS.length : VISUALS.length;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-5 backdrop-blur-md md:p-10"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 text-resort transition-colors hover:bg-white/15 md:right-8 md:top-8"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* prev / next — step through the open gallery */}
          <NavArrow
            dir="prev"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
          />
          <NavArrow
            dir="next"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
          />

          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex max-h-[86vh] max-w-[92vw] flex-col items-center"
          >
            {active.kind === "video" ? (
              <video
                key={active.index}
                src={VIDEOS[active.index].src}
                autoPlay
                loop
                playsInline
                controls
                controlsList="nodownload noplaybackrate nofullscreen"
                disablePictureInPicture
                onContextMenu={(e) => e.preventDefault()}
                className="lightbox-video max-h-[80vh] w-auto rounded-2xl border border-white/12 shadow-2xl"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={active.index}
                src={VISUALS[active.index].src}
                alt=""
                className="max-h-[80vh] w-auto rounded-2xl border border-white/12 object-contain shadow-2xl"
              />
            )}
            <p className="mt-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-stone">
              {active.kind === "video"
                ? `${VIDEOS[active.index].tag} — ${VIDEOS[active.index].title}`
                : [VISUALS[active.index].sub, VISUALS[active.index].tag]
                    .filter(Boolean)
                    .join(" ")}
              <span className="ml-2 text-stone/50">
                {active.index + 1} / {total}
              </span>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function NavArrow({
  dir,
  onClick,
}: {
  dir: "prev" | "next";
  onClick: (e: React.MouseEvent) => void;
}) {
  const isPrev = dir === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? "Previous" : "Next"}
      className={`absolute top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-white/5 text-resort transition-colors hover:bg-white/15 ${
        isPrev ? "left-3 md:left-6" : "right-3 md:right-6"
      }`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        style={isPrev ? { transform: "scaleX(-1)" } : undefined}
      >
        <path
          d="M9 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
