import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Accordion } from './Tabs';

const ITENS = [
  {
    id: 'elegibilidade',
    titulo: 'Critérios de elegibilidade',
    conteudo: 'O servidor precisa ter vínculo ativo e laudo emitido nos últimos 90 dias.',
  },
  {
    id: 'documentos',
    titulo: 'Documentos obrigatórios',
    conteudo: 'Laudo médico, comprovante de residência e documento de identidade.',
  },
  {
    id: 'prazos',
    titulo: 'Prazos de análise',
    conteudo: 'A regulação tem 48 horas para emitir o parecer após o recebimento.',
  },
];

const meta = {
  title: 'Moléculas/Contêineres/Accordion',
  component: Accordion,
  tags: ['autodocs', 'molecule', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component: [
          'Sanfona. Spec: `03-components/tabs-accordion.md` v2.0.0. Equivalente PrimeNG: `p-accordion`.',
          '',
          '**Quando usar Accordion e não Tabs:** o Accordion permite ver várias seções ao mesmo tempo e serve a conteúdo de leitura sequencial ou de consulta pontual, em que o usuário expande só o que precisa (filtros avançados, configurações agrupadas, FAQ, ajuda contextual). Se o conteúdo é paralelo, de mesmo peso e consultado em qualquer ordem, com troca frequente na mesma sessão, use `Tabs` (máximo recomendado de 7 abas). Navegação entre módulos do sistema é roteamento, não Accordion.',
          '',
          '**Quando não usar:** conteúdo de processo que precisa ser conferido por inteiro ou impresso, porque a seção recolhida fica fora da busca do navegador e fora do papel, e o servidor assina o que não leu; campo obrigatório dentro de seção fechada, já que a validação aponta erro num ponto invisível e o foco salta para fora da tela; página com uma única seção, onde o gatilho só acrescenta um clique por sessão sem economizar nada. Para conteúdo paralelo com troca frequente na mesma sessão, use `Moléculas/Contêineres/Tabs`. Para agrupar campos com legenda sempre visível e anunciada a cada campo, use `Organismos/Formulário/Fieldset`. Para separar blocos de leitura sem esconder nada, `Organismos/Layout/Panel`.',
          '',
          '**Diferença de papel ARIA:** o Accordion usa cabeçalho com `aria-expanded` mais região, então cada seção é anunciada como aberta ou fechada de forma independente. Tabs monta `tablist` com `tab` e `tabpanel`, e anuncia uma aba ativa dentro de um conjunto.',
        ].join('\n'),
      },
    },
  },
  args: { itens: ITENS },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sanfona: Story = {
  name: 'Accordion · seções',
  render: () => (
    <Accordion
      abertoInicial={['elegibilidade']}
      itens={[
        {
          id: 'elegibilidade',
          titulo: 'Critérios de elegibilidade',
          conteudo: 'O servidor precisa ter vínculo ativo e laudo emitido nos últimos 90 dias.',
        },
        {
          id: 'documentos',
          titulo: 'Documentos obrigatórios',
          conteudo: 'Laudo médico, comprovante de residência e documento de identidade.',
        },
        {
          id: 'prazos',
          titulo: 'Prazos de análise',
          conteudo: 'A regulação tem 48 horas para emitir o parecer após o recebimento.',
        },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: 'Documentos obrigatórios' });

    await expect(gatilho).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(gatilho);
    await expect(gatilho).toHaveAttribute('aria-expanded', 'true');

    // Sem `multiplo`, abrir uma fecha a anterior.
    await expect(
      canvas.getByRole('button', { name: 'Critérios de elegibilidade' }),
    ).toHaveAttribute('aria-expanded', 'false');
  },
};

export const SanfonaMultipla: Story = {
  name: 'Accordion · múltiplas abertas',
  render: () => (
    <Accordion
      multiplo
      abertoInicial={['a', 'b']}
      itens={[
        { id: 'a', titulo: 'Identificação', conteudo: 'Nome, CPF e matrícula.' },
        { id: 'b', titulo: 'Vínculo', conteudo: 'Secretaria, cargo e data de admissão.' },
        { id: 'c', titulo: 'Benefícios', conteudo: 'Plano de saúde e vale transporte.' },
      ]}
    />
  ),
};
