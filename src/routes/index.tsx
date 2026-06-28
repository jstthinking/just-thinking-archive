import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { essays, episodes, artworks, notes } from "@/lib/content";
import { ArrowUpRight, Headphones, PenLine, Image as ImageIcon, NotebookPen } from "lucide-react";
import hero from "@/assets/hero-notebook.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Just Thinking — A place for ideas, conversations, and things worth making." },
      { name: "description", content: "A collection of podcasts, essays, artwork, and unfinished ideas." },
      { property: "og:title", content: "Just Thinking" },
      { property: "og:description", content: "A collection of podcasts, essays, artwork, and unfinished ideas." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const featured = essays.slice(0, 3);
  const latestEp = episodes[0];

  return (
    <Layout>
      {/* Hero */}
      <section className="container-wide pt-20 md:pt-28 pb-20">
        <div className="grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-7 animate-fade-up">
            <p className="font-hand text-2xl text-[color:var(--forest)] mb-4">— vol. 03, spring</p>
            <h1 className="font-serif text-[clamp(3.2rem,9vw,7.5rem)] leading-[0.95] tracking-[-0.025em]">
              Just<br />
              <span className="italic text-[color:var(--forest)]">Thinking.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
              A collection of <span className="hand-underline">podcasts, essays, artwork,</span> and unfinished ideas.
              A place for things worth making, slowly.
            </p>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <Link to="/essays" className="ink-link">Read the essays →</Link>
              <Link to="/podcast" className="ink-link">Listen to the podcast →</Link>
              <Link to="/notebook" className="ink-link text-muted-foreground">Browse the notebook →</Link>
            </div>
          </div>
          <div className="md:col-span-5 relative animate-fade-up" style={{ animationDelay: "120ms" }}>
            <div className="aspect-[4/5] overflow-hidden rounded-sm shadow-[0_30px_80px_-30px_rgba(40,30,20,0.45)]">
              <img src={hero} alt="An open notebook with a fountain pen by a window" width={1600} height={1200} className="w-full h-full object-cover" />
            </div>
            <p className="font-hand text-lg text-[color:var(--sepia)] absolute -bottom-6 -left-4 rotate-[-3deg]">
              "the unfinished sentence is where thinking lives"
            </p>
          </div>
        </div>
      </section>

      {/* Index strip */}
      <section className="border-y border-border/60 bg-[color:var(--beige)]/30">
        <div className="container-wide grid grid-cols-2 md:grid-cols-4 divide-x divide-border/60">
          {[
            { icon: PenLine, label: "Essays", to: "/essays", count: essays.length },
            { icon: Headphones, label: "Podcast", to: "/podcast", count: episodes.length },
            { icon: ImageIcon, label: "Artwork", to: "/artwork", count: artworks.length },
            { icon: NotebookPen, label: "Notebook", to: "/notebook", count: notes.length },
          ].map(({ icon: Icon, label, to, count }) => (
            <Link key={to} to={to} className="px-6 py-7 group flex items-center gap-4 hover:bg-background/60 transition">
              <Icon className="w-4 h-4 text-[color:var(--forest)]" />
              <div>
                <p className="font-serif text-xl">{label}</p>
                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mt-1">{count} entries</p>
              </div>
              <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition" />
            </Link>
          ))}
        </div>
      </section>

      {/* Essays */}
      <section className="container-wide pt-24 pb-20">
        <SectionHeader eyebrow="No. 01" title="Recent essays" link={{ to: "/essays", label: "All essays" }} />
        <div className="mt-12 grid md:grid-cols-3 gap-10 md:gap-8">
          {featured.map((e, i) => (
            <Link key={e.slug} to="/essays/$slug" params={{ slug: e.slug }} className="group lift-card block">
              <div className="soft-zoom aspect-[4/3] mb-5 bg-muted">
                <img src={e.cover} alt="" loading="lazy" className="w-full h-full object-cover" />
              </div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">№ {String(i + 1).padStart(2, "0")} · {e.date}</p>
              <h3 className="font-serif text-2xl mt-2 leading-tight group-hover:text-[color:var(--forest)] transition-colors">{e.title}</h3>
              <p className="mt-3 text-muted-foreground text-[15px] leading-relaxed">{e.dek}</p>
              <p className="mt-4 text-xs text-muted-foreground">{e.readingTime} min read</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Podcast featured */}
      <section className="bg-[color:var(--ink)] text-[color:var(--paper)]">
        <div className="container-wide py-24 grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5">
            <div className="aspect-square rounded-sm overflow-hidden shadow-2xl">
              <img src={latestEp.cover} alt={latestEp.title} loading="lazy" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="md:col-span-7">
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--paper)]/60">No. 02 · The Podcast — latest</p>
            <p className="font-hand text-2xl text-[color:var(--forest-soft)] mt-3">episode {String(latestEp.number).padStart(2, "0")}</p>
            <h2 className="font-serif text-4xl md:text-5xl mt-1 leading-tight">{latestEp.title}</h2>
            {latestEp.guest && <p className="mt-2 text-[color:var(--paper)]/70">with {latestEp.guest} · {latestEp.duration}</p>}
            <p className="mt-6 text-[color:var(--paper)]/80 leading-relaxed max-w-xl">{latestEp.description}</p>
            <div className="mt-8 flex gap-6 text-sm">
              <Link to="/podcast/$slug" params={{ slug: latestEp.slug }} className="ink-link text-[color:var(--paper)]">Listen & read →</Link>
              <Link to="/podcast" className="ink-link text-[color:var(--paper)]/70">All episodes</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Artwork strip */}
      <section className="container-wide pt-24 pb-20">
        <SectionHeader eyebrow="No. 03" title="From the studio" link={{ to: "/artwork", label: "Open gallery" }} />
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {artworks.map((a) => (
            <Link key={a.slug} to="/artwork" className="soft-zoom block aspect-[4/5] bg-muted">
              <img src={a.image} alt={a.title} loading="lazy" className="w-full h-full object-cover" />
            </Link>
          ))}
        </div>
      </section>

      {/* Notebook strip */}
      <section className="container-wide pb-24">
        <SectionHeader eyebrow="No. 04" title="From the notebook" link={{ to: "/notebook", label: "All notes" }} />
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          {notes.slice(0, 4).map((n) => (
            <article key={n.id} className="border-l-2 border-[color:var(--forest)]/40 pl-6 py-2">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{n.kind} · {n.date}</p>
              <p className="font-serif text-xl mt-2 leading-snug">{n.body}</p>
              {n.source && <p className="font-hand text-lg text-[color:var(--sepia)] mt-2">— {n.source}</p>}
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}

function SectionHeader({ eyebrow, title, link }: { eyebrow: string; title: string; link: { to: string; label: string } }) {
  return (
    <div className="flex items-end justify-between gap-6 border-b border-border pb-5">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{eyebrow}</p>
        <h2 className="font-serif text-4xl md:text-5xl mt-2">{title}</h2>
      </div>
      <Link to={link.to} className="hidden sm:inline ink-link text-sm whitespace-nowrap">{link.label} →</Link>
    </div>
  );
}
