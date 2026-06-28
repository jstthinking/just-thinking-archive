import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { artworks, type Artwork } from "@/lib/content";
import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/artwork")({
  head: () => ({
    meta: [
      { title: "Artwork — Just Thinking" },
      { name: "description", content: "Illustrations, paintings, photography, and small sketches." },
      { property: "og:title", content: "Artwork — Just Thinking" },
      { property: "og:url", content: "/artwork" },
    ],
    links: [{ rel: "canonical", href: "/artwork" }],
  }),
  component: ArtworkPage,
});

function ArtworkPage() {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((i) => (i === null ? 0 : (i + 1) % artworks.length));
      if (e.key === "ArrowLeft") setActive((i) => (i === null ? 0 : (i - 1 + artworks.length) % artworks.length));
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [active]);

  return (
    <Layout>
      <section className="container-wide pt-20 pb-12 border-b border-border">
        <p className="font-hand text-2xl text-[color:var(--forest)]">— the studio</p>
        <h1 className="font-serif text-5xl md:text-7xl mt-2 leading-[1.02]">Things made by hand.</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Paintings, photographs, ink studies, and small sketches from notebooks. Click any piece to enter the room.
        </p>
      </section>

      <section className="container-wide py-12">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {artworks.map((a, i) => (
            <button
              key={a.slug}
              onClick={() => setActive(i)}
              className="block w-full mb-6 break-inside-avoid text-left group"
            >
              <div className="soft-zoom bg-muted">
                <img src={a.image} alt={a.title} loading="lazy" width={a.width} height={a.height} className="w-full h-auto" />
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-3">
                <p className="font-serif text-lg group-hover:text-[color:var(--forest)] transition">{a.title}</p>
                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{a.year}</p>
              </div>
              <p className="text-xs text-muted-foreground italic">{a.medium}</p>
            </button>
          ))}
        </div>
      </section>

      {active !== null && (
        <Lightbox
          art={artworks[active]}
          onClose={() => setActive(null)}
          onPrev={() => setActive((i) => (i === null ? 0 : (i - 1 + artworks.length) % artworks.length))}
          onNext={() => setActive((i) => (i === null ? 0 : (i + 1) % artworks.length))}
        />
      )}
    </Layout>
  );
}

function Lightbox({ art, onClose, onPrev, onNext }: { art: Artwork; onClose: () => void; onPrev: () => void; onNext: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-[color:var(--ink)]/95 backdrop-blur-sm flex flex-col animate-fade-up">
      <div className="flex items-center justify-between px-6 py-4 text-[color:var(--paper)]">
        <p className="font-serif text-lg">{art.title} <span className="text-[color:var(--paper)]/60">· {art.year}</span></p>
        <button onClick={onClose} aria-label="Close" className="p-2 hover:bg-white/10 rounded-md"><X className="w-5 h-5" /></button>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 pb-4 relative">
        <button onClick={onPrev} aria-label="Previous" className="absolute left-4 p-3 text-[color:var(--paper)]/70 hover:text-[color:var(--paper)]"><ChevronLeft className="w-6 h-6" /></button>
        <img src={art.image} alt={art.title} className="max-h-[75vh] max-w-[80vw] object-contain shadow-2xl" />
        <button onClick={onNext} aria-label="Next" className="absolute right-4 p-3 text-[color:var(--paper)]/70 hover:text-[color:var(--paper)]"><ChevronRight className="w-6 h-6" /></button>
      </div>
      <div className="px-6 py-6 max-w-2xl mx-auto text-center text-[color:var(--paper)]/85">
        <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--paper)]/50">{art.medium}</p>
        <p className="font-serif text-xl mt-2">{art.description}</p>
        {art.story && <p className="font-hand text-lg text-[color:var(--forest-soft)] mt-3">— {art.story}</p>}
      </div>
    </div>
  );
}
