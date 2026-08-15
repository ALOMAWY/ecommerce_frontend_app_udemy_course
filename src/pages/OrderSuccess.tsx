import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { t } = useLang();

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
      <div className="flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500/10">
        <CircleCheck className="text-emerald-400" size={56} />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">{t("success.title")}</h1>
      <p className="text-muted-foreground text-center max-w-md">
        {t("success.subtitle")}
      </p>
      <Button
        onClick={() => navigate("/")}
        className="bg-primary hover:bg-primary/90 text-white border-0"
      >
        {t("success.home")}
      </Button>
    </div>
  );
};

export default OrderSuccess;
