import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface ItemDetail {
  id: string;
  title: string;
  description: string | null;
  category: string;
  image_url: string | null;
  status: string;
  user_id: string;
  created_at: string;
  profiles: {
    name: string;
  };
}

export default function ItemDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchItem();
    }
  }, [id]);

  const fetchItem = async () => {
    try {
      const { data, error } = await supabase
        .from("items")
        .select(`
          *,
          profiles:user_id (name)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      setItem(data);
    } catch (error: any) {
      console.error("Erro ao carregar item:", error);
      toast.error("Erro ao carregar item");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleProposeTrade = () => {
    navigate(`/trade/new?requestedItem=${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p>Item não encontrado</p>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === item.user_id;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
            {item.image_url ? (
              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <Package className="h-32 w-32 text-muted-foreground" />
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-3xl font-bold">{item.title}</h1>
                <Badge variant={item.status === "available" ? "default" : "secondary"}>
                  {item.status === "available" ? "Disponível" : "Trocado"}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                por {item.profiles?.name} • {new Date(item.created_at).toLocaleDateString("pt-BR")}
              </p>
            </div>

            <div>
              <h2 className="font-semibold mb-2">Categoria</h2>
              <Badge variant="outline">{item.category}</Badge>
            </div>

            {item.description && (
              <div>
                <h2 className="font-semibold mb-2">Descrição</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{item.description}</p>
              </div>
            )}

            {!isOwner && item.status === "available" && (
              <Button onClick={handleProposeTrade} className="w-full" size="lg">
                Propor Troca
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
