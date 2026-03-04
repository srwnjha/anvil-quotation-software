import { useState, useEffect } from 'react';
import { Save, Building2, FileText, Percent, Eye, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db } from '@/lib/db';
import type { CompanyConfig } from '@/types';
import { toast } from 'sonner';

export function SettingsPage() {
  const [config, setConfig] = useState<CompanyConfig>(db.getCompanyConfig());
  const [previewNumber, setPreviewNumber] = useState('');

  useEffect(() => {
    const currentConfig = db.getCompanyConfig();
    setConfig(currentConfig);
    updatePreview(currentConfig);
  }, []);

  const updatePreview = (cfg: CompanyConfig) => {
    const nextSeq = (cfg.currentSequence + 1).toString().padStart(3, '0');
    setPreviewNumber(`${cfg.quotationPrefix}/${cfg.fiscalYearFormat}/${nextSeq}`);
  };

  const handleSave = () => {
    db.updateCompanyConfig(config);
    updatePreview(config);
    toast.success('Settings saved successfully');
  };

  const handleChange = (field: keyof CompanyConfig, value: any) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    if (field === 'quotationPrefix' || field === 'fiscalYearFormat') {
      updatePreview(newConfig);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Configure your quotation system settings</p>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="quotation">Quotation</TabsTrigger>
          <TabsTrigger value="vat">VAT</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
        </TabsList>

        {/* Company Settings */}
        <TabsContent value="company" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input
                    id="name"
                    value={config.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={config.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={config.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={config.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={config.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="panNumber">PAN Number</Label>
                  <Input
                    id="panNumber"
                    value={config.panNumber}
                    onChange={(e) => handleChange('panNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vatNumber">VAT Number</Label>
                  <Input
                    id="vatNumber"
                    value={config.vatNumber}
                    onChange={(e) => handleChange('vatNumber', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Branding */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Branding
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Company Logo</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                    {config.logo ? (
                      <img src={config.logo} alt="Logo" className="h-16 mx-auto" />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Upload Logo</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Digital Signature</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                    {config.signature ? (
                      <img src={config.signature} alt="Signature" className="h-16 mx-auto" />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Upload Signature</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Company Stamp</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                    {config.stamp ? (
                      <img src={config.stamp} alt="Stamp" className="h-16 mx-auto" />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Upload Stamp</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quotation Settings */}
        <TabsContent value="quotation" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Quotation Numbering
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quotationPrefix">Prefix</Label>
                  <Input
                    id="quotationPrefix"
                    value={config.quotationPrefix}
                    onChange={(e) => handleChange('quotationPrefix', e.target.value)}
                    placeholder="e.g., ANV"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fiscalYearFormat">Fiscal Year</Label>
                  <Input
                    id="fiscalYearFormat"
                    value={config.fiscalYearFormat}
                    onChange={(e) => handleChange('fiscalYearFormat', e.target.value)}
                    placeholder="e.g., 82-83"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentSequence">Current Sequence</Label>
                  <Input
                    id="currentSequence"
                    type="number"
                    value={config.currentSequence}
                    onChange={(e) => handleChange('currentSequence', Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-600 font-medium mb-1">Next Quotation Number Preview:</p>
                <p className="text-2xl font-bold text-blue-900">{previewNumber}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="termsAndConditions">Default Terms & Conditions</Label>
                <Textarea
                  id="termsAndConditions"
                  value={config.termsAndConditions}
                  onChange={(e) => handleChange('termsAndConditions', e.target.value)}
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Textarea
                  id="paymentTerms"
                  value={config.paymentTerms}
                  onChange={(e) => handleChange('paymentTerms', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="footerTagline">Footer Tagline</Label>
                <Input
                  id="footerTagline"
                  value={config.footerTagline}
                  onChange={(e) => handleChange('footerTagline', e.target.value)}
                  placeholder="e.g., Thank you for your business"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VAT Settings */}
        <TabsContent value="vat" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Percent className="h-5 w-5" />
                Nepal VAT Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vatRate">VAT Rate (%)</Label>
                <Input
                  id="vatRate"
                  type="number"
                  value={config.vatRate}
                  onChange={(e) => handleChange('vatRate', Number(e.target.value))}
                />
                <p className="text-sm text-gray-500">Default VAT rate for Nepal is 13%</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> VAT is applied only to items marked as "VAT Applicable" in the product catalog.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Settings */}
        <TabsContent value="display" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-5 w-5" />
                PDF Display Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label>Show Signature</Label>
                  <p className="text-sm text-gray-500">Display signature area on quotation PDF</p>
                </div>
                <Switch
                  checked={config.showSignature}
                  onCheckedChange={(checked) => handleChange('showSignature', checked)}
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label>Show Company Stamp</Label>
                  <p className="text-sm text-gray-500">Display stamp area on quotation PDF</p>
                </div>
                <Switch
                  checked={config.showStamp}
                  onCheckedChange={(checked) => handleChange('showStamp', checked)}
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label>Show VAT Breakdown</Label>
                  <p className="text-sm text-gray-500">Display detailed VAT calculation on PDF</p>
                </div>
                <Switch
                  checked={config.showVatBreakdown}
                  onCheckedChange={(checked) => handleChange('showVatBreakdown', checked)}
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label>Show Amount in Words</Label>
                  <p className="text-sm text-gray-500">Convert grand total to words on PDF</p>
                </div>
                <Switch
                  checked={config.showAmountInWords}
                  onCheckedChange={(checked) => handleChange('showAmountInWords', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
