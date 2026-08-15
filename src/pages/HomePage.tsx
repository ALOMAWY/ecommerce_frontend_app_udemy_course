import { useCallback, useEffect, useState } from "react";
import Product from "../components/Product";
import { Skeleton } from "@/components/ui/skeleton";
import type { IProductProps } from "../types/product";
import { BASE_URL } from "../constants/baseurl";
import { useAuth } from "../context/Auth/AuthContext";
import { PRODUCTS_KEY } from "../context/Auth/AuthProvider";
import { useLang } from "../i18n/LanguageContext";
import { Zap, AlertCircle, RefreshCw, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

type SortKey = "newest" | "oldest" | "name" | "type" | "priceLow" | "priceHigh";
type ViewMode = "grid" | "list";

const HomePage = () => {
  const { setProductsInContext } = useAuth();
  const { t } = useLang();
  const [products, setProducts] = useState<IProductProps[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [view, setView] = useState<ViewMode>("grid");

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
    const list = [...products];
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
  }, [products, sortBy]);

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/10 mx-auto mb-4">
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
    <div className="flex-1">
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="container mx-auto px-6 py-12 md:py-16">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="text-xs font-medium uppercase tracking-widest text-primary/70">
              {t("home.badge")}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {t("home.title")}
          </h1>
          <p className="mt-2 text-muted-foreground max-w-xl">
            {t("home.subtitle")}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {!loading && (
          <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="h-9 rounded-lg border border-white/10 bg-card px-3 text-sm text-foreground/80 outline-none transition-colors focus-visible:border-ring cursor-pointer"
            >
              <option value="newest">{t("home.sortNewest")}</option>
              <option value="oldest">{t("home.sortOldest")}</option>
              <option value="name">{t("home.sortName")}</option>
              <option value="type">{t("home.sortType")}</option>
              <option value="priceLow">{t("home.sortPriceLow")}</option>
              <option value="priceHigh">{t("home.sortPriceHigh")}</option>
            </select>

            <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-card p-1">
              <button
                type="button"
                onClick={() => setView("grid")}
                aria-label={t("home.viewGrid")}
                className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
                  view === "grid"
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                aria-label={t("home.viewList")}
                className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
                  view === "list"
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3 rounded-2xl bg-card border border-white/5 overflow-hidden p-4">
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
        ) : (
          <div className="flex flex-col gap-4">
            {sortedProducts().map((product) => (
              <Product key={product._id} {...product} view="list" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
