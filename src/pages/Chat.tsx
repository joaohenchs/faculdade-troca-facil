import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Check, ArrowLeft, Gift, Repeat } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  profiles?: {
    name: string;
  };
}

interface TradeDetails {
  id: string;
  status: string;
  confirmed_by_requester: boolean;
  confirmed_by_offerer: boolean;
  offered_item: {
    id: string;
    title: string;
    image_url: string | null;
    user_id: string;
    type: string;
  };
  requested_item: {
    id: string;
    title: string;
    image_url: string | null;
    user_id: string;
    type: string;
  };
}

export default function Chat() {
  const { tradeId } = useParams<{ tradeId: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [trade, setTrade] = useState<TradeDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && tradeId) {
      fetchTradeDetails();
      fetchMessages();
      subscribeToMessages();
    }
  }, [user, tradeId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchTradeDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("trade_requests")
        .select(`
          *,
          offered_item:items!trade_requests_offered_item_id_fkey(
            id, title, image_url, user_id, type
          ),
          requested_item:items!trade_requests_requested_item_id_fkey(
            id, title, image_url, user_id, type
          )
        `)
        .eq("id", tradeId)
        .single();

      if (error) throw error;

      const isOfferer = data.offered_item.user_id === user?.id;
      const isRequester = data.requested_item.user_id === user?.id;

      if (!isOfferer && !isRequester) {
        toast.error("Você não tem acesso a esta conversa");
        navigate("/trades");
        return;
      }

      if (data.status !== "accepted") {
        toast.error("Esta negociação não está disponível para chat");
        navigate("/trades");
        return;
      }

      setTrade(data);
    } catch (error: any) {
      console.error("Erro ao carregar detalhes:", error);
      toast.error("Erro ao carregar detalhes da negociação");
      navigate("/trades");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          profiles:sender_id(name)
        `)
        .eq("trade_id", tradeId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      console.error("Erro ao carregar mensagens:", error);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`trade-${tradeId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `trade_id=eq.${tradeId}`,
        },
        async (payload) => {
          const { data } = await supabase
            .from("messages")
            .select(`*, profiles:sender_id(name)`)
            .eq("id", payload.new.id)
            .single();

          if (data) {
            setMessages((prev) => [...prev, data]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || sending) return;

    setSending(true);
    try {
      const { error } = await supabase.from("messages").insert({
        trade_id: tradeId,
        sender_id: user.id,
        content: newMessage.trim(),
      });

      if (error) throw error;
      setNewMessage("");
    } catch (error: any) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Erro ao enviar mensagem");
    } finally {
      setSending(false);
    }
  };

  const handleConfirmTrade = async () => {
    if (!trade || !user || confirming) return;

    setConfirming(true);
    try {
      const isOfferer = trade.offered_item.user_id === user.id;
      const updateField = isOfferer ? "confirmed_by_offerer" : "confirmed_by_requester";

      const otherConfirmed = isOfferer
        ? trade.confirmed_by_requester
        : trade.confirmed_by_offerer;

      const updateData: any = {
        [updateField]: true,
      };

      // If both confirmed, update status and items
      if (otherConfirmed) {
        updateData.status = "confirmed";
      }

      const { error: tradeError } = await supabase
        .from("trade_requests")
        .update(updateData)
        .eq("id", trade.id);

      if (tradeError) throw tradeError;

      // If both confirmed, mark items as traded
      if (otherConfirmed) {
        const { error: itemsError } = await supabase
          .from("items")
          .update({ status: "traded" })
          .in("id", [trade.offered_item.id, trade.requested_item.id]);

        if (itemsError) throw itemsError;

        toast.success("Troca confirmada por ambos! Os itens foram marcados como trocados.");
        navigate("/trades");
      } else {
        toast.success("Você confirmou a troca. Aguardando confirmação do outro usuário.");
        setTrade({
          ...trade,
          [updateField]: true,
        });
      }
    } catch (error: any) {
      console.error("Erro ao confirmar troca:", error);
      toast.error("Erro ao confirmar troca");
    } finally {
      setConfirming(false);
    }
  };

  const getUserConfirmationStatus = () => {
    if (!trade || !user) return { userConfirmed: false, otherConfirmed: false };

    const isOfferer = trade.offered_item.user_id === user.id;
    return {
      userConfirmed: isOfferer ? trade.confirmed_by_offerer : trade.confirmed_by_requester,
      otherConfirmed: isOfferer ? trade.confirmed_by_requester : trade.confirmed_by_offerer,
    };
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!trade) {
    return null;
  }

  const isDonation = trade.requested_item.type === "donation";
  const { userConfirmed, otherConfirmed } = getUserConfirmationStatus();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-4 flex-1 flex flex-col max-w-4xl">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/trades")}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold flex items-center gap-2">
              {isDonation ? (
                <>
                  <Gift className="h-5 w-5" />
                  Negociação de Doação
                </>
              ) : (
                <>
                  <Repeat className="h-5 w-5" />
                  Negociação de Troca
                </>
              )}
            </h1>
          </div>
        </div>

        <Card className="mb-4">
          <CardHeader className="py-3">
            <CardTitle className="text-sm">Resumo da Negociação</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="flex items-center gap-4">
              {!isDonation && (
                <>
                  <div className="flex-1 text-center">
                    <div className="aspect-video bg-muted rounded-lg mb-1 overflow-hidden max-h-20">
                      {trade.offered_item.image_url ? (
                        <img
                          src={trade.offered_item.image_url}
                          alt={trade.offered_item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                          Sem imagem
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-medium truncate">{trade.offered_item.title}</p>
                  </div>
                  <span className="text-muted-foreground">→</span>
                </>
              )}
              <div className="flex-1 text-center">
                <div className="aspect-video bg-muted rounded-lg mb-1 overflow-hidden max-h-20">
                  {trade.requested_item.image_url ? (
                    <img
                      src={trade.requested_item.image_url}
                      alt={trade.requested_item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      Sem imagem
                    </div>
                  )}
                </div>
                <p className="text-xs font-medium truncate">{trade.requested_item.title}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">Status de Confirmação:</span>
                {userConfirmed ? (
                  <Badge variant="default" className="bg-green-600">
                    <Check className="h-3 w-3 mr-1" />
                    Você confirmou
                  </Badge>
                ) : (
                  <Badge variant="outline">Aguardando sua confirmação</Badge>
                )}
                {otherConfirmed ? (
                  <Badge variant="default" className="bg-green-600">
                    <Check className="h-3 w-3 mr-1" />
                    Outro confirmou
                  </Badge>
                ) : (
                  <Badge variant="outline">Aguardando outro usuário</Badge>
                )}
              </div>
              {!userConfirmed && (
                <Button
                  size="sm"
                  onClick={handleConfirmTrade}
                  disabled={confirming}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-1" />
                  {confirming ? "Confirmando..." : "Confirmar Troca"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1 flex flex-col min-h-0">
          <CardHeader className="py-3 border-b">
            <CardTitle className="text-sm">Mensagens</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 flex flex-col min-h-0">
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <p className="text-center text-muted-foreground text-sm py-8">
                    Nenhuma mensagem ainda. Comece a conversa!
                  </p>
                ) : (
                  messages.map((message) => {
                    const isOwnMessage = message.sender_id === user?.id;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-3 py-2 ${
                            isOwnMessage
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {!isOwnMessage && (
                            <p className="text-xs font-semibold mb-1">
                              {message.profiles?.name || "Usuário"}
                            </p>
                          )}
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground"
                            }`}
                          >
                            {new Date(message.created_at).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <form onSubmit={sendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite sua mensagem..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={sending}
                  className="flex-1"
                />
                <Button type="submit" disabled={sending || !newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
