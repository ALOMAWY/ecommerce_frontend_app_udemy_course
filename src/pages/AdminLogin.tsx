import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/Auth/AuthContext";
import { useLang } from "../i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { BASE_URL } from "../constants/baseurl";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { adminLogin } = useAuth();
  const { t, dir } = useLang();

  const from =
    (location.state as { from?: { pathname?: string } })?.from?.pathname ||
    "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error(t("admin.required"));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(err.error || t("admin.invalid"));
      }
      const data = await res.json();
      adminLogin(data.email, data.token);
      toast.success(t("admin.welcome"));
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("admin.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-[1.25rem] bg-amber-600 mb-4 shadow-lg shadow-amber-600/25">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{t("admin.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("admin.subtitle")}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 p-6 rounded-[1.25rem] bg-card border border-white/5"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-sm font-medium">
              {t("admin.email")}
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("admin.emailPlaceholder")}
              className="h-11"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-sm font-medium">
              {t("admin.password")}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 pr-10"
                style={dir === "rtl" ? { paddingRight: "0.75rem", paddingLeft: "2.5rem" } : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors ${
                  dir === "rtl" ? "left-3 right-auto" : "right-3"
                }`}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-amber-600 hover:bg-amber-700 text-white border-0"
          >
            {loading ? t("admin.signingIn") : t("admin.signInAs")}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
