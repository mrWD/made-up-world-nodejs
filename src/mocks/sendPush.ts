import webPush from '../config/connectWebPush';
import models from '../models';

interface PushNotification {
  endpoint: string;
  p256dh: string;
  auth: string;
}

const sendPush = async (isStart = false): Promise<void> => {
  if (!isStart) return;

  try {
    const allNotifications = await models.Push.find({});

    if (!allNotifications.length) {
      console.log('\x1b[34m', 'There are not subscribers!');
      return;
    }

    allNotifications.forEach((item: PushNotification): void => {
      const subscribtion = {
        endpoint: item.endpoint,
        keys: {
          p256dh: item.p256dh,
          auth: item.auth,
        },
      };

      const payload = JSON.stringify({
        title: 'Server works again!',
        body: 'Thank you for enabling push notifications',
        icon: 'https://cdn1.iconfinder.com/data/icons/books-23/100/book_read_magazine-01-512.png',
      });

      const options = { TTL: 60 };

      webPush.sendNotification(subscribtion, payload, options);
    });

    console.log('\x1b[34m', `Notifications sent ${allNotifications.length} successfully!`);
  } catch (err) {
    console.error('mocks', err);
  }
};

export default sendPush;
