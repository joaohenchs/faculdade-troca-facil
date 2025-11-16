import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { ItemCard } from "@/components/ItemCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Item {
  id: string;
  title: string;
  description: string | null;
  category: string;
  image_url: string | null;
  status: string;
  user_id: string;
  profiles: {
    name: string;
  };
}

export default function Explore() {
  const { user, loading } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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

  useEffect(() => {
    if (searchQuery) {
      const filtered = items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [searchQuery, items]);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from("items")
        .select(`
          *,
          profiles:user_id (name)
        `)
        .eq("status", "available")
        .neq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
      setFilteredItems(data || []);
    } catch (error: any) {
      console.error("Erro ao carregar itens:", error);
      toast.error("Erro ao carregar itens disponíveis");
    } finally {
      setLoadingItems(false);
    }
  };

  const handleProposeTrade = (itemId: string) => {
    navigate(`/trade/new?requestedItem=${itemId}`);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explorar Itens</h1>
          <p className="text-muted-foreground mb-6">
            Encontre itens interessantes para trocar
          </p>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título ou categoria..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              {searchQuery
                ? "Nenhum item encontrado para sua busca"
                : "Nenhum item disponível no momento"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                category={item.category}
                imageUrl={item.image_url}
                status={item.status}
                userName={item.profiles?.name}
                showActions
                onProposeTrade={() => handleProposeTrade(item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
