import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { ItemCard } from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { Plus, Package } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Item {
  id: string;
  title: string;
  description: string | null;
  category: string;
  image_url: string | null;
  status: string;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user]);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      console.error("Erro ao carregar itens:", error);
      toast.error("Erro ao carregar seus itens");
    } finally {
      setLoadingItems(false);
    }
  };

  if (loading || loadingItems) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Meus Itens</h1>
            <p className="text-muted-foreground">
              Gerencie seus itens para troca e doação
            </p>
          </div>
          <Button asChild>
            <Link to="/items/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Item
            </Link>
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Nenhum item cadastrado</h2>
            <p className="text-muted-foreground mb-4">
              Comece adicionando itens que você deseja trocar ou doar
            </p>
            <Button asChild>
              <Link to="/items/new">Adicionar primeiro item</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                category={item.category}
                imageUrl={item.image_url}
                status={item.status}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
