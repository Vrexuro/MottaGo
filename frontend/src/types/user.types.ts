export type UserRole = 'pelayan' | 'utility' | 'manajer' | 'vendor';

export interface User {
  id: number;
  fullName: string;
  role: UserRole;
  storeId: number;
}
