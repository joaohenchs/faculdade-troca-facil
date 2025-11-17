import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Check, X, MessageCircle, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface TradeRequest {
  id: string;
  status: string;
  created_at: string;
  confirmed_by_requester: boolean;
  confirmed_by_offerer: boolean;
  offered_item: {
    id: string;
    title: string;
    image_url: string | null;
    user_id: string;
    type: string;
    profiles: {
      name: string;
    };
  };
  requested_item: {
    id: string;
    title: string;
    image_url: string | null;
    user_id: string;
    type: string;
    profiles: {
      name: string;
    };
  };
}

export default function Trades() {
  const { user, loading } = useAuth();
  const [sentTrades, setSentTrades] = useState<TradeRequest[]>([]);
  const [receivedTrades, setReceivedTrades] = useState<TradeRequest[]>([]);
  const [loadingTrades, setLoadingTrades] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchTrades();
    }
  }, [user]);

  const fetchTrades = async () => {
    try {
      const { data, error } = await supabase
        .from("trade_requests")
        .select(`
          *,
          offered_item:items!trade_requests_offered_item_id_fkey(
            id, title, image_url, user_id, type,
            profiles:user_id(name)
          ),
          requested_item:items!trade_requests_requested_item_id_fkey(
            id, title, image_url, user_id, type,
            profiles:user_id(name)
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const sent = data?.filter((trade: any) => trade.offered_item.user_id === user?.id) || [];
      const received = data?.filter((trade: any) => trade.requested_item.user_id === user?.id) || [];

      setSentTrades(sent);
      setReceivedTrades(received);
    } catch (error: any) {
      console.error("Erro ao carregar trocas:", error);
      toast.error("Erro ao carregar trocas");
    } finally {
      setLoadingTrades(false);
    }
  };

  const handleAccept = async (tradeId: string) => {
    try {
      const { error: tradeError } = await supabase
        .from("trade_requests")
        .update({ status: "accepted" })
        .eq("id", tradeId);

      if (tradeError) throw tradeError;

      toast.success("Proposta aceita! Agora vocês podem conversar para combinar os detalhes.");
      fetchTrades();
      // Navigate to chat
      navigate(`/chat/${tradeId}`);
    } catch (error: any) {
      console.error("Erro ao aceitar troca:", error);
      toast.error("Erro ao aceitar troca");
    }
  };

  const handleReject = async (tradeId: string) => {
    try {
      const { error } = await supabase
        .from("trade_requests")
        .update({ status: "rejected" })
        .eq("id", tradeId);

      if (error) throw error;

      toast.success("Troca recusada");
      fetchTrades();
    } catch (error: any) {
      console.error("Erro ao recusar troca:", error);
      toast.error("Erro ao recusar troca");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      pending: { variant: "outline", label: "Pendente" },
      accepted: { variant: "default", label: "Em Negociação" },
      confirmed: { variant: "secondary", label: "Confirmada" },
      rejected: { variant: "destructive", label: "Recusada" },
      cancelled: { variant: "destructive", label: "Cancelada" },
    };
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const isDonation = (trade: TradeRequest) => {
    return trade.requested_item.type === "donation";
  };

  const TradeCard = ({ trade, isReceived }: { trade: TradeRequest; isReceived: boolean }) => {
    const donation = isDonation(trade);

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              {donation ? (
                <span className="flex items-center gap-1">
                  <Gift className="h-4 w-4" />
                  Doação {isReceived ? "de" : "para"} {isReceived ? trade.offered_item.profiles?.name : trade.requested_item.profiles?.name}
                </span>
              ) : (
                `Troca com ${isReceived ? trade.offered_item.profiles?.name : trade.requested_item.profiles?.name}`
              )}
            </CardTitle>
            {getStatusBadge(trade.status)}
          </div>
          <p className="text-sm text-muted-foreground">
            {new Date(trade.created_at).toLocaleDateString("pt-BR")}
          </p>
        </CardHeader>
        <CardContent>
          <div className={`grid ${donation ? "grid-cols-1" : "grid-cols-[1fr_auto_1fr]"} gap-4 items-center`}>
            {!donation && (
              <>
                <div className="text-center">
                  <div className="aspect-video bg-muted rounded-lg mb-2 overflow-hidden">
                    {trade.offered_item.image_url ? (
                      <img
                        src={trade.offered_item.image_url}
                        alt={trade.offered_item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        Sem imagem
                      </div>
                    )}
                  </div>
                  <p className="font-medium text-sm">{trade.offered_item.title}</p>
                  <p className="text-xs text-muted-foreground">Oferecido</p>
                </div>

                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </>
            )}

            <div className="text-center">
              <div className="aspect-video bg-muted rounded-lg mb-2 overflow-hidden">
                {trade.requested_item.image_url ? (
                  <img
                    src={trade.requested_item.image_url}
                    alt={trade.requested_item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Sem imagem
                  </div>
                )}
              </div>
              <p className="font-medium text-sm">{trade.requested_item.title}</p>
              <p className="text-xs text-muted-foreground">
                {donation ? "Item para doação" : "Solicitado"}
              </p>
            </div>
          </div>

          {isReceived && trade.status === "pending" && (
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleReject(trade.id)}
              >
                <X className="h-4 w-4 mr-1" />
                Recusar
              </Button>
              <Button
                size="sm"
                className="flex-1"
                onClick={() => handleAccept(trade.id)}
              >
                <Check className="h-4 w-4 mr-1" />
                Aceitar
              </Button>
            </div>
          )}

          {trade.status === "accepted" && (
            <div className="mt-4">
              <Button
                size="sm"
                className="w-full"
                onClick={() => navigate(`/chat/${trade.id}`)}
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                Abrir Chat
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading || loadingTrades) {
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
        <h1 className="text-3xl font-bold mb-8">Minhas Trocas</h1>

        <Tabs defaultValue="received" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="received">Recebidas ({receivedTrades.length})</TabsTrigger>
            <TabsTrigger value="sent">Enviadas ({sentTrades.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="mt-6">
            {receivedTrades.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma proposta de troca recebida
              </p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {receivedTrades.map((trade) => (
                  <TradeCard key={trade.id} trade={trade} isReceived={true} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sent" className="mt-6">
            {sentTrades.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma proposta de troca enviada
              </p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sentTrades.map((trade) => (
                  <TradeCard key={trade.id} trade={trade} isReceived={false} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
