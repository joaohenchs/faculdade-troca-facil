import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Package, Gift, Repeat, Eye, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ItemCardProps {
  id: string;
  title: string;
  description?: string;
  category: string;
  imageUrl?: string;
  status: string;
  type?: string;
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
  type = "trade",
  userName,
  showActions = false,
  onProposeTrade,
}: ItemCardProps) => {
  const isDonation = type === "donation";

  return (
    <Card className="group overflow-hidden hover-lift bg-white dark:bg-gray-900 border-border/50">
      <CardHeader className="p-0 relative">
        <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
              <Package className="h-12 w-12" />
              <span className="text-xs">Sem imagem</span>
            </div>
          )}
        </div>
        <div className="absolute top-3 left-3">
          <Badge
            className={`${
              isDonation
                ? "bg-emerald-500/90 hover:bg-emerald-600 text-white border-0"
                : "bg-blue-500/90 hover:bg-blue-600 text-white border-0"
            } backdrop-blur-sm shadow-md`}
          >
            {isDonation ? (
              <><Gift className="h-3 w-3 mr-1.5" /> Doação</>
            ) : (
              <><Repeat className="h-3 w-3 mr-1.5" /> Troca</>
            )}
          </Badge>
        </div>
        {status !== "available" && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <Badge variant="secondary" className="text-base px-4 py-1.5">
              Indisponível
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          {userName && (
            <p className="text-xs text-muted-foreground mt-0.5">
              por <span className="font-medium text-foreground/70">{userName}</span>
            </p>
          )}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
        <div className="flex items-center gap-2 pt-1">
          <Badge variant="outline" className="text-xs font-normal">
            {category}
          </Badge>
        </div>
      </CardContent>
      {showActions && status === "available" && (
        <CardFooter className="p-4 pt-0 gap-2 border-t border-border/50 bg-muted/30">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="flex-1 hover:bg-white dark:hover:bg-gray-800"
          >
            <Link to={`/items/${id}`} className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              Detalhes
            </Link>
          </Button>
          {onProposeTrade && (
            <Button
              size="sm"
              onClick={onProposeTrade}
              className={`flex-1 ${
                isDonation
                  ? "bg-emerald-500 hover:bg-emerald-600"
                  : "bg-primary hover:bg-primary-dark"
              }`}
            >
              {isDonation ? "Solicitar" : "Propor"}
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};
