import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Editor } from './Editor';

const PARECER = `
<h2>Parecer técnico — Processo 2025/0481</h2>
<p>Trata-se de solicitação de custeio de Tratamento Fora do Domicílio (TFD)
apresentada pela servidora <strong>Maria de Fátima Souza</strong>, lotada na
Secretaria Municipal de Saúde, referente à competência 03/2025.</p>
<ul>
  <li>Laudo médico anexado e conferido com o CID informado.</li>
  <li>Comprovante de residência dentro do prazo de 90 dias.</li>
  <li>Vaga confirmada na unidade de referência em São Luís.</li>
</ul>
<p>Diante do exposto, opina-se pelo <strong>deferimento</strong> do pedido, com
concessão de 3 diárias e passagem de ida e volta.</p>
`.trim();

const meta = {
  title: 'Organismos/Entrada/Editor',
  component: Editor,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Editor de texto com barra de formatação. Página do Figma CitieOne `6738:22643` (❖ Editor).',
          '',
          'Variantes do arquivo cobertas: o componente `editor` (barra + área de conteúdo)',
          'e o conjunto `editor-toolbar-item`, com `Type` = Bold · Italic · Underline · List ·',
          'Link · Image · Code e `State` = Idle · Hover · Active. Os dois seletores da',
          'esquerda ("Normal" e "Sans Serif") também vêm do desenho.',
          '',
          '**Escopo, dito de forma direta.** O equivalente PrimeNG é o `p-editor`, que embrulha',
          'a biblioteca **Quill**. Este pacote não admite dependência nova, então aqui não há',
          'editor de texto rico de verdade: não há histórico de desfazer confiável, colagem',
          'sanitizada, listas aninhadas nem serialização em Delta. A implementação de produção',
          '**deve embrulhar o Quill**, como o PrimeNG faz, e reaproveitar este componente apenas',
          'como casca visual e contrato de acessibilidade.',
          '',
          '**API obsoleta.** A formatação usa `document.execCommand`, formalmente',
          'descontinuado. Foi aceito porque é a única forma de aplicar negrito, itálico,',
          'sublinhado e lista em um `contenteditable` sem trazer biblioteca, e porque o alvo',
          'aqui é a demonstração de acessibilidade. Toda chamada é protegida por checagem de',
          'existência e `try/catch`; onde o navegador não suportar, o botão ainda alterna o',
          'estado visual e o `aria-pressed`.',
          '',
          '**Acessibilidade.** A barra é `role="toolbar"` com nome acessível e roving tabindex',
          '(setas laterais andam em anel, Home e End vão às pontas, só um controle fica na',
          'ordem de tabulação). Cada botão tem `aria-label` e alvo de 32x32. Os cinco comandos',
          'com estado usam `aria-pressed`; Link e Imagem são ação pontual e por isso não o',
          'declaram. A área de edição é `role="textbox"` com `aria-multiline="true"`,',
          '`aria-labelledby` apontando para o rótulo visível e `tabindex="0"` mesmo desabilitada,',
          'porque ela rola.',
        ].join('\n'),
      },
    },
  },
  args: {
    label: 'Parecer técnico do processo',
  },
} satisfies Meta<typeof Editor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Estado · default',
  args: {
    valorInicial: PARECER,
    ajuda: 'O parecer é anexado ao processo e fica visível para a comissão.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const barra = canvas.getByRole('toolbar', { name: 'Formatação do texto' });
    // 7 comandos do Figma; os dois seletores não são botões.
    await expect(within(barra).getAllByRole('button')).toHaveLength(7);

    const area = canvas.getByRole('textbox', { name: 'Parecer técnico do processo' });
    await expect(area).toHaveAttribute('aria-multiline', 'true');
    await expect(area).toHaveTextContent('Processo 2025/0481');
  },
};

export const Vazio: Story = {
  name: 'Estado · vazio',
  args: {
    label: 'Justificativa do afastamento',
    placeholder: 'Descreva o motivo do afastamento e o período solicitado.',
    ajuda: 'Mínimo de 20 caracteres. A chefia imediata lê esta justificativa.',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Sem conteúdo, a área mostra o texto de apoio por pseudo-elemento. Ele não entra na árvore de acessibilidade, então o nome do campo continua vindo do rótulo visível.',
      },
    },
  },
};

export const ComandoAtivo: Story = {
  name: 'Estado · comando ativo',
  args: {
    label: 'Justificativa do afastamento',
    valorInicial:
      '<p>Participação na capacitação <strong>Gestão de Processos Administrativos</strong>, promovida pela Escola de Governo, em São Luís.</p>',
    estadosIniciais: { negrito: true },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Estado `Active` do `editor-toolbar-item`. O botão ganha fundo, borda e cor de marca — cor nunca é o único indicador — e anuncia `aria-pressed="true"`.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const negrito = canvas.getByRole('button', { name: 'Negrito' });
    await expect(negrito).toHaveAttribute('aria-pressed', 'true');

    // Ação pontual não declara estado: `aria-pressed` em Link seria mentira.
    await expect(canvas.getByRole('button', { name: 'Inserir link' })).not.toHaveAttribute(
      'aria-pressed',
    );
  },
};

export const SomenteLeitura: Story = {
  name: 'Estado · somente leitura',
  args: {
    valorInicial: PARECER,
    somenteLeitura: true,
    ajuda: 'Parecer homologado em 12/03/2025. Alterações exigem novo despacho.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const area = canvas.getByRole('textbox', { name: 'Parecer técnico do processo' });
    await expect(area).toHaveAttribute('aria-readonly', 'true');
    // O texto continua alcançável pelo teclado, porque a área rola.
    area.focus();
    await expect(area).toHaveFocus();
  },
};

export const Desabilitado: Story = {
  name: 'Estado · desabilitado',
  args: {
    valorInicial:
      '<p>Aguardando abertura da competência 04/2025 para edição do parecer.</p>',
    desabilitado: true,
  },
};

export const Invalido: Story = {
  name: 'Estado · inválido',
  args: {
    label: 'Justificativa do afastamento',
    valorInicial: '<p>Viagem.</p>',
    erro: 'Justificativa muito curta. Descreva o motivo em pelo menos 20 caracteres.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const area = canvas.getByRole('textbox', { name: 'Justificativa do afastamento' });
    await expect(area).toHaveAttribute('aria-invalid', 'true');
    await expect(area).toHaveAccessibleDescription(/pelo menos 20 caracteres/);
  },
};

export const BarraReduzida: Story = {
  name: 'Variante · barra reduzida',
  args: {
    label: 'Observação do lançamento',
    mostrarSeletores: false,
    comandos: ['negrito', 'italico', 'lista'],
    placeholder: 'Observação sobre a diária lançada na competência.',
    alturaDaArea: 120,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Campos secundários do sistema não precisam da barra inteira. Sem os seletores, o primeiro botão passa a ser o início do anel de navegação.',
      },
    },
  },
};

export const NavegacaoPorTeclado: Story = {
  name: 'Comportamento · navegação por teclado',
  args: {
    label: 'Observação do lançamento',
    mostrarSeletores: false,
    comandos: ['negrito', 'italico', 'lista', 'codigo'],
    alturaDaArea: 120,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Roving tabindex: as setas laterais andam em anel pela barra, Home e End vão às pontas, e só o controle com foco fica na ordem de tabulação.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const barra = canvas.getByRole('toolbar', { name: 'Formatação do texto' });
    const negrito = within(barra).getByRole('button', { name: 'Negrito' });
    const italico = within(barra).getByRole('button', { name: 'Itálico' });
    const codigo = within(barra).getByRole('button', { name: 'Bloco de código' });

    negrito.focus();
    await expect(negrito).toHaveAttribute('tabindex', '0');
    await expect(italico).toHaveAttribute('tabindex', '-1');

    await userEvent.keyboard('{ArrowRight}');
    await expect(italico).toHaveFocus();

    await userEvent.keyboard('{End}');
    await expect(codigo).toHaveFocus();

    // Anel: da última posição a seta direita volta para a primeira.
    await userEvent.keyboard('{ArrowRight}');
    await expect(negrito).toHaveFocus();

    await userEvent.keyboard('{End}');
    await userEvent.keyboard('{Home}');
    await expect(negrito).toHaveFocus();
  },
};

export const AlternarFormatacao: Story = {
  name: 'Comportamento · alternar formatação',
  args: {
    label: 'Observação do lançamento',
    mostrarSeletores: false,
    comandos: ['negrito', 'codigo'],
    valorInicial: '<p>Diária paga conforme portaria 118/2025.</p>',
    alturaDaArea: 120,
  },
  parameters: {
    docs: {
      description: {
        story:
          '`Bloco de código` não tem comando nativo equivalente, então serve para mostrar o contrato puro: o clique alterna `aria-pressed` e a classe de estado, sem depender de `execCommand`.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const codigo = canvas.getByRole('button', { name: 'Bloco de código' });

    await expect(codigo).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(codigo);
    await expect(codigo).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(codigo);
    await expect(codigo).toHaveAttribute('aria-pressed', 'false');
  },
};
