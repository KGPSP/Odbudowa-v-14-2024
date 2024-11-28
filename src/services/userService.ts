import type { User, RegistrationFormData } from '../types/user';

// Initialize users in localStorage if not exists
const initializeUsers = () => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
  }
};

export const userService = {
  getAll: (): User[] => {
    initializeUsers();
    return JSON.parse(localStorage.getItem('users') || '[]');
  },

  getById: (userId: string): User | null => {
    const users = userService.getAll();
    return users.find(user => user.id === userId) || null;
  },

  getByEmail: (email: string): User | null => {
    const users = userService.getAll();
    return users.find(user => user.email === email) || null;
  },

  create: (data: RegistrationFormData): User => {
    const users = userService.getAll();
    
    // Check if user already exists
    if (users.some(user => user.email === data.email)) {
      throw new Error('Użytkownik o podanym adresie email już istnieje');
    }

    const newUser: User = {
      id: Date.now().toString(),
      firstName: data.firstName,
      lastName: data.lastName,
      position: data.position,
      organizationName: data.organizationName,
      organizationType: data.organizationType,
      nip: data.nip,
      voivodeship: data.voivodeship,
      county: data.county,
      commune: data.commune,
      address: data.address,
      phone: data.phone,
      email: data.email,
      password: data.password, // In a real app, this would be hashed
      status: 'pending',
      role: 'user',
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    return newUser;
  },

  update: (userId: string, data: Partial<User>): User => {
    const users = userService.getAll();
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          ...data,
          // Don't update password if it's empty
          password: data.password ? data.password : user.password
        };
      }
      return user;
    });

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    const updatedUser = updatedUsers.find(u => u.id === userId);
    if (!updatedUser) throw new Error('User not found');
    return updatedUser;
  },

  updateStatus: (userId: string, newStatus: 'pending' | 'active' | 'rejected'): void => {
    const users = userService.getAll();
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  },

  updateRole: (userId: string, newRole: string): void => {
    const users = userService.getAll();
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  },

  delete: (userId: string): void => {
    const users = userService.getAll().filter(user => user.id !== userId);
    localStorage.setItem('users', JSON.stringify(users));
  }
};