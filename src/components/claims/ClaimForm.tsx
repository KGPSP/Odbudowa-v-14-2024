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
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-800">
            {initialData ? 'Edycja wniosku' : 'Nowy wniosek'}
          </h2>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Powrót
        </button>
      </div>

      <form onSubmit={handleSubmit((data) => handleFormSubmit(data, false))} className="p-6 space-y-6">
        {userData && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Dane składającego wniosek</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Nazwa jednostki:</span>
                <span className="ml-2 text-gray-900">{userData.organizationName}</span>
              </div>
              <div>
                <span className="text-gray-500">NIP:</span>
                <span className="ml-2 text-gray-900">{userData.nip}</span>
              </div>
              <div>
                <span className="text-gray-500">Składający:</span>
                <span className="ml-2 text-gray-900">{`${userData.firstName} ${userData.lastName}`}</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">ID Wniosku:</span>
            <span className="text-sm font-mono bg-gray-200 px-3 py-1 rounded">{claimId}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nazwa zwyczajowa obiektu
            </label>
            <input
              type="text"
              {...register('commonName', { required: 'Nazwa zwyczajowa jest wymagana' })}
              placeholder="np. Szkoła Podstawowa nr 1 im. Jana Kochanowskiego"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.commonName && (
              <p className="mt-1 text-sm text-red-600">{errors.commonName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
              ID wniosku z Survey123
              <div className="relative group">
                <span className="cursor-help">ℹ️</span>
                <div className="absolute right-0 w-80 p-2 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform translate-x-2">
                  Numer wniosku pobierzesz z aplikacji Survey123 która znajduje się pod adresem:{' '}
                  <a 
                    href="https://gis-portal.straz.gov.pl/portal/apps/webappviewer/index.html?id=b403009fa5ac4f6c8ea3791fc70afdf3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:text-blue-400 underline"
                  >
                    kliknij tutaj
                  </a>
                </div>
              </div>
            </label>
            <input
              type="text"
              {...register('surveyId', { required: 'ID wniosku jest wymagane' })}
              placeholder="np. 4056 (ID z aplikacji Survey123)"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.surveyId && (
              <p className="mt-1 text-sm text-red-600">{errors.surveyId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nazwa obiektu
            </label>
            <input
              type="text"
              {...register('objectName', { required: 'Nazwa obiektu jest wymagana' })}
              placeholder="np. Budynek główny szkoły podstawowej"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.objectName && (
              <p className="mt-1 text-sm text-red-600">{errors.objectName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Adres uszkodzonego obiektu
            </label>
            <input
              type="text"
              {...register('address', { required: 'Adres jest wymagany' })}
              placeholder="np. ul. Szkolna 1, 00-001 Warszawa"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ostateczna wycena szkód - kwota netto (PLN)
            </label>
            <input
              type="number"
              step="100"
              {...register('finalNetAmount', {
                required: 'Kwota jest wymagana',
                min: { value: 0, message: 'Kwota nie może być ujemna' }
              })}
              placeholder="np. 150000.00 (kwota netto bez VAT)"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.finalNetAmount && (
              <p className="mt-1 text-sm text-red-600">{errors.finalNetAmount.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kwota wnioskowana o dofinansowanie (PLN)
            </label>
            <input
              type="number"
              step="100"
              {...register('requestedAmount', {
                required: 'Kwota jest wymagana',
                min: { value: 0, message: 'Kwota nie może być ujemna' }
              })}
              placeholder="np. 120000.00 (wnioskowana kwota dofinansowania)"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.requestedAmount && (
              <p className="mt-1 text-sm text-red-600">{errors.requestedAmount.message}</p>
            )}
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
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
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
            <label className="block text-sm font-medium text-gray-700">
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
            <label className="block text-sm font-medium text-gray-700">
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
          <label className="block text-sm font-medium text-gray-700">
            Uwagi
          </label>
          <ClaimEditor content={notes} onChange={setNotes} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Załączniki (PDF, JPG)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
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
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Anuluj
          </button>
          <button
            type="button"
            onClick={handleSubmit((data) => handleFormSubmit(data, true))}
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Zapisywanie...' : 'Zapisz wersję roboczą'}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Zapisywanie...' : 'Złóż wniosek'}
          </button>
        </div>
      </form>
    </div>
  );
}