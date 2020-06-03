import {
  connection,
  IMessage,
  server,
  request,
} from 'websocket';
import { Server } from 'http';
import { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';

import { Token } from '../interfaces';

import models from '../models';
import sendPush from '../utils/sendPush';

interface IMsg {
  text: string;
  token: string,
  chatID: string,
}

const connectSocket = (httpServer: Server) => {
  const connectionList: connection[] = [];
  const wsServer = new server({ httpServer });

  wsServer.on('request', (req: request) => {
    const onlineUserSet = new Set();
    const connection = req.accept(undefined, req.origin);
    const index = connectionList.push(connection) - 1;
    let userId: Schema.Types.ObjectId;

    connection.on('message', async (msg: IMessage) => {
      if (msg.type !== 'utf8' || !msg.utf8Data) {
        throw new Error('Empty message');
      }

      try {
        const data: IMsg = JSON.parse(msg.utf8Data);
        const decoded = await <Token>jwt.verify(data.token, process.env.SECRET_KEY as string);
        const chat = await models.Chat.findById(data.chatID);
        const members = JSON.stringify(chat?.members);
        const recipient = JSON.parse(members)
          .find((id: Schema.Types.ObjectId) => id !== decoded.userId);

        userId = decoded.userId;

        await models.Message.create({
          text: data.text,
          author: decoded.userId,
          chatID: chat?.id,
        });

        onlineUserSet.add(decoded.userId);

        connectionList.forEach((user) => user.sendUTF(JSON.stringify({
          text: data.text,
          author: decoded.login,
          chatID: chat?.id,
        })));

        // if (!onlineUserSet.has(recipient)) {
        //   sendPush(recipient, {
        //     title: `${decoded.login} sent you a message!`,
        //     body: data.text,
        //   });
        // }
      } catch (err) {
        console.error(err);
      }
    });

    connection.on('close', () => {
      connectionList.splice(index, 1);
      onlineUserSet.delete(userId);
    });
  });
};

export default connectSocket;
