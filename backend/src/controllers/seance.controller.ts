import { Request, Response } from 'express';
import { Seance } from '../models/seance.model';

class SeanceController {
  // Créer une nouvelle séance
  async create(req: Request, res: Response) {
    try {
      const { userId, userEmail, activityId, montantPayé } = req.body;
      const nouvelleSeance = new Seance({
        userId,
        userEmail,
        activityId,
        montantPayé
      });
      await nouvelleSeance.save();
      res.status(201).json(nouvelleSeance);
    } catch (error: any) {
      res.status(500).json({ message: "Erreur lors de la création de la séance", error: error.message });
    }
  }

  // Obtenir toutes les séances d'un utilisateur
  async getByUserId(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const seances = await Seance.find({ userId }).populate('activityId');
      res.json(seances);
    } catch (error: any) {
      res.status(500).json({ message: "Erreur lors de la récupération des séances", error: error.message });
    }
  }

  // Traiter le panier
  async processCart(req: Request, res: Response) {
    try {
      const { userId, userEmail, cartItems } = req.body;

      if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: "Le panier est vide" });
      }

      const seances = [];
      for (const item of cartItems) {
        const nouvelleSeance = new Seance({
          userId,
          userEmail,
          activityId: item.activityId,
          montantPayé: item.price,
          status: 'payée'
        });
        await nouvelleSeance.save();
        seances.push(nouvelleSeance);
      }

      res.status(201).json({
        message: "Panier traité avec succès",
        seances
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Erreur lors du traitement du panier",
        error: error.message
      });
    }
  }

  // Obtenir une séance spécifique
  async getById(req: Request, res: Response) {
    try {
      const seance = await Seance.findById(req.params.id).populate('activityId');
      if (!seance) {
        return res.status(404).json({ message: "Séance non trouvée" });
      }
      res.json(seance);
    } catch (error: any) {
      res.status(500).json({ message: "Erreur lors de la récupération de la séance", error: error.message });
    }
  }

  // Annuler une séance
  async cancel(req: Request, res: Response) {
    try {
      const seance = await Seance.findById(req.params.id);
      if (!seance) {
        return res.status(404).json({ message: "Séance non trouvée" });
      }
      seance.status = 'annulée';
      await seance.save();
      res.json(seance);
    } catch (error: any) {
      res.status(500).json({ message: "Erreur lors de l'annulation de la séance", error: error.message });
    }
  }

  // Obtenir l'historique des séances d'un utilisateur
  async getHistory(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const seances = await Seance.find({ userId })
        .populate('activityId')
        .sort({ dateReservation: -1 })
        .limit(10);
      res.json(seances);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération de l'historique", error });
    }
  }

  // Supprimer une séance
  async delete(req: Request, res: Response) {
    try {
      const seance = await Seance.findById(req.params.id);
      if (!seance) {
        return res.status(404).json({ message: "Séance non trouvée" });
      }

      if (seance.status !== 'annulée') {
        return res.status(400).json({ message: "Impossible de supprimer une séance non annulée" });
      }

      await Seance.findByIdAndDelete(req.params.id);
      res.json({ message: "Séance supprimée avec succès" });
    } catch (error: any) {
      res.status(500).json({ message: "Erreur lors de la suppression de la séance", error: error.message });
    }
  }

  // Obtenir toutes les séances (pour l'admin)
  async getAllSeances(req: Request, res: Response) {
    try {
      const seances = await Seance.find()
        .populate({
          path: 'activityId',
          select: 'titre type date heure cout'
        })
        .sort({ dateReservation: -1 });

      const formattedSeances = seances.map(seance => {
        const activityData = seance.activityId as any;
        return {
          _id: seance._id,
          userEmail: seance.userEmail,
          activityId: {
            _id: activityData._id,
            titre: activityData.titre,
            type: activityData.type,
            date: activityData.date,
            heure: activityData.heure,
            cout: activityData.cout
          },
          dateReservation: seance.dateReservation,
          status: seance.status,
          montantPayé: seance.montantPayé
        };
      });

      res.json(formattedSeances);
    } catch (error: any) {
      console.error('Erreur détaillée:', error);
      res.status(500).json({
        message: "Erreur lors de la récupération des séances",
        error: error.message
      });
    }
  }
}

export const seanceController = new SeanceController();
