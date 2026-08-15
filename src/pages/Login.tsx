import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth/AuthContext";
import { useLang } from "../i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { BASE_URL } from "../constants/baseurl";
import type { IUser } from "../types/user";

const Login = () => {
  const [data, setData] = useState<IUser>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const { t, dir } = useLang();

  const isFormValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(data.email) && !loading && data.password.length >= 8;
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const onSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errMsg = response.status === 401
          ? t("login.error")
          : t("login.errorGeneric");
        setError(errMsg);
        toast.error(errMsg);
        return;
      }

      const token = await response.json();
      if (!token) {
        setError(t("login.errorGeneric"));
        toast.error(t("login.errorGeneric"));
        return;
      }

      login(data.email, token);
      toast.success("Welcome back!");
      navigate("/");
    } catch {
      const msg = t("login.errorGeneric");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 mb-4 shadow-lg shadow-violet-500/25">
            <LogIn className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{t("login.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("login.subtitle")}
          </p>
        </div>

        <form
          onSubmit={onSend}
          className="flex flex-col gap-5 p-6 rounded-2xl bg-card border border-white/5"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-sm font-medium">
              {t("login.email")}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={data.email}
              onChange={onChange}
              placeholder="you@example.com"
              className="h-11"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-sm font-medium">
              {t("login.password")}
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={data.password}
                onChange={onChange}
                placeholder="••••••••"
                autoComplete="current-password"
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

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={!isFormValid()}
            className="w-full h-11 bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:from-violet-600 hover:to-fuchsia-700 text-white border-0 shadow-lg shadow-violet-500/25"
          >
            {loading ? t("login.signing") : t("login.signin")}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {t("login.noAccount")}{" "}
            <Link
              to={"/register"}
              className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              {t("login.createOne")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
