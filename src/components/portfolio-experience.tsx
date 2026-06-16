"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { Project } from "@/components/gallery-canvas";

const GalleryCanvas = dynamic(
  () => import("@/components/gallery-canvas").then((m) => m.GalleryCanvas),
  { ssr: false },
);

/* ── Reusable word-by-word mask reveal (Framer Motion) ── */
function RevealText({
  text,
  className,
  delay = 0,
  stagger = 0.045,
  duration = 0.6,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-baseline"
          style={{ paddingBottom: "0.12em", marginBottom: "-0.12em" }}
          aria-hidden
        >
          <motion.span
            className="inline-block"
            initial={{ y: "115%" }}
            animate={{ y: "0%" }}
            transition={{
              delay: delay + i * stagger,
              duration,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

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

const TAGLINE = "CAPTURING RAW EMOTION THROUGH A JOURNALISTIC LENS";

/* ── Random photography quotes shown on the loading screen ── */
const PHOTO_QUOTES = [
  "Photography is the story I fail to put into words.",
  "Light, shadow, and a single decisive moment.",
  "Every frame is a fragment of the truth.",
  "We don't take photographs, we make them.",
  "The camera sees what the heart remembers.",
  "Capturing the unrepeatable instant of being.",
  "A photograph is a secret about a secret.",
  "Where the lens meets raw human emotion.",
];

const ABOUT_BG_SEED = "about-bg-mono";

/* ── Awards & honors ── */
type Award = {
  id: string;
  title: string;
  org: string;
  year: string;
  detail: string;
};

const AWARDS: Award[] = [
  {
    id: "a1",
    title: "Winner & Regular Nominee",
    org: "Anugerah Pewarta Foto Indonesia (APFI)",
    year: "2018—2024",
    detail:
      "Masuk dalam jajaran pemenang dan nominator reguler berkat konsistensi melahirkan karya foto esai dan spot news yang berdampak.",
  },
  {
    id: "a2",
    title: "Featured Essay & Documentary",
    org: "LKBN ANTARA",
    year: "2013—2024",
    detail:
      "Rekognisi internal dan industri atas dedikasi lebih dari satu dekade mendokumentasikan peristiwa bersejarah kontemporer di Indonesia.",
  },
  {
    id: "a3",
    title: "Best Visual Storytelling",
    org: "Indonesia Press Photo Forum",
    year: "2022",
    detail:
      "Diakui atas pendekatan jurnalistik yang menyatukan komposisi sinematik dengan kejujuran momen di lapangan.",
  },
];

/* ── Photo essays ── */
type Essay = {
  id: string;
  title: string;
  location: string;
  year: string;
  blurb: string;
  seed: string;
};

const ESSAYS: Essay[] = [
  {
    id: "e1",
    title: "Tides of the Coastline",
    location: "Pantai Utara, Jawa",
    year: "2024",
    blurb:
      "Sebuah catatan visual tentang nelayan tradisional yang bertahan di tengah perubahan iklim dan abrasi pantai.",
    seed: "essay-tides",
  },
  {
    id: "e2",
    title: "Smoke and Prayer",
    location: "Yogyakarta",
    year: "2023",
    blurb:
      "Ritual dan keseharian di lereng gunung, menangkap ketegangan antara tradisi dan ancaman alam.",
    seed: "essay-smoke",
  },
  {
    id: "e3",
    title: "The Last Harvest",
    location: "Lombok, NTB",
    year: "2023",
    blurb:
      "Potret keluarga petani garam yang menjaga warisan turun-temurun di tengah industrialisasi.",
    seed: "essay-harvest",
  },
  {
    id: "e4",
    title: "Voices Unheard",
    location: "Jakarta",
    year: "2022",
    blurb:
      "Dokumentasi gerakan akar rumput di ibu kota, suara-suara yang jarang masuk ke ruang berita utama.",
    seed: "essay-voices",
  },
  {
    id: "e5",
    title: "After the Quake",
    location: "Cianjur, Jawa Barat",
    year: "2022",
    blurb:
      "Reportase pasca-gempa: kehilangan, ketahanan, dan harapan yang tumbuh dari reruntuhan.",
    seed: "essay-quake",
  },
];

const SLIDER_SEEDS = ["slider-a", "slider-b", "slider-c", "slider-d"];

type NavKey = "work" | "about" | "awards";

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
  const [nav, setNav] = useState<NavKey>("about");
  const [hovered, setHovered] = useState<Project | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [loading, setLoading] = useState(true);

  const jakartaTime = useClock("Asia/Jakarta");

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 2600);
    return () => clearTimeout(id);
  }, []);

  const galleryActive = nav === "work" && !selected;

  const listLabel = useMemo(
    () => (hovered ? `${hovered.client} — ${hovered.title}` : "DRAG TO EXPLORE"),
    [hovered],
  );

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#222831] text-white font-mono">
      {/* ═══ Loading screen ═══ */}
      <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>

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
      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between px-4 pt-7 md:px-5 md:pt-8">
        {/* left cluster */}
        <div className="flex items-start gap-5">
          {/* logo */}
          <button
            type="button"
            onClick={() => setNav("work")}
            className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-white text-[#222831]"
            aria-label="Phantom home"
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7 fill-[#222831]">
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
        <div className="flex items-start gap-4 pr-1 md:pr-3">
          <div className="mt-1 hidden flex-col items-end gap-1 text-[9px] tracking-[0.14em] text-white/70 md:flex">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
              JAKARTA, INDONESIA {jakartaTime} GMT+7
            </span>
          </div>
          <a
            href="https://wa.me/6281293937971"
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto rounded-full bg-[#76ABAE] px-4 py-2 text-xs font-semibold text-[#222831] transition hover:bg-[#76ABAE]/85"
          >
            Let&apos;s Talk
          </a>
        </div>
      </header>

      {/* ═══ Work: hover/explore readout ═══ */}
      {nav === "work" && !selected && (
        <div className="pointer-events-none absolute bottom-24 left-1/2 z-20 max-w-[80vw] -translate-x-1/2 truncate text-center text-[10px] tracking-[0.22em] text-white/70">
          {listLabel}
        </div>
      )}

      {/* ═══ About / Awards views ═══ */}
      <AnimatePresence>
        {nav === "about" && (
          <motion.section
            key="about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden bg-[#222831] px-6"
          >
            {/* minimalistic photography background with looping cinematic zoom */}
            <motion.div
              initial={{ scale: 1, opacity: 0 }}
              animate={{
                scale: [1, 1.18, 1],
                opacity: 0.35,
              }}
              transition={{
                scale: { duration: 18, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 2.5, ease: "easeOut" },
              }}
              className="absolute inset-0 bg-cover bg-center grayscale"
              style={{
                backgroundImage: `url(https://picsum.photos/seed/${ABOUT_BG_SEED}/1920/1080?grayscale)`,
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(5,5,6,0.55)_30%,rgba(5,5,6,0.92)_100%)]" />

            <div className="relative z-10 max-w-2xl text-center">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mb-3 text-[10px] tracking-[0.3em] text-white/50"
              >
                RIVAN LINGGA
              </motion.p>
              <h2 className="font-sans text-3xl font-semibold tracking-tight text-white md:text-5xl">
                <RevealText
                  text="Elite Journalism, Authentic Moments"
                  delay={0.35}
                  stagger={0.07}
                />
              </h2>
              <p className="mx-auto mt-3 max-w-md text-xs leading-6 tracking-wide text-white/60">
                <RevealText
                  text="Delivering award-winning visual storytelling that transforms raw human emotion into powerful, high-impact assets for editorial documentary"
                  delay={0.7}
                  stagger={0.02}
                  duration={0.5}
                />
              </p>
            </div>
          </motion.section>
        )}
        {nav === "awards" && <AwardsView key="awards" />}
      </AnimatePresence>

      {/* ═══ Bottom-center nav ═══ */}
      <nav className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-full bg-[#31363F]/85 p-1 backdrop-blur-xl">
        {(
          [
            { key: "work", label: "Work" },
            { key: "about", label: "About" },
            { key: "awards", label: "Awards" },
          ] as { key: NavKey; label: string }[]
        ).map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => {
              setNav(item.key);
              setSelected(null);
            }}
            className={`rounded-full px-6 py-2.5 text-sm font-medium transition ${
              nav === item.key ? "bg-[#76ABAE] text-[#222831]" : "text-white/70 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

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
      className="absolute inset-0 z-40 overflow-hidden bg-[#31363F]"
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
          className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#222831]"
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

/* ── Auto-playing photo slider for the Awards page ── */
function PhotoSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDER_SEEDS.length);
    }, 4200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#31363F]">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={SLIDER_SEEDS[index]}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://picsum.photos/seed/${SLIDER_SEEDS[index]}/1200/750)`,
          }}
        />
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(0,0,0,0.6))]" />

      {/* slide counter */}
      <div className="absolute left-4 top-4 text-[10px] tracking-[0.24em] text-white/70">
        {String(index + 1).padStart(2, "0")} / {String(SLIDER_SEEDS.length).padStart(2, "0")}
      </div>

      {/* dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {SLIDER_SEEDS.map((s, i) => (
          <button
            key={s}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-white" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Awards page: honors + selected photo essays + slider ── */
function AwardsView() {
  return (
    <motion.section
      key="awards"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 z-20 overflow-y-auto bg-[#222831]"
    >
      <div className="mx-auto max-w-5xl px-6 pb-28 pt-20 md:px-10 md:pt-24">
        {/* header */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-3 text-[10px] tracking-[0.3em] text-white/40"
          >
            RIVAN LINGGA — RECOGNITION
          </motion.p>
          <h2 className="font-sans text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl">
            <RevealText text="A decade of award-winning photojournalism." delay={0.25} stagger={0.06} />
          </h2>
          <p className="mt-5 max-w-xl text-xs leading-6 tracking-wide text-white/50">
            <RevealText
              text="Karya yang dikenal lewat ketajaman naratif dan kejujuran momen — dari spot news hingga foto esai dokumenter yang mengabadikan peristiwa bersejarah Indonesia."
              delay={0.6}
              stagger={0.015}
              duration={0.5}
            />
          </p>
        </div>

        {/* slider */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-10"
        >
          <PhotoSlider />
        </motion.div>

        {/* awards */}
        <div className="mt-16">
          <h3 className="mb-6 text-[11px] tracking-[0.28em] text-white/50">AWARDS &amp; HONORS</h3>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
            {AWARDS.map((a, i) => (
              <motion.article
                key={a.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.08, duration: 0.5 }}
                className="flex flex-col gap-3 bg-[#31363F] p-6"
              >
                <span className="text-[10px] tracking-[0.22em] text-white/40">{a.year}</span>
                <h4 className="font-sans text-lg font-semibold leading-snug tracking-tight text-white">
                  {a.title}
                </h4>
                <p className="text-[11px] font-medium tracking-[0.12em] text-white/70">{a.org}</p>
                <p className="mt-1 text-xs leading-6 text-white/45">{a.detail}</p>
              </motion.article>
            ))}
          </div>
        </div>

        {/* essays */}
        <div className="mt-16">
          <h3 className="mb-6 text-[11px] tracking-[0.28em] text-white/50">SELECTED PHOTO ESSAYS</h3>
          <div className="flex flex-col">
            {ESSAYS.map((e, i) => (
              <motion.article
                key={e.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.5 }}
                className="group flex items-center gap-5 border-t border-white/10 py-5 last:border-b"
              >
                <span className="w-8 shrink-0 text-[10px] tracking-[0.2em] text-white/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div
                  className="hidden h-16 w-24 shrink-0 rounded-lg bg-cover bg-center opacity-70 transition group-hover:opacity-100 sm:block"
                  style={{ backgroundImage: `url(https://picsum.photos/seed/${e.seed}/240/160)` }}
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-sans text-lg font-semibold tracking-tight text-white transition group-hover:translate-x-1">
                    {e.title}
                  </h4>
                  <p className="mt-1 truncate text-xs leading-5 text-white/45">{e.blurb}</p>
                </div>
                <div className="hidden shrink-0 flex-col items-end gap-1 text-right md:flex">
                  <span className="text-[10px] tracking-[0.18em] text-white/60">{e.location}</span>
                  <span className="text-[10px] tracking-[0.18em] text-white/35">{e.year}</span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* ── Loading screen: camera-flash theme + random photography quote ── */
function LoadingScreen() {
  const [quote] = useState(
    () => PHOTO_QUOTES[Math.floor(Math.random() * PHOTO_QUOTES.length)],
  );

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#222831]"
    >
      {/* camera flash bursts */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0.9, 0, 0, 0.7, 0, 1, 0] }}
        transition={{ duration: 2.4, times: [0, 0.25, 0.3, 0.35, 0.6, 0.66, 0.72, 0.92, 1], ease: "easeOut" }}
      />

      {/* aperture / shutter ring */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0, rotate: -40 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative grid h-20 w-20 place-items-center"
      >
        <motion.span
          className="absolute inset-0 rounded-full border border-white/30"
          animate={{ scale: [1, 1.18, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* aperture blades */}
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-9 w-[1px] origin-bottom bg-white/50"
            style={{ transform: `rotate(${i * 60}deg) translateY(-50%)` }}
          />
        ))}
        <span className="grid h-11 w-11 place-items-center rounded-full bg-white">
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-[#222831]">
            <path d="M12 3c-3.6 0-6 2.7-6 6.4 0 2.1.6 3.4.6 5.5 0 1.2-.7 1.8-1.4 2.3-.5.4-.3 1.1.3 1.1h2.1c.5 0 .8-.4.8-.9v-1.4c0-.5.4-.9.9-.9s.9.4.9.9V17c0 .5.4.9.9.9s.9-.4.9-.9v-1.5c0-.5.4-.9.9-.9s.9.4.9.9V17c0 .5.3.9.8.9h2.1c.6 0 .8-.7.3-1.1-.7-.5-1.4-1.1-1.4-2.3 0-2.1.6-3.4.6-5.5C18 5.7 15.6 3 12 3z" />
          </svg>
        </span>
      </motion.div>

      {/* random photography quote */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 max-w-xs px-6 text-center text-[11px] leading-5 tracking-[0.18em] text-white/55"
      >
        {quote}
      </motion.p>

      {/* loading bar */}
      <div className="mt-6 h-[2px] w-40 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full bg-white"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.4, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}
