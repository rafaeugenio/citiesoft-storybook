import type { Abas } from '../Layout';

export const glassCodigo: Abas = {
  'Fundo claro': { linguagem: 'css', codigo: `/* Overlay sobre hero com gradiente institucional */
.glass {
  background: rgba(255, 255, 255, 0.78);   /* faixa permitida: 0.65 a 0.80 */
  backdrop-filter: blur(16px);             /* faixa permitida: 12 a 20px */
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.50);
  border-radius: 12px;                     /* máximo em modal e overlay */
  box-shadow: 0 8px 32px rgba(14, 77, 184, 0.18);
}` },
  'Fundo escuro': { linguagem: 'css', codigo: `/* Sobre Citie Blue 900 ou 950 o glass inverte */
.glass-escuro {
  background: rgba(11, 60, 143, 0.55);     /* Citie Blue 800 com transparência */
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
}` },
};

export const padroesCodigo: Abas = {
  'Dot matrix': { linguagem: 'css', codigo: `/* Pontos de 2px a cada 16px, opacidade entre 8% e 15%. Nunca sob texto ou dado. */
.dot-matrix {
  background-image: radial-gradient(circle at 1px 1px, rgba(179, 206, 254, 0.10) 1px, transparent 1px);
  background-size: 16px 16px;
}
/* Fundo escuro: troque a cor do ponto por Citie Blue 700 */
.dot-matrix--escuro {
  background-image: radial-gradient(circle at 1px 1px, rgba(14, 77, 184, 0.12) 1px, transparent 1px);
}` },
  'Card padrão': { linguagem: 'css', codigo: `.card-institucional {
  background: #FAFAFA;
  border: 1px solid #DBE8FF;               /* Citie Blue 100 */
  border-radius: 8px;                      /* 4px em impresso */
  padding: 24px;                           /* 16px em mobile */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
}` },
  'Destaque e status': { linguagem: 'css', codigo: `/* Destaque institucional: citação de dado, métrica, proposta */
.card-destaque {
  background: #FAFAFA;
  border-left: 4px solid #146BFA;
}

/* Status: borda superior de 3px na cor semântica, fundo na variante 50 */
.card-status-sucesso {
  background: #F0FDF4;
  border-top: 3px solid #16A34A;
}` },
};
