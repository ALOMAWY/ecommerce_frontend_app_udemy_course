import { useCallback, useEffect, useState } from "react";
import Product from "../components/Product";
import HeroSlider from "../components/HeroSlider";
import { Skeleton } from "@/components/ui/skeleton";
import type { IProductProps } from "../types/product";
import { BASE_URL } from "../constants/baseurl";
import { useAuth } from "../context/Auth/AuthContext";
import { PRODUCTS_KEY } from "../context/Auth/AuthProvider";
import { useLang } from "../i18n/LanguageContext";
import { Zap, AlertCircle, RefreshCw, LayoutGrid, List, ShieldCheck, Truck, Images, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

type SortKey = "newest" | "oldest" | "name" | "type" | "priceLow" | "priceHigh";
type ViewMode = "grid" | "list" | "gallery";

const HomePage = () => {
  const { setProductsInContext } = useAuth();
  const { t, tCategory } = useLang();
  const [products, setProducts] = useState<IProductProps[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [view, setView] = useState<ViewMode>("grid");
  const [category, setCategory] = useState("all");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(BASE_URL + "/product/all");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.data || [];
      setProducts(list);
      setProductsInContext(list);
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(list));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [setProductsInContext]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const sortedProducts = useCallback(() => {
    const list = products.filter((product) => category === "all" || product.category?.toLowerCase() === category);
    switch (sortBy) {
      case "oldest":
        return list.sort(
          (a, b) =>
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime()
        );
      case "name":
        return list.sort((a, b) => a.title.localeCompare(b.title));
      case "type":
        return list.sort((a, b) =>
          (a.category || "").localeCompare(b.category || "")
        );
      case "priceLow":
        return list.sort((a, b) => a.price - b.price);
      case "priceHigh":
        return list.sort((a, b) => b.price - a.price);
      default:
        return list.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );
    }
  }, [products, sortBy, category]);

  const categories = Array.from(new Set(products.map((product) => product.category?.trim()).filter(Boolean))) as string[];

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="flex items-center justify-center w-16 h-16 rounded-[1.25rem] bg-destructive/10 mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <p className="text-lg font-semibold mb-2">{t("error.generic")}</p>
          <p className="text-sm text-muted-foreground mb-6">
            {t("home.loadError")}
          </p>
          <Button
            onClick={fetchData}
            className="bg-primary hover:bg-primary/90 text-white border-0"
          >
            <RefreshCw className="h-4 w-4 ml-2" />
            {t("home.retry")}
          </Button>
        </div>
      </div>
    );
  }

return (
    <div className="store-shell flex-1">
      <HeroSlider />

      <div className="container mx-auto px-4 py-8 sm:px-6 md:py-10" id="products">
        <div className="mb-8 grid grid-cols-1 gap-3 border-b border-white/[.07] pb-7 sm:grid-cols-3">
          {[{ icon: Truck, title: t("product.freeShipping"), desc: t("product.freeShippingDesc") }, { icon: ShieldCheck, title: t("product.securePayment"), desc: t("product.securePaymentDesc") }, { icon: Zap, title: t("home.curatedTech"), desc: t("home.curatedDesc") }].map(({ icon: Icon, title, desc }) => <div key={title} className="flex items-center gap-3"><Icon className="h-5 w-5 text-primary" /><div><p className="text-sm font-semibold">{title}</p><p className="text-xs text-muted-foreground">{desc}</p></div></div>)}
        </div>
        {!loading && (
          <>
            <div className="mb-5 flex items-center gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
<span className="flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-muted-foreground"><SlidersHorizontal className="h-4 w-4" /> {t("home.browse")}</span>
              <button type="button" onClick={() => setCategory("all")} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${category === "all" ? "border-primary bg-primary text-primary-foreground shadow-[0_8px_20px_rgba(215,245,106,.12)]" : "border-white/10 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}>{t("home.allProducts")}</button>
              {categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item.toLowerCase())} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold capitalize transition-all ${category === item.toLowerCase() ? "border-primary bg-primary text-primary-foreground shadow-[0_8px_20px_rgba(215,245,106,.12)]" : "border-white/10 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}>{tCategory(item)}</button>)}
            </div>
            <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)} className="h-10 rounded-full border border-white/10 bg-card px-3 text-sm text-foreground/80 outline-none transition-colors focus-visible:border-ring cursor-pointer">
                <option value="newest">{t("home.sortNewest")}</option><option value="oldest">{t("home.sortOldest")}</option><option value="name">{t("home.sortName")}</option><option value="type">{t("home.sortType")}</option><option value="priceLow">{t("home.sortPriceLow")}</option><option value="priceHigh">{t("home.sortPriceHigh")}</option>
              </select>
              <div className="flex items-center gap-1 rounded-full border border-white/10 bg-card p-1.5 shadow-sm">
                <button type="button" onClick={() => setView("grid")} aria-label={t("home.viewGrid")} className={`flex h-9 w-10 items-center justify-center rounded-full transition-all ${view === "grid" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><LayoutGrid className="h-4 w-4" /></button>
                <button type="button" onClick={() => setView("list")} aria-label={t("home.viewList")} className={`flex h-9 w-10 items-center justify-center rounded-full transition-all ${view === "list" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><List className="h-4 w-4" /></button>
                <button type="button" onClick={() => setView("gallery")} aria-label={t("home.galleryView")} className={`flex h-9 w-10 items-center justify-center rounded-full transition-all ${view === "gallery" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><Images className="h-4 w-4" /></button>
              </div>
            </div>
          </>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3 rounded-[1.25rem] bg-card border border-white/5 overflow-hidden p-4">
                <Skeleton className="aspect-[4/3] w-full rounded-xl bg-muted" />
                <Skeleton className="h-4 w-3/4 bg-muted" />
                <Skeleton className="h-4 w-1/2 bg-muted" />
                <Skeleton className="h-9 w-full rounded-xl bg-muted mt-2" />
              </div>
            ))}
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {sortedProducts().map((product) => (
              <Product key={product._id} {...product} view="grid" />
            ))}
          </div>
        ) : view === "list" ? (
          <div className="flex flex-col gap-4">
            {sortedProducts().map((product) => (
              <Product key={product._id} {...product} view="list" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {sortedProducts().map((product) => <Product key={product._id} {...product} view="gallery" />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
