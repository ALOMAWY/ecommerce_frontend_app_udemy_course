import { useCart } from "../context/Cart/CartContext";
import { useLang } from "../i18n/LanguageContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PackageOpen, ClipboardList } from "lucide-react";
import type { IOrderItem } from "../types/order";

const Orders = () => {
  const { orders } = useCart();
  const { t, dir } = useLang();

  return (
    <div className="flex-1 p-4 md:p-6">
      <Card className="max-w-3xl mx-auto border-white/5 bg-card">
        <CardHeader>
          <div className="flex items-center justify-center gap-3">
            <ClipboardList className="h-6 w-6 text-violet-400" />
            <CardTitle className="text-2xl text-center tracking-tight">
              {t("orders.title")}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-card border border-white/5 mb-4">
                <PackageOpen className="h-10 w-10 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-lg">
                {t("orders.empty")}
              </p>
            </div>
          ) : (
            orders.map((order, index) => (
              <div key={index} className="mb-8 last:mb-0">
                <div
                  className="grid grid-cols-3 gap-4 px-2 py-2 font-semibold text-xs text-muted-foreground uppercase tracking-wider"
                  style={{ direction: dir }}
                >
                  <span>{t("orders.image")}</span>
                  <span className="text-center">{t("orders.title2")}</span>
                  <span className={dir === "rtl" ? "text-left" : "text-right"}>{t("orders.price")}</span>
                </div>
                <hr className="mb-2 border-white/5" />

                {order.orderItems.map((item: IOrderItem, idx: number) => (
                  <div
                    key={idx}
                    className="grid grid-cols-3 gap-4 items-center px-2 py-3 border-b border-white/5"
                    style={{ direction: dir }}
                  >
                    <div
                      className="w-16 h-16 bg-contain bg-center bg-no-repeat rounded-xl bg-muted"
                      style={{
                        backgroundImage: `url(${item.productImage})`,
                      }}
                    />
                    <p className="text-center text-sm line-clamp-2">
                      {item.productTitle}
                    </p>
                    <p className={`text-sm font-semibold ${dir === "rtl" ? "text-left" : "text-right"}`}>
                      {item.quantity} x {item.unitprice.toLocaleString()} SYP
                    </p>
                  </div>
                ))}

                <div
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-4 px-2"
                  style={{ direction: dir }}
                >
                  <p className="font-semibold text-foreground/80">
                    {t("orders.totalAmount")}:{" "}
                    <span className="font-bold text-violet-400">
                      {order.total.toFixed(2)} SYP
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("orders.address")}: {order.address}
                  </p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
