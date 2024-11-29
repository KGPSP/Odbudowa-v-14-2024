import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FileText, ArrowLeft, Upload, Save, Send, X, Building2, FileCheck } from 'lucide-react';
import Select from 'react-select';
import ClaimEditor from '../editor/ClaimEditor';
import { generateClaimId } from '../../utils/claimIdGenerator';
import { getUniqueVoivodeships, getCountiesForVoivodeship, getCommunitiesForCounty } from '../../utils/locationHelpers';

const MINISTRIES = [
  { value: 'map', label: 'MAP - Ministerstwo Aktywów Państwowych' },
  { value: 'mc', label: 'MC - Ministerstwo Cyfryzacji' },
  { value: 'men', label: 'MEN - Ministerstwo Edukacji Narodowej' },
  { value: 'mf', label: 'MF - Ministerstwo Finansów' },
  { value: 'mfipr', label: 'MFiPR - Ministerstwo Funduszy i Polityki Regionalnej' },
  { value: 'mi', label: 'MI - Ministerstwo Infrastruktury' },
  { value: 'mkis', label: 'MKiŚ - Ministerstwo Klimatu i Środowiska' },
  { value: 'mkidn', label: 'MKiDN - Ministerstwo Kultury i Dziedzictwa Narodowego' },
  { value: 'mnisw', label: 'MNiSW - Ministerstwo Nauki i Szkolnictwa Wyższego' },
  { value: 'mon', label: 'MON - Ministerstwo Obrony Narodowej' },
  { value: 'mp', label: 'MP - Ministerstwo Przemysłu' },
  { value: 'mrpips', label: 'MRPiPS - Ministerstwo Rodziny, Pracy i Polityki Społecznej' },
  { value: 'mrirw', label: 'MRiRW - Ministerstwo Rolnictwa i Rozwoju Wsi' },
  { value: 'mrit', label: 'MRiT - Ministerstwo Rozwoju i Technologii' },
  { value: 'msit', label: 'MSiT - Ministerstwo Sportu i Turystyki' },
  { value: 'mswia', label: 'MSWiA - Ministerstwo Spraw Wewnętrznych i Administracji' },
  { value: 'msz', label: 'MSZ - Ministerstwo Spraw Zagranicznych' },
  { value: 'ms', label: 'MS - Ministerstwo Sprawiedliwości' },
  { value: 'mz', label: 'MZ - Ministerstwo Zdrowia' },
  { value: 'wfosigw', label: 'WFOŚiGW - Wojewódzki Fundusz Ochrony Środowiska i Gospodarki Wodnej' },
  { value: 'nfosigw', label: 'NFOŚiGW - Narodowy Fundusz Ochrony Środowiska i Gospodarki Wodnej' },
  { value: 'inne', label: 'Inne' }
];

interface ClaimFormProps {
  onSubmit: (data: any, isDraft: boolean) => Promise<void>;
  onDelete?: (claim: any) => Promise<void>;
  defaultVoivodeship?: string;
  initialData?: any;
  onBack: () => void;
  userData?: any;
}

export default function ClaimForm({ 
  onSubmit, 
  onDelete, 
  defaultVoivodeship, 
  initialData, 
  onBack,
  userData 
}: ClaimFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [selectedMinistries, setSelectedMinistries] = useState<string[]>(initialData?.otherFundingSources || []);
  const [otherMinistry, setOtherMinistry] = useState('');
  const [claimId] = useState(initialData?.id || generateClaimId());
  const [selectedVoivodeship, setSelectedVoivodeship] = useState<string>(initialData?.voivodeship || defaultVoivodeship || '');
  const [selectedCounty, setSelectedCounty] = useState<string>(initialData?.county || '');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      commonName: initialData?.commonName || '',
      surveyId: initialData?.surveyId || '',
      objectName: initialData?.objectName || '',
      address: initialData?.address || '',
      estimatedLoss: initialData?.estimatedLoss || 0,
      finalNetAmount: initialData?.finalNetAmount || 0,
      requestedAmount: initialData?.requestedAmount || 0,
      voivodeship: defaultVoivodeship || initialData?.voivodeship || '',
      county: initialData?.county || '',
      commune: initialData?.commune || '',
    }
  });

  const finalNetAmount = watch('finalNetAmount');

  useEffect(() => {
    if (finalNetAmount) {
      setValue('requestedAmount', finalNetAmount);
    }
  }, [finalNetAmount, setValue]);

  const voivodeships = getUniqueVoivodeships();
  const counties = getCountiesForVoivodeship(selectedVoivodeship);
  const communities = getCommunitiesForCounty(selectedVoivodeship, selectedCounty);

  const handleVoivodeshipChange = (selected: any) => {
    const newVoivodeship = selected?.value || '';
    setSelectedVoivodeship(newVoivodeship);
    setSelectedCounty('');
    setValue('voivodeship', newVoivodeship);
    setValue('county', '');
    setValue('commune', '');
  };

  const handleCountyChange = (selected: any) => {
    const newCounty = selected?.value || '';
    setSelectedCounty(newCounty);
    setValue('county', newCounty);
    setValue('commune', '');
  };

  const handleFormSubmit = async (data: any, isDraft: boolean) => {
    try {
      setIsSubmitting(true);
      
      const processedFiles = await Promise.all(files.map(async file => {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        return {
          id: generateClaimId(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: base64,
          uploadedAt: new Date().toISOString()
        };
      }));

      const formData = {
        ...data,
        id: claimId,
        otherFundingSources: [
          ...selectedMinistries,
          ...(otherMinistry && selectedMinistries.includes('inne') ? [otherMinistry] : [])
        ],
        notes,
        files: processedFiles,
        status: isDraft ? 'draft' : 'submitted',
        submitterInfo: userData
      };
      
      await onSubmit(formData, isDraft);
      
      if (!isDraft && !initialData) {
        reset();
        setSelectedMinistries([]);
        setOtherMinistry('');
        setNotes('');
        setFiles([]);
      }
      onBack();
    } catch (error) {
      console.error('Error submitting claim:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-white" />
          <h2 className="text-2xl font-bold text-white">
            {initialData ? 'Edycja wniosku' : 'Nowy wniosek'}
          </h2>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:text-gray-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Powrót
        </button>
      </div>

      <form onSubmit={handleSubmit((data) => handleFormSubmit(data, false))} className="p-8">
        {userData && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-8 border border-indigo-100">
            <h3 className="text-base font-semibold text-indigo-900 mb-4">Dane składającego wniosek</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-indigo-600 font-medium">Nazwa jednostki:</span>
                <span className="ml-2 text-gray-800">{userData.organizationName}</span>
              </div>
              <div>
                <span className="text-indigo-600 font-medium">NIP:</span>
                <span className="ml-2 text-gray-800">{userData.nip}</span>
              </div>
              <div>
                <span className="text-indigo-600 font-medium">Składający:</span>
                <span className="ml-2 text-gray-800">{`${userData.firstName} ${userData.lastName}`}</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">ID Wniosku:</span>
            <span className="text-sm font-mono bg-gray-100 px-4 py-2 rounded-lg shadow-sm border border-gray-200">{claimId}</span>
          </div>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nazwa zwyczajowa obiektu
              </label>
              <input
                type="text"
                {...register('commonName', { required: 'Nazwa zwyczajowa jest wymagana' })}
                placeholder="np. Szkoła Podstawowa nr 1 im. Jana Kochanowskiego"
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
              />
              {errors.commonName && (
                <p className="mt-1 text-sm text-red-600">{errors.commonName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID wniosku z Survey123
              </label>
              <input
                type="text"
                {...register('surveyId', { required: 'ID wniosku jest wymagane' })}
                placeholder="np. 4056 (ID z aplikacji Survey123)"
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
              />
              {errors.surveyId && (
                <p className="mt-1 text-sm text-red-600">{errors.surveyId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nazwa obiektu
              </label>
              <input
                type="text"
                {...register('objectName', { required: 'Nazwa obiektu jest wymagana' })}
                placeholder="np. Budynek główny szkoły podstawowej"
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
              />
              {errors.objectName && (
                <p className="mt-1 text-sm text-red-600">{errors.objectName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adres uszkodzonego obiektu
              </label>
              <input
                type="text"
                {...register('address', { required: 'Adres jest wymagany' })}
                placeholder="np. ul. Szkolna 1, 00-001 Warszawa"
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            <div className="col-span-2 grid grid-cols-2 gap-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-indigo-100 shadow-sm">
              <div>
                <label className="block text-base font-semibold text-indigo-900 mb-3">
                  Ostateczna wycena szkód - kwota netto (PLN)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="100"
                    {...register('finalNetAmount', {
                      required: 'Kwota jest wymagana',
                      min: { value: 0, message: 'Kwota nie może być ujemna' }
                    })}
                    placeholder="np. 150000.00 (kwota netto bez VAT)"
                    className="block w-full rounded-lg border-2 border-indigo-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 text-lg py-3 px-4"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500 font-medium">PLN</span>
                </div>
                {errors.finalNetAmount && (
                  <p className="mt-2 text-sm text-red-600">{errors.finalNetAmount.message}</p>
                )}
              </div>

              <div>
                <label className="block text-base font-semibold text-indigo-900 mb-3">
                  Kwota wnioskowana o dofinansowanie (PLN)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="100"
                    {...register('requestedAmount', {
                      required: 'Kwota jest wymagana',
                      min: { value: 0, message: 'Kwota nie może być ujemna' }
                    })}
                    placeholder="np. 120000.00 (wnioskowana kwota dofinansowania)"
                    className="block w-full rounded-lg border-2 border-red-200 bg-white shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-gray-400 text-lg py-3 px-4"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 font-medium">PLN</span>
                </div>
                {errors.requestedAmount && (
                  <p className="mt-2 text-sm text-red-600">{errors.requestedAmount.message}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Czy składano wnioski o wsparcie do innych instytucji?
            </label>
            <Select
              isMulti
              options={MINISTRIES}
              value={MINISTRIES.filter(m => selectedMinistries.includes(m.value))}
              onChange={(selected) => {
                setSelectedMinistries(selected ? selected.map(option => option.value) : []);
              }}
              className="mb-2"
              placeholder="Wybierz instytucje..."
            />
            {selectedMinistries.includes('inne') && (
              <input
                type="text"
                value={otherMinistry}
                onChange={(e) => setOtherMinistry(e.target.value)}
                placeholder="Wpisz nazwę instytucji..."
                className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Województwo
              </label>
              <Select
                options={voivodeships.map(v => ({ value: v, label: v }))}
                value={selectedVoivodeship ? { value: selectedVoivodeship, label: selectedVoivodeship } : null}
                onChange={handleVoivodeshipChange}
                isDisabled={userData?.role === 'user'}
                className="mt-1"
                placeholder="Wybierz województwo..."
              />
              {errors.voivodeship && (
                <p className="mt-1 text-sm text-red-600">{errors.voivodeship.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Powiat
              </label>
              <Select
                options={counties.map(c => ({ value: c, label: c }))}
                value={selectedCounty ? { value: selectedCounty, label: selectedCounty } : null}
                onChange={handleCountyChange}
                isDisabled={!selectedVoivodeship}
                className="mt-1"
                placeholder="Wybierz powiat..."
              />
              {errors.county && (
                <p className="mt-1 text-sm text-red-600">{errors.county.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gmina
              </label>
              <Select
                options={communities.map(c => ({ value: c, label: c }))}
                value={watch('commune') ? { value: watch('commune'), label: watch('commune') } : null}
                onChange={(selected) => setValue('commune', selected?.value || '')}
                isDisabled={!selectedCounty}
                className="mt-1"
                placeholder="Wybierz gminę..."
              />
              {errors.commune && (
                <p className="mt-1 text-sm text-red-600">{errors.commune.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Uwagi
            </label>
            <ClaimEditor content={notes} onChange={setNotes} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Załączniki (PDF, JPG)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <span>Dodaj pliki</span>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg"
                      onChange={handleFileUpload}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">lub przeciągnij i upuść</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF lub JPG do 10MB
                </p>
              </div>
            </div>

            {files.length > 0 && (
              <ul className="mt-4 divide-y divide-gray-200">
                {files.map((file, index) => (
                  <li key={index} className="py-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <FileCheck className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{file.name}</span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors shadow-sm"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Zapisywanie...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {initialData ? 'Zapisz zmiany' : 'Złóż wniosek'}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}