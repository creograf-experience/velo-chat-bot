import mongoose, { Document } from 'mongoose';
import { ITraining } from './Training';
import { ISubscribe } from './Subscribe';

export interface IUser extends Document {
  _id: string;
  created: number;
  username: string;
  firstname: string;
  lastname: string;
  lastActivity: number;
  myTraining: ITraining[];
  mySubscribe: ISubscribe[];
  gender: string;
  age: string;
  city: string;
  sport: string;
  telegramId:string;
}

export const UserSchema = new mongoose.Schema(
  {
    _id: String,
    created: Number,
    username: String,
    firstname: String,
    lastname: String,
    lastActivity: Number,
    myTraining: [
      {
        type: String,
        ref: 'Training'
      }
    ],
    mySubscribe: [
      {
        type: String,
        ref: 'Subscribe'
      }
    ],
    gender: String,
    age: String,
    city: String,
    sport: String,
    telegramId: String
  },
  { _id: false }
);

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
