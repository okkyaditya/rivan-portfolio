"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { Project } from "@/components/gallery-canvas";

const GalleryCanvas = dynamic(
  () => import("@/components/gallery-canvas").then((m) => m.GalleryCanvas),
  { ssr: false },
);

/* ── Project data (Phantom-style metadata) ── */
const PROJECTS: Project[] = [
  { id: "p1", client: "NETFLIX", title: "Stranger Things Waiting Tour", tags: ["EXPERIENCE", "3D", "EVENT"], year: "2025", seed: "phantom-st" },
  { id: "p2", client: "McDONALD'S", title: "Next Stop Happily Ever After", tags: ["COMMUNICATION", "OOH", "CAMPAIGN"], year: "2025", seed: "phantom-mc" },
  { id: "p3", client: "PHANTOM", title: "AI Compass", tags: ["EXPERIENCE", "WEBSITE", "BRAND"], year: "2024", seed: "phantom-ai" },
  { id: "p4", client: "GOOGLE", title: "Pixel for Travel", tags: ["COMMUNICATION", "ILLUSTRATION", "CAMPAIGN"], year: "2025", seed: "phantom-px" },
  { id: "p5", client: "GOOGLE MAPS", title: "Petra — The Rose-Red City", tags: ["EXPERIENCE", "WEBSITE", "AR"], year: "2024", seed: "phantom-petra" },
  { id: "p6", client: "DIAGEO", title: "Casamigos Global Travel", tags: ["COMMUNICATION", "ILLUSTRATION", "3D"], year: "2025", seed: "phantom-casa" },
  { id: "p7", client: "DIAGEO", title: "Don Julio World Class", tags: ["COMMUNICATION", "AI", "EVENT"], year: "2025", seed: "phantom-julio" },
  { id: "p8", client: "JUDAS PRIEST", title: "Forged in Metal", tags: ["EXPERIENCE", "WEBSITE"], year: "2025", seed: "phantom-jp" },
  { id: "p9", client: "GOOGLE", title: "Visitor Experience Guide", tags: ["EXPERIENCE", "PHYSICAL", "EVENT"], year: "2024", seed: "phantom-veg" },
  { id: "p10", client: "PHANTOM", title: "Free Spirits Center", tags: ["EXPERIENCE", "3D", "MOTION"], year: "2024", seed: "phantom-fsc" },
  { id: "p11", client: "DATA & AI", title: "Data & AI Trends 2024", tags: ["WEBSITE", "TOOL"], year: "2024", seed: "phantom-data" },
  { id: "p12", client: "GOOGLE CLOUD", title: "Cloud Discovery", tags: ["EXPERIENCE", "WEBSITE"], year: "2023", seed: "phantom-cloud" },
];

const TAGLINE = "PHANTOM IS A TECHNOLOGY-LED CREATIVE AGENCY CRAFTING EXPERIENCES FOR GLOBAL BRANDS.";

type NavKey = "work" | "about" | "careers";

function useClock(timeZone: string) {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const tick = () => {
      try {
        setTime(
          new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone,
            hour12: false,
          }).format(new Date()),
        );
      } catch {
        setTime("--:--");
      }
    };
    tick();
    const id = setInterval(tick, 1000 * 20);
    return () => clearInterval(id);
  }, [timeZone]);
  return time;
}

export function PortfolioExperience() {
  const [nav, setNav] = useState<NavKey>("work");
  const [hovered, setHovered] = useState<Project | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");

  const londonTime = useClock("Europe/London");
  const aucklandTime = useClock("Pacific/Auckland");

  const galleryActive = nav === "work" && !selected;

  const listLabel = useMemo(
    () => (hovered ? `${hovered.client} — ${hovered.title}` : "DRAG TO EXPLORE"),
    [hovered],
  );

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#050506] text-white font-mono">
      {/* ═══ 3D Gallery ═══ */}
      <GalleryCanvas
        active={galleryActive}
        projects={PROJECTS}
        onHover={setHovered}
        onSelect={(p) => setSelected(p)}
      />

      {/* subtle vignette */}
      <div className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.55)_100%)]" />

      {/* ═══ Header ═══ */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between p-4 md:p-5">
        {/* left cluster */}
        <div className="flex items-start gap-5">
          {/* logo */}
          <button
            type="button"
            onClick={() => setNav("work")}
            className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-white text-black"
            aria-label="Phantom home"
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7 fill-black">
              <path d="M12 3c-3.6 0-6 2.7-6 6.4 0 2.1.6 3.4.6 5.5 0 1.2-.7 1.8-1.4 2.3-.5.4-.3 1.1.3 1.1h2.1c.5 0 .8-.4.8-.9v-1.4c0-.5.4-.9.9-.9s.9.4.9.9V17c0 .5.4.9.9.9s.9-.4.9-.9v-1.5c0-.5.4-.9.9-.9s.9.4.9.9V17c0 .5.3.9.8.9h2.1c.6 0 .8-.7.3-1.1-.7-.5-1.4-1.1-1.4-2.3 0-2.1.6-3.4.6-5.5C18 5.7 15.6 3 12 3z" />
            </svg>
          </button>

          {/* sound toggle */}
          <button
            type="button"
            onClick={() => setSoundOn((s) => !s)}
            className="pointer-events-auto mt-1 hidden items-center gap-2 text-[10px] tracking-[0.18em] text-white/80 sm:flex"
          >
            <span className="grid grid-cols-2 gap-[2px]">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={`h-[5px] w-[5px] ${soundOn ? "bg-white" : "bg-white/40"}`} />
              ))}
            </span>
            SOUND [{soundOn ? "ON" : "OFF"}]
          </button>
        </div>

        {/* center tagline */}
        <p className="pointer-events-none absolute left-1/2 top-5 hidden w-[42ch] -translate-x-1/2 text-center text-[10px] leading-[1.5] tracking-[0.16em] text-white/85 lg:block">
          {TAGLINE}
        </p>

        {/* right cluster */}
        <div className="flex items-start gap-4">
          <div className="mt-1 hidden flex-col items-end gap-1 text-[9px] tracking-[0.14em] text-white/70 md:flex">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
              LONDON, UK {londonTime} GMT+1
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full border border-white/60" />
              AUCKLAND, NZ {aucklandTime} GMT+12
            </span>
          </div>
          <button
            type="button"
            className="pointer-events-auto rounded-full bg-white px-4 py-2 text-xs font-semibold text-black"
          >
            Let&apos;s Talk
          </button>
        </div>
      </header>

      {/* ═══ Work: hover/explore readout ═══ */}
      {nav === "work" && !selected && (
        <div className="pointer-events-none absolute bottom-24 left-1/2 z-20 max-w-[80vw] -translate-x-1/2 truncate text-center text-[10px] tracking-[0.22em] text-white/70">
          {listLabel}
        </div>
      )}

      {/* ═══ About / Careers basic views ═══ */}
      <AnimatePresence>
        {nav !== "work" && (
          <motion.section
            key={nav}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-[#050506] px-6"
          >
            <div className="max-w-2xl text-center">
              <p className="mb-4 text-[10px] tracking-[0.3em] text-white/40">{nav.toUpperCase()}</p>
              <h2 className="font-sans text-3xl font-semibold tracking-tight text-white md:text-5xl">
                {nav === "about"
                  ? "A technology-led creative agency."
                  : "Build the future of brand experiences."}
              </h2>
              <p className="mx-auto mt-5 max-w-md text-xs leading-6 tracking-wide text-white/50">
                {nav === "about"
                  ? "Phantom crafts immersive experiences for global brands, blending engineering and design into work that moves people."
                  : "We're always looking for designers, engineers, and producers who want to push what's possible on the web."}
              </p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ═══ Bottom-left view toggles ═══ */}
      {nav === "work" && !selected && (
        <div className="absolute bottom-5 left-4 z-30 flex items-center gap-2 md:left-5">
          {(["grid", "list"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              aria-label={v}
              className={`grid h-9 w-9 place-items-center rounded-full border border-white/10 transition ${
                view === v ? "bg-white/15" : "bg-white/[0.04]"
              }`}
            >
              {v === "grid" ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white/80">
                  <rect x="4" y="4" width="6" height="6" rx="1" />
                  <rect x="14" y="4" width="6" height="6" rx="1" />
                  <rect x="4" y="14" width="6" height="6" rx="1" />
                  <rect x="14" y="14" width="6" height="6" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-white/80" strokeWidth="2">
                  <line x1="5" y1="7" x2="19" y2="7" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <line x1="5" y1="17" x2="19" y2="17" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

      {/* ═══ Bottom-center nav ═══ */}
      <nav className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-full bg-[#1c1c1f]/85 p-1 backdrop-blur-xl">
        {(
          [
            { key: "work", label: "Work" },
            { key: "about", label: "About" },
            { key: "careers", label: "Careers" },
          ] as { key: NavKey; label: string }[]
        ).map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => {
              setNav(item.key);
              setSelected(null);
            }}
            className={`rounded-full px-5 py-2 text-xs font-medium transition ${
              nav === item.key ? "bg-white text-black" : "text-white/70 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* ═══ Bottom-right filter ═══ */}
      {nav === "work" && !selected && (
        <button
          type="button"
          className="absolute bottom-5 right-4 z-30 rounded-full bg-[#1c1c1f]/85 px-5 py-2.5 text-xs font-medium text-white/80 backdrop-blur-xl md:right-5"
        >
          Filter
        </button>
      )}

      {/* ═══ Project detail page (click-to-open) ═══ */}
      <AnimatePresence>
        {selected && (
          <ProjectDetail project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}

/* ── Basic project detail template, animated in on card click ── */
function ProjectDetail({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.section
      initial={{ clipPath: "inset(45% 35% 45% 35% round 18px)", opacity: 0.6 }}
      animate={{ clipPath: "inset(0% 0% 0% 0% round 0px)", opacity: 1 }}
      exit={{ clipPath: "inset(45% 35% 45% 35% round 18px)", opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      className="absolute inset-0 z-40 overflow-hidden bg-[#0a0a0c]"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(https://picsum.photos/seed/${project.seed}/1600/900)` }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.45),rgba(0,0,0,0.85))]" />

      <header className="relative z-10 flex items-center justify-between p-4 md:p-5">
        <span className="text-[10px] tracking-[0.24em] text-white/50">{project.year}</span>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-black"
        >
          Close
        </button>
      </header>

      <div className="relative z-10 flex h-[calc(100%-72px)] flex-col justify-end p-6 md:p-12">
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mb-3 text-[11px] tracking-[0.28em] text-white/60"
        >
          {project.client}
        </motion.p>
        <motion.h1
          initial={{ y: 28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.42, duration: 0.55 }}
          className="max-w-4xl font-sans text-4xl font-semibold leading-[1.02] tracking-tight text-white md:text-7xl"
        >
          {project.title}
        </motion.h1>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-6 flex flex-wrap gap-2"
        >
          {project.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/15 px-3 py-1 text-[10px] tracking-[0.18em] text-white/70"
            >
              {t}
            </span>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
