import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import shuffleIcon from "../assets/arrows-shuffle.svg";
import mastodonStudio from "../assets/MastodonStudio2.png";
import { useArtists } from "../api";

// Variations on the brand tagline; the headline re-rolls through these.
const TAGLINES = [
  "Classic Rigs, Classic Tone.",
  "Iconic Rigs, Iconic Tone.",
  "Vintage Rigs, Vintage Tone.",
  "Their Rigs, Your Tone.",
];

const CYCLE_MS = 4200;

export function LandingSection() {
  const navigate = useNavigate();
  const { data: artists = [] } = useArtists();
  const reduceMotion = useReducedMotion();

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % TAGLINES.length),
      CYCLE_MS
    );
    return () => clearInterval(id);
  }, [reduceMotion]);

  const handleRandomClick = () => {
    if (artists.length === 0) return;
    const randomArtist = artists[Math.floor(Math.random() * artists.length)];
    navigate(`/artists/${randomArtist.id}`);
  };

  // Stable entrance props (recomputed only when motion preference changes) so
  // the parent elements don't re-animate on every headline tick.
  const enter = useMemo(
    () => (delay: number) => ({
      initial: { opacity: 0, y: reduceMotion ? 0 : 24 },
      animate: { opacity: 1, y: 0 },
      transition: {
        delay,
        type: "spring" as const,
        stiffness: 260,
        damping: 24,
      },
    }),
    [reduceMotion]
  );

  return (
    <section className="relative isolate flex min-h-[calc(100svh-72px)] items-center overflow-hidden bg-black">
      {/* Full-bleed background */}
      <motion.img
        src={mastodonStudio}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center brightness-[0.35]"
        initial={{ scale: 1.06 }}
        animate={reduceMotion ? { scale: 1.06 } : { scale: 1 }}
        transition={{ duration: 18, ease: "easeOut" }}
      />
      {/* Legibility + blend gradients */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/70 to-black/20"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-black to-transparent"
      />

      <div className="flex w-full max-w-4xl flex-col gap-6 pl-[8%] pr-8 py-16">
        {/* Spec-sheet eyebrow */}
        <motion.div
          {...enter(0.1)}
          className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.35em] text-[#B78BE6]"
        >
          <span className="inline-block h-2 w-2 rotate-45 bg-[#7828BE]" />
          Tone Archive
        </motion.div>

        {/* Re-rolling headline: each phrase bounces in */}
        <motion.h1
          {...enter(0.22)}
          className="min-h-[2.4em] text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          <motion.span
            key={index}
            className="inline-block"
            initial={reduceMotion ? false : { y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 14 }}
          >
            {TAGLINES[index]}
          </motion.span>
        </motion.h1>

        <motion.p
          {...enter(0.34)}
          className="max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg"
        >
          A digital exploration of artist rigs, the guitars, amps, and settings
          behind the tones that defined generations. Trace a sound back to the
          gear that made it.
        </motion.p>

        <motion.div
          {...enter(0.46)}
          className="mt-2 flex flex-wrap items-center gap-4"
        >
          <button
            onClick={handleRandomClick}
            className="group flex items-center gap-2 rounded-lg bg-[#7828BE] px-6 py-3 font-semibold text-white shadow-lg shadow-[#7828BE]/30 transition-colors hover:bg-[#8F4CD1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B78BE6]"
          >
            Random Rig
            <img
              src={shuffleIcon}
              alt=""
              aria-hidden="true"
              className="h-5 w-5 invert brightness-0 transition-transform group-hover:rotate-180"
            />
          </button>
          <button
            onClick={() => navigate("/artists")}
            className="rounded-lg px-4 py-3 font-medium text-neutral-200 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B78BE6]"
          >
            Browse the archive →
          </button>
        </motion.div>
      </div>
    </section>
  );
}
