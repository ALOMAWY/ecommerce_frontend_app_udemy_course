import { useNavigate } from "react-router-dom";
import { useCart } from "../context/Cart/CartContext";
import { useAuth } from "../context/Auth/AuthContext";
import { useLang } from "../i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import type { IProductProps } from "../types/product";

export default function Product({
  _id,
  title,
  description,
  price,
  stock,
  image,
}: IProductProps) {
  const { addItemToCart } = useCart();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useLang();

  return (
    <div
      onClick={() => navigate(`/product/${_id}`)}
      className="group relative flex flex-col rounded-2xl bg-card border border-white/5 overflow-hidden cursor-pointer transition-all duration-300 hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/5 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] bg-gradient-to-br from-muted/50 to-muted overflow-hidden">
        <div
          className="absolute inset-0 bg-contain bg-center bg-no-repeat p-6 transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="flex flex-col gap-2 p-4">
        <h3 className="font-semibold text-base leading-tight line-clamp-2 text-foreground/90 group-hover:text-foreground transition-colors">
          {title}
        </h3>

        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between mt-1 gap-2">
          <span className="text-lg font-bold text-violet-400 whitespace-nowrap">
            {price.toLocaleString()} SYP
          </span>
          <Badge
            variant={stock > 0 ? "default" : "destructive"}
            className={`text-[10px] px-2 py-0.5 ${
              stock > 0
                ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                : ""
            }`}
          >
            {stock > 0 ? t("product.inStock") : t("product.outOfStock")}
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground">
          {stock} {t("product.available")}
        </p>
      </div>

      <div className="px-4 pb-4">
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            if (isAuthenticated) addItemToCart(_id);
            else navigate("/login");
          }}
          disabled={stock === 0}
          className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:from-violet-600 hover:to-fuchsia-700 text-white border-0 shadow-lg shadow-violet-500/20 transition-all duration-200 hover:shadow-violet-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Package className="h-4 w-4 ml-2" />
          {t("product.addToCart")}
        </Button>
      </div>
    </div>
  );
}
