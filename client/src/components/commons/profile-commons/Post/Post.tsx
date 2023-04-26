import { FC } from "react";
import { PostProps, ReactionProps } from "@/models";
import { HeaderPost, ContentPost, InteractPost } from "./sub";
import { useAuth } from "@/hooks";
import { getObject } from "@/utils";

interface Props {
  post: PostProps;
  view: "my-post" | "other-post";
  isPinned: boolean;
  where: "profile" | "home";
}

const Post: FC<Props> = ({ post, view, isPinned, where }) => {
  const { user } = useAuth();
  console.log(user);
  const {
    _id,
    userId,
    createdAt,

    tags,
    audiance,
    feeling,

    background,
    content,
    format,
    imageUrl,

    countReaction,
    countTypeReaction,
    reactions,
  } = post;

  const isReactedObject = (userId: string, reactions: ReactionProps[]) => {
    let objReturn = { isReacted: false, typeReaction: 0 };
    if (reactions?.length > 0) {
      const isReacted = reactions.find((item) => {
        return item.userId === userId;
      });

      if (!!isReacted) {
        objReturn.isReacted = true;
        objReturn.typeReaction = isReacted.typeReaction;
      } else {
        objReturn.isReacted = false;
        objReturn.typeReaction = 0;
      }
    } else {
      objReturn.isReacted = false;
      objReturn.typeReaction = 0;
    }
    return objReturn;
  };

  return (
    <div className="w-full bg-surface dark:bg-surfaceDark rounded-xl">
      <HeaderPost
        props={{
          view,
          userId,
          postId: _id,
          tags,
          createdAt,
          audiance,
          feeling,
        }}
        isPinned={isPinned}
        where={where}
      />
      <ContentPost
        props={{
          background,
          content,
          format,
          imageUrl,
        }}
      />
      <InteractPost
        countReaction={countReaction}
        countTypeReaction={countTypeReaction}
        isReacted={getObject(user?._id || "", reactions)}
        userId={user?._id as string}
        postId={_id}
        view={view}
      />
    </div>
  );
};

export default Post;
