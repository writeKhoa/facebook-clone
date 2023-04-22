import { Modal } from "@/components/commons";
import { usePosts } from "@/hooks";
import { FC, useEffect, useState } from "react";
import constants from "./config/constants";
import { FormAudiance, FormDefault, FormFeeling, FormTag } from "./sub";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ModalCreatePost: FC<Props> = ({ isOpen, onClose }) => {
  const {
    modeEditor,
    postCreate,
    postEdit,
    formActive,
    setEditPostId,
    onResetPostEdit,
    setFormActive,
  } = usePosts();

  const [isOpenAddImage, setIsOpenAddImage] = useState<boolean>(false);

  const handleReturnDefault = () => setFormActive("default");

  const handleCloseAndImage = () => {
    setFormActive("default");
    setIsOpenAddImage(false);
  };

  const height = () => {
    const postActive = modeEditor === "edit" ? postEdit : postCreate;
    if (isOpenAddImage) {
      return constants.image;
    }
    switch (formActive) {
      case "default":
        if (postActive.format === 1) return constants.default;
        return constants.image;
      case "tag":
        return constants.tag;
      case "feeling":
        return constants.feeling;
      case "audiance":
        return constants.audiance;
    }
  };

  useEffect(() => {
    if (modeEditor === "edit") {
      if (!!postEdit.preImageUrl && !postEdit.isDiscardOldImage) {
        setIsOpenAddImage(true);
      }
    } else {
      if (!!postCreate.imageUpload || formActive === "defaultAndImage") {
        setIsOpenAddImage(true);
      }
    }
  }, [postCreate, postEdit, modeEditor]);

  useEffect(() => {
    return () => {
      onResetPostEdit();
      setEditPostId("");
    };
  }, []);

  return (
    <Modal isOpen={isOpen} wrapperId="modal-create-post">
      <div className="fixed inset-0 bg-white/50 dark:bg-black/50 overscroll-auto z-[99]">
        <div className="relative w-full h-full">
          <div
            className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 overflow-hidden"
            style={{
              width: 500,
              height: height(),
            }}
          >
            <div
              className={`absolute top-0 left-0 w-full h-full ${
                formActive === "default" || formActive === "defaultAndImage"
                  ? ""
                  : "translate-x-full"
              } `}
            >
              <FormDefault
                isOpenAddImage={isOpenAddImage}
                onClose={onClose}
                onOpenTagForm={() => setFormActive("tag")}
                onOpenFeelingForm={() => setFormActive("feeling")}
                onOpenAudianceForm={() => setFormActive("audiance")}
                onOpenAddImage={() => setIsOpenAddImage(true)}
                onCloseAddImage={handleCloseAndImage}
              />
            </div>

            <div
              className={`absolute top-0 left-0 w-full h-full ${
                formActive !== "default" && formActive !== "defaultAndImage"
                  ? ""
                  : "translate-x-full"
              } `}
            >
              {formActive !== "default" && formActive !== "defaultAndImage" && (
                <>
                  {(() => {
                    switch (formActive) {
                      case "feeling":
                        return (
                          <FormFeeling onReturnDefault={handleReturnDefault} />
                        );
                      case "audiance":
                        return <FormAudiance onReturn={handleReturnDefault} />;
                      case "tag":
                        return (
                          <FormTag onReturnDefault={handleReturnDefault} />
                        );
                      default:
                        return <></>;
                    }
                  })()}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalCreatePost;
