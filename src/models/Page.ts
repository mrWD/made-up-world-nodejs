import mongoose, { Schema } from 'mongoose';

interface Page extends mongoose.Document {
  isFirst: boolean;
  title: string;
  body: string;
  storyURL: string;
  owner: Schema.Types.ObjectId;
  nextPages: string[];
  options: string[];
}

const schema = new Schema(
  {
    title: {
      type: String,
    },
    body: {
      type: String,
    },
    storyURL: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    isFirst: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    nextPages: [
      {
        type: String,
      },
    ],
    options: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

schema.set('toJSON', {
  virtuals: true,
});

export default mongoose.model<Page>('Page', schema);
