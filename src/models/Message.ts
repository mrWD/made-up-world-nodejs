import mongoose from 'mongoose';

interface Message extends mongoose.Document {
  text: string;
  chat: mongoose.Schema.Types.ObjectId;
  author: mongoose.Schema.Types.ObjectId;
}

const schema = new mongoose.Schema(
  {
    text: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    chatID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
    },
  },
  {
    timestamps: true,
  }
);

schema.set('toJSON', {
  virtuals: true,
});

export default mongoose.model<Message>('Message', schema);
