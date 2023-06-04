import axios from "axios";
import { Post } from "./types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersection } from "@mantine/hooks";
import BlogCard from "./BlogCard";
import { useEffect, useRef } from "react";

function App() {
  const fetchData = async (page: number) => {
    const { data } = await axios.get<Post[]>(
      "https://jsonplaceholder.typicode.com/posts"
    );
    return data.slice((page - 1) * 10, page * 10);
  };

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam = 1 }) => await fetchData(pageParam),
    getNextPageParam: (_, pages) => {
      return pages.length + 1;
    },
  });

  const lastPostRef = useRef<HTMLDivElement>(null);
  const { entry, ref } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) fetchNextPage();
  }, [entry, fetchNextPage]);

  const scrollPost = data?.pages.flatMap((page) => page);

  return (
    <div
      ref={lastPostRef}
      className="max-w-5xl mx-auto p-5 flex justify-between gap-x-5"
    >
      <div className="w-1/2">
        {scrollPost?.map((post, i) => {
          if (i === scrollPost.length) {
            return <BlogCard ref={ref} key={post.id} data={post} />;
          }
          return <BlogCard key={post.id} data={post} />;
        })}
      </div>
      <div className="w-1/2 flex flex-col">
        {data?.pages.map((page, i) => (
          <div key={i} className="space-y-3 mb-3">
            {page.map((post) => (
              <BlogCard key={post.id} data={post} />
            ))}
          </div>
        ))}

        {(data?.pages.length ?? 0) < 10 ? (
          <button
            onClick={() => fetchNextPage()}
            className="py-2 px-5 mt-5 text-lg shadow-md self-center border border-slate-300 hover:text-white hover:bg-slate-400 active:bg-slate-500"
          >
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default App;
