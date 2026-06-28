import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { episodes } from "@/lib/content";
import { Play } from "lucide-react";

export const Route = createFileRoute("/podcast/")({
  head: () => ({
    meta: [
      { title: "Podcast — Just Thinking" },
      { name: "description", content: "Long, slow conversations. Pauses left in." },
      { property: "og:title", content: "The Just Thinking Podcast" },
      { property: "og:url", content: "/podcast" },
    ],
    links: [{ rel: "canonical", href: "/podcast" }],
  }),
  component: PodcastIndex,
});

function PodcastIndex() {
  return (
    <Layout>
      <section className="container-wide pt-20 pb-14 border-b border-border">
        <p className="font-hand text-2xl text-[color:var(--forest)]">— the podcast</p>
        <h1 className="font-serif text-5xl md:text-7xl mt-2 leading-[1.02]">Conversations,<br /><span className="italic">at the pace of thought.</span></h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Long-form interviews with writers, makers, and quiet thinkers. New episodes every few weeks. We leave the pauses in.
        </p>
        <div className="mt-8 flex gap-6 text-sm flex-wrap">
          <a href="#" className="ink-link">Spotify</a>
          <a href="#" className="ink-link">Apple Podcasts</a>
          <a href="#" className="ink-link">YouTube</a>
          <a href="/rss.xml" className="ink-link text-muted-foreground">RSS</a>
        </div>
      </section>

      <section className="container-wide py-12 space-y-8">
        {episodes.map((ep) => (
          <Link
            key={ep.slug}
            to="/podcast/$slug"
            params={{ slug: ep.slug }}
            className="group grid md:grid-cols-12 gap-6 md:gap-10 items-center p-4 md:p-6 rounded-sm hover:bg-[color:var(--beige)]/30 transition"
          >
            <div className="md:col-span-3 aspect-square soft-zoom bg-muted rounded-sm">
              <img src={ep.cover} alt="" loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="md:col-span-8">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Ep. {String(ep.number).padStart(2, "0")} · {ep.date} · {ep.duration}
              </p>
              <h2 className="font-serif text-3xl md:text-4xl mt-2 leading-tight group-hover:text-[color:var(--forest)] transition">{ep.title}</h2>
              {ep.guest && <p className="font-hand text-xl text-[color:var(--sepia)] mt-1">with {ep.guest}</p>}
              <p className="mt-3 text-muted-foreground leading-relaxed max-w-2xl">{ep.description}</p>
            </div>
            <div className="md:col-span-1 flex md:justify-end">
              <span className="w-12 h-12 rounded-full border border-[color:var(--forest)] text-[color:var(--forest)] flex items-center justify-center group-hover:bg-[color:var(--forest)] group-hover:text-[color:var(--paper)] transition">
                <Play className="w-4 h-4 ml-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </section>
    </Layout>
  );
}
