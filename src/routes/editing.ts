import express from 'express';
import jwt from 'jsonwebtoken';

import { Token } from '../interfaces';

import models from '../models';

import transliter from '../utils/transliter';
import sendPush from '../utils/sendPush';

interface Changes {
  id: string;
  nextPages: string[];
  isFirst?: boolean;
}

const { SECRET_KEY = 'jwtsecret' } = process.env;

const router = express.Router();

router.post('/all', async (req, res) => {
  const {
    body: { storyURL },
    headers: { authorization },
  } = req;

  try {
    const decoded = await <Token>jwt.verify(authorization as string, SECRET_KEY);
    const pageList = await models.Page.find({
      storyURL,
      owner: decoded.userId,
    });

    if (!pageList || !pageList[0]) {
      return res.status(400).json({
        error: 'There are not such pages!',
      });
    }

    res.status(200).json(pageList);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Sorry! Something went wrong!',
    });
  }
});

router.post('/save-story', async (req, res) => {
  try {
    const isFirstChanged = req.body.changes.some(({ isFirst }: Changes) => isFirst);
    const decoded = await <Token>jwt.verify(req.headers.authorization as string, SECRET_KEY);

    req.body.changes.forEach(async (item: Changes) => {
      await models.Page.findByIdAndUpdate(item.id, {
        ...(item.isFirst && { isFirst: item.isFirst }),
        nextPages: item.nextPages,
      });
    });

    if (isFirstChanged) {
      await models.Page.findOneAndUpdate({ isFirst: true }, { isFirst: false });
    }

    const pageList = await models.Page.find({
      storyURL: req.body.storyURL,
      owner: decoded.userId,
    });

    res.status(200).json(pageList);
  } catch (err) {
    console.error(err);
  }
});

router.post('/save', async (req, res) => {
  const {
    body: {
      pageId,
      title,
      body,
      storyURL,
      options,
      nextPages,
      isFirst = false,
    },
    headers: {
      authorization,
    },
  } = req;
  const newStoryURL = `${transliter.getSlugString(title)}-${Date.now().toString(36)}`;
  const editParams = {
    ...(title && { title }),
    ...(body && { body }),
    ...(options && { options }),
    ...(nextPages && { nextPages }),
    storyURL: storyURL || newStoryURL,
    isFirst: !storyURL || isFirst,
  };

  try {
    const decoded = await <Token>jwt.verify(authorization as string, SECRET_KEY);
    const user = models.User.findById(decoded.userId);
    let editedPage = null;

    if (!user) {
      return res.status(400).json({
        error: 'There is not the user!',
      });
    }

    if (isFirst && storyURL) {
      await models.Page.findOneAndUpdate({ storyURL, isFirst }, { isFirst: false });
    }

    if (!pageId) {
      editedPage = await models.Page.create({
        ...editParams,
        owner: decoded.userId,
      });

      if (!editedPage) {
        return res.status(400).json({
          error: 'There is not the page!',
        });
      }

      return res.status(200).json({
        pageId: editedPage.id,
        storyURL: editedPage.storyURL,
      });
    }

    editedPage = await models.Page.findOneAndUpdate(
      {
        _id: pageId,
        owner: decoded.userId,
      },
      editParams,
    );

    if (!editedPage) {
      return res.status(400).json({
        error: 'There is not the page!',
      });
    }

    res.status(200).json({
      pageId: editedPage.id,
      storyURL: editedPage.storyURL,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Sorry! Something went wrong!',
    });
  }
});

router.post('/edit', async (req, res) => {
  const {
    body: { pageId },
    headers: { authorization },
  } = req;

  try {
    const decoded = await <Token>jwt.verify(authorization as string, SECRET_KEY);
    const page = await models.Page.findOne({
      _id: pageId,
      owner: decoded.userId,
    });

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

router.post('/remove-page', async (req, res) => {
  const {
    body: { pageId },
    headers: { authorization },
  } = req;

  try {
    const decoded = await <Token>jwt.verify(authorization as string, SECRET_KEY);

    await models.Page.deleteOne({
      _id: pageId,
      owner: decoded.userId,
    });

    res.status(200).json('success');
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Sorry! Something went wrong!',
    });
  }
});

router.post('/remove-story', async (req, res) => {
  const {
    body: { storyURL },
    headers: { authorization },
  } = req;

  try {
    const decoded = await <Token>jwt.verify(authorization as string, SECRET_KEY);

    await models.Page.deleteMany({ storyURL, owner: decoded.userId });

    res.status(200).json('success');
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Sorry! Something went wrong!',
    });
  }
});

router.post('/publish', async (req, res) => {
  const {
    body: { storyURL },
    headers: { authorization },
  } = req;

  try {
    const decoded = await <Token>jwt.verify(authorization as string, SECRET_KEY);
    const owner = await models.User.findById(decoded.userId);
    const pages = await models.Page.find({ storyURL, owner: decoded.userId });

    const ellipsis = pages[0].title.length > 100 ? '...' : '';
    const title = pages[0].title.substring(0, ellipsis ? 97 : 100);

    await models.Page.updateMany(
      { storyURL, owner: decoded.userId },
      { isPublished: true }
    );

    if (!owner) {
      return res.status(400).json({
        error: 'There is not the user!',
      });
    }

    if (!pages || !pages[0]) {
      return res.status(400).json({
        error: 'There is not the story!',
      });
    }

    res.status(200).json('success');

    sendPush(owner.followers, {
      title: `${owner.login} published a new story!`,
      body: `${title}${ellipsis}`,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Sorry! Something went wrong!',
    });
  }
});

router.post('/unpublish', async (req, res) => {
  const {
    body: { storyURL },
    headers: { authorization },
  } = req;

  try {
    const decoded = await <Token>jwt.verify(authorization as string, SECRET_KEY);

    await models.Page.updateMany(
      { storyURL, owner: decoded.userId },
      { isPublished: false }
    );

    res.status(200).json('success');
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Sorry! Something went wrong!',
    });
  }
});

export default router;
