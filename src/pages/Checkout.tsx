import { useNavigate } from "react-router-dom";
import { useCart } from "../context/Cart/CartContext";
import { useAuth } from "../context/Auth/AuthContext";
import { useLang } from "../i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";
import { BASE_URL } from "../constants/baseurl";
import { toast } from "sonner";
import { ShoppingCart, MapPin } from "lucide-react";
import type { ICartItem } from "../types/cart";

const Checkout = () => {
  const { cartItems, totalAmount, fetchOrders } = useCart();
  const { token } = useAuth();
  const { t, dir } = useLang();
  const navigate = useNavigate();

  const [error, setError] = useState<boolean>(false);
  const [address, setAddress] = useState("");

  const handleOrder = async () => {
    if (!address.trim()) {
      toast.error(t("checkout.addressRequired"));
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/cart/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address: address.trim() }),
      });

      if (!response.ok) {
        setError(true);
        const err = await response.json().catch(() => ({}));
        toast.error(err.message || t("error.generic"));
        return;
      }

      await response.json();
      toast.success(t("checkout.success"));
      navigate("/success_order");
      fetchOrders();
    } catch {
      setError(true);
      toast.error(t("error.generic"));
    }
  };

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="flex-1 p-4 md:p-6">
      <Card className="max-w-3xl mx-auto border-white/5 bg-card">
        <CardHeader>
          <div className="flex items-center justify-center gap-3">
            <ShoppingCart className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl text-center tracking-tight">
              {t("checkout.title")}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div
            className="grid grid-cols-3 gap-4 px-2 py-2 font-semibold text-xs text-muted-foreground uppercase tracking-wider"
            style={{ direction: dir }}
          >
            <span>{t("checkout.image")}</span>
            <span className="text-center">{t("checkout.title2")}</span>
            <span className={dir === "rtl" ? "text-left" : "text-right"}>{t("checkout.price")}</span>
          </div>
          <hr className="mb-2 border-white/5" />

          {cartItems.length > 0 &&
            cartItems.map(({ product }: ICartItem, idx: number) => {
              if (typeof product == "string") return null;

              return (
                <div
                  key={idx}
                  className="grid grid-cols-3 gap-4 items-center px-2 py-3 border-b border-white/5"
                  style={{ direction: dir }}
                >
                  <div
                    className="w-16 h-16 bg-contain bg-center bg-no-repeat rounded-xl bg-muted"
                    style={{ backgroundImage: `url(${product.image})` }}
                  />
                  <p className="text-center text-sm line-clamp-2">{product.title}</p>
                  <p className={`text-sm font-semibold ${dir === "rtl" ? "text-left" : "text-right"}`}>
                    {product.price.toLocaleString()} SYP
                  </p>
                </div>
              );
            })}

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2 mt-4">
              {t("error.generic")}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2">
            <p className="font-semibold text-foreground/80">
              {t("checkout.totalAmount")}:{" "}
              <span className="font-bold text-primary">
                {totalAmount.toFixed(2)} SYP
              </span>
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="address"
                  placeholder={t("checkout.address")}
                  value={address}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setAddress(e.target.value)
                  }
                  className="w-full pl-9"
                />
              </div>
              <Button
                onClick={handleOrder}
                disabled={!address.trim()}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white border-0"
              >
                {t("checkout.confirm")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Checkout;
