import express from 'express';
import jwt from 'jsonwebtoken';

import { Token } from '../interfaces';

import config from '../config';
import models from '../models';

const router = express.Router();

router.get('/', config.connectCors, async (req, res) => {
  try {
    const decoded = await <Token>jwt
      .verify(req.headers.authorization as string, process.env.SECRET_KEY as string);

    const chats = await models.Chat.find({ members: decoded.userId })
      .populate('members', { login: 1 });

    res.status(200).json(chats);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Sorry! Something went wrong!',
    });
  }
});

router.post('/new', config.connectCors, async (req, res) => {
  try {
    const decoded = await <Token>jwt
      .verify(req.headers.authorization as string, process.env.SECRET_KEY as string);
    const queryParams = { members: { $in: [decoded.userId, req.body.recipientID] } };
    const chat = await models.Chat.findOne(queryParams)
      || await models.Chat.create({ members: [decoded.userId, req.body.recipientID] });

    const populatedChat = await chat.populate('members').execPopulate();

    res.status(200).json(populatedChat);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Sorry! Something went wrong!',
    });
  }
});

router.post('/messages', config.connectCors, async (req, res) => {
  try {
    const decoded = await <Token>jwt
      .verify(req.headers.authorization as string, process.env.SECRET_KEY as string);
    const messages = await models.Message.find({ chatID: req.body.chatID })
      .populate('author', { login: 1 });

    if (!decoded || !decoded.userId || !messages) {
      return res.status(404).json('No messages!');
    }

    res.status(200).json(messages);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Sorry! Something went wrong!',
    });
  }
})

export default router;
