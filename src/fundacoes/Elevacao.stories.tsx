import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Button } from '../components/atoms/Button/Button';
import { Checkbox } from '../components/atoms/Choice/Choice';
import { Link } from '../components/atoms/Link/Link';
import { Input } from '../components/molecules/Input/Input';
import { Select } from '../components/molecules/Select/Select';
import {
  AchadoAberto,
  Bloco,
  TabelaDeContexto,
  TabelaDeTokens,
  type TokenDocumentado,
} from './_ui/TabelaDeTokens';

const meta = {
  title: 'Fundações/Elevação e foco',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'A elevação diz a que distância do fundo um elemento está, e essa distância tem',
          'significado: quanto mais alto, mais o elemento interrompe a leitura da página.',
          'Escolha o degrau pelo papel do elemento na tela, e não pela sombra que parecer bonita.',
          '',
          '| Degrau | Papel |',
          '| --- | --- |',
          '| sem sombra | superfície ao nível do fundo: linha de tabela, item de lista |',
          '| `raised` | card em repouso, widget, painel |',
          '| `overlay` | menu, popover, tooltip, dropdown |',
          '| `dialog` | diálogo modal, drawer |',
          '',
          '**Regra de uso:** um elemento sobe no máximo um degrau no hover, e nunca dois. Um card',
          'em repouso sai de `raised` e chega em `overlay`. Se ele saltasse direto para `dialog`,',
          'passaria a se ler como camada modal enquanto o ponteiro estivesse por cima, e a',
          'hierarquia de profundidade da tela deixaria de significar alguma coisa.',
          '',
          '**Anatomia.** Cada degrau combina duas camadas. Uma sombra de contato, curta e um',
          'pouco mais opaca, ancora o elemento na superfície. Uma sombra ambiente, mais longa e',
          'de opacidade baixa, dá a distância. `raised` e `dialog` usam os valores de `shadow-sm`',
          'e `shadow-lg` do UI Kit Citiesoft, na escala do Tailwind: preto a 10% e spread',
          'negativo na segunda camada. Antes existiam apenas dois degraus, ambos de camada única,',
          'com 3px e 12px de desfoque. Sombra de camada única recorta o elemento em vez de',
          'fazê-lo flutuar, e o resultado era card e overlay praticamente indistinguíveis na tela.',
          '',
          '**O valor mostrado é lido do CSS em tempo de execução.** Troque o tema no controle da',
          'barra superior: no escuro as sombras ganham opacidade, porque sombra clara sobre fundo',
          'escuro desaparece.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ELEVACAO: TokenDocumentado[] = [
  {
    nome: 'shadow-raised',
    uso: 'Elemento em repouso que se ergue do fundo da página: card, widget de indicador, painel, faixa de KPI, trilho de aba, alça de slider.',
    evitar:
      'aplicar em linha de tabela e em item de lista. Conteúdo ao nível do fundo se separa por borda, e sombra em cada linha transforma a tabela em pilha de cartões.',
  },
  {
    nome: 'shadow-overlay',
    uso: 'Camada temporária que flutua sobre o conteúdo e se fecha sozinha: menu, submenu, dropdown de Select e MultiSelect, calendário de DatePicker, sugestão de AutoComplete, tooltip, popover de confirmação, toast.',
  },
  {
    nome: 'shadow-dialog',
    uso: 'Camada mais alta da tela, a que exige decisão antes de continuar: diálogo modal, diálogo de confirmação e drawer. Vem acompanhada do véu `scrim` por trás.',
    evitar:
      'usar em menu ou popover. O degrau `dialog` promete bloqueio de fluxo, e um menu que se fecha ao clicar fora não bloqueia nada.',
  },
  {
    nome: 'shadow-card',
    uso: 'Apelido de `shadow-raised`, com exatamente o mesmo valor. Mantido porque vários pontos do catálogo já consomem este nome. Em código novo, prefira `shadow-raised`.',
  },
  {
    nome: 'shadow-controle',
    uso: 'Âncora de controle apoiado na superfície: botão preenchido, campo, select e textarea em repouso. É o `shadow-xs` do UI Kit, e some no foco para o anel ficar sozinho.',
    evitar: 'confundir com elevação. O controle continua no plano da página; a sombra só diz que ele é um objeto.',
  },
];

const FOCO: TokenDocumentado[] = [
  {
    nome: 'state-focus-ring',
    uso: 'Anel que marca o elemento focado pelo teclado. Vale para todo alvo focável: botão, campo, link, aba, item de menu, linha selecionável, alça de slider. Opaco desde o Lote 0: o anel translúcido media 1,85:1 sobre o branco e 2,27:1 no escuro, abaixo dos 3:1 da WCAG 2.4.11; opaco mede 5,45:1 e 5,30:1.',
    evitar:
      'remover o anel para deixar a tela mais limpa. A WCAG 2.4.7 exige indicador de foco visível, e sem ele quem navega por teclado perde a posição na tela.',
  },
  {
    nome: 'state-focus-ring-danger',
    uso: 'O mesmo anel na matiz de perigo, para o campo inválido que recebe foco continuar dizendo que há um problema. 4,83:1 sobre o branco, 9,15:1 sobre a superfície escura.',
  },
];

export const Degraus: Story = {
  name: 'Degraus de elevação',
  render: () => (
    <Bloco
      titulo="Degraus"
      descricao="Quatro nomes para três alturas, porque `shadow-card` é apelido de `shadow-raised`, mais a âncora de controle, que fica fora da escada. Os valores de `raised` e `dialog` são os `shadow-sm` e `shadow-lg` do UI Kit."
    >
      <TabelaDeTokens tokens={ELEVACAO} especie="sombra" legenda="Tokens de elevação" />
      <AchadoAberto>
        <code>--citie-shadow-dialog</code> aparece em <strong>1 arquivo</strong> do catálogo,
        contra 9 de <code>shadow-raised</code>, 26 de <code>shadow-overlay</code> e 7 de{' '}
        <code>shadow-card</code>. O número baixo assusta e depois se explica: o arquivo é{' '}
        <code>Overlay.css</code>, que atende Dialog, ConfirmDialog e Drawer de uma vez só, então
        os três consumidores previstos para o degrau estão cobertos. O que fica aberto é a
        margem: qualquer camada modal futura que nasça fora de <code>Overlay.css</code> não tem
        exemplo próximo para copiar, e o caminho mais curto para quem escrever essa camada vai
        ser reaproveitar <code>shadow-overlay</code>, que já está em 26 arquivos.
      </AchadoAberto>
    </Bloco>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const estilo = getComputedStyle(canvasElement.ownerDocument.documentElement);
    // Duas camadas por degrau: a sombra de contato e a ambiente, separadas por vírgula.
    const dialog = estilo.getPropertyValue('--citie-shadow-dialog');
    await expect(dialog.split(',').length).toBeGreaterThan(4);
    // Três degraus, três valores: apontar um token para outro achata a escada.
    const degraus = ['--citie-shadow-raised', '--citie-shadow-overlay', '--citie-shadow-dialog'].map(
      (token) => estilo.getPropertyValue(token).replace(/\s+/g, ' ').trim(),
    );
    await expect(new Set(degraus).size).toBe(3);
    // O apelido resolve exatamente para o mesmo valor do degrau `raised`.
    await expect(estilo.getPropertyValue('--citie-shadow-card').trim()).toBe(
      estilo.getPropertyValue('--citie-shadow-raised').trim(),
    );
    await expect(canvas.getByText(/--citie-shadow-overlay/)).toBeVisible();
  },
};

export const Escada: Story = {
  name: 'A escada lado a lado',
  parameters: {
    docs: {
      description: {
        story:
          'Os quatro níveis sobre o mesmo fundo. A diferença entre eles precisa ser visível sem que você aproxime o rosto da tela: é esse o teste que os dois degraus antigos, de camada única, reprovavam.',
      },
    },
  },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--citie-spacing-6)',
        padding: 'var(--citie-spacing-6)',
        background: 'var(--citie-background-default)',
        borderRadius: 'var(--citie-radius-xl)',
      }}
    >
      {[
        { rotulo: 'Sem sombra', sombra: 'none', papel: 'Linha de tabela' },
        { rotulo: 'raised', sombra: 'var(--citie-shadow-raised)', papel: 'Card em repouso' },
        { rotulo: 'overlay', sombra: 'var(--citie-shadow-overlay)', papel: 'Menu, tooltip' },
        { rotulo: 'dialog', sombra: 'var(--citie-shadow-dialog)', papel: 'Diálogo, drawer' },
      ].map((degrau) => (
        <div
          key={degrau.rotulo}
          style={{
            inlineSize: '160px',
            background: 'var(--citie-background-surface)',
            borderRadius: 'var(--citie-radius-lg)',
            padding: 'var(--citie-spacing-4)',
            boxShadow: degrau.sombra,
            fontFamily: 'var(--citie-font-ui)',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 'var(--citie-font-size-body-sm)',
              fontWeight: 'var(--citie-font-weight-title)',
              color: 'var(--citie-text-primary)',
            }}
          >
            {degrau.rotulo}
          </p>
          <p
            style={{
              margin: 'var(--citie-spacing-1) 0 0',
              fontSize: 'var(--citie-font-size-body-xs)',
              color: 'var(--citie-text-secondary)',
            }}
          >
            {degrau.papel}
          </p>
        </div>
      ))}
    </div>
  ),
};

export const Foco: Story = {
  name: 'Anel de foco',
  render: () => (
    <Bloco
      titulo="Foco"
      descricao="Um anel para toda a interface, aplicado como sombra, e a variante de perigo para o campo inválido. Quem navega por teclado precisa saber onde está a cada tabulação, e em sistema público essa é a forma de navegação de parte real dos servidores."
    >
      <TabelaDeTokens tokens={FOCO} especie="foco" legenda="Token de foco" />

      <ul
        style={{
          fontFamily: 'var(--citie-font-ui)',
          fontSize: 'var(--citie-font-size-body-md)',
          color: 'var(--citie-text-base)',
          maxInlineSize: '72ch',
          margin: 'var(--citie-spacing-4) 0 0',
          paddingInlineStart: 'var(--citie-spacing-6)',
          display: 'grid',
          gap: 'var(--citie-spacing-3)',
        }}
      >
        <li>
          <strong>O anel usa `box-shadow` e dispensa o `outline`.</strong> O contorno padrão do
          navegador é desenhado em cor fixa e some sobre fundo escuro, além de acompanhar a caixa
          retangular do elemento em vez do raio da borda. Como sombra, o anel herda o token de
          marca, acompanha a troca de tema e contorna o raio do controle.
        </li>
        <li>
          <strong>O anel aparece em `:focus-visible`, e não em `:focus`.</strong> Com `:focus`, o
          anel pisca a cada clique de mouse em qualquer botão, e o desenvolvedor seguinte remove o
          foco inteiro para se livrar do ruído. `:focus-visible` deixa o navegador decidir: teclado
          mostra, ponteiro fica quieto.
        </li>
        <li>
          <strong>O alvo focável precisa ser alcançável.</strong> Anel bonito em elemento que a
          tabulação nunca visita não cumpre a WCAG 2.4.7. Se um elemento recebe clique, ele precisa
          ser botão, link ou campo, com ordem de tabulação natural. Área rolável também entra na
          conta, porque precisa receber foco para ser rolada pelo teclado (WCAG 2.1.1).
        </li>
      </ul>
    </Bloco>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const estilo = getComputedStyle(canvasElement.ownerDocument.documentElement);
    // Anel de 3px desenhado como sombra, e não como contorno do navegador.
    await expect(estilo.getPropertyValue('--citie-state-focus-ring')).toContain('0 0 0 3px');
    await expect(canvas.getByText('--citie-state-focus-ring')).toBeVisible();
  },
};

export const FocoPorTeclado: Story = {
  name: 'Foco · percorra com Tab',
  parameters: {
    docs: {
      description: {
        story:
          'Clique em qualquer ponto vazio do quadro e pressione Tab repetidamente. O anel percorre os controles na ordem em que eles aparecem, e cada um mostra o mesmo anel apesar de terem formatos diferentes. Clique com o mouse em qualquer um dos controles: o anel fica quieto, porque a regra é `:focus-visible`.',
      },
    },
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: 'var(--citie-spacing-5)',
        maxInlineSize: '440px',
        padding: 'var(--citie-spacing-6)',
        background: 'var(--citie-background-surface)',
        border: '1px solid var(--citie-border-default)',
        borderRadius: 'var(--citie-radius-xl)',
      }}
    >
      <Input label="Nome do servidor" placeholder="Maria Souza" />
      <Select
        label="Município"
        options={[
          { value: 'sl', label: 'São Luís' },
          { value: 'im', label: 'Imperatriz' },
          { value: 'cx', label: 'Caxias' },
        ]}
      />
      <Checkbox label="Encaminhar por e-mail depois de salvar" />
      <div style={{ display: 'flex', gap: 'var(--citie-spacing-3)', alignItems: 'center' }}>
        <Button variant="primary">Salvar solicitação</Button>
        <Button variant="secondary">Cancelar</Button>
      </div>
      <p
        style={{
          margin: 0,
          fontFamily: 'var(--citie-font-ui)',
          fontSize: 'var(--citie-font-size-body-sm)',
          color: 'var(--citie-text-secondary)',
        }}
      >
        Processo <Link href="#processo-2026-0481">2026/0481</Link> aguardando parecer.
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Cinco paradas de tabulação no quadro: campo, seleção, marcação, dois botões e o link.
    await expect(canvas.getByLabelText(/Nome do servidor/)).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Salvar solicitação' })).toBeVisible();
    await expect(canvas.getByRole('link', { name: '2026/0481' })).toBeVisible();
  },
};

export const PorContexto: Story = {
  name: 'Escolha por contexto',
  parameters: {
    docs: {
      description: {
        story:
          'Entre pela situação de tela quando você não souber o nome do degrau. A coluna da direita indica onde o mesmo degrau já está aplicado no catálogo, para servir de referência de implementação.',
      },
    },
  },
  render: () => (
    <Bloco
      titulo="Da situação para o degrau"
      descricao="A dúvida frequente aparece entre `raised` e `overlay`. A pergunta que separa os dois: o elemento fecha sozinho quando a pessoa clica fora dele?"
    >
      <TabelaDeContexto
        colunaDoValor="Degrau"
        legenda="Elevação por contexto de tela"
        linhas={[
          {
            contexto: 'Linha de tabela',
            valor: 'sem sombra',
            exemplo: 'Table, TreeTable, Timeline, item de Listbox',
          },
          {
            contexto: 'Card em repouso',
            valor: 'shadow-raised',
            exemplo: 'Card, Widget, KpiFaixa, Chart, trilho de Tabs',
          },
          {
            contexto: 'Card sob o ponteiro',
            valor: 'shadow-overlay',
            exemplo: 'Card clicável, que sobe um degrau no hover',
          },
          {
            contexto: 'Menu aberto',
            valor: 'shadow-overlay',
            exemplo: 'Menu, Menubar, MegaMenu, TieredMenu, ContextMenu, Dock',
          },
          {
            contexto: 'Dropdown de campo',
            valor: 'shadow-overlay',
            exemplo: 'Select, MultiSelect, CascadeSelect, TreeSelect, AutoComplete, DatePicker',
          },
          {
            contexto: 'Dica flutuante',
            valor: 'shadow-overlay',
            exemplo: 'Tooltip, ConfirmPopup, mensagem de Feedback',
          },
          {
            contexto: 'Diálogo modal',
            valor: 'shadow-dialog',
            exemplo: 'Dialog e ConfirmDialog, com `scrim` por trás',
          },
          {
            contexto: 'Drawer lateral',
            valor: 'shadow-dialog',
            exemplo: 'Drawer em qualquer uma das quatro bordas',
          },
          {
            contexto: 'Qualquer alvo focado',
            valor: 'state-focus-ring',
            exemplo: '64 arquivos do catálogo aplicam este anel em `:focus-visible`',
          },
        ]}
      />
    </Bloco>
  ),
};

export const RegraDeUmDegrau: Story = {
  name: 'Regra · um degrau no hover',
  parameters: {
    docs: {
      description: {
        story:
          'Passe o ponteiro sobre os dois cards. O da esquerda sai de `raised` e chega em `overlay`, um degrau, e continua se lendo como card. O da direita salta para `dialog` e passa a parecer camada modal enquanto o ponteiro estiver por cima, o que desmente a hierarquia de profundidade do resto da tela.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--citie-spacing-5)', maxInlineSize: '560px' }}>
      <style>{`
        .citie-doc-palco {
          background: var(--citie-background-default);
          border-radius: var(--citie-radius-xl);
          padding: var(--citie-spacing-6);
        }
        .citie-doc-elev {
          background: var(--citie-background-surface);
          border-radius: var(--citie-radius-lg);
          padding: var(--citie-spacing-5);
          font-family: var(--citie-font-ui);
          color: var(--citie-text-base);
          box-shadow: var(--citie-shadow-raised);
          transition: box-shadow var(--citie-motion-rapido) var(--citie-easing-padrao);
        }
        .citie-doc-elev--certo:hover { box-shadow: var(--citie-shadow-overlay); }
        .citie-doc-elev--errado:hover { box-shadow: var(--citie-shadow-dialog); }
        @media (prefers-reduced-motion: reduce) {
          .citie-doc-elev { transition: none; }
        }
      `}</style>

      <Bloco titulo="Um degrau" descricao="De `raised` para `overlay`. O card continua sendo card.">
        <div className="citie-doc-palco">
          <div className="citie-doc-elev citie-doc-elev--certo">
            Solicitação 2026/0481 aguardando parecer.
          </div>
        </div>
      </Bloco>

      <Bloco
        titulo="Dois degraus"
        descricao="De `raised` para `dialog`. A sombra promete bloqueio de fluxo que o card não entrega."
      >
        <div className="citie-doc-palco">
          <div className="citie-doc-elev citie-doc-elev--errado">
            Solicitação 2026/0481 aguardando parecer.
          </div>
        </div>
      </Bloco>
    </div>
  ),
};
