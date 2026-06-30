export type UserRole = 'pelayan' | 'utility' | 'manajer' | 'vendor';

export interface User {
  id: string;
  fullName: string;
  role: UserRole;
  storeId: number;
}
