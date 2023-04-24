export interface CommonContentPostProps {
  format: 1 | 2;
  background: number;
  imageUrl?: string;
}

export interface ReactionProps {
  typeReaction: number;
  userId: string;
  _id: string;
}

export interface PostProps {
  _id: string;
  userId: {
    _id: string;
    avatarUrl: string;
    fullName: string;
  };
  createdAt: string;

  tags?: { tagId: string; fullName: string }[];
  audiance: 1 | 2 | 3;
  feeling?: number;

  background: number;
  content: string;
  format: 1 | 2;
  imageUrl?: string;
  publicId?: string;

  sharePostId?: PostProps;

  countReaction: number;
  countTypeReaction: { typeReaction: number; count: number }[];
  reactions: ReactionProps[];
}

export interface PostCreateProps {
  audiance: 1 | 2 | 3;
  tags?: { tagId: string; fullName: string }[];
  feeling?: number;

  background: number;
  content: string;
  format: 1 | 2;

  imageUrlPreview?: string;
  imageUpload: File | null;
}

export interface PostEditProps {
  _id: string;
  audiance: 1 | 2 | 3;
  tags?: { tagId: string; fullName: string }[];
  feeling?: number;

  background: number;
  content: string;
  format: 1 | 2;

  preImageUrl?: string;
  prePublicId?: string;
  isDiscardOldImage: boolean;
  hasPreImageUrl: boolean;
  imageUrlPreview?: string;
  imageUpload: File | null;
}

export interface FeelingItem {
  src: string;
  title: string;
}

export type Background1Props = {
  format: 1;
};

export type Background2Props = {
  format: 2;
  type: "color" | "image";
  theme: "dark" | "light";
  srcBtn?: string;
  srcBg?: string;
  color?: string;
};

export type BackgroundItem = Background1Props | Background2Props;

export interface FeelingItem {
  title: string;
  src: string;
}
