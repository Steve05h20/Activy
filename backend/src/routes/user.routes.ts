// src/routes/auth.ts
import { Router } from 'express';
import { createUser, deleteUser, getUserByEmail, getUserByUid, getUsers, toggleUserStatus, updateUser } from '../controllers/user.controller';


const userRoutes = Router();

userRoutes.get('/users', getUsers);
userRoutes.post('/users', createUser);
userRoutes.delete('/users/:uid', deleteUser);
userRoutes.put('/users/:uid', updateUser);




userRoutes.get('/users/:uid', getUserByUid);
userRoutes.patch('/users/:uid/status', toggleUserStatus);
userRoutes.get('/users/email/:email', getUserByEmail);

export default userRoutes;
