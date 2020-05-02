import webPush from '../config/connectWebPush';
import models, { PushNotification } from '../models';
import { Schema } from 'mongoose';

interface Message {
  title?: string;
  body?: string;
}

type UserId = Schema.Types.ObjectId | Schema.Types.ObjectId[] | undefined;

const sendPush = async (userId: UserId, message: Message) => {
  let notifiableList: PushNotification[] = [];

  if (!userId) return;

  try {
    notifiableList = Array.isArray(userId)
      ? await models.Push.find({ owner: { $in : userId  } })
      : await models.Push.find({ owner: userId });
    
    const options = { TTL: 6000 };
    const payload = JSON.stringify({
      title: message.title,
      body: message.body,
      icon: 'https://cdn1.iconfinder.com/data/icons/books-23/100/book_read_magazine-01-512.png',
    });
    
    notifiableList[0] && notifiableList.forEach((item) => {
      const subscribtion = {
        endpoint: item.endpoint,
        keys: {
          p256dh: item.p256dh,
          auth: item.auth,
        },
      };
  
      webPush.sendNotification(subscribtion, payload, options);
    });
  } catch (err) {
    console.error('utils', err);
  }
};

export default sendPush;
