export interface User {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  organizationName: string;
  organizationType: 'central' | 'voivode' | 'municipal' | 'county' | 'voivodeship' | 'other';
  nip: string;
  voivodeship: string;
  county: string;
  commune: string;
  address: string;
  phone: string;
  email: string;
  status: 'pending' | 'active' | 'rejected';
  role: 'user' | 'admin';
  createdAt: string;
}

export interface RegistrationFormData {
  firstName: string;
  lastName: string;
  position: string;
  organizationName: string;
  organizationType: 'central' | 'voivode' | 'municipal' | 'county' | 'voivodeship' | 'other';
  nip: string;
  voivodeship: string;
  county: string;
  commune: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const ORGANIZATION_TYPES = {
  central: 'Administracja rządowa - szczebel centralny',
  voivode: 'Administracja rządowa - wojewodowie',
  municipal: 'Administracja samorządowa - gmina',
  county: 'Administracja samorządowa - powiat',
  voivodeship: 'Administracja samorządowa - województwo',
  other: 'Inne'
} as const;

export type FormValidation = {
  [K in keyof RegistrationFormData]?: {
    required?: string;
    pattern?: {
      value: RegExp;
      message: string;
    };
    minLength?: {
      value: number;
      message: string;
    };
    validate?: (val: string) => boolean | string;
  };
};