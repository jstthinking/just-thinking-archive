import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import portrait from "@/assets/about-portrait.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Just Thinking" },
      { name: "description", content: "A small introduction. A few links." },
      { property: "og:title", content: "About — Just Thinking" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <Layout>
      <section className="container-wide pt-20 pb-24 grid md:grid-cols-12 gap-12 items-start">
        <div className="md:col-span-5">
          <div className="aspect-[4/5] overflow-hidden rounded-sm shadow-xl">
            <img src={portrait} alt="A portrait" loading="lazy" className="w-full h-full object-cover" />
          </div>
          <p className="font-hand text-xl text-[color:var(--sepia)] mt-4 rotate-[-1.5deg] inline-block">— a friday in march, by the window</p>
        </div>

        <div className="md:col-span-7 md:pt-12">
          <p className="font-hand text-2xl text-[color:var(--forest)]">— about</p>
          <h1 className="font-serif text-5xl md:text-6xl mt-2 leading-[1.05]">Hello. I'm the keeper of this notebook.</h1>

          <div className="font-serif text-lg leading-[1.8] mt-8 space-y-5 text-foreground/90 max-w-xl">
            <p>
              Just Thinking is a small, slow publication. I write essays when I have something I'd like to think more carefully about. I record conversations with people who teach me how to listen. I paint when words won't do.
            </p>
            <p>
              I believe the internet is still big enough to have quiet rooms in it. This is one of them. There is no algorithm here. There is no rush. There is, I hope, the feeling of opening a friend's notebook.
            </p>
            <p>
              You're welcome to stay as long as you like.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md">
            {[
              ["Email", "mailto:hello@justthinking.co"],
              ["Substack", "#"],
              ["Instagram", "#"],
              ["X", "#"],
              ["GitHub", "#"],
              ["LinkedIn", "#"],
            ].map(([label, href]) => (
              <a key={label} href={href} className="ink-link text-sm">{label} →</a>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
