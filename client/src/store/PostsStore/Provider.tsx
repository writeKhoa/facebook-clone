import { PostCreateProps, PostEditProps } from "@/models";
import {
  FC,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { PostsStoreContext } from "./context";

import { PostProps } from "@/models";

interface Props {
  children: ReactNode;
}

const initContent =
  '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

const Provider: FC<Props> = ({ children }) => {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [pinPost, setPinPost] = useState<PostProps | null>(null);
  const [pinPostId, setPinPostId] = useState<string>("");
  const [formActive, setFormActive] = useState<
    "default" | "feeling" | "tag" | "defaultAndImage" | "audiance"
  >("default");
  const [modeEditor, setModeEditor] = useState<"create" | "edit">("create");
  const [isOpenEditor, setIsOpenEditor] = useState<boolean>(false);

  const [editPostId, setEditPostId] = useState<string>("");

  const [postCreate, setPostCreate] = useState<PostCreateProps>({
    audiance: 2,
    content: initContent,
    background: 0,
    format: 1,
    imageUrlPreview: "",
    imageUpload: null,
  });

  const [postEdit, setPostEdit] = useState<PostEditProps>({
    _id: "",
    audiance: 2,
    content: initContent,
    background: 0,
    format: 1,

    isDiscardOldImage: false,
    preImageUrl: "",
    imageUrlPreview: "",
    imageUpload: null,
    hasPreImageUrl: false,
  });

  const onResetPostCreate = () => {
    setPostCreate({
      audiance: 2,
      content: initContent,
      background: 0,
      format: 1,

      imageUrlPreview: "",
      imageUpload: null,
    });
  };

  const onResetPostEdit = () => {
    setPostEdit({
      _id: "",
      audiance: 2,
      content: initContent,
      background: 0,
      format: 1,

      isDiscardOldImage: false,
      preImageUrl: "",
      imageUrlPreview: "",
      hasPreImageUrl: false,
      imageUpload: null,
    });
  };

  useLayoutEffect(() => {
    if (!!editPostId) {
      const newPostEdit = posts.find((post) => {
        return post._id === editPostId;
      });
      if (newPostEdit) {
        const {
          _id,
          tags,
          audiance,
          format,
          feeling,
          background,
          content,
          imageUrl,
          publicId,
        } = newPostEdit;
        setPostEdit({
          _id,
          tags,
          audiance,
          feeling,
          background,
          content,
          format,

          preImageUrl: imageUrl,
          prePublicId: publicId,
          isDiscardOldImage: false,
          hasPreImageUrl: !!imageUrl,
          imageUrlPreview: "",
          imageUpload: null,
        });
      }
    }
  }, [editPostId, posts, setPostEdit]);
  const value = {
    posts,
    pinPost,
    pinPostId,
    postCreate,
    postEdit,
    isOpenEditor,
    modeEditor,
    editPostId,
    formActive,
    setPinPost,
    setPinPostId,
    setFormActive,
    setPosts,
    setPostCreate,
    setPostEdit,
    setEditPostId,
    setModeEditor,
    setIsOpenEditor,
    onResetPostCreate,
    onResetPostEdit,
  };
  return (
    <PostsStoreContext.Provider value={value}>
      {children}
    </PostsStoreContext.Provider>
  );
};

export default Provider;
