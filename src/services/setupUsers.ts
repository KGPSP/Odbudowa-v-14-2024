import { supabase } from '../lib/supabase';

const users = [
  {
    email: 'admin@example.com',
    password: 'admin123',
    userData: {
      first_name: 'Admin',
      last_name: 'Systemowy',
      role: 'admin',
      organizational_unit: 'Administrator Systemu',
      voivodeship: null
    }
  },
  {
    email: 'anna.nowak@example.com',
    password: 'voivode123',
    userData: {
      first_name: 'Anna',
      last_name: 'Nowak',
      role: 'voivodeship_admin',
      organizational_unit: 'Urząd Wojewódzki Mazowiecki',
      voivodeship: 'Mazowieckie'
    }
  },
  {
    email: 'piotr.wisniewski@example.com',
    password: 'mswia123',
    userData: {
      first_name: 'Piotr',
      last_name: 'Wiśniewski',
      role: 'mswia_admin',
      organizational_unit: 'MSWiA',
      voivodeship: null
    }
  },
  {
    email: 'maria.dabrowska@example.com',
    password: 'kprm123',
    userData: {
      first_name: 'Maria',
      last_name: 'Dąbrowska',
      role: 'kprm_admin',
      organizational_unit: 'KPRM',
      voivodeship: null
    }
  },
  {
    email: 'jan.kowalski@example.com',
    password: 'user123',
    userData: {
      first_name: 'Jan',
      last_name: 'Kowalski',
      role: 'user',
      organizational_unit: 'Urząd Gminy Warszawa',
      voivodeship: 'Mazowieckie'
    }
  }
];

export async function setupUsers() {
  for (const user of users) {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', user.email)
        .single();

      if (existingUser) {
        console.log(`User ${user.email} already exists`);
        continue;
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: user.userData
        }
      });

      if (authError) throw authError;

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user?.id,
          email: user.email,
          ...user.userData
        }]);

      if (profileError) throw profileError;

      console.log(`Successfully created user: ${user.email}`);
    } catch (error) {
      console.error(`Error creating user ${user.email}:`, error);
    }
  }
}

// Run the setup
setupUsers().catch(console.error);