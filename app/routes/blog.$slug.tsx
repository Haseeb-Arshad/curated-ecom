import { Link, useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import styles from "./blog.module.css";
import {
  getPostBySlug,
  type BlogPost,
  formatDate,
  wordCount,
  readingTimeMinutes,
  getOtherPosts,
} from "../data/blog";

export const meta: MetaFunction = ({ params }) => [
  { title: `${params.slug} - Blog` },
];

export async function loader({ params }: LoaderFunctionArgs) {
  const post = getPostBySlug(params.slug);
  if (!post) {
    throw new Response("Not found", { status: 404 });
  }
  return { post };
}

export default function BlogPost() {
  const { post } = useLoaderData<typeof loader>() as { post: BlogPost };
  const words = wordCount(post);
  const mins = readingTimeMinutes(words);
  const more = getOtherPosts(post.slug).slice(0, 3);

  return (
    <article>
      <header className={styles.postHeader}>
        <h1 className={styles.postTitle}>{post.title}</h1>
        <div className={styles.meta}>
          <span>{formatDate(post.date)}</span>
          <span className={styles.dot} aria-hidden="true" />
          <span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 6h16M4 12h10M4 18h7" />
            </svg>
            {" "}
            {words.toLocaleString()} words
          </span>
          <span className={styles.dot} aria-hidden="true" />
          <span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v6l4 2" />
            </svg>
            {" "}
            {mins} m
          </span>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.lead}>
          {post.excerpt.split("\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {post.sections.map((section, i) => (
          <section key={section.heading} className={styles.section}>
            <h2>
              {i + 1}. {section.heading}
            </h2>
            {section.image && (
              <figure className={styles.figure}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <img src={section.image} alt="" loading="lazy" />
              </figure>
            )}
            {section.body.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </section>
        ))}
      </div>

      {post.mentions && post.mentions.length > 0 && (
        <section className={styles.mentions}>
          <h3>Products mentioned</h3>
          <ul className={styles.mentionsList} role="list">
            {post.mentions.map((m) => (
              <li key={m.title}>
                <a className={styles.mentionItem} href={m.href || "#"}>
                  <span className={styles.thumb}>
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <img src={m.image} alt="" loading="lazy" />
                  </span>
                  <span className={styles.mentionText}>
                    <div className={styles.mentionTitle}>{m.title}</div>
                    <div className={styles.mentionBrand}>{m.brand}</div>
                  </span>
                  <span className={styles.arrow} aria-hidden="true">
                    <svg viewBox="0 0 24 24" className="icon"><path d="M9 5l7 7-7 7"/></svg>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {more.length > 0 && (
        <section className={styles.moreReads}>
          <h3>More reads</h3>
          <ul className={styles.moreGrid} role="list">
            {more.map((p) => (
              <li key={p.slug} className={styles.moreCard}>
                <Link to={`/blog/${p.slug}`} className={`${styles.cardLink} ${styles.moreMedia}`} aria-label={p.title}>
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <img src={p.coverImage} alt="" loading="lazy" />
                </Link>
                <div className={styles.moreDate}>{formatDate(p.date)}</div>
                <h4 className={styles.moreTitle}>
                  <Link to={`/blog/${p.slug}`} className={styles.cardLink}>{p.title}</Link>
                </h4>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
