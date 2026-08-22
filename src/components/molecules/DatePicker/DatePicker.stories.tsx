import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { DatePicker, dataPorExtenso, formatarData, gradeDoMes } from './DatePicker';

// Data fixa para a story ser determinística no snapshot e no teste.
const HOJE = new Date(2026, 2, 15);

const meta = {
  title: 'Moléculas/Campos/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Seleção de data. Spec: `03-components/date-picker.md` v2.0.0. Equivalente PrimeNG: `p-datepicker`. Exibição sempre em dd/mm/aaaa.',
          '',
          '**Quando usar:** a data precisa ser situada no calendário para ser respondida. Data de saída de um encaminhamento, agendamento de perícia e prazo de entrega dependem de saber em que dia da semana caem, se há feriado por perto e quantos dias faltam. O painel responde isso; um campo de texto não.',
          '',
          '**Quando não usar:**',
          '',
          '- **Data de nascimento e outras datas distantes que a pessoa já sabe de cor.** O campo deste componente é somente leitura e o cabeçalho do painel navega de mês em mês, sem seletor de ano: chegar a 14/07/1962 a partir do mês corrente pede centenas de cliques, e não existe caminho de digitação para escapar disso. Use `Moléculas/Campos/Input` com máscara dd/mm/aaaa.',
          '- **Só o mês e o ano importam.** Competência de folha ("Março/2025") não tem dia, e o calendário obriga a escolher um, o que grava no processo um dado que ninguém informou. Use `Moléculas/Campos/Input` com máscara mm/aaaa, ou dois `Moléculas/Campos/Select` para mês e ano.',
          '- **Período com início e fim.** Este componente grava uma data por vez. Monte dois campos rotulados "De" e "Até", com validação de ordem entre eles, e mostre o intervalo escolhido em texto abaixo. Em barra de filtros, o par pertence a `Organismos/Busca/FilterBar`.',
          '- **A resposta é uma faixa nomeada.** "Últimos 30 dias", "Este mês" e "Este ano" são escolhas de conjunto fechado. Use `Moléculas/Campos/SelectButton` ou `Moléculas/Campos/Select`, e ofereça o calendário só na opção "Período personalizado".',
          '- **Hora, ou data com hora.** O painel cobre apenas o dia. Colete a hora em campo separado.',
          '- **Exibir uma data já registrada.** Campo com calendário sugere que o valor é editável. Para leitura, use texto simples, `Átomos/Marcadores/Tag` ou `Organismos/Histórico/Timeline`.',
          '',
          'Observação que pesa na escolha: como o campo é somente leitura, o calendário é o único caminho até o valor, inclusive para quem usa teclado ou leitor de tela. Isso é aceitável para datas próximas, que o painel resolve com poucas teclas (setas andam entre dias, Page Up e Page Down trocam de mês), e vira barreira para qualquer data fora do horizonte de alguns meses.',
        ].join('\n'),
      },
    },
  },
  args: { label: 'Data de saída', hoje: HOJE },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Estado · default',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText('Data de saída');
    // O placeholder mostra o formato com "Ex.:".
    await expect(campo).toHaveAttribute('placeholder', 'Ex.: 15/03/2026');

    // Armadilha do `readonly` neste componente, e a razão de a família de campo
    // pintar o consolidado por CLASSE e nunca pelo pseudo `:read-only`: o
    // campo-gatilho carrega o atributo sempre, porque o valor entra pelo
    // calendário e não pela digitação. Ele é porta de entrada de edição, e o
    // pseudo o pintaria de dado decidido. A prova é a superfície: aqui o campo
    // continua cavado com o poço da família, com a mesma tinta do token.
    await expect(campo).toHaveAttribute('readonly');
    await expect(campo).not.toHaveClass('citie-field-control--readonly');
    const poco = getComputedStyle(campo).getPropertyValue('--citie-shadow-poco').trim();
    const sombra = getComputedStyle(campo).boxShadow;
    await expect(sombra).toContain(poco.slice(poco.indexOf('rgba')));
    await expect(sombra).toContain('inset');
  },
};

export const Aberto: Story = {
  name: 'Estado · calendário aberto',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByLabelText('Data de saída'));

    const painel = canvas.getByRole('dialog', { name: 'Calendário de data de saída' });

    // O `waitFor` abaixo tem causa nomeada. O painel entra pela animação
    // `citie-calendario-entrada`, que parte de opacidade zero, e "visível" para
    // o matcher inclui opacidade maior que zero. No quadro seguinte ao clique o
    // elemento está no DOM, montado e ainda transparente, então uma asserção
    // síncrona fotografaria o primeiro quadro da entrada e acusaria painel
    // invisível onde havia painel entrando. Sob movimento reduzido a animação
    // nem existe, e a espera resolve na primeira tentativa.
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      await expect(getComputedStyle(painel).animationName).toBe('citie-calendario-entrada');
    }
    await waitFor(() => expect(painel).toBeVisible());
    await expect(canvas.getByText('março de 2026')).toBeVisible();

    // O dia de hoje é anunciado com a data completa por extenso.
    const hoje = canvas.getByRole('button', { name: '15 de março de 2026' });
    await expect(hoje).toHaveAttribute('aria-current', 'date');
  },
};

export const Selecao: Story = {
  name: 'Estado · selecionado',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText('Data de saída');

    await userEvent.click(campo);
    await userEvent.click(canvas.getByRole('button', { name: '20 de março de 2026' }));

    await expect(campo).toHaveValue('20/03/2026');
    // O painel fecha ao escolher a data.
    await expect(canvas.queryByRole('dialog')).toBeNull();
  },
};

export const NavegacaoPorTeclado: Story = {
  name: 'A11y · navegação por teclado',
  parameters: {
    docs: {
      description: {
        story:
          'Setas andam entre os dias, Page Up e Page Down trocam de mês, Enter seleciona e Esc fecha.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText('Data de saída');

    await userEvent.click(campo);
    await expect(canvas.getByRole('button', { name: '15 de março de 2026' })).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('button', { name: '16 de março de 2026' })).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('button', { name: '23 de março de 2026' })).toHaveFocus();

    await userEvent.keyboard('{PageDown}');
    await expect(canvas.getByText('abril de 2026')).toBeVisible();

    await userEvent.keyboard('{Escape}');
    await expect(canvas.queryByRole('dialog')).toBeNull();
  },
};

export const DiasForaDoMes: Story = {
  name: 'Regra · dias fora do mês',
  parameters: {
    docs: {
      description: {
        story: 'Dias de preenchimento do mês vizinho aparecem em cor de desabilitado e não clicam.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByLabelText('Data de saída'));

    // Março de 2026 começa num domingo, então a grade puxa o fim de fevereiro.
    const grade = gradeDoMes(HOJE);
    await expect(grade).toHaveLength(42);
    await expect(canvas.getByRole('button', { name: '4 de abril de 2026' })).toBeDisabled();
  },
};

export const Invalido: Story = {
  name: 'Estado · inválido',
  args: {
    label: 'Data final',
    valorInicial: new Date(2026, 2, 10),
    error: 'Data final anterior à data inicial. Ajuste o período.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText('Data final');

    await expect(campo).toHaveAttribute('aria-invalid', 'true');
    // A data digitada é preservada no erro.
    await expect(campo).toHaveValue('10/03/2026');
  },
};

export const Desabilitado: Story = {
  name: 'Estado · desabilitado',
  args: { disabled: true, valorInicial: HOJE },
};

export const SomenteLeitura: Story = {
  name: 'Estado · somente leitura',
  args: {
    label: 'Data de homologação',
    valorInicial: HOJE,
    readOnly: true,
    helper: 'Registrada no ato da homologação. Não pode ser alterada.',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Data consolidada: o campo continua focável, selecionável e copiável, o calendário não abre e o botão de abrir sai da árvore, porque um gatilho que não dispara é uma promessa falsa. Diferente de desabilitado, que tira o campo da ordem de Tab e desbota a tinta.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText('Data de homologação');

    await expect(campo).not.toBeDisabled();
    await expect(campo).toHaveValue('15/03/2026');

    // O gatilho de calendário não existe no consolidado.
    await expect(
      canvas.queryByRole('button', { name: /Escolher data de homologação/ }),
    ).toBeNull();

    // Clicar no campo não abre o painel.
    await userEvent.click(campo);
    await expect(canvas.queryByRole('dialog')).toBeNull();

    // E o campo continua na ordem de foco.
    await expect(campo).toHaveFocus();

    // A superfície acompanha o sentido: aqui o campo tem a classe de
    // consolidado, então o poço é aplainado com a sombra nula VÁLIDA. Superfície
    // que não recebe conteúdo não tem por que parecer cavada. O contraste com a
    // story "Estado · default", onde o mesmo componente carrega o atributo
    // `readonly` e continua cavado, é o que prova que a pintura depende da
    // classe e nunca do pseudo `:read-only`.
    await expect(campo).toHaveClass('citie-field-control--readonly');
    await expect(getComputedStyle(campo).boxShadow).toContain('rgba(0, 0, 0, 0) 0px 0px 0px 0px');

    // Consolidado é dado para ser lido e copiado: a seleção do usuário pega a
    // data inteira, e o valor segue disponível para colar no ofício.
    await userEvent.tripleClick(campo);
    await expect((campo as HTMLInputElement).selectionStart).toBe(0);
    await expect((campo as HTMLInputElement).selectionEnd).toBe('15/03/2026'.length);
  },
};

export const Intervalo: Story = {
  name: 'Combinação · intervalo',
  parameters: {
    docs: {
      description: {
        story: 'As duas pontas são nomeadas, nunca "Data 1" e "Data 2".',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: 16 }}>
      <DatePicker {...args} label="Data inicial" />
      <DatePicker {...args} label="Data final" />
    </div>
  ),
  play: async () => {
    await expect(formatarData(HOJE)).toBe('15/03/2026');
    await expect(dataPorExtenso(HOJE)).toBe('15 de março de 2026');
  },
};
