import React, { FC } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import JsonToHtml from "../JsonToHtml";

interface Props {
  content?: string;
  imageUrl?: string;
}

const Content1: FC<Props> = ({ content, imageUrl }) => {
  return (
    <div className="text-primaryText dark:text-primaryTextDark">
      <div className="px-4 pb-4 pt-1 text-1520">
        <JsonToHtml content={content} />
      </div>
      {imageUrl ? (
        <div style={{ maxWidth: 590, maxHeight: 590 }}>
          <LazyLoadImage
            className="w-full mx-auto"
            width={590}
            height={590}
            src={imageUrl}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Content1;
