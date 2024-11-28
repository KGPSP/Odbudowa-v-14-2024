export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    role: UserRole;
    voivodeship?: string;
  } | null;
}

export type UserRole = 
  | 'user'
  | 'voivodeship_admin'
  | 'mswia_admin'
  | 'kprm_admin'
  | 'admin';