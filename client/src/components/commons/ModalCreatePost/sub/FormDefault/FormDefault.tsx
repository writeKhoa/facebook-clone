import { LexicalEditor, Modal } from "@/components/commons";
import { CloseIcon } from "@/components/commons/Icons";
import { LoadingCircelIcon } from "@/components/commons/Icons/Common.Icon";
import { useAuth, usePosts } from "@/hooks";
import { PostEditProps, User } from "@/models";
import { FC, useEffect, useState } from "react";
import Scrollbar from "react-custom-scrollbars-2";
import { AddImage, AddSomethingToPost, UserAndAudiance } from "./sub";

interface Props {
  isOpenAddImage: boolean;
  onOpenTagForm: () => void;
  onOpenFeelingForm: () => void;
  onOpenAudianceForm: () => void;
  onClose: () => void;
  onOpenAddImage: () => void;
  onCloseAddImage: () => void;
}

const defaultContent =
  '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

const FormDefault: FC<Props> = ({
  isOpenAddImage,

  onOpenTagForm,
  onOpenFeelingForm,
  onOpenAudianceForm,
  onOpenAddImage,
  onCloseAddImage,
  onClose,
}) => {
  const { user, makeRequestWithAuth } = useAuth();
  const { modeEditor, postCreate, postEdit, setPosts, onResetPostCreate } =
    usePosts();

  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoadingUploadPost, setIsLoadingUploadPost] =
    useState<boolean>(false);

  const postActive = modeEditor === "edit" ? postEdit : postCreate;

  const conditionToActiveSubmit =
    postActive.content !== defaultContent ||
    postActive.imageUpload ||
    (modeEditor === "edit" && !!(postActive as PostEditProps)?.preImageUrl) ||
    typeof postActive.feeling === "number" ||
    (postActive?.tags && postActive?.tags?.length > 0);

  const isActiveTag = !!postActive?.tags && postActive?.tags.length > 0;

  const isActiveFeeling = typeof postActive.feeling === "number";

  const handleSubmitPost = async () => {
    try {
      if (!conditionToActiveSubmit) return;
      else {
        if (modeEditor === "edit") {
          setIsLoadingUploadPost(true);
          const formData = new FormData();
          const tagged = !!postActive?.tags
            ? postActive.tags.map((tag) => tag.tagId)
            : [];

          if (postActive.imageUpload) {
            formData.append("image", postActive.imageUpload);
          }
          formData.append("post", JSON.stringify({ ...postActive, tagged }));
          const data = await makeRequestWithAuth(
            "put",
            "/api/v1/posts/update",
            formData
          );
          const newPost = {
            ...data.__newPost,
            userId: {
              _id: user?._id,
              avatarUrl: user?.avatarUrl,
              fullName: user?.fullName,
            },
          };
          setPosts((prevPosts) => {
            const index = prevPosts.findIndex(
              (post) => post._id === newPost._id
            );
            const updatedPosts = [...prevPosts];
            updatedPosts[index] = newPost;
            return updatedPosts;
          });
        } else {
          setIsLoadingUploadPost(true);
          const formData = new FormData();
          const tagged = !!postActive?.tags
            ? postActive.tags.map((tag) => tag.tagId)
            : [];
          if (postActive.imageUpload) {
            formData.append("image", postActive.imageUpload);
          }
          formData.append("post", JSON.stringify({ ...postActive, tagged }));
          const data = await makeRequestWithAuth(
            "post",
            "/api/v1/posts/upload-multer",
            formData
          );
          setPosts((pre) => {
            return [
              {
                ...data?.__post,
                userId: {
                  _id: user?._id,
                  avatarUrl: user?.avatarUrl,
                  fullName: user?.fullName,
                },
                reactions: [],
              },
              ...pre,
            ];
          });
          onResetPostCreate();
          if (postActive?.imageUrlPreview) {
            URL.revokeObjectURL(postActive?.imageUrlPreview);
          }
        }
        onClose();
        onCloseAddImage();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingUploadPost(false);
    }
  };

  useEffect(() => {
    if (modeEditor === "edit") {
      if (postEdit.background !== 0) {
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    } else {
      if (postCreate.background !== 0) {
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    }
  }, [postCreate, postEdit, modeEditor]);
  return (
    <>
      <div className="flex flex-col w-full h-full rounded-lg bg-surface dark:bg-surfaceDark border border-divider dark:border-dividerDark overflow-x-hidden">
        {/* header */}
        <div className="relative shrink-0 h-[60px] border-b border-divider dark:border-dividerDark">
          <div className="flex justify-center items-center w-full h-full">
            <h2 className="text-2024 font-bold text-primaryText dark:text-primaryTextDark">
              <span>
                {modeEditor === "edit" ? "Chỉnh sửa bài viết" : "Tạo bài viết"}
              </span>
            </h2>

            <div
              className="absolute top-3 right-3 flex items-center justify-center w-9 h-9 rounded-full bg-black/10 dark:bg-white/10 text-primaryIcon dark:text-primaryIconDark cursor-pointer"
              onClick={onClose}
            >
              <CloseIcon />
            </div>
          </div>
        </div>

        {/* user and audiance */}
        <div className="shrink-0 mx-4 py-4">
          <UserAndAudiance
            user={user as User}
            onOpenAudiance={onOpenAudianceForm}
            post={postActive}
            onOpenTagForm={onOpenTagForm}
          />
        </div>

        {/* editor */}
        <div className="grow">
          <Scrollbar>
            <div className="w-full h-full">
              <LexicalEditor isOpenAddImage={isOpenAddImage} />
              {isOpenAddImage ? <AddImage onClose={onCloseAddImage} /> : null}
            </div>
          </Scrollbar>
        </div>

        {/* bottom */}
        <div className="shrink-0 py-4">
          <div className="flex justify-between items-center mx-4 p-2 rounded-lg border border-divider dark:border-dividerDark">
            <div className="px-2 text-1214">
              <span className="text-1520 text-primaryText dark:text-primaryTextDark">
                Thêm vào bài viết của bạn
              </span>
            </div>

            <div className="flex items-center -my-1">
              <AddSomethingToPost
                isDisabled={isDisabled}
                onOpenAddImage={onOpenAddImage}
                onOpenTagForm={onOpenTagForm}
                onOpenFeelingForm={onOpenFeelingForm}
                isActiveAddImage={isOpenAddImage}
                isActiveTag={isActiveTag}
                isActiveFeeling={isActiveFeeling}
              />
            </div>
          </div>

          <div className="px-4 pt-4">
            <div
              className={`${
                conditionToActiveSubmit ? "bg-primary" : "bg-white/20"
              } flex items-center justify-center rounded-lg h-9 w-full px-3 text-primaryText dark:text-primaryTextDark cursor-pointer`}
              onClick={handleSubmitPost}
            >
              <span className="text-1418 font-semibold">
                {modeEditor === "edit" ? "Lưu" : "Đăng"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isLoadingUploadPost} wrapperId="loading-upload-post">
        <div className="fixed inset-0 flex justify-center items-center bg-white/50 dark:bg-black/50 z-[100]">
          <div className="flex flex-col justify-center items-center">
            <div className="flex justify-center w-8 h-8 mb-5 text-primaryIcon dark:text-primaryIconDark animate-spin">
              <LoadingCircelIcon width={32} height={32} />
            </div>
            <span className="text-primaryText dark:text-primaryTextDark text-2428">
              Đang đăng
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FormDefault;
