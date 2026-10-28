import type { Abas } from '../Layout';

export const assinaturaEmailCodigo: Abas = {
  'HTML': { linguagem: 'xml', codigo: `<!-- Tabela HTML, largura máxima 500px, fundo branco ou transparente -->
<table role="presentation" width="500" cellpadding="0" cellspacing="0"
  style="max-width:500px;font-family:'Inter',Arial,sans-serif;font-size:14px;color:#3C3C3C;">
  <tr><td style="font-family:'Red Hat Display',Arial,sans-serif;font-size:18px;font-weight:600;color:#146BFA;">
    Nome Completo
  </td></tr>
  <tr><td>Cargo em português</td></tr>
  <tr><td>Citiesoft Tecnologia</td></tr>
  <tr><td style="padding-top:8px;">+55 (98) 99999-9999 | nome@citiesoft.com.br</td></tr>
  <tr><td><a href="https://citiesoft.com.br" style="color:#1261E4;text-decoration:underline;">citiesoft.com.br</a></td></tr>
  <tr><td style="border-top:1px solid #DBE8FF;padding-top:8px;">
    <a href="https://citiesoft.com.br">
      <img src="https://cdn.exemplo.com/LogoHorizontal3.svg" alt="Citiesoft" width="160" style="display:block;border:0;">
    </a>
  </td></tr>
</table>` },
};

export const iconeDeAppCodigo: Abas = {
  'HTML': { linguagem: 'xml', codigo: `<!-- Favicon: símbolo sobre Citie Blue 500, nunca a letra C -->
<link rel="icon" href="/favicon-32.png" sizes="32x32">
<link rel="apple-touch-icon" href="/citiesoft-icon-180@1x.png">
<link rel="manifest" href="/manifest.webmanifest">` },
  'Manifest': { linguagem: 'json', codigo: `{
  "name": "Citiesoft",
  "icons": [
    { "src": "/citiesoft-icon-192@1x.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/citiesoft-icon-512@1x.png", "sizes": "512x512", "type": "image/png" }
  ],
  "theme_color": "#146BFA",
  "background_color": "#146BFA"
}` },
};

export const heroDoSiteCodigo: Abas = {
  'CSS': { linguagem: 'css', codigo: `.hero {
  background: linear-gradient(135deg, #146BFA 0%, #0B3C8F 100%);
  color: #FAFAFA;
}
/* O fundo do body e das demais seções fica sólido */
body { background: #FAFAFA; }
.conteudo { max-width: 1200px; margin-inline: auto; padding-inline: 24px; }
.secao { padding-block: 80px; }
@media (max-width: 767px) { .secao { padding-block: 48px; } }` },
  'Tailwind': { linguagem: 'xml', codigo: `<body class="bg-[#FAFAFA]">
  <section class="bg-gradient-to-br from-[#146BFA] to-[#0B3C8F] py-12 text-[#FAFAFA] md:py-20">
    <div class="mx-auto max-w-[1200px] px-6">
      <h1 class="font-[800] text-[56px]">Tecnologia construída para a gestão pública</h1>
    </div>
  </section>
</body>` },
};
