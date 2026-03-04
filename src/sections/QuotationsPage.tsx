import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, MoreHorizontal, FileText, Copy, Eye, Send, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { db } from '@/lib/db';
import type { Quotation, QuotationStatus } from '@/types';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
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

interface QuotationsPageProps {
  onNavigate: (page: Page, id?: string) => void;
}

const statusOptions: { value: QuotationStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'expired', label: 'Expired' },
];

export function QuotationsPage({ onNavigate }: QuotationsPageProps) {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<QuotationStatus | 'all'>('all');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);

  useEffect(() => {
    loadQuotations();
  }, []);

  const loadQuotations = () => {
    const allQuotations = db.getQuotations();
    // Enrich with customer data
    const enriched = allQuotations.map(q => ({
      ...q,
      customer: db.getCustomerById(q.customerId),
    }));
    setQuotations(enriched);
  };

  const filteredQuotations = quotations.filter(quotation => {
    const matchesSearch = 
      quotation.quotationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quotation.customer?.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quotation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedQuotation) {
      db.deleteQuotation(selectedQuotation.id);
      toast.success('Quotation deleted successfully');
      setIsDeleteDialogOpen(false);
      loadQuotations();
    }
  };

  const handleDuplicate = (quotation: Quotation) => {
    const newQuotation = db.duplicateQuotation(quotation.id);
    if (newQuotation) {
      toast.success(`Quotation duplicated: ${newQuotation.quotationNumber}`);
      loadQuotations();
    }
  };

  const handleStatusChange = (quotation: Quotation, newStatus: QuotationStatus) => {
    db.updateQuotation(quotation.id, { status: newStatus });
    toast.success(`Quotation status updated to ${newStatus}`);
    loadQuotations();
  };

  const getStatusIcon = (status: QuotationStatus) => {
    switch (status) {
      case 'draft': return <Clock className="h-4 w-4" />;
      case 'sent': return <Send className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'expired': return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quotations</h1>
          <p className="text-gray-500">Manage your quotations and proposals</p>
        </div>
        <Button 
          onClick={() => onNavigate('quotation-new')}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Quotation
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search quotations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as QuotationStatus | 'all')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Quotations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredQuotations.map((quotation) => (
          <Card key={quotation.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{quotation.quotationNumber}</h3>
                    <p className="text-sm text-gray-500">{formatDate(quotation.createdAt)}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => onNavigate('quotation-view', quotation.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate('quotation-edit', quotation.id)}>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicate(quotation)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    {quotation.status === 'draft' && (
                      <DropdownMenuItem onClick={() => handleStatusChange(quotation, 'sent')}>
                        <Send className="mr-2 h-4 w-4" />
                        Mark as Sent
                      </DropdownMenuItem>
                    )}
                    {quotation.status === 'sent' && (
                      <>
                        <DropdownMenuItem onClick={() => handleStatusChange(quotation, 'approved')}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Approved
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(quotation, 'rejected')}>
                          <XCircle className="mr-2 h-4 w-4" />
                          Mark as Rejected
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem onClick={() => handleDelete(quotation)} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Customer</span>
                  <span className="font-medium text-gray-900">{quotation.customer?.companyName || 'Unknown'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Items</span>
                  <span className="font-medium text-gray-900">{quotation.items.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Valid Until</span>
                  <span className="font-medium text-gray-900">{formatDate(quotation.validUntil)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <Badge className={getStatusColor(quotation.status)}>
                  {getStatusIcon(quotation.status)}
                  <span className="ml-1 capitalize">{quotation.status}</span>
                </Badge>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Grand Total</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(quotation.grandTotal)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQuotations.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No quotations found</h3>
          <p className="text-gray-500">Create your first quotation to get started</p>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete quotation {selectedQuotation?.quotationNumber}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
