import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Terminal } from './Terminal';
import type { LinhaTerminal, SaidaTerminal } from './Terminal';

const sessaoInicial: LinhaTerminal[] = [
  { id: 'l1', tipo: 'comando', texto: 'processo consultar 2025/0481' },
  { id: 'l2', tipo: 'saida', texto: 'Processo 2025/0481 · Solicitação de TFD · Secretaria de Saúde' },
  { id: 'l3', tipo: 'saida', texto: 'Interessada: Maria de Fátima Souza · Situação: em análise na regulação' },
];

/** Comandos de console administrativo, no vocabulário real do TFD. */
function responder(comando: string): SaidaTerminal | SaidaTerminal[] {
  const [verbo, ...resto] = comando.trim().split(/\s+/);

  if (verbo === 'ajuda') {
    return [
      'Comandos: processo consultar <número> · diaria calcular <competência> · limpar',
      'Setas ↑ e ↓ recuperam comandos já enviados.',
    ];
  }

  if (verbo === 'processo') {
    const numero = resto[resto.length - 1];
    if (!/^\d{4}\/\d{4}$/.test(numero ?? '')) {
      return { tipo: 'erro', texto: `Número de processo inválido: "${numero ?? ''}". Use o formato 2025/0481.` };
    }
    return [
      `Processo ${numero} · Solicitação de TFD · Secretaria de Saúde`,
      { tipo: 'sucesso', texto: 'Parecer técnico favorável emitido pela regulação em 14/03/2025.' },
    ];
  }

  if (verbo === 'diaria') {
    return [
      'Competência 03/2025 · 2 diárias de deslocamento para São Luís',
      { tipo: 'aviso', texto: 'Comprovante de comparecimento pendente de anexo pela unidade de destino.' },
    ];
  }

  return { tipo: 'erro', texto: `Comando não reconhecido: "${comando}". Digite "ajuda" para ver a lista.` };
}

const meta = {
  title: 'Feedback/Terminal',
  component: Terminal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Terminal. Figma CitieOne, página `6738:55117` (componente único `terminal`, sem eixos de variante). ',
          'A estrutura do arquivo tem três partes: mensagem de boas-vindas, pares de `prompt`/`response` no histórico e ',
          'uma linha de prompt ativa no fim. Equivale ao `p-terminal` do PrimeNG.',
          '\n\n**Quando não usar — que é quase sempre.** Este é componente de vitrine do kit PrimeNG: ele existe na ',
          'biblioteca comprada, não em nenhuma tela B2G da Citiesoft. Servidor público, gestor e cidadão não operam ',
          'sistema por linha de comando, e transformar uma tarefa administrativa em comando digitado troca uma ',
          'interface descobrível por uma que exige memorizar sintaxe — o oposto do que a acessibilidade e o e-MAG ',
          'pedem. Para consulta de processo use busca com filtros; para ação em lote use seleção em tabela; para log ',
          'de auditoria use uma linha do tempo ou tabela paginada, não um console rolante. O uso legítimo restante é ',
          'ferramenta interna de suporte técnico, onde a pessoa que digita já conhece os comandos.',
          '\n\n**Tipografia.** O DS Citiesoft pede Red Hat Mono para referência técnica com alinhamento caractere a ',
          'caractere, mas `tokens.css` não expõe família monoespaçada. A pilha está declarada no CSS do componente e ',
          'falta o token `--citie-font-mono` no design system.',
          '\n\n**Acessibilidade.** A linha ativa é um `input` com rótulo associado, nunca um `contenteditable`. O ',
          'histórico é uma região `role="log"` com `aria-live="polite"`, focável por teclado por ser rolável. Erro, ',
          'aviso e sucesso levam ícone e prefixo lido pelo leitor de tela além da cor.',
        ].join(''),
      },
    },
  },
} satisfies Meta<typeof Terminal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Padrão · sessão em andamento',
  args: {
    boasVindas: 'Console administrativo Citiesoft · digite "ajuda" para ver os comandos',
    linhasIniciais: sessaoInicial,
    aoEnviarComando: responder,
    placeholder: 'processo consultar 2025/0481',
  },
};

export const Vazio: Story = {
  name: 'Estado · sessão vazia',
  args: {
    boasVindas: 'Console administrativo Citiesoft · digite "ajuda" para ver os comandos',
    aoEnviarComando: responder,
  },
};

export const SaidaDeErro: Story = {
  name: 'Saída · erro',
  args: {
    linhasIniciais: [
      { id: 'e1', tipo: 'comando', texto: 'processo consultar 481' },
      {
        id: 'e2',
        tipo: 'erro',
        texto: 'Número de processo inválido: "481". Use o formato 2025/0481.',
      },
    ],
    aoEnviarComando: responder,
  },
};

export const SaidaDeAvisoESucesso: Story = {
  name: 'Saída · aviso e sucesso',
  args: {
    linhasIniciais: [
      { id: 'a1', tipo: 'comando', texto: 'diaria calcular --competencia 03/2025' },
      { id: 'a2', tipo: 'saida', texto: 'Competência 03/2025 · 2 diárias de deslocamento para São Luís' },
      {
        id: 'a3',
        tipo: 'aviso',
        texto: 'Comprovante de comparecimento pendente de anexo pela unidade de destino.',
      },
      {
        id: 'a4',
        tipo: 'sucesso',
        texto: 'Empenho da diária enviado à Secretaria de Fazenda em 19/03/2025.',
      },
    ],
    aoEnviarComando: responder,
  },
};

export const HistoricoLongo: Story = {
  name: 'Estado · histórico rolável',
  args: {
    altura: '160px',
    linhasIniciais: [
      ...sessaoInicial,
      { id: 'h1', tipo: 'comando', texto: 'diaria calcular --competencia 03/2025' },
      { id: 'h2', tipo: 'saida', texto: 'Competência 03/2025 · 2 diárias de deslocamento para São Luís' },
      { id: 'h3', tipo: 'comando', texto: 'processo consultar 2025/0512' },
      { id: 'h4', tipo: 'saida', texto: 'Processo 2025/0512 · Solicitação de TFD · Secretaria de Saúde' },
      { id: 'h5', tipo: 'saida', texto: 'Interessado: João Batista Pereira · Situação: aguardando documentação' },
      { id: 'h6', tipo: 'comando', texto: 'beneficio listar --secretaria "Educação"' },
      { id: 'h7', tipo: 'saida', texto: '3 benefícios ativos na Secretaria de Educação.' },
    ],
    aoEnviarComando: responder,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const historico = canvas.getByRole('log', { name: 'Histórico do terminal' });

    // A região rolável precisa ser alcançável por teclado.
    await expect(historico).toHaveAttribute('tabindex', '0');
    await expect(historico.scrollHeight).toBeGreaterThan(historico.clientHeight);
    // O componente rola para o fim ao montar, mostrando a saída mais recente.
    await expect(historico.scrollTop).toBeGreaterThan(0);
  },
};

export const Desabilitado: Story = {
  name: 'Estado · desabilitado',
  args: {
    boasVindas: 'Sessão encerrada por inatividade. Recarregue a página para abrir outra.',
    linhasIniciais: sessaoInicial,
    desabilitado: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByRole('textbox', { name: 'Comando do terminal' });

    await expect(campo).toHaveAttribute('aria-disabled', 'true');
    // Desabilitado sem sair da ordem de tabulação: o histórico segue alcançável.
    campo.focus();
    await expect(campo).toHaveFocus();

    await userEvent.type(campo, 'ajuda');
    await expect(campo).toHaveValue('');
  },
};

export const EnvioDeComando: Story = {
  name: 'Comportamento · envio de comando',
  args: {
    boasVindas: 'Console administrativo Citiesoft · digite "ajuda" para ver os comandos',
    aoEnviarComando: responder,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByRole('textbox', { name: 'Comando do terminal' });

    await userEvent.type(campo, 'processo consultar 2025/0481{Enter}');

    const historico = canvas.getByRole('log', { name: 'Histórico do terminal' });
    await expect(historico).toHaveAttribute('aria-live', 'polite');
    await expect(canvas.getByText('processo consultar 2025/0481')).toBeInTheDocument();
    await expect(
      canvas.getByText('Processo 2025/0481 · Solicitação de TFD · Secretaria de Saúde'),
    ).toBeInTheDocument();
    // O campo esvazia e o foco continua nele, pronto para o comando seguinte.
    await expect(campo).toHaveValue('');
    await expect(campo).toHaveFocus();
  },
};

export const ComandoNaoReconhecido: Story = {
  name: 'Comportamento · comando não reconhecido',
  args: {
    aoEnviarComando: responder,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByRole('textbox', { name: 'Comando do terminal' });

    await userEvent.type(campo, 'empenhar tudo{Enter}');

    const erro = canvas.getByText(/Comando não reconhecido/);
    // Cor não é o único indicador: o leitor de tela ouve o prefixo "Erro:".
    await expect(erro.parentElement).toHaveTextContent('Erro:');
    await expect(erro.parentElement?.querySelector('svg')).toBeInTheDocument();
  },
};

export const NavegacaoPorTeclado: Story = {
  name: 'Teclado · recuperar comandos com as setas',
  args: {
    aoEnviarComando: responder,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByRole('textbox', { name: 'Comando do terminal' });

    await userEvent.type(campo, 'processo consultar 2025/0481{Enter}');
    await userEvent.type(campo, 'diaria calcular --competencia 03/2025{Enter}');

    await userEvent.keyboard('{ArrowUp}');
    await expect(campo).toHaveValue('diaria calcular --competencia 03/2025');

    await userEvent.keyboard('{ArrowUp}');
    await expect(campo).toHaveValue('processo consultar 2025/0481');

    await userEvent.keyboard('{ArrowDown}');
    await expect(campo).toHaveValue('diaria calcular --competencia 03/2025');

    // Passar do comando mais recente devolve o campo vazio.
    await userEvent.keyboard('{ArrowDown}');
    await expect(campo).toHaveValue('');
  },
};

export const FocoAoClicarNoVazio: Story = {
  name: 'Comportamento · clique no vazio foca o campo',
  args: {
    linhasIniciais: sessaoInicial,
    aoEnviarComando: responder,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByRole('textbox', { name: 'Comando do terminal' });

    await userEvent.click(canvasElement.querySelector('.citie-terminal') as HTMLElement);
    await expect(campo).toHaveFocus();
  },
};
