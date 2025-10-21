import { Link } from "react-router";
import styles from "./BlogCard.module.css";
import type { BlogPost } from "../data/blog";
import { formatDate } from "../data/blog";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <li className={styles.item}>
      <Link to={`/blog/${post.slug}`} className={styles.card} aria-label={post.title}>
        <div className={styles.media}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img
            src={post.coverImage}
            alt=""
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              if (target.src.endsWith("placeholder.svg")) return;
              target.src = "/images/placeholder.svg";
            }}
          />
        </div>
        <div className={styles.body}>
          <time className={styles.date} dateTime={post.date}>
            {formatDate(post.date)}
          </time>
          <h2 className={styles.title}>{post.title}</h2>
        </div>
      </Link>
    </li>
  );
}
