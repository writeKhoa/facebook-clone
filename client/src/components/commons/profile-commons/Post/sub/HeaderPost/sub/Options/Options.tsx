import { FC, SyntheticEvent } from "react";
import {
  DeletePostIcon,
  HiddenPostIcon,
  EditPostIcon,
  PinPostIcon,
  UnPinPost,
} from "@/components/commons/Icons";
import { OptionItem } from "./sub";
import { useAuth, usePosts } from "@/hooks";

interface Props {
  view: "other-post" | "my-post";
  _id: string;
  isPinned: boolean;
  where: "profile" | "home";
  onClose: () => void;
}

const Options: FC<Props> = ({ view, isPinned, _id, where, onClose }) => {
  const { makeRequestWithAuth } = useAuth();
  const {
    posts,
    setPosts,
    setIsOpenEditor,
    setModeEditor,
    setEditPostId,
    setPinPost,
    setPinPostId,
  } = usePosts();
  const handleDeletePost = async (e: SyntheticEvent) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      setPosts((pre) => {
        const newPosts = pre.filter((post) => {
          return post._id !== _id;
        });
        return [...newPosts];
      });
      onClose();
      await makeRequestWithAuth("post", "/api/v1/posts/delete", {
        postId: _id,
      });
    } catch (error) {
      console.log({ error });
    }
  };
  const handleHiddenPost = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPosts((pre) => {
      const newPosts = pre.filter((post) => {
        return post._id !== _id;
      });
      return [...newPosts];
    });
    onClose();
  };

  const handleEdit = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpenEditor(true);
    setEditPostId(_id);
    setModeEditor("edit");
    onClose();
  };

  const handlePinPost = async (e: SyntheticEvent) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      const pinPost = posts.find((post) => post._id === _id);
      setPinPost(pinPost || null);
      setPinPostId(_id);
      setIsOpenEditor(true);
      await makeRequestWithAuth("post", "/api/v1/posts/pin-post", {
        postId: _id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnPinPost = async (e: SyntheticEvent) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      setPinPostId("");
      setIsOpenEditor(true);
      await makeRequestWithAuth("post", "/api/v1/posts/unpin-post");
    } catch (error) {
      console.log({ error });
    }
  };
  return (
    <div className="w-80 py-2 rounded-md bg-surface dark:bg-surfaceDark my-boxshadow z-10">
      {view === "my-post" ? (
        <>
          {!isPinned && where === "profile" && (
            <OptionItem
              title="Ghim bài viết"
              onHandle={handlePinPost}
              Icon={PinPostIcon}
            />
          )}
          {isPinned && where === "profile" && (
            <OptionItem
              title="Bỏ ghim bài viết"
              onHandle={handleUnPinPost}
              Icon={UnPinPost}
            />
          )}

          <OptionItem
            title="Chỉnh sửa bài viết"
            onHandle={handleEdit}
            Icon={EditPostIcon}
          />

          <OptionItem
            title="Xóa bài viết"
            onHandle={handleDeletePost}
            Icon={DeletePostIcon}
          />
        </>
      ) : (
        <>
          <OptionItem
            title="Ẩn bài viết"
            onHandle={handleHiddenPost}
            Icon={HiddenPostIcon}
          />
        </>
      )}
    </div>
  );
};

export default Options;
