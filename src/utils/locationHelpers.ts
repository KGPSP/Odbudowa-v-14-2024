import csvData from '../data/dictionaries/baza-gminy.csv?raw';

export const getUniqueVoivodeships = (): string[] => {
  // Podziel dane na wiersze i pomiń nagłówek
  const rows = csvData.split('\n').slice(1);
  
  // Zbierz unikalne województwa
  const uniqueVoivodeships = [...new Set(
    rows
      .map(row => {
        const columns = row.split(',');
        return columns[3]?.trim(); // Weź czwartą kolumnę (wojewodztwo) i usuń białe znaki
      })
      .filter(Boolean) // Usuń puste wartości
  )].sort(); // Posortuj alfabetycznie
  
  return uniqueVoivodeships;
};

export const getCountiesForVoivodeship = (selectedVoivodeship: string): string[] => {
  // Podziel dane na wiersze i pomiń nagłówek
  const rows = csvData.split('\n').slice(1);
  
  // Zbierz unikalne powiaty dla wybranego województwa
  const counties = [...new Set(
    rows
      .filter(row => {
        const columns = row.split(',');
        return columns[3]?.trim() === selectedVoivodeship;
      })
      .map(row => {
        const columns = row.split(',');
        return columns[2]?.trim(); // Weź trzecią kolumnę (powiat)
      })
      .filter(Boolean)
  )].sort();
  
  return counties;
};

export const getCommunitiesForCounty = (selectedVoivodeship: string, selectedCounty: string): string[] => {
  // Podziel dane na wiersze i pomiń nagłówek
  const rows = csvData.split('\n').slice(1);
  
  // Zbierz unikalne gminy dla wybranego powiatu i województwa
  const communities = [...new Set(
    rows
      .filter(row => {
        const columns = row.split(',');
        return columns[3]?.trim() === selectedVoivodeship && 
               columns[2]?.trim() === selectedCounty;
      })
      .map(row => {
        const columns = row.split(',');
        return columns[1]?.trim(); // Weź drugą kolumnę (gmina)
      })
      .filter(Boolean)
  )].sort();
  
  return communities;
}; 