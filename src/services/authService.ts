import type { User } from '../types/user';
import { userService } from './userService';

// Test credentials for demo purposes
const TEST_CREDENTIALS = {
  'jan.kowalski@example.com': { password: 'user123', role: 'user', voivodeship: 'Mazowieckie' },
  'anna.nowak@example.com': { password: 'voivode123', role: 'voivodeship_admin', voivodeship: 'Mazowieckie' },
  'piotr.wisniewski@example.com': { password: 'mswia123', role: 'mswia_admin' },
  'maria.dabrowska@example.com': { password: 'kprm123', role: 'kprm_admin' },
  'admin@example.com': { password: 'admin123', role: 'admin' }
};

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    // First check registered users
    const users = userService.getAll();
    const user = users.find(u => u.email === email);

    if (user) {
      if (user.status !== 'active') {
        throw new Error('Konto nie zostało jeszcze aktywowane');
      }

      if (user.password !== password) {
        throw new Error('Nieprawidłowy email lub hasło');
      }

      return user;
    }

    // If not found in registered users, check test credentials
    const testUser = TEST_CREDENTIALS[email as keyof typeof TEST_CREDENTIALS];
    if (testUser && testUser.password === password) {
      // Create a mock user object for test accounts
      return {
        id: email,
        email,
        firstName: email.split('@')[0].split('.')[0],
        lastName: email.split('@')[0].split('.')[1] || '',
        role: testUser.role as User['role'],
        status: 'active',
        voivodeship: testUser.voivodeship,
        organizationName: 'Test Organization',
        createdAt: new Date().toISOString(),
        position: 'Test Position',
        organizationType: 'central',
        nip: '1234567890',
        county: 'Test County',
        commune: 'Test Commune',
        address: 'Test Address',
        phone: '123456789',
        password: password
      };
    }

    throw new Error('Nieprawidłowy email lub hasło');
  },

  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  },

  setCurrentUser: (user: User): void => {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },

  logout: (): void => {
    localStorage.removeItem('currentUser');
  }
};