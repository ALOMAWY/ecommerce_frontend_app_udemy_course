import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/Auth/AuthContext";
import { useLang } from "../i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Pencil, Trash2, Package, X, RefreshCw, Upload } from "lucide-react";
import { BASE_URL } from "../constants/baseurl";
import type { IProductProps } from "../types/product";

const Dashboard = () => {
  const { token } = useAuth();
  const { dir } = useLang();
  const [products, setProducts] = useState<IProductProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", image: "", price: "", stock: "" });
  const [images, setImages] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/product/all`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
      toast.error("Failed to upload images");
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
    setForm({ title: "", description: "", image: "", price: "", stock: "" });
    setImages([]);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.stock) {
      toast.error("Title, price, and stock are required");
      return;
    }
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        title: form.title,
        description: form.description,
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
      toast.success(editingId ? "Product updated" : "Product created");
      resetForm();
      fetchProducts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product: IProductProps) => {
    setForm({
      title: product.title,
      description: product.description || "",
      image: product.image,
      price: String(product.price),
      stock: String(product.stock),
    });
    setImages(product.images || []);
    setEditingId(product._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${BASE_URL}/product/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error("Failed to delete product");
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="flex-1 p-6" style={{ direction: dir }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/25">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {editingId ? "Edit Product" : "Product Dashboard"}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {editingId
                ? "Update product details below"
                : "Manage your product inventory"}
            </p>
          </div>
        </div>

        <Card className="p-6 mb-8 border-white/5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Product Title
                </Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Enter product title"
                  className="h-11"
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Enter product description"
                  className="min-h-[80px]"
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label className="text-sm font-medium">
                  Images
                </Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {images.map((url, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10 group">
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
                <div className="flex gap-2">
                  <Input
                    id="image"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="Or paste image URL"
                    className="h-11 flex-1"
                  />
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
                    className="h-11"
                  >
                    <Upload className="h-4 w-4 ml-2" />
                    {uploading ? "Uploading..." : "Upload"}
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="price" className="text-sm font-medium">
                  Price (SYP)
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0.00"
                  className="h-11"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="stock" className="text-sm font-medium">
                  Stock Quantity
                </Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="0"
                  className="h-11"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:from-violet-600 hover:to-fuchsia-700 text-white border-0 shadow-lg shadow-violet-500/25"
              >
                {submitting
                  ? "Saving..."
                  : editingId
                    ? "Update Product"
                    : "Add Product"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={resetForm}
                  className="text-muted-foreground"
                >
                  <X className="h-4 w-4 ml-2" />
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            All Products ({products.length})
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchProducts}
            className="text-muted-foreground"
          >
            <RefreshCw className="h-4 w-4 ml-2" />
            Refresh
          </Button>
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
              No products yet
            </p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Add your first product using the form above
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {products.map((product) => (
              <Card
                key={product._id}
                className="flex items-center gap-4 p-4 border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="w-14 h-14 rounded-xl bg-muted/50 flex-shrink-0 overflow-hidden">
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
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {product.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {product.price.toLocaleString()} SYP &middot;{" "}
                    {product.stock} in stock
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
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
