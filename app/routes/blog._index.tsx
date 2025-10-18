import { Link, type MetaFunction } from "react-router";
import styles from "./blog.module.css";
import { getAllPosts, formatDate } from "../data/blog";

export const meta: MetaFunction = () => [{ title: "Blog" }];

export async function loader() {
  const posts = getAllPosts();
  return { posts };
}

export default function BlogIndex() {
  // Since blog data is static, we can import directly without useLoaderData
  const { posts } = { posts: getAllPosts() };
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>Blog</h1>
        <p className={styles.subtitle}>
          Reviews, lists and everything in between about the products we love.
        </p>
      </header>

      <ul className={styles.grid} role="list">
        {posts.map((post) => (
          <li key={post.slug} className={styles.card}>
            <Link to={`/blog/${post.slug}`} aria-label={post.title} className={styles.media}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <img src={post.coverImage} alt="" loading="lazy" />
            </Link>
            <div className={styles.date}>{formatDate(post.date)}</div>
            <h2 className={styles.cardTitle}>
              <Link to={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
          </li>
        ))}
      </ul>
    </div>
  );
}
