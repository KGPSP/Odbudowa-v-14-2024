import React, { useState, useEffect } from 'react';
import { Shield, Check, AlertCircle } from 'lucide-react';

interface ElectronicSignatureProps {
  onVerify: () => void;
  onCancel: () => void;
}

export default function ElectronicSignature({ onVerify, onCancel }: ElectronicSignatureProps) {
  const [stage, setStage] = useState<'loading' | 'code' | 'error'>('loading');
  const [verificationCode, setVerificationCode] = useState('');
  const [userCode, setUserCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulate loading and verification process
    const timer = setTimeout(() => {
      // Generate random 4-digit code
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setVerificationCode(code);
      setStage('code');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = () => {
    if (userCode === verificationCode) {
      onVerify();
    } else {
      setError('Nieprawidłowy kod weryfikacyjny');
      setUserCode('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-indigo-600" />
          <h3 className="text-lg font-medium text-gray-900">
            Podpis elektroniczny
          </h3>
        </div>

        {stage === 'loading' && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Trwa weryfikacja i generowanie kodu...</p>
          </div>
        )}

        {stage === 'code' && (
          <div className="space-y-4">
            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-indigo-600 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-indigo-700">
                    Twój kod weryfikacyjny to: <span className="font-bold">{verificationCode}</span>
                  </p>
                  <p className="text-sm text-indigo-600 mt-1">
                    Wprowadź kod aby potwierdzić operację
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Kod weryfikacyjny
              </label>
              <input
                type="text"
                id="code"
                value={userCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setUserCode(value);
                  setError('');
                }}
                maxLength={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-center text-2xl tracking-widest"
                placeholder="____"
              />
              {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Anuluj
              </button>
              <button
                onClick={handleSubmit}
                disabled={userCode.length !== 4}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4 mr-2" />
                Potwierdź
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}