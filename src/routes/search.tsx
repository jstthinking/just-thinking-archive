import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { essays, episodes, artworks, notes } from "@/lib/content";
import { useMemo, useState } from "react";
import { Search as SearchIcon } from "lucide-react";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — Just Thinking" },
      { name: "description", content: "Search across essays, podcast episodes, artwork, and notebook entries." },
      { property: "og:url", content: "/search" },
    ],
    links: [{ rel: "canonical", href: "/search" }],
  }),
  component: SearchPage,
});

type Result = { kind: string; title: string; subtitle?: string; to: string; params?: Record<string, string> };

function SearchPage() {
  const [q, setQ] = useState("");

  const all: Result[] = useMemo(() => [
    ...essays.map((e) => ({ kind: "Essay", title: e.title, subtitle: e.dek, to: "/essays/$slug", params: { slug: e.slug } })),
    ...episodes.map((e) => ({ kind: "Episode", title: e.title, subtitle: e.description, to: "/podcast/$slug", params: { slug: e.slug } })),
    ...artworks.map((a) => ({ kind: "Artwork", title: a.title, subtitle: a.medium, to: "/artwork" })),
    ...notes.map((n) => ({ kind: "Note", title: n.body, subtitle: n.source, to: "/notebook" })),
  ], []);

  const results = q.trim()
    ? all.filter((r) => (r.title + " " + (r.subtitle ?? "")).toLowerCase().includes(q.toLowerCase()))
    : all;

  return (
    <Layout>
      <section className="container-wide pt-20 pb-10">
        <p className="font-hand text-2xl text-[color:var(--forest)]">— search</p>
        <h1 className="font-serif text-5xl md:text-6xl mt-2">Find a thought.</h1>

        <div className="mt-10 flex items-center gap-3 border-b-2 border-foreground/80 pb-3 max-w-2xl">
          <SearchIcon className="w-5 h-5 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search essays, episodes, artwork, notes…"
            className="flex-1 bg-transparent outline-none font-serif text-2xl placeholder:text-muted-foreground/60"
          />
        </div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mt-3">{results.length} results</p>
      </section>

      <section className="container-wide pb-24 divide-y divide-border max-w-3xl">
        {results.map((r, i) => {
          const Cmp: any = Link;
          return (
            <Cmp key={i} to={r.to} params={r.params} className="block py-6 group">
              <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--forest)]">{r.kind}</p>
              <p className="font-serif text-2xl mt-2 group-hover:underline underline-offset-4">{r.title}</p>
              {r.subtitle && <p className="text-muted-foreground mt-1 line-clamp-2">{r.subtitle}</p>}
            </Cmp>
          );
        })}
        {results.length === 0 && <p className="font-serif text-xl text-muted-foreground py-10">Nothing matches — yet.</p>}
      </section>
    </Layout>
  );
}
