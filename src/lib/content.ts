import essay1 from "@/assets/essay-1.jpg";
import essay2 from "@/assets/essay-2.jpg";
import podcastCover from "@/assets/podcast-cover.jpg";
import art1 from "@/assets/art-1.jpg";
import art2 from "@/assets/art-2.jpg";
import art3 from "@/assets/art-3.jpg";
import art4 from "@/assets/art-4.jpg";

export type Essay = {
  slug: string;
  title: string;
  dek: string;
  date: string;
  readingTime: number;
  cover: string;
  tags: string[];
  body: string;
};

export const essays: Essay[] = [
  {
    slug: "on-keeping-a-notebook",
    title: "On Keeping a Notebook",
    dek: "Why the unfinished sentence may be the most honest one you'll ever write.",
    date: "March 14, 2026",
    readingTime: 7,
    cover: essay1,
    tags: ["writing", "ritual"],
    body: `There is a particular kind of attention that only arrives when you write things down by hand. Not the kind that solves problems — the kind that notices them.

A notebook is a slow medium. It rewards loitering. It punishes certainty. It is, in many ways, the opposite of the internet.

I keep mine in the same coat pocket year after year, and the leather has softened in the shape of my hip. The pages curl. The ink occasionally bleeds. None of this would be tolerated by a product manager.

But the page does something a screen cannot: it asks nothing of you. No notification. No autofill. No suggestion of what you might mean. Just a small, patient rectangle, waiting.

The unfinished sentence, I've come to believe, is where the actual thinking lives. The finished one is just a souvenir.`,
  },
  {
    slug: "the-quiet-internet",
    title: "The Quiet Internet",
    dek: "In praise of the corners of the web that still feel like rooms.",
    date: "February 2, 2026",
    readingTime: 9,
    cover: essay2,
    tags: ["internet", "culture"],
    body: `Somewhere along the way, the internet stopped feeling like a place and started feeling like a feed. The distinction matters. A place has a door. A feed has a faucet.

I find myself returning, more and more, to the quiet corners — the personal sites, the slow newsletters, the channels on Are.na that have been tended for a decade by one person with no agenda except attention.

These places do not optimize for me. They do not know my name. They simply exist, and I can visit, and I can leave, and nothing follows me out.`,
  },
  {
    slug: "the-economy-of-small-mornings",
    title: "The Economy of Small Mornings",
    dek: "What an hour before the house wakes up is actually worth.",
    date: "January 19, 2026",
    readingTime: 5,
    cover: essay1,
    tags: ["work", "ritual"],
    body: `The hour before anyone else is awake is the only hour I own outright. Everything else is borrowed, traded, negotiated. That hour is the rent I pay myself first.`,
  },
];

export type Episode = {
  slug: string;
  number: number;
  title: string;
  guest?: string;
  date: string;
  duration: string;
  cover: string;
  description: string;
  spotify?: string;
  apple?: string;
  youtube?: string;
  notes: { time: string; label: string }[];
};

export const episodes: Episode[] = [
  {
    slug: "the-shape-of-a-good-question",
    number: 12,
    title: "The Shape of a Good Question",
    guest: "Maya Lin",
    date: "March 22, 2026",
    duration: "1h 04m",
    cover: podcastCover,
    description:
      "A long conversation about memorials, attention, and the geometry of grief. Maya speaks slowly. We left every pause in.",
    spotify: "https://open.spotify.com/embed/episode/4rOoJ6Egrf8K2IDAStmA",
    apple: "https://embed.podcasts.apple.com/us/podcast/just-thinking/id1",
    youtube: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    notes: [
      { time: "00:00", label: "Cold open — on listening for shape" },
      { time: "08:42", label: "The Vietnam Memorial as a sentence" },
      { time: "27:10", label: "What competitions teach you about clarity" },
      { time: "51:30", label: "Closing letter" },
    ],
  },
  {
    slug: "writing-as-archaeology",
    number: 11,
    title: "Writing as Archaeology",
    guest: "Robert Macfarlane",
    date: "February 28, 2026",
    duration: "58m",
    cover: podcastCover,
    description:
      "On the words we have lost and the landscapes we lost with them. We recorded outside, near a stream, and a heron interrupted us twice.",
    spotify: "https://open.spotify.com/embed/episode/4rOoJ6Egrf8K2IDAStmA",
    notes: [
      { time: "00:00", label: "The lost dictionary of childhood" },
      { time: "19:14", label: "Why naming things keeps them alive" },
      { time: "46:00", label: "A reading from Landmarks" },
    ],
  },
  {
    slug: "the-craft-of-paying-attention",
    number: 10,
    title: "The Craft of Paying Attention",
    date: "January 30, 2026",
    duration: "42m",
    cover: podcastCover,
    description:
      "A solo episode. Notes I wrote on a train, read out loud, on what attention actually costs.",
    notes: [
      { time: "00:00", label: "Why this is a solo one" },
      { time: "12:00", label: "Three things I stopped doing" },
    ],
  },
];

export type Artwork = {
  slug: string;
  title: string;
  year: number;
  medium: string;
  image: string;
  width: number;
  height: number;
  description: string;
  story?: string;
};

export const artworks: Artwork[] = [
  {
    slug: "two-strokes",
    title: "Two Strokes, One Breath",
    year: 2026,
    medium: "Sumi ink on handmade paper",
    image: art1,
    width: 900,
    height: 1200,
    description: "An exercise in restraint — the whole composition completed in a single exhale.",
    story: "I made this on a quiet Sunday after sitting with an empty page for forty minutes. The second stroke was an accident.",
  },
  {
    slug: "stacks",
    title: "Stacks",
    year: 2025,
    medium: "35mm film, silver gelatin print",
    image: art2,
    width: 1200,
    height: 900,
    description: "Reading room of the Biblioteca Marciana, an hour before closing.",
  },
  {
    slug: "blue-ridge",
    title: "Blue Ridge, From Memory",
    year: 2025,
    medium: "Graphite on journal paper",
    image: art3,
    width: 1000,
    height: 1000,
    description: "Drawn on a train, two weeks after the trip, with the curtains down.",
  },
  {
    slug: "cup-and-pear",
    title: "Cup and Pear",
    year: 2024,
    medium: "Oil on linen",
    image: art4,
    width: 1000,
    height: 1200,
    description: "A small still life. The pear sat there for six days before I finished.",
    story: "The cup belonged to my grandmother. I broke its handle the week after I finished the painting.",
  },
];

export type Note = {
  id: string;
  date: string;
  kind: "thought" | "quote" | "observation" | "link";
  body: string;
  source?: string;
};

export const notes: Note[] = [
  {
    id: "n-12",
    date: "March 28, 2026 · 7:14am",
    kind: "thought",
    body: "Most of what I call indecision is actually unwillingness to feel the loss of the road not taken.",
  },
  {
    id: "n-11",
    date: "March 24, 2026",
    kind: "quote",
    body: "“Attention is the rarest and purest form of generosity.”",
    source: "Simone Weil",
  },
  {
    id: "n-10",
    date: "March 19, 2026",
    kind: "observation",
    body: "The woman in the café asked the waiter for 'a coffee, but slow'. He nodded as if this was a known order.",
  },
  {
    id: "n-9",
    date: "March 15, 2026",
    kind: "thought",
    body: "An interesting life is mostly a function of which boring things you're willing to do daily.",
  },
  {
    id: "n-8",
    date: "March 11, 2026",
    kind: "link",
    body: "Re-reading John Berger's letters to Subcomandante Marcos. Astonishing.",
    source: "tinyletters.cc/berger",
  },
  {
    id: "n-7",
    date: "March 8, 2026",
    kind: "thought",
    body: "Style is what's left after you stop trying to be liked.",
  },
];
