import { CloseIcon } from "@/components/commons/Icons";
import { AddImageIcon } from "@/components/commons/Icons/EditorState.Icon";
import { usePosts } from "@/hooks";
import { ChangeEvent, FC, useRef } from "react";

interface Props {
  onClose: () => void;
}

const AddImage: FC<Props> = ({ onClose }) => {
  const { modeEditor, postCreate, postEdit, setPostCreate, setPostEdit } =
    usePosts();
  const inputRef = useRef<HTMLInputElement>(null);

  const preImageEdit = postEdit.hasPreImageUrl ? postEdit.preImageUrl : "";
  const imagePreview =
    modeEditor === "edit"
      ? postEdit.imageUrlPreview ||
        (postEdit.isDiscardOldImage ? postEdit.imageUrlPreview : preImageEdit)
      : postCreate.imageUrlPreview;

  const handleClickDiv = () => {
    if (inputRef.current) {
      inputRef?.current.click();
    }
  };

  const handleOnChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imagePreview = URL.createObjectURL(file);
      if (modeEditor === "edit") {
        setPostEdit((pre) => {
          return {
            ...pre,
            imageUpload: file,
            imageUrlPreview: imagePreview,
          };
        });
      } else {
        setPostCreate((pre) => {
          return {
            ...pre,
            imageUpload: file,
            imageUrlPreview: imagePreview,
          };
        });
      }
    }
  };

  const handleClose = () => {
    if (modeEditor === "edit") {
      if (postEdit.hasPreImageUrl) {
        if (postEdit.isDiscardOldImage) {
          setPostEdit((pre) => {
            return {
              ...pre,
              imageUpload: null,
              imageUrlPreview: "",
            };
          });
        } else {
          setPostEdit((pre) => {
            return {
              ...pre,
              isDiscardOldImage: true,
            };
          });
        }
      } else {
        if (postEdit?.imageUrlPreview) {
          URL.revokeObjectURL(postEdit?.imageUrlPreview);
          setPostEdit((pre) => {
            return {
              ...pre,
              imageUpload: null,
              imageUrlPreview: "",
            };
          });
        }
      }
    } else {
      if (postCreate?.imageUrlPreview) {
        URL.revokeObjectURL(postCreate?.imageUrlPreview);
      }
      setPostCreate((pre) => {
        return {
          ...pre,

          imageUpload: null,
          imageUrlPreview: "",
        };
      });
    }
    onClose();
  };

  return (
    <div className="mt-8 mx-2 border border-divider dark:border-dividerDark rounded-lg">
      <div className="relative p-2">
        <div
          className="absolute top-3 right-3 w-7 h-7 flex justify-center items-center rounded-full bg-white/50 dark:bg-black/50 hover:bg-white/60 dark:hover:bg-black/60 text-primaryIcon dark:text-primaryIconDark cursor-pointer"
          onClick={handleClose}
        >
          <CloseIcon width={16} height={16} />
        </div>

        {!!imagePreview ? (
          <img src={imagePreview} className="rounded-lg w-full h-full" />
        ) : (
          <div
            className="w-full h-full bg-black/5 dark:bg-white/5 rounded-lg cursor-pointer hover:bg-black/20 dark:hover:bg-white/20"
            onClick={handleClickDiv}
          >
            <input
              className="hidden"
              type="file"
              ref={inputRef}
              onChange={handleOnChangeFile}
            />

            <div className="flex justify-center items-center py-14">
              <div className="flex flex-col items-center">
                <div className="flex justify-center items-center w-10 h-10 rounded-full bg-black/20 dark:bg-white/20">
                  <AddImageIcon />
                </div>
                <span className="my-1 text-1716 font-medium text-primaryText dark:text-primaryTextDark">
                  Thả ảnh/video
                </span>
                <span className="mt-1 text-1214 text-primaryText dark:text-primaryTextDark">
                  hoặc kéo và thả
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddImage;
