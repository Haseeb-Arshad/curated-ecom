export type BlogSection = {
  heading: string;
  image?: string;
  body: string[];
};

export type Mention = {
  title: string;
  brand: string;
  image: string;
  href?: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  date: string; // ISO date
  excerpt: string;
  coverImage: string;
  sections: BlogSection[];
  mentions?: Mention[];
};

// Utility to format date as "12 Oct 2025"
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function wordCount(post: BlogPost) {
  const text = [post.excerpt, ...post.sections.flatMap((s) => s.body)].join(" ");
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function readingTimeMinutes(words: number, wpm = 160) {
  return Math.max(1, Math.round(words / wpm));
}

export const posts: BlogPost[] = [
  {
    slug: "5-audio-products-that-sound-as-good-as-they-look",
    title: "5 audio products that sound as good as they look",
    date: "2025-10-12",
    excerpt:
      "Sound is more than what we hear. It shapes how we move, focus, and inhabit a space. When design and technology meet with care, audio devices become more than tools.",
    coverImage: "/images/blog/transparent-speaker.svg",
    sections: [
      {
        heading: "Transparent Speaker",
        image: "/images/blog/transparent-speaker.svg",
        body: [
          "Built entirely from glass and aluminum, the Transparent Speaker takes honesty in design to its highest form.",
          "Every wire, driver, and screw is visible, making its internal architecture part of the aesthetic. The result is a speaker that feels open and architectural, merging form and function with quiet precision.",
          "Its sound signature is warm and balanced. The modular build allows for upgrades and repairs, extending its lifespan for decades.",
        ],
      },
      {
        heading: "Beosound 2",
        image: "/images/blog/beosound-2.svg",
        body: [
          "A sculptural object that fills a room with 360° sound. Its tapered aluminum body eliminates visual bulk while projecting clear, even audio in every direction.",
          "Touch controls are intuitive and satisfying—the kind of interface you don't need to think about.",
        ],
      },
      {
        heading: "O1 Desk Audio",
        image: "/images/blog/o1-desk-audio.svg",
        body: [
          "A stacked set of modules that celebrate dials and tactility. It's the rare audio system that feels just as considered off as it does on.",
        ],
      },
    ],
    mentions: [
      { title: "P—1 Pepper Mill", brand: "Crust", image: "/images/mentions/pepper-mill.svg" },
      { title: "Clock", brand: "Loftie", image: "/images/mentions/clock.svg" },
      { title: "Scissors", brand: "HMM", image: "/images/mentions/scissors.svg" },
      { title: "Recycler", brand: "Simplehuman", image: "/images/mentions/recycler.svg" },
      { title: "Sync Dual", brand: "Typhur", image: "/images/mentions/sync-dual.svg" },
    ],
  },
  {
    slug: "5-aesthetic-charging-devices-that-could-belong-on-any-desk",
    title:
      "5 aesthetic charging devices that could belong on any desk",
    date: "2025-10-09",
    excerpt:
      "Charging doesn’t have to be an eyesore. These designs prioritize material, proportion, and restraint to blend into thoughtful workspaces.",
    coverImage: "/images/blog/o1-desk-audio.svg",
    sections: [
      {
        heading: "Magnetic charging puck",
        image: "/images/blog/o1-desk-audio.svg",
        body: [
          "A compact, architectural puck with an anodized finish and a soft cable that stays out of the way.",
        ],
      },
    ],
  },
  {
    slug: "5-coffee-table-books-every-home-should-have",
    title: "5 coffee table books every home should have",
    date: "2025-10-08",
    excerpt:
      "Books are the easiest way to add texture and point of view to a space. These titles reward slow afternoons and curious hands.",
    coverImage: "/images/blog/design-book.svg",
    sections: [
      {
        heading: "The Design Book",
        image: "/images/blog/design-book.svg",
        body: [
          "A compact tour through iconic objects—sharp, informative, and timeless.",
        ],
      },
    ],
  },
];

export function getAllPosts() {
  return posts;
}

export function getPostBySlug(slug?: string) {
  return posts.find((p) => p.slug === slug);
}

export function getOtherPosts(slug?: string) {
  return posts.filter((p) => p.slug !== slug);
}
