import { Schema } from 'mongoose';

export interface Token {
  userId: Schema.Types.ObjectId;
  login: string;
  vapidKey: string;
}
