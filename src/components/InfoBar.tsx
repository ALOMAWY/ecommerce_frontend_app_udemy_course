import { useNavigate } from "react-router-dom";
import { useCart } from "../context/Cart/CartContext";
import { useLang } from "../i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2 } from "lucide-react";

function InfoBar() {
  const { totalAmount, clearCart, cartItems } = useCart();
  const { t } = useLang();
  const navigate = useNavigate();

  return (
    <div className="sticky top-16 z-40 w-full border-b border-white/5 bg-gradient-to-r from-violet-600/90 to-fuchsia-600/90 backdrop-blur-xl">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-3">
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <p className="text-sm font-medium text-white/80">
            {t("cart.total")}:{" "}
            <span className="font-bold text-white">
              {new Intl.NumberFormat("en-US").format(totalAmount)} SYP
            </span>
          </p>
          <Button
            disabled={!cartItems.length}
            variant="secondary"
            size="sm"
            onClick={() => navigate("/checkout")}
            className="bg-white/15 hover:bg-white/25 text-white border-0"
          >
            <ShoppingCart className="h-3.5 w-3.5 ml-1.5" />
            {t("cart.checkout")}
          </Button>
        </div>
        <Button
          disabled={!cartItems.length}
          variant="destructive"
          size="sm"
          onClick={() => clearCart()}
          className="bg-white/10 hover:bg-destructive/80 text-white border-0"
        >
          <Trash2 className="h-3.5 w-3.5 ml-1.5" />
          {t("cart.clear")}
        </Button>
      </div>
    </div>
  );
}

export default InfoBar;
