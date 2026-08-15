import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/Auth/AuthContext";
import { PRODUCTS_KEY } from "../context/Auth/AuthProvider";
import type { IProductProps } from "../types/product";
import { useCart } from "../context/Cart/CartContext";
import { useEffect, useState } from "react";
import type { ICartItem } from "../types/cart";
import { useLang } from "../i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, ArrowLeft, Package, Shield } from "lucide-react";
import { toast } from "sonner";

const ProductPage = () => {
  const { id } = useParams();
  const { productsInContext, isAuthenticated } = useAuth();
  const { addItemToCart, cartItems } = useCart();
  const { t, dir } = useLang();
  const navigate = useNavigate();
  const [cartItem, setCartItem] = useState<ICartItem | undefined>();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    setCartItem(
      cartItems.find(
        (item: ICartItem) =>
          typeof item.product !== "string" && item.product._id == id
      )
    );
  }, [cartItems, id]);

  if (!id) return null;

  const productsFromLocalStorage: IProductProps[] = JSON.parse(
    localStorage.getItem(PRODUCTS_KEY) || "[]"
  );
  let product: IProductProps | undefined = productsFromLocalStorage?.find(
    (p) => p._id == id
  );
  if (!product) product = productsInContext?.find((p) => p._id == id);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    addItemToCart(id);
    toast.success(`"${product?.title}" ${t("product.addToCart")}`);
  };

  if (!product) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-64 w-64 rounded-2xl" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="container mx-auto px-6 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back")}
        </button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square rounded-2xl bg-muted overflow-hidden border border-white/5">
              {!imageLoaded && (
                <Skeleton className="absolute inset-0 rounded-2xl" />
              )}
              <div
                className={`absolute inset-0 bg-contain bg-center bg-no-repeat p-8 transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                style={{ backgroundImage: `url(${selectedImage || product.image})` }}
              />
              <img
                src={selectedImage || product.image}
                alt={product.title}
                className="hidden"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />
            </div>
            {(product.images && product.images.length > 1) && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { setSelectedImage(url); setImageLoaded(false); }}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-colors ${
                      (selectedImage || product.image) === url
                        ? "border-primary"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${url})` }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-3">
                {t("home.badge")}
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {product.title}
              </h1>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">
                {product.price.toLocaleString()} SYP
              </span>
              <Badge
                variant={product.stock > 0 ? "default" : "destructive"}
                className={`${
                  product.stock > 0
                    ? "bg-emerald-500/10 text-emerald-400"
                    : ""
                }`}
              >
                {product.stock > 0 ? t("product.inStock") : t("product.outOfStock")}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              {product.stock} {t("product.available")}
            </p>

            {product.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}

            <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
              <Button
                size="lg"
                disabled={product.stock === 0}
                onClick={handleAddToCart}
                className="bg-primary hover:bg-primary/90 text-white border-0 h-12 text-base"
              >
                <ShoppingCart className="h-5 w-5 ml-2" />
                {cartItem
                  ? t("product.inCart")
                  : t("product.addToCart")}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <Package className={`h-5 w-5 text-primary ${dir === "rtl" ? "ml-3" : "mr-3"}`} />
                <div>
                  <p className="text-xs font-medium text-foreground/80">{t("product.freeShipping")}</p>
                  <p className="text-[10px] text-muted-foreground">{t("product.freeShippingDesc")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <Shield className={`h-5 w-5 text-emerald-400 ${dir === "rtl" ? "ml-3" : "mr-3"}`} />
                <div>
                  <p className="text-xs font-medium text-foreground/80">{t("product.securePayment")}</p>
                  <p className="text-[10px] text-muted-foreground">{t("product.securePaymentDesc")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
