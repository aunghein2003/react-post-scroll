import { FC, forwardRef } from "react";
import { Post } from "./types";

interface BlogCardProps {
  data: Post;
}

const BlogCard = forwardRef<HTMLDivElement, BlogCardProps>(({ data }, ref) => {
  return (
    <div ref={ref} className="p-5 border border-sky-500 rounded-md shadow-md">
      <h1 className="text-2xl font-semibold mb-3">
        {data.id}. {data.title}
      </h1>
      <p className="text-justify">{data.body}</p>
    </div>
  );
});
export default BlogCard;
