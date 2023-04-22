import { Post } from "@/components/commons";
import { useAuth } from "@/hooks";
import { PostProps } from "@/models";
import { getYearMonthDate } from "@/utils";
import { FC, memo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

interface Props {
  posts: PostProps[];
  pinPostId: string;
  filter: { year?: number; month?: number; date?: number };
}

const PostList: FC<Props> = memo(({ posts, pinPostId, filter }) => {
  const [renderedCount, setRenderCount] = useState(10);
  const getPosts = () => {
    setRenderCount((pre) => pre + 10);
  };
  return (
    <InfiniteScroll
      dataLength={renderedCount}
      next={getPosts}
      hasMore={renderedCount < posts.length}
      loader={<h4>Loading...</h4>}
    >
      <div className="flex flex-col gap-4 overflow-hidden">
        {posts &&
          posts.slice(0, renderedCount).map((post) => {
            if (pinPostId === post._id) return null;
            const [year, month, date] = getYearMonthDate(post.createdAt);
            if (!!filter.year) {
              if (!!filter.month) {
                if (!!filter.date) {
                  if (
                    year === filter.year &&
                    month === filter.month &&
                    date === filter.date
                  ) {
                    return (
                      <Post
                        key={post._id}
                        post={post}
                        view="other-post"
                        isPinned={pinPostId === post?._id}
                        where="profile"
                      />
                    );
                  } else return null;
                }
                if (year === filter.year && month === filter.month) {
                  return (
                    <Post
                      key={post._id}
                      post={post}
                      view="other-post"
                      isPinned={pinPostId === post?._id}
                      where="profile"
                    />
                  );
                } else return null;
              }
              if (year === filter.year) {
                return (
                  <Post
                    key={post._id}
                    post={post}
                    view="other-post"
                    isPinned={pinPostId === post?._id}
                    where="profile"
                  />
                );
              } else return null;
            }
            return (
              <Post
                key={post._id}
                post={post}
                view="other-post"
                isPinned={pinPostId === post?._id}
                where="profile"
              />
            );
          })}
      </div>
    </InfiniteScroll>
  );
});

export default PostList;
