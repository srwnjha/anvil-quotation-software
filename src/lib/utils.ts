import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Nepal VAT Calculation
export interface VatCalculation {
  subtotal: number;
  discountTotal: number;
  taxableAmount: number;
  vatAmount: number;
  grandTotal: number;
}

export function calculateVat(
  items: { quantity: number; unitPrice: number; discount: number; vatApplicable: boolean }[],
  vatRate: number
): VatCalculation {
  let subtotal = 0;
  let discountTotal = 0;
  let taxableAmount = 0;
  let vatAmount = 0;

  items.forEach(item => {
    const itemTotal = item.quantity * item.unitPrice;
    const itemDiscount = itemTotal * (item.discount / 100);
    const itemNet = itemTotal - itemDiscount;

    subtotal += itemTotal;
    discountTotal += itemDiscount;

    if (item.vatApplicable) {
      taxableAmount += itemNet;
      vatAmount += itemNet * (vatRate / 100);
    }
  });

  const grandTotal = subtotal - discountTotal + vatAmount;

  return {
    subtotal,
    discountTotal,
    taxableAmount,
    vatAmount,
    grandTotal,
  };
}

// Number to Words for Nepal (NPR)
const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

function convertLessThanOneThousand(num: number): string {
  if (num === 0) return '';
  
  if (num < 10) {
    return ones[num];
  }
  
  if (num < 20) {
    return teens[num - 10];
  }
  
  if (num < 100) {
    const ten = Math.floor(num / 10);
    const remainder = num % 10;
    return tens[ten] + (remainder ? ' ' + ones[remainder] : '');
  }
  
  const hundred = Math.floor(num / 100);
  const remainder = num % 100;
  return ones[hundred] + ' Hundred' + (remainder ? ' ' + convertLessThanOneThousand(remainder) : '');
}

export function numberToWords(num: number): string {
  if (num === 0) return 'Zero';
  
  const isNegative = num < 0;
  num = Math.abs(num);
  
  const crores = Math.floor(num / 10000000);
  const lakhs = Math.floor((num % 10000000) / 100000);
  const thousands = Math.floor((num % 100000) / 1000);
  const hundreds = num % 1000;
  
  let result = '';
  
  if (crores > 0) {
    result += convertLessThanOneThousand(crores) + ' Crore';
    if (lakhs > 0 || thousands > 0 || hundreds > 0) result += ' ';
  }
  
  if (lakhs > 0) {
    result += convertLessThanOneThousand(lakhs) + ' Lakh';
    if (thousands > 0 || hundreds > 0) result += ' ';
  }
  
  if (thousands > 0) {
    result += convertLessThanOneThousand(thousands) + ' Thousand';
    if (hundreds > 0) result += ' ';
  }
  
  if (hundreds > 0) {
    result += convertLessThanOneThousand(hundreds);
  }
  
  if (isNegative) {
    result = 'Negative ' + result;
  }
  
  return result + ' Only';
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'NPR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format date
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// Get status badge color
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    expired: 'bg-yellow-100 text-yellow-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Deep clone
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Calculate percentage
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

// Group by
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

// Debounce
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Get fiscal year
export function getCurrentFiscalYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  // Nepal fiscal year starts from Shrawan (July-August)
  // Shrawan is roughly July-August (month 6 or 7)
  if (month >= 6) {
    const startYear = year - 2000 + 56; // Convert to Bikram Sambat
    const endYear = startYear + 1;
    return `${startYear}-${endYear.toString().slice(-2)}`;
  } else {
    const startYear = year - 2000 + 55;
    const endYear = startYear + 1;
    return `${startYear}-${endYear.toString().slice(-2)}`;
  }
}

// Parse bullet points from description
export function parseBulletPoints(text: string): string[] {
  if (!text) return [];
  return text.split('\n').filter(line => line.trim().startsWith('•')).map(line => line.trim());
}

// Create description with bullet points
export function createBulletDescription(mainText: string, bullets: string[]): string {
  const bulletLines = bullets.map(b => `• ${b}`).join('\n');
  return `${mainText}\n${bulletLines}`;
}
