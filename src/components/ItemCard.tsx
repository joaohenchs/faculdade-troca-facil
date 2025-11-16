import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Package } from "lucide-react";
import { Link } from "react-router-dom";

interface ItemCardProps {
  id: string;
  title: string;
  description?: string;
  category: string;
  imageUrl?: string;
  status: string;
  userName?: string;
  showActions?: boolean;
  onProposeTrade?: () => void;
}

export const ItemCard = ({
  id,
  title,
  description,
  category,
  imageUrl,
  status,
  userName,
  showActions = false,
  onProposeTrade,
}: ItemCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-medium transition-smooth">
      <CardHeader className="p-0">
        <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <Package className="h-16 w-16 text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
          <Badge variant={status === "available" ? "default" : "secondary"}>
            {status === "available" ? "Disponível" : "Trocado"}
          </Badge>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{description}</p>
        )}
        <div className="flex items-center gap-2">
          <Badge variant="outline">{category}</Badge>
          {userName && <span className="text-xs text-muted-foreground">por {userName}</span>}
        </div>
      </CardContent>
      {showActions && status === "available" && (
        <CardFooter className="p-4 pt-0 gap-2">
          <Button variant="outline" asChild className="flex-1">
            <Link to={`/items/${id}`}>Ver detalhes</Link>
          </Button>
          {onProposeTrade && (
            <Button onClick={onProposeTrade} className="flex-1">
              Propor troca
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};
