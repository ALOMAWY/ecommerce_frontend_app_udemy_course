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
import { ShoppingCart, ArrowLeft, Package, Shield, Check, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

const ProductPage = () => {
  const { id } = useParams();
  const { productsInContext, isAuthenticated } = useAuth();
  const { addItemToCart, cartItems } = useCart();
  const { t, tCategory, formatNumber, formatPrice } = useLang();
  const navigate = useNavigate();
  const [cartItem, setCartItem] = useState<ICartItem | undefined>();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    setCartItem(cartItems.find((item: ICartItem) => typeof item.product !== "string" && item.product._id == id));
  }, [cartItems, id]);

  if (!id) return null;

  const productsFromLocalStorage: IProductProps[] = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]");
  const product = productsFromLocalStorage.find((p) => p._id == id) || productsInContext?.find((p) => p._id == id);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    addItemToCart(id);
    toast.success(`"${product?.title}" ${t("product.addToCart")}`);
  };

  if (!product) {
    return <div className="flex flex-1 items-center justify-center"><div className="flex flex-col items-center gap-4"><Skeleton className="h-64 w-64 rounded-[1.6rem]" /><Skeleton className="h-6 w-48" /><Skeleton className="h-4 w-32" /></div></div>;
  }

  const activeImage = selectedImage || product.image;
  const gallery = product.images?.length ? product.images : [product.image];

  return (
    <div className="store-shell flex-1">
      <div className="container mx-auto px-4 py-6 sm:px-6 md:py-10">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 rounded-full border border-white/[.08] px-4 py-2 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> {t("back")}
        </button>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
          <section className="soft-surface overflow-hidden p-3 sm:p-5">
            <div className="product-image relative flex aspect-square items-center justify-center overflow-hidden rounded-[1.25rem] sm:aspect-[1.1/1]">
              <div className="absolute inset-x-5 top-5 z-[1] flex items-center justify-between text-[10px] font-bold uppercase tracking-[.2em] text-primary/80"><span>{tCategory(product.category) || t("product.techPick")}</span><span>{String(gallery.length).padStart(2, "0")} {t("product.views")}</span></div>
              {!imageLoaded && <Skeleton className="absolute inset-0 rounded-[1.25rem]" />}
              <div className={`absolute inset-0 bg-contain bg-center bg-no-repeat p-12 transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`} style={{ backgroundImage: `url(${activeImage})` }} />
              <img src={activeImage} alt={product.title} className="hidden" onLoad={() => setImageLoaded(true)} onError={() => setImageLoaded(true)} />
              <span className="absolute bottom-5 left-5 rounded-full border border-white/10 bg-background/70 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-md">{t("product.techHubProduct")}</span>
            </div>
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {gallery.map((url, i) => <button key={i} type="button" onClick={() => { setSelectedImage(url); setImageLoaded(false); }} className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-[1.25rem] border bg-muted transition-all ${activeImage === url ? "border-primary ring-2 ring-primary/20" : "border-white/10 hover:border-white/30"}`}><div className="absolute inset-0 bg-contain bg-center bg-no-repeat p-2" style={{ backgroundImage: `url(${url})` }} /></button>)}
            </div>
          </section>

          <section className="flex flex-col gap-6 lg:px-4 lg:pt-3">
            <div>
              <div className="mb-4 flex items-center justify-between gap-3"><Badge className="bg-primary/10 text-primary hover:bg-primary/20">{product.stock > 0 ? t("product.inStock") : t("product.outOfStock")}</Badge><span className="text-xs font-medium text-muted-foreground">{t("product.sku")} / {product._id.slice(-6).toUpperCase()}</span></div>
              <h1 className="max-w-2xl text-3xl font-bold leading-[1.08] tracking-[-.04em] text-foreground sm:text-5xl">{product.title}</h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">{product.description || t("product.fallbackDescription")}</p>
            </div>

            <div className="flex items-end justify-between gap-4 border-y border-white/[.08] py-5"><div><p className="mb-1 text-xs uppercase tracking-[.16em] text-muted-foreground">{t("product.price")}</p><p className="text-3xl font-bold tracking-tight text-primary">{formatPrice(product.price)}</p></div><div className="text-right"><p className="text-xs text-muted-foreground">{formatNumber(product.stock)} {t("product.available")}</p><p className="mt-1 flex items-center justify-end gap-1 text-xs font-semibold text-emerald-400"><Check className="h-3.5 w-3.5" /> {t("product.readyToShip")}</p></div></div>

            <Button size="lg" disabled={product.stock === 0} onClick={handleAddToCart} className="h-14 w-full bg-primary text-base font-bold text-primary-foreground shadow-[0_14px_35px_rgba(215,245,106,.12)] hover:bg-primary/90"><ShoppingCart className="h-5 w-5" />{cartItem ? t("product.inCart") : t("product.addToCart")}<ArrowUpRight className="ml-auto h-5 w-5" /></Button>

            <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-[1.25rem] border border-white/[.08] bg-white/[.035] p-4"><Package className="mb-5 h-5 w-5 text-primary" /><p className="text-sm font-semibold">{t("product.freeShipping")}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t("product.freeShippingDesc")}</p></div><div className="rounded-[1.25rem] border border-white/[.08] bg-white/[.035] p-4"><Shield className="mb-5 h-5 w-5 text-primary" /><p className="text-sm font-semibold">{t("product.securePayment")}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t("product.securePaymentDesc")}</p></div></div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
