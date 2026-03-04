import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Download, Printer, Send, Edit2, Copy, CheckCircle, XCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/db';
import type { Quotation, QuotationStatus } from '@/types';
import { formatCurrency, formatDate, getStatusColor, numberToWords } from '@/lib/utils';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

interface QuotationViewProps {
  quotationId: string | null;
  onNavigate: (page: Page, id?: string) => void;
}

export function QuotationView({ quotationId, onNavigate }: QuotationViewProps) {
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [companyConfig, setCompanyConfig] = useState(db.getCompanyConfig());
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (quotationId) {
      const q = db.getQuotationById(quotationId);
      if (q) {
        setQuotation({
          ...q,
          customer: db.getCustomerById(q.customerId),
        });
      }
    }
    setCompanyConfig(db.getCompanyConfig());
  }, [quotationId]);

  const handleStatusChange = (newStatus: QuotationStatus) => {
    if (quotation) {
      db.updateQuotation(quotation.id, { status: newStatus });
      setQuotation({ ...quotation, status: newStatus });
      toast.success(`Quotation status updated to ${newStatus}`);
    }
  };

  const handleDuplicate = () => {
    if (quotation) {
      const newQuotation = db.duplicateQuotation(quotation.id);
      if (newQuotation) {
        toast.success(`Quotation duplicated: ${newQuotation.quotationNumber}`);
        onNavigate('quotation-view', newQuotation.id);
      }
    }
  };

  const generatePDF = async () => {
    if (!pdfRef.current) return;

    try {
      toast.info('Generating PDF...');
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${quotation?.quotationNumber}.pdf`);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      toast.error('Failed to generate PDF');
      console.error(error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!quotation) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Quotation not found</h3>
        <Button onClick={() => onNavigate('quotations')} className="mt-4">
          Back to Quotations
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => onNavigate('quotations')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{quotation.quotationNumber}</h1>
            <p className="text-gray-500">View and manage quotation</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={generatePDF}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" onClick={() => onNavigate('quotation-edit', quotation.id)}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" onClick={handleDuplicate}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </Button>
          {quotation.status === 'draft' && (
            <Button onClick={() => handleStatusChange('sent')} className="bg-blue-600 hover:bg-blue-700">
              <Send className="mr-2 h-4 w-4" />
              Mark as Sent
            </Button>
          )}
          {quotation.status === 'sent' && (
            <>
              <Button onClick={() => handleStatusChange('approved')} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button onClick={() => handleStatusChange('rejected')} variant="destructive">
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="print:hidden">
        <Badge className={`${getStatusColor(quotation.status)} text-sm px-3 py-1`}>
          Status: {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
        </Badge>
      </div>

      {/* Quotation Preview */}
      <div 
        ref={pdfRef} 
        className="bg-white p-8 lg:p-12 shadow-lg print:shadow-none print:p-0"
        style={{ minHeight: '297mm' }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-8 border-b-2 border-blue-900 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">QUOTATION</h1>
            <p className="text-gray-500 mt-1">{quotation.quotationNumber}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-blue-900">{companyConfig.name}</h2>
            <p className="text-sm text-gray-600">{companyConfig.address}</p>
            <p className="text-sm text-gray-600">{companyConfig.phone}</p>
            <p className="text-sm text-gray-600">{companyConfig.email}</p>
            {(companyConfig.panNumber || companyConfig.vatNumber) && (
              <div className="mt-2 text-sm">
                {companyConfig.panNumber && <p>PAN: {companyConfig.panNumber}</p>}
                {companyConfig.vatNumber && <p>VAT: {companyConfig.vatNumber}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Customer & Quotation Details */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Quotation To:</h3>
            <h4 className="font-bold text-lg">{quotation.customer?.companyName}</h4>
            <p className="text-gray-600">{quotation.customer?.contactName}</p>
            <p className="text-gray-600 mt-1">{quotation.customer?.address}</p>
            <p className="text-gray-600">{quotation.customer?.email}</p>
            <p className="text-gray-600">{quotation.customer?.phone}</p>
            {(quotation.customer?.panNumber || quotation.customer?.vatNumber) && (
              <div className="mt-2 text-sm">
                {quotation.customer.panNumber && <p>PAN: {quotation.customer.panNumber}</p>}
                {quotation.customer.vatNumber && <p>VAT: {quotation.customer.vatNumber}</p>}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="space-y-2">
              <div className="flex justify-end gap-4">
                <span className="text-gray-500">Quotation Date:</span>
                <span className="font-medium">{formatDate(quotation.createdAt)}</span>
              </div>
              <div className="flex justify-end gap-4">
                <span className="text-gray-500">Valid Until:</span>
                <span className="font-medium">{formatDate(quotation.validUntil)}</span>
              </div>
              <div className="flex justify-end gap-4">
                <span className="text-gray-500">Currency:</span>
                <span className="font-medium">{companyConfig.currency}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="py-3 px-4 text-left text-sm font-medium">S.N.</th>
                <th className="py-3 px-4 text-left text-sm font-medium">Description</th>
                <th className="py-3 px-4 text-center text-sm font-medium">Qty</th>
                <th className="py-3 px-4 text-center text-sm font-medium">Unit</th>
                <th className="py-3 px-4 text-right text-sm font-medium">Unit Price</th>
                <th className="py-3 px-4 text-right text-sm font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {quotation.items.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-3 px-4 text-sm">{index + 1}</td>
                  <td className="py-3 px-4 text-sm">
                    <div className="whitespace-pre-line">{item.description}</div>
                    {item.discount > 0 && (
                      <span className="text-xs text-red-600">Discount: {item.discount}%</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-center">{item.quantity}</td>
                  <td className="py-3 px-4 text-sm text-center">{item.unit}</td>
                  <td className="py-3 px-4 text-sm text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-3 px-4 text-sm text-right font-medium">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-full max-w-md">
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(quotation.subtotal)}</span>
              </div>
              {quotation.discountTotal > 0 && (
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium text-red-600">-{formatCurrency(quotation.discountTotal)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Taxable Amount</span>
                <span className="font-medium">{formatCurrency(quotation.taxableAmount)}</span>
              </div>
              {companyConfig.showVatBreakdown && (
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">VAT ({companyConfig.vatRate}%)</span>
                  <span className="font-medium">{formatCurrency(quotation.vatAmount)}</span>
                </div>
              )}
              <div className="flex justify-between py-3 bg-blue-50 px-4 rounded">
                <span className="font-bold text-blue-900">Grand Total</span>
                <span className="font-bold text-xl text-blue-900">{formatCurrency(quotation.grandTotal)}</span>
              </div>
            </div>

            {companyConfig.showAmountInWords && (
              <div className="mt-4 bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-500 uppercase mb-1">Amount in Words:</p>
                <p className="text-sm font-medium text-gray-800">{numberToWords(quotation.grandTotal)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Terms & Conditions */}
        {quotation.termsAndConditions && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Terms & Conditions:</h3>
            <div className="text-sm text-gray-600 whitespace-pre-line">
              {quotation.termsAndConditions}
            </div>
          </div>
        )}

        {/* Payment Terms */}
        {companyConfig.paymentTerms && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Payment Terms:</h3>
            <p className="text-sm text-gray-600">{companyConfig.paymentTerms}</p>
          </div>
        )}

        {/* Signature & Stamp */}
        {(companyConfig.showSignature || companyConfig.showStamp) && (
          <div className="flex justify-end mt-12">
            <div className="text-center">
              {companyConfig.showSignature && (
                <div className="mb-4">
                  <div className="w-48 h-20 border-b-2 border-gray-400 mb-2 flex items-end justify-center">
                    <span className="text-gray-400 text-sm">Signature</span>
                  </div>
                  <p className="text-sm font-medium">Authorized Signature</p>
                </div>
              )}
              {companyConfig.showStamp && (
                <div className="mt-4">
                  <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-gray-400 text-xs text-center">Company<br/>Stamp</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        {companyConfig.footerTagline && (
          <div className="mt-12 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500 italic">{companyConfig.footerTagline}</p>
          </div>
        )}
      </div>
    </div>
  );
}
