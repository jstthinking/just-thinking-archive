import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { essays } from "@/lib/content";

export const Route = createFileRoute("/essays/")({
  head: () => ({
    meta: [
      { title: "Essays — Just Thinking" },
      { name: "description", content: "Long-form writing on attention, work, ritual, and the quiet internet." },
      { property: "og:title", content: "Essays — Just Thinking" },
      { property: "og:url", content: "/essays" },
    ],
    links: [{ rel: "canonical", href: "/essays" }],
  }),
  component: EssaysIndex,
});

function EssaysIndex() {
  return (
    <Layout>
      <section className="container-wide pt-20 pb-12 border-b border-border">
        <p className="font-hand text-2xl text-[color:var(--forest)]">— the essays</p>
        <h1 className="font-serif text-5xl md:text-7xl mt-2 leading-[1.02]">A reading room.</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Long-form writing, published as it's finished — no faster. Every essay is meant to be read with a cup of something warm.
        </p>
      </section>
      <section className="container-wide divide-y divide-border">
        {essays.map((e, i) => (
          <Link
            key={e.slug}
            to="/essays/$slug"
            params={{ slug: e.slug }}
            className="group grid md:grid-cols-12 gap-8 py-12 items-start"
          >
            <div className="md:col-span-1 font-serif italic text-2xl text-[color:var(--sepia)]">{String(i + 1).padStart(2, "0")}</div>
            <div className="md:col-span-7">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{e.date} · {e.readingTime} min</p>
              <h2 className="font-serif text-3xl md:text-4xl mt-2 leading-tight group-hover:text-[color:var(--forest)] transition-colors">{e.title}</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed max-w-2xl">{e.dek}</p>
              <div className="mt-4 flex gap-2 flex-wrap">
                {e.tags.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 border border-border rounded-full text-muted-foreground">#{t}</span>
                ))}
              </div>
            </div>
            <div className="md:col-span-4 soft-zoom aspect-[4/3] bg-muted order-first md:order-last">
              <img src={e.cover} alt="" loading="lazy" className="w-full h-full object-cover" />
            </div>
          </Link>
        ))}
      </section>
    </Layout>
  );
}
