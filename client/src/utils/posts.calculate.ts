import { ReactionProps } from "@/models";

function decimalAdjust(num: number, divideNum: number, getNum: number) {
  return (num / divideNum).toFixed(getNum);
}

const oneThousand: number = 1000;
const oneMillion: number = 1000000;

export const processCount = (count: number) => {
  if (count > oneThousand && count < oneThousand * 10) {
    return `${decimalAdjust(count, oneThousand, 1)}K`;
  } else if (count > oneThousand * 10 && count < oneThousand * 1000) {
    return `${decimalAdjust(count, oneThousand, 0)}K`;
  } else if (count > oneMillion && count < oneMillion * 10) {
    return `${decimalAdjust(count, oneMillion, 1)} triệu`;
  } else if (count > oneMillion * 10) {
    return `${decimalAdjust(count, oneMillion, 0)} triệu`;
  } else {
    return count;
  }
};

export const getObject = (userId: string, reactions: ReactionProps[]) => {
  console.log(reactions);
  if (!!reactions) {
    console.log("vao route reactions");
    const isReacted = reactions.find((item) => {
      console.log(item.userId, { userId });
      return item.userId === userId;
    });

    console.log(isReacted);

    if (!!isReacted) {
      return {
        isReacted: true,
        typeReaction: isReacted.typeReaction,
      };
    } else {
      return {
        isReacted: false,
        typeReaction: 0,
      };
    }
  } else {
    return {
      isReacted: false,
      typeReaction: 0,
    };
  }
};

export const timeSince = (date: number) => {
  const currentTime: any = new Date();
  const seconds: any = Math.floor((currentTime - date) / 1000);

  let interval = seconds / 86400;
  if (interval > 1) {
    const timeStamp = new Date(date);
    const day = timeStamp.getDate();
    const month = timeStamp.getMonth() + 1;
    const year = timeStamp.getFullYear();
    return `${day} tháng ${month}, ${year}.`;
  }

  interval = seconds / 3600;
  if (interval > 1) {
    return `${Math.floor(interval)} giờ.`;
  }

  interval = seconds / 60;
  if (interval > 1) {
    return `${Math.floor(interval)} phút.`;
  }

  return "Vừa xong.";
};

export const sortTheMostTypeReactions = (
  arrTypeReact: {
    count: number;
    typeReaction: number;
  }[]
) => {
  const newArr = [...arrTypeReact];
  newArr.sort((a, b) => b.count - a.count);
  return newArr;
};

export const sortAndFilterTypeReactions = (
  arrTypeReact: {
    count: number;
    typeReaction: number;
  }[]
) => {
  const newArr = [...arrTypeReact];
  newArr.sort((a, b) => b.count - a.count);
  return newArr.filter((item) => item.count > 0);
};

export const getYearMonthDate = (time: string) => {
  const dateObj = new Date(time);

  const date = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();

  return [year, month, date];
};
