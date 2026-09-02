import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { InputGroup, InputGroupAdorno, InputGroupCampo } from './InputGroup';
import { Button } from '../../atoms/Button/Button';

const meta = {
  title: 'Moléculas/Campos/InputGroup',
  component: InputGroup,
  tags: ['autodocs', 'molecule', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component:
          'Campo com adornos emendados: unidade antes (`R$`), sufixo depois (`%`), prefixo fixo (`SES-`) ou botão de ação colado. O contorno do campo é um só, desenhado pelo trilho do grupo, então a junção não duplica borda nem arredonda canto interno; e o anel de foco é do grupo inteiro, porque anel parcial numa peça emendada lê como defeito.\n\nCompõe o mesmo primitivo `Field` do `Moléculas/Campos/Input`, sem alterá-lo: rótulo, helper, erro, altura e estados são idênticos aos de um campo solto na mesma tela. O nome acessível do controle segue sendo o `label`; o adorno textual é decorativo e sai da árvore de acessibilidade; botão de ação entra como `Átomos/Ações/Button` comum, com nome e parada de Tab próprios.\n\n**Quando não usar:** campo simples sem adorno é o `Moléculas/Campos/Input`; busca com envio é a `Moléculas/Busca/Search`, que já resolve o par campo e ação com semântica de busca; valor monetário só de leitura é o `Moléculas/Visualização/ValorMonetario`. Não usar para emendar dois campos de dados diferentes (CEP e número, DDD e telefone): cada dado tem o próprio rótulo e o próprio erro, e a emenda esconderia qual metade falhou. E se a unidade for essencial para decidir o que digitar, ela pertence ao `label` ou ao `helper`, que chegam a todo mundo, não só a quem enxerga o adorno.',
      },
    },
  },
  args: { label: 'Valor da diária', children: null },
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UnidadeMonetaria: Story = {
  name: 'InputGroup · unidade antes, sufixo depois',
  render: (args) => (
    <div style={{ width: 320 }}>
      <InputGroup {...args} helper="Valor em reais, por diária concedida">
        <InputGroupAdorno>R$</InputGroupAdorno>
        <InputGroupCampo inputMode="decimal" placeholder="0,00" />
        <InputGroupAdorno>/dia</InputGroupAdorno>
      </InputGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // O nome acessível do controle é o label do grupo, nunca o adorno.
    const campo = canvas.getByRole('textbox', { name: 'Valor da diária' });
    await userEvent.type(campo, '185,00');
    await expect(campo).toHaveValue('185,00');

    // Adorno decorativo fora da árvore de acessibilidade.
    const adornos = canvasElement.querySelectorAll('.citie-input-group-trilho__adorno');
    await expect(adornos).toHaveLength(2);
    for (const adorno of adornos) {
      await expect(adorno).toHaveAttribute('aria-hidden', 'true');
    }
  },
};

export const AnelDoGrupo: Story = {
  name: 'InputGroup · anel de foco do grupo inteiro',
  parameters: {
    docs: {
      description: {
        story:
          'Foco no controle acende o trilho todo. Foco no botão de ação acende só o botão, que tem anel e nome próprios: são duas paradas de Tab, cada uma com o seu contorno.',
      },
    },
  },
  render: (args) => (
    <div style={{ width: 360 }}>
      <InputGroup {...args} label="Número do processo" helper="Formato 0000000/2025">
        <InputGroupAdorno>SES-</InputGroupAdorno>
        <InputGroupCampo placeholder="0000000/2025" />
        <Button variant="secondary" onClick={() => {}}>
          Localizar
        </Button>
      </InputGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByRole('textbox', { name: 'Número do processo' });
    const botao = canvas.getByRole('button', { name: 'Localizar' });
    const trilho = canvasElement.querySelector<HTMLElement>('.citie-input-group-trilho')!;

    // Em repouso a peça de dentro já não tem poço próprio: quem está emendado
    // ao trilho pertence ao plano dele. O valor exato importa e está medido
    // aqui, e não afrouxado: é a sombra NULA VÁLIDA, `0 0 0 0 transparent`,
    // que o navegador computa como o zero transparente abaixo. Escrever `none`
    // no lugar dela invalidaria a lista do anel de foco (ver a armadilha
    // documentada em `primitives/Field/Field.css`).
    await expect(getComputedStyle(campo).boxShadow).toBe('rgba(0, 0, 0, 0) 0px 0px 0px 0px');

    // Foco no controle: o anel é do trilho, e a peça de dentro entrega o dela.
    await userEvent.tab();
    await expect(campo).toHaveFocus();
    await expect(trilho.classList.contains('citie-input-group-trilho--focado')).toBe(true);
    // O anel entra em transição de 140ms: espera o valor computado chegar.
    // O trilho em repouso já carrega o poço da família de campo, então "não é
    // `none`" deixou de provar o anel. A prova agora é a cor do próprio token:
    // o anel aparece quando o box-shadow computado contém a tinta dele.
    const anel = getComputedStyle(trilho).getPropertyValue('--citie-state-focus-ring').trim();
    const corDoAnel = anel.slice(anel.indexOf('rgb'));
    await waitFor(() => expect(getComputedStyle(trilho).boxShadow).toContain(corDoAnel));
    // Sob foco a regra do trilho apaga a sombra do controle de vez, e o
    // computado assenta em `none`. O `waitFor` está aqui por medida, e não por
    // superstição: a transição de 140ms da família de campo interpola entre a
    // nula válida e `none`, e no quadro seguinte ao Tab o computado ainda é o
    // zero transparente do meio do caminho. Sem a espera, a asserção fotografa
    // o percurso e acusa defeito onde só havia animação em curso.
    await waitFor(() => expect(getComputedStyle(campo).boxShadow).toBe('none'));

    // Foco no botão: o trilho apaga e o anel passa a ser do botão.
    await userEvent.tab();
    await expect(botao).toHaveFocus();
    await expect(trilho.classList.contains('citie-input-group-trilho--focado')).toBe(false);
    await waitFor(() => expect(getComputedStyle(botao).boxShadow).not.toBe('none'));
  },
};

export const Juncoes: Story = {
  name: 'InputGroup · junções sem borda dupla',
  parameters: {
    docs: {
      description: {
        story:
          'O que se mede aqui é a regra construtiva: raio só nas extremidades (concêntrico, um pixel menor que o do trilho), peça interna reta, e uma única linha de 1px por junção.',
      },
    },
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <InputGroup {...args} label="Percentual de reajuste">
        <InputGroupCampo inputMode="numeric" placeholder="0" />
        <InputGroupAdorno>%</InputGroupAdorno>
      </InputGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const trilho = canvasElement.querySelector<HTMLElement>('.citie-input-group-trilho')!;
    const campo = canvasElement.querySelector<HTMLElement>('.citie-field-control')!;
    const adorno = canvasElement.querySelector<HTMLElement>('.citie-input-group-trilho__adorno')!;

    // O contorno é um: o trilho tem borda e raio; o controle interno, nenhum.
    const estiloTrilho = getComputedStyle(trilho);
    await expect(estiloTrilho.borderTopWidth).toBe('1px');
    await expect(estiloTrilho.borderTopLeftRadius).toBe('10px');
    const estiloCampo = getComputedStyle(campo);
    await expect(estiloCampo.borderTopWidth).toBe('0px');
    // Extremidade inicial: raio concêntrico de 9px (10 do trilho menos a borda).
    await expect(estiloCampo.borderTopLeftRadius).toBe('9px');
    await expect(estiloCampo.borderTopRightRadius).toBe('0px');

    // Uma linha por junção: só o lado inicial da peça seguinte tem borda.
    const estiloAdorno = getComputedStyle(adorno);
    await expect(estiloAdorno.borderLeftWidth).toBe('1px');
    await expect(estiloAdorno.borderRightWidth).toBe('0px');
    await expect(estiloAdorno.borderTopWidth).toBe('0px');
  },
};

export const ErroEDesabilitado: Story = {
  name: 'InputGroup · erro e desabilitado',
  render: (args) => (
    <div style={{ width: 320, display: 'grid', gap: 'var(--citie-spacing-5)' }}>
      <InputGroup
        {...args}
        required
        error="Valor acima do teto da diária. Informe até R$ 380,00 ou anexe a justificativa."
      >
        <InputGroupAdorno>R$</InputGroupAdorno>
        <InputGroupCampo inputMode="decimal" defaultValue="512,00" />
      </InputGroup>
      <InputGroup {...args} label="Valor de referência" helper="Definido pela tabela vigente">
        <InputGroupAdorno>R$</InputGroupAdorno>
        <InputGroupCampo disabled defaultValue="380,00" />
      </InputGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Erro: o controle declara aria-invalid, a mensagem está ligada por
    // describedby e o contorno do trilho vira o de perigo.
    const comErro = canvas.getByRole('textbox', { name: /Valor da diária/ });
    await expect(comErro).toHaveAttribute('aria-invalid', 'true');
    await expect(comErro).toHaveAccessibleDescription(/acima do teto da diária/);
    const trilhos = canvasElement.querySelectorAll<HTMLElement>('.citie-input-group-trilho');
    await expect(
      trilhos[0].classList.contains('citie-input-group-trilho--invalido'),
    ).toBe(true);

    // Desabilitado: a peça desabilita e o trilho inteiro assume a leitura.
    const desabilitado = canvas.getByRole('textbox', { name: 'Valor de referência' });
    await expect(desabilitado).toBeDisabled();
    const fundoTrilho = getComputedStyle(trilhos[1]).backgroundColor;
    const fundoSurface = getComputedStyle(trilhos[0]).backgroundColor;
    await expect(fundoTrilho).not.toBe(fundoSurface);
  },
};
