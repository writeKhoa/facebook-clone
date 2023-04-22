import { ProfileProps } from "@/models";
import { FC } from "react";
import {
  Avatar,
  Background,
  NavProfile,
  Options,
  ShortInfo,
} from "@/components/commons/profile-commons";
import { ShortEdit } from "./sub";

interface Props {
  profile: ProfileProps;
  mode: number;
}
const Overview: FC<Props> = ({ profile, mode }) => {
  const { _id, backgroundUrl, friends, fullName, mediumAvatarUrl } = profile;
  return (
    <div className="bg-surface dark:bg-surfaceDark">
      <div className="flex flex-col w-max-1095 mx-auto items-center justify-center bg-surface dark:bg-surfaceDark">
        <Background backgroundUrl={backgroundUrl} />

        <div className="relative mx-auto w-max-1050 max900:w-full">
          <div className="flex justify-center pb-4 max900:flex-col max900:items-center">
            <div className="absolute -top-8 left-4 mr-4 -mb-4  max900:absolute-vertical-center max900:-top-[86px] max900:mr-0">
              <Avatar mediumAvatarUrl={mediumAvatarUrl} />
            </div>

            <div className="w-[174px] h-0 mr-4"></div>

            <div className="mt-8 mb-4 grow h-[98px] max900:mt-[106px] ">
              <ShortInfo fullName={fullName} friends={friends} />
            </div>

            <div className="shrink-0 mt-8 mb-4 ml-8 max900:ml-0">
              <div className="flex items-end h-full">
                <ShortEdit id={profile._id} mode={mode} />
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-black/20 dark:bg-white/20"></div>

          <div className="flex justify-between h-[60px]">
            <div className="grow">
              <NavProfile id={_id} />
            </div>
            <div className="shrink-0 flex items-center">
              <Options />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
