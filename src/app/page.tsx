import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { BELTS } from "@/lib/belt-system";
import { CHARACTERS } from "@/lib/characters";
import { CharacterPreview } from "@/components/character/character-avatar";
import { LandingLanguageSwitcher } from "@/components/landing-language-switcher";

export default async function LandingPage() {
  const t = await getTranslations("landing");
  const common = await getTranslations("common");

  const features = [
    { image: "/images/b1.jpg", titleKey: "0" },
    { image: "/images/b2.jpg", titleKey: "1" },
    { image: "/images/b3.jpg", titleKey: "2" },
    { image: "/images/b4.jpg", titleKey: "3" },
  ];

  const stats = [
    { value: "6", labelKey: "parts" },
    { value: "30", labelKey: "chapters" },
    { value: "10+", labelKey: "projects" },
  ];

  const whyVibeCodingImages = [
    "/images/a1.jpg",
    "/images/a2.jpg",
    "/images/a3.jpg",
    "/images/a4.jpg",
  ];

  const projectKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117]">
      {/* GitHub Dark Header */}
      <header className="sticky top-0 z-50 w-full bg-[#010409]/95 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 group">
            <Icons.vibedojoSymbol className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-lg tracking-tighter font-black text-[#e6edf3] group-hover:text-[#daa520] transition-colors">
              VibeDojo
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <LandingLanguageSwitcher />
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-md h-8 px-4 text-xs text-[#c9d1d9] bg-[#1c2128] border-0 hover:bg-[#262c36] hover:text-[#e6edf3] shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-all duration-300"
            >
              <Link href="/login">{common("login")}</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="rounded-md h-8 px-5 text-xs font-bold bg-[#daa520] text-[#0d1117] hover:bg-[#e6b82e] border-0 transition-all duration-300"
            >
              <Link href="/signup">{common("signup")}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - GitHub Dark Style */}
      <section className="relative overflow-hidden">
        {/* Background layers */}
        <div className="relative w-full overflow-hidden aspect-[4/5] sm:aspect-[4/3.5] md:aspect-[16/10] lg:aspect-[16/9.5] xl:aspect-[16/8.1]">
          <video
            src="/images/bg.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover object-bottom animate-slow-zoom saturate-[0.85] contrast-[1.05] brightness-[1.15]"
          />
          {/* Dark overlays - 텍스트 가독성 개선 */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1117]/95 via-[#0d1117]/65 to-[#0d1117]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/35 to-transparent" />
          {/* Vignette effect */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(13,17,23,0.35)_70%,rgba(13,17,23,0.65)_100%)]" />
          {/* Subtle noise texture */}
          <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay" />
          {/* Amber accent light */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#daa520]/10 via-transparent to-[#58a6ff]/5" />
        </div>

        {/* Decorative Kanji */}
        <div className="absolute top-1/2 right-10 -translate-y-1/2 text-[150px] sm:text-[200px] font-serif text-[#daa520]/10 pointer-events-none select-none leading-none animate-float-up opacity-0 drop-shadow-[0_0_40px_rgba(240,180,41,0.2)]" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
          道
        </div>

        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto max-w-5xl w-full px-5 sm:px-16 md:px-20 lg:px-28 xl:px-32">
            <div className="max-w-lg lg:max-w-xl relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#1c2128] text-[#daa520] text-xs sm:text-sm font-medium mb-4 sm:mb-3 lg:mb-4 backdrop-blur-sm rounded-md shadow-[0_2px_8px_rgba(0,0,0,0.3)] animate-float-up opacity-0 stagger-1" style={{ animationFillMode: 'forwards' }}>
                <span className="w-1.5 h-1.5 bg-[#3fb950] rounded-full animate-pulse" />
                {t("hero.badge")}
              </div>

              {/* Title */}
              <h1 className="text-[1.65rem] sm:text-[2.125rem] md:text-[2.5rem] lg:text-[2.875rem] font-black tracking-tight mb-5 sm:mb-4 lg:mb-5 leading-snug sm:leading-tight animate-float-up opacity-0 stagger-2" style={{ animationFillMode: 'forwards' }}>
                <span className="text-[#c9d1d9]">{t("hero.title1")}</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#daa520] via-[#e6b82e] to-[#daa520] break-keep">
                  {t("hero.title2")}
                </span>
                <br />
                <span className="text-[#a8b2bd]">{t("hero.title3")}</span>
              </h1>

              <p className="text-[13px] sm:text-[15px] md:text-[15px] text-[#a8b2bd] mb-6 sm:mb-5 lg:mb-6 max-w-lg leading-relaxed animate-float-up opacity-0 stagger-3" style={{ animationFillMode: 'forwards' }}>
                <span className="whitespace-nowrap">{t("hero.description1")}</span>
                <br />
                <span className="whitespace-nowrap"><span className="text-[#daa520] font-semibold">{t("hero.description2")}</span>{t("hero.description3")}</span>
                <span className="hidden md:inline">
                  <br /><br />
                  <span className="whitespace-nowrap"><span className="text-[#c9d1d9] font-medium">{t("hero.description4")}</span>{t("hero.description5")}<span className="text-[#c9d1d9] font-medium">{t("hero.description6")}</span>{t("hero.description7")}</span>
                  <br />
                </span>
                <br className="md:hidden" />
                <span className="whitespace-nowrap"><span className="text-[#58a6ff] font-medium">{t("hero.description8")}</span>{t("hero.description9")}</span>
              </p>

              <div className="flex flex-row gap-2 sm:gap-3 mb-6 sm:mb-6 lg:mb-8 animate-float-up opacity-0 stagger-4" style={{ animationFillMode: 'forwards' }}>
                <Button
                  asChild
                  size="default"
                  className="rounded-md h-9 sm:h-10 lg:h-11 px-4 sm:px-5 lg:px-6 text-xs sm:text-sm font-bold bg-[#daa520] text-[#0d1117] hover:bg-[#e6b82e] border-0 justify-center transition-all duration-300"
                >
                  <Link href="/signup">
                    {t("hero.cta")}
                    <Icons.chevronRight className="ml-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="default"
                  className="rounded-md h-9 sm:h-10 lg:h-11 px-4 sm:px-5 lg:px-6 text-xs sm:text-sm font-medium bg-[#1c2128]/90 backdrop-blur-sm border-0 text-[#c9d1d9] hover:bg-[#262c36] hover:text-[#e6edf3] justify-center shadow-[0_2px_6px_rgba(0,0,0,0.3)] transition-all duration-300"
                >
                  <Link href="/courses">
                    {t("hero.secondaryCta")}
                    <Icons.chevronRight className="ml-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="inline-flex gap-3 sm:gap-4 lg:gap-6 px-4 py-3 bg-[#1c2128] backdrop-blur-sm rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.35)] animate-float-up opacity-0 stagger-5" style={{ animationFillMode: 'forwards' }}>
                {stats.map((stat, index) => (
                  <div key={stat.labelKey} className="flex items-baseline text-white">
                    <span className="text-lg sm:text-xl lg:text-2xl font-black text-[#daa520]">
                      {stat.value}
                    </span>
                    <span className="text-[11px] sm:text-xs lg:text-sm font-semibold ml-0.5 sm:ml-1 text-[#a8b2bd]">
                      {t(`stats.${stat.labelKey}`)}
                    </span>
                    {index < stats.length - 1 && (
                      <span className="ml-3 sm:ml-4 lg:ml-6 text-[#30363d]">|</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Belt System Preview */}
      <section className="py-5 sm:py-6 bg-[#13171d] shadow-[0_-1px_0_rgba(255,255,255,0.03),0_1px_0_rgba(255,255,255,0.03)]">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-2">
            <span className="text-xs sm:text-sm text-[#a8b2bd] sm:mr-3 tracking-wider font-medium font-mono">
              {t("dojoSystem.badge")}
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
              {BELTS.map((belt, index) => (
                <div
                  key={belt.id}
                  className={`w-6 h-4 sm:w-8 sm:h-5 rounded-sm ${belt.bgColor} transition-all duration-300 hover:scale-110 hover:shadow-[0_0_12px_rgba(240,180,41,0.3)] flex items-center justify-center cursor-pointer shadow-[0_2px_4px_rgba(0,0,0,0.3)]`}
                  title={`${belt.nameKo} (${belt.minXp}+ XP)`}
                >
                  <span
                    className="text-[6px] sm:text-[8px] font-bold font-mono"
                    style={{ color: index === 0 ? "#6b5344" : index === 8 ? "#f5f0e6" : "#3d2c1e" }}
                  >
                    {belt.rank}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Vibe Coding Section */}
      <section className="py-10 sm:py-14 px-4 bg-[#0d1117] relative overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#58a6ff]/5 rounded-full blur-[150px]" />
        <div className="container max-w-4xl relative z-10">
          <div className="text-center mb-8 sm:mb-10">
            <span className="inline-block px-2.5 sm:px-3 py-1 bg-[#1c2128] text-[#58a6ff] text-xs sm:text-sm font-medium mb-3 sm:mb-4 rounded-md font-mono shadow-[0_2px_6px_rgba(0,0,0,0.25)]">
              {t("whyVibeCoding.badge")}
            </span>
            <h2 className="text-[1.375rem] sm:text-[1.75rem] font-black text-[#c9d1d9] mb-2 px-2">
              {t("whyVibeCoding.title1")}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#daa520] to-[#e6b82e]">
                {t("whyVibeCoding.title2")}
              </span>
              {t("whyVibeCoding.title3")}
            </h2>
            <p className="text-[13px] sm:text-[15px] text-[#a8b2bd] max-w-xl mx-auto">
              {t("whyVibeCoding.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {whyVibeCodingImages.map((image, i) => (
              <div
                key={i}
                className="bg-[#1c2128] rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(218,165,32,0.15)] shadow-[0_4px_12px_rgba(0,0,0,0.35)] flex group"
              >
                <div className="relative w-24 sm:w-36 aspect-square flex-shrink-0 overflow-hidden">
                  <Image
                    src={image}
                    alt={t(`whyVibeCoding.items.${i}.title`)}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105 saturate-[0.95] brightness-[1.08]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1c2128]/20" />
                </div>
                <div className="p-4 sm:p-5 flex flex-col justify-center">
                  <h3 className="text-[13px] sm:text-[15px] font-bold mb-1 sm:mb-2 text-[#c9d1d9] group-hover:text-[#daa520] transition-colors">
                    {t(`whyVibeCoding.items.${i}.title`)}
                  </h3>
                  <p className="text-[11px] sm:text-[13px] text-[#a8b2bd] leading-relaxed line-clamp-3 sm:line-clamp-none group-hover:text-[#c9d1d9] transition-colors">
                    {t(`whyVibeCoding.items.${i}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Can Build Section */}
      <section className="py-10 sm:py-14 px-4 bg-[#13171d] relative overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#daa520]/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#a371f7]/5 rounded-full blur-[120px]" />
        </div>
        <div className="container max-w-4xl relative z-10">
          <div className="text-center mb-8 sm:mb-10">
            <span className="inline-block px-2.5 sm:px-3 py-1 bg-[#1c2128] text-[#a371f7] text-xs sm:text-sm font-medium mb-3 sm:mb-4 rounded-md font-mono shadow-[0_2px_6px_rgba(0,0,0,0.25)]">
              {t("projects.badge")}
            </span>
            <h2 className="text-[1.375rem] sm:text-[1.75rem] font-black text-[#c9d1d9] mb-2">
              {t("projects.title1")}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#daa520] via-[#e6b82e] to-[#daa520]">
                {t("projects.title2")}
              </span>
            </h2>
            <p className="text-[13px] sm:text-[15px] text-[#a8b2bd] max-w-xl mx-auto">
              {t("projects.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {projectKeys.map((key, index) => (
              <div
                key={key}
                className="bg-[#0d1117] p-4 sm:p-5 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(218,165,32,0.15)] shadow-[0_4px_12px_rgba(0,0,0,0.35)] group relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <span className="text-[11px] sm:text-[13px] font-mono font-medium px-1.5 py-0.5 bg-[#1c2128] text-[#a8b2bd] rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
                    {t(`projects.items.${key}.part`)}
                  </span>
                </div>
                <h3 className="text-[13px] sm:text-[15px] font-bold mb-1 sm:mb-1.5 text-[#c9d1d9] group-hover:text-[#daa520] transition-colors">
                  {t(`projects.items.${key}.title`)}
                </h3>
                <p className="text-[11px] sm:text-[13px] text-[#a8b2bd] leading-relaxed line-clamp-2 sm:line-clamp-none group-hover:text-[#c9d1d9] transition-colors">
                  {t(`projects.items.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 sm:py-14 px-4 bg-[#0d1117] relative overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#3fb950]/5 rounded-full blur-[150px]" />
        <div className="container max-w-4xl relative z-10">
          <div className="text-center mb-8 sm:mb-10">
            <span className="inline-block px-2.5 sm:px-3 py-1 bg-[#1c2128] text-[#3fb950] text-xs sm:text-sm font-medium mb-3 sm:mb-4 rounded-md font-mono shadow-[0_2px_6px_rgba(0,0,0,0.25)]">
              {t("dojoSystem.badge")}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#c9d1d9] mb-2">
              {t("dojoSystem.title1")}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#daa520] to-[#e6b82e]">
                {t("dojoSystem.title2")}
              </span>
            </h2>
            <p className="text-sm sm:text-base text-[#a8b2bd]">
              {t("dojoSystem.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-[#1c2128] rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(218,165,32,0.15)] shadow-[0_4px_12px_rgba(0,0,0,0.35)] group"
              >
                <div className="relative w-full aspect-[2/1] overflow-hidden">
                  <Image
                    src={feature.image}
                    alt={t(`dojoSystem.items.${feature.titleKey}.title`)}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105 saturate-[0.95] brightness-[1.1] contrast-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c2128]/50 to-transparent" />
                </div>
                <div className="p-3 sm:p-5">
                  <h3 className="text-xs sm:text-sm font-bold mb-1 sm:mb-2 text-[#c9d1d9] group-hover:text-[#daa520] transition-colors">
                    {t(`dojoSystem.items.${feature.titleKey}.title`)}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#a8b2bd] leading-relaxed group-hover:text-[#c9d1d9] transition-colors">
                    {t(`dojoSystem.items.${feature.titleKey}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Character Preview Section */}
      <section className="py-10 sm:py-14 px-4 bg-[#13171d] relative overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#daa520]/5 rounded-full blur-[100px]" />
        <div className="container max-w-3xl relative z-10">
          <div className="text-center mb-8 sm:mb-10">
            <span className="inline-block px-2.5 sm:px-3 py-1 bg-[#1c2128] text-[#e3b341] text-xs sm:text-sm font-medium mb-3 sm:mb-4 rounded-md font-mono shadow-[0_2px_6px_rgba(0,0,0,0.25)]">
              {t("characters.badge")}
            </span>
            <h2 className="text-[1.375rem] sm:text-[1.75rem] font-black text-[#c9d1d9] mb-2">
              {t("characters.title")}
            </h2>
            <p className="text-[13px] sm:text-[15px] text-[#a8b2bd]">
              {t("characters.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-8 gap-1 sm:gap-2 max-w-xl mx-auto p-5 bg-[#0d1117] backdrop-blur-sm rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
            {CHARACTERS.map((character) => (
              <CharacterPreview
                key={character.id}
                character={character}
                size={40}
                className="hover:scale-110 transition-all duration-300 sm:[&>*]:w-[52px] sm:[&>*]:h-[52px] hover:drop-shadow-[0_0_8px_rgba(240,180,41,0.4)]"
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-14 px-4 bg-[#0d1117] relative overflow-hidden">
        {/* Central glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#daa520]/5 rounded-full blur-[120px]" />
        <div className="container max-w-xl text-center relative z-10">
          <Icons.quote className="h-6 w-6 sm:h-8 sm:w-8 text-[#daa520] mx-auto mb-4 sm:mb-5" />
          <blockquote className="text-[15px] sm:text-[17px] font-medium text-[#c9d1d9] mb-2 sm:mb-3 leading-relaxed px-2">
            &ldquo;{t("quote.text1")}
            <span className="text-[#daa520]">{t("quote.text2")}</span>
            {t("quote.text3")}&rdquo;
          </blockquote>
          <p className="text-[11px] sm:text-[13px] text-[#a8b2bd] mb-5 sm:mb-6 font-mono">{t("quote.author")}</p>
          <p className="text-[13px] sm:text-[15px] text-[#a8b2bd] mb-6 sm:mb-8 max-w-md mx-auto leading-relaxed px-2">
            <span className="whitespace-nowrap">{t("quote.description1")}</span>
            <br />
            <span className="whitespace-nowrap"><span className="text-[#daa520] font-medium">{t("quote.description2")}</span>{t("quote.description3")}</span>
            <br />
            <span className="whitespace-nowrap">{t("quote.description4")}<span className="text-[#58a6ff] font-medium">{t("quote.description5")}</span>{t("quote.description6")}</span>
          </p>
          <Button
            asChild
            size="default"
            className="rounded-md h-9 sm:h-10 px-6 sm:px-8 text-xs sm:text-sm font-bold bg-[#daa520] hover:bg-[#e6b82e] text-[#0d1117] transition-all duration-300"
          >
            <Link href="/signup">
              {t("quote.cta")}
              <Icons.swords className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 bg-[#010409] shadow-[0_-1px_0_rgba(255,255,255,0.05)]">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-5">
          <div className="flex items-center gap-2">
            <Icons.vibedojoSymbol className="w-6 h-6 sm:w-7 sm:h-7" />
            <span className="font-bold text-xs sm:text-sm text-[#e6edf3] tracking-tight">
              {common("appName")}
            </span>
          </div>
          <div className="flex flex-col items-center gap-0.5 sm:gap-1 order-last sm:order-none">
            <p className="text-xs sm:text-sm text-[#484f58]">
              {t("footer.copyright")}
            </p>
            <p className="text-xs sm:text-sm text-[#a8b2bd]">
              Powered by{" "}
              <Link
                href="https://www.hashed.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#58a6ff] hover:text-[#79c0ff] transition-all font-medium"
              >
                #Hashed
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="https://github.com/anthropics/claude-code"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#a8b2bd] hover:text-[#c9d1d9] transition-all duration-300"
            >
              <Icons.github className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
