import { audianceConfig } from "@/configs";
import { useEditorPostState, usePosts } from "@/hooks";
import { FC, useEffect, useState } from "react";
import { HeaderReturn } from "../../commons";
import { AudianceItem } from "./sub";

interface Props {
  onReturn: () => void;
  // audiance: 1 | 2 | 3;
}

const FormAudiance: FC<Props> = ({ onReturn }) => {
  const { modeEditor, postCreate, postEdit, setPostCreate, setPostEdit } =
    usePosts();
  const [audianceTemporary, setAudianceTemporary] = useState<1 | 2 | 3 | null>(
    null
  );

  const handleConfirmAudiance = () => {
    if (typeof audianceTemporary === "number") {
      if (modeEditor === "edit") {
        setPostEdit((pre) => {
          return {
            ...pre,
            audiance: audianceTemporary,
          };
        });
      } else {
        setPostCreate((pre) => {
          return {
            ...pre,
            audiance: audianceTemporary,
          };
        });
      }
    }
    onReturn();
  };

  const handleSelectAudiance = (audiance: 1 | 2 | 3) => {
    setAudianceTemporary(audiance);
  };

  useEffect(() => {
    if (modeEditor === "edit") {
      setAudianceTemporary(postEdit.audiance);
    } else {
      setAudianceTemporary(postCreate.audiance);
    }
  }, [modeEditor, postEdit, postCreate]);

  return (
    <div className="w-full h-full bg-surface dark:bg-surfaceDark rounded-lg border border-divider dark:border-dividerDark">
      <HeaderReturn title="Đối tượng của bài viết" onReturnDefault={onReturn} />

      <div className="p-4">
        <h2 className="text-1720 font-semibold text-primaryText dark:text-primaryTextDark">
          Ai có thể xem bài viết của bạn?
        </h2>
        <div className="py-2">
          <span className="text-1520 text-secondaryText dark:text-secondaryTextDark">
            Bài viết của bạn sẽ hiển thị ở Bảng feed, trang cá nhân và kết quả
            tìm kiếm.
          </span>
        </div>
        <span className="text-1520 text-secondaryText dark:text-secondaryTextDark">
          Tuy đối tượng mặc định là{" "}
          {(() => {
            switch (audianceTemporary) {
              case 1:
                return <span className="font-semibold">Chỉ mình tôi</span>;
              case 2:
                return <span className="font-semibold">Bạn bè</span>;
              case 3:
                return <span className="font-semibold">Công khai</span>;
              default:
                return <></>;
            }
          })()}
          , nhưng bạn có thể thay đổi đối tượng của riêng bài viết này.
        </span>
      </div>

      <div>
        {audianceConfig.map((item, index) => {
          return (
            <AudianceItem
              key={index}
              props={item}
              isSelect={audianceTemporary === item.audiance}
              onSelectAudiance={() => handleSelectAudiance(item.audiance)}
            />
          );
        })}
      </div>

      <div className="flex justify-end px-4 w-full">
        <div className="m-1">
          <div
            className="flex items-center h-9 px-3 rounded-md hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            onClick={() => onReturn()}
          >
            <span className="text-1520 text-primary font-semibold">Hủy</span>
          </div>
        </div>

        <div className="m-1">
          <div
            className="flex items-center h-9 px-10 bg-primary rounded-md cursor-pointer"
            onClick={handleConfirmAudiance}
          >
            <span className="text-1520 text-primaryText dark:text-primaryTextDark font-semibold">
              Xong
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormAudiance;
