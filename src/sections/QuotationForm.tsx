import { useState, useEffect } from 'react';
import { Plus, Trash2, Calculator, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { db } from '@/lib/db';
import type { Customer, ProductService, QuotationItem } from '@/types';
import { formatCurrency, calculateVat, numberToWords, generateId } from '@/lib/utils';
import { toast } from 'sonner';

type Page = 
  | 'dashboard' 
  | 'customers' 
  | 'products' 
  | 'quotations' 
  | 'quotation-new' 
  | 'quotation-edit' 
  | 'quotation-view'
  | 'settings' 
  | 'users' 
  | 'reports';

interface QuotationFormProps {
  quotationId?: string | null;
  onNavigate: (page: Page, id?: string) => void;
}

export function QuotationForm({ quotationId, onNavigate }: QuotationFormProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<ProductService[]>([]);
  const [companyConfig, setCompanyConfig] = useState(db.getCompanyConfig());
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [validUntil, setValidUntil] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  });
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [notes, setNotes] = useState('');
  const [termsAndConditions, setTermsAndConditions] = useState(companyConfig.termsAndConditions);

  // Calculations
  const calculations = calculateVat(
    items.map(item => ({
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discount: item.discount,
      vatApplicable: item.vatApplicable,
    })),
    companyConfig.vatRate
  );

  useEffect(() => {
    setCustomers(db.getCustomers());
    setProducts(db.getProducts().filter(p => p.isActive));
    setCompanyConfig(db.getCompanyConfig());

    if (quotationId) {
      const quotation = db.getQuotationById(quotationId);
      if (quotation) {
        setSelectedCustomer(quotation.customerId);
        setValidUntil(quotation.validUntil.split('T')[0]);
        setItems(quotation.items);
        setNotes(quotation.notes || '');
        setTermsAndConditions(quotation.termsAndConditions || companyConfig.termsAndConditions);
      }
    }
  }, [quotationId, companyConfig.termsAndConditions]);

  const handleAddItem = (product: ProductService) => {
    const newItem: QuotationItem = {
      id: generateId(),
      productServiceId: product.id,
      description: product.longDescription 
        ? `${product.name}\n${product.longDescription}` 
        : product.name,
      quantity: 1,
      unit: product.unit,
      unitPrice: product.unitPrice,
      discount: 0,
      vatRate: product.vatApplicable ? companyConfig.vatRate : 0,
      vatApplicable: product.vatApplicable,
      amount: product.unitPrice,
    };
    setItems([...items, newItem]);
    setIsProductDialogOpen(false);
    toast.success(`${product.name} added to quotation`);
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const handleUpdateItem = (itemId: string, updates: Partial<QuotationItem>) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const updated = { ...item, ...updates };
        // Recalculate amount
        const itemTotal = updated.quantity * updated.unitPrice;
        const itemDiscount = itemTotal * (updated.discount / 100);
        updated.amount = itemTotal - itemDiscount;
        return updated;
      }
      return item;
    }));
  };

  const handleSave = (status: 'draft' | 'sent' = 'draft') => {
    if (!selectedCustomer) {
      toast.error('Please select a customer');
      return;
    }

    if (items.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    const quotationData = {
      customerId: selectedCustomer,
      items,
      subtotal: calculations.subtotal,
      discountTotal: calculations.discountTotal,
      taxableAmount: calculations.taxableAmount,
      vatAmount: calculations.vatAmount,
      grandTotal: calculations.grandTotal,
      status,
      validUntil: new Date(validUntil).toISOString(),
      createdBy: '3', // Current user ID
      notes,
      termsAndConditions,
    };

    if (quotationId) {
      db.updateQuotation(quotationId, quotationData);
      toast.success(`Quotation updated as ${status}`);
      onNavigate('quotation-view', quotationId);
    } else {
      const newQuotation = db.addQuotation(quotationData);
      toast.success(`Quotation ${newQuotation.quotationNumber} created as ${status}`);
      onNavigate('quotation-view', newQuotation.id);
    }
  };

  const selectedCustomerData = customers.find(c => c.id === selectedCustomer);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {quotationId ? 'Edit Quotation' : 'New Quotation'}
          </h1>
          <p className="text-gray-500">
            {quotationId ? 'Update existing quotation' : 'Create a new quotation for your customer'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onNavigate('quotations')}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button variant="outline" onClick={() => handleSave('draft')}>
            <Save className="mr-2 h-4 w-4" />
            Save as Draft
          </Button>
          <Button onClick={() => handleSave('sent')} className="bg-blue-600 hover:bg-blue-700">
            <Save className="mr-2 h-4 w-4" />
            Save & Send
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Customer & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Customer *</Label>
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.companyName} - {customer.contactName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCustomerData && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Company:</span>
                    <span className="text-sm font-medium">{selectedCustomerData.companyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Contact:</span>
                    <span className="text-sm font-medium">{selectedCustomerData.contactName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Address:</span>
                    <span className="text-sm font-medium text-right">{selectedCustomerData.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Email:</span>
                    <span className="text-sm font-medium">{selectedCustomerData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Phone:</span>
                    <span className="text-sm font-medium">{selectedCustomerData.phone}</span>
                  </div>
                  {(selectedCustomerData.panNumber || selectedCustomerData.vatNumber) && (
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      {selectedCustomerData.panNumber && (
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                          PAN: {selectedCustomerData.panNumber}
                        </span>
                      )}
                      {selectedCustomerData.vatNumber && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          VAT: {selectedCustomerData.vatNumber}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label>Valid Until *</Label>
                <Input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Line Items</CardTitle>
              <Button onClick={() => setIsProductDialogOpen(true)} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No items added yet</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsProductDialogOpen(true)}
                    className="mt-2"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Item
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-4 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Label className="text-sm font-medium">Item {index + 1}</Label>
                          <Textarea
                            value={item.description}
                            onChange={(e) => handleUpdateItem(item.id, { description: e.target.value })}
                            className="mt-1 min-h-[80px]"
                            placeholder="Item description"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <Label className="text-xs">Quantity</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateItem(item.id, { quantity: Number(e.target.value) })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Unit</Label>
                          <Input
                            value={item.unit}
                            onChange={(e) => handleUpdateItem(item.id, { unit: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Unit Price</Label>
                          <Input
                            type="number"
                            min="0"
                            value={item.unitPrice}
                            onChange={(e) => handleUpdateItem(item.id, { unitPrice: Number(e.target.value) })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Discount (%)</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={item.discount}
                            onChange={(e) => handleUpdateItem(item.id, { discount: Number(e.target.value) })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Amount</Label>
                          <div className="mt-1 h-10 flex items-center font-medium">
                            {formatCurrency(item.amount)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.vatApplicable ? (
                          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            VAT {companyConfig.vatRate}%
                          </span>
                        ) : (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            VAT Exempt
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes & Terms */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Notes & Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Internal Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add internal notes (not visible to customer)"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Terms & Conditions</Label>
                <Textarea
                  value={termsAndConditions}
                  onChange={(e) => setTermsAndConditions(e.target.value)}
                  placeholder="Enter terms and conditions"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          <Card className="border-0 shadow-sm sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Quotation Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">{formatCurrency(calculations.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Discount</span>
                  <span className="font-medium text-red-600">-{formatCurrency(calculations.discountTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Taxable Amount</span>
                  <span className="font-medium">{formatCurrency(calculations.taxableAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">VAT ({companyConfig.vatRate}%)</span>
                  <span className="font-medium">{formatCurrency(calculations.vatAmount)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold">Grand Total</span>
                    <span className="text-xl font-bold text-blue-600">{formatCurrency(calculations.grandTotal)}</span>
                  </div>
                </div>
              </div>

              {companyConfig.showAmountInWords && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-600 font-medium mb-1">Amount in Words:</p>
                  <p className="text-sm text-blue-800">{numberToWords(calculations.grandTotal)}</p>
                </div>
              )}

              <div className="pt-4 space-y-2">
                <Button 
                  onClick={() => handleSave('draft')} 
                  variant="outline" 
                  className="w-full"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save as Draft
                </Button>
                <Button 
                  onClick={() => handleSave('sent')} 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save & Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Selection Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Product or Service</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {products.map(product => (
              <div
                key={product.id}
                onClick={() => handleAddItem(product)}
                className="border rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{product.name}</h4>
                  {product.vatApplicable ? (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">VAT</span>
                  ) : (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">No VAT</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-blue-600">{formatCurrency(product.unitPrice)}</span>
                  <span className="text-xs text-gray-500">per {product.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
