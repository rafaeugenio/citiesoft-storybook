import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Input } from './Input';
import { corDeclaradaNaRegra, corDoToken } from '../../primitives/Field/medicao';

const meta = {
  title: 'Moléculas/Campos/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Família de entrada de linha. Spec: `03-components/inputs.md` v2.0.0. Equivalente PrimeNG: `pInputText`, `p-inputnumber`, `p-password`, `p-inputgroup`.',
          '',
          '**O Input é o padrão de entrada do DS e o ponto de partida de qualquer campo.** Ele é a escolha certa quando o valor é texto livre de uma linha, sem conjunto fechado de respostas: nome, matrícula, número de ofício, valor monetário, senha. Todo campo especializado abaixo existe porque digitar livremente naquele dado produziria erro caro.',
          '',
          '**Quando não usar:**',
          '',
          '- **O valor pertence a uma lista fechada.** Digitar "S. Luis", "Sao Luiz" e "São Luís" gera três municípios distintos no processo, e a correção depois exige abrir chamado. Use `Moléculas/Campos/Select` para lista plana, `Moléculas/Campos/AutoComplete` quando o catálogo for grande demais para rolar, `Moléculas/Campos/CascadeSelect` ou `Moléculas/Campos/TreeSelect` quando a lista for hierárquica, e `Moléculas/Campos/MultiSelect` quando couber mais de um valor.',
          '- **O valor é uma data.** Data digitada sem máscara chega ao processo em formatos misturados. Use `Moléculas/Campos/DatePicker`, que exibe e devolve sempre em dd/mm/aaaa.',
          '- **O texto passa de uma linha.** Justificativa de afastamento ou parecer técnico truncam no Input, e a pessoa perde de vista o que já escreveu. Use `Moléculas/Campos/Textarea`.',
          '- **O valor é um código curto de verificação.** Use `Moléculas/Campos/InputOtp`, que divide o código em casas e avança sozinho.',
          '- **O campo filtra uma listagem em vez de gravar dado.** Use `Moléculas/Busca/Search`, que já traz o ícone, o botão de limpar, a contagem de resultados em região `aria-live` e o mínimo de caracteres.',
          '- **Só há duas ou três respostas possíveis.** Use `Átomos/Escolha/Checkbox`, `Átomos/Escolha/Switch` ou `Moléculas/Escolha/RadioGroup`, que mostram as alternativas sem exigir que a pessoa adivinhe o vocabulário aceito.',
          '',
          '**Sobre o rótulo:** o Input embute rótulo fixo acima do campo pelo `FieldWrapper`, que é o padrão do DS. Se a tela precisar economizar altura, `Moléculas/Campos/IftaLabel` e `Moléculas/Campos/FloatLabel` são as exceções documentadas, e a escolha vale para a tela inteira.',
          '',
          '**Sobre o `addonStart` e o `addonEnd`:** eles marcam unidade fixa ("R$", "@", "kg") e não substituem o rótulo. Um addon que precise mudar o significado do campo pede um campo separado.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['small', 'normal', 'large'] },
  },
  args: {
    label: 'Nome do colaborador',
    placeholder: 'Ex.: Maria Souza Lima',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Estado · default',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Label associado ao campo: o placeholder nunca substitui o label.
    await expect(canvas.getByLabelText('Nome do colaborador')).toBeVisible();
  },
};

export const ComHelper: Story = {
  name: 'Estado · com helper text',
  args: {
    label: 'Matrícula',
    placeholder: 'Ex.: 00123456',
    helper: 'Oito dígitos, sem pontos ou traços.',
  },
};

export const Obrigatorio: Story = {
  name: 'Estado · obrigatório',
  args: { required: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText(/Nome do colaborador/)).toHaveAttribute(
      'aria-required',
      'true',
    );
  },
};

export const Preenchido: Story = {
  name: 'Estado · preenchido',
  args: { defaultValue: 'Maria Souza Lima' },
};

export const PreenchidoContraVazio: Story = {
  name: 'Estado · preenchido contra vazio',
  parameters: {
    docs: {
      description: {
        story:
          'Campo com valor endurece a borda para o degrau de hover. Numa tela com trinta campos, o que falta preencher se distingue de relance, sem ler campo a campo.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 360 }}>
      <Input {...args} label="Vazio" />
      <Input {...args} label="Preenchido" defaultValue="Maria Souza Lima" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const vazio = canvas.getByLabelText('Vazio');
    const preenchido = canvas.getByLabelText('Preenchido');

    // A pista tem medida: as bordas computadas dos dois campos divergem.
    const bordaVazio = getComputedStyle(vazio).borderTopColor;
    const bordaPreenchido = getComputedStyle(preenchido).borderTopColor;
    await expect(bordaPreenchido).not.toBe(bordaVazio);
  },
};

export const DegrauDeHover: Story = {
  name: 'Regra · degrau de resposta ao ponteiro',
  parameters: {
    docs: {
      description: {
        story:
          'O ponteiro endurece a borda um degrau na mesma direção da escala, de 3,23:1 em repouso para 4,94:1 no claro e 5,37:1 no escuro, e o campo anuncia "editável" antes do clique. A regra anterior apontava para `--citie-border-strong`, que mede 1,43:1 sobre o branco: o campo respondia ao ponteiro apagando a própria fronteira, o que reprova na WCAG 1.4.11 e no e-MAG.\n\nO degrau tem dois donos, e esta story guarda os dois. O campo preenchido e o addon do grupo preenchido pintam pelo mesmo token do hover, então o VALOR do degrau é medido renderizado aqui, na cor computada. O ALVO das três regras de hover (campo solto, campo dentro do grupo e emenda do addon) é lido na folha de estilo viva e comparado com esse valor medido. Um ponteiro de verdade seria mais direto, e a nota em `primitives/Field/medicao.ts` conta por que ele não sobrevive à suíte completa.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 360 }}>
      <Input {...args} label="Vazio" placeholder="Ex.: 0481" />
      <Input {...args} label="Preenchido" placeholder="Ex.: 0481" defaultValue="2025/0481" />
      <Input
        {...args}
        label="Valor da diária"
        addonStart="R$"
        placeholder="Ex.: 1.234,56"
        defaultValue="1.234,56"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const vazio = canvas.getByLabelText('Vazio');
    const preenchido = canvas.getByLabelText('Preenchido');
    const addon = canvasElement.querySelector<HTMLElement>('.citie-input-group__addon')!;

    const degrau = corDoToken(vazio, '--citie-form-field-border-hover');
    const repouso = corDoToken(vazio, '--citie-form-field-border');
    const fronteiraApagada = corDoToken(vazio, '--citie-border-strong');

    // Metade 1, o VALOR: preenchido e hover são o mesmo degrau, e preenchido
    // pinta sem depender de ponteiro. A cor computada aqui é a que o olho vê.
    await expect(getComputedStyle(vazio).borderTopColor).toBe(repouso);
    await expect(getComputedStyle(preenchido).borderTopColor).toBe(degrau);
    await expect(getComputedStyle(addon).borderTopColor).toBe(degrau);

    // O degrau tem de endurecer contra o repouso, que é a direção que o
    // defeito invertia. Se alguém empatar os dois tokens, a pista some.
    await expect(degrau).not.toBe(repouso);
    await expect(degrau).not.toBe(fronteiraApagada);

    // Metade 2, o ALVO: cada regra de hover é lida na folha viva e tem de
    // apontar para o degrau medido acima. São três donos, porque o grupo com
    // addon tem especificidade maior e responde sozinho pelo campo e pela
    // emenda, que escurecem juntos: para quem preenche, o grupo É o campo.
    for (const [seletor, elemento] of [
      ['.citie-field-control:hover:not(', vazio],
      ['.citie-input-group:hover .citie-field-control', vazio],
      ['.citie-input-group:hover:has(', addon],
    ] as const) {
      await expect(corDeclaradaNaRegra(elemento, seletor)).toBe(degrau);
    }
  },
};

export const SemPlaceholder: Story = {
  name: 'Comparação · campo vazio com e sem placeholder',
  parameters: {
    docs: {
      description: {
        story:
          'A borda de preenchido é lida por `:placeholder-shown`, e controle sem `placeholder` nunca casa com esse pseudo. Por isso a regra exige `[placeholder]`: sem o guarda, um campo vazio sem placeholder apareceria com a borda endurecida e a tela mentiria sobre o que já foi preenchido, justamente na varredura de relance que a pista existe para servir. O preço é um falso negativo brando: o campo preenchido sem placeholder mantém a borda de repouso, e esse é o lado seguro para trocar. Os dois campos aqui estão vazios e têm de repousar na mesma borda.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 360 }}>
      <Input {...args} label="Com placeholder" placeholder="Ex.: 0481" />
      <Input {...args} label="Sem placeholder" placeholder={undefined} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const comPlaceholder = canvas.getByLabelText('Com placeholder');
    const semPlaceholder = canvas.getByLabelText('Sem placeholder');

    // O caso que o guarda protege: o atributo ausente é a condição do defeito.
    await expect(semPlaceholder).not.toHaveAttribute('placeholder');
    await expect(semPlaceholder).toHaveValue('');

    // Vazios os dois, então a borda de repouso é a mesma, e é a do token de
    // repouso. Comparar com o degrau de preenchido também, porque é ele que
    // vazaria para o campo sem placeholder se o guarda saísse.
    for (const campo of [comPlaceholder, semPlaceholder]) {
      await expect(getComputedStyle(campo).borderTopColor).toBe(
        corDoToken(campo, '--citie-form-field-border'),
      );
      await expect(getComputedStyle(campo).borderTopColor).not.toBe(
        corDoToken(campo, '--citie-form-field-border-hover'),
      );
    }
  },
};

export const Foco: Story = {
  name: 'Estado · foco por teclado',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText('Nome do colaborador');
    await userEvent.click(campo);
    await expect(campo).toHaveFocus();

    // "Diferente de `none`" não provava anel nenhum: o campo em repouso já tem
    // o poço, e a asserção passava verde com o foco quebrado. O que se mede
    // agora é a tinta do próprio token do anel dentro da sombra composta, e
    // que o poço continua ali embaixo, somado em vez de substituído.
    const anel = getComputedStyle(campo).getPropertyValue('--citie-state-focus-ring').trim();
    const poco = getComputedStyle(campo).getPropertyValue('--citie-shadow-poco').trim();
    await waitFor(() => {
      const sombra = getComputedStyle(campo).boxShadow;
      expect(sombra).toContain(anel.slice(anel.indexOf('rgba')));
      expect(sombra).toContain(poco.slice(poco.indexOf('rgba')));
    });
  },
};

export const Desabilitado: Story = {
  name: 'Estado · desabilitado',
  args: { disabled: true, defaultValue: 'Maria Souza Lima' },
};

export const SomenteLeitura: Story = {
  name: 'Estado · somente leitura',
  args: {
    label: 'Número do processo',
    defaultValue: '2025/0481',
    readOnly: true,
    helper: 'Número gerado na abertura. Não pode ser alterado.',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Estado distinto de desabilitado: recebe foco, permite selecionar e copiar, e o texto fica na tinta plena de leitura. Desabilitado diz "esta ação está indisponível"; somente leitura diz "este dado está consolidado". Número de processo homologado: o valor está decidido e segue disponível para ler e copiar.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText('Número do processo');

    // Consolidado: o campo segue habilitado e na ordem de Tab.
    await expect(campo).not.toBeDisabled();
    await expect(campo).toHaveAttribute('readonly');
    await userEvent.tab();
    await expect(campo).toHaveFocus();

    // Legível e intocável: digitar não altera o valor.
    await userEvent.keyboard('X');
    await expect(campo).toHaveValue('2025/0481');
  },
};

export const ConsolidadoContraIndisponivel: Story = {
  name: 'Comparação · somente leitura contra desabilitado',
  parameters: {
    docs: {
      description: {
        story:
          'Os dois estados existem lado a lado num processo administrativo e dizem coisas opostas. O número gerado na abertura está consolidado: continua na ordem de Tab, na tinta plena de leitura, e o usuário seleciona e copia o valor para colar no ofício. O campo desabilitado está indisponível: sai da ordem de Tab e a tinta desbota. Nesta story cada uma dessas diferenças aparece medida no valor computado dos dois campos.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 360 }}>
      <Input
        {...args}
        label="Número do processo"
        defaultValue="2025/0481"
        readOnly
        helper="Gerado na abertura. Selecione e copie para o ofício."
      />
      <Input
        {...args}
        label="Número do empenho"
        defaultValue="2025/0481"
        disabled
        helper="Disponível depois do aceite da nota."
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const consolidado = canvas.getByLabelText<HTMLInputElement>('Número do processo');
    const indisponivel = canvas.getByLabelText<HTMLInputElement>('Número do empenho');

    // Superfície em repouso: nenhum dos dois é cavado, porque nenhum recebe
    // conteúdo. O valor computado é a sombra NULA VÁLIDA dos dois lados.
    // A comparação é com o valor exato de propósito: foi um
    // `none` esperado por engano que derrubou a suíte nesta rodada, e a
    // armadilha está documentada em `primitives/Field/Field.css`.
    for (const campo of [consolidado, indisponivel]) {
      await expect(getComputedStyle(campo).boxShadow).toBe('rgba(0, 0, 0, 0) 0px 0px 0px 0px');
    }

    // Ordem de Tab: o consolidado recebe foco, o indisponível não existe para
    // o teclado, então o Tab passa direto por ele.
    await userEvent.tab();
    await expect(consolidado).toHaveFocus();

    // E receber foco acende o anel, mesmo com o poço zerado: é aqui que a
    // sombra nula válida se paga. Se ela fosse `none`, a lista `anel, none`
    // seria inválida inteira e o campo consolidado ficaria sem indicador de
    // foco, quebrando a WCAG 2.4.7 justamente no estado que existe para ser
    // navegado por teclado.
    const anel = getComputedStyle(consolidado).getPropertyValue('--citie-state-focus-ring').trim();
    const corDoAnel = anel.slice(anel.indexOf('rgba'));
    await waitFor(() => expect(getComputedStyle(consolidado).boxShadow).toContain(corDoAnel));

    await userEvent.tab();
    await expect(indisponivel).not.toHaveFocus();

    // Tinta: o consolidado fica na cor de leitura plena, o indisponível
    // desbota. As duas cores computadas divergem, e o mesmo valor "2025/0481"
    // aparece nos dois campos justamente para a diferença ser só de estado.
    const tintaConsolidado = getComputedStyle(consolidado).color;
    const tintaIndisponivel = getComputedStyle(indisponivel).color;
    await expect(tintaConsolidado).not.toBe(tintaIndisponivel);
    // "Tinta plena" tem uma régua ao lado: o rótulo do próprio campo, que é a
    // tinta de leitura da tela. O valor consolidado bate com ele.
    const rotulo = canvasElement.querySelector<HTMLElement>('.citie-field__label')!;
    await expect(tintaConsolidado).toBe(getComputedStyle(rotulo).color);

    // Copiar é o que o consolidado existe para permitir: uma seleção de
    // usuário pega o valor inteiro. No indisponível o gesto não seleciona
    // nada, que é o comportamento nativo de um campo fora de uso.
    await userEvent.tripleClick(consolidado);
    await expect(consolidado.selectionStart).toBe(0);
    await expect(consolidado.selectionEnd).toBe('2025/0481'.length);

    // O mesmo gesto no indisponível não seleciona nada: início e fim coincidem,
    // ou seja, existe cursor e não existe trecho para copiar.
    await userEvent.tripleClick(indisponivel);
    await expect(indisponivel.selectionStart).toBe(indisponivel.selectionEnd);
  },
};

export const Invalido: Story = {
  name: 'Estado · inválido',
  args: {
    label: 'CPF',
    defaultValue: '123.456.789-00',
    helper: 'Onze dígitos, com ou sem pontuação.',
    error: 'CPF inválido. Verifique os dígitos e tente novamente.',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Erro no padrão o que aconteceu mais como resolver. O valor digitado é preservado e o ícone de alerta acompanha o texto, porque a cor não pode ser o único indicador. A regra de preenchimento continua visível abaixo do erro, porque quem acabou de errar é quem mais precisa dela.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText('CPF');

    await expect(campo).toHaveAttribute('aria-invalid', 'true');
    await expect(campo).toHaveValue('123.456.789-00');

    // aria-describedby anuncia o erro primeiro e a regra de preenchimento
    // depois; as duas mensagens ficam visíveis ao mesmo tempo.
    const ids = (campo.getAttribute('aria-describedby') ?? '').split(' ');
    await expect(ids.length).toBe(2);
    await expect(canvasElement.querySelector(`[id="${ids[0]}"]`)).toHaveTextContent(
      'CPF inválido. Verifique os dígitos e tente novamente.',
    );
    await expect(canvasElement.querySelector(`[id="${ids[1]}"]`)).toHaveTextContent(
      'Onze dígitos, com ou sem pontuação.',
    );
    await expect(canvas.getByText('Onze dígitos, com ou sem pontuação.')).toBeVisible();
  },
};

export const Carregando: Story = {
  name: 'Estado · validação assíncrona',
  args: {
    label: 'Número do processo',
    defaultValue: '2025/0481',
    loading: true,
    helper: 'Conferindo o número no SIGEP.',
  },
};

export const Tamanhos: Story = {
  name: 'Tamanhos · 32 / 40 / 48px',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 360 }}>
      <Input {...args} size="small" label="Small" />
      <Input {...args} size="normal" label="Normal" />
      <Input {...args} size="large" label="Large" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const alturas = ['Small', 'Normal', 'Large'].map(
      (nome) => canvas.getByLabelText(nome).getBoundingClientRect().height,
    );
    await expect(alturas).toEqual([32, 40, 48]);
  },
};

export const Filled: Story = {
  name: 'Variante · filled',
  args: { filled: true },
  parameters: {
    docs: {
      description: {
        story:
          'Para formulários densos onde a borda some no fundo. Nunca misturar campo com borda e campo preenchido na mesma tela.',
      },
    },
  },
};

export const GrupoComPrefixo: Story = {
  name: 'Variante · InputGroup com prefixo',
  args: {
    label: 'Valor da diária',
    addonStart: 'R$',
    placeholder: 'Ex.: 1.234,56',
    helper: 'Formato pt-BR, com vírgula decimal.',
  },
};

export const GrupoComSufixo: Story = {
  name: 'Variante · InputGroup com sufixo',
  args: {
    label: 'Carga horária semanal',
    addonEnd: 'horas',
    placeholder: 'Ex.: 40',
  },
};

export const Senha: Story = {
  name: 'Variante · senha',
  args: {
    label: 'Nova senha',
    type: 'password',
    defaultValue: 'senhaforte123',
    helper: 'Mínimo de 8 caracteres, com letra e número.',
  },
};
