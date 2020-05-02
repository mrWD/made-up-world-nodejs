import { Schema, Document, model } from 'mongoose';

interface Chat extends Document {
  members: Schema.Types.ObjectId[];
}

const schema = new Schema(
  {
    members: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
  }
);

schema.set('toJSON', {
  virtuals: true,
});

export default model<Chat>('Chat', schema);
