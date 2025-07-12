import { formatCurrency, formatPercentage, formatDate } from './helpers';

describe('Helpers', () => {
  describe('formatCurrency', () => {
    it('should format positive currency correctly', () => {
      const result = formatCurrency(1234.56);
      expect(result).toContain('1.234,56');
      expect(result).toContain('R$');
    });

    it('should format zero currency correctly', () => {
      const result = formatCurrency(0);
      expect(result).toContain('0,00');
      expect(result).toContain('R$');
    });

    it('should format negative currency correctly', () => {
      const result = formatCurrency(-1234.56);
      expect(result).toContain('1.234,56');
      expect(result).toContain('-');
    });

    it('should format large currency correctly', () => {
      const result = formatCurrency(1000000.99);
      expect(result).toContain('1.000.000,99');
      expect(result).toContain('R$');
    });

    it('should format small decimal currency correctly', () => {
      const result = formatCurrency(0.01);
      expect(result).toContain('0,01');
      expect(result).toContain('R$');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentage with 2 decimal places', () => {
      const result = formatPercentage(12.345);
      expect(result).toBe('12.35%');
    });

    it('should format zero percentage', () => {
      const result = formatPercentage(0);
      expect(result).toBe('0.00%');
    });

    it('should format whole number percentage', () => {
      const result = formatPercentage(50);
      expect(result).toBe('50.00%');
    });

    it('should format negative percentage', () => {
      const result = formatPercentage(-5.5);
      expect(result).toBe('-5.50%');
    });

    it('should format very small percentage', () => {
      const result = formatPercentage(0.001);
      expect(result).toBe('0.00%');
    });
  });

  describe('formatDate', () => {
    it('should format date in DD/MM/YYYY format', () => {
      const date = new Date(2024, 0, 15);
      const result = formatDate(date);
      expect(result).toBe('15/01/2024');
    });

    it('should format date with different month', () => {
      const date = new Date(2023, 11, 25);
      const result = formatDate(date);
      expect(result).toBe('25/12/2023');
    });

    it('should format date with single digit day and month', () => {
      const date = new Date(2024, 2, 5);
      const result = formatDate(date);
      expect(result).toBe('05/03/2024');
    });

    it('should handle leap year date', () => {
      const date = new Date(2024, 1, 29);
      const result = formatDate(date);
      expect(result).toBe('29/02/2024');
    });

    it('should handle start of year date', () => {
      const date = new Date(2024, 0, 1);
      const result = formatDate(date);
      expect(result).toBe('01/01/2024');
    });

    it('should handle end of year date', () => {
      const date = new Date(2024, 11, 31);
      const result = formatDate(date);
      expect(result).toBe('31/12/2024');
    });
  });
});
