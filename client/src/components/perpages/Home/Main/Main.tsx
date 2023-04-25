import { CreatePost, ModalCreatePost, Post } from "@/components/commons";
import { useAuth, usePosts } from "@/hooks";
import { PostProps } from "@/models";
import { FC, memo, useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { NoMorePosts } from "./sub";

interface Props {
  postsProps: PostProps[];
}
interface PropsPosts {
  posts: PostProps[];
  isNoMorePosts: boolean;
  getPosts: () => void;
}

const Posts: FC<PropsPosts> = memo(({ posts, isNoMorePosts, getPosts }) => {
  const { user } = useAuth();
  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={getPosts}
      hasMore={!isNoMorePosts}
      loader={<h4>Loading...</h4>}
      endMessage={<NoMorePosts />}
    >
      <div className="flex flex-col gap-4">
        {posts &&
          posts.map((post) => {
            return (
              <Post
                key={post._id}
                post={{ ...post }}
                view={post.userId._id === user?._id ? "my-post" : "other-post"}
                where="home"
                isPinned={false}
              />
            );
          })}
      </div>
    </InfiniteScroll>
  );
});

const Main: FC<Props> = ({ postsProps }) => {
  const { makeRequestWithAuth, user } = useAuth();
  const {
    posts,
    isOpenEditor,
    setPosts,
    onResetPostCreate,
    setIsOpenEditor,
    setModeEditor,
    setFormActive,
  } = usePosts();
  const [isNoMorePosts, setIsNoMorePosts] = useState<boolean>(false);

  const [page, setPage] = useState<number>(2);

  const handleOpenCreatePost = () => {
    setIsOpenEditor((pre) => !pre);
    setModeEditor("create");
  };

  const handleOpenFeeling = () => {
    setIsOpenEditor((pre) => !pre);
    setModeEditor("create");
    setFormActive("feeling");
  };

  const handleOpenAddImage = () => {
    setIsOpenEditor((pre) => !pre);
    setModeEditor("create");
    setFormActive("defaultAndImage");
  };

  const handleCloseCreatePost = () => {
    setIsOpenEditor((pre) => !pre);
  };

  const getPosts = useCallback(async () => {
    try {
      if (isNoMorePosts) return;
      const page_size = 10;
      const data = await makeRequestWithAuth(
        "get",
        `/api/v1/posts/home-posts/?page_idx=${page}&page_size=${page_size}`
      );
      setPosts((pre) => {
        return [...pre, ...data.__posts];
      });
      setPage((pre) => pre + 1);
      if (data.__posts.length < page_size) {
        setIsNoMorePosts(true);
      }
    } catch (error) {
      console.log({ error });
    }
  }, [page, isNoMorePosts]);

  useEffect(() => {
    if (postsProps.length > 0) {
      if (postsProps.length < 10) {
        setPosts([...postsProps]);
        setIsNoMorePosts(true);
      } else {
        setPosts([...postsProps]);
      }
    } else {
      setIsNoMorePosts(true);
    }
  }, [postsProps]);

  useEffect(() => {
    return () => {
      setPosts([]);
      onResetPostCreate();
    };
  }, []);

  return (
    <div className="w-full bg-space dark:bg-spaceDark">
      <div className="w-full max-w-[590px] mx-auto mt-2">
        <CreatePost
          id={user?._id || ""}
          avatarUrl={user?.avatarUrl || ""}
          firstName={user?.firstName || ""}
          onOpenCreatePost={handleOpenCreatePost}
          onOpenAddImage={handleOpenAddImage}
          onOpenAddFeeling={handleOpenFeeling}
        />
        <Posts
          getPosts={getPosts}
          posts={posts}
          isNoMorePosts={isNoMorePosts}
        />
        {isOpenEditor && (
          <ModalCreatePost
            isOpen={isOpenEditor}
            onClose={handleCloseCreatePost}
          />
        )}
      </div>
    </div>
  );
};

export default Main;
