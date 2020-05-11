import express from 'express';
import jwt from 'jsonwebtoken';

import { Token } from '../interfaces';

import models from '../models';

const { SECRET_KEY = 'jwtsecret' } = process.env;
const PER_PAGE: 10 = 10;
const router = express.Router();

router.post('/all', async (req, res) => {
  const {
    body: {
      page = 1,
      perPage = PER_PAGE,
      title,
      owner,
      sortBy,
    },
    headers: { authorization },
  } = req;

  const firstIndex = perPage * page - perPage;
  let decoded = null;
  let isPublished = true;

  try {
    console.log('start try');

    if (authorization) {
      console.log('start authorization');
      decoded = await <Token>jwt.verify(authorization as string, SECRET_KEY);
      isPublished = !authorization || !owner || owner !== decoded?.login;
    }

    console.log('end authorization');

    console.log('start users');
    const users = await models.User.find({ ...(owner && { login: new RegExp(owner) }) });
    console.log('end users', users);

    console.log('start storyList');
    const storyList = await models.Page
      .find({
        ...(owner && users[0] && { $or: users.map((user) => ({ owner: user.id })) }),
        ...(title && { title: new RegExp(title) }),
        ...(isPublished && { isPublished }),
        isFirst: true,
      })
      .sort(sortBy)
      .populate('owner', { login: 1 });

    console.log('end storyList', storyList);

    res.status(200).json({
      storyList: storyList.slice(firstIndex, firstIndex + perPage),
      page,
      pages: Math.ceil(storyList.length / perPage),
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Sorry! Something went wrong!',
    });
  }
});

router.post('/page', async (req, res) => {
  const { storyURL, pageId } = req.body;
  const queryConditions = {
    ...(!pageId && { isFirst: !pageId }),
    ...(storyURL && { storyURL }),
    ...(pageId && { _id: pageId }),
  };

  try {
    const page = await models.Page.findOne(queryConditions).populate('owner', { login: 1 });

    if (!page) {
      return res.status(400).json({
        error: 'There is not the page!',
      });
    }

    res.status(200).json(page);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Sorry! Something went wrong!',
    });
  }
});

export default router;
