import express from 'express';
import mongoose from 'mongoose';
import { activityRoutes } from './routes/activity.routes';

import cors from 'cors';
import userRoutes from './routes/user.routes';
import seanceRoutes from './routes/seance.routes';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/activities', activityRoutes);
app.use('/api', userRoutes);
app.use('/api/seances', seanceRoutes);

// MongoDB connection
mongoose.connect('mongodb+srv:')
  .then(() => console.log('Connecté à MongoDB'))
  .catch((err) => console.error('Erreur de connexion à MongoDB:', err));
// Gestion des erreurs globale
app.use((err: Error, req: express.Request, res: express.Response) => {
  console.error('Erreur:', err);
  res.status(500).json({
    message: 'Une erreur est survenue !',
    error: err.message || 'Erreur inconnue'
  });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});

export default app;
