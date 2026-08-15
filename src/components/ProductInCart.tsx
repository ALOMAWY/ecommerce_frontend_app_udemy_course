import { useCart } from "../context/Cart/CartContext";
import { useLang } from "../i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import type { IProductProps } from "../types/product";
import type { ICartItem } from "../types/cart";

export default function ProductInCart({
  _id,
  title,
  price,
  image,
}: IProductProps) {
  const { updateItemInCart, removeItemInCart, cartItems } = useCart();
  const { t } = useLang();

  const product = cartItems.find((item: ICartItem) => {
    if (typeof item.product !== "string") return item.product._id == _id;
  });
  const productQuantity = product?.quantity || 1;

  const handleUpdate = (qty: number) => {
    updateItemInCart(_id, qty);
    if (qty > productQuantity) {
      toast.success(`"${title}" quantity updated`);
    }
  };

  const handleRemove = () => {
    removeItemInCart(_id);
    toast.success(`"${title}" removed from cart`);
  };

  return (
    <div className="group relative flex flex-col rounded-2xl bg-card border border-white/5 overflow-hidden transition-all duration-300 hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/5">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-muted/50 to-muted overflow-hidden">
        <div
          className="absolute inset-0 bg-contain bg-center bg-no-repeat p-6"
          style={{ backgroundImage: `url(${image})` }}
        />
      </div>

      <div className="flex flex-col gap-2 p-4">
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 text-foreground/90">
          {title}
        </h3>
        <span className="text-lg font-bold text-violet-400">
          {price.toLocaleString()} SYP
        </span>
        <p className="text-xs text-muted-foreground">
          {productQuantity} x {price.toLocaleString()} SYP
        </p>
        <p className="text-xs text-muted-foreground">
          {product?.quantity} {t("cart.inCart")}
        </p>
      </div>

      <div className="flex items-center justify-between px-4 pb-4 gap-2">
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10"
            onClick={() => handleUpdate(productQuantity + 1)}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <span className="w-6 text-center text-sm font-medium">
            {productQuantity}
          </span>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10"
            onClick={() => handleUpdate(Math.max(1, productQuantity - 1))}
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleRemove}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
