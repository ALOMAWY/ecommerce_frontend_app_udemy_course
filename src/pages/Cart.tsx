import ProductInCart from "../components/ProductInCart";
import InfoBar from "../components/InfoBar";
import { useCart } from "../context/Cart/CartContext";
import { useLang } from "../i18n/LanguageContext";
import { ShoppingBag } from "lucide-react";

const Cart = () => {
  const { cartItems } = useCart();
  const { t } = useLang();

  return (
    <div className="flex-1">
      <InfoBar />
      <div className="container mx-auto mt-4 px-4 pb-8">
        {cartItems.length ? (
          <>
            <h2 className="text-xl font-bold mb-6 tracking-tight">
              {t("cart.title")}
              <span className="text-muted-foreground text-sm font-normal ml-2">
                ({cartItems.length} {cartItems.length === 1 ? t("cart.item") : t("cart.items")})
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {cartItems.map((product, index) => (
                <div key={index}>
                  {typeof product.product !== "string" && (
                    <ProductInCart {...product.product} />
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-card border border-white/5 mb-4">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-xl font-semibold text-muted-foreground">
              {t("cart.empty")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
