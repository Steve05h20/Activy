import mongoose, { Schema } from 'mongoose';
import { IActivityDocument } from '../interfaces/activity.interface';

const ActivitySchema: Schema = new Schema({
  titre: { type: String, required: true },
  type: {
    type: String,
    enum: ["Danse", "Fitness", "Raquette", "Randonnée", "Kayak"],
    required: true
  },
  cout: { type: Number, required: true },
  date: { type: Date, required: true },
  heure: { type: String, required: true },
  image: { type: String, required: true }
}, {
  timestamps: true
});

export const Activity = mongoose.model<IActivityDocument>('Activity', ActivitySchema);
