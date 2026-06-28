// Static site generator for Just Thinking — emits ./docs for GitHub Pages.
// Reads editable content from ./content/{essays,podcast,artwork,notebook}/*.md
// and ./content/about.md. See content/README.md for the file format.
import { mkdir, writeFile, cp, rm, readdir, readFile } from "node:fs/promises";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "docs");
const CONTENT = join(ROOT, "content");

const A = (n) => `/assets/${n}`;

// ---------- tiny frontmatter parser ----------
// Supports: key: value (string/number/bool); JSON arrays/objects starting with [ or {.
function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw.trim() };
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    } else if (val.startsWith("[") || val.startsWith("{")) {
      try { val = JSON.parse(val); } catch { /* keep string */ }
    } else if (/^-?\d+(\.\d+)?$/.test(val)) {
      val = Number(val);
    } else if (val === "true" || val === "false") {
      val = val === "true";
    }
    data[key] = val;
  }
  return { data, body: m[2].trim() };
}

async function loadDir(sub) {
  const dir = join(CONTENT, sub);
  let files;
  try { files = await readdir(dir); } catch { return []; }
  const items = [];
  for (const f of files) {
    if (!f.endsWith(".md")) continue;
    const raw = await readFile(join(dir, f), "utf8");
    const { data, body } = parseFrontmatter(raw);
    items.push({ slug: basename(f, ".md"), body, ...data });
  }
  return items;
}

const byDateDesc = (a, b) => new Date(b.date) - new Date(a.date);
const byNumberDesc = (a, b) => (b.number ?? 0) - (a.number ?? 0);
const byOrderDesc = (a, b) => (b.order ?? 0) - (a.order ?? 0);

// ---------- load content ----------
const essays = (await loadDir("essays"))
  .map((e) => ({ ...e, cover: A(e.cover) }))
  .sort(byDateDesc);

const episodes = (await loadDir("podcast"))
  .map((e) => ({
    ...e,
    cover: A(e.cover),
    description: e.body,
    notes: (e.notes ?? []).map(([time, label]) => ({ time, label })),
  }))
  .sort(byNumberDesc);

const artworks = (await loadDir("artwork"))
  .map((a) => ({ ...a, image: A(a.image), description: a.body }))
  .sort((a, b) => (b.year ?? 0) - (a.year ?? 0));

const notes = (await loadDir("notebook"))
  .map((n) => ({ id: n.slug, date: n.date, kind: n.kind, body: n.body, source: n.source, order: n.order ?? 0 }))
  .sort(byOrderDesc);

const aboutRaw = await readFile(join(CONTENT, "about.md"), "utf8");
const about = (() => {
  const { data, body } = parseFrontmatter(aboutRaw);
  return { ...data, paragraphs: body.split(/\n\n+/) };
})();

// ---------- shared CSS ----------
const CSS = `
:root{
  --paper:#F8F6F2; --ink:#2c2620; --forest:#2f5d4a; --forest-soft:#5e8a76;
  --sepia:#a07a4a; --beige:#e9e1d2; --rule:#d8cfbe; --muted:#7a6f60;
}
.dark{
  --paper:#1c1814; --ink:#ece5d8; --forest:#9ec3b1; --forest-soft:#6f9485;
  --sepia:#c8a374; --beige:#3a332a; --rule:#3a332a; --muted:#a89d8b;
}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{
  font-family:'Inter',ui-sans-serif,system-ui,sans-serif;
  background:var(--paper); color:var(--ink);
  -webkit-font-smoothing:antialiased;
  background-image:
    radial-gradient(rgba(0,0,0,.025) 1px,transparent 1px),
    radial-gradient(rgba(0,0,0,.018) 1px,transparent 1px);
  background-size:3px 3px,7px 7px;
  background-position:0 0,1px 2px;
}
.dark body{
  background-image:
    radial-gradient(rgba(255,255,255,.018) 1px,transparent 1px),
    radial-gradient(rgba(255,255,255,.012) 1px,transparent 1px);
}
h1,h2,h3,h4,h5{font-family:'EB Garamond','Cormorant Garamond',Georgia,serif;font-weight:500;letter-spacing:-.01em;margin:0}
p{margin:0}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%;height:auto}
::selection{background:rgba(47,93,74,.3)}

.serif{font-family:'EB Garamond',Georgia,serif}
.hand{font-family:'Caveat',cursive}
.muted{color:var(--muted)}
.forest{color:var(--forest)}
.sepia{color:var(--sepia)}
.italic{font-style:italic}

.container{max-width:78rem;margin:0 auto;padding:0 1.5rem}
.prose{max-width:42rem;margin:0 auto;padding:0 1.5rem}

.eyebrow{font-size:.72rem;text-transform:uppercase;letter-spacing:.22em;color:var(--muted)}

/* Nav */
.nav{position:sticky;top:0;z-index:50;backdrop-filter:blur(12px);background:color-mix(in oklab,var(--paper) 75%,transparent);border-bottom:1px solid var(--rule)}
.nav-inner{display:flex;align-items:center;justify-content:space-between;padding:1rem 1.5rem;max-width:78rem;margin:0 auto}
.brand{font-family:'EB Garamond',serif;font-size:1.5rem;letter-spacing:-.01em}
.brand .it{font-style:italic;color:var(--forest)}
.nav-links{display:flex;gap:1.75rem;font-size:.875rem}
.nav-links a{position:relative;padding:.25rem 0}
.nav-links a:hover{color:var(--forest)}
.nav-links a.active{color:var(--forest)}

/* Ink-link underline */
.ink{position:relative;display:inline-block}
.ink::after{content:"";position:absolute;left:0;right:0;bottom:-2px;height:1px;background:currentColor;transform:scaleX(0);transform-origin:right;transition:transform .35s cubic-bezier(.22,1,.36,1)}
.ink:hover::after{transform:scaleX(1);transform-origin:left}

.hand-u{background-image:linear-gradient(transparent 60%,rgba(47,93,74,.35) 60%,rgba(47,93,74,.35) 92%,transparent 92%);padding:0 .1em}

/* Cards */
.lift{transition:transform .5s cubic-bezier(.22,1,.36,1),box-shadow .5s}
.lift:hover{transform:translateY(-4px);box-shadow:0 24px 48px -28px rgba(40,30,20,.4)}
.zoom{overflow:hidden;display:block}
.zoom img{transition:transform .9s cubic-bezier(.22,1,.36,1);width:100%;height:100%;object-fit:cover}
.zoom:hover img{transform:scale(1.04)}

/* Hero */
.hero{padding:5rem 0 5rem}
.hero-grid{display:grid;grid-template-columns:1fr;gap:2.5rem;align-items:end}
@media(min-width:900px){.hero-grid{grid-template-columns:7fr 5fr;gap:2.5rem}.hero{padding:7rem 0 5rem}}
.hero h1{font-family:'EB Garamond',serif;font-size:clamp(3.2rem,9vw,7.5rem);line-height:.95;letter-spacing:-.025em;margin:0}
.hero h1 .it{font-style:italic;color:var(--forest)}
.hero-img{aspect-ratio:4/5;overflow:hidden;border-radius:2px;box-shadow:0 30px 80px -30px rgba(40,30,20,.45);position:relative}
.hero-img img{width:100%;height:100%;object-fit:cover}
.hero-caption{position:absolute;bottom:-1.5rem;left:-1rem;transform:rotate(-3deg);font-family:'Caveat',cursive;font-size:1.15rem;color:var(--sepia)}

/* Index strip */
.strip{border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);background:color-mix(in oklab,var(--beige) 40%,transparent)}
.strip-grid{display:grid;grid-template-columns:repeat(2,1fr);max-width:78rem;margin:0 auto}
@media(min-width:900px){.strip-grid{grid-template-columns:repeat(4,1fr)}}
.strip-item{padding:1.75rem 1.5rem;border-right:1px solid var(--rule);display:flex;align-items:center;gap:1rem;transition:background .2s}
.strip-item:hover{background:color-mix(in oklab,var(--paper) 60%,transparent)}
.strip-item:last-child{border-right:none}
.strip-item .lbl{font-family:'EB Garamond',serif;font-size:1.25rem}
.strip-item .cnt{font-size:.7rem;text-transform:uppercase;letter-spacing:.15em;color:var(--muted);margin-top:.25rem}
.dot{width:6px;height:6px;border-radius:50%;background:var(--forest)}

/* Section header */
.sec{padding:6rem 0 5rem}
.sec-head{display:flex;align-items:end;justify-content:space-between;gap:1.5rem;border-bottom:1px solid var(--rule);padding-bottom:1.25rem}
.sec-head h2{font-size:clamp(2rem,4vw,3rem);margin-top:.5rem}

/* Card grids */
.grid-3{display:grid;grid-template-columns:1fr;gap:2.5rem;margin-top:3rem}
@media(min-width:900px){.grid-3{grid-template-columns:repeat(3,1fr);gap:2rem}}
.grid-2{display:grid;grid-template-columns:1fr;gap:1.5rem;margin-top:2.5rem}
@media(min-width:900px){.grid-2{grid-template-columns:repeat(2,1fr)}}
.grid-4{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;margin-top:3rem}
@media(min-width:900px){.grid-4{grid-template-columns:repeat(4,1fr);gap:1.5rem}}

.card .thumb{aspect-ratio:4/3;background:var(--beige);overflow:hidden;border-radius:2px;margin-bottom:1.25rem}
.card h3{font-size:1.5rem;margin-top:.5rem;line-height:1.15;transition:color .3s}
.card a:hover h3, a:hover .card h3{color:var(--forest)}
.card .meta{font-size:.7rem;text-transform:uppercase;letter-spacing:.18em;color:var(--muted)}
.card .dek{margin-top:.75rem;color:var(--muted);font-size:.95rem;line-height:1.6}

/* Podcast featured */
.pod{background:var(--ink);color:var(--paper)}
.pod-inner{display:grid;grid-template-columns:1fr;gap:3rem;align-items:center;padding:6rem 0}
@media(min-width:900px){.pod-inner{grid-template-columns:5fr 7fr}}
.pod-cover{aspect-ratio:1/1;overflow:hidden;border-radius:2px;box-shadow:0 25px 60px -20px rgba(0,0,0,.5)}
.pod h2{font-size:clamp(2rem,4vw,3rem);line-height:1.1;margin-top:.25rem}
.pod .muted{color:rgba(255,255,255,.65)}
.pod .body{color:rgba(255,255,255,.8);line-height:1.7;margin-top:1.5rem;max-width:36rem}

/* Notebook strip */
.note{border-left:2px solid rgba(47,93,74,.4);padding:.5rem 0 .5rem 1.5rem}
.note .body{font-family:'EB Garamond',serif;font-size:1.25rem;line-height:1.4;margin-top:.5rem}
.note .src{font-family:'Caveat',cursive;color:var(--sepia);font-size:1.1rem;margin-top:.5rem}

/* Footer */
footer{border-top:1px solid var(--rule);margin-top:4rem;padding:4rem 0 3rem}
.foot-grid{display:grid;grid-template-columns:1fr;gap:2.5rem;max-width:78rem;margin:0 auto;padding:0 1.5rem}
@media(min-width:700px){.foot-grid{grid-template-columns:2fr 1fr 1fr 1fr}}
.foot-grid h4{font-size:.72rem;text-transform:uppercase;letter-spacing:.2em;color:var(--muted);margin-bottom:1rem;font-family:'Inter',sans-serif;font-weight:500}
.foot-grid ul{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:.5rem;font-size:.9rem}
.foot-bottom{border-top:1px solid var(--rule);margin-top:3rem;padding:1.5rem;text-align:center;font-size:.8rem;color:var(--muted)}

/* Article body */
.article{padding:5rem 0 6rem}
.article header{text-align:center;margin-bottom:3rem}
.article h1{font-size:clamp(2.5rem,6vw,4.5rem);line-height:1.05;letter-spacing:-.02em;margin:.5rem 0}
.article .dek{font-family:'EB Garamond',serif;font-style:italic;font-size:1.4rem;color:var(--muted);margin-top:1rem}
.article .cover{aspect-ratio:16/9;overflow:hidden;border-radius:2px;margin:3rem 0;max-width:60rem;margin-left:auto;margin-right:auto}
.article .body{font-family:'EB Garamond',serif;font-size:1.25rem;line-height:1.7;color:var(--ink)}
.article .body p{margin:0 0 1.5em}
.article .body p:first-child::first-letter{font-size:4.5rem;float:left;line-height:.9;padding:.15em .12em 0 0;font-weight:500;color:var(--forest)}

/* Episode */
.episode{padding:4rem 0 5rem}
.ep-head{display:grid;grid-template-columns:1fr;gap:2.5rem;align-items:end}
@media(min-width:900px){.ep-head{grid-template-columns:1fr 2fr}}
.ep-cover{aspect-ratio:1/1;overflow:hidden;border-radius:2px;max-width:24rem}
.players{display:flex;flex-direction:column;gap:1.5rem;margin-top:3rem}
.player iframe{width:100%;border:0;border-radius:4px}
.chapters{margin-top:3rem;border-top:1px solid var(--rule);padding-top:2rem}
.chapters .row{display:flex;gap:1.5rem;padding:.75rem 0;border-bottom:1px dashed var(--rule)}
.chapters .row:last-child{border-bottom:none}
.chapters .t{font-family:'EB Garamond',serif;color:var(--forest);font-variant-numeric:tabular-nums;min-width:4rem}

/* Notebook page */
.timeline{max-width:42rem;margin:0 auto;padding:4rem 1.5rem 6rem}
.timeline .note{margin-bottom:2.5rem}

/* Lightbox-less gallery */
.gallery{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;margin-top:3rem}
@media(min-width:700px){.gallery{grid-template-columns:repeat(3,1fr);gap:1.5rem}}
.gal-item{break-inside:avoid}
.gal-item img{width:100%;height:auto;border-radius:2px;transition:transform .6s}
.gal-item:hover img{transform:scale(1.02)}
.gal-item .cap{margin-top:.75rem}
.gal-item .cap .t{font-family:'EB Garamond',serif;font-size:1.15rem}
.gal-item .cap .m{font-size:.75rem;text-transform:uppercase;letter-spacing:.15em;color:var(--muted);margin-top:.2rem}

/* About */
.about{display:grid;grid-template-columns:1fr;gap:3rem;padding:5rem 0;align-items:start}
@media(min-width:900px){.about{grid-template-columns:1fr 2fr}}
.about-img{aspect-ratio:4/5;overflow:hidden;border-radius:2px;max-width:24rem}
.about p{font-family:'EB Garamond',serif;font-size:1.2rem;line-height:1.7;margin-bottom:1.25em}

/* Theme toggle */
.theme-toggle{background:none;border:1px solid var(--rule);color:var(--ink);width:36px;height:36px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;margin-left:1rem}
.theme-toggle:hover{background:var(--beige)}

@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.fade-up{animation:fadeUp .7s cubic-bezier(.22,1,.36,1) both}
.fade-up-2{animation:fadeUp .7s cubic-bezier(.22,1,.36,1) .12s both}
`;

// ---------- shell ----------
const head = (title, desc, path) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${title}</title>
<meta name="description" content="${esc(desc)}" />
<meta property="og:site_name" content="Just Thinking" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600&family=Caveat:wght@400;500&display=swap" />
<link rel="stylesheet" href="${rel(path,'/style.css')}" />
<script>(function(){try{var t=localStorage.getItem('jt-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})();</script>
</head>
<body>`;

const nav = (active, path) => {
  const link = (href, label, key) =>
    `<a href="${rel(path,href)}" class="${active===key?'active':''}">${label}</a>`;
  return `<header class="nav"><div class="nav-inner">
  <a href="${rel(path,'/')}" class="brand">Just <span class="it">Thinking</span></a>
  <nav class="nav-links">
    ${link('/essays/','Essays','essays')}
    ${link('/podcast/','Podcast','podcast')}
    ${link('/artwork/','Artwork','artwork')}
    ${link('/notebook/','Notebook','notebook')}
    ${link('/about/','About','about')}
    <button class="theme-toggle" onclick="(function(){var d=document.documentElement;d.classList.toggle('dark');try{localStorage.setItem('jt-theme',d.classList.contains('dark')?'dark':'light')}catch(e){}})()" aria-label="Toggle theme">☾</button>
  </nav>
</div></header>`;
};

const footer = (path) => `<footer><div class="foot-grid">
  <div>
    <div class="brand" style="font-size:1.5rem">Just <span class="it" style="color:var(--forest);font-style:italic">Thinking</span></div>
    <p class="muted" style="margin-top:.75rem;max-width:24rem;line-height:1.6">A small, slow publication. Essays, conversations, artwork, and unfinished thoughts — made with care, on purpose.</p>
  </div>
  <div><h4>Read</h4><ul>
    <li><a href="${rel(path,'/essays/')}" class="ink">Essays</a></li>
    <li><a href="${rel(path,'/notebook/')}" class="ink">Notebook</a></li>
  </ul></div>
  <div><h4>Listen & see</h4><ul>
    <li><a href="${rel(path,'/podcast/')}" class="ink">Podcast</a></li>
    <li><a href="${rel(path,'/artwork/')}" class="ink">Artwork</a></li>
  </ul></div>
  <div><h4>Elsewhere</h4><ul>
    <li><a href="${rel(path,'/about/')}" class="ink">About</a></li>
    <li><a href="mailto:hello@justthinking.co" class="ink">Letters</a></li>
  </ul></div>
</div>
<div class="foot-bottom">© ${new Date().getFullYear()} Just Thinking · Set in EB Garamond & Inter · Made slowly.</div>
</footer>`;

const tail = `</body></html>`;

function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function rel(from, to){
  // make absolute paths work under github pages subpath via relative links
  const depth = (from.replace(/^\/|\/$/g,'').split('/').filter(Boolean).length);
  const up = depth===0 ? './' : '../'.repeat(depth);
  if(to.startsWith('/')) return up + to.slice(1);
  return to;
}

// ---------- pages ----------
function pageHome(){
  const path='/';
  const featured = essays.slice(0,3);
  const ep = episodes[0];
  return head('Just Thinking — A place for ideas, conversations, and things worth making.',
    'A collection of podcasts, essays, artwork, and unfinished ideas.', path)
    + nav('', path)
    + `<main>
    <section class="container hero">
      <div class="hero-grid">
        <div class="fade-up">
          <p class="hand forest" style="font-size:1.5rem;margin-bottom:1rem">— vol. 03, spring</p>
          <h1>Just<br/><span class="it">Thinking.</span></h1>
          <p style="margin-top:2rem;max-width:32rem;font-size:1.125rem;color:var(--muted);line-height:1.7">A collection of <span class="hand-u">podcasts, essays, artwork,</span> and unfinished ideas. A place for things worth making, slowly.</p>
          <div style="margin-top:2.5rem;display:flex;flex-wrap:wrap;gap:.75rem 2rem;font-size:.9rem">
            <a href="${rel(path,'/essays/')}" class="ink">Read the essays →</a>
            <a href="${rel(path,'/podcast/')}" class="ink">Listen to the podcast →</a>
            <a href="${rel(path,'/notebook/')}" class="ink muted">Browse the notebook →</a>
          </div>
        </div>
        <div class="fade-up-2">
          <div class="hero-img">
            <img src="${rel(path,'/assets/hero-notebook.jpg')}" alt="An open notebook with a fountain pen by a window" />
            <p class="hero-caption">"the unfinished sentence is where thinking lives"</p>
          </div>
        </div>
      </div>
    </section>

    <section class="strip"><div class="strip-grid">
      ${[
        ['Essays','/essays/',essays.length],
        ['Podcast','/podcast/',episodes.length],
        ['Artwork','/artwork/',artworks.length],
        ['Notebook','/notebook/',notes.length],
      ].map(([l,h,c])=>`<a href="${rel(path,h)}" class="strip-item"><span class="dot"></span><div><div class="lbl">${l}</div><div class="cnt">${c} entries</div></div></a>`).join('')}
    </div></section>

    <section class="container sec">
      <div class="sec-head"><div><div class="eyebrow">No. 01</div><h2>Recent essays</h2></div><a href="${rel(path,'/essays/')}" class="ink" style="font-size:.875rem">All essays →</a></div>
      <div class="grid-3">
        ${featured.map((e,i)=>`<a href="${rel(path,'/essays/'+e.slug+'/')}" class="card lift">
          <div class="thumb zoom"><img src="${rel(path,e.cover)}" alt="" loading="lazy" /></div>
          <div class="meta">№ ${String(i+1).padStart(2,'0')} · ${e.date}</div>
          <h3>${e.title}</h3>
          <p class="dek">${e.dek}</p>
          <p class="meta" style="margin-top:1rem;letter-spacing:.05em">${e.readingTime} min read</p>
        </a>`).join('')}
      </div>
    </section>

    <section class="pod"><div class="container pod-inner">
      <div><div class="pod-cover"><img src="${rel(path,ep.cover)}" alt="${esc(ep.title)}" /></div></div>
      <div>
        <div class="eyebrow" style="color:rgba(255,255,255,.55)">No. 02 · The Podcast — latest</div>
        <p class="hand" style="font-size:1.5rem;color:var(--forest-soft);margin-top:.5rem">episode ${String(ep.number).padStart(2,'0')}</p>
        <h2>${ep.title}</h2>
        ${ep.guest?`<p class="muted" style="margin-top:.5rem">with ${ep.guest} · ${ep.duration}</p>`:''}
        <p class="body">${ep.description}</p>
        <div style="margin-top:2rem;display:flex;gap:1.5rem;font-size:.9rem">
          <a href="${rel(path,'/podcast/'+ep.slug+'/')}" class="ink">Listen & read →</a>
          <a href="${rel(path,'/podcast/')}" class="ink" style="opacity:.7">All episodes</a>
        </div>
      </div>
    </div></section>

    <section class="container sec">
      <div class="sec-head"><div><div class="eyebrow">No. 03</div><h2>From the studio</h2></div><a href="${rel(path,'/artwork/')}" class="ink" style="font-size:.875rem">Open gallery →</a></div>
      <div class="grid-4">
        ${artworks.map(a=>`<a href="${rel(path,'/artwork/')}" class="zoom" style="aspect-ratio:4/5;background:var(--beige);border-radius:2px"><img src="${rel(path,a.image)}" alt="${esc(a.title)}" loading="lazy" /></a>`).join('')}
      </div>
    </section>

    <section class="container" style="padding-bottom:6rem">
      <div class="sec-head"><div><div class="eyebrow">No. 04</div><h2>From the notebook</h2></div><a href="${rel(path,'/notebook/')}" class="ink" style="font-size:.875rem">All notes →</a></div>
      <div class="grid-2">
        ${notes.slice(0,4).map(n=>`<article class="note"><div class="meta" style="font-size:.7rem;text-transform:uppercase;letter-spacing:.18em;color:var(--muted)">${n.kind} · ${n.date}</div><p class="body">${n.body}</p>${n.source?`<p class="src">— ${n.source}</p>`:''}</article>`).join('')}
      </div>
    </section>
    </main>` + footer(path) + tail;
}

function pageEssaysIndex(){
  const path='/essays/';
  return head('Essays — Just Thinking','Slow essays on attention, work, and the quiet internet.',path)
    + nav('essays',path)
    + `<main class="container" style="padding:5rem 0 6rem">
      <header style="text-align:center;margin-bottom:4rem">
        <div class="eyebrow">No. 01 — Essays</div>
        <h1 class="serif" style="font-size:clamp(3rem,7vw,5rem);margin-top:.5rem">Essays</h1>
        <p class="serif italic" style="color:var(--muted);font-size:1.25rem;margin-top:1rem;max-width:36rem;margin-left:auto;margin-right:auto">Long-form pieces on attention, craft, and the quiet corners of a noisy world.</p>
      </header>
      <div class="grid-3">
        ${essays.map((e,i)=>`<a href="${rel(path,'/essays/'+e.slug+'/')}" class="card lift">
          <div class="thumb zoom"><img src="${rel(path,e.cover)}" alt="" /></div>
          <div class="meta">№ ${String(i+1).padStart(2,'0')} · ${e.date}</div>
          <h3>${e.title}</h3>
          <p class="dek">${e.dek}</p>
        </a>`).join('')}
      </div>
    </main>` + footer(path) + tail;
}

function pageEssay(e){
  const path=`/essays/${e.slug}/`;
  return head(`${e.title} — Just Thinking`, e.dek, path)
    + nav('essays', path)
    + `<main class="article">
      <div class="prose">
        <header>
          <div class="eyebrow">Essay · ${e.date} · ${e.readingTime} min read</div>
          <h1>${e.title}</h1>
          <p class="dek">${e.dek}</p>
        </header>
      </div>
      <div class="container"><div class="cover"><img src="${rel(path,e.cover)}" alt="" /></div></div>
      <div class="prose"><div class="body">${e.body.split(/\n\n+/).map(p=>`<p>${esc(p)}</p>`).join('')}</div>
        <hr style="margin:4rem 0;border:none;border-top:1px solid var(--rule)" />
        <p class="muted" style="font-size:.875rem"><a href="${rel(path,'/essays/')}" class="ink">← Back to all essays</a></p>
      </div>
    </main>` + footer(path) + tail;
}

function pagePodcastIndex(){
  const path='/podcast/';
  return head('Podcast — Just Thinking','Long, slow conversations.',path)
    + nav('podcast',path)
    + `<main class="container" style="padding:5rem 0 6rem">
      <header style="text-align:center;margin-bottom:4rem">
        <div class="eyebrow">No. 02 — Podcast</div>
        <h1 class="serif" style="font-size:clamp(3rem,7vw,5rem);margin-top:.5rem">The Podcast</h1>
        <p class="serif italic" style="color:var(--muted);font-size:1.25rem;margin-top:1rem;max-width:36rem;margin-left:auto;margin-right:auto">Conversations with people who think for a living, recorded slowly and edited gently.</p>
      </header>
      <div style="display:flex;flex-direction:column;gap:3rem">
        ${episodes.map(ep=>`<a href="${rel(path,'/podcast/'+ep.slug+'/')}" style="display:grid;grid-template-columns:1fr;gap:2rem;padding-bottom:3rem;border-bottom:1px solid var(--rule)" class="lift-row">
          <div style="display:grid;grid-template-columns:1fr 2fr;gap:2rem;align-items:center">
            <div class="zoom" style="aspect-ratio:1/1;border-radius:2px;overflow:hidden;max-width:14rem"><img src="${rel(path,ep.cover)}" alt="${esc(ep.title)}" /></div>
            <div>
              <div class="eyebrow">Episode ${String(ep.number).padStart(2,'0')} · ${ep.date} · ${ep.duration}</div>
              <h3 class="serif" style="font-size:2rem;margin-top:.5rem">${ep.title}</h3>
              ${ep.guest?`<p class="muted" style="margin-top:.5rem">with ${ep.guest}</p>`:''}
              <p class="serif" style="margin-top:1rem;font-size:1.1rem;line-height:1.6;color:var(--muted)">${ep.description}</p>
            </div>
          </div>
        </a>`).join('')}
      </div>
    </main>` + footer(path) + tail;
}

function pageEpisode(ep){
  const path=`/podcast/${ep.slug}/`;
  return head(`${ep.title} — Just Thinking`, ep.description, path)
    + nav('podcast', path)
    + `<main class="container episode">
      <div class="ep-head">
        <div class="ep-cover"><img src="${rel(path,ep.cover)}" alt="${esc(ep.title)}" /></div>
        <div>
          <div class="eyebrow">Episode ${String(ep.number).padStart(2,'0')} · ${ep.date} · ${ep.duration}</div>
          <h1 class="serif" style="font-size:clamp(2.25rem,5vw,3.5rem);line-height:1.1;margin-top:.5rem">${ep.title}</h1>
          ${ep.guest?`<p class="hand sepia" style="font-size:1.5rem;margin-top:.5rem">with ${ep.guest}</p>`:''}
          <p class="serif" style="font-size:1.2rem;line-height:1.6;color:var(--muted);margin-top:1.5rem">${ep.description}</p>
        </div>
      </div>
      <div class="players">
        ${ep.spotify?`<div class="player"><div class="eyebrow" style="margin-bottom:.5rem">Spotify</div><iframe src="${ep.spotify}" height="152" allow="autoplay;clipboard-write;encrypted-media;picture-in-picture" loading="lazy"></iframe></div>`:''}
        ${ep.apple?`<div class="player"><div class="eyebrow" style="margin-bottom:.5rem">Apple Podcasts</div><iframe src="${ep.apple}" height="175" allow="autoplay *;encrypted-media *" loading="lazy"></iframe></div>`:''}
        ${ep.youtube?`<div class="player"><div class="eyebrow" style="margin-bottom:.5rem">YouTube</div><iframe src="${ep.youtube}" height="380" allow="accelerometer;autoplay;clipboard-write;encrypted-media;picture-in-picture" loading="lazy" allowfullscreen></iframe></div>`:''}
      </div>
      <div class="chapters">
        <h3 class="serif" style="font-size:1.5rem;margin-bottom:1rem">Show notes</h3>
        ${ep.notes.map(n=>`<div class="row"><div class="t">${n.time}</div><div>${n.label}</div></div>`).join('')}
      </div>
      <p class="muted" style="margin-top:3rem;font-size:.875rem"><a href="${rel(path,'/podcast/')}" class="ink">← All episodes</a></p>
    </main>` + footer(path) + tail;
}

function pageArtwork(){
  const path='/artwork/';
  return head('Artwork — Just Thinking','Ink, film, graphite, oil. A working studio.',path)
    + nav('artwork',path)
    + `<main class="container" style="padding:5rem 0 6rem">
      <header style="text-align:center;margin-bottom:3rem">
        <div class="eyebrow">No. 03 — Studio</div>
        <h1 class="serif" style="font-size:clamp(3rem,7vw,5rem);margin-top:.5rem">From the studio</h1>
        <p class="serif italic" style="color:var(--muted);font-size:1.25rem;margin-top:1rem;max-width:36rem;margin-left:auto;margin-right:auto">A working archive of drawings, photographs, and small paintings.</p>
      </header>
      <div class="gallery">
        ${artworks.map(a=>`<figure class="gal-item" style="margin:0"><img src="${rel(path,a.image)}" alt="${esc(a.title)}" loading="lazy" /><figcaption class="cap"><div class="t">${a.title}</div><div class="m">${a.year} · ${a.medium}</div><p class="muted" style="margin-top:.5rem;font-size:.875rem;line-height:1.5">${a.description}</p></figcaption></figure>`).join('')}
      </div>
    </main>` + footer(path) + tail;
}

function pageNotebook(){
  const path='/notebook/';
  return head('Notebook — Just Thinking','Short thoughts, quotes, observations.',path)
    + nav('notebook',path)
    + `<main class="timeline">
      <header style="text-align:center;margin-bottom:3rem">
        <div class="eyebrow">No. 04 — Notebook</div>
        <h1 class="serif" style="font-size:clamp(3rem,7vw,5rem);margin-top:.5rem">Notebook</h1>
        <p class="serif italic" style="color:var(--muted);font-size:1.2rem;margin-top:1rem">Half-formed thoughts, quotes worth keeping, and small observations.</p>
      </header>
      ${notes.map(n=>`<article class="note"><div class="meta" style="font-size:.7rem;text-transform:uppercase;letter-spacing:.18em;color:var(--muted)">${n.kind} · ${n.date}</div><p class="body">${n.body}</p>${n.source?`<p class="src">— ${n.source}</p>`:''}</article>`).join('')}
    </main>` + footer(path) + tail;
}

function pageAbout(){
  const path='/about/';
  const headline = about.headline || 'A small, slow publication.';
  const lastWord = headline.split(' ').pop();
  const lead = headline.slice(0, headline.length - lastWord.length).trim();
  return head('About — Just Thinking', headline, path)
    + nav('about',path)
    + `<main class="container">
      <div class="about">
        <div class="about-img"><img src="${rel(path,'/assets/'+(about.portrait||'about-portrait.jpg'))}" alt="Portrait" /></div>
        <div>
          <div class="eyebrow">About</div>
          <h1 class="serif" style="font-size:clamp(2.5rem,5vw,4rem);margin-top:.5rem;line-height:1.05">${esc(lead)}<br/><span class="it forest">${esc(lastWord)}</span></h1>
          <div style="margin-top:2rem">
            ${about.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}
            ${about.signoff?`<p class="hand sepia" style="font-size:1.5rem">${esc(about.signoff)}</p>`:''}
          </div>
        </div>
      </div>
    </main>` + footer(path) + tail;
}

// ---------- build ----------
async function w(p, html){
  const full = join(OUT, p);
  await mkdir(dirname(full), { recursive: true });
  await writeFile(full, html);
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
await cp(join(ROOT,'src/assets'), join(OUT,'assets'), { recursive: true });
await writeFile(join(OUT,'.nojekyll'),'');
await writeFile(join(OUT,'style.css'), CSS);
await writeFile(join(OUT,'robots.txt'),'User-agent: *\nAllow: /\n');

await w('index.html', pageHome());
await w('essays/index.html', pageEssaysIndex());
for(const e of essays) await w(`essays/${e.slug}/index.html`, pageEssay(e));
await w('podcast/index.html', pagePodcastIndex());
for(const ep of episodes) await w(`podcast/${ep.slug}/index.html`, pageEpisode(ep));
await w('artwork/index.html', pageArtwork());
await w('notebook/index.html', pageNotebook());
await w('about/index.html', pageAbout());

// 404 fallback
await w('404.html', pageHome().replace('<title>Just Thinking', '<title>Not found — Just Thinking'));

console.log('Static site built to', OUT);
