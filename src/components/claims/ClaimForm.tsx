import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FileText, ArrowLeft, Upload, Save, Send, X, Building2, FileCheck } from 'lucide-react';
import Select from 'react-select';
import ClaimEditor from '../editor/ClaimEditor';
import { generateClaimId } from '../../utils/claimIdGenerator';

const VOIVODESHIPS = [
  { value: 'dolnoslaskie', label: 'Dolnośląskie' },
  { value: 'kujawsko-pomorskie', label: 'Kujawsko-pomorskie' },
  { value: 'lubelskie', label: 'Lubelskie' },
  { value: 'lubuskie', label: 'Lubuskie' },
  { value: 'lodzkie', label: 'Łódzkie' },
  { value: 'malopolskie', label: 'Małopolskie' },
  { value: 'mazowieckie', label: 'Mazowieckie' },
  { value: 'opolskie', label: 'Opolskie' },
  { value: 'podkarpackie', label: 'Podkarpackie' },
  { value: 'podlaskie', label: 'Podlaskie' },
  { value: 'pomorskie', label: 'Pomorskie' },
  { value: 'slaskie', label: 'Śląskie' },
  { value: 'swietokrzyskie', label: 'Świętokrzyskie' },
  { value: 'warminsko-mazurskie', label: 'Warmińsko-Mazurskie' },
  { value: 'wielkopolskie', label: 'Wielkopolskie' },
  { value: 'zachodniopomorskie', label: 'Zachodniopomorskie' }
];

const MINISTRIES = [
  { value: 'mswia', label: 'MSWiA' },
  { value: 'mrpit', label: 'MRPiT' },
  { value: 'mf', label: 'MF' },
  { value: 'mkis', label: 'MKiŚ' },
  { value: 'miir', label: 'MIiR' },
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.commonName && (
              <p className="mt-1 text-sm text-red-600">{errors.commonName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              ID wniosku z Survey123
            </label>
            <input
              type="text"
              {...register('surveyId', { required: 'ID wniosku jest wymagane' })}
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
              step="0.01"
              {...register('finalNetAmount', {
                required: 'Kwota jest wymagana',
                min: { value: 0, message: 'Kwota nie może być ujemna' }
              })}
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
              step="0.01"
              {...register('requestedAmount', {
                required: 'Kwota jest wymagana',
                min: { value: 0, message: 'Kwota nie może być ujemna' }
              })}
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
              options={VOIVODESHIPS}
              value={VOIVODESHIPS.find(v => v.value === watch('voivodeship'))}
              onChange={(selected) => setValue('voivodeship', selected?.value || '')}
              isDisabled={userData?.role === 'user'} // Only disable for regular users
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
            <input
              type="text"
              {...register('county', { required: 'Powiat jest wymagany' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.county && (
              <p className="mt-1 text-sm text-red-600">{errors.county.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gmina
            </label>
            <input
              type="text"
              {...register('commune', { required: 'Gmina jest wymagana' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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