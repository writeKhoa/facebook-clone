const { posts, friends, users } = require("../models");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const sharp = require("sharp");

const resizedDir = "./public/resized";

const that = {
  myPosts: async (req, res) => {
    try {
      const id = req.id;
      const userId = req.params.userId;

      const userDoc = await users.findById(id).select("pinPost");

      let pinPostDoc = {};

      if (!!userDoc.pinPost) {
        const doc = await posts.findById(userDoc.pinPost).populate({
          path: "userId",
          select: "fullName avatarUrl",
        });
        pinPostDoc = { ...doc._doc };
      }
      const postDoc = await posts
        .find({ $or: [{ userId: userId }, { tagged: { $in: [userId] } }] })
        .populate({
          path: "userId",
          select: "fullName avatarUrl",
        })
        .sort({ createdAt: -1 });

      return res.status(200).json({
        data: {
          __posts: postDoc,
          __pinPost: userDoc?.pinPost && pinPostDoc,
          __pinPostId: userDoc?.pinPost || "",
        },
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  otherPosts: async (req, res) => {
    try {
      const { userId, mode } = req.query;
      const modeDoc = Number(mode);

      const userDoc = await users
        .findById(userId, { select: "pinPost" })
        .select("pinPost");

      let pinPostDoc = {};
      if (!!userDoc.pinPost) {
        const doc = await posts.findById(userDoc.pinPost).populate({
          path: "userId",
          select: "fullName avatarUrl",
        });
        pinPostDoc = { ...doc._doc };
      }

      if (modeDoc === 2) {
        const postDoc = await posts
          .find({
            $or: [
              { $and: [{ userId: userId }, { audiance: { $ne: 1 } }] },
              {
                $and: [{ tagged: { $in: [userId] } }, { audiance: { $ne: 1 } }],
              },
            ],
          })
          .populate({
            path: "userId",
            select: "fullName avatarUrl",
          })
          .sort({ createdAt: -1 });
        return res.status(200).json({
          data: {
            __posts: postDoc,
            __pinPost: userDoc.pinPost && pinPostDoc,
            __pinPostId: userDoc.pinPost || "",
          },
        });
      }

      const postDoc = await posts
        .find({
          $or: [
            { $and: [{ userId: userId }, { audiance: { $in: 3 } }] },
            { $and: [{ tagged: { $in: [userId] } }, { audiance: { $in: 3 } }] },
          ],
        })
        .populate({
          path: "userId",
          select: "fullName avatarUrl",
        })
        .sort({ createdAt: -1 });
      return res.status(200).json({
        data: {
          __posts: postDoc,
          __pinPost: userDoc.pinPost && pinPostDoc,
          __pinPostId: userDoc.pinPost || "",
        },
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  homePosts: async (req, res) => {
    try {
      const id = req.id;
      const { page_idx, page_size } = req.query;
      const SKIP_PAGE = (Number(page_idx) - 1) * Number(page_size);
      const LIMIT_PAGE = Number(page_size);

      const friendDoc = await friends
        .findOne({ userId: id })
        .select("friendList");

      const friendIds = !!friendDoc?.friendList
        ? friendDoc.friendList.map((friend) => friend.friendId.toString())
        : [];

      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const postDocs = await posts
        .find({
          userId: { $in: [...friendIds, id] },
          at: {
            $gte: weekAgo,
            $lt: now,
          },
          audiance: { $ne: 1 },
        })
        .populate({
          path: "userId",
          select: "fullName avatarUrl",
        })
        .sort({ createdAt: -1 })
        .skip(SKIP_PAGE)
        .limit(LIMIT_PAGE);

      return res.status(200).json({
        data: {
          __posts: postDocs,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  detailReaction: async (req, res) => {
    try {
      const { postId } = req.params;

      const doc = await posts
        .findById(postId)
        .populate({
          path: "reactions.userId",
          select: "fullName avatarUrl",
        })
        .select("reactions countTypeReaction countReaction")
        .exec();

      return res.status(200).json({
        data: {
          __reactions: doc.reactions,
          __countTypeReaction: doc.countTypeReaction,
          __countReaction: doc.countReaction,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  pinPost: async (req, res) => {
    try {
      const id = req.id;
      const { postId } = req.body;

      await users.findByIdAndUpdate(id, { pinPost: postId });
      return res.status(200).json({ data: {} });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  unPinPost: async (req, res) => {
    try {
      const id = req.id;

      await users.findByIdAndUpdate(id, { pinPost: "" });
      return res.status(200).json({ data: {} });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  reactEmotionPost: async (req, res) => {
    try {
      const { postId, userId, typeReaction } = req.body;

      // todo modify type array
      await posts.findByIdAndUpdate(postId, {
        $inc: {
          countReaction: 1,
          [`countTypeReaction.${typeReaction}.count`]: 1,
        },
        $push: {
          reactions: { userId, typeReaction },
        },
      });

      return res.status(200).json();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  cancelReactEmotionPost: async (req, res) => {
    try {
      const { postId, userId, typeReaction } = req.body;

      await posts.findByIdAndUpdate(postId, {
        $inc: {
          countReaction: -1,
          [`countTypeReaction.${typeReaction}.count`]: -1,
        },
        $pull: {
          reactions: { userId },
        },
      });

      return res.status(200).json({ status: "successed" });
    } catch (error) {
      return res.status(500).json({ status: "failed", error: error.message });
    }
  },

  changeReactEmotionPost: async (req, res) => {
    try {
      const { userId, postId, preTypeReaction, typeReaction } = req.body;
      await posts.findOneAndUpdate(
        { _id: postId, "reactions.userId": userId },
        {
          $set: {
            "reactions.$.typeReaction": typeReaction,
          },
          $inc: {
            [`countTypeReaction.${preTypeReaction}.count`]: -1,
            [`countTypeReaction.${typeReaction}.count`]: 1,
          },
        }
      );
      return res.status(200).json();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  uploadMulter: async (req, res) => {
    try {
      const id = req.id;
      const { post } = req.body;

      const postObject = JSON.parse(post);
      const url = req.protocol + "://" + req.get("host");

      const filename = req?.file?.filename;

      if (!filename) {
        const newPost = new posts({
          userId: id,
          ...postObject,
        });
        await newPost.save();
        return res.status(200).json({ data: { __post: newPost } });
      }

      if (!fs.existsSync(resizedDir)) {
        fs.mkdirSync(resizedDir);
      }

      await sharp(req.file.path)
        .resize(400, 400)
        .jpeg({ quality: 90 })
        .toFile(path.resolve(req.file.destination, "resized", filename));
      fs.unlinkSync(req.file.path);

      const imgUrl = url + "/public/resized/" + filename;

      const newPost = new posts({
        userId: id,
        ...postObject,
        imageUrl: imgUrl,
      });
      await newPost.save();
      await users.findByIdAndUpdate(id, {
        $push: {
          imageUrlList: {
            $each: [
              {
                imgUrl,
                postId: newPost._id,
              },
            ],
            $position: 0,
          },
        },
      });

      return res.status(200).json({ data: { __post: newPost } });
    } catch (error) {
      console.log(error);
      if (req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(500).json({ error: error.message });
    }
  },

  updatePost: async (req, res) => {
    try {
      const id = req.id;
      const { post } = req.body;
      const filename = req?.file?.filename;

      const postObject = JSON.parse(post);
      const url = req.protocol + "://" + req.get("host");

      // todo remove old image
      if (postObject.isDiscardOldImage) {
        const imageUrl = postObject.preImageUrl;
        const parsedUrl = new URL(imageUrl);
        const srcPath = path.join(__dirname, "../../../");
        const oldImagePath = path.join(srcPath, parsedUrl.pathname);

        fs.unlinkSync(oldImagePath);

        await users.findByIdAndUpdate(id, {
          $pull: { imageUrlList: { imgUrl: imageUrl } },
        });

        if (!filename) {
          const doc = await posts.findByIdAndUpdate(
            postObject._id,
            {
              ...postObject,
              imageUrl: "",
            },
            { new: true }
          );
          return res.status(200).json({
            data: {
              __newPost: doc,
            },
          });
        }

        await sharp(req.file.path)
          .resize(400, 400)
          .jpeg({ quality: 90 })
          .toFile(path.resolve(req.file.destination, "resized", filename));
        fs.unlinkSync(req.file.path);

        const imgUrl = url + "/public/resized/" + filename;

        const doc = await posts.findByIdAndUpdate(
          postObject._id,
          {
            ...postObject,
            imageUrl: imgUrl,
          },
          {
            new: true,
          }
        );
        await users.findByIdAndUpdate(id, {
          $push: {
            imageUrlList: {
              $each: [
                {
                  imgUrl,
                  postId: postObject._id,
                },
              ],
              $position: 0,
            },
          },
        });
        return res.status(200).json({
          data: {
            __newPost: doc,
          },
        });
      }

      if (!filename) {
        const doc = await posts.findByIdAndUpdate(
          postObject._id,
          {
            ...postObject,
          },
          { new: true }
        );
        return res.status(200).json({
          data: {
            __newPost: doc,
          },
        });
      }

      await sharp(req.file.path)
        .resize(400, 400)
        .jpeg({ quality: 90 })
        .toFile(path.resolve(req.file.destination, "resized", filename));
      fs.unlinkSync(req.file.path);

      const imgUrl = url + "/public/resized/" + filename;

      const doc = await posts.findByIdAndUpdate(
        postObject._id,
        {
          ...postObject,
          imageUrl: imgUrl,
        },
        {
          new: true,
        }
      );
      await users.findByIdAndUpdate(id, {
        $push: {
          imageUrlList: {
            $each: [
              {
                imgUrl,
                postId: postObject._id,
              },
            ],
            $position: 0,
          },
        },
      });
      return res.status(200).json({
        data: {
          __newPost: doc,
        },
      });
    } catch (error) {
      if (req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(500).json({ error: error.message });
    }
  },

  deletePost: async (req, res) => {
    try {
      const id = req.id;
      const { postId } = req.body;

      const docDeleted = await posts.findByIdAndRemove(postId);
      if (docDeleted.imageUrl) {
        const imageUrl = docDeleted.imageUrl;
        const parsedUrl = new URL(imageUrl);
        const srcPath = path.join(__dirname, "../../../");
        const imagePath = path.join(srcPath, parsedUrl.pathname);
        fs.unlink(imagePath, (err) => {
          if (err) {
            return;
          }
        });
      }
      await users.findByIdAndUpdate(id, {
        $pull: { imageUrlList: { postId } },
      });
      return res.status(200).json();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

module.exports = that;
