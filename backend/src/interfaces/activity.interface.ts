// src/interfaces/activity.interface.ts
import { Document } from 'mongoose';

export type TypeAcitivity = "Danse" | "Fitness" | "Raquette" | "Randonnée" | "Kayak";

// Interface de base sans _id
export interface IActivityBase {
  titre: string;
  type: TypeAcitivity;
  cout: number;
  date: Date;
  heure: string;
  image: string;
}

// Interface étendue avec _id optionnel pour l'utilisation générale
export interface IActivity extends IActivityBase {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface pour le document Mongoose
export interface IActivityDocument extends IActivityBase, Document {
  createdAt: Date;
  updatedAt: Date;
}

export class ModelActivity implements IActivity {
  constructor(
    public titre: string,
    public type: TypeAcitivity,
    public image: string,
    public cout: number,
    public date: Date,
    public heure: string,
    public _id?: string,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}
