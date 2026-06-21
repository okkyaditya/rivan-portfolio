"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
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
  /** path to cover image (shown in the list row) */
  cover: string;
  /** all photos in the essay popup slider */
  images: string[];
  /** full essay text shown alongside the slider */
  body: string;
};

const ESSAYS: Essay[] = [
  {
    id: "e1",
    title: "Penjaga Nyala Di Ujung Harapan",
    location: "Jakarta",
    year: "2025",
    blurb:
      "Kisah perawat paliatif yang menjaga nyala harapan anak-anak dengan penyakit mengancam jiwa — bukan dengan obat semata, tapi dengan kehadiran dan empati.",
    cover: "/images/awards/essay/Penjaga Nyala Di Ujung Harapan/Penjaga-nyala-di-ujung-harapan-050525-RIV-1.jpg",
    images: [
      "/images/awards/essay/Penjaga Nyala Di Ujung Harapan/Penjaga-nyala-di-ujung-harapan-050525-RIV-1.jpg",
      "/images/awards/essay/Penjaga Nyala Di Ujung Harapan/Penjaga-nyala-di-ujung-harapan-050525-RIV-2.jpg",
      "/images/awards/essay/Penjaga Nyala Di Ujung Harapan/Penjaga-nyala-di-ujung-harapan-050525-RIV-3.jpg",
      "/images/awards/essay/Penjaga Nyala Di Ujung Harapan/Penjaga-nyala-di-ujung-harapan-050525-RIV-4.jpg",
      "/images/awards/essay/Penjaga Nyala Di Ujung Harapan/Penjaga-nyala-di-ujung-harapan-050525-RIV-6.jpg",
      "/images/awards/essay/Penjaga Nyala Di Ujung Harapan/Penjaga-nyala-di-ujung-harapan-050525-RIV-7.jpg",
      "/images/awards/essay/Penjaga Nyala Di Ujung Harapan/Penjaga-nyala-di-ujung-harapan-050525-RIV-8.jpg",
      "/images/awards/essay/Penjaga Nyala Di Ujung Harapan/Penjaga-nyala-di-ujung-harapan-050525-RIV-9.jpg",
      "/images/awards/essay/Penjaga Nyala Di Ujung Harapan/Penjaga-nyala-di-ujung-harapan-050525-RIV-10.jpg",
      "/images/awards/essay/Penjaga Nyala Di Ujung Harapan/Penjaga-nyala-di-ujung-harapan-050525-RIV-11.jpg",
      "/images/awards/essay/Penjaga Nyala Di Ujung Harapan/Penjaga-nyala-di-ujung-harapan-050525-RIV-12.jpg",
    ],
    body: `Di sudut sunyi sebuah rumah mungil yang hampir tak tersentuh cahaya matahari, seorang perempuan bernama Mutiara — akrab disapa Muti — menemani seorang anak dengan tubuh mungil namun menanggung beban yang berat. Muti bukan sekadar perawat; dia adalah seorang perawat paliatif.

Paliatif merupakan perawatan berfokus untuk meningkatkan kualitas hidup pasien dengan penyakit serius atau kronis, terutama yang tidak dapat disembuhkan seperti kanker dan HIV.

Sosoknya seolah menjadi saksi dari kehidupan yang melambat menuju keabadian. Dia hadir bukan untuk menyembuhkan, tetapi untuk memastikan setiap detik yang tersisa tidak diisi oleh derita.

Sejak bergabung dengan Yayasan Rumah Rachel (Rachel House) pada 2021, Muti telah menjadi pelayan jiwa bagi anak-anak dengan penyakit yang mengancam nyawa. Dalam ruang-ruang sunyi ia hadir bukan hanya membawa obat, tapi juga kehangatan, tawa, bahkan obrolan sederhana yang membuat pasiennya merasa utuh sebagai manusia.

Baginya paliatif adalah seni menghadirkan kenyamanan di tengah luka. Dia mendengar lebih banyak dari yang terucap serta meraba gejolak batin yang tak tampak di layar monitor.

Selain Muti, ada juga Tyas yang memilih tidak menempuh jalur keperawatan konvensional. Bagi Tyas, perawat paliatif bukan hanya tentang mendengarkan keluhan tapi juga mendengarkan keheningan. Setiap kunjungannya ke pasien bukan sekadar rutinitas, melainkan sebuah perjumpaan batin.

Untuk menjaga ketenangan batin, Muti dan Tyas memiliki ritual kecil: tiga menit meditasi sebelum mulai bekerja. Di dunia yang sering abai pada kehidupan yang segera padam, mereka hadir seperti cahaya kecil yang tak pernah lelah menyala.

Foto dan teks: Rivan Awal Lingga | Editor: Wahyu Putro A`,
  },
  {
    id: "e2",
    title: "Kasih Negeri Dalam Sepiring Nasi",
    location: "Indonesia",
    year: "2025",
    blurb:
      "Perjalanan menemukan cinta tanah air yang tersimpan dalam sepiring nasi — dari tangan petani hingga meja makan, sebuah rantai kasih yang tak pernah putus.",
    cover: "/images/awards/essay/Kasih Negeri Dalam Sepiring Nasi/Kasih-negeri-dalam-sepiring-nasi-310725-RIV-1.JPG",
    images: [
      "/images/awards/essay/Kasih Negeri Dalam Sepiring Nasi/Kasih-negeri-dalam-sepiring-nasi-310725-RIV-1.JPG",
      "/images/awards/essay/Kasih Negeri Dalam Sepiring Nasi/Kasih-negeri-dalam-sepiring-nasi-310725-RIV-2.JPG",
      "/images/awards/essay/Kasih Negeri Dalam Sepiring Nasi/Kasih-negeri-dalam-sepiring-nasi-310725-RIV-3.JPG",
      "/images/awards/essay/Kasih Negeri Dalam Sepiring Nasi/Kasih-negeri-dalam-sepiring-nasi-310725-RIV-4.JPG",
      "/images/awards/essay/Kasih Negeri Dalam Sepiring Nasi/Kasih-negeri-dalam-sepiring-nasi-310725-RIV-5.JPG",
      "/images/awards/essay/Kasih Negeri Dalam Sepiring Nasi/Kasih-negeri-dalam-sepiring-nasi-310725-RIV-6.JPG",
      "/images/awards/essay/Kasih Negeri Dalam Sepiring Nasi/Kasih-negeri-dalam-sepiring-nasi-310725-RIV-7.JPG",
      "/images/awards/essay/Kasih Negeri Dalam Sepiring Nasi/Kasih-negeri-dalam-sepiring-nasi-310725-RIV-8.JPG",
      "/images/awards/essay/Kasih Negeri Dalam Sepiring Nasi/Kasih-negeri-dalam-sepiring-nasi-310725-RIV-9.JPG",
      "/images/awards/essay/Kasih Negeri Dalam Sepiring Nasi/Kasih-negeri-dalam-sepiring-nasi-310725-RIV-10.JPG",
      "/images/awards/essay/Kasih Negeri Dalam Sepiring Nasi/Kasih-negeri-dalam-sepiring-nasi-310725-RIV-11.JPG",
    ],
    body: `Nasi bukan sekadar makanan pokok. Di tanah ini, ia adalah bahasa cinta yang paling tua — dituturkan lewat lumpur sawah, doa fajar petani, dan kepulan uap di atas tungku ibu.

Dari hamparan padi di pelosok Jawa hingga meja makan di sudut kota, sepiring nasi menyimpan perjalanan panjang yang jarang kita sadari. Di balik setiap butirnya terdapat keringat, kesabaran, dan rasa memiliki terhadap negeri ini.

Para petani memulai hari sebelum matahari naik. Kaki mereka menjejak lumpur yang sama seperti ayah dan kakek mereka dulu. Bukan karena terpaksa, tapi karena ada cinta yang tak bisa dijelaskan dengan kata — cinta pada tanah, pada musim, pada siklus kehidupan yang terus berputar.

Di pasar-pasar tradisional, perempuan-perempuan membawa hasil panen dengan kepala tegak. Mereka adalah mata rantai yang menghubungkan ladang dengan dapur, kerja keras dengan kelezatan, bumi dengan manusia.

Sepiring nasi yang tersaji di hadapan kita bukan sekadar karbohidrat. Ia adalah cerita panjang tentang kasih sayang yang diam-diam mengalir dari tangan ke tangan, dari generasi ke generasi — kasih negeri yang tak pernah habis meski dimakan setiap hari.

Foto dan teks: Rivan Awal Lingga`,
  },
  {
    id: "e3",
    title: "Menilik Cemas Suku Balik",
    location: "Kalimantan Timur",
    year: "2022",
    blurb:
      "Suku Balik, penghuni asli tepian Sungai Mahakam, menghadapi kecemasan yang menggunung saat pembangunan Ibu Kota Nusantara mengubah lanskap leluhur mereka selamanya.",
    cover: "/images/awards/essay/Menilik Cemas Suku Balik/Menilik-Cemas-Suku-Balik-251022-RIV-1.JPG",
    images: [
      "/images/awards/essay/Menilik Cemas Suku Balik/Menilik-Cemas-Suku-Balik-251022-RIV-1.JPG",
      "/images/awards/essay/Menilik Cemas Suku Balik/Menilik-Cemas-Suku-Balik-251022-RIV-2.JPG",
      "/images/awards/essay/Menilik Cemas Suku Balik/Menilik-Cemas-Suku-Balik-251022-RIV-4.JPG",
      "/images/awards/essay/Menilik Cemas Suku Balik/Menilik-Cemas-Suku-Balik-251022-RIV-5.JPG",
      "/images/awards/essay/Menilik Cemas Suku Balik/Menilik-Cemas-Suku-Balik-251022-RIV-6.JPG",
      "/images/awards/essay/Menilik Cemas Suku Balik/Menilik-Cemas-Suku-Balik-251022-RIV-7.JPG",
      "/images/awards/essay/Menilik Cemas Suku Balik/Menilik-Cemas-Suku-Balik-251022-RIV-8.JPG",
      "/images/awards/essay/Menilik Cemas Suku Balik/Menilik-Cemas-Suku-Balik-251022-RIV-9.JPG",
      "/images/awards/essay/Menilik Cemas Suku Balik/Menilik-Cemas-Suku-Balik-251022-RIV-10.JPG",
      "/images/awards/essay/Menilik Cemas Suku Balik/Menilik-Cemas-Suku-Balik-251022-RIV-11.JPG",
      "/images/awards/essay/Menilik Cemas Suku Balik/Menilik-Cemas-Suku-Balik-251022-RIV-12.JPG",
      "/images/awards/essay/Menilik Cemas Suku Balik/Menilik-Cemas-Suku-Balik-251022-RIV-13.JPG",
    ],
    body: `Di tepian Sungai Mahakam, jauh sebelum nama Nusantara disebut dalam sidang-sidang negara, Suku Balik telah hidup berdampingan dengan hutan dan air selama berabad-abad. Mereka adalah warga asli yang menamakan diri "orang Balik" — merujuk pada posisi desa mereka yang berada di balik bukit, tersembunyi dari hiruk-pikuk dunia luar.

Kini kecemasan itu nyata. Alat-alat berat meratakan bukit yang dulu menjadi batas sakral wilayah mereka. Suara mesin menggantikan suara burung di pagi hari. Dan perlahan, peta leluhur yang tersimpan dalam ingatan kolektif mereka mulai kehilangan titik-titik referensinya.

Para tetua duduk di beranda rumah panggung, mata mereka menerawang ke arah horizon yang berubah. Bukan amarah yang terbaca di wajah mereka, melainkan kesedihan yang dalam dan pertanyaan yang tak terjawab: ke mana kami harus pergi ketika tanah ini bukan lagi milik kami?

Anak-anak masih berlarian di tepi sungai, belum sepenuhnya mengerti apa yang sedang terjadi. Namun para orang tua tahu — masa depan yang dulu terbayang jelas kini berselimut kabut ketidakpastian.

Suku Balik tidak menolak kemajuan. Mereka hanya ingin diakui, dilibatkan, dan dipastikan bahwa dalam proses besar membangun ibu kota baru, ada tempat untuk mereka — bukan sebagai penonton, melainkan sebagai bagian dari cerita.

Foto dan teks: Rivan Awal Lingga`,
  },
  {
    id: "e4",
    title: "Masterpiece Didi Kempot",
    location: "Solo, Jawa Tengah",
    year: "2019",
    blurb:
      "Potret perjalanan sang 'Godfather of Broken Heart' — Didi Kempot — dalam melahirkan karya-karya campursari yang mengharu-biru dan menyatukan jutaan hati.",
    cover: "/images/awards/essay/Masterpiece Didi Kempot/1.jpg",
    images: [
      "/images/awards/essay/Masterpiece Didi Kempot/1.jpg",
      "/images/awards/essay/Masterpiece Didi Kempot/2.jpg",
      "/images/awards/essay/Masterpiece Didi Kempot/3.jpg",
      "/images/awards/essay/Masterpiece Didi Kempot/4.jpg",
      "/images/awards/essay/Masterpiece Didi Kempot/5.jpg",
      "/images/awards/essay/Masterpiece Didi Kempot/6.jpg",
      "/images/awards/essay/Masterpiece Didi Kempot/7.jpg",
      "/images/awards/essay/Masterpiece Didi Kempot/8.jpg",
      "/images/awards/essay/Masterpiece Didi Kempot/9.jpg",
      "/images/awards/essay/Masterpiece Didi Kempot/10.jpg",
      "/images/awards/essay/Masterpiece Didi Kempot/11.jpg",
      "/images/awards/essay/Masterpiece Didi Kempot/12.jpg",
    ],
    body: `Ada yang istimewa dari cara Didi Kempot bernyanyi. Setiap bait yang meluncur dari bibirnya terasa seperti surat yang ditulis untuk seseorang yang pernah pergi — penuh kerinduan, tapi tak pernah menyalahkan.

Lahir di Solo pada 1966 dengan nama Didik Prasetyo, ia tumbuh di jalanan — literally. Sebelum terkenal, Didi mengamen dari kampung ke kampung, dari stasiun satu ke stasiun lain. Kehidupan keras itu yang kemudian menjadi sumur tak habis-habisnya bagi lirik-lirik yang begitu membumi.

Campursari yang ia racik bukan sekadar perpaduan gamelan dan gitar. Ia adalah jembatan antara tradisi Jawa yang megah dan denyut keseharian rakyat biasa. Ketika "Stasiun Balapan" pertama kali diputar, bukan hanya orang Jawa yang menangis — semua orang yang pernah merasakan perpisahan ikut luruh.

Di atas panggung, Didi bukan sekadar penyanyi. Ia adalah dukun patah hati yang memberi izin kepada jutaan orang untuk merasakan kesedihan mereka dengan bermartabat. Sobat Ambyar — begitu penggemarnya menyebut diri — datang ke konsernya bukan hanya untuk berhibur, tapi untuk sembuh.

Sebelum berpulang pada Mei 2020, Didi sempat menyaksikan bagaimana musik yang pernah dianggap kampungan itu meledak menjadi fenomena nasional. Ia tersenyum, seperti biasa — senyum seorang bapak yang bangga melihat anaknya akhirnya dikenal dunia.

Foto: Rivan Awal Lingga`,
  },
  {
    id: "e5",
    title: "Voli Pasir Dalam Harmoni Samosir",
    location: "Pulau Samosir, Sumatera Utara",
    year: "2024",
    blurb:
      "Di tepian Danau Toba, voli pasir bukan sekadar olahraga — ia adalah bahasa persatuan yang melampaui batas suku, agama, dan usia di jantung tanah Batak.",
    cover: "/images/awards/essay/Voli Pasir Dalam Harmoni Samosir/Cover.JPG",
    images: [
      "/images/awards/essay/Voli Pasir Dalam Harmoni Samosir/Voli-pasir-dalam-harmoni-Samosir-200924-RIV-1.JPG",
      "/images/awards/essay/Voli Pasir Dalam Harmoni Samosir/Voli-pasir-dalam-harmoni-Samosir-200924-RIV-2.JPG",
      "/images/awards/essay/Voli Pasir Dalam Harmoni Samosir/Voli-pasir-dalam-harmoni-Samosir-200924-RIV-3.JPG",
      "/images/awards/essay/Voli Pasir Dalam Harmoni Samosir/Voli-pasir-dalam-harmoni-Samosir-200924-RIV-4.JPG",
      "/images/awards/essay/Voli Pasir Dalam Harmoni Samosir/Voli-pasir-dalam-harmoni-Samosir-200924-RIV-5.JPG",
      "/images/awards/essay/Voli Pasir Dalam Harmoni Samosir/Voli-pasir-dalam-harmoni-Samosir-200924-RIV-6.JPG",
      "/images/awards/essay/Voli Pasir Dalam Harmoni Samosir/Voli-pasir-dalam-harmoni-Samosir-200924-RIV-7.JPG",
      "/images/awards/essay/Voli Pasir Dalam Harmoni Samosir/Voli-pasir-dalam-harmoni-Samosir-200924-RIV-8.JPG",
      "/images/awards/essay/Voli Pasir Dalam Harmoni Samosir/Voli-pasir-dalam-harmoni-Samosir-200924-RIV-9.JPG",
      "/images/awards/essay/Voli Pasir Dalam Harmoni Samosir/Voli-pasir-dalam-harmoni-Samosir-200924-RIV-10.JPG",
      "/images/awards/essay/Voli Pasir Dalam Harmoni Samosir/Voli-pasir-dalam-harmoni-Samosir-200924-RIV-11.JPG",
      "/images/awards/essay/Voli Pasir Dalam Harmoni Samosir/Voli-pasir-dalam-harmoni-Samosir-200924-RIV-12.JPG",
    ],
    body: `Pasir di tepi Danau Toba berbeda dari pasir pantai pada umumnya. Ia lebih halus, lebih dingin, dan menyimpan kenangan yang lebih panjang. Di sinilah, di atas hamparan pasir vulkanik Pulau Samosir, sebuah lapangan voli berdiri — sederhana namun hidup.

Setiap sore menjelang senja, anak-anak muda berkumpul. Mereka datang dari desa-desa berbeda, membawa semangat yang sama. Net yang terbentang menjadi batas yang justru menyatukan, karena di sini tidak ada yang kalah terlalu lama — semua bergantian, semua tertawa.

Voli pasir di Samosir bukan olahraga prestasi. Ia adalah ritual komunitas. Para ibu menonton dari pinggir lapangan sambil menggendong bayi. Bapak-bapak yang sudah tua ikut bersorak. Dan sesekali, seorang kakek berdiri, meminta giliran bermain — disambut tepuk tangan dan tawa hangat.

Danau Toba membentang di latar belakang, tenang dan agung seperti selalu. Kabut tipis dari perbukitan turun perlahan saat sore berganti petang. Di tengah panorama yang memesona itu, permainan terus berlanjut — bola melayang, tubuh meloncat, dan untuk sejenak semua beban dunia terlupakan.

Inilah harmoni Samosir yang sesungguhnya: bukan hanya keindahan alam yang memukau, tapi kehangatan manusianya yang tak kalah indah.

Foto dan teks: Rivan Awal Lingga`,
  },
];

/* ── Featured photo slider images ── */
const FEATURED_IMAGES = [
  "/images/awards/featured/1.jpg",
  "/images/awards/featured/2.jpg",
  "/images/awards/featured/4.jpg",
  "/images/awards/featured/5.jpg",
  "/images/awards/featured/6.jpg",
  "/images/awards/featured/7.jpg",
];

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

  /* ── Background music ── */
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/sound/jazzcafe2.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;
    // Autoplay on first user interaction (browser policy)
    const play = () => {
      audio.play().then(() => setSoundOn(true)).catch(() => {});
      window.removeEventListener("click", play);
      window.removeEventListener("keydown", play);
      window.removeEventListener("touchstart", play);
    };
    window.addEventListener("click", play);
    window.addEventListener("keydown", play);
    window.addEventListener("touchstart", play);
    return () => {
      audio.pause();
      window.removeEventListener("click", play);
      window.removeEventListener("keydown", play);
      window.removeEventListener("touchstart", play);
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    if (soundOn) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [soundOn]);

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
      {/* top-bottom dramatic vignette for Work */}
      <div className="pointer-events-none absolute inset-0 z-[5] bg-[linear-gradient(to_bottom,rgba(0,0,0,0.5)_0%,transparent_18%,transparent_82%,rgba(0,0,0,0.5)_100%)]" />

      {/* ═══ Header ═══ */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 py-4 md:px-6 md:py-5">
        {/* left cluster */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* logo */}
          <button
            type="button"
            onClick={() => setNav("work")}
            className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-white text-[#222831] md:h-11 md:w-11"
            aria-label="Phantom home"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-[#222831] md:h-7 md:w-7">
              <path d="M12 3c-3.6 0-6 2.7-6 6.4 0 2.1.6 3.4.6 5.5 0 1.2-.7 1.8-1.4 2.3-.5.4-.3 1.1.3 1.1h2.1c.5 0 .8-.4.8-.9v-1.4c0-.5.4-.9.9-.9s.9.4.9.9V17c0 .5.4.9.9.9s.9-.4.9-.9v-1.5c0-.5.4-.9.9-.9s.9.4.9.9V17c0 .5.3.9.8.9h2.1c.6 0 .8-.7.3-1.1-.7-.5-1.4-1.1-1.4-2.3 0-2.1.6-3.4.6-5.5C18 5.7 15.6 3 12 3z" />
            </svg>
          </button>

          {/* sound toggle */}
          <button
            type="button"
            onClick={() => setSoundOn((s) => !s)}
            className="pointer-events-auto flex items-center gap-2 text-[10px] tracking-[0.18em] text-white/80"
          >
            <span className="grid grid-cols-2 gap-[2px]">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={`h-[5px] w-[5px] rounded-[1px] transition ${soundOn ? "bg-white" : "bg-white/40"}`} />
              ))}
            </span>
            <span className="hidden sm:inline">SOUND [{soundOn ? "ON" : "OFF"}]</span>
          </button>
        </div>

        {/* center tagline */}
        <p className="pointer-events-none absolute left-1/2 top-1/2 hidden w-[42ch] -translate-x-1/2 -translate-y-1/2 text-center text-[10px] leading-[1.5] tracking-[0.16em] text-white/85 lg:block">
          {TAGLINE}
        </p>

        {/* right cluster */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden flex-col items-end gap-1 text-[9px] tracking-[0.14em] text-white/70 md:flex">
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
            {/* Desktop background */}
            <motion.div
              initial={{ scale: 1, opacity: 0 }}
              animate={{
                scale: [1, 1.08, 1],
                opacity: 0.48,
              }}
              transition={{
                scale: { duration: 35, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 3, ease: "easeOut" },
              }}
              className="absolute inset-0 hidden bg-cover bg-center grayscale md:block"
              style={{
                backgroundImage: `url(/images/homebg-desktop.png)`,
              }}
            />
            {/* Mobile background */}
            <motion.div
              initial={{ scale: 1, opacity: 0 }}
              animate={{
                scale: [1, 1.08, 1],
                opacity: 0.48,
              }}
              transition={{
                scale: { duration: 35, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 3, ease: "easeOut" },
              }}
              className="absolute inset-0 block bg-cover bg-center grayscale md:hidden"
              style={{
                backgroundImage: `url(/images/homebg-mobile.png)`,
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(5,5,6,0.3)_30%,rgba(5,5,6,0.78)_100%)]" />

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
      <nav className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-full bg-[#31363F]/85 p-1 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl">
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
              nav === item.key ? "bg-[#76ABAE] text-[#222831] shadow-[0_4px_16px_rgba(118,171,174,0.4)]" : "text-white/70 hover:text-white"
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
      setIndex((i) => (i + 1) % FEATURED_IMAGES.length);
    }, 4200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#31363F]">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={FEATURED_IMAGES[index]}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${encodeURI(FEATURED_IMAGES[index])})` }}
        />
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(0,0,0,0.6))]" />

      {/* slide counter */}
      <div className="absolute left-4 top-4 text-[10px] tracking-[0.24em] text-white/70">
        {String(index + 1).padStart(2, "0")} / {String(FEATURED_IMAGES.length).padStart(2, "0")}
      </div>

      {/* dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {FEATURED_IMAGES.map((src, i) => (
          <button
            key={src}
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

/* ── Essay fullscreen detail (same clip-path technique as ProjectDetail) ── */
function EssayModal({ essay, onClose }: { essay: Essay; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const [showText, setShowText] = useState(false);
  const [paused, setPaused] = useState(false);
  const total = essay.images.length;

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  /* Auto-slide every 5s, pauses when essay text is open or user interacts */
  useEffect(() => {
    if (paused || showText) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 5000);
    return () => clearInterval(id);
  }, [paused, showText, total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") { setPaused(true); prev(); }
      if (e.key === "ArrowRight") { setPaused(true); next(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const paragraphs = essay.body.split("\n\n").filter(Boolean);

  return (
    <motion.section
      initial={{ clipPath: "inset(45% 35% 45% 35% round 18px)", opacity: 0.6 }}
      animate={{ clipPath: "inset(0% 0% 0% 0% round 0px)", opacity: 1 }}
      exit={{ clipPath: "inset(45% 35% 45% 35% round 18px)", opacity: 0 }}
      transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
      className="absolute inset-0 z-50 overflow-hidden bg-[#1a1e24]"
    >
      {/* ── Background photo ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={essay.images[index]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${encodeURI(essay.images[index])})` }}
        />
      </AnimatePresence>

      {/* overlay gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0.75)_60%,rgba(0,0,0,0.92)_100%)]" />

      {/* ── Header bar ── */}
      <header className="relative z-10 flex items-center justify-between p-4 md:p-5">
        <span className="text-[10px] tracking-[0.24em] text-white/50">
          {essay.location} — {essay.year}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowText((s) => !s)}
            className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10"
          >
            {showText ? "Hide Text" : "Read Essay"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#222831]"
          >
            Close
          </button>
        </div>
      </header>

      {/* ── Essay text overlay — minimalist side panel ── */}
      <AnimatePresence>
        {showText && (
          <motion.aside
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-14 bottom-0 z-20 w-full max-w-md overflow-y-auto border-l border-white/5 bg-black/70 px-6 py-8 backdrop-blur-xl md:px-8"
          >
            <p className="mb-4 text-[10px] tracking-[0.28em] text-white/40">ESSAY</p>
            <h3 className="mb-5 font-sans text-xl font-semibold leading-snug tracking-tight text-white">
              {essay.title}
            </h3>
            <div className="space-y-4">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-[12px] leading-[1.8] text-white/70">
                  {p}
                </p>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Bottom content ── */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-0">
        {/* title + nav */}
        <div className="px-6 pb-6 md:px-12 md:pb-10">
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mb-2 text-[11px] tracking-[0.28em] text-white/60"
          >
            PHOTO ESSAY
          </motion.p>
          <motion.h1
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.42, duration: 0.55 }}
            className="max-w-3xl font-sans text-3xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl"
          >
            {essay.title}
          </motion.h1>

          {/* photo nav controls + thumbnail strip */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-5 flex items-center gap-4"
          >
            {/* prev / next */}
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => { setPaused(true); prev(); }}
              className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/30"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-white stroke-2">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => { setPaused(true); next(); }}
              className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/30"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-white stroke-2">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* pause/play toggle */}
            <button
              type="button"
              aria-label={paused ? "Resume slideshow" : "Pause slideshow"}
              onClick={() => setPaused((p) => !p)}
              className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/30"
            >
              {paused ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
                  <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                </svg>
              )}
            </button>

            {/* counter */}
            <span className="text-[10px] tracking-[0.22em] text-white/50">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>

            {/* progress bar */}
            <div className="hidden flex-1 items-center md:flex">
              <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-[#76ABAE]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${((index + 1) / total) * 100}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* thumbnail strip (mobile hidden for cleaner look) */}
            <div className="hidden gap-1.5 overflow-x-auto lg:flex">
              {essay.images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  aria-label={`Foto ${i + 1}`}
                  onClick={() => { setPaused(true); setIndex(i); }}
                  className={`h-10 w-14 flex-shrink-0 overflow-hidden rounded-md bg-cover bg-center transition ${
                    i === index
                      ? "ring-2 ring-[#76ABAE] opacity-100"
                      : "opacity-40 hover:opacity-70"
                  }`}
                  style={{ backgroundImage: `url(${encodeURI(src)})` }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

/* ── Awards page: honors + selected photo essays + slider ── */
function AwardsView() {
  const [activeEssay, setActiveEssay] = useState<Essay | null>(null);

  return (
    <>
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
                <motion.button
                  key={e.id}
                  type="button"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.5 }}
                  onClick={() => setActiveEssay(e)}
                  className="group flex w-full items-center gap-5 border-t border-white/10 py-5 text-left last:border-b hover:bg-white/[0.03]"
                >
                  <span className="w-8 shrink-0 text-[10px] tracking-[0.2em] text-white/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div
                    className="h-14 w-20 shrink-0 rounded-lg bg-cover bg-center opacity-70 transition group-hover:opacity-100 sm:h-16 sm:w-24"
                    style={{ backgroundImage: `url(${encodeURI(e.cover)})` }}
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
                  {/* arrow indicator */}
                  <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0 fill-none stroke-white/30 stroke-2 transition group-hover:stroke-white/70">
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* essay modal */}
      <AnimatePresence>
        {activeEssay && (
          <EssayModal essay={activeEssay} onClose={() => setActiveEssay(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Loading screen: camera-flash theme + random photography quote ── */
function LoadingScreen() {
  const [quote, setQuote] = useState(PHOTO_QUOTES[0]);
  useEffect(() => {
    setQuote(PHOTO_QUOTES[Math.floor(Math.random() * PHOTO_QUOTES.length)]);
  }, []);

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
