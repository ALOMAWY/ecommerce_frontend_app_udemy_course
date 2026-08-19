import { useNavigate } from "react-router-dom";
import { useCart } from "../context/Cart/CartContext";
import { useAuth } from "../context/Auth/AuthContext";
import { useLang } from "../i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowUpRight } from "lucide-react";
import type { IProductProps } from "../types/product";

export default function Product({
  _id,
  title,
  description,
  price,
  stock,
  image,
  category,
  view = "grid",
}: IProductProps & { view?: "grid" | "list" | "gallery" }) {
  const { addItemToCart } = useCart();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t, tCategory, formatNumber, formatPrice } = useLang();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAuthenticated) addItemToCart(_id);
    else navigate("/login");
  };

  const stockBadge = (
    <Badge
      variant={stock > 0 ? "default" : "destructive"}
      className={`text-[10px] px-2 py-0.5 ${
        stock > 0 ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" : ""
      }`}
    >
      {stock > 0 ? t("product.inStock") : t("product.outOfStock")}
    </Badge>
  );

  if (view === "gallery") {
    return (
      <div onClick={() => navigate(`/product/${_id}`)} className="group product-image relative aspect-square cursor-pointer overflow-hidden rounded-[1.25rem] border border-white/[.08] transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
        <div className="absolute inset-0 bg-contain bg-center bg-no-repeat p-5 transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url(${image})` }} />
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100"><span className="rounded-full bg-background/85 px-3 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-foreground backdrop-blur-md">{t("product.view")}</span><ArrowUpRight className="h-4 w-4 text-primary" /></div>
      </div>
    );
  }

  if (view === "list") {
    return (
      <div
        onClick={() => navigate(`/product/${_id}`)}
        className="group relative flex items-center gap-4 rounded-[1.5rem] bg-card/90 border border-white/[.08] overflow-hidden cursor-pointer transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 p-3"
      >
        <div className="product-image relative w-24 h-24 sm:w-32 sm:h-32 overflow-hidden rounded-[1.2rem] flex-shrink-0">
          <div
            className="absolute inset-0 bg-contain bg-center bg-no-repeat p-3 transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url(${image})` }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-1 flex items-center gap-2"><span className="text-[10px] font-bold uppercase tracking-[.16em] text-primary/80">{tCategory(category) || t("product.techPick")}</span><ArrowUpRight className="h-3 w-3 text-muted-foreground" /></div>
          <h3 className="font-bold text-base leading-tight line-clamp-1 text-foreground/90 group-hover:text-foreground transition-colors">
            {title}
          </h3>
          {category && (
            <p className="text-xs text-muted-foreground mt-1 capitalize">{tCategory(category)}</p>
          )}
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mt-1">
              {description}
            </p>
          )}
          <div className="flex items-center justify-between mt-2 gap-2">
            <span className="text-lg font-bold text-primary whitespace-nowrap">
              {formatPrice(price)}
            </span>
            {stockBadge}
          </div>
        </div>

        <div className="flex-shrink-0">
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={stock === 0}
             className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Package className="h-4 w-4 ml-2" />
            {t("product.addToCart")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate(`/product/${_id}`)}
      className="group relative flex flex-col rounded-[1.6rem] bg-card/90 border border-white/[.08] overflow-hidden cursor-pointer transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
    >
      <div className="product-image relative aspect-[1.08/1] overflow-hidden p-4">
        <div className="absolute left-4 top-4 z-[1] rounded-full border border-white/10 bg-background/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-primary backdrop-blur-md">{tCategory(category) || t("product.techPick")}</div>
        <div
          className="absolute inset-0 bg-contain bg-center bg-no-repeat p-6 transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${image})` }}
        />
      </div>

      <div className="flex flex-col gap-2 px-5 pb-3 pt-4">
        <div className="flex items-start justify-between gap-3"><h3 className="font-bold text-[1.05rem] leading-tight line-clamp-2 text-foreground/90 group-hover:text-foreground transition-colors">
          {title}
        </h3><ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" /></div>

        {category && (
          <p className="text-xs text-muted-foreground capitalize">{tCategory(category)}</p>
        )}

        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between mt-1 gap-2">
<span className="text-xl font-bold tracking-tight text-primary whitespace-nowrap">
            {formatPrice(price)}
          </span>
          {stockBadge}
        </div>

<p className="text-[11px] font-medium text-muted-foreground">
          {formatNumber(stock)} {t("product.available")}
        </p>
      </div>

      <div className="px-5 pb-5">
        <Button
          size="sm"
          onClick={handleAddToCart}
          disabled={stock === 0}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_6px_20px_rgba(215,245,106,.08)]"
        >
          <Package className="h-4 w-4 ml-2" />
          {t("product.addToCart")}
        </Button>
      </div>
    </div>
  );
}
