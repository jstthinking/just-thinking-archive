import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { episodes } from "@/lib/content";

export const Route = createFileRoute("/podcast/$slug")({
  loader: ({ params }) => {
    const ep = episodes.find((e) => e.slug === params.slug);
    if (!ep) throw notFound();
    return { ep };
  },
  head: ({ loaderData, params }) => ({
    meta: [
      { title: `${loaderData?.ep.title ?? "Episode"} — Just Thinking` },
      { name: "description", content: loaderData?.ep.description ?? "" },
      { property: "og:title", content: loaderData?.ep.title ?? "" },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `/podcast/${params.slug}` },
      { property: "og:image", content: loaderData?.ep.cover ?? "" },
    ],
    links: [{ rel: "canonical", href: `/podcast/${params.slug}` }],
  }),
  notFoundComponent: () => (
    <Layout><div className="container-prose py-32 text-center"><h1 className="font-serif text-3xl">Episode not found.</h1><Link to="/podcast" className="ink-link mt-4 inline-block">All episodes</Link></div></Layout>
  ),
  errorComponent: () => <Layout><div className="container-prose py-32 text-center"><h1 className="font-serif text-3xl">Something went sideways.</h1></div></Layout>,
  component: EpisodePage,
});

function EpisodePage() {
  const { ep } = Route.useLoaderData() as { ep: typeof episodes[number] };
  return (
    <Layout>
      <article>
        <header className="container-wide pt-16 pb-12 grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-4 aspect-square overflow-hidden rounded-sm shadow-xl">
            <img src={ep.cover} alt={ep.title} className="w-full h-full object-cover" />
          </div>
          <div className="md:col-span-8">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Ep. {String(ep.number).padStart(2, "0")} · {ep.date} · {ep.duration}</p>
            <h1 className="font-serif text-4xl md:text-6xl mt-3 leading-[1.05]">{ep.title}</h1>
            {ep.guest && <p className="font-hand text-2xl text-[color:var(--forest)] mt-3">with {ep.guest}</p>}
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">{ep.description}</p>
          </div>
        </header>

        <section className="container-wide grid lg:grid-cols-3 gap-10 py-8">
          <div className="lg:col-span-2 space-y-10">
            {ep.spotify && (
              <Player label="Spotify" src={ep.spotify} height={232} />
            )}
            {ep.apple && (
              <Player label="Apple Podcasts" src={ep.apple} height={175} />
            )}
            {ep.youtube && (
              <Player label="YouTube" src={ep.youtube} height={400} />
            )}

            <div>
              <h2 className="font-serif text-3xl mb-4">Transcript</h2>
              <div className="font-serif text-lg leading-[1.8] space-y-5 text-foreground/90">
                <p><span className="text-[color:var(--sepia)]">[00:00]</span> Welcome. Today's conversation began outdoors, near a stream, and a heron interrupted us — twice. We left the herons in.</p>
                <p>This transcript is lightly edited. Pauses, where they mattered, have been preserved as line breaks. Read it however you like.</p>
                <p className="italic text-muted-foreground">— the full transcript will appear here when published —</p>
              </div>
            </div>
          </div>

          <aside className="space-y-10">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground border-b border-border pb-3">Chapter notes</p>
              <ul className="mt-4 space-y-3 font-serif text-lg">
                {ep.notes.map((n) => (
                  <li key={n.time} className="flex gap-4"><span className="text-[color:var(--sepia)] tabular-nums">{n.time}</span><span>{n.label}</span></li>
                ))}
              </ul>
            </div>
            <div className="border border-border p-6 rounded-sm bg-[color:var(--beige)]/30">
              <p className="font-hand text-xl text-[color:var(--forest)]">— stay in the loop</p>
              <p className="font-serif text-xl mt-2">Get new episodes when they're out.</p>
              <form className="mt-4 flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="your@email.com" className="flex-1 bg-transparent border-b border-border focus:border-[color:var(--forest)] outline-none py-2 text-sm" />
                <button className="ink-link text-sm text-[color:var(--forest)]">Sign up →</button>
              </form>
            </div>
          </aside>
        </section>
      </article>
    </Layout>
  );
}

function Player({ label, src, height }: { label: string; src: string; height: number }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">{label}</p>
      <iframe
        title={label}
        src={src}
        width="100%"
        height={height}
        loading="lazy"
        allow="autoplay *; clipboard-write; encrypted-media *; fullscreen *; picture-in-picture *"
        className="rounded-sm border border-border w-full"
      />
    </div>
  );
}
