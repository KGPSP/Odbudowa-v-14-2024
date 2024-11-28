import { v4 as uuidv4 } from 'uuid';

interface ClaimNumberData {
  lastNumber: number;
  year: number;
}

export const claimNumberService = {
  getNextNumber(): string {
    const currentYear = new Date().getFullYear();
    const storedData = localStorage.getItem('claimNumberData');
    let data: ClaimNumberData;

    if (storedData) {
      data = JSON.parse(storedData);
      // If year changed, reset counter
      if (data.year !== currentYear) {
        data = { lastNumber: 0, year: currentYear };
      }
    } else {
      data = { lastNumber: 0, year: currentYear };
    }

    // Increment counter
    data.lastNumber++;

    // Save updated data
    localStorage.setItem('claimNumberData', JSON.stringify(data));

    // Generate unique hash (last 4 characters of UUID)
    const uniqueHash = uuidv4().substring(0, 4);

    // Format: RRRRNNNNNN/H where:
    // RRRR - year
    // NNNNNN - 6-digit sequential number
    // H - 4-character unique hash
    return `${currentYear}${data.lastNumber.toString().padStart(6, '0')}/${uniqueHash}`;
  },

  validateNumber(number: string): boolean {
    // Validate format: RRRRNNNNNN/HHHH
    const regex = /^\d{4}\d{6}\/[a-f0-9]{4}$/i;
    return regex.test(number);
  }
};