import { EmotionIcon, PictureVideoIcon, TagIcon } from "@/components/commons";
import React, { FC } from "react";

interface Props {
  isDisabled: boolean;
  onOpenAddImage: () => void;
  onOpenTagForm: () => void;
  onOpenFeelingForm: () => void;

  isActiveAddImage: boolean;
  isActiveTag: boolean;
  isActiveFeeling: boolean;
}

const AddSomethingToPost: FC<Props> = ({
  isDisabled,
  isActiveAddImage,
  isActiveFeeling,
  isActiveTag,
  onOpenAddImage,
  onOpenTagForm,
  onOpenFeelingForm,
}) => {
  const handleAddImage = () => {
    if (isDisabled) return;
    onOpenAddImage();
  };
  return (
    <div className="flex gap-1">
      <div
        className={`flex items-center justify-center w-9 h-9 cursor-pointer
        ${isActiveAddImage ? "dark:bg-black" : ""}
        ${
          isDisabled
            ? ""
            : "rounded-full hover:bg-black/10 dark:hover:bg-white/10"
        }`}
        onClick={handleAddImage}
      >
        <PictureVideoIcon isDisabled={isDisabled} />
      </div>
      <div
        className={`${
          isActiveTag ? "dark:bg-black" : ""
        } flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer`}
        onClick={onOpenTagForm}
      >
        <TagIcon />
      </div>
      <div
        className={`${
          isActiveFeeling ? "dark:bg-black" : ""
        } flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer`}
        onClick={onOpenFeelingForm}
      >
        <EmotionIcon />
      </div>
    </div>
  );
};

export default AddSomethingToPost;

{
  /* <AddSomethingToPost isDisabled={isDisabled}
              onOpenAddImage={onOpenAddImage}
              onOpenTagForm={onOpenTagForm}
              onOpenFeelingForm={onOpenFeelingForm}

              isActiveAddImage={isOpenAddImage}
              isActiveTag={!!headerPost.tags}
              isActiveFeeling={!!headerPost.feelings}
            /> */
}
