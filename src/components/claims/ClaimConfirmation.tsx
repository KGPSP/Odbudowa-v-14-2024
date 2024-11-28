import React, { useRef } from 'react';
import { Printer, FileText } from 'lucide-react';
import type { Claim } from '../../types/claim';
import { mockUsers } from '../../data/mockData';

interface ClaimConfirmationProps {
  claim: Claim;
}

export default function ClaimConfirmation({ claim }: ClaimConfirmationProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML || '';
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Potwierdzenie akceptacji wniosku ${claim.claimNumber}</title>
            <style>
              @page { 
                size: A4;
                margin: 2cm;
              }
              @media print {
                body { 
                  margin: 0;
                  padding: 0;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
              }
              body { 
                font-family: system-ui, -apple-system, sans-serif;
                line-height: 1.5;
                color: #111827;
                background: #fff;
              }
              .document {
                max-width: 21cm;
                margin: 0 auto;
                padding: 2cm;
                background: #fff;
              }
              .header {
                text-align: center;
                margin-bottom: 2rem;
              }
              .logo {
                width: 80px;
                height: 80px;
                margin: 0 auto 1rem;
              }
              .title {
                font-size: 24px;
                font-weight: bold;
                text-transform: uppercase;
                margin-bottom: 0.5rem;
              }
              .subtitle {
                font-size: 16px;
                color: #4B5563;
              }
              .claim-number {
                font-size: 18px;
                font-weight: bold;
                margin: 1rem 0;
              }
              .section {
                margin: 2rem 0;
                page-break-inside: avoid;
              }
              .section-title {
                font-size: 16px;
                font-weight: bold;
                border-bottom: 2px solid #E5E7EB;
                padding-bottom: 0.5rem;
                margin-bottom: 1rem;
              }
              .data-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1rem;
              }
              .data-item {
                margin-bottom: 1rem;
              }
              .data-label {
                font-size: 12px;
                color: #6B7280;
                margin-bottom: 0.25rem;
              }
              .data-value {
                font-size: 14px;
                font-weight: 500;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 1rem 0;
                font-size: 12px;
              }
              th, td {
                padding: 0.75rem;
                text-align: left;
                border: 1px solid #E5E7EB;
              }
              th {
                background: #F9FAFB;
                font-weight: 600;
              }
              .footer {
                margin-top: 3rem;
                padding-top: 1rem;
                border-top: 1px solid #E5E7EB;
                font-size: 10px;
                color: #6B7280;
                text-align: center;
              }
              .signature-section {
                margin-top: 4rem;
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 4rem;
              }
              .signature-box {
                text-align: center;
              }
              .signature-line {
                border-top: 1px solid #000;
                margin: 3rem 0 0.5rem;
              }
              .signature-title {
                font-size: 12px;
                color: #6B7280;
              }
              .signature-name {
                font-size: 14px;
                font-weight: 500;
              }
              .signature-org {
                font-size: 12px;
                color: #6B7280;
              }
              .status-badge {
                display: inline-block;
                padding: 0.25rem 0.75rem;
                border-radius: 9999px;
                font-size: 12px;
                font-weight: 500;
              }
              .status-approved {
                background: #DEF7EC;
                color: #03543F;
              }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getUserDetails = (email: string) => {
    const user = mockUsers.find(u => u.email === email);
    return user ? {
      fullName: `${user.firstName} ${user.lastName}`,
      organization: user.organizationalUnit
    } : {
      fullName: email,
      organization: 'Nieznana organizacja'
    };
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          <Printer className="w-4 h-4" />
          Drukuj potwierdzenie
        </button>
      </div>

      <div ref={printRef} className="document">
        <div className="header">
          <img src="/logo.svg" alt="Logo" className="logo" />
          <h1 className="title">Potwierdzenie akceptacji wniosku</h1>
          <p className="subtitle">System Odbudowa 2024</p>
          <p className="claim-number">Nr wniosku: {claim.claimNumber}</p>
        </div>

        <div className="section">
          <h2 className="section-title">Dane podstawowe</h2>
          <div className="data-grid">
            <div className="data-item">
              <p className="data-label">Nazwa obiektu</p>
              <p className="data-value">{claim.objectName}</p>
            </div>
            <div className="data-item">
              <p className="data-label">Szacowane straty</p>
              <p className="data-value">{formatMoney(claim.estimatedLoss)}</p>
            </div>
            <div className="data-item">
              <p className="data-label">Status wniosku</p>
              <p className="status-badge status-approved">Zatwierdzony</p>
            </div>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Lokalizacja</h2>
          <div className="data-grid">
            <div className="data-item">
              <p className="data-label">Województwo</p>
              <p className="data-value">{claim.voivodeship}</p>
            </div>
            <div className="data-item">
              <p className="data-label">Powiat</p>
              <p className="data-value">{claim.county}</p>
            </div>
            <div className="data-item">
              <p className="data-label">Gmina</p>
              <p className="data-value">{claim.commune}</p>
            </div>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Proces akceptacji</h2>
          <table>
            <thead>
              <tr>
                <th>Etap</th>
                <th>Data</th>
                <th>Osoba zatwierdzająca</th>
                <th>Organizacja</th>
                <th>Komentarz</th>
              </tr>
            </thead>
            <tbody>
              {claim.history.map((entry, index) => {
                const userDetails = getUserDetails(entry.updatedBy);
                return (
                  <tr key={index}>
                    <td>{entry.level === 'voivodeship' ? 'Wojewódzki' :
                         entry.level === 'mswia' ? 'MSWiA' :
                         entry.level === 'kprm' ? 'KPRM' : 'Złożenie'}</td>
                    <td>{formatDate(entry.updatedAt)}</td>
                    <td>{userDetails.fullName}</td>
                    <td>{userDetails.organization}</td>
                    <td>{entry.comment}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="section">
          <h2 className="section-title">Uwagi</h2>
          <p className="data-value">{claim.notes || 'Brak uwag'}</p>
        </div>

        <div className="signature-section">
          <div className="signature-box">
            <div className="signature-line"></div>
            <p className="signature-title">Podpis osoby zatwierdzającej</p>
            <p className="signature-name">
              {getUserDetails(claim.history[claim.history.length - 1].updatedBy).fullName}
            </p>
            <p className="signature-org">
              {getUserDetails(claim.history[claim.history.length - 1].updatedBy).organization}
            </p>
          </div>
          <div className="signature-box">
            <div className="signature-line"></div>
            <p className="signature-title">Pieczęć urzędowa</p>
          </div>
        </div>

        <div className="footer">
          <p>
            Dokument wygenerowano automatycznie w systemie Odbudowa 2024
            <br />
            Data wydruku: {formatDate(new Date().toISOString())}
          </p>
        </div>
      </div>
    </div>
  );
}