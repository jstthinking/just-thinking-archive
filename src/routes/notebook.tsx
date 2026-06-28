import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { notes } from "@/lib/content";
import { useState } from "react";

const kinds = ["all", "thought", "quote", "observation", "link"] as const;

export const Route = createFileRoute("/notebook")({
  head: () => ({
    meta: [
      { title: "Notebook — Just Thinking" },
      { name: "description", content: "Small thoughts, quotes, and observations. Tweets without the social media." },
      { property: "og:title", content: "Notebook — Just Thinking" },
      { property: "og:url", content: "/notebook" },
    ],
    links: [{ rel: "canonical", href: "/notebook" }],
  }),
  component: NotebookPage,
});

function NotebookPage() {
  const [filter, setFilter] = useState<typeof kinds[number]>("all");
  const filtered = filter === "all" ? notes : notes.filter((n) => n.kind === filter);

  return (
    <Layout>
      <section className="container-wide pt-20 pb-10 border-b border-border">
        <p className="font-hand text-2xl text-[color:var(--forest)]">— the notebook</p>
        <h1 className="font-serif text-5xl md:text-7xl mt-2 leading-[1.02]">Small thoughts,<br /><span className="italic">timestamped.</span></h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Tweets without social media. Quotes I want to remember. Things overheard in cafés. A place for the small ideas before they're essays.
        </p>
      </section>

      <section className="container-wide py-10">
        <div className="flex flex-wrap gap-2 mb-10">
          {kinds.map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`text-xs uppercase tracking-[0.18em] px-3 py-1.5 rounded-full border transition ${
                filter === k ? "bg-[color:var(--forest)] text-[color:var(--paper)] border-[color:var(--forest)]" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {k}
            </button>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <ol className="relative border-l border-border pl-8 space-y-12">
            {filtered.map((n) => (
              <li key={n.id} className="relative">
                <span className="absolute -left-[37px] top-2 w-2.5 h-2.5 rounded-full bg-[color:var(--forest)]" />
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{n.kind} · {n.date}</p>
                <p className="font-serif text-2xl md:text-3xl mt-3 leading-snug text-foreground/95">{n.body}</p>
                {n.source && <p className="font-hand text-xl text-[color:var(--sepia)] mt-3">— {n.source}</p>}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </Layout>
  );
}
