import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Button, Input, InputOtp, Link } from '../../../src';
import { Acesso, MarcaDoAcesso } from './Acesso';

/* ------------------------------------------------------------------ */
/* Ícones do fluxo, no traço do sistema                                */
/* ------------------------------------------------------------------ */

const IconeUsuario = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" strokeLinecap="round" />
  </svg>
);

const IconeUsuarioMais = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="10" cy="8" r="4" />
    <path d="M3 21c0-4 3.1-6 7-6s7 2 7 6M19 8v6M16 11h6" strokeLinecap="round" />
  </svg>
);

const IconeRecuperar = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 12a9 9 0 1 0 3-6.7" strokeLinecap="round" />
    <path d="M3 4v5h5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconeEnvelope = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconeChave = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="8" cy="15" r="4" />
    <path d="m11 12 9-9M17 5l2 2M14 8l2 2" strokeLinecap="round" />
  </svg>
);

const IconeCadeado = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

const IconeEnvelopeMini = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconeUsuarioMini = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" strokeLinecap="round" />
  </svg>
);

const IconeSetaEsquerda = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M19 12H5m6-6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Peças repetidas do fluxo                                            */
/* ------------------------------------------------------------------ */

const CADASTRE_SE = {
  pergunta: 'Não tem uma conta?',
  acao: (
    <Button variant="outline" size="small">
      Cadastre-se
    </Button>
  ),
};

const JA_TEM_CONTA = {
  pergunta: 'Já tem uma conta?',
  acao: (
    <Button variant="outline" size="small">
      Entrar
    </Button>
  ),
};

const VOLTAR_AO_LOGIN = (
  <Button variant="text" size="small" icon={IconeSetaEsquerda}>
    Voltar ao login
  </Button>
);

/**
 * Lugar dos links jurídicos. O texto aprovado pelo jurídico é insumo da
 * página; até chegar, o destino fica marcado como pendência, nunca inventado.
 */
const RODAPE_LEGAL = (
  <>
    <Link href="#termos-de-uso-a-aprovar" papel="discreto">
      Termos de uso
    </Link>
    <Link href="#politica-de-privacidade-a-aprovar" papel="discreto">
      Política de privacidade
    </Link>
  </>
);

const meta = {
  title: 'Templates/Acesso/Fluxo de acesso',
  component: Acesso,
  tags: ['template', 'a11y'],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      options: {
        desktop: { name: 'Desktop 1366', styles: { width: '1366px', height: '768px' } },
        tablet: { name: 'Tablet 768', styles: { width: '768px', height: '1024px' } },
        celular: { name: 'Celular 375', styles: { width: '375px', height: '812px' } },
      },
    },
    docs: {
      description: {
        component: [
          'As cinco telas de acesso dos sistemas Citiesoft, na composição do fluxo de acesso do Sismental (`docs/figma-ui-kit.md`, "Acesso") e na cor da casa.',
          '',
          '**Anatomia:** cartão dividido a 10px da tela (`--citie-margem-do-acesso`), raio 16; painel branco à esquerda com a marca no topo esquerdo e a contraparte ("Não tem uma conta? Cadastre-se") no topo direito; ícone em círculo de 48 com anel de marca, título 24, subtítulo muted, campos com ícone à esquerda, ação primária de largura total e a secundária abaixo; rodapé Citiesoft com o lugar dos links jurídicos. Painel de marca à direita em azul Citiesoft (`--citie-largura-do-painel-de-marca`, 38%), que some abaixo de 900px.',
          '',
          '**Componentes do sistema usados:** `Input` (com `addonStart`), `InputOtp`, `Button`, `Link`.',
          '',
          '**Fora do template:** validação, mensagens de erro e o envio pertencem à página. Os links de termos de uso e política de privacidade apontam para destinos marcados como pendentes até o texto aprovado existir (anti-slop STA-002 e STA-003).',
        ].join('\n'),
      },
    },
  },
  args: {
    icone: IconeUsuario,
    titulo: 'Entrar na sua conta',
    subtitulo: 'Entre com suas credenciais para acessar o sistema.',
    contraparte: CADASTRE_SE,
    rodapeLegal: RODAPE_LEGAL,
    children: null,
    acao: <Button variant="primary">Entrar no sistema</Button>,
  },
} satisfies Meta<typeof Acesso>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/* As cinco telas                                                      */
/* ------------------------------------------------------------------ */

export const Entrar: Story = {
  name: '1 · Entrar',
  globals: { viewport: { value: 'desktop' } },
  args: {
    children: (
      <>
        <Input
          label="E-mail"
          type="email"
          autoComplete="username"
          placeholder="seuemail@email.com"
          addonStart={IconeEnvelopeMini}
        />
        <Input
          label="Senha"
          type="password"
          autoComplete="current-password"
          placeholder="Digite sua senha"
          addonStart={IconeCadeado}
        />
        <p className="citie-tpl-acesso__auxiliar">
          <Link href="#recuperar-senha" papel="discreto">
            Esqueceu sua senha?
          </Link>
        </p>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Cartão a 10px da tela, raio 16, dividido com o painel de marca em 38%.
    const moldura = canvasElement.querySelector<HTMLElement>('.citie-tpl-acesso')!;
    const cartao = canvasElement.querySelector<HTMLElement>('.citie-tpl-acesso__cartao')!;
    await expect(getComputedStyle(moldura).paddingLeft).toBe('10px');
    await expect(getComputedStyle(cartao).borderRadius).toBe('16px');
    const painel = canvasElement.querySelector<HTMLElement>('.citie-tpl-acesso__marca-painel')!;
    const proporcao = painel.getBoundingClientRect().width / cartao.getBoundingClientRect().width;
    await expect(Math.round(proporcao * 100)).toBe(38);

    // O painel de marca é o azul da casa, e o formulário é o único `main`.
    const sonda = document.createElement('span');
    sonda.style.color = 'var(--citie-brand-primary)';
    cartao.appendChild(sonda);
    await expect(getComputedStyle(painel).backgroundColor).toBe(getComputedStyle(sonda).color);
    sonda.remove();
    await expect(canvasElement.querySelectorAll('main')).toHaveLength(1);

    // Marca no topo esquerdo, contraparte no topo direito. `getByRole` devolve
    // só a versão visível: a outra sai da árvore por `display: none`.
    const marca = canvas.getByRole('img', { name: 'Citiesoft' });
    const cadastro = canvas.getByRole('button', { name: 'Cadastre-se' });
    await expect(marca.getBoundingClientRect().right).toBeLessThan(cadastro.getBoundingClientRect().left);

    // Ícone em círculo de 48 com anel de marca, título 24 SemiBold.
    const icone = canvasElement.querySelector<HTMLElement>('.citie-tpl-acesso__icone')!;
    await expect(Math.round(icone.getBoundingClientRect().width)).toBe(48);
    await expect(getComputedStyle(icone).borderRadius).toBe('9999px');
    await expect(getComputedStyle(icone).borderWidth).toBe('1px');
    const titulo = canvas.getByRole('heading', { level: 1, name: 'Entrar na sua conta' });
    await expect(getComputedStyle(titulo).fontSize).toBe('24px');

    // Campos com ícone à esquerda e a ação primária na largura da coluna.
    const email = canvas.getByLabelText('E-mail');
    await expect(email.closest('.citie-input-group--start')).not.toBeNull();
    const entrar = canvas.getByRole('button', { name: 'Entrar no sistema' });
    const formulario = canvasElement.querySelector<HTMLElement>('.citie-tpl-acesso__formulario')!;
    await expect(Math.round(entrar.getBoundingClientRect().width)).toBe(
      Math.round(formulario.getBoundingClientRect().width),
    );
    await expect(Math.round(entrar.getBoundingClientRect().height)).toBe(36);

    // Rodapé Citiesoft com o lugar dos links jurídicos.
    await expect(canvas.getByRole('link', { name: /Citiesoft/ }).closest('footer')).not.toBeNull();
    await expect(canvas.getByRole('link', { name: 'Termos de uso' })).toBeVisible();
  },
};

export const CriarConta: Story = {
  name: '2 · Criar conta',
  globals: { viewport: { value: 'desktop' } },
  args: {
    icone: IconeUsuarioMais,
    titulo: 'Crie uma nova conta',
    subtitulo: 'Informe seus dados para solicitar acesso ao sistema.',
    contraparte: JA_TEM_CONTA,
    acao: <Button variant="primary">Cadastrar</Button>,
    children: (
      <>
        <Input label="Nome completo" autoComplete="name" placeholder="Seu nome" addonStart={IconeUsuarioMini} />
        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="seuemail@email.com"
          addonStart={IconeEnvelopeMini}
        />
        <Input
          label="Senha"
          type="password"
          autoComplete="new-password"
          placeholder="Crie uma senha"
          helper="Ao menos 8 caracteres, com letra e número."
          addonStart={IconeCadeado}
        />
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Crie uma nova conta' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Entrar' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Cadastrar' })).toBeVisible();
  },
};

export const RecuperarSenha: Story = {
  name: '3 · Recuperar senha',
  globals: { viewport: { value: 'desktop' } },
  args: {
    icone: IconeRecuperar,
    titulo: 'Recuperação de senha',
    subtitulo: 'Informe seu e-mail para receber o link de recuperação.',
    acao: <Button variant="primary">Enviar link de recuperação</Button>,
    secundaria: VOLTAR_AO_LOGIN,
    children: (
      <Input
        label="E-mail"
        type="email"
        autoComplete="email"
        placeholder="seuemail@email.com"
        addonStart={IconeEnvelopeMini}
      />
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const enviar = canvas.getByRole('button', { name: 'Enviar link de recuperação' });
    const voltar = canvas.getByRole('button', { name: 'Voltar ao login' });
    await expect(enviar.getBoundingClientRect().bottom).toBeLessThanOrEqual(voltar.getBoundingClientRect().top);
  },
};

export const VerificarEmail: Story = {
  name: '4 · Verificar e-mail',
  globals: { viewport: { value: 'desktop' } },
  args: {
    icone: IconeEnvelope,
    titulo: 'Verifique seu e-mail',
    subtitulo: (
      <>
        Enviamos um código de verificação para <strong>seuemail@email.com</strong>
      </>
    ),
    acao: <Button variant="primary">Validar</Button>,
    secundaria: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--citie-spacing-2)' }}>
        <Button variant="secondary" icon={IconeRecuperar}>
          Reenviar código
        </Button>
        {VOLTAR_AO_LOGIN}
      </div>
    ),
    children: <InputOtp label="Código de verificação" length={4} size="large" />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('group', { name: 'Código de verificação' })).toBeVisible();
    await expect(canvas.getAllByRole('textbox')).toHaveLength(4);
    await expect(canvas.getByRole('button', { name: 'Validar' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Reenviar código' })).toBeVisible();
  },
};

export const NovaSenha: Story = {
  name: '5 · Criar nova senha',
  globals: { viewport: { value: 'desktop' } },
  args: {
    icone: IconeChave,
    titulo: 'Criar nova senha',
    subtitulo: undefined,
    acao: <Button variant="primary">Redefinir senha</Button>,
    secundaria: VOLTAR_AO_LOGIN,
    children: (
      <>
        <Input
          label="Nova senha"
          type="password"
          autoComplete="new-password"
          placeholder="Digite sua senha"
          addonStart={IconeCadeado}
        />
        <Input
          label="Confirme sua senha"
          type="password"
          autoComplete="new-password"
          placeholder="Repita a senha"
          addonStart={IconeCadeado}
        />
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText('Nova senha')).toHaveAttribute('type', 'password');
    await expect(canvas.getByLabelText('Confirme sua senha')).toHaveAttribute('type', 'password');
    await expect(canvas.getByRole('button', { name: 'Redefinir senha' })).toBeVisible();
  },
};

/* ------------------------------------------------------------------ */
/* Guarda da marca                                                     */
/* ------------------------------------------------------------------ */

/** Tinta de cada versão oficial, lida nos `fill` dos SVGs de `public/marca/`. */
const TINTA_DA_MARCA = {
  '/marca/LogoHorizontal3.svg': '#373737',
  '/marca/LogoHorizontal2.svg': '#ececec',
} as const;

/** Contraste WCAG entre duas cores em `rgb(...)` ou `#rrggbb`. */
function contraste(a: string, b: string) {
  const canais = (cor: string) =>
    cor.startsWith('#')
      ? [cor.slice(1, 3), cor.slice(3, 5), cor.slice(5, 7)].map((par) => parseInt(par, 16))
      : (cor.match(/\d+/g) ?? []).slice(0, 3).map(Number);

  const lum = (cor: string) => {
    const [r, g, bl] = canais(cor).map((c) => {
      const v = c / 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };

  const [claro, escuro] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (claro + 0.05) / (escuro + 0.05);
}

/** Versão renderizada da marca dentro de um trecho, com o fundo que ela recebe. */
function marcaVisivel(raiz: HTMLElement) {
  const marca = within(raiz).getByRole('img', { name: 'Citiesoft' });
  const arquivo = new URL((marca as HTMLImageElement).src).pathname as keyof typeof TINTA_DA_MARCA;
  let no: HTMLElement | null = marca.parentElement;
  let fundo = 'rgb(255, 255, 255)';
  while (no) {
    const cor = getComputedStyle(no).backgroundColor;
    if (cor && cor !== 'rgba(0, 0, 0, 0)' && cor !== 'transparent') {
      fundo = cor;
      break;
    }
    no = no.parentElement;
  }
  return { arquivo, fundo, tinta: TINTA_DA_MARCA[arquivo] };
}

export const MarcaPorTema: Story = {
  name: 'Marca · versão por superfície',
  globals: { viewport: { value: 'desktop' } },
  args: { ...Entrar.args, painelDeMarca: <MarcaDoAcesso /> },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: [
          'Guarda da regra de marca da casa: LogoHorizontal3 (tinta #373737) em fundo claro, LogoHorizontal2 (tinta #ECECEC) em fundo azul ou escuro.',
          '',
          'A tela tem duas superfícies e cada uma escolhe a sua versão. O painel do formulário é `background-surface` e acompanha o tema. O painel de marca é `brand-primary`, azul escuro no tema claro e azul claro no escuro, então a assinatura acompanha `brand-contrast` e inverte junto. A story lê o tema ativo do Storybook e cobra a versão correspondente, então as duas execuções da suíte fecham as quatro combinações.',
        ].join('\n'),
      },
    },
  },
  render: (args) => (
    <div style={{ blockSize: '520px', overflow: 'hidden' }}>
      <Acesso {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    // O contêiner de tema do decorador é filho de `canvasElement`. Tema
    // aninhado não existe neste sistema: os valores claros moram em `:root` e
    // um `[data-theme='light']` dentro do escuro continua herdando o escuro.
    const container =
      canvasElement.querySelector('[data-theme]') ?? canvasElement.closest('[data-theme]');
    const escuro = container?.getAttribute('data-theme') === 'dark';

    const formulario = canvasElement.querySelector<HTMLElement>('.citie-tpl-acesso__topo')!;
    const painelDeMarca = canvasElement.querySelector<HTMLElement>('.citie-tpl-acesso__marca-painel')!;

    // Uma única assinatura por superfície na árvore de acessibilidade.
    await expect(within(formulario).getAllByRole('img', { name: 'Citiesoft' })).toHaveLength(1);
    await expect(within(painelDeMarca).getAllByRole('img', { name: 'Citiesoft' })).toHaveLength(1);

    const noFormulario = marcaVisivel(formulario);
    const noPainel = marcaVisivel(painelDeMarca);

    // Sobre `background-surface`: versão 2 no escuro, versão 3 no claro.
    await expect(noFormulario.arquivo).toBe(
      escuro ? '/marca/LogoHorizontal2.svg' : '/marca/LogoHorizontal3.svg',
    );
    // Sobre o azul da marca a regra inverte junto com `brand-contrast`.
    await expect(noPainel.arquivo).toBe(
      escuro ? '/marca/LogoHorizontal3.svg' : '/marca/LogoHorizontal2.svg',
    );

    // Texto da assinatura passa 4,5:1 no formulário e 3:1 sobre o azul.
    await expect(contraste(noFormulario.tinta, noFormulario.fundo)).toBeGreaterThanOrEqual(4.5);
    await expect(contraste(noPainel.tinta, noPainel.fundo)).toBeGreaterThanOrEqual(3);

    // E o painel continua sendo o azul da casa, sem cor nova.
    const sonda = document.createElement('span');
    sonda.style.color = 'var(--citie-brand-primary)';
    painelDeMarca.appendChild(sonda);
    await expect(noPainel.fundo).toBe(getComputedStyle(sonda).color);
    sonda.remove();
  },
};

/* ------------------------------------------------------------------ */
/* Responsivo                                                          */
/* ------------------------------------------------------------------ */

export const Celular: Story = {
  name: 'Responsivo · 375, sem painel de marca',
  globals: { viewport: { value: 'celular' } },
  args: Entrar.args,
  parameters: {
    docs: {
      description: {
        story:
          'Abaixo de 900px o painel de marca sai e o cartão fica só com o formulário, ainda a 10px da tela e com raio 16.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const painel = canvasElement.querySelector<HTMLElement>('.citie-tpl-acesso__marca-painel')!;
    await expect(getComputedStyle(painel).display).toBe('none');
    // O cartão continua a 10px de cada lado da moldura (o decorador do
    // Storybook ainda põe 20px em volta, por isso a medida é relativa).
    const moldura = canvasElement.querySelector<HTMLElement>('.citie-tpl-acesso')!;
    const cartao = canvasElement.querySelector<HTMLElement>('.citie-tpl-acesso__cartao')!;
    await expect(Math.round(cartao.getBoundingClientRect().width)).toBe(
      Math.round(moldura.getBoundingClientRect().width) - 20,
    );
  },
};
