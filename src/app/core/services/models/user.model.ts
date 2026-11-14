export type PrivilegeGroup =
  'general' | 'reg' | 'reports' | 'results' | 'sampling' | 'financial';

export interface PrivilegeDef {
  key: string;
  label: string;
  group: PrivilegeGroup;
}

export interface RoleDef {
  key: string;
  label: string;
  description: string;
  privileges: string[];
}

export interface AppUser {
  id: number;
  fullName: string;
  username: string;
  email: string;
  branchId: number;
  discountPercent: number;
  isAdmin: boolean;
  isActive: boolean;
  privileges: Record<number, string[]>;
  roles: string[];
}
