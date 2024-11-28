import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Building2, MapPin, Phone, Mail, Lock } from 'lucide-react';
import type { User as UserType } from '../../types/user';
import { userService } from '../../services/userService';
import { ORGANIZATION_TYPES } from '../../types/user';

interface UserProfileEditProps {
  user: UserType | null;
  onClose: () => void;
}

export default function UserProfileEdit({ user, onClose }: UserProfileEditProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      position: user?.position || '',
      organizationName: user?.organizationName || '',
      organizationType: user?.organizationType || '',
      nip: user?.nip || '',
      voivodeship: user?.voivodeship || '',
      county: user?.county || '',
      commune: user?.commune || '',
      address: user?.address || '',
      phone: user?.phone || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const handleFormSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      setSuccessMessage('');

      if (user) {
        const updateData: Partial<UserType> = {
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
          phone: data.phone
        };

        // Only include password if it's being changed
        if (data.newPassword) {
          // In a real app, verify current password here
          updateData.password = data.newPassword;
        }

        await userService.update(user.id, updateData);
        setSuccessMessage('Profil został zaktualizowany');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <User className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-800">Edycja profilu</h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-900"
        >
          Zamknij
        </button>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Imię</label>
            <div className="mt-1 relative">
              <input
                type="text"
                {...register('firstName', { required: 'Imię jest wymagane' })}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <User className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nazwisko</label>
            <div className="mt-1 relative">
              <input
                type="text"
                {...register('lastName', { required: 'Nazwisko jest wymagane' })}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <User className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 relative">
              <input
                type="email"
                {...register('email')}
                disabled
                className="pl-10 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Stanowisko</label>
            <div className="mt-1 relative">
              <input
                type="text"
                {...register('position')}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Building2 className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nazwa jednostki</label>
            <div className="mt-1 relative">
              <input
                type="text"
                {...register('organizationName')}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Building2 className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Typ organizacji</label>
            <div className="mt-1">
              <select
                {...register('organizationType')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                {Object.entries(ORGANIZATION_TYPES).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">NIP</label>
            <div className="mt-1 relative">
              <input
                type="text"
                {...register('nip', {
                  pattern: {
                    value: /^\d{10}$/,
                    message: 'NIP musi składać się z 10 cyfr'
                  }
                })}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Building2 className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {errors.nip && (
              <p className="mt-1 text-sm text-red-600">{errors.nip.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Województwo</label>
            <div className="mt-1 relative">
              <input
                type="text"
                {...register('voivodeship')}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Powiat</label>
            <div className="mt-1 relative">
              <input
                type="text"
                {...register('county')}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Gmina</label>
            <div className="mt-1 relative">
              <input
                type="text"
                {...register('commune')}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Telefon</label>
            <div className="mt-1 relative">
              <input
                type="tel"
                {...register('phone', {
                  pattern: {
                    value: /^\d{9}$/,
                    message: 'Nieprawidłowy format numeru telefonu'
                  }
                })}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Adres</label>
            <div className="mt-1 relative">
              <input
                type="text"
                {...register('address')}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Zmiana hasła</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Obecne hasło</label>
              <div className="mt-1 relative">
                <input
                  type="password"
                  {...register('currentPassword')}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Nowe hasło</label>
              <div className="mt-1 relative">
                <input
                  type="password"
                  {...register('newPassword', {
                    minLength: {
                      value: 8,
                      message: 'Hasło musi mieć minimum 8 znaków'
                    }
                  })}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Potwierdź nowe hasło</label>
              <div className="mt-1 relative">
                <input
                  type="password"
                  {...register('confirmPassword', {
                    validate: (val: string) => {
                      if (watch('newPassword') && val !== watch('newPassword')) {
                        return 'Hasła nie są identyczne';
                      }
                    }
                  })}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Anuluj
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {isSubmitting ? 'Zapisywanie...' : 'Zapisz zmiany'}
          </button>
        </div>
      </form>
    </div>
  );
}