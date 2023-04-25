const {
  generateAccessToken,
  generateRefreshToken,
  timeExRefreshTokenCookie,
} = require("../utils");
const { users, friends, requests } = require("../models");
const mongoose = require("mongoose");
const sharp = require("sharp");
const fs = require("fs");
const crypto = require("crypto");

const {
  uploadTwoImageToCloundinary,
} = require("../services/uploadImage.cloudinary");

const ObjectId = mongoose.Types.ObjectId;

// todo -1: notfound
// todo  0: view as guest
// todo  1: view as self profile
// todo  2: view as friend profile
// todo  3: view as request reveice
// todo  4: view as request sent
// todo  5: view as other profile

const that = {
  find: async function (req, res) {
    try {
      const { userId } = req.params;
      if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Wrong id user" });
      }
      const user = await users.findById(userId);
      if (!user) {
        return res.status(400).json({
          error: "Not found user",
        });
      }

      delete user.password;
      delete user.refreshToken;
      delete user.gmail;
      delete user.numberPhone;

      return res.status(200).json({
        data: {
          __user: user,
          __mode: 0,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  findWithAuth: async function (req, res) {
    try {
      const { userId } = req.params;
      const id = req.id;
      if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Wrong id user" });
      }
      const user = await users.findById(userId);

      // todo if user dont exist is not found -1
      if (!user) {
        return res.status(200).json({
          data: {
            __user: {},
            __mode: -1,
          },
        });
      }

      delete user.password;
      delete user.refreshToken;
      delete user.gmail;
      delete user.numberPhone;

      const friendData = await friends.aggregate([
        // Lấy ra document của bạn dựa vào userId
        { $match: { userId: mongoose.Types.ObjectId(userId) } },
        // Lấy ra 9 phần tử đầu tiên của friendList
        {
          $project: {
            friendList: { $slice: ["$friendList", 0, 9] },
            friendCount: 1,
          },
        },
        // Populate các phần tử trong friendList với thông tin từ model "users"
        {
          $lookup: {
            from: "users",
            localField: "friendList.friendId",
            foreignField: "_id",
            as: "friendList",
          },
        },
        // Lấy ra thông tin cần thiết của friendList
        {
          $project: {
            friendList: {
              _id: 1,
              fullName: 1,
              avatarUrl: 1,
              mediumAvatarUrl: 1,
              isOnline: 1,
            },
            friendCount: 1,
          },
        },
      ]);

      const _friends = !!friendData[0]
        ? friendData[0]
        : { friendList: [], friendCount: 0 };

      const _user = {
        ...user._doc,
        friends: _friends,
      };

      //todo yourself ::: mode = 1
      if (userId === id) {
        return res.status(200).json({
          data: {
            __user: _user,
            __mode: 1,
          },
        });
      }

      //todo friends ::: mode = 2
      const friendDoc = await friends.findOne({ userId: id });

      if (!!friendDoc) {
        const isfriend = friendDoc.friendList.find(
          (friend) =>
            friend.friendId && friend.friendId.toHexString() === userId
        );
        if (!!isfriend) {
          return res.status(200).json({
            data: {
              __user: _user,
              __mode: 2,
            },
          });
        }
      }

      const requestDoc = await requests.findOne({ userId: id });

      if (!!requestDoc) {
        // todo request received ::: mode = 3
        const isRequestReceived = requestDoc?.requestReceivedList.find(
          (requestReceived) => {
            return (
              requestReceived.userSentId &&
              requestReceived.userSentId.toHexString() === userId
            );
          }
        );

        if (!!isRequestReceived) {
          return res.status(200).json({
            data: {
              __user: _user,
              __mode: 3,
            },
          });
        }

        // todo request sent ::: mode = 4
        const isRequestSent = requestDoc?.requestSentList.find(
          (requestSent) => {
            return requestSent && requestSent.toHexString() === userId;
          }
        );
        if (!!isRequestSent) {
          return res.status(200).json({
            data: {
              __user: _user,
              __mode: 4,
            },
          });
        }
      }

      // todo other profile
      return res.status(200).json({
        data: {
          __user: _user,
          __mode: 5,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  register: async function (req, res) {
    try {
      const user = req.user;
      const newUser = new users({ ...user });
      await newUser.save();
      return res.status(200).json({
        data: {
          __message: "Register sussecced",
        },
      });
    } catch (error) {
      console.log({ error });
      return res.status(500).json({ error: error.message });
    }
  },

  login: async function (req, res) {
    try {
      const user = req.user;

      delete user.password;
      delete user.refreshToken;

      const id = req.id;
      const accessToken = await generateAccessToken(id);
      const refreshToken = await generateRefreshToken(id);

      await users.findByIdAndUpdate(id, {
        refreshToken,
        isOnline: true,
      });

      return res
        .status(200)
        .cookie("refreshToken", refreshToken, {
          httpOnly: false,
          expires: timeExRefreshTokenCookie(),
          secure: true,
          sameSite: "none",
        })
        .json({
          data: {
            __accessToken: accessToken,
            __user: user,
          },
        });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  reLogin: async function (req, res) {
    try {
      const id = req.id;
      const user = req.user;

      delete user.password;
      delete user.refreshToken;

      const accessToken = await generateAccessToken(id);
      const refreshToken = await generateRefreshToken(id);

      await users.findByIdAndUpdate(id, {
        refreshToken,
        isOnline: true,
      });

      return res
        .status(200)
        .cookie("refreshToken", refreshToken, {
          expires: timeExRefreshTokenCookie(),
          httpOnly: false,
          sameSite: "none",
          secure: true,
        })
        .json({
          data: {
            __accessToken: accessToken,
            __user: user,
          },
        });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  getNewAccessToken: async function (req, res) {
    try {
      const id = req.id;
      const accessToken = await generateAccessToken(id);
      return res.status(200).json({
        data: {
          __accessToken: accessToken,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  logout: async function (req, res) {
    try {
      const id = req.id;
      const oldRefreshToken = req.oldRefreshToken;
      await users.findByIdAndUpdate(id, { refreshToken: oldRefreshToken });

      return res.status(200).clearCookie("refreshToken").json({});
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  updateInfo: async function (req, res) {
    try {
      const id = req.id;
      const update = req.body;
      await users.findByIdAndUpdate(id, update);
      return res.status(200).json({});
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },

  updateAvatar: async function (req, res) {
    try {
      const id = req.id;
      const imagePath = req?.file?.path;
      const imageBuffer = await sharp(imagePath).toBuffer();
      fs.unlinkSync(imagePath);

      const [image50x50, image180x180] = await Promise.all([
        sharp(imageBuffer).resize(50, 50).jpeg().toBuffer(),
        sharp(imageBuffer).resize(180, 180).jpeg().toBuffer(),
      ]);

      const [image50x50Result, image180x180Result] =
        await uploadTwoImageToCloundinary(image50x50, image180x180);

      await users.findByIdAndUpdate(id, {
        avatarUrl: image50x50Result.secure_url,
        mediumAvatarUrl: image180x180Result.secure_url,
        $push: {
          imageUrlList: {
            $each: [
              {
                imgUrl: image180x180Result.secure_url,
                postId: image180x180Result.public_id,
              },
            ],
            $position: 0,
          },
        },
      });

      return res.status(200).json({
        data: {
          __result: [
            image50x50Result.secure_url,
            image180x180Result.secure_url,
          ],
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },

  contacts: async function (req, res) {
    try {
      const id = req.id;

      const doc = await friends
        .findOne({ userId: id })
        .populate({
          path: "friendList.friendId",
          select: "_id avatarUrl isOnline fullName updatedAt",
        })
        .select("friendList")
        .limit(20);
      return res.status(200).json({
        data: {
          __contacts: doc.friendList || [],
        },
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

module.exports = that;
