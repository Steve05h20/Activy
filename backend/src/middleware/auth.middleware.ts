import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  next();
};

export const adminAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const adminToken = req.headers['admin-token'];

  if (!adminToken) {
    return res.status(401).json({ message: 'Token admin manquant' });
  }

  // Vérifier le token admin
  // Pour l'instant, on utilise une vérification simple
  if (adminToken !== process.env.ADMIN_SECRET_TOKEN) {
    return res.status(403).json({ message: 'Token admin invalide' });
  }

  next();
};
