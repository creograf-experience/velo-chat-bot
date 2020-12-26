import mongoose, { Document } from 'mongoose';

export interface ITraining extends Document {
    _id:string;
    created: number;
    city: string;
    startPoint: string;
    startTime: string;
    typeTraining: string;
    distantion: string;
    timeTraining: string;
    descriptionTraining: string;
    chatUrl: string;
    idLeader: string;
    typeSport: string;
    startPointLocation:object;
    titleChat: string;
    startDate: string;
    checkDate: string;
    leaderUserName: string;
  }
  
  export const TrainingSchema = new mongoose.Schema(
    {
      _id: String,
      created: Number,
      city: String,
      startPoint: String,
      startTime: String,
      typeTraining: String,
      distantion: String,
      timeTraining: String,
      descriptionTraining: String,
      chatUrl: String,
      idLeader: String,
      typeSport: String,
      startPointLocation:Object,
      titleChat: String,
      startDate: String,
      checkDate: String,
      leaderUserName: String
    },
    { _id: false }
  );
  
  const Training = mongoose.model<ITraining>('Training', TrainingSchema);
  export default Training;