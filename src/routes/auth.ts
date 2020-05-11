import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';

import { Token } from '../interfaces';

import { VAPIDKeyPublic } from '../config/connectWebPush';
import validator from '../utils/validator';

import config from '../config';
import models from '../models';

const { SECRET_KEY = 'jwtsecret' } = process.env;

const router = express.Router();

router.post('/signup', config.connectCors, async (req, res) => {
  const { login, password, passwordConfirm } = req.body;
  const logAndPassValidation = validator.validateLoginPassword(login, password);
  const passwordConfirmValidation = validator.validatePassConfirm(password, passwordConfirm);

  if (logAndPassValidation || passwordConfirmValidation) {
    return res.json({
      error: logAndPassValidation || passwordConfirmValidation,
    });
  }

  try {
    const user = await models.User.findOne({ login });

    if (user) {
      return res.status(400).json({
        error: 'Login is already used!',
      });
    }

    bcrypt.hash(password, '', null, async (_, hash: string): Promise<void> => {
      try {
        const newUser = await models.User.create({
          login,
          password: hash,
        });

        res.status(200).json(newUser.id);
      } catch (err) {
        console.error(err);

        res.status(500).json({
          error: 'Sorry! Something went wrong!',
        });
      }
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Sorry! Something went wrong!',
    });
  }
});

router.post('/signin', config.connectCors, async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({
      error: 'All fields are required!',
    });
  }

  try {
    const user = await models.User.findOne({ login });

    if (!user) {
      return res.status(400).json({
        error: 'Login or password is wrong!',
      });
    }

    bcrypt.compare(password, user.password, (err: Error, result: boolean) => {
      if (!result) {
        return res.status(400).json({
          error: 'Login or password is wrong!',
        });
      }

      const token = jwt.sign(
        {
          userId: user._id,
          login: user.login,
          vapidKey: VAPIDKeyPublic,
        },
        SECRET_KEY,
      );

      if (!token) {
        return res.status(400).json({
          error: 'Token is not created!',
        });
      }

      res.status(200).json({ token });
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Sorry! Something went wrong!',
    });
  }
});

router.get('/', config.connectCors, async (req, res) => {
  try {
    const decoded = await <Token>jwt.verify(req.headers.authorization as string, SECRET_KEY);
    const user = await models.User.findById(decoded.userId)
      .populate('friends', { login: 1 });

    if (!user) {
      return res.status(400).json({
        error: 'There is not such user!',
      });
    }

    res.status(200).json({
      login: user.login,
    });
  } catch (err) {
    console.error(err);

    return res.status(401).json({
      error: 'Unauthorised',
    });
  }
});

router.get('/logout', config.connectCors, (req, res) => {
  if (req.session) {
    req.session.destroy(() => {
      res.redirect('/');
    });

    return;
  }

  res.redirect('/');
});

export default router;
