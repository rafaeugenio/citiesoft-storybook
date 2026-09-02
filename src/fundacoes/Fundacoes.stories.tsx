import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Bloco, TabelaDeContexto } from './_ui/TabelaDeTokens';
import './Fundacoes.css';

/**
 * Porta de entrada das fundações. As páginas irmãs listam os tokens de cada
 * tema; esta explica como o sistema é montado e qual regra vale para todas.
 */

const meta = {
  title: 'Fundações/Introdução',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Toda decisão visual do produto vive em `src/tokens/tokens.css`, como propriedade',
          'customizada de CSS. Nenhum componente escreve valor literal.',
          '',
          '## A referência de produto',
          '',
          'A referência visual deste catálogo é o **UI Kit Citiesoft no Figma**, biblioteca',
          '"Citiesoft shadcn/ui kit" 1.6.0, inventariada em `docs/figma-ui-kit.md`. Dele vêm a',
          'estrutura das vagas semânticas (accent, secondary, popover, sidebar), o raio de 10px,',
          'as cinco alturas de controle (24, 32, 36, 40, 48) e as sombras. O azul, a tipografia',
          'e a família de neutros continuam sendo os da Citiesoft: o kit dá a estrutura, e os',
          'tokens daqui preenchem o modo de marca.',
          '',
          '## A regra que sustenta tudo',
          '',
          '**Componente consome token semântico por nome, nunca valor literal.**',
          '',
          'Não é preferência de estilo. Cada literal que entrou no código deste catálogo virou',
          'depois um defeito real, e todos foram encontrados por medição:',
          '',
          '- doze cores literais no `Button` quebravam o tema escuro exatamente nos estados',
          '  hover e active das variantes de feedback;',
          '- a falta de token de véu fez dois organismos repetirem o mesmo valor e um template',
          '  inventar um terceiro, divergente, na mesma tela;',
          '- a falta de escala de título produziu 48 tamanhos literais em 24 arquivos, com 14',
          '  valores distintos, e quatro H1 diferentes em seis templates;',
          '- a falta de átomo de link deixou o identificador de processo no azul padrão do',
          '  navegador, medindo 1,67:1 sobre a linha zebrada no tema escuro.',
          '',
          'O padrão se repete: **onde falta token, o componente improvisa, e a improvisação',
          'diverge.** Se você precisa de um valor que não existe como token, o token está',
          'faltando. Peça o token.',
          '',
          '## Como o token é nomeado',
          '',
          'O nome descreve o **papel**, nunca a aparência. `text-secondary` diz para que serve;',
          '`cinza-medio` diria como é. É a nomenclatura por papel que permite o tema escuro',
          'trocar o valor sem que nenhum componente mude.',
          '',
          'Dentro de cada família de feedback existem três papéis distintos, e confundi-los é o',
          'erro mais frequente:',
          '',
          '- `*-emphasis` é **preenchimento** de controle cheio;',
          '- `*-strong` é **tinta de texto** sobre superfície clara;',
          '- `*-background` é **fundo** de mensagem.',
          '',
          'Apontar o hover de um botão para `*-strong` casa por coincidência no tema claro e',
          'produz rótulo branco sobre verde claro no escuro, a 1,87:1. O motivo de as duas',
          'famílias existirem separadas está anotado no topo do arquivo de tokens.',
          '',
          '## Onde procurar',
          '',
          'Cada página irmã traz a tabela `Token · Amostra · Valor · Uso` do seu tema. Procure',
          'pela **situação** na coluna Uso, e não pelo valor que você quer ver.',
          '',
          '**O valor mostrado é lido do CSS em tempo de execução**, e nunca copiado para a',
          'documentação. Valor copiado envelhece em silêncio: alguém ajusta o token e a página',
          'passa a mentir sem que nada acuse. Troque o tema no controle da barra superior e os',
          'valores mudam junto.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const OndeProcurar: Story = {
  name: 'Onde procurar cada decisão',
  render: () => (
    <Bloco
      titulo="Índice das fundações"
      descricao="Entre pela situação que você tem na mão, e não pelo nome do token."
    >
      <TabelaDeContexto
        legenda="Índice das fundações por situação"
        colunaDoValor="Página"
        linhas={[
          { contexto: 'Que cor usar aqui', valor: 'Fundações · Cores', exemplo: 'Marca, texto, superfície, borda, estado, feedback' },
          { contexto: 'Que tamanho de texto', valor: 'Fundações · Tipografia', exemplo: 'Famílias, escala de corpo e de título, pesos, números tabulares' },
          { contexto: 'Quanto de respiro', valor: 'Fundações · Espaçamento', exemplo: 'Respiro interno, gap de grid, intervalo entre seções' },
          { contexto: 'Quanto de canto e que altura', valor: 'Fundações · Raio e dimensões', exemplo: 'Raio por camada, altura de controle, alvo de toque' },
          { contexto: 'Que sombra e como marcar o foco', valor: 'Fundações · Elevação e foco', exemplo: 'Quatro degraus de profundidade, anel de foco' },
          { contexto: 'Quanto tempo dura a transição', valor: 'Fundações · Motion', exemplo: 'Durações por intenção, curvas, movimento reduzido' },
          { contexto: 'Qual logo em qual fundo', valor: 'Fundações · Marca', exemplo: 'Versões da assinatura e regra de aplicação' },
        ]}
      />
    </Bloco>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Fundações · Cores')).toBeVisible();
    await expect(canvas.getByText('Fundações · Motion')).toBeVisible();
  },
};

export const ComoConsumir: Story = {
  name: 'Como consumir um token',
  parameters: {
    docs: {
      description: {
        story:
          'O token é propriedade customizada de CSS, então basta `var()`. Não existe camada de build, nem importação de JavaScript, nem função auxiliar: o valor é resolvido pelo navegador em tempo de execução, e é por isso que a troca de tema não exige recarregar a página.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--citie-spacing-5)', maxInlineSize: '640px' }}>
      <Bloco titulo="Em CSS" descricao="A forma padrão. Todo componente deste catálogo é assim.">
        <pre className="citie-exemplo-codigo">
{`.minha-secao {
  background-color: var(--citie-background-surface);
  color: var(--citie-text-base);
  padding: var(--citie-spacing-5);
  border-radius: var(--citie-radius-xl);
  box-shadow: var(--citie-shadow-raised);
}`}
        </pre>
      </Bloco>

      <Bloco
        titulo="Em estilo inline de React"
        descricao="Válido, e reservado a valor que depende de dado em tempo de execução. Estilo estático pertence ao arquivo CSS."
      >
        <pre className="citie-exemplo-codigo">
{`<div style={{ gap: 'var(--citie-spacing-3)' }}>`}
        </pre>
      </Bloco>

      <Bloco
        titulo="Lendo o valor em JavaScript"
        descricao="Necessário apenas quando o valor precisa ir para um canvas ou para um cálculo. As tabelas destas páginas usam exatamente isto."
      >
        <pre className="citie-exemplo-codigo">
{`const valor = getComputedStyle(document.documentElement)
  .getPropertyValue('--citie-brand-primary')
  .trim();`}
        </pre>
      </Bloco>
    </div>
  ),
};

export const TemaEscuro: Story = {
  name: 'Como o tema escuro funciona',
  parameters: {
    docs: {
      description: {
        story:
          'O tema escuro redefine o valor dos mesmos tokens sob `[data-theme="dark"]`. Nenhum componente tem regra própria de tema escuro, e nenhum componente precisa saber qual tema está ativo. Quando um componente escreve literal, ele fica congelado no tema claro, e o defeito só aparece quando alguém troca o tema.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--citie-spacing-5)', maxInlineSize: '640px' }}>
      <Bloco titulo="Como o token é redefinido" descricao="Um lugar só, para o sistema inteiro.">
        <pre className="citie-exemplo-codigo">
{`:root {
  --citie-background-surface: #ffffff;
  --citie-text-base: #3c3c3c;
}

[data-theme='dark'] {
  --citie-background-surface: #1a1a1d;
  --citie-text-base: #d7d8da;
}`}
        </pre>
      </Bloco>

      <p className="citie-nota-fundacao">
        O gate de acessibilidade roda a suíte inteira também no tema escuro, por
        <code> npm run test-storybook:dark</code>. Ele existe porque durante muito tempo todas
        as stories rodavam apenas no tema claro, e o axe nunca inspecionava o escuro: a
        primeira tela composta que rodou lá reprovou por contraste.
      </p>
    </div>
  ),
};
