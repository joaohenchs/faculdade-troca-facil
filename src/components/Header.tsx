import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Package, Plus, ArrowLeftRight, LogOut } from "lucide-react";

export const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b border-border bg-card shadow-soft sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Package className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              TrocaFácil
            </span>
          </Link>

          {user && (
            <nav className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span className="hidden sm:inline">Meus Itens</span>
                </Link>
              </Button>
              
              <Button variant="ghost" asChild>
                <Link to="/trades" className="flex items-center gap-2">
                  <ArrowLeftRight className="h-4 w-4" />
                  <span className="hidden sm:inline">Trocas</span>
                </Link>
              </Button>

              <Button variant="ghost" asChild>
                <Link to="/explore" className="flex items-center gap-2">
                  <ArrowLeftRight className="h-4 w-4" />
                  <span className="hidden sm:inline">Explorar</span>
                </Link>
              </Button>
              
              <Button variant="default" asChild>
                <Link to="/items/new" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Adicionar</span>
                </Link>
              </Button>
              
              <Button variant="ghost" size="icon" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};
