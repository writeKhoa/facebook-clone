import { FC } from "react";
import { Link } from "react-router-dom";
import { generateRandomId } from "@/utils";
import { emojiConfig } from "@/configs";
import { LazyLoadImage } from "react-lazy-load-image-component";
interface Text {
  detail: number;
  format: number;
  mode: string;
  style: string;
  text: string;
  type: "text" | "autolink" | "hashtag" | "mention-user" | "emoticon" | "emoji";
  version: 1;
  url: string;
  userId: string;
  mentionUser: string;
  index: number;
}

interface Props {
  content?: string;
}

const JsonToHtml: FC<Props> = ({ content }) => {
  const json = !!content ? JSON.parse(content) : false;
  if (json) {
    const texts = json.root.children[0].children;
    return (
      <div>
        {texts ? (
          <>
            {texts.map((text: Text) => {
              return (
                <span key={generateRandomId()}>
                  {(() => {
                    switch (text?.type) {
                      case "text":
                        return <span>{text.text}</span>;
                      case "hashtag":
                        console.log(text);
                        return (
                          <span className="text-primary">{text.text}</span>
                        );
                      case "autolink":
                        return <span>{text.url}</span>;
                      case "mention-user":
                        return (
                          <Link to={`/${text.userId}`}>
                            <span className="text-primary font-semibold">
                              {text.mentionUser || ""}
                            </span>
                          </Link>
                        );
                      case "emoji":
                        const srcEmoji = emojiConfig[text.index].src;
                        const titleEmoji = emojiConfig[text.index].src;
                        return (
                          <span className="inline-block align-middle">
                            <LazyLoadImage
                              src={srcEmoji}
                              alt={titleEmoji}
                              width={24}
                              height={24}
                            />
                          </span>
                        );
                      default:
                        return null;
                    }
                  })()}
                </span>
              );
            })}
          </>
        ) : null}
      </div>
    );
  }
  return null;
};

export default JsonToHtml;
