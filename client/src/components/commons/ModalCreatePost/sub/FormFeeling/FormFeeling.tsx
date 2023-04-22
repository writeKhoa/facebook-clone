import { CustomScrollbar } from "@/components/commons";
import { FindIcon } from "@/components/commons/Icons";
import { feelings } from "@/configs";
import { usePosts } from "@/hooks";
import { FC } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { HeaderReturn } from "../../commons";
import constant from "../../config/constants";

interface Props {
  onReturnDefault: () => void;
}

const FormFeeling: FC<Props> = ({ onReturnDefault }) => {
  const { modeEditor, postCreate, postEdit, setPostCreate, setPostEdit } =
    usePosts();

  const handleSelectFeeling = (feel: number) => {
    if (modeEditor === "edit") {
      setPostEdit((pre) => {
        if (feel === pre?.feeling) {
          return {
            ...pre,
            feeling: undefined,
          };
        }
        return {
          ...pre,
          feeling: feel,
        };
      });
    } else {
      setPostCreate((pre) => {
        if (feel === pre?.feeling) {
          return {
            ...pre,
            feeling: undefined,
          };
        }
        return {
          ...pre,
          feeling: feel,
        };
      });
    }
    onReturnDefault();
  };

  return (
    <div
      className="w-full rounded-lg bg-surface dark:bg-surfaceDark"
      style={{ height: constant.feeling }}
    >
      <HeaderReturn
        title="Bạn đang cảm thấy thế nào?"
        onReturnDefault={onReturnDefault}
      />

      <div className="h-[60px] w-full">
        <div className="inline-block h-full">
          <div className="relative flex items-center h-full px-4 text-1214">
            <span className="text-1520 text-primary font-semibold">
              Cảm xúc
            </span>
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary"></div>
          </div>
        </div>
      </div>

      <div className="flex items-center px-4 h-[52px]">
        <div className="grow flex w-full h-9">
          <div className="flex items-center rounded-l-full w-4 pl-2.5 h-9 box-content bg-black/20 dark:bg-white/20 cursor-pointer">
            <span className="text-primaryIcon dark:text-primaryIconDark">
              <FindIcon />
            </span>
          </div>
          <input
            type="text"
            className="w-full rounded-r-full bg-black/20 dark:bg-white/20 px-2 pb-1.5 caret-secondaryText dark:caret-secondaryTextDark"
            placeholder="Tìm kiếm"
          />
        </div>
      </div>

      <div className="p-2" style={{ height: 370 }}>
        <CustomScrollbar>
          <ul className="grid grid-cols-2 w-full">
            {feelings.map((item, index) => {
              const feelCurrent =
                modeEditor === "edit" ? postEdit.feeling : postCreate.feeling;

              return (
                <li
                  key={item.title}
                  className={`${
                    feelCurrent === index ? "bg-white/50 dark:bg-black/50" : ""
                  } p-2 h-9 box-content rounded-lg hover:bg-black/20 dark:hover:bg-white/20 cursor-pointer`}
                  onClick={() => handleSelectFeeling(index)}
                >
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-9 h-9 box-content mr-3 bg-black/10 dark:bg-white/10 rounded-full">
                      <LazyLoadImage src={item.src} className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-1520 text-primaryText dark:text-primaryTextDark">
                        {item.title}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </CustomScrollbar>
      </div>
    </div>
  );
};

export default FormFeeling;
