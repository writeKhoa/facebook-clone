import { CustomScrollbar } from "@/components/commons";
import { CloseIcon, FindIcon } from "@/components/commons/Icons";
import { useAuth, usePosts } from "@/hooks";
import { ShortProfileItem } from "@/models";
import { FC, useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { HeaderReturn } from "../../commons";
import constants from "../../config/constants";

interface Props {
  onReturnDefault: () => void;
}

const FormTag: FC<Props> = ({ onReturnDefault }) => {
  const { makeRequestWithAuth } = useAuth();
  const { modeEditor, postCreate, postEdit, setPostCreate, setPostEdit } =
    usePosts();
  const [suggestUsers, setSuggestUsers] = useState<
    Map<string, ShortProfileItem>
  >(new Map());
  const [taggedUsers, setTaggedUsers] = useState<ShortProfileItem[]>([]);

  const handleConfirmTag = () => {
    const newTagged = taggedUsers.map((item) => {
      return {
        tagId: item._id,
        fullName: item.fullName,
      };
    });
    if (modeEditor === "edit") {
      setPostEdit((pre) => {
        return {
          ...pre,
          tags: newTagged,
        };
      });
    } else {
      setPostCreate((pre) => {
        return {
          ...pre,
          tags: newTagged,
        };
      });
    }
    onReturnDefault();
  };

  const handleTagged = (id: string) => {
    if (suggestUsers.has(id)) {
      const item = suggestUsers.get(id);
      const newSuggestUsers = new Map(suggestUsers);
      newSuggestUsers.delete(id);
      setSuggestUsers(newSuggestUsers);
      setTaggedUsers((pre) => {
        return [...pre, item as ShortProfileItem];
      });
    }
  };

  const handleRemoveTagged = (item: ShortProfileItem) => {
    const newSuggestUsers = new Map(suggestUsers);
    newSuggestUsers.set(item._id, item);
    setSuggestUsers(newSuggestUsers);
    setTaggedUsers((pre) => {
      const newTaggedUsers = pre.filter(
        (itemTagged) => itemTagged._id !== item._id
      );
      return [...newTaggedUsers];
    });
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await makeRequestWithAuth("get", "/api/v1/friends/list");
        const suggestMap = new Map<string, ShortProfileItem>();
        const taggedUsers: ShortProfileItem[] = [];

        data.__friendList.forEach((friend: any) => {
          const { friendId } = friend;
          suggestMap.set(friendId._id, friendId);
        });
        if (modeEditor === "edit") {
          if (!!postEdit.tags) {
            postEdit?.tags.length > 0 &&
              postEdit.tags.forEach((item) => {
                const taggedItem = suggestMap.get(item.tagId);
                taggedUsers.push(taggedItem as ShortProfileItem);
                suggestMap.delete(item.tagId);
              });
            setTaggedUsers(taggedUsers);
            setSuggestUsers(suggestMap);
          } else {
            setTaggedUsers(taggedUsers);
            setSuggestUsers(suggestMap);
          }
        } else {
          if (!!postCreate.tags) {
            postCreate?.tags.length > 0 &&
              postCreate?.tags.forEach((item) => {
                const taggedItem = suggestMap.get(item.tagId);
                taggedUsers.push(taggedItem as ShortProfileItem);
                suggestMap.delete(item.tagId);
              });
            setTaggedUsers(taggedUsers);
            setSuggestUsers(suggestMap);
          } else {
            setTaggedUsers(taggedUsers);
            setSuggestUsers(suggestMap);
          }
        }
      } catch (error) {
        console.log({ error });
      }
    };

    getData();
  }, []);

  return (
    <div
      className="bg-surface dark:bg-surfaceDark rounded-lg border-divider dark:border-dividerDark"
      style={{ height: constants.tag }}
    >
      <HeaderReturn
        title="Gắn thẻ người khác"
        onReturnDefault={onReturnDefault}
      />

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

        <div className="shrink-0 flex items-center" onClick={handleConfirmTag}>
          <span className="pl-5 pr-2 text-primary text-1418 font-semibold cursor-pointer">
            Xong
          </span>
        </div>
      </div>

      <div style={{ height: 370 }}>
        <CustomScrollbar>
          {taggedUsers.length > 0 && (
            <div className="w-full px-4 pt-2 pb-4">
              <div className="flex flex-wrap p-2 w-full rounded-lg border border-divider dark:border-dividerDark">
                {taggedUsers.map((item) => {
                  return (
                    <div key={item._id} className="m-1">
                      <div className="flex items-center justify-center rounded-lg bg-primary/25 p-2.5 text-1214 h-8">
                        <div className="flex items-center text-1214">
                          <span className="text-primary font-semibold text-1520">
                            {item.fullName}
                          </span>
                        </div>
                        <div
                          className="flex justify-center items-center w-7 h-7 hover:bg-primary/30 rounded-full cursor-pointer"
                          onClick={() => handleRemoveTagged(item)}
                        >
                          <span className="text-primary">
                            <CloseIcon width={16} height={16} />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="pt-4 pb-2">
            <div className="pl-4 pb-2 text-1214">
              <span className="text-1618 font-semibold text-secondaryText dark:text-secondaryTextDark">
                Gợi ý
              </span>
            </div>
          </div>

          {!!suggestUsers &&
            Array.from(suggestUsers?.entries()).map(([key, item]) => {
              return (
                <div className="px-2" key={key}>
                  <div
                    className="flex p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                    onClick={() => handleTagged(item._id)}
                  >
                    <div className="shrink-0">
                      <LazyLoadImage
                        className="rounded-full"
                        src={item.avatarUrl}
                        width={40}
                        height={40}
                      />
                    </div>

                    <div className="grow flex items-center ml-3">
                      <div className="text-1214">
                        <span className="text-1418 text-primaryText dark:text-primaryTextDark font-semibold">
                          {item.fullName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </CustomScrollbar>
      </div>
    </div>
  );
};

export default FormTag;
