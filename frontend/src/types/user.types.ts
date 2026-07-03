export type UserRole = 'utility' | 'manajer';

export interface User {
  id: string;
  fullName: string;
  role: UserRole;
  storeId: number;
}
