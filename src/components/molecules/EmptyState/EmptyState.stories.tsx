import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { EmptyState } from './EmptyState';
import { Chip } from '../../atoms/Badge/Badge';

const meta = {
  title: 'Moléculas/Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Estado vazio. Spec: `03-components/empty-state.md` v2.0.0. Regra central: primeiro uso e busca sem resultado nunca compartilham conteúdo, porque a causa é diferente.',
          '',
          '**Quando usar:** a região que deveria conter uma coleção ficou sem nenhum item, e a pessoa precisa entender a causa e o próximo passo. As quatro situações (`primeiro-uso`, `busca-sem-resultado`, `erro`, `permissao`) existem porque cada causa pede um texto e uma ação diferentes.',
          '',
          '**Quando não usar:**',
          '',
          '- **Enquanto os dados carregam.** O estado vazio afirma que não há nada, e durante o carregamento essa afirmação é falsa: o servidor vê "Nenhum lançamento registrado ainda" e sai da tela um instante antes da lista aparecer. Use `Átomos/Feedback/Skeleton` no formato do conteúdo esperado.',
          '- **Um campo do formulário ficou sem valor.** Isso é mensagem de erro do próprio campo, entregue pelo `error` do `Moléculas/Campos/Input` e dos demais campos.',
          '- **A operação falhou sem esvaziar a tela.** Quando a lista continua visível e o que quebrou foi a ação (salvar, enviar, aprovar), o aviso pertence a `Moléculas/Feedback/Message` ancorado à seção, ou a `Moléculas/Feedback/Toast` se for efêmero. O `situacao="erro"` daqui cobre o caso em que a coleção inteira não carregou.',
          '- **Uma célula ou um campo de detalhe está sem preenchimento.** Um bloco ilustrado dentro de uma linha de tabela ou de uma ficha estoura a densidade. Use um traço curto ou "Não informado" no próprio lugar do valor.',
          '- **Publicidade de recurso não contratado.** O estado vazio explica a ausência de dado. Convite para adquirir módulo é conteúdo de outra natureza e não deve ocupar esse espaço.',
          '',
          'Dois cuidados de implementação: o bloco tem `role="status"` com `aria-live="polite"`, então ele é anunciado quando aparece depois de um carregamento, e no tamanho `lg` o botão primário recebe foco automaticamente. Por causa disso, use `size="lg"` apenas quando o estado vazio ocupa a página inteira; dentro de um card ou de uma coluna lateral, prefira `sm` ou `md`, para não roubar o foco de outra área da tela.',
        ].join('\n'),
      },
    },
  },
  args: {
    titulo: 'Nenhum lançamento registrado ainda',
    descricao: 'Registre o primeiro lançamento de diária para acompanhar a prestação de contas.',
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimeiroUso: Story = {
  name: 'Situação · primeiro uso',
  args: { acaoPrimaria: { rotulo: 'Registrar lançamento' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const botao = canvas.getByRole('button', { name: 'Registrar lançamento' });
    // No tamanho lg em página completa, o botão primário recebe foco.
    await expect(botao).toHaveFocus();
  },
};

export const BuscaSemResultado: Story = {
  name: 'Situação · busca sem resultado',
  args: {
    situacao: 'busca-sem-resultado',
    titulo: 'Nenhum resultado para os filtros aplicados',
    descricao: 'Ajuste o período ou a competência para ampliar a busca.',
    acaoPrimaria: { rotulo: 'Limpar filtros' },
    filtrosAplicados: (
      <>
        <Chip label="Março/2025" variant="read-only" size="sm" />
        <Chip label="São Luís" variant="read-only" size="sm" />
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Os filtros aplicados aparecem como chips acima do ícone para reforçar a causa. Nunca culpar o usuário no texto.',
      },
    },
  },
};

export const Erro: Story = {
  name: 'Situação · erro',
  args: {
    situacao: 'erro',
    titulo: 'Não foi possível carregar os lançamentos',
    descricao: 'Verifique sua conexão e tente novamente.',
    acaoPrimaria: { rotulo: 'Tentar novamente' },
    acaoSecundaria: { rotulo: 'Contatar suporte' },
    codigoErro: 'Código do erro: SIGEP-504',
  },
  parameters: {
    docs: {
      description: {
        story:
          '"Tentar novamente" está sempre presente. O código técnico fica discreto abaixo da descrição, nunca em destaque.',
      },
    },
  },
};

export const SemPermissao: Story = {
  name: 'Situação · sem permissão',
  args: {
    situacao: 'permissao',
    descricao:
      'Seu perfil não permite registrar lançamentos. Procure o gestor da sua unidade para solicitar acesso.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Mesmo título do primeiro uso, com o botão de criação omitido.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // Sem permissão não oferece ação de criar.
    await expect(canvasElement.querySelector('.citie-empty__acoes')).toBeNull();
  },
};

export const Medio: Story = {
  name: 'Tamanho · md (painel lateral)',
  args: { size: 'md', acaoPrimaria: { rotulo: 'Registrar lançamento' } },
};

export const Pequeno: Story = {
  name: 'Tamanho · sm (widget)',
  args: { size: 'sm', titulo: 'Nenhum benefício vencendo', descricao: 'Nada exige ação nos próximos 30 dias.' },
};
