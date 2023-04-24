const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { Schema, model } = mongoose;
dotenv.config();

const postsSchema = Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", index: 1 },

    tagged: { type: [String] },

    tags: [
      {
        tagId: String,
        fullName: String,
      },
    ],

    audiance: {
      type: Number,
      enum: [1, 2, 3],
      // 0: private
      // 1: friends
      // 2: global
      default: 2,
    },

    feeling: {
      type: Number,
    },

    format: {
      type: Number,
      enum: [1, 2, 3],
    },

    content: {
      type: String,
      required: function () {
        return !this.imageUrl;
      },
    },

    background: {
      type: Number,
    },

    imageUrl: {
      type: String,
      required: function () {
        return !this.content;
      },
    },

    publicId: {
      type: String,
    },

    sharePostId: {
      type: { type: Schema.Types.ObjectId, ref: "posts" },
    },

    countReaction: {
      type: Number,
      default: 0,
    },

    countTypeReaction: {
      type: [
        {
          count: Number,
          typeReaction: Number,
        },
      ],
      default: [
        { count: 0, typeReaction: 0 },
        { count: 0, typeReaction: 1 },
        { count: 0, typeReaction: 2 },
        { count: 0, typeReaction: 3 },
        { count: 0, typeReaction: 4 },
        { count: 0, typeReaction: 5 },
        { count: 0, typeReaction: 6 },
      ],
    },
    reactions: {
      type: [
        {
          userId: {
            type: Schema.Types.ObjectId,
            ref: "users",
          },
          typeReaction: {
            type: Number,
            enum: [0, 1, 2, 3, 4, 5, 6],
            required: true,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("posts", postsSchema);
