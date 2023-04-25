import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { EditorState } from "lexical";

import MyNodes from "./nodes";
import MyPlugins, { EmojiPicker } from "./plugins";
// components
import { usePosts } from "@/hooks";
import { FC } from "react";
import { Background, BackgroundComposer } from "./sub";

function onChange(state: EditorState) {}

interface Props {
  isOpenAddImage: boolean;
}

const LexicalEditor: FC<Props> = ({ isOpenAddImage }) => {
  const { postCreate, postEdit, modeEditor } = usePosts();

  const post = modeEditor === "edit" ? postEdit : postCreate;

  return (
    <LexicalComposer
      initialConfig={{
        editorState: post.content,
        namespace: "editor",
        theme: {
          paragraph: "mb-1",
          link: "text-blue-600",
          hashtag: "bg-[#1877f273]",
          blockCursor: "bg-red-500",
        },
        nodes: MyNodes,
        onError(error) {
          console.log("error in lexical editor ", error);
          throw error;
        },
      }}
    >
      <Background isOpenAddImage={isOpenAddImage}>
        <RichTextPlugin
          ErrorBoundary={LexicalErrorBoundary}
          contentEditable={
            <ContentEditable
              className={`${
                post.background !== 0 ? "" : "px-5"
              } w-full min-h-[40px] outline-none overflow-hidden text-ellipsis text-2024`}
            />
          }
          placeholder={
            <div
              className={`${
                post.background !== 0
                  ? "absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 -mt-2"
                  : "absolute top-0 left-0 px-5"
              }  pointer-events-none select-none text-2024`}
            >
              Bạn đang nghĩ gì
            </div>
          }
        />

        <>{!isOpenAddImage && <BackgroundComposer />}</>
        <>
          {isOpenAddImage && (
            <div className="absolute top-0 right-0 pr-4">
              <EmojiPicker />
            </div>
          )}
        </>
        <OnChangePlugin onChange={onChange} />

        <MyPlugins />
        <HistoryPlugin />
      </Background>
    </LexicalComposer>
  );
};

export default LexicalEditor;
