import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { ItemCard } from "@/components/ItemCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Gift, Repeat, LayoutGrid } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Item {
  id: string;
  title: string;
  description: string | null;
  category: string;
  image_url: string | null;
  status: string;
  type: string;
  user_id: string;
  profiles: {
    name: string;
  };
}

type FilterType = "all" | "trade" | "donation";

export default function Explore() {
  const { user, loading } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
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
    let filtered = items;

    // Filtrar por tipo
    if (typeFilter !== "all") {
      filtered = filtered.filter((item) => item.type === typeFilter);
    }

    // Filtrar por busca
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [searchQuery, typeFilter, items]);

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-64 bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold mb-2">
            Explorar <span className="gradient-text">Itens</span>
          </h1>
          <p className="text-muted-foreground mb-6">
            Descubra itens incríveis para trocar ou receber como doação
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título ou categoria..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-white dark:bg-gray-900 border-border/50 shadow-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant={typeFilter === "all" ? "default" : "outline"}
                size="default"
                onClick={() => setTypeFilter("all")}
                className={typeFilter === "all" ? "bg-gray-900 dark:bg-gray-100" : "bg-white dark:bg-gray-900"}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Todos
              </Button>
              <Button
                variant={typeFilter === "trade" ? "default" : "outline"}
                size="default"
                onClick={() => setTypeFilter("trade")}
                className={typeFilter === "trade" ? "bg-blue-600 hover:bg-blue-700" : "bg-white dark:bg-gray-900"}
              >
                <Repeat className="h-4 w-4 mr-2" />
                Trocas
              </Button>
              <Button
                variant={typeFilter === "donation" ? "default" : "outline"}
                size="default"
                onClick={() => setTypeFilter("donation")}
                className={typeFilter === "donation" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-white dark:bg-gray-900"}
              >
                <Gift className="h-4 w-4 mr-2" />
                Doações
              </Button>
            </div>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-muted-foreground/20 rounded-full blur-xl" />
              <div className="relative bg-gradient-to-br from-muted to-muted/50 p-6 rounded-full">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Nenhum item encontrado</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              {searchQuery || typeFilter !== "all"
                ? "Tente ajustar seus filtros ou termos de busca"
                : "Ainda não há itens disponíveis. Volte mais tarde!"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredItems.length} {filteredItems.length === 1 ? "item encontrado" : "itens encontrados"}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  description={item.description || undefined}
                  category={item.category}
                  imageUrl={item.image_url || undefined}
                  status={item.status}
                  type={item.type}
                  userName={item.profiles?.name}
                  showActions
                  onProposeTrade={() => handleProposeTrade(item.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
