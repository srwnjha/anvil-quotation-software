import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { LoginPage } from '@/sections/LoginPage';
import { Dashboard } from '@/sections/Dashboard';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { CustomersPage } from '@/sections/CustomersPage';
import { ProductsPage } from '@/sections/ProductsPage';
import { QuotationsPage } from '@/sections/QuotationsPage';
import { QuotationForm } from '@/sections/QuotationForm';
import { QuotationView } from '@/sections/QuotationView';
import { SettingsPage } from '@/sections/SettingsPage';
import { UsersPage } from '@/sections/UsersPage';
import { ReportsPage } from '@/sections/ReportsPage';
import { Toaster } from '@/components/ui/sonner';

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

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigateTo = (page: Page, id?: string) => {
    setCurrentPage(page);
    setSelectedId(id || null);
  };

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={navigateTo} />;
      case 'customers':
        return <CustomersPage />;
      case 'products':
        return <ProductsPage />;
      case 'quotations':
        return <QuotationsPage onNavigate={navigateTo} />;
      case 'quotation-new':
        return <QuotationForm onNavigate={navigateTo} />;
      case 'quotation-edit':
        return <QuotationForm quotationId={selectedId} onNavigate={navigateTo} />;
      case 'quotation-view':
        return <QuotationView quotationId={selectedId} onNavigate={navigateTo} />;
      case 'settings':
        return <SettingsPage />;
      case 'users':
        return <UsersPage />;
      case 'reports':
        return <ReportsPage />;
      default:
        return <Dashboard onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Sidebar 
        isOpen={isSidebarOpen} 
        currentPage={currentPage} 
        onNavigate={navigateTo}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div 
        className={`transition-all duration-300 ${
          isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        }`}
      >
        <Header 
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />
        <main className="p-4 lg:p-6">
          {renderPage()}
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
