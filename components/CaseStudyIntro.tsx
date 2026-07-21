"use client";

import {
  motion,
  MotionValue,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

const eyebrow = "CASE STUDY";
const headline = "How creative direction becomes campaign performance.";

// same gentle cursor-tilt as the hero's active card
const HOVER_TILT = 8;

type Section = { heading: string; body: string };

type CaseCfg = {
  title: string;
  video: string;
  sections: Section[];
  // scroll window in which the card slides straight in from the right
  start: number;
  end: number;
};

const CASES: CaseCfg[] = [
  {
    title: "Tolaab Bowling Training Video",
    video: "/video/tolaab.mp4",
    sections: [
      {
        heading: "The Challenge",
        body: "Tolaab needed a bowling training video, but filming new footage wasn't possible. I only had a few photos of the venue, most of which included visitors and were captured from limited angles.",
      },
      {
        heading: "My Solution",
        body: "To create a more engaging learning experience, I used AI to generate the opening scenes of the video, making the content both visually appealing and educational. I then removed unwanted people from the existing images, generated new viewpoints based on the available photos, and transformed the scenes into dynamic video content.",
      },
      {
        heading: "The Result",
        body: "A complete educational bowling video created without a single day of filming, saving time, reducing production costs, and turning a handful of photos into a professional training experience.",
      },
    ],
    start: 0.6,
    end: 0.7,
  },
  {
    title: "Promotional Video for Hirostar",
    video: "/video/hirostar.mp4",
    sections: [
      {
        heading: "The Challenge",
        body: "The client needed a promotional video for an upcoming padel tournament on a very tight deadline. They wanted eye-catching, CGI-style visuals that would stand out on social media, but there wasn't enough time or budget for a traditional CGI production.",
      },
      {
        heading: "My Solution",
        body: "I used AI-powered creative tools to produce cinematic, CGI-inspired visuals much faster than a traditional workflow. This allowed me to deliver a high-quality promotional video that matched the client's vision while staying on schedule and within budget.",
      },
      {
        heading: "The Result",
        body: "The final video was delivered on time and used across the client's social media campaign, helping generate excitement for the tournament with premium-looking visuals while significantly reducing production time and cost.",
      },
    ],
    start: 0.76,
    end: 0.86,
  },
  {
    title: "Promotional Video for Vitole",
    video: "/video/vitole.mp4",
    sections: [
      {
        heading: "The Challenge",
        body: "The client wanted promotional videos for their medical scrubs but didn't have the budget, models, or filming location to produce them. They also wanted the videos to closely match reference videos featuring real people wearing the scrubs in different colors.",
      },
      {
        heading: "My Solution",
        body: "I used the product images from the client's website together with AI-powered video generation to create realistic promotional videos. By following the reference style, I was able to showcase the scrubs naturally on human models in multiple color variations without the need for a traditional photoshoot or video production.",
      },
      {
        heading: "The Result",
        body: "The client received high-quality promotional videos that closely matched their creative vision, allowing them to market multiple product variations quickly while saving both production time and costs.",
      },
    ],
    start: 0.9,
    end: 0.97,
  },
];

export default function CaseStudyIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // NOTE: all motion hooks must run UNCONDITIONALLY (Rules of Hooks). The same
  // pinned, scroll-driven choreography runs on BOTH mobile and desktop; only
  // the card's internal layout is compacted on mobile so the stacked content
  // (incl. "The Result") fits inside the h-screen stage without being clipped.

  // A circle reveals a CRISP, fixed-resolution grid (clip-path, not scale).
  const circleRadius = useTransform(scrollYProgress, [0.08, 0.3], [0, 150]);
  const circleClip = useMotionTemplate`circle(${circleRadius}% at 50% 50%)`;
  const circleOpacity = useTransform(scrollYProgress, [0.03, 0.08], [0, 1]);

  // Headline finishes writing (~0.34), HOLDS for ~one scroll so it can be read,
  // then clears before the cards arrive.
  const textOpacity = useTransform(scrollYProgress, [0.54, 0.6], [1, 0], {
    clamp: true,
  });
  const textVisibility = useTransform(scrollYProgress, (value) =>
    value >= 0.61 ? "hidden" : "visible"
  );

  return (
    <section
      ref={sectionRef}
      id="case-study"
      className="relative bg-black text-resort h-[460vh] min-[1025px]:h-[640vh]"
      aria-label="Case study introduction"
    >
      {/* Pinned, scroll-driven choreography — identical on mobile & desktop:
          the checkered disc irises open, the headline is written letter by
          letter, then the Tolaab card slides in from the right. */}
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6">
        {/* growing checkered disc */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            opacity: circleOpacity,
            clipPath: circleClip,
            WebkitClipPath: circleClip,
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: "#0a0a0a",
              backgroundImage:
                "linear-gradient(rgba(244,242,228,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(244,242,228,0.08) 1px, transparent 1px)",
              backgroundPosition: "center",
              backgroundSize: "64px 64px",
            }}
          />
        </motion.div>

        {/* headline (written letter-by-letter, then clears) */}
        <motion.div
          className="relative z-10 flex max-w-6xl flex-col items-center text-center"
          style={{ opacity: textOpacity, visibility: textVisibility }}
        >
          <AnimatedLine
            text={eyebrow}
            progress={scrollYProgress}
            start={0.05}
            end={0.16}
            className="font-display text-[34px] min-[1025px]:text-[56px] font-medium leading-[1.1] text-white uppercase"
          />
          <AnimatedLine
            text={headline}
            progress={scrollYProgress}
            start={0.16}
            end={0.34}
            className="mx-auto mt-4 min-[1025px]:mt-7 block max-w-[22ch] min-[1025px]:max-w-none font-body font-light text-[16px] min-[1025px]:text-[24px] leading-[1.35] text-white/55 min-[1025px]:whitespace-nowrap"
          />
        </motion.div>

        {/* the case-study cards slide STRAIGHT in from the right, one after the
            other, each landing centre and stacking on top of the previous */}
        <div className="absolute inset-0 z-20">
          {CASES.map((c, i) => (
            <div
              key={c.title}
              className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 pt-[44px] min-[1025px]:pt-0"
              style={{ zIndex: i }}
            >
              <ProjectCard data={c} progress={scrollYProgress} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  data,
  progress,
}: {
  data: CaseCfg;
  progress: MotionValue<number>;
}) {
  // straight right-to-left slide to dead centre
  const x = useTransform(progress, [data.start, data.end], ["115vw", "0vw"], {
    clamp: true,
  });

  // gentle cursor tilt — the point under the cursor dips slightly inward
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 90, damping: 20 });
  const rotateY = useSpring(tiltY, { stiffness: 90, damping: 20 });

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    tiltY.set(px * 2 * HOVER_TILT);
    tiltX.set(py * 2 * HOVER_TILT);
  };
  const handleLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <motion.article
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        x,
        rotateX,
        rotateY,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
      className="pointer-events-auto relative flex w-full max-w-[760px] flex-col overflow-hidden rounded-[2.4rem] border border-white/85 bg-black min-[1025px]:w-[min(94vw,1040px)] min-[1025px]:max-w-[1040px] min-[1025px]:flex-row min-[1025px]:h-[560px] mx-auto"
    >
      {/* left — Tolaab video: compact 16:9 on mobile, full-height side video on
          desktop. The video is absolute so it can't stretch the frame to its own
          (portrait) aspect — the box height comes purely from aspect-video. */}
      <div className="w-full shrink-0 p-3 min-[1025px]:h-full min-[1025px]:w-[36%] min-[1025px]:p-5">
        <div className="relative aspect-[5/2] w-full overflow-hidden rounded-[1.5rem] min-[1025px]:aspect-auto min-[1025px]:h-full">
          <video
            src={data.video}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>

      {/* right — project title, then The Challenge / Our Solution / The Result */}
      <div className="flex min-w-0 flex-1 flex-col space-y-2 p-4 pb-4 min-[1025px]:space-y-5 min-[1025px]:p-10">
        <h3 className="font-display text-[17px] font-medium uppercase leading-[1.2] text-resort min-[1025px]:text-[32px] min-[1025px]:leading-[1.2]">
          {data.title}
        </h3>

        <div className="mt-2 flex flex-col gap-2 min-[1025px]:mt-[44px] min-[1025px]:gap-5">
          {data.sections.map((section) => (
            <div key={section.heading}>
              <h4 className="font-body text-[13px] font-normal leading-[1.25] tracking-[0.08em] text-stone min-[1025px]:text-[16px]">
                {section.heading}
              </h4>
              <p className="mt-0.5 font-body font-normal tracking-[0.04em] text-stone/80 text-[12.5px] leading-[1.4] min-[1025px]:mt-1.5 min-[1025px]:text-[14px] min-[1025px]:leading-relaxed">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

type AnimatedLineProps = {
  text: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
  className: string;
};

function AnimatedLine({
  text,
  progress,
  start,
  end,
  className,
}: AnimatedLineProps) {
  const characters = Array.from(text);
  const step = (end - start) / Math.max(characters.length, 1);

  const words = text.split(" ");
  let charIndex = 0;

  return (
    <span className={className} aria-label={text}>
      {words.map((word, wIdx) => {
        const letters = Array.from(word);
        const wordKey = `word-${wIdx}`;

        const wordSpan = (
          <span key={wordKey} className="inline-block whitespace-nowrap">
            {letters.map((character) => {
              const idx = charIndex;
              charIndex += 1;
              return (
                <Letter
                  key={`${character}-${idx}`}
                  character={character}
                  progress={progress}
                  start={start + idx * step}
                  end={start + (idx + 1.4) * step}
                />
              );
            })}
          </span>
        );

        // add a normal space between words so wrapping can occur there
        return (
          <span key={`wrap-${wIdx}`}>
            {wordSpan}
            {wIdx < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </span>
  );
}

type LetterProps = {
  character: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
};

function Letter({ character, progress, start, end }: LetterProps) {
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [34, 0]);
  const blur = useTransform(progress, [start, end], [10, 0]);
  const filter = useTransform(blur, (value) => `blur(${value}px)`);

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
