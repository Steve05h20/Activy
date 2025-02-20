import { Router } from 'express';
import { ActivityController } from '../controllers/activity.controller';

export const activityRoutes = Router();

activityRoutes.post('/', ActivityController.create);
activityRoutes.get('/', ActivityController.getAll);
activityRoutes.get('/:id', ActivityController.getById);
activityRoutes.put('/:id', ActivityController.update);
activityRoutes.delete('/:id', ActivityController.delete);
