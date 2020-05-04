import webPush from 'web-push';
import dotenv from 'dotenv';

dotenv.config();

webPush.setVapidDetails(
  process.env.URL || '',
  process.env.VAPID_KEY_PUBLIC || '',
  process.env.VAPID_KEY_PRIVATE || '',
);

export default webPush;
