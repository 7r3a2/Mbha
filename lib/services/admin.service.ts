import { findUserById, updateUserPassword } from '../repositories/user.repository';
import { unlockUserAccount, deactivateAllUserSessions } from '../session-utils';

export { isAdmin } from './auth.service';

export async function resetPassword(userId: string, newPassword: string) {
  if (!userId || !newPassword) {
    throw new Error('User ID and new password are required');
  }

  if (newPassword.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  const user = await findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const updatedUser = await updateUserPassword(userId, newPassword);
  return {
    id: updatedUser.id,
    email: updatedUser.email,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    updatedAt: updatedUser.updatedAt,
  };
}

export async function unlockUser(userId: string) {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  await unlockUserAccount(userId);
  await deactivateAllUserSessions(userId);
}
