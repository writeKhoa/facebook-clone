import { ArrowDownIcon } from "@/components/commons/Icons";
import { audianceConfig, feelings } from "@/configs";
import { User } from "@/models";
import { FC } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

interface Props {
  user: User;
  onOpenAudiance: () => void;
  post: {
    feeling?: number;
    tags?: { tagId: string; fullName: string }[];
    audiance: 1 | 2 | 3;
  };
  onOpenTagForm: () => void;
}

const UserAndAudiance: FC<Props> = ({
  user,
  post,
  onOpenAudiance,
  onOpenTagForm,
}) => {
  const handleClickTagUser = () => onOpenTagForm();

  return (
    <div className="flex w-full">
      <div className="mr-3 shrink-0">
        <LazyLoadImage
          src={user?.avatarUrl}
          width={40}
          height={40}
          className="rounded-full"
        />
      </div>

      <div className="flex flex-col text-1214 -my-2 w-full">
        <div className="block">
          <span className="-py-1 text-primaryText dark:text-primaryTextDark font-semibold text-1520">
            <span className="inline-block">{user?.fullName}</span>

            <span className="inline-block">
              {typeof post?.feeling === "number" && (
                <span className="flex gap-1 mx-1 text-1520 font-semibold text-primaryText dark:text-primaryTextDark">
                  đang{" "}
                  <LazyLoadImage
                    src={feelings[post.feeling].src}
                    width={20}
                    height={20}
                  />{" "}
                  cảm thấy <>{feelings[post.feeling].title}</>
                </span>
              )}
            </span>

            {!!post.tags ? (
              Array.isArray(post.tags) && post.tags.length > 0 ? (
                <span className="ml-1 font-semibold text-1520 text-primaryText dark:text-primaryTextDark">
                  cùng với{" "}
                  <>
                    {post.tags.map((tag, index) => {
                      if (index > 3) {
                        return null;
                      }
                      if (index > 2) {
                        return (
                          <span
                            key={tag.tagId}
                            className="mx-1 cursor-pointer"
                            onClick={handleClickTagUser}
                          >
                            và {post.tags?.length && post.tags.length - 3} người
                            khác.
                          </span>
                        );
                      }
                      if (
                        post.tags?.length &&
                        index === post?.tags.length - 1 &&
                        post.tags.length === 3
                      ) {
                        return (
                          <span
                            key={tag.tagId}
                            className="hover:underline mx-1 cursor-pointer"
                            onClick={handleClickTagUser}
                          >
                            {tag.fullName}.
                          </span>
                        );
                      }
                      return (
                        <span
                          key={tag.tagId}
                          className="hover:underline mx-1 cursor-pointer"
                          onClick={handleClickTagUser}
                        >
                          {tag.fullName},
                        </span>
                      );
                    })}
                  </>
                </span>
              ) : null
            ) : null}
          </span>
        </div>

        <div>
          <div className="inline-block" onClick={onOpenAudiance}>
            {audianceConfig.map((item) => {
              const { Icon, title, audiance } = item;
              if (audiance === post.audiance) {
                return (
                  <div
                    key={item.title}
                    className="flex items-center mt-2 px-2 py-1 rounded-md bg-black/10 dark:bg-white/10 cursor-pointer"
                  >
                    <div className="text-primaryIcon dark:text-primaryIconDark">
                      <Icon />
                    </div>
                    <div className="mx-1">
                      <span className="text-1316 text-primaryText dark:text-primaryTextDark font-semibold">
                        {title}
                      </span>
                    </div>
                    <div>
                      <ArrowDownIcon />
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAndAudiance;
