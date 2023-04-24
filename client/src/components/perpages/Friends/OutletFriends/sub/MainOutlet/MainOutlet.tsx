import { useAuth } from "@/hooks";
import { ShortProfileItem } from "@/models";
import { useEffect, useState } from "react";
import { RequestUserItem, SuggestUserItem } from "./sub";

const MainOutlet = () => {
  const { makeRequestWithAuth } = useAuth();
  const [suggestList, setSuggestList] = useState<
    (ShortProfileItem | "dummy")[]
  >([]);
  const [requestReceiveds, setRequestReceiveds] = useState<
    ShortProfileItem | "dummy"[]
  >([]);

  const handleConfirm = async (id: string) => {
    try {
      await makeRequestWithAuth(
        "post",
        "/api/v1/friends/confirm-request-make-friend",
        {
          userSentId: id,
        }
      );
    } catch (error) {
      console.log({ error });
    }
  };

  const handleDeny = async (id: string) => {
    try {
      await makeRequestWithAuth(
        "post",
        "/api/v1/friends/deny-request-make-friend",
        {
          userSentId: id,
        }
      );
    } catch (error) {
      console.log({ error });
    }
  };

  const handleAddFriend = async (id: string) => {
    try {
      await makeRequestWithAuth("post", "/api/v1/friends/make-friend", {
        userReceivedId: id,
      });
    } catch (error) {
      console.log({ error });
    }
  };

  const handleRemove = (id: string) => {
    setSuggestList((pre) => {
      return pre.filter((item) => {
        //@ts-ignore
        return item?._id !== id;
      });
    });
  };

  const handleCancel = async (id: string) => {
    try {
      await makeRequestWithAuth(
        "post",
        "/api/v1/friends/cancel-request-make-friend",
        {
          userReceivedId: id,
        }
      );
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    const abortController: AbortController | null = new AbortController();

    const getData = async () => {
      try {
        const data = await makeRequestWithAuth(
          "get",
          `/api/v1/friends/`,
          {},
          { signal: abortController.signal }
        );
        const newRequestReceiveds = data?.__requestReceivedList.map(
          (item: any) => {
            const { userSentId } = item;
            return {
              ...userSentId,
            };
          }
        );

        setRequestReceiveds([
          ...newRequestReceiveds,
          "dummy",
          "dummy",
          "dummy",
          "dummy",
          "dummy",
        ]);

        const newSuggestList = data?.__suggestUsers.map((item: any) => {
          return item;
        });
        setSuggestList([
          ...newSuggestList,
          "dummy",
          "dummy",
          "dummy",
          "dummy",
          "dummy",
        ]);
      } catch (error) {
        console.log({ error });
      }
    };

    getData();

    return () => {
      abortController.abort();
    };
  }, []);
  return (
    <div className="p-5 bg-space dark:bg-spaceDark">
      <div>
        <div className="w-full pb-4">
          <div className="flex pt-5 pb-1">
            <span className="grow text-2024 text-primaryText dark:text-primaryTextDark font-bold">
              Lời mời kết bạn
            </span>

            <span className="shrink-0 text-primary text-1720">Xem tất cả</span>
          </div>
        </div>

        <div className="flex flex-wrap">
          {/* @ts-ignore */}
          {requestReceiveds.map((item, index) => {
            if (item === "dummy") {
              return (
                <div
                  key={index}
                  className="flex-1 m-1"
                  style={{ maxWidth: 250, minWidth: 200 }}
                ></div>
              );
            }
            return (
              <RequestUserItem
                key={item._id}
                props={item}
                onConfirm={() => handleConfirm(item._id)}
                onDeny={() => handleDeny(item._id)}
              />
            );
          })}
        </div>
      </div>
      <div>
        <div className="w-full pb-4">
          <div className="flex pt-5 pb-1">
            <span className="grow text-2024 text-primaryText dark:text-primaryTextDark font-bold">
              Những người bạn có thể biết
            </span>

            <span className="shrink-0 text-primary text-1720">Xem tất cả</span>
          </div>
        </div>

        <div className="flex flex-wrap">
          {/* @ts-ignore */}
          {suggestList.map((item, index) => {
            if (item === "dummy") {
              return (
                <div
                  key={index}
                  className="flex-1 m-1"
                  style={{ maxWidth: 250, minWidth: 200 }}
                ></div>
              );
            }
            return (
              <SuggestUserItem
                key={item._id}
                props={item}
                onRemove={() => handleRemove(item._id)}
                onAdd={() => handleAddFriend(item._id)}
                onCancel={() => handleCancel(item._id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MainOutlet;
