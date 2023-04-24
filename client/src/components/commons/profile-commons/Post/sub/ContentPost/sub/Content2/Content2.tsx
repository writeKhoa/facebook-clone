import { backgrounds } from "@/configs";
import { FC } from "react";
import JsonToHtml from "../JsonToHtml";
import { Background2Props } from "@/models";

interface Props {
  background: number;
  content?: string;
}

const Content2: FC<Props> = ({ background, content }) => {
  const theme = (backgrounds[background] as Background2Props)?.theme;
  const color = (backgrounds[background] as Background2Props)?.color;
  const srcBg = (backgrounds[background] as Background2Props)?.srcBg;

  if (!!color) {
    return (
      <div
        className="relative w-full"
        style={{ paddingTop: `calc(100% * 0.69)` }}
      >
        <div
          className={`${
            theme === "dark" ? "text-white" : "text-black"
          } absolute top-0 left-0 right-0 flex justify-center items-center h-full text-3238 font-bold text-center z-0 `}
          style={{
            backgroundColor: color,
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        >
          <JsonToHtml content={content} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full"
      style={{ paddingTop: `calc(100% * 0.69)` }}
    >
      <div
        className={`${
          theme === "dark" ? "text-white" : "text-black"
        } absolute top-0 left-0 right-0 flex justify-center items-center h-full text-3238 font-bold text-center z-0 `}
        style={{
          backgroundImage: `url(${srcBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      >
        <JsonToHtml content={content} />
      </div>
    </div>
  );
};

export default Content2;
