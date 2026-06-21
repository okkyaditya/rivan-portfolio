import type { Metadata } from "next";
import { PortfolioExperience } from "@/components/portfolio-experience";

export const metadata: Metadata = {
  title: "Rivan Awal Lingga — Photojournalist & Visual Storyteller",
  description:
    "Award-winning Indonesian photojournalist Rivan Awal Lingga. Editorial, documentary, and photo-essay work capturing raw human emotion through a journalistic lens.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Rivan Awal Lingga",
            jobTitle: "Photojournalist & Visual Storyteller",
            url: "https://rivanlingga.vercel.app/",
            nationality: "Indonesian",
            description:
              "Award-winning Indonesian photojournalist specializing in editorial, documentary, and photo-essay storytelling.",
            knowsAbout: [
              "Photojournalism",
              "Documentary Photography",
              "Photo Essay",
              "Visual Storytelling",
              "Editorial Photography",
            ],
            worksFor: {
              "@type": "Organization",
              name: "LKBN ANTARA",
            },
          }),
        }}
      />
      <PortfolioExperience />
    </>
  );
}
