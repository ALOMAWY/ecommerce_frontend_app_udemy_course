import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLang } from "../i18n/LanguageContext";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useLang();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center w-20 h-20 rounded-[1.25rem] bg-destructive/10 mx-auto mb-6">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold mb-3 text-foreground">{t("notFound.title")}</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {t("notFound.subtitle")}
        </p>
        <Button onClick={() => navigate("/")} className="rounded-full">
          <Home className="h-4 w-4 mr-2" />
          {t("notFound.goHome")}
        </Button>
      </div>
    </div>
  );
};

export default NotFound;