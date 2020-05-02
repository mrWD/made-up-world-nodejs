import mongoose from 'mongoose';

export interface Push extends mongoose.Document {
  endpoint: string;
  p256dh: string;
  auth: string;
}

const schema = new mongoose.Schema(
  {
    endpoint: {
      type: String,
      required: true,
    },
    p256dh: {
      type: String,
      required: true,
    },
    auth: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Push>('Push', schema);
