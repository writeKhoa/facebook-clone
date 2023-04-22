import { ArrowNavLeft } from "@/components/commons/Icons";
import { FC } from "react";

interface Props {
  title: string;
  onReturnDefault: () => void;
}

const HeaderReturn: FC<Props> = ({ title, onReturnDefault }) => {
  return (
    <div className="relative h-[60px] w-full">
      <div className="flex justify-center items-center w-full h-full border-b border-divider dark:border-dividerDark">
        <div className="text-1214">
          <h2 className="text-2024 font-bold text-primaryText dark:text-primaryTextDark">
            {title}
          </h2>
        </div>
      </div>

      <div
        className="absolute left-3 top-3 flex justify-center items-center w-9 h-9 rounded-full bg-black/10 dark:bg-white/10 text-primaryIcon dark:text-primaryIconDark cursor-pointer hover:bg-black/20 dark:hover:bg-white/20"
        onClick={onReturnDefault}
      >
        <ArrowNavLeft />
      </div>
    </div>
  );
};

export default HeaderReturn;
