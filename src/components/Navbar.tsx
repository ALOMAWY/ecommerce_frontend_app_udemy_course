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
import { ShoppingCart, ChevronDown, Hexagon, Globe, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/useTheme";
import { useCart } from "../context/Cart/CartContext";

function Navbar() {
  const navigate = useNavigate();
  const { username, isAuthenticated, logout } = useAuth();
  const { t, lang, setLang, formatNumber, formatPrice } = useLang();
  const { cartItems, totalAmount } = useCart();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[.07] bg-background/80 backdrop-blur-2xl">
      <div className="container mx-auto flex h-[4.5rem] items-center justify-between px-4 sm:px-6">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground shadow-[0_8px_30px_rgba(215,245,106,.18)]">
            <Hexagon className="h-5 w-5" />
          </div>
          <span className="text-[1.1rem] font-black tracking-[-.04em] text-foreground">
            TechHub
          </span>
        </div>

        <nav className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? t("nav.useLightTheme") : t("nav.useDarkTheme")}
            className="flex items-center justify-center h-9 w-9 rounded-full border border-white/[.07] bg-white/[.035] text-muted-foreground hover:bg-white/[.08] hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full border border-white/[.07] bg-white/[.035] hover:bg-white/[.08] text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <Globe className="h-3.5 w-3.5" />
            {lang === "ar" ? "EN" : "AR"}
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="relative flex items-center gap-1.5 px-3 py-2.5 rounded-full border border-white/[.07] bg-white/[.035] hover:bg-white/[.08] text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ShoppingCart className="h-4 w-4" />
            {cartItems.length > 0 && (
<span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-primary-foreground bg-primary rounded-full ring-4 ring-background">
                {formatNumber(cartItems.length)}
              </span>
            )}
            <span className="hidden sm:inline text-xs">
              {totalAmount > 0 ? formatPrice(totalAmount) : ""}
            </span>
          </button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-all text-sm font-medium text-foreground/80 hover:text-foreground">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
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
                className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-[0_8px_24px_rgba(215,245,106,.12)]"
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
