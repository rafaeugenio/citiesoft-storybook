import { cx } from "@/utils/cx";

export type BrandLogoTone = "auto" | "on-light" | "on-dark";

export interface BrandLogoProps {
  /**
   * `auto` troca o logo conforme o tema (`LogoHorizontal3.svg` em fundo claro,
   * `LogoHorizontal2.svg` em fundo escuro). `on-light` e `on-dark` fixam a versão,
   * para painéis de cor própria, como o painel azul do login dividido.
   */
  tone?: BrandLogoTone;
  /** Mostra só o símbolo (`LogoAzul.svg`), para barras recolhidas e telas pequenas. */
  symbol?: boolean;
  alt?: string;
  className?: string;
}

const LIGHT = "/marca/LogoHorizontal3.svg";
const DARK = "/marca/LogoHorizontal2.svg";
const SYMBOL = "/marca/LogoAzul.svg";

/** Logo Citiesoft com a versão certa para o fundo. */
export function BrandLogo({ tone = "auto", symbol = false, alt = "Citiesoft", className }: BrandLogoProps) {
  if (symbol) {
    return <img src={SYMBOL} alt={alt} className={cx("h-8 w-auto", className)} />;
  }
  if (tone === "on-light") return <img src={LIGHT} alt={alt} className={cx("h-8 w-auto", className)} />;
  if (tone === "on-dark") return <img src={DARK} alt={alt} className={cx("h-8 w-auto", className)} />;
  return (
    <>
      <img src={LIGHT} alt={alt} className={cx("h-8 w-auto dark:hidden", className)} />
      <img src={DARK} alt={alt} className={cx("hidden h-8 w-auto dark:block", className)} />
    </>
  );
}
