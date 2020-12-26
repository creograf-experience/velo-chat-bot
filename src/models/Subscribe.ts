import mongoose, { Document } from 'mongoose';

export interface ISubscribe extends Document {
  _id: string;
  userId: string;
  typeSport: string;
  city: string;
}

export const SubscribeSchema = new mongoose.Schema(
  {
    _id: String,
    userId: String,
    typeSport: String,
    city: String
  },
  { _id: false }
);

const Subscribe = mongoose.model<ISubscribe>('Subscribe', SubscribeSchema);
export default Subscribe;