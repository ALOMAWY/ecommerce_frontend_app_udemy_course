import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth/AuthContext";
import { useLang } from "../i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingCart, ChevronDown, Hexagon, Globe } from "lucide-react";
import { useCart } from "../context/Cart/CartContext";

function Navbar() {
  const navigate = useNavigate();
  const { username, isAuthenticated, logout } = useAuth();
  const { t, lang, setLang } = useLang();
  const { cartItems, totalAmount } = useCart();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600">
            <Hexagon className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            TechHub
          </span>
        </div>

        <nav className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <Globe className="h-3.5 w-3.5" />
            {lang === "ar" ? "EN" : "AR"}
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ShoppingCart className="h-4 w-4" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-violet-500 rounded-full">
                {cartItems.length}
              </span>
            )}
            <span className="hidden sm:inline text-xs">
              {totalAmount > 0 ? `${totalAmount.toLocaleString()} SYP` : ""}
            </span>
          </button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-sm font-medium text-foreground/80 hover:text-foreground">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-xs font-bold text-white">
                  {(username || "U").charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline">{username || t("nav.products")}</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align={lang === "ar" ? "start" : "end"} className="mt-2 min-w-[160px]">
                <DropdownMenuItem onClick={() => navigate("/")}>
                  {t("nav.products")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/cart")}>
                  {t("nav.cart")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/orders")}>
                  {t("nav.orders")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  {t("nav.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="text-foreground/70 hover:text-foreground"
              >
                {t("nav.signin")}
              </Button>
              <Button
                onClick={() => navigate("/register")}
                className="bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:from-violet-600 hover:to-fuchsia-700 text-white border-0 shadow-lg shadow-violet-500/25"
              >
                {t("nav.signup")}
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
