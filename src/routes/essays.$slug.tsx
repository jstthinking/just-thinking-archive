import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { ReadingProgress } from "@/components/site/ReadingProgress";
import { essays } from "@/lib/content";
import { Share2 } from "lucide-react";

export const Route = createFileRoute("/essays/$slug")({
  loader: ({ params }) => {
    const essay = essays.find((e) => e.slug === params.slug);
    if (!essay) throw notFound();
    return { essay };
  },
  head: ({ loaderData, params }) => {
    const t = loaderData?.essay.title ?? "Essay";
    return {
      meta: [
        { title: `${t} — Just Thinking` },
        { name: "description", content: loaderData?.essay.dek ?? "" },
        { property: "og:title", content: t },
        { property: "og:description", content: loaderData?.essay.dek ?? "" },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/essays/${params.slug}` },
        { property: "og:image", content: loaderData?.essay.cover ?? "" },
      ],
      links: [{ rel: "canonical", href: `/essays/${params.slug}` }],
    };
  },
  notFoundComponent: () => (
    <Layout>
      <div className="container-prose py-32 text-center">
        <p className="font-hand text-2xl text-[color:var(--sepia)]">— not found —</p>
        <h1 className="font-serif text-4xl mt-3">This essay has wandered off.</h1>
        <Link to="/essays" className="ink-link mt-6 inline-block">Back to essays</Link>
      </div>
    </Layout>
  ),
  errorComponent: () => (
    <Layout>
      <div className="container-prose py-32 text-center">
        <h1 className="font-serif text-3xl">Something went sideways.</h1>
      </div>
    </Layout>
  ),
  component: EssayPage,
});

function EssayPage() {
  const { essay } = Route.useLoaderData() as { essay: typeof essays[number] };
  const paragraphs: string[] = essay.body.split(/\n\n+/);
  const related = essays.filter((e) => e.slug !== essay.slug).slice(0, 2);

  return (
    <Layout>
      <ReadingProgress />
      <article>
        <header className="container-prose pt-20 text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Essay · {essay.date}</p>
          <h1 className="font-serif text-4xl md:text-6xl mt-4 leading-[1.05]">{essay.title}</h1>
          <p className="font-serif italic text-xl text-muted-foreground mt-5 max-w-xl mx-auto">{essay.dek}</p>
          <p className="text-xs text-muted-foreground mt-6">{essay.readingTime} min read</p>
        </header>
        <div className="container-wide my-12">
          <div className="max-w-4xl mx-auto aspect-[16/9] overflow-hidden">
            <img src={essay.cover} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="container-prose">
          <div className="font-serif text-[1.225rem] leading-[1.75] space-y-7">
            <p className="first-letter:font-serif first-letter:text-7xl first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-[0.85] first-letter:text-[color:var(--forest)]">
              {paragraphs[0]}
            </p>
            {paragraphs.slice(1).map((p, i) => {
              if (i === 1) {
                return (
                  <blockquote key={i} className="border-l-2 border-[color:var(--forest)] pl-6 my-10 font-serif italic text-2xl text-foreground/85">
                    {p}
                  </blockquote>
                );
              }
              return <p key={i}>{p}</p>;
            })}
          </div>

          <div className="mt-16 pt-8 border-t border-border flex items-center justify-between text-sm">
            <div className="flex gap-2 flex-wrap">
              {essay.tags.map((t) => (
                <span key={t} className="px-2 py-0.5 border border-border rounded-full text-muted-foreground">#{t}</span>
              ))}
            </div>
            <button className="ink-link flex items-center gap-2"><Share2 className="w-4 h-4" /> Share</button>
          </div>
        </div>

        <section className="container-wide mt-24">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground border-b border-border pb-4">Continue reading</p>
          <div className="grid md:grid-cols-2 gap-10 mt-8">
            {related.map((r) => (
              <Link key={r.slug} to="/essays/$slug" params={{ slug: r.slug }} className="group lift-card block">
                <div className="soft-zoom aspect-[16/10] bg-muted mb-4">
                  <img src={r.cover} alt="" loading="lazy" className="w-full h-full object-cover" />
                </div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{r.date}</p>
                <h3 className="font-serif text-2xl mt-2 group-hover:text-[color:var(--forest)] transition">{r.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      </article>
    </Layout>
  );
}
