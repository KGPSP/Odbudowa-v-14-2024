import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';
import { RegistrationFormData } from '../types/user';

interface FormInputProps {
  label: string;
  name: keyof RegistrationFormData;
  type?: string;
  register: UseFormRegister<RegistrationFormData>;
  error?: FieldError;
  validation?: object;
  placeholder?: string;
  icon?: React.ReactNode;
}

export default function FormInput({
  label,
  name,
  type = 'text',
  register,
  error,
  validation,
  placeholder,
  icon
}: FormInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          {...register(name, validation)}
          className={`
            block w-full rounded-md shadow-sm
            ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2
            ${error
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
            }
          `}
          placeholder={placeholder}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
}