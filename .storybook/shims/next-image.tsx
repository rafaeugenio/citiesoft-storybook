import type { CSSProperties, ImgHTMLAttributes } from 'react';

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string | { src: string };
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  unoptimized?: boolean;
};

/**
 * Substituto de `next/image` para o Storybook (Vite). Cobre `fill`, que no Next
 * posiciona a imagem por cima do pai; o restante das props de otimização é ignorado.
 */
export default function Image({ src, fill, priority: _p, quality: _q, unoptimized: _u, style, alt = '', ...rest }: Props) {
  const fillStyle: CSSProperties | undefined = fill
    ? { position: 'absolute', inset: 0, width: '100%', height: '100%' }
    : undefined;
  return <img src={typeof src === 'string' ? src : src.src} alt={alt} style={{ ...fillStyle, ...style }} {...rest} />;
}
