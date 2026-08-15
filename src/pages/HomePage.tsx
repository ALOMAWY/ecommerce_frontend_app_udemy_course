import { useCallback, useEffect, useState } from "react";
import Product from "../components/Product";
import { Skeleton } from "@/components/ui/skeleton";
import type { IProductProps } from "../types/product";
import { BASE_URL } from "../constants/baseurl";
import { useAuth } from "../context/Auth/AuthContext";
import { PRODUCTS_KEY } from "../context/Auth/AuthProvider";
import { useLang } from "../i18n/LanguageContext";
import { Zap, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const { setProductsInContext } = useAuth();
  const { t } = useLang();
  const [products, setProducts] = useState<IProductProps[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

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

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/10 mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <p className="text-lg font-semibold mb-2">{t("error.generic")}</p>
          <p className="text-sm text-muted-foreground mb-6">
            Could not load products. Check your connection.
          </p>
          <Button
            onClick={fetchData}
            className="bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white border-0"
          >
            <RefreshCw className="h-4 w-4 ml-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5" />
        <div className="container mx-auto px-6 py-12 md:py-16">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="h-5 w-5 text-violet-400" />
            <span className="text-xs font-medium uppercase tracking-widest text-violet-400/70">
              {t("home.badge")}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
            {t("home.title")}
          </h1>
          <p className="mt-2 text-muted-foreground max-w-xl">
            {t("home.subtitle")}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product) => (
              <Product key={product._id} {...product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
