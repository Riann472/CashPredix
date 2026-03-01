import { Link, Outlet, useLocation } from 'react-router';
import { Wallet, Home, Receipt, Settings } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export default function Layout() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className=" mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-8 h-8 text-emerald-600" />
              <h1 className="text-xl font-semibold">Gestão Financeira</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <Link
              to="/"
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                isActive('/')
                  ? 'text-emerald-600 bg-emerald-100/60 dark:bg-emerald-500/15'
                  : 'text-muted-foreground hover:text-emerald-600 hover:bg-muted/60'
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Início</span>
            </Link>

            <Link
              to="/transacoes"
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                isActive('/transacoes')
                  ? 'text-emerald-600 bg-emerald-100/60 dark:bg-emerald-500/15'
                  : 'text-muted-foreground hover:text-emerald-600 hover:bg-muted/60'
              }`}
            >
              <Receipt className="w-6 h-6" />
              <span className="text-xs font-medium">Transações</span>
            </Link>

            <Link
              to="/configuracoes"
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                isActive('/configuracoes')
                  ? 'text-emerald-600 bg-emerald-100/60 dark:bg-emerald-500/15'
                  : 'text-muted-foreground hover:text-emerald-600 hover:bg-muted/60'
              }`}
            >
              <Settings className="w-6 h-6" />
              <span className="text-xs font-medium">Configurações</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Spacer for bottom nav */}
      <div className="h-20"></div>
    </div>
  );
}
