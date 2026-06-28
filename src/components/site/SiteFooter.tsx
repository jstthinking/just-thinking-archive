import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border/60">
      <div className="container-wide py-16 grid gap-12 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl">Just Thinking</p>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            A small, slow publication. New essays, episodes, and notes once or twice a month.
          </p>
          <p className="mt-6 font-hand text-lg text-[color:var(--forest)]">Made with curiosity.</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Subscribe</p>
          <form className="mt-4 flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              required
              placeholder="your@email.com"
              className="flex-1 bg-transparent border-b border-border focus:border-[color:var(--forest)] outline-none py-2 text-sm placeholder:text-muted-foreground/60"
            />
            <button className="text-sm ink-link text-[color:var(--forest)]">Sign up →</button>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">No tracking. Unsubscribe anytime.</p>
        </div>

        <div className="flex flex-col gap-2 text-sm md:items-end">
          <Link to="/essays" className="ink-link w-fit">Essays</Link>
          <Link to="/podcast" className="ink-link w-fit">Podcast</Link>
          <Link to="/artwork" className="ink-link w-fit">Artwork</Link>
          <Link to="/notebook" className="ink-link w-fit">Notebook</Link>
          <a href="/rss.xml" className="ink-link w-fit text-muted-foreground">RSS</a>
        </div>
      </div>
      <div className="container-wide py-6 border-t border-border/60 flex flex-col sm:flex-row justify-between gap-2 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Just Thinking. All ideas welcome.</p>
        <p className="font-hand text-base text-[color:var(--sepia)]">est. quietly</p>
      </div>
    </footer>
  );
}
