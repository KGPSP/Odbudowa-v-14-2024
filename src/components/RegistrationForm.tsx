import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserCheck, ArrowLeft, Mail, Lock, Building2, MapPin, Phone, FileCheck, Briefcase } from 'lucide-react';
import type { RegistrationFormData } from '../types/user';
import { ORGANIZATION_TYPES } from '../types/user';
import FormInput from './FormInput';
import { userService } from '../services/userService';
import Footer from './Footer';
import { getUniqueVoivodeships, getCountiesForVoivodeship, getCommunitiesForCounty } from '../utils/locationHelpers';

interface RegistrationFormProps {
  onBack: () => void;
}

export default function RegistrationForm({ onBack }: RegistrationFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedVoivodeship, setSelectedVoivodeship] = useState<string>('');
  const [selectedCounty, setSelectedCounty] = useState<string>('');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
    trigger,
    setValue,
  } = useForm<RegistrationFormData>({ mode: 'onChange' });

  const validateStep = async (step: number) => {
    let fieldsToValidate: (keyof RegistrationFormData)[] = [];
    
    switch (step) {
      case 1:
        fieldsToValidate = ['firstName', 'lastName', 'position', 'email'];
        break;
      case 2:
        fieldsToValidate = ['organizationName', 'organizationType', 'nip'];
        break;
      case 3:
        fieldsToValidate = ['voivodeship', 'county', 'commune', 'address', 'phone'];
        break;
    }

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep(step + 1);
    }
  };

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Create user using userService
      await userService.create(data);

      setIsSubmitted(true);
      reset();
    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'Wystąpił błąd podczas rejestracji');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formValidation = {
    firstName: { required: 'Imię jest wymagane' },
    lastName: { required: 'Nazwisko jest wymagane' },
    position: { required: 'Stanowisko jest wymagane' },
    organizationName: { required: 'Nazwa jednostki organizacyjnej jest wymagana' },
    organizationType: { required: 'Typ administracji jest wymagany' },
    nip: {
      required: 'NIP jest wymagany',
      pattern: {
        value: /^\d{10}$/,
        message: 'NIP musi składać się z 10 cyfr'
      }
    },
    voivodeship: { required: 'Województwo jest wymagane' },
    county: { required: 'Powiat jest wymagany' },
    commune: { required: 'Gmina jest wymagana' },
    address: { required: 'Adres jest wymagany' },
    phone: {
      required: 'Telefon jest wymagany',
      pattern: {
        value: /^[0-9]{9}$/,
        message: 'Nieprawidłowy format numeru telefonu'
      }
    },
    email: {
      required: 'Email jest wymagany',
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Nieprawidłowy format email'
      }
    },
    password: {
      required: 'Hasło jest wymagane',
      minLength: {
        value: 8,
        message: 'Hasło musi mieć minimum 8 znaków'
      }
    }
  };

  const voivodeships = getUniqueVoivodeships();
  const counties = getCountiesForVoivodeship(selectedVoivodeship);
  const communities = getCommunitiesForCounty(selectedVoivodeship, selectedCounty);

  const handleVoivodeshipChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newVoivodeship = event.target.value;
    setSelectedVoivodeship(newVoivodeship);
    setSelectedCounty(''); // Reset powiatu
    setValue('county', '');
    setValue('commune', ''); // Reset gminy
  };

  const handleCountyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCounty = event.target.value;
    setSelectedCounty(newCounty);
    setValue('commune', ''); // Reset gminy przy zmianie powiatu
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <FileCheck className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Rejestracja zakończona</h2>
          <p className="text-gray-600 mb-6">
            Twoje konto zostało utworzone. Poczekaj na aktywację konta przez administratora.
          </p>
          <button
            onClick={onBack}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Powrót do strony głównej
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-indigo-600 to-blue-600">
            <div className="flex items-center gap-3">
              <UserCheck className="w-8 h-8 text-white" />
              <h2 className="text-2xl font-bold text-white">Rejestracja użytkownika</h2>
            </div>
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white hover:text-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Powrót</span>
            </button>
          </div>

          <div className="p-8">
            {/* Step Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-4">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`
                      flex items-center justify-center w-8 h-8 rounded-full 
                      ${currentStep === step ? 'bg-indigo-600 text-white' :
                        currentStep > step ? 'bg-green-500 text-white' :
                        'bg-gray-200 text-gray-600'}
                      transition-colors duration-200
                    `}>
                      {currentStep > step ? '✓' : step}
                    </div>
                    {step < 4 && (
                      <div className={`w-12 h-1 mx-2 ${
                        currentStep > step ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <p className="text-sm font-medium text-gray-600">
                  {currentStep === 1 && 'Dane osobowe'}
                  {currentStep === 2 && 'Dane organizacji'}
                  {currentStep === 3 && 'Dane adresowe'}
                  {currentStep === 4 && 'Zabezpieczenia'}
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      label="Imię"
                      name="firstName"
                      register={register}
                      error={errors.firstName}
                      validation={formValidation.firstName}
                      icon={<UserCheck className="w-5 h-5 text-gray-400" />}
                      placeholder="Wprowadź swoje imię np. Jan"
                    />

                    <FormInput
                      label="Nazwisko"
                      name="lastName"
                      register={register}
                      error={errors.lastName}
                      validation={formValidation.lastName}
                      icon={<UserCheck className="w-5 h-5 text-gray-400" />}
                      placeholder="Wprowadź swoje nazwisko np. Kowalski"
                    />

                    <FormInput
                      label="Stanowisko"
                      name="position"
                      register={register}
                      error={errors.position}
                      validation={formValidation.position}
                      icon={<Briefcase className="w-5 h-5 text-gray-400" />}
                      placeholder="np. Naczelnik Wydziału, Inspektor"
                    />

                    <FormInput
                      label="Email"
                      name="email"
                      type="email"
                      register={register}
                      error={errors.email}
                      validation={formValidation.email}
                      icon={<Mail className="w-5 h-5 text-gray-400" />}
                      placeholder="jan.kowalski@urzad.gov.pl"
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <FormInput
                    label="Nazwa jednostki organizacyjnej"
                    name="organizationName"
                    register={register}
                    error={errors.organizationName}
                    validation={formValidation.organizationName}
                    icon={<Building2 className="w-5 h-5 text-gray-400" />}
                    placeholder="np. Urząd Miasta Warszawa, Starostwo Powiatowe w Krakowie"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Administracja publiczna RP
                    </label>
                    <div className="mt-1 relative">
                      <select
                        {...register('organizationType', formValidation.organizationType)}
                        className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Wybierz typ administracji</option>
                        {Object.entries(ORGANIZATION_TYPES).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building2 className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    {errors.organizationType && (
                      <p className="mt-1 text-sm text-red-600">{errors.organizationType.message}</p>
                    )}
                  </div>

                  <FormInput
                    label="NIP jednostki"
                    name="nip"
                    register={register}
                    error={errors.nip}
                    validation={formValidation.nip}
                    icon={<FileCheck className="w-5 h-5 text-gray-400" />}
                    placeholder="Wprowadź 10 cyfr NIP np. 5252248481"
                  />
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Województwo
                      </label>
                      <div className="mt-1 relative">
                        <select
                          {...register('voivodeship', formValidation.voivodeship)}
                          onChange={(e) => {
                            handleVoivodeshipChange(e);
                            register('voivodeship').onChange(e);
                          }}
                          className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">Wybierz województwo</option>
                          {voivodeships.map((voivodeship) => (
                            <option key={voivodeship} value={voivodeship}>
                              {voivodeship}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      {errors.voivodeship && (
                        <p className="mt-1 text-sm text-red-600">{errors.voivodeship.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Powiat
                      </label>
                      <div className="mt-1 relative">
                        <select
                          {...register('county', formValidation.county)}
                          onChange={(e) => {
                            handleCountyChange(e);
                            register('county').onChange(e);
                          }}
                          disabled={!selectedVoivodeship}
                          className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                        >
                          <option value="">Wybierz powiat</option>
                          {counties.map((county) => (
                            <option key={county} value={county}>
                              {county}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      {errors.county && (
                        <p className="mt-1 text-sm text-red-600">{errors.county.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Gmina
                      </label>
                      <div className="mt-1 relative">
                        <select
                          {...register('commune', formValidation.commune)}
                          disabled={!selectedCounty}
                          className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                        >
                          <option value="">Wybierz gminę</option>
                          {communities.map((community) => (
                            <option key={community} value={community}>
                              {community}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      {errors.commune && (
                        <p className="mt-1 text-sm text-red-600">{errors.commune.message}</p>
                      )}
                    </div>

                    <FormInput
                      label="Telefon kontaktowy"
                      name="phone"
                      type="tel"
                      register={register}
                      error={errors.phone}
                      validation={formValidation.phone}
                      icon={<Phone className="w-5 h-5 text-gray-400" />}
                      placeholder="9 cyfr bez spacji np. 123456789"
                    />
                  </div>

                  <FormInput
                    label="Adres"
                    name="address"
                    register={register}
                    error={errors.address}
                    validation={formValidation.address}
                    icon={<MapPin className="w-5 h-5 text-gray-400" />}
                    placeholder="np. ul. Marszałkowska 1, 00-001 Warszawa"
                  />
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6 animate-fadeIn">
                  <FormInput
                    label="Hasło"
                    name="password"
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={formValidation.password}
                    icon={<Lock className="w-5 h-5 text-gray-400" />}
                    placeholder="Minimum 8 znaków, użyj liter i cyfr"
                  />

                  <FormInput
                    label="Potwierdź hasło"
                    name="confirmPassword"
                    type="password"
                    register={register}
                    error={errors.confirmPassword}
                    validation={{
                      required: 'Potwierdzenie hasła jest wymagane',
                      validate: (val: string) => watch('password') === val || 'Hasła nie są identyczne'
                    }}
                    icon={<Lock className="w-5 h-5 text-gray-400" />}
                    placeholder="Powtórz wprowadzone hasło"
                  />
                </div>
              )}

              <div className="flex justify-between pt-6">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Wstecz
                  </button>
                )}
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => validateStep(currentStep)}
                    className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Dalej
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className="ml-auto inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Przetwarzanie...
                      </>
                    ) : (
                      'Zarejestruj się'
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
       
      </div>
    </div>
  );
}