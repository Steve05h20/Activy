import { Request, Response } from 'express';
import { getAuth } from 'firebase-admin/auth';
import admin from 'firebase-admin';
import serviceAccount from './../serviceAccountKey.json';

let auth: admin.auth.Auth;

try {
  if (!admin.apps.length) {  // Vérifier si Firebase n'est pas déjà initialisé
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
    });
  }
  auth = admin.auth();
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  process.exit(1);
}

// Interface for user creation
interface CreateUserData {
  email: string;
  password: string;
  displayName?: string;
  phoneNumber?: string;
}

// Interface for user update
interface UpdateUserData {
  email?: string;
  password?: string;
  displayName?: string;
  phoneNumber?: string;
  disabled?: boolean;
}

// Get all users with pagination
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const maxResults = 1000;
    const pageToken = req.query.pageToken as string | undefined;

    const listUsersResult = await auth.listUsers(maxResults, pageToken);
    const users = listUsersResult.users.map(user => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      phoneNumber: user.phoneNumber,
      disabled: user.disabled
    }));

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
};

// Get a specific user by UID
export const getUserByUid = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uid } = req.params;
    const userRecord = await getAuth().getUser(uid);
    res.status(200).json(userRecord);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(404).json({ error: 'Utilisateur non trouvé' });
  }
};

// Create a new user
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData: CreateUserData = req.body;

    const userRecord = await getAuth().createUser({
      email: userData.email,
      password: userData.password,
      displayName: userData.displayName,
      phoneNumber: userData.phoneNumber,
    });

    res.status(201).json(userRecord);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ error: 'Erreur lors de la création de l\'utilisateur' });
  }
};

// Update a user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uid } = req.params;
    const userData: UpdateUserData = req.body;

    const userRecord = await getAuth().updateUser(uid, userData);
    res.status(200).json(userRecord);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(400).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uid } = req.params;
    await getAuth().deleteUser(uid);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(400).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
  }
};

// Disable/Enable a user
export const toggleUserStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uid } = req.params;
    const { disabled } = req.body;

    const userRecord = await getAuth().updateUser(uid, { disabled });
    res.status(200).json(userRecord);
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(400).json({ error: 'Erreur lors de la modification du statut de l\'utilisateur' });
  }
};

// Get user by email
export const getUserByEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.params;
    const userRecord = await getAuth().getUserByEmail(email);
    res.status(200).json(userRecord);
  } catch (error) {
    console.error('Error fetching user by email:', error);
    res.status(404).json({ error: 'Utilisateur non trouvé' });
  }
};
