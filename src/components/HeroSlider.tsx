import { useEffect, useState } from "react";
import { useLang } from "../i18n/LanguageContext";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Truck,
  Zap,
} from "lucide-react";

type SlideIcon = "sparkles" | "zap" | "truck";

interface HeroSlide {
  badge: string;
  icon: SlideIcon;
  title: string;
  subtitle: string;
}

const ICON_STYLE =
  "h-20 w-20 text-primary drop-shadow-[0_0_28px_rgba(255,101,0,.35)]";

const renderIcon = (icon: SlideIcon) => {
  switch (icon) {
    case "sparkles":
      return <Sparkles className={ICON_STYLE} />;
    case "truck":
      return <Truck className={ICON_STYLE} />;
    default:
      return <Zap className={ICON_STYLE} />;
  }
};

const renderBadgeIcon = (icon: SlideIcon) => {
  switch (icon) {
    case "sparkles":
      return <Sparkles className="h-4 w-4" />;
    case "truck":
      return <Truck className="h-4 w-4" />;
    default:
      return <Zap className="h-4 w-4" />;
  }
};

const HeroSlider = () => {
  const { t } = useLang();
  const [index, setIndex] = useState(0);

  const slides: HeroSlide[] = [
    {
      badge: t("home.badge"),
      icon: "sparkles",
      title: t("home.title"),
      subtitle: t("home.subtitle"),
    },
    {
      badge: t("home.slide2Badge"),
      icon: "zap",
      title: t("home.slide2Title"),
      subtitle: t("home.slide2Subtitle"),
    },
    {
      badge: t("home.slide3Badge"),
      icon: "truck",
      title: t("home.slide3Title"),
      subtitle: t("home.slide3Subtitle"),
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goTo = (i: number) => {
    setIndex((i + slides.length) % slides.length);
  };

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative overflow-hidden border-b border-white/[.07] hero-glow">
      <div className="container mx-auto px-4 py-12 sm:px-6 md:py-16">
        <div className="relative min-h-[24rem]">
          {slides.map((slide, i) => {
            const active = i === index;
            return (
              <div
                key={i}
                aria-hidden={!active}
                className={`absolute inset-0 grid grid-cols-1 items-center gap-10 transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] md:grid-cols-[1.1fr_.9fr] ${
                  active
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-6 opacity-0"
                }`}
              >
                <div>
                  <div className="mb-5 flex items-center gap-2 text-primary">
                    {renderBadgeIcon(slide.icon)}
                    <span className="text-[11px] font-bold uppercase tracking-[.22em]">
                      {slide.badge}
                    </span>
                  </div>
                  <h1 className="max-w-xl text-4xl font-black leading-[.98] tracking-[-.06em] text-foreground sm:text-5xl md:text-6xl">
                    {slide.title}
                  </h1>
                  <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
                    {slide.subtitle}
                  </p>
                  <button
                    type="button"
                    onClick={scrollToProducts}
                    className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-[0_12px_30px_rgba(255,101,0,.18)] hover:bg-primary/90"
                  >
                    {t("home.shopNow")}
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="hidden md:block">
                  <div className="relative ml-auto max-w-[23rem] rotate-[-3deg] rounded-[2rem] border border-white/10 bg-[#101718]/80 p-5 shadow-2xl shadow-black/30">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{t("home.artLabel")}</span>
                      <ArrowUpRight className="h-4 w-4 text-primary" />
                    </div>
                    <div className="my-8 flex items-center justify-center rounded-[1.25rem] bg-[#202a2a] py-8">
                      {renderIcon(slide.icon)}
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {slide.badge}
                        </p>
                        <p className="mt-1 text-xl font-bold">{slide.title}</p>
                      </div>
                      <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`${t("home.goToSlide")} ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-8 bg-primary"
                    : "w-2 bg-foreground/20 hover:bg-foreground/40"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={t("home.prevSlide")}
              onClick={() => goTo(index - 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[.035] text-muted-foreground hover:bg-white/[.08] hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label={t("home.nextSlide")}
              onClick={() => goTo(index + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[.035] text-muted-foreground hover:bg-white/[.08] hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;