import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth/AuthContext";
import { useLang } from "../i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { BASE_URL } from "../constants/baseurl";
import type { IUser } from "../types/user";

const Register = () => {
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
    const { firstName, lastName, email, password } = data;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      firstName.trim().length >= 2 &&
      lastName.trim().length >= 2 &&
      emailRegex.test(email) &&
      !loading &&
      password.length >= 8
    );
  };

  const getFieldErrors = () => {
    const errors: string[] = [];
    if (data.firstName.trim() && data.firstName.trim().length < 2)
      errors.push(t("register.nameShort"));
    if (data.lastName.trim() && data.lastName.trim().length < 2)
      errors.push(t("register.lastNameShort"));
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      errors.push(t("register.emailInvalid"));
    if (data.password && data.password.length < 8)
      errors.push(t("register.passwordShort"));
    return errors;
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const onSend = async (e: React.FormEvent) => {
    e.preventDefault();

    const fieldErrors = getFieldErrors();
    if (fieldErrors.length > 0) {
      const msg = fieldErrors[0];
      setError(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const msg = t("register.error");
        setError(msg);
        toast.error(msg);
        return;
      }

      const token = await response.json();
      if (!token) {
        const msg = t("register.errorGeneric");
        setError(msg);
        toast.error(msg);
        return;
      }

      login(data.email, token);
      setData({ firstName: "", lastName: "", email: "", password: "" });
      toast.success(t("register.success"));
      navigate("/");
    } catch {
      const msg = t("register.errorGeneric");
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
          <div className="flex items-center justify-center w-12 h-12 rounded-[1.25rem] bg-primary mb-4 shadow-lg shadow-primary/25">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{t("register.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("register.subtitle")}
          </p>
        </div>

        <form
          onSubmit={onSend}
          className="flex flex-col gap-5 p-6 rounded-[1.25rem] bg-card border border-white/5"
        >
          <div className="grid grid-cols-2 gap-4" style={{ direction: dir }}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="firstName" className="text-sm font-medium">
                {t("register.firstName")}
              </Label>
              <Input
                id="firstName"
                name="firstName"
                required
                value={data.firstName}
                onChange={onChange}
                placeholder={t("register.firstNamePlaceholder")}
                className="h-11"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="lastName" className="text-sm font-medium">
                {t("register.lastName")}
              </Label>
              <Input
                id="lastName"
                name="lastName"
                required
                value={data.lastName}
                onChange={onChange}
                placeholder={t("register.lastNamePlaceholder")}
                className="h-11"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-sm font-medium">
              {t("register.email")}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={data.email}
              onChange={onChange}
              placeholder={t("register.emailPlaceholder")}
              className="h-11"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-sm font-medium">
              {t("register.password")}
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={data.password}
                onChange={onChange}
                placeholder={t("register.passwordPlaceholder")}
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
            <p className="text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={!isFormValid()}
            className="w-full h-11 bg-primary hover:bg-primary/90 text-white border-0"
          >
            {loading ? t("register.creating") : t("register.create")}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {t("register.haveAccount")}{" "}
            <Link
              to={"/login"}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              {t("register.signin")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
