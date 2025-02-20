import { Request, Response } from 'express';
import { Activity } from '../models/activity.model';
import { IActivity } from '../interfaces/activity.interface';

export class ActivityController {
  // Créer une nouvelle activité
  public static async create(req: Request, res: Response): Promise<void> {
    try {
      const activityData: IActivity = req.body;
      const activity = new Activity(activityData);
      const result = await activity.save();
      res.status(201).json(result);
    } catch{
      res.status(500).json({ error: 'Erreur lors de la création de l\'activité' });
    }
  }

  // Récupérer toutes les activités
  public static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const activities = await Activity.find();
      res.status(200).json(activities);
    } catch{
      res.status(500).json({ error: 'Erreur lors de la récupération des activités' });
    }
  }

  // Récupérer une activité par son ID
  public static async getById(req: Request, res: Response): Promise<void> {
    try {
      const activity = await Activity.findById(req.params.id);
      if (!activity) {
        res.status(404).json({ error: 'Activité non trouvée' });
        return;
      }
      res.status(200).json(activity);
    } catch {
      res.status(500).json({ error: 'Erreur lors de la récupération de l\'activité' });
    }
  }

  // Mettre à jour une activité
  public static async update(req: Request, res: Response): Promise<void> {
    try {
      const activityData: Partial<IActivity> = req.body;
      const activity = await Activity.findByIdAndUpdate(
        req.params.id,
        activityData,
        { new: true, runValidators: true }
      );
      if (!activity) {
        res.status(404).json({ error: 'Activité non trouvée' });
        return;
      }
      res.status(200).json(activity);
    } catch{
      res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'activité' });
    }
  }

  // Supprimer une activité
  public static async delete(req: Request, res: Response): Promise<void> {
    try {
      const activity = await Activity.findByIdAndDelete(req.params.id);
      if (!activity) {
        res.status(404).json({ error: 'Activité non trouvée' });
        return;
      }
      res.status(200).json({ message: 'Activité supprimée avec succès' });
    } catch{
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'activité' });
    }
  }
}
