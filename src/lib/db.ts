import type { 
  User, 
  CompanyConfig, 
  Customer, 
  ProductService, 
  Quotation, 
  DashboardStats,
  VatSummary
} from '@/types';

// Mock Database
class Database {
  private users: User[] = [
    {
      id: '1',
      email: 'superadmin@anviltech.com',
      name: 'Super Admin',
      role: 'super_admin',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      email: 'admin@anviltech.com',
      name: 'Admin User',
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      email: 'sales@anviltech.com',
      name: 'Sales User',
      role: 'sales_user',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      email: 'manager@anviltech.com',
      name: 'Manager',
      role: 'manager',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ];

  private companyConfig: CompanyConfig = {
    id: '1',
    name: 'Anvil Technologies Pvt. Ltd.',
    address: 'Kathmandu, Nepal',
    phone: '+977-1-XXXXXXX',
    email: 'info@anviltechnologies.com',
    panNumber: '123456789',
    vatNumber: 'VAT123456',
    currency: 'NPR',
    vatRate: 13,
    quotationPrefix: 'ANV',
    fiscalYearFormat: '82-83',
    currentSequence: 26,
    termsAndConditions: '1. Payment terms: 50% advance, 50% on delivery\n2. Validity: 30 days from quotation date\n3. Prices are inclusive of VAT where applicable',
    paymentTerms: '50% advance payment required to commence work. Balance 50% payable upon completion/delivery.',
    footerTagline: 'Innovating Tomorrow, Today',
    showSignature: true,
    showStamp: true,
    showVatBreakdown: true,
    showAmountInWords: true,
  };

  private customers: Customer[] = [
    {
      id: '1',
      companyName: 'ABC Enterprises Pvt. Ltd.',
      contactName: 'Ram Sharma',
      address: 'New Road, Kathmandu, Nepal',
      email: 'ram@abcenterprises.com',
      phone: '+977-98XXXXXXXX',
      panNumber: 'PAN001234',
      vatNumber: 'VAT001234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      companyName: 'XYZ Solutions',
      contactName: 'Sita Gurung',
      address: 'Lalitpur, Nepal',
      email: 'sita@xyzsolutions.com',
      phone: '+977-97XXXXXXXX',
      panNumber: 'PAN005678',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      companyName: 'Mountain View Corp',
      contactName: 'Hari Prasad',
      address: 'Pokhara, Nepal',
      email: 'hari@mountainview.com',
      phone: '+977-96XXXXXXXX',
      vatNumber: 'VAT009876',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  private products: ProductService[] = [
    {
      id: '1',
      name: 'Web Development Services',
      description: 'Custom website development',
      longDescription: '• Responsive design\n• CMS integration\n• SEO optimization\n• 6 months support',
      unitPrice: 150000,
      vatApplicable: true,
      unit: 'Project',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Mobile App Development',
      description: 'iOS and Android app development',
      longDescription: '• Native iOS & Android\n• API development\n• App store deployment\n• 1 year maintenance',
      unitPrice: 300000,
      vatApplicable: true,
      unit: 'Project',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Cloud Hosting - Basic',
      description: 'Basic cloud hosting package',
      longDescription: '• 10GB SSD storage\n• 100GB bandwidth\n• 99.9% uptime\n• Daily backups',
      unitPrice: 5000,
      vatApplicable: true,
      unit: 'Month',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'IT Consulting',
      description: 'Professional IT consulting services',
      longDescription: '• Technology assessment\n• Digital transformation strategy\n• Process optimization',
      unitPrice: 8000,
      vatApplicable: false,
      unit: 'Hour',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '5',
      name: 'Software License - ERP',
      description: 'Enterprise Resource Planning software license',
      longDescription: '• Multi-user license\n• Annual subscription\n• Free updates\n• Technical support',
      unitPrice: 250000,
      vatApplicable: true,
      unit: 'Year',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  private quotations: Quotation[] = [
    {
      id: '1',
      quotationNumber: 'ANV/82-83/026',
      customerId: '1',
      items: [
        {
          id: '1',
          productServiceId: '1',
          description: 'Web Development Services\n• Responsive design\n• CMS integration\n• SEO optimization',
          quantity: 1,
          unit: 'Project',
          unitPrice: 150000,
          discount: 0,
          vatRate: 13,
          vatApplicable: true,
          amount: 150000,
        },
        {
          id: '2',
          productServiceId: '3',
          description: 'Cloud Hosting - Basic (Annual)',
          quantity: 12,
          unit: 'Month',
          unitPrice: 5000,
          discount: 10,
          vatRate: 13,
          vatApplicable: true,
          amount: 54000,
        },
      ],
      subtotal: 204000,
      discountTotal: 0,
      taxableAmount: 204000,
      vatAmount: 26520,
      grandTotal: 230520,
      status: 'approved',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: '3',
      notes: 'Priority project - expedite delivery',
    },
    {
      id: '2',
      quotationNumber: 'ANV/82-83/027',
      customerId: '2',
      items: [
        {
          id: '3',
          productServiceId: '2',
          description: 'Mobile App Development\n• Native iOS & Android\n• API development',
          quantity: 1,
          unit: 'Project',
          unitPrice: 300000,
          discount: 5,
          vatRate: 13,
          vatApplicable: true,
          amount: 285000,
        },
        {
          id: '4',
          productServiceId: '4',
          description: 'IT Consulting - Project Planning',
          quantity: 20,
          unit: 'Hour',
          unitPrice: 8000,
          discount: 0,
          vatRate: 0,
          vatApplicable: false,
          amount: 160000,
        },
      ],
      subtotal: 445000,
      discountTotal: 0,
      taxableAmount: 285000,
      vatAmount: 37050,
      grandTotal: 482050,
      status: 'sent',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: '3',
    },
    {
      id: '3',
      quotationNumber: 'ANV/82-83/028',
      customerId: '3',
      items: [
        {
          id: '5',
          productServiceId: '5',
          description: 'Software License - ERP (Annual)',
          quantity: 1,
          unit: 'Year',
          unitPrice: 250000,
          discount: 0,
          vatRate: 13,
          vatApplicable: true,
          amount: 250000,
        },
      ],
      subtotal: 250000,
      discountTotal: 0,
      taxableAmount: 250000,
      vatAmount: 32500,
      grandTotal: 282500,
      status: 'draft',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: '3',
    },
  ];

  // User Methods
  getUsers(): User[] {
    return [...this.users];
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email === email);
  }

  addUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updates };
      return this.users[index];
    }
    return undefined;
  }

  deleteUser(id: string): boolean {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }

  // Company Config Methods
  getCompanyConfig(): CompanyConfig {
    return { ...this.companyConfig };
  }

  updateCompanyConfig(updates: Partial<CompanyConfig>): CompanyConfig {
    this.companyConfig = { ...this.companyConfig, ...updates };
    return this.companyConfig;
  }

  // Customer Methods
  getCustomers(): Customer[] {
    return [...this.customers];
  }

  getCustomerById(id: string): Customer | undefined {
    return this.customers.find(c => c.id === id);
  }

  addCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Customer {
    const newCustomer: Customer = {
      ...customer,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.customers.push(newCustomer);
    return newCustomer;
  }

  updateCustomer(id: string, updates: Partial<Customer>): Customer | undefined {
    const index = this.customers.findIndex(c => c.id === id);
    if (index !== -1) {
      this.customers[index] = { 
        ...this.customers[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      return this.customers[index];
    }
    return undefined;
  }

  deleteCustomer(id: string): boolean {
    const index = this.customers.findIndex(c => c.id === id);
    if (index !== -1) {
      this.customers.splice(index, 1);
      return true;
    }
    return false;
  }

  // Product Methods
  getProducts(): ProductService[] {
    return [...this.products];
  }

  getProductById(id: string): ProductService | undefined {
    return this.products.find(p => p.id === id);
  }

  addProduct(product: Omit<ProductService, 'id' | 'createdAt' | 'updatedAt'>): ProductService {
    const newProduct: ProductService = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.products.push(newProduct);
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<ProductService>): ProductService | undefined {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index] = { 
        ...this.products[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      return this.products[index];
    }
    return undefined;
  }

  deleteProduct(id: string): boolean {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      return true;
    }
    return false;
  }

  // Quotation Methods
  getQuotations(): Quotation[] {
    return [...this.quotations];
  }

  getQuotationById(id: string): Quotation | undefined {
    return this.quotations.find(q => q.id === id);
  }

  getQuotationByNumber(number: string): Quotation | undefined {
    return this.quotations.find(q => q.quotationNumber === number);
  }

  generateQuotationNumber(): string {
    const { quotationPrefix, fiscalYearFormat, currentSequence } = this.companyConfig;
    const nextSequence = currentSequence + 1;
    const sequenceStr = nextSequence.toString().padStart(3, '0');
    return `${quotationPrefix}/${fiscalYearFormat}/${sequenceStr}`;
  }

  addQuotation(quotation: Omit<Quotation, 'id' | 'quotationNumber' | 'createdAt' | 'updatedAt'>): Quotation {
    const quotationNumber = this.generateQuotationNumber();
    const newQuotation: Quotation = {
      ...quotation,
      id: Math.random().toString(36).substr(2, 9),
      quotationNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.quotations.push(newQuotation);
    this.companyConfig.currentSequence++;
    return newQuotation;
  }

  updateQuotation(id: string, updates: Partial<Quotation>): Quotation | undefined {
    const index = this.quotations.findIndex(q => q.id === id);
    if (index !== -1) {
      this.quotations[index] = { 
        ...this.quotations[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      return this.quotations[index];
    }
    return undefined;
  }

  deleteQuotation(id: string): boolean {
    const index = this.quotations.findIndex(q => q.id === id);
    if (index !== -1) {
      this.quotations.splice(index, 1);
      return true;
    }
    return false;
  }

  duplicateQuotation(id: string): Quotation | undefined {
    const original = this.getQuotationById(id);
    if (!original) return undefined;

    const newQuotation = this.addQuotation({
      customerId: original.customerId,
      items: original.items.map(item => ({
        ...item,
        id: Math.random().toString(36).substr(2, 9),
      })),
      subtotal: original.subtotal,
      discountTotal: original.discountTotal,
      taxableAmount: original.taxableAmount,
      vatAmount: original.vatAmount,
      grandTotal: original.grandTotal,
      status: 'draft',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: original.createdBy,
      notes: original.notes,
      termsAndConditions: original.termsAndConditions,
    });

    return newQuotation;
  }

  // Dashboard Stats
  getDashboardStats(): DashboardStats {
    const totalQuotations = this.quotations.length;
    const draftQuotations = this.quotations.filter(q => q.status === 'draft').length;
    const sentQuotations = this.quotations.filter(q => q.status === 'sent').length;
    const approvedQuotations = this.quotations.filter(q => q.status === 'approved').length;
    const rejectedQuotations = this.quotations.filter(q => q.status === 'rejected').length;
    const totalRevenue = this.quotations
      .filter(q => q.status === 'approved')
      .reduce((sum, q) => sum + q.grandTotal, 0);

    // Generate monthly stats for current year
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyStats = months.map((month, index) => {
      const monthQuotations = this.quotations.filter(q => {
        const qDate = new Date(q.createdAt);
        return qDate.getMonth() === index;
      });
      return {
        month,
        quotations: monthQuotations.length,
        approved: monthQuotations.filter(q => q.status === 'approved').length,
        revenue: monthQuotations
          .filter(q => q.status === 'approved')
          .reduce((sum, q) => sum + q.grandTotal, 0),
      };
    });

    return {
      totalQuotations,
      draftQuotations,
      sentQuotations,
      approvedQuotations,
      rejectedQuotations,
      totalRevenue,
      monthlyStats,
    };
  }

  // VAT Summary
  getVatSummary(period: string): VatSummary {
    const quotations = this.quotations.filter(q => 
      q.status === 'approved' || q.status === 'sent'
    );

    const totalTaxableAmount = quotations.reduce((sum, q) => sum + q.taxableAmount, 0);
    const totalVatAmount = quotations.reduce((sum, q) => sum + q.vatAmount, 0);
    const totalExemptAmount = quotations.reduce((sum, q) => {
      const exemptItems = q.items.filter(i => !i.vatApplicable);
      return sum + exemptItems.reduce((itemSum, item) => itemSum + item.amount, 0);
    }, 0);

    return {
      totalTaxableAmount,
      totalVatAmount,
      totalExemptAmount,
      period,
    };
  }
}

export const db = new Database();
