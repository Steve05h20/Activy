export interface IActivity{
  _id?:string
  titre:string
  type:TypeAcitivity
  cout:number
  date:Date | string
  heure:string
  image: string;
}

export type TypeAcitivity= "Danse" | "Fitness" | "Raquette" | "Randonnée" | "Kayak"



