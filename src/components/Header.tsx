import { Menu, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}

export function Header({ onMenuToggle, isSidebarOpen }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className={cn(
      'h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 transition-all duration-300',
      isSidebarOpen ? 'lg:ml-0' : 'lg:ml-0'
    )}>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="lg:hidden"
        >
          <Menu size={20} />
        </Button>
        
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
          <Search size={18} className="text-gray-400" />
          <Input 
            placeholder="Search..."
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-6 w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </Button>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="font-medium text-sm">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role.replace('_', ' ')}</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}
