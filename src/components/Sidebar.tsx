import { 
  LayoutDashboard, 
  Users, 
  Package, 
  FileText, 
  Settings, 
  UserCog, 
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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

interface SidebarProps {
  isOpen: boolean;
  currentPage: string;
  onNavigate: (page: Page, id?: string) => void;
  onToggle: () => void;
}

const menuItems: { id: Page; label: string; icon: typeof LayoutDashboard; page: Page; adminOnly?: boolean }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' },
  { id: 'customers', label: 'Customers', icon: Users, page: 'customers' },
  { id: 'products', label: 'Products & Services', icon: Package, page: 'products' },
  { id: 'quotations', label: 'Quotations', icon: FileText, page: 'quotations' },
  { id: 'reports', label: 'Reports', icon: BarChart3, page: 'reports' },
  { id: 'users', label: 'Users', icon: UserCog, page: 'users', adminOnly: true },
  { id: 'settings', label: 'Settings', icon: Settings, page: 'settings', adminOnly: true },
];

export function Sidebar({ isOpen, currentPage, onNavigate, onToggle }: SidebarProps) {
  const { user, logout, hasRole } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const filteredMenuItems = menuItems.filter(item => {
    if (item.adminOnly) {
      return hasRole(['super_admin', 'admin']);
    }
    return true;
  });

  return (
    <>
      {/* Mobile overlay */}
      {!isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white z-50 transition-all duration-300',
          isOpen ? 'w-64' : 'w-20'
        )}
      >
        {/* Toggle button */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 bg-blue-600 text-white rounded-full p-1 shadow-lg hover:bg-blue-700 transition-colors hidden lg:block"
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-blue-700/50 px-4">
          <div className={cn('flex items-center gap-3', !isOpen && 'justify-center')}>
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold">A</span>
            </div>
            {isOpen && (
              <div className="overflow-hidden">
                <h1 className="font-bold text-lg leading-tight">Anvil Tech</h1>
                <p className="text-xs text-blue-300">Quotation System</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.page || currentPage.startsWith(item.page.split('-')[0]);
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.page)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group',
                  isActive 
                    ? 'bg-white/20 text-white shadow-lg' 
                    : 'text-blue-200 hover:bg-white/10 hover:text-white',
                  !isOpen && 'justify-center'
                )}
                title={!isOpen ? item.label : undefined}
              >
                <Icon 
                  size={20} 
                  className={cn(
                    'flex-shrink-0 transition-transform group-hover:scale-110',
                    isActive && 'text-white'
                  )} 
                />
                {isOpen && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-blue-700/50">
          <div className={cn('flex items-center gap-3 mb-3', !isOpen && 'justify-center')}>
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="font-semibold">{user?.name.charAt(0)}</span>
            </div>
            {isOpen && (
              <div className="overflow-hidden">
                <p className="font-medium text-sm truncate">{user?.name}</p>
                <p className="text-xs text-blue-300 capitalize truncate">{user?.role.replace('_', ' ')}</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              'w-full flex items-center gap-2 text-blue-200 hover:text-white hover:bg-white/10',
              !isOpen && 'justify-center px-2'
            )}
          >
            <LogOut size={18} />
            {isOpen && <span className="text-sm">Logout</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}
