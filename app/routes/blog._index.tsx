import { type MetaFunction } from "react-router";
import styles from "./blog.module.css";
import { getAllPosts } from "../data/blog";
import BlogCard from "../components/BlogCard";

export const meta: MetaFunction = () => [{ title: "Blog" }];

export async function loader() {
  const posts = getAllPosts();
  return { posts };
}

export default function BlogIndex() {
  // Blog data is static, so we can import it synchronously
  const posts = getAllPosts();

  return (
    <section className={styles.page} aria-labelledby="blog-heading">
      <div className={styles.wrapper}>
        <h1 id="blog-heading" className="visually-hidden">Blog</h1>

        <ul className={styles.grid} role="list">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </ul>
      </div>
    </section>
  );
}
