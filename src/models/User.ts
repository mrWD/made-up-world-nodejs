import mongoose, { Schema } from 'mongoose';

interface User extends mongoose.Document {
  login: string;
  password: string;
  followers: Schema.Types.ObjectId[];
  followings: Schema.Types.ObjectId[];
}

const schema = new Schema(
  {
    login: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
    followers: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    followings: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  {
    timestamps: true,
  },
);

schema.set('toJSON', {
  virtuals: true,
});

export default mongoose.model<User>('User', schema);
