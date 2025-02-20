import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { UserData } from '@/interface/user.type';
import { useFetchUser } from '@/composables/useFetchUser';

export const useUsers = defineStore('users', () => {
  const users = ref<UserData[]>([]);
  const user = ref<UserData | null>(null);

  // composable useFetchUser
  const {
    data,
    error,
    loading,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
  } = useFetchUser();

  const findUserById = (uid: string) => {
    user.value = users.value.find((i) => i.uid === uid) || null;
  };

  const getUsers = async () => {
    console.log('Début getUsers dans le store');
    await getAllUsers();
    console.log('Données reçues:', data.value);
    users.value = data.value;
    console.log('Users mis à jour:', users.value);
  };

  const addUser = async (newUser: { uid: string; email: string; password: string; displayName?: string;}) => {
    const result = await createUser(newUser);
    if (result) {
      users.value = data.value;
    }
    return result;
  };

  const removeUser = async (uid: string) => {
    const result = await deleteUser(uid);
    if (result) {
      users.value = users.value.filter((i) => i.uid !== uid);
    }
    return result;
  };

  const editUser = async (uid: string, user: Partial<UserData>) => {
    const result = await updateUser(uid, user);
    if (result) {
      users.value = users.value.map((i) => {
        if (i.uid === uid) {
          return { ...i, ...user };
        }
        return i;
      });
    }
    return result;
  };

  return {
    removeUser,
    users,
    user,
    error,
    loading,
    findUserById,
    getUsers,
    addUser,
    editUser
  };
});
