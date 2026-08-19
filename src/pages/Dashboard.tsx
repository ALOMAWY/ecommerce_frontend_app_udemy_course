import { useCallback, useEffect, useState, useRef } from "react";
import { useAuth } from "../context/Auth/AuthContext";
import { useLang } from "../i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Pencil, Trash2, Package, X, RefreshCw, Eye, Grid2X2, List, ImagePlus } from "lucide-react";
import { BASE_URL } from "../constants/baseurl";
import type { IProductProps } from "../types/product";

const Dashboard = () => {
  const { token } = useAuth();
  const { dir, t, lang, formatNumber, formatPrice } = useLang();
  const [products, setProducts] = useState<IProductProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", category: "", image: "", price: "", stock: "100" });
  const [images, setImages] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/product/all`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      toast.error(t("dashboard.loadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const uploadFiles = async (files: FileList): Promise<string[]> => {
    setUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }
      const res = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      return data.urls || [];
    } catch {
      toast.error(t("dashboard.uploadError"));
      return [];
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const urls = await uploadFiles(files);
    setImages((prev) => [...prev, ...urls]);
    if (!form.image && urls.length > 0) {
      setForm((prev) => ({ ...prev, image: urls[0] }));
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    const removed = images[index];
    setImages((prev) => prev.filter((_, i) => i !== index));
    if (form.image === removed) {
      setForm((prev) => ({ ...prev, image: images[0] || "" }));
    }
  };

  const resetForm = () => {
    setForm({ title: "", description: "", category: "", image: "", price: "", stock: "100" });
    setImages([]);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.stock) {
      toast.error(t("dashboard.required"));
      return;
    }
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        title: form.title,
        description: form.description,
        category: form.category,
        image: form.image || (images.length > 0 ? images[0] : ""),
        images,
        price: Number(form.price),
        stock: Number(form.stock),
      };
      const url = editingId
        ? `${BASE_URL}/product/${editingId}`
        : `${BASE_URL}/product`;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers, body: JSON.stringify(body) });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save product");
      }
      toast.success(editingId ? t("dashboard.updated") : t("dashboard.created"));
      resetForm();
      fetchProducts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("dashboard.saveError"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product: IProductProps) => {
    setForm({
      title: product.title,
      description: product.description || "",
      category: product.category || "",
      image: product.image,
      price: String(product.price),
      stock: String(product.stock),
    });
    setImages(product.images || []);
    setEditingId(product._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("dashboard.deleteConfirm"))) return;
    try {
      const res = await fetch(`${BASE_URL}/product/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error("Failed to delete product");
      toast.success(t("dashboard.deleted"));
      fetchProducts();
    } catch {
      toast.error(t("dashboard.deleteError"));
    }
  };

  return (
    <div className="dashboard-shell flex-1 p-4 sm:p-6" style={{ direction: dir }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-[1.25rem] bg-primary shadow-lg shadow-primary/25">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {editingId ? t("dashboard.editTitle") : t("dashboard.title")}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {editingId
                ? t("dashboard.editSubtitle")
                : t("dashboard.subtitle")}
            </p>
          </div>
        </div>

        <Card className="dashboard-surface mb-8 p-5 sm:p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  {t("dashboard.productTitle")}
                </Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder={t("dashboard.titlePlaceholder")}
                  className="h-11"
                />
              </div>
              <div className="flex flex-col gap-2">
<Label htmlFor="category" className="text-sm font-medium">{t("dashboard.category")}</Label>
                <Input id="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder={t("dashboard.categoryPlaceholder")} className="h-11" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  {t("dashboard.description")}
                </Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder={t("dashboard.descriptionPlaceholder")}
                  className="min-h-[80px]"
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label className="text-sm font-medium">
                  {t("dashboard.images")}
                </Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {images.map((url, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-[1.25rem] overflow-hidden border border-white/10 group">
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${url})` }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-0.5 right-0.5 w-5 h-5 bg-destructive/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="h-11 w-full sm:w-auto"
                  >
                    <ImagePlus className="h-4 w-4 ml-2" />
                    {uploading ? t("dashboard.uploading") : t("dashboard.upload")}
                  </Button>
                  <Input id="image" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder={t("dashboard.imageUrlPlaceholder")} className="h-11 flex-1" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="price" className="text-sm font-medium">
                  {t("dashboard.price")}
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="1"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="25,000"
                  inputMode="decimal"
                  className="h-11 pl-16"
                />
                <span className="pointer-events-none relative -mt-[2.25rem] mb-[1.25rem] ml-3 w-fit text-xs font-bold text-muted-foreground">{lang === "ar" ? "ل.س" : "SYP"}</span>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="stock" className="text-sm font-medium">
                  {t("dashboard.stock")}
                </Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="100"
                  className="h-11"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-primary hover:bg-primary/90 text-white border-0"
              >
                {submitting
                  ? t("dashboard.saving")
                  : editingId
                    ? t("dashboard.update")
                    : t("dashboard.add")}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={resetForm}
                  className="text-muted-foreground"
                >
                  <X className="h-4 w-4 ml-2" />
                  {t("dashboard.cancel")}
                </Button>
              )}
            </div>
          </form>
        </Card>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">
            {t("dashboard.allProducts")} ({products.length})
          </h2>
          <div className="flex items-center gap-2">
<div className="dashboard-toggle flex items-center gap-1 rounded-full p-1">
              <button type="button" aria-label={t("dashboard.gridView")} onClick={() => setView("grid")} className={`rounded-full p-2 ${view === "grid" ? "dashboard-toggle-active" : "text-muted-foreground"}`}><Grid2X2 className="h-4 w-4" /></button>
              <button type="button" aria-label={t("dashboard.listView")} onClick={() => setView("list")} className={`rounded-full p-2 ${view === "list" ? "dashboard-toggle-active" : "text-muted-foreground"}`}><List className="h-4 w-4" /></button>
            </div>
            <Button variant="ghost" size="sm" onClick={fetchProducts} className="text-muted-foreground"><RefreshCw className="h-4 w-4 ml-2" />{t("dashboard.refresh")}</Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-white/10">
            <Package className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">
              {t("dashboard.noProducts")}
            </p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              {t("dashboard.addFirst")}
            </p>
          </Card>
        ) : (
          <div className={view === "grid" ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" : "space-y-2"}>
            {products.map((product) => (
              <Card
                key={product._id}
                className={`dashboard-product group relative border-white/5 transition-colors ${view === "grid" ? "overflow-hidden p-0" : "flex items-center gap-4 p-4"}`}
              >
                <div className={`${view === "grid" ? "aspect-[1.35/1] w-full" : "h-14 w-14"} rounded-[1.25rem] bg-muted/50 flex-shrink-0 overflow-hidden`}>
                  {product.image ? (
                    <div
                      className="w-full h-full bg-contain bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${product.image})` }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
                      <Package className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className={`${view === "grid" ? "p-4 pb-3" : "flex-1"} min-w-0`}>
                  <p className="font-medium text-sm truncate">
                    {product.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatPrice(product.price)} &middot;{" "}
                    {formatNumber(product.stock)} {t("dashboard.inStock")}
                  </p>
                  {view === "grid" && <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{product.description || t("dashboard.noDescription")}</p>}
                </div>
                <div className={`${view === "grid" ? "border-t border-white/5 px-3 py-2" : ""} flex items-center justify-end gap-1 flex-shrink-0`}>
                  <Button variant="ghost" size="icon" onClick={() => window.open(`/product/${product._id}`, "_blank")} className="h-9 w-9 text-muted-foreground hover:text-foreground" aria-label={t("dashboard.viewDetails")}><Eye className="h-4 w-4" /></Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(product)}
                    className="h-9 w-9 text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(product._id)}
                    className="h-9 w-9 text-destructive/70 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
