import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ArrowLeftRight, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Reconcile", href: "/reconcile", icon: ArrowLeftRight },
  { name: "Matched Records", href: "/matched-records", icon: CheckCircle },
  { name: "Exceptions", href: "/exceptions", icon: AlertCircle },
  { name: "Watchlist", href: "/watchlist", icon: Clock },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <ArrowLeftRight className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-semibold text-foreground">Matchmaker</span>
                <span className="text-xs text-muted-foreground">Internal Reconciliation</span>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Sarah Thompson</span>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">ST</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
