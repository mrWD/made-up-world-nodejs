import webPush from 'web-push';
import dotenv from 'dotenv';

dotenv.config();

const { publicKey, privateKey } = webPush.generateVAPIDKeys();

console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
console.log('publicKey', publicKey);
console.log('privateKey', privateKey);
console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');

webPush.setVapidDetails(
  process.env.URL || '',
  publicKey,
  privateKey,
);

export {
  publicKey as VAPIDKeyPublic,
};

export default webPush;
