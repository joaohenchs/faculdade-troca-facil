import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ImageUpload } from "@/components/ImageUpload";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Gift, Repeat } from "lucide-react";

const categories = [
  "Eletrônicos",
  "Móveis",
  "Roupas",
  "Livros",
  "Jogos",
  "Esportes",
  "Decoração",
  "Outros",
];

export default function NewItem() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    imageUrl: "",
    type: "trade" as "trade" | "donation",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.title || !formData.category) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("items").insert({
        user_id: user.id,
        title: formData.title,
        description: formData.description || null,
        category: formData.category,
        image_url: formData.imageUrl || null,
        status: "available",
        type: formData.type,
      });

      if (error) throw error;

      const successMessage = formData.type === "donation"
        ? "Item para doação cadastrado com sucesso!"
        : "Item para troca cadastrado com sucesso!";
      toast.success(successMessage);
      navigate("/");
    } catch (error: any) {
      console.error("Erro ao criar item:", error);
      toast.error("Erro ao cadastrar item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Novo Item</CardTitle>
            <CardDescription>
              Cadastre um item para troca ou doação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label>Tipo de Anúncio *</Label>
                <RadioGroup
                  value={formData.type}
                  onValueChange={(value: "trade" | "donation") =>
                    setFormData({ ...formData, type: value })
                  }
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem
                      value="trade"
                      id="trade"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="trade"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <Repeat className="mb-3 h-6 w-6" />
                      <span className="font-semibold">Troca</span>
                      <span className="text-xs text-muted-foreground text-center mt-1">
                        Quero trocar por outro item
                      </span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="donation"
                      id="donation"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="donation"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <Gift className="mb-3 h-6 w-6" />
                      <span className="font-semibold">Doação</span>
                      <span className="text-xs text-muted-foreground text-center mt-1">
                        Quero doar gratuitamente
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  placeholder="Ex: Notebook Dell i5"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva seu item..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {user && (
                <ImageUpload
                  value={formData.imageUrl}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                  userId={user.id}
                />
              )}

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => navigate("/")} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Cadastrando..." : "Cadastrar Item"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
