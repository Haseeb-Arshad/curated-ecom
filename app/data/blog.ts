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

// Utility to format date as "19 Oct 2025"
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
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
    slug: "best-minimalist-leather-wallets-worth-buying",
    title: "Best minimalist leather wallets worth buying",
    date: "2025-10-20",
    excerpt:
      "Slim profiles, quality leather, and considered details. These wallets get out of the way and age beautifully.",
    coverImage: "/images/blog/wallet.png", // provide this PNG in public/images/blog
    sections: [
      {
        heading: "Why minimal wallets win",
        image: "/images/blog/wallet.png",
        body: [
          "A good minimalist wallet keeps bulk low without compromising on tactility or longevity.",
          "Look for clean edges, durable stitching, and leather that develops character rather than wearing out.",
        ],
      },
    ],
  },
  {
    slug: "5-essential-accessories-for-your-new-iphone",
    title: "5 essential accessories for your new iPhone",
    date: "2025-10-19",
    excerpt:
      "A new iPhone deserves more than quick add-ons.\n\nThe right accessories refine how it fits into daily life, how it rests on a desk, and how it feels in hand. Each piece in this collection is made to last, shaped by material honesty and precision. Together they form a quiet system of accessories that extend function without adding noise.\n\nEvery object here shares a single quality: purpose. Whether crafted from leather, metal, or glass, these accessories offer a complete balance between protection, power, and simplicity. They are built to be used daily and kept for years, turning the iPhone into a calmer, more tactile part of life.",
    coverImage: "/images/Analogue_Pocket.png",
    sections: [
      {
        heading: "Nomad Base One Max 3-in-1",
        image: "/images/Analogue_Pocket.png",
        body: [
          "Machined from solid metal and finished with a polished glass charging surface, the Nomad Base One Max brings weight and presence to any workspace. It charges an iPhone, Apple Watch, and AirPods simultaneously through precise MagSafe alignment. The structure remains stable for one-handed use, and the weighted base keeps it firmly in place.",
        ],
      },
    ],
    mentions: [
      {
        title: "Base One Max 3-in-1",
        brand: "Nomad",
        image: "/images/Analogue_Pocket.png",
        href: "https://amazon.com/dp/B08N5WRWNW",
      },
      {
        title: "121 MagSafe Pebbled Leather Case",
        brand: "Grams28",
        image: "/images/fellow_stagg.png",
        href: "https://amazon.com/dp/B09JQJQJQJ",
      },
      {
        title: "Magnetic Leather Card Holder",
        brand: "Elago",
        image: "/images/Void_V02MKII.png",
        href: "https://amazon.com/dp/B08XQXQXQX",
      },
      {
        title: "Modern Leather Case",
        brand: "Nomad",
        image: "/images/Grau_Salt.png",
        href: "https://amazon.com/dp/B09XYXYXYX",
      },
      {
        title: "iRoiClassic Power Bank | Magnetic",
        brand: "Native Union",
        image: "/images/Xiaomi Cordless Drill.png",
        href: "https://amazon.com/dp/B08ZQZQZQZ",
      },
    ],
  },
  {
    slug: "the-best-minimalist-pc-cases-no-rgb-all-class",
    title: "The best minimalist PC cases: No RGB, all class",
    date: "2025-10-18",
    excerpt:
      "For rigs that favor airflow, materials, and proportion over flashing lights.",
    coverImage: "/images/blog/fractal-north.png", // provide this PNG in public/images/blog
    sections: [
      {
        heading: "Why they stand out",
        image: "/images/blog/fractal-north.png",
        body: [
          "Warmer materials and clean geometry keep builds timeless without compromising thermals.",
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
