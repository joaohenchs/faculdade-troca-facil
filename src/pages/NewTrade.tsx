import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ItemCard } from "@/components/ItemCard";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface Item {
  id: string;
  title: string;
  description: string | null;
  category: string;
  image_url: string | null;
  status: string;
}

export default function NewTrade() {
  const [searchParams] = useSearchParams();
  const requestedItemId = searchParams.get("requestedItem");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myItems, setMyItems] = useState<Item[]>([]);
  const [requestedItem, setRequestedItem] = useState<Item | null>(null);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && requestedItemId) {
      fetchData();
    }
  }, [user, requestedItemId]);

  const fetchData = async () => {
    try {
      // Fetch requested item
      const { data: reqItem, error: reqError } = await supabase
        .from("items")
        .select("*")
        .eq("id", requestedItemId)
        .single();

      if (reqError) throw reqError;
      setRequestedItem(reqItem);

      // Fetch user's available items
      const { data: userItems, error: itemsError } = await supabase
        .from("items")
        .select("*")
        .eq("user_id", user?.id)
        .eq("status", "available")
        .order("created_at", { ascending: false });

      if (itemsError) throw itemsError;
      setMyItems(userItems || []);
    } catch (error: any) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados");
      navigate("/explore");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId || !requestedItemId) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("trade_requests").insert({
        offered_item_id: selectedItemId,
        requested_item_id: requestedItemId,
        status: "pending",
      });

      if (error) throw error;

      toast.success("Proposta de troca enviada!");
      navigate("/trades");
    } catch (error: any) {
      console.error("Erro ao criar proposta:", error);
      toast.error("Erro ao criar proposta de troca");
    } finally {
      setLoading(false);
    }
  };

  if (!requestedItem) {
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Nova Proposta de Troca</h1>

        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-8 items-center">
          <Card>
            <CardHeader>
              <CardTitle>Seu Item</CardTitle>
            </CardHeader>
            <CardContent>
              {myItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Você não tem itens disponíveis para troca
                </p>
              ) : (
                <div className="space-y-4">
                  <Label>Selecione o item que você quer oferecer</Label>
                  <Select value={selectedItemId} onValueChange={setSelectedItemId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha um item" />
                    </SelectTrigger>
                    <SelectContent>
                      {myItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedItemId && (
                    <div className="mt-4">
                      {myItems
                        .filter((item) => item.id === selectedItemId)
                        .map((item) => (
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
              )}
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <div className="bg-primary text-primary-foreground p-4 rounded-full">
              <ArrowRight className="h-6 w-6" />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Item Desejado</CardTitle>
            </CardHeader>
            <CardContent>
              <ItemCard
                id={requestedItem.id}
                title={requestedItem.title}
                description={requestedItem.description}
                category={requestedItem.category}
                imageUrl={requestedItem.image_url}
                status={requestedItem.status}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4 mt-8 max-w-md mx-auto">
          <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !selectedItemId || myItems.length === 0}
            className="flex-1"
          >
            {loading ? "Enviando..." : "Enviar Proposta"}
          </Button>
        </div>
      </div>
    </div>
  );
}
