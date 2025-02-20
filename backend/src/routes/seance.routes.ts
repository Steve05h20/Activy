import express, { Request, Response, NextFunction } from 'express';
import { seanceController } from '../controllers/seance.controller';

const router = express.Router();

// Obtenir toutes les séances (pour l'admin)
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  seanceController.getAllSeances(req, res).catch(next);
});

// Créer une nouvelle séance (après paiement)
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  seanceController.create(req, res).catch(next);
});

// Obtenir toutes les séances d'un utilisateur
router.get('/user/:userId', (req: Request, res: Response, next: NextFunction) => {
  seanceController.getByUserId(req, res).catch(next);
});

// Obtenir une séance spécifique
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  seanceController.getById(req, res).catch(next);
});

// Annuler une séance
router.put('/:id/cancel', (req: Request, res: Response, next: NextFunction) => {
  seanceController.cancel(req, res).catch(next);
});

// Obtenir l'historique des séances
router.get('/history/:userId', (req: Request, res: Response, next: NextFunction) => {
  seanceController.getHistory(req, res).catch(next);
});

// Traiter le panier
router.post('/process-cart', (req: Request, res: Response, next: NextFunction) => {
  seanceController.processCart(req, res).catch(next);
});

// Supprimer une séance
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  seanceController.delete(req, res).catch(next);
});

export default router;
