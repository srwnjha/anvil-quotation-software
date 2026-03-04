// User & Role Management
export type UserRole = 'super_admin' | 'admin' | 'sales_user' | 'manager';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

// Company Configuration
export interface CompanyConfig {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  panNumber: string;
  vatNumber: string;
  logo?: string;
  signature?: string;
  stamp?: string;
  currency: string;
  vatRate: number;
  quotationPrefix: string;
  fiscalYearFormat: string;
  currentSequence: number;
  termsAndConditions: string;
  paymentTerms: string;
  footerTagline: string;
  showSignature: boolean;
  showStamp: boolean;
  showVatBreakdown: boolean;
  showAmountInWords: boolean;
}

// Customer Management
export interface Customer {
  id: string;
  companyName: string;
  contactName: string;
  address: string;
  email: string;
  phone: string;
  panNumber?: string;
  vatNumber?: string;
  createdAt: string;
  updatedAt: string;
}

// Product/Service Management
export interface ProductService {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  unitPrice: number;
  vatApplicable: boolean;
  unit: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Quotation
export type QuotationStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';

export interface QuotationItem {
  id: string;
  productServiceId: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  vatRate: number;
  vatApplicable: boolean;
  amount: number;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  customerId: string;
  customer?: Customer;
  items: QuotationItem[];
  subtotal: number;
  discountTotal: number;
  taxableAmount: number;
  vatAmount: number;
  grandTotal: number;
  status: QuotationStatus;
  validUntil: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  notes?: string;
  termsAndConditions?: string;
}

// Dashboard & Reports
export interface DashboardStats {
  totalQuotations: number;
  draftQuotations: number;
  sentQuotations: number;
  approvedQuotations: number;
  rejectedQuotations: number;
  totalRevenue: number;
  monthlyStats: MonthlyStat[];
}

export interface MonthlyStat {
  month: string;
  quotations: number;
  approved: number;
  revenue: number;
}

export interface VatSummary {
  totalTaxableAmount: number;
  totalVatAmount: number;
  totalExemptAmount: number;
  period: string;
}

// Auth
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Number to Words conversion for Nepal
export interface NumberToWordsOptions {
  currency?: string;
  includeOnly?: boolean;
}
