import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Repeat, Plus, ArrowLeftRight, LogOut, Search, LayoutDashboard, MessageSquare } from "lucide-react";

export const Header = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b border-border/50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative bg-gradient-to-br from-primary to-primary-dark p-2.5 rounded-xl shadow-lg group-hover:scale-105 transition-transform">
                <Repeat className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight gradient-text">
                TrocaFácil
              </span>
              <span className="text-[10px] text-muted-foreground -mt-1 hidden sm:block">
                Troque, doe, transforme
              </span>
            </div>
          </Link>

          {user && (
            <nav className="flex items-center gap-1">
              <Button
                variant={isActive("/") ? "secondary" : "ghost"}
                size="sm"
                asChild
                className="relative"
              >
                <Link to="/" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden md:inline">Meus Itens</span>
                </Link>
              </Button>

              <Button
                variant={isActive("/explore") ? "secondary" : "ghost"}
                size="sm"
                asChild
              >
                <Link to="/explore" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span className="hidden md:inline">Explorar</span>
                </Link>
              </Button>

              <Button
                variant={isActive("/trades") ? "secondary" : "ghost"}
                size="sm"
                asChild
              >
                <Link to="/trades" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden md:inline">Negociações</span>
                </Link>
              </Button>

              <div className="w-px h-6 bg-border mx-2 hidden sm:block" />

              <Button
                size="sm"
                asChild
                className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary shadow-md hover:shadow-lg transition-all"
              >
                <Link to="/items/new" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Novo Item</span>
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                className="ml-1 text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};
