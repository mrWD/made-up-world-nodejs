import webPush from 'web-push';
import dotenv from 'dotenv';

dotenv.config();

const { publicKey, privateKey } = webPush.generateVAPIDKeys();

webPush.setVapidDetails(
  process.env.URL || '',
  publicKey,
  privateKey,
);

export {
  publicKey as VAPIDKeyPublic,
};

export default webPush;
