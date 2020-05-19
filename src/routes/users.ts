import express from 'express';
import jwt from 'jsonwebtoken';

import { Token } from '../interfaces';

import models from '../models';
import sendPush from '../utils/sendPush';

const { SECRET_KEY = 'jwtsecret' } = process.env;
const PER_PAGE = 10;

const router = express.Router();

router.post('/user-info', async (req, res) => {
  try {
    const user = await models.User.findOne({ login: req.body.login })
      .populate('followers', { login: 1 })
      .populate('followings', { login: 1 });

    if (!user) {
      return res.status(400).json({
        error: 'There is not the user!',
      });
    }

    res.status(200).json({
      ...user,
      destination: process.env.DESTINATION,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Sorry! Something went wrong!',
    });
  }
});

router.post('/all', async (req, res) => {
  const {
    page = 1,
    perPage = PER_PAGE,
    login,
    sortBy = 'login',
  } = req.body;

  const firstIndex = perPage * page - perPage;

  try {
    const userList = await models.User.find({ ...(login && { login: new RegExp(login) }) })
      .sort(sortBy)
      .populate('followers', { login: 1 });

    if (!userList || !userList[0]) {
      return res.status(400).json({
        error: 'There are not such users!',
      });
    }

    res.status(200).json({
      userList: userList.slice(firstIndex, firstIndex + perPage),
      destination: process.env.DESTINATION,
      pages: Math.ceil(userList.length / perPage),
      page,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Sorry! Something went wrong!',
    });
  }
});

router.post('/follow', async (req, res) => {
  try {
    const decoded = await <Token>jwt.verify(req.headers.authorization as string, SECRET_KEY);
    const followedUser = await models.User.findOneAndUpdate(
      { login: req.body.login },
      { $push: { followers: decoded.userId } }
    );
    const user = await models.User.findByIdAndUpdate(
      decoded.userId,
      { $push: { followings: followedUser?.id } }
    );

    if (!followedUser || !user) {
      return res.status(400).json({
        error: 'There is not the user!',
      });
    }

    res.status(200).json('success');

    sendPush(followedUser.id, {
      title: `${user.login} started following you!`,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Sorry! Something went wrong!',
    });
  }
});

router.post('/unfollow', async (req, res) => {
  try {
    const decoded = await <Token>jwt.verify(req.headers.authorization as string, SECRET_KEY);
    const user = await models.User.findOneAndUpdate(
      { login: req.body.login },
      {
        $pull: {
          followers: { $in: decoded.userId },
        },
      }
    );

    if (!user) {
      return res.status(400).json({
        error: 'There is not the user!',
      });
    }

    const followedUser = await models.User.findByIdAndUpdate(
      decoded.userId,
      {
        $pull: {
          following: { $in: user.id },
        },
      }
    );

    if (!followedUser) {
      return res.status(400).json({
        error: 'There is not the user!',
      });
    }

    res.status(200).json('success');
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Sorry! Something went wrong!',
    });
  }
});

export default router;
