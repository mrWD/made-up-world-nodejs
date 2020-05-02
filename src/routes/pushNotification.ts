import webPush from '../config/connectWebPush';
import express from 'express';
import jwt from 'jsonwebtoken';

import models from '../models';
import { Token } from '../interfaces';

webPush.setVapidDetails(
  'http://localhost:5000/',
  process.env.VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || '',
);

const { SECRET_KEY = 'jwtsecret' } = process.env;
const TTL: 60 = 60;

const router = express.Router();

router.post('/subscribe', async (req, res) => {
  try {
    const decoded = await <Token>jwt.verify(req.headers.authorization as string, SECRET_KEY);
    const notification = await models.Push.create({
      endpoint: req.body.endpoint,
      p256dh: req.body.keys.p256dh,
      auth: req.body.keys.auth,
      owner: decoded.userId,
      TTL,
    });
    const subscribtion = req.body;
    const options = { TTL: 6000 };
    const payload = JSON.stringify({
      title: 'message.title',
      body: 'message.body',
      icon: 'https://cdn1.iconfinder.com/data/icons/books-23/100/book_read_magazine-01-512.png',
    });

    console.log('test 1');

    webPush.sendNotification(subscribtion, payload, options).then(function() {
      console.log('Send welcome push notification');
      console.log('subscribe');
      return;
    }).catch(err => {
      console.error('Unable to send welcome push notification', err );
      console.log('subscription not possible');
      return;
    });
    console.log('test 2');

    if (!notification) {
      return res.status(400).json({
        error: 'There is not subscribers on this notification!',
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

router.post('/unsubscribe', async (req, res) => {
  try {
    await models.Push.findOneAndRemove({
      endpoint: req.body.endpoint,
    });

    res.status(200).json('success');
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Sorry! Something went wrong!',
    });
  }
});

export default router;
