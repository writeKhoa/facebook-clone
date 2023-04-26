import {
  CommentIcon,
  LikePlaceholderIcon,
  ShareIcon,
} from "@/components/commons/Icons";
import { reactedEmotions, reactEmotions, reactEmotionSvg } from "@/configs";
import { useAuth } from "@/hooks";
import { processCount, sortTheMostTypeReactions } from "@/utils";
import { FC, useEffect, useRef, useState } from "react";
import { ViewDetailReaction } from "./sub";

interface ReactProps {
  count: number;
  typeReaction: number;
}

interface Props {
  countReaction: number;
  countTypeReaction: ReactProps[];
  userId: string;
  postId: string;
  view: "my-post" | "other-post";
  isReacted: {
    isReacted: boolean;
    typeReaction: number;
  };
}

const InteractPost: FC<Props> = ({
  countReaction,
  countTypeReaction,
  userId,
  postId,
  view,
  isReacted,
}) => {
  const { makeRequestWithAuth } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [count, setCount] = useState<number>(countReaction);

  const [arrTypeReact, setArrTypeReact] = useState<
    { count: number; typeReaction: number }[]
  >([...countTypeReaction]);

  const [arrTypeReactRender, setArrTypeReactRender] = useState<
    { count: number; typeReaction: number }[]
  >([...countTypeReaction]);

  const [isReactedObject, setIsReactedObject] = useState<{
    isReacted: boolean;
    typeReaction: number;
  }>({ ...isReacted });

  const handleOpenDetail = () => setIsOpen((pre) => !pre);

  const handleReact = async (type: number) => {
    try {
      if (isReactedObject.isReacted) {
        const newArrTypeReact: ReactProps[] = [...arrTypeReact];
        newArrTypeReact[type].count -= 1;
        setArrTypeReact(newArrTypeReact);
        setCount((pre) => pre - 1);
        setIsReactedObject({
          isReacted: false,
          typeReaction: type,
        });
        await makeRequestWithAuth("post", "/api/v1/posts/cancel-react", {
          postId,
          userId,
          typeReaction: type,
        });
      } else {
        const newArrTypeReact: ReactProps[] = [...arrTypeReact];
        newArrTypeReact[type].count += 1;
        setArrTypeReact(newArrTypeReact);
        setCount((pre) => pre + 1);
        setIsReactedObject({
          isReacted: true,
          typeReaction: type,
        });
        await makeRequestWithAuth("post", "/api/v1/posts/react", {
          postId,
          userId,
          typeReaction: type,
        });
      }
    } catch (error) {}
  };

  const handleChangeReact = async (type: number) => {
    try {
      if (isReactedObject.isReacted) {
        const newArrTypeReact: ReactProps[] = [...arrTypeReact];
        newArrTypeReact[isReactedObject.typeReaction].count -= 1;
        newArrTypeReact[type].count += 1;
        setArrTypeReact(newArrTypeReact);
        setIsReactedObject({
          isReacted: true,
          typeReaction: type,
        });
        await makeRequestWithAuth("post", "/api/v1/posts/change-react", {
          postId,
          userId,
          preTypeReaction: isReactedObject.typeReaction,
          typeReaction: type,
        });
      } else {
        const newArrTypeReact: ReactProps[] = [...arrTypeReact];
        newArrTypeReact[type].count += 1;
        setArrTypeReact(newArrTypeReact);
        setCount((pre) => pre + 1);
        setIsReactedObject({
          isReacted: true,
          typeReaction: type,
        });
        await makeRequestWithAuth("post", "/api/v1/posts/react", {
          postId,
          userId,
          typeReaction: type,
        });
      }
    } catch (error) {}
  };

  useEffect(() => {
    const newArr = sortTheMostTypeReactions(arrTypeReact);
    const newArr2 = newArr.slice(0, 3);
    setArrTypeReactRender(newArr2);
  }, [arrTypeReact]);

  return (
    <>
      <div className="mx-4 py-2.5">
        <div className="flex justify-between items-center text-1418 font-normal text-secondaryText dark:text-secondaryTextDark">
          <>
            {count > 0 ? (
              <div className="flex">
                <div className="flex items-center mr-1">
                  {arrTypeReactRender.map((item, index) => {
                    if (item.count <= 0) return null;
                    const Icon = reactEmotions[item.typeReaction].Icon;
                    return (
                      <div
                        key={index}
                        className="cursor-pointer hover:underline"
                        onClick={handleOpenDetail}
                      >
                        <Icon />
                      </div>
                    );
                  })}
                </div>
                <span
                  className="cursor-pointer hover:underline"
                  onClick={handleOpenDetail}
                >
                  {processCount(count)}
                </span>
              </div>
            ) : null}
          </>
        </div>
      </div>

      <div className="mx-3 py-1 border-t border-divider dark:border-dividerDark">
        <div className="flex -my-2 -mx-0.5 p-1">
          <div className="relative flex-1 flex justify-center items-center px-0.5 py-2 cursor-pointer group">
            <div className="absolute bottom-full left-0 hidden gap-2 p-1 border border-divider dark:border-dividerDark bg-surface dark:bg-surfaceDark rounded-full group-hover:flex transition-all duration-500">
              {reactEmotionSvg.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="w-10 h-10 cursor-pointer"
                    onClick={() => handleChangeReact(index)}
                  >
                    <img src={item.src} className="w-10 h-10" alt="" />
                  </div>
                );
              })}
            </div>

            <div
              className="grow flex items-center justify-center -mx-1 -my-1.5 px-3 rounded-md hover:bg-black/10 dark:hover:bg-white/10"
              onClick={() => handleReact(0)}
            >
              {!!isReactedObject.isReacted ? (
                <>
                  {reactedEmotions.map((reacted, index) => {
                    if (isReactedObject.typeReaction !== index) return null;
                    const { Icon, title, color } = reacted;
                    return (
                      <div key={index} className="flex items-center">
                        <span className="px-1 py-1.5">
                          <Icon />
                        </span>
                        <span className="px-1 py-1.5">
                          <span
                            className="text-1520 font-semibold"
                            style={{ color }}
                          >
                            {title}
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </>
              ) : (
                <>
                  <div className="flex items-center px-1 py-1.5">
                    <span>
                      <LikePlaceholderIcon />
                    </span>
                  </div>
                  <div className="flex items-center px-1 py-1.5">
                    <span className="text-1418 font-semibold text-secondaryText dark:text-secondaryTextDark">
                      Thích
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex-1 flex  justify-center items-center h-[44px] px-0.5 py-1.5 cursor-pointer">
            <div className="grow flex items-center justify-center -mx-1 -my-[6px] px-3 rounded-md hover:bg-black/10 dark:hover:bg-white/10">
              <div className="flex items-center px-1 py-1.5">
                <span>
                  <CommentIcon />
                </span>
              </div>
              <div className="flex items-center px-1 py-1.5">
                <span className="text-1418 font-semibold text-secondaryText dark:text-secondaryTextDark">
                  Bình luận
                </span>
              </div>
            </div>
          </div>
          {view === "other-post" ? (
            <div className="flex-1 flex justify-center items-center h-[44px] px-0.5 py-1.5 cursor-pointer">
              <div className="grow flex items-center justify-center -mx-1 -my-1.5 px-3 rounded-md hover:bg-black/10 dark:hover:bg-white/10">
                <div className="px-1 py-1.5">
                  <span>
                    <ShareIcon />
                  </span>
                </div>
                <div className="flex items-center px-1 py-1.5">
                  <span className="text-1418 font-semibold text-secondaryText dark:text-secondaryTextDark">
                    Chia sẻ
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {isOpen && (
        <ViewDetailReaction
          isOpen={isOpen}
          onOpen={handleOpenDetail}
          postId={postId}
        />
      )}
    </>
  );
};
export default InteractPost;
