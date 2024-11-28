import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, pdf } from '@react-pdf/renderer';
import type { Claim } from '../types/claim';
import { userService } from './userService';
import { ROLE_LABELS } from '../types/roles';
import { CLAIM_STATUS_LABELS } from '../types/claim';

// Register Roboto font for Polish characters support
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
  fontWeight: 'normal',
  fontStyle: 'normal'
});

Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
  fontWeight: 'bold',
  fontStyle: 'normal'
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Roboto',
    fontSize: 10
  },
  header: {
    marginBottom: 20,
    textAlign: 'center'
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 15,
    color: '#4F46E5',
    fontWeight: 'bold'
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    backgroundColor: '#F3F4F6',
    padding: 5,
    textTransform: 'uppercase'
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5
  },
  label: {
    width: '30%',
    fontSize: 9,
    color: '#6B7280'
  },
  value: {
    width: '70%',
    fontSize: 9,
    fontWeight: 'normal'
  },
  table: {
    marginTop: 10
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 5,
    fontSize: 9,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    borderBottomStyle: 'solid'
  },
  tableRow: {
    flexDirection: 'row',
    padding: 4,
    fontSize: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    borderBottomStyle: 'solid'
  },
  col1: { width: '20%' },
  col2: { width: '20%' },
  col3: { width: '30%' },
  col4: { width: '30%' },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 8,
    color: '#6B7280'
  }
});

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

const ClaimDocument = ({ claim }: { claim: Claim }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>System Odbudowa 2024</Text>
        <Text style={styles.subtitle}>Wniosek nr {claim.id}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{CLAIM_STATUS_LABELS[claim.status]}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Data utworzenia:</Text>
          <Text style={styles.value}>{formatDate(claim.createdAt)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informacje o obiekcie</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Nazwa zwyczajowa:</Text>
          <Text style={styles.value}>{claim.commonName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>ID wniosku Survey123:</Text>
          <Text style={styles.value}>{claim.surveyId}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Nazwa obiektu:</Text>
          <Text style={styles.value}>{claim.objectName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Adres:</Text>
          <Text style={styles.value}>{claim.address}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lokalizacja</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Województwo:</Text>
          <Text style={styles.value}>{claim.voivodeship}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Powiat:</Text>
          <Text style={styles.value}>{claim.county}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Gmina:</Text>
          <Text style={styles.value}>{claim.commune}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informacje finansowe</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Wycena szkód (netto):</Text>
          <Text style={styles.value}>{formatMoney(claim.finalNetAmount)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Kwota wnioskowana:</Text>
          <Text style={styles.value}>{formatMoney(claim.requestedAmount)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Historia działań</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Data</Text>
            <Text style={styles.col2}>Status</Text>
            <Text style={styles.col3}>Użytkownik</Text>
            <Text style={styles.col4}>Komentarz</Text>
          </View>
          {claim.history.map((event, index) => {
            const user = userService.getByEmail(event.updatedBy);
            const userInfo = user ? 
              `${user.firstName} ${user.lastName}\n${user.organizationName}\n${ROLE_LABELS[user.role]}` :
              event.updatedBy;
            const status = CLAIM_STATUS_LABELS[event.status as keyof typeof CLAIM_STATUS_LABELS] || event.status;

            return (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.col1}>{formatDate(event.updatedAt)}</Text>
                <Text style={styles.col2}>{status}</Text>
                <Text style={styles.col3}>{userInfo}</Text>
                <Text style={styles.col4}>{event.comment}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
        `Strona ${pageNumber} z ${totalPages}`
      )} fixed />
    </Page>
  </Document>
);

export async function generateClaimPDF(claim: Claim) {
  return await pdf(<ClaimDocument claim={claim} />).toBlob();
}