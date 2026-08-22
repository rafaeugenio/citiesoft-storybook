import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { DURACAO_POR_SEVERIDADE, Toast, ToastStack, type DadosDoToast } from './Feedback';
import { tempoCssEmMs } from './tempoCss';
import { Button } from '../../atoms/Button/Button';

/**
 * Piso do intervalo aceitável entre a marca de saída e a remoção do nó. A
 * transição nominal é `--citie-motion-rapido` (140ms) e a rede de segurança
 * dispara em 280ms, então qualquer caminho correto fica acima deste piso com
 * folga. O piso existe porque "o toast eventualmente some" passa igual quando a
 * coreografia roda e quando ela é atropelada: já houve regressão em que o nó
 * saía 2,7ms depois da marca, no build minificado, e a suíte não acusou.
 */
const PISO_DA_COREOGRAFIA_MS = 80;

/**
 * Folga aceitável, em pixels, entre a última posição medida do vizinho de baixo
 * e a posição em que ele assenta depois de o nó sair do DOM. Zero seria exigir
 * igualdade de ponto flutuante entre dois quadros; qualquer valor acima disto é
 * deslocamento que o olho vê acontecer de uma vez, sem transição nenhuma. O
 * respiro da pilha vale `--citie-spacing-3` (12px), então um respiro que não
 * colapse junto com a altura aparece aqui como um degrau de 12px inteiros.
 */
const SALTO_TOLERADO_PX = 1.5;

interface MedicaoDaSaida {
  /** Intervalo entre a marca de saída e a remoção do nó, em milissegundos. */
  intervalo: number;
  /** Degrau do vizinho de baixo no quadro da remoção, em pixels. */
  salto: number;
  /** Deslocamento total do vizinho de baixo durante a saída, em pixels. */
  deslocamento: number;
  /** Maior margem restante no item que sai no último quadro antes da remoção. */
  margemFinal: string;
}

/**
 * Mede a saída de um item da pilha por dois eixos ao mesmo tempo: o tempo entre
 * a marca de saída e a remoção do nó, e o CAMINHO do vizinho de baixo quadro a
 * quadro, via `requestAnimationFrame` e `getBoundingClientRect`. O tempo sozinho
 * prova que a transição durou; ele não prova que o deslocamento inteiro foi
 * animado. Um respiro que atravesse a transição e só desapareça com o nó dá
 * duração correta e mesmo assim empurra a pilha de golpe no último quadro.
 *
 * Observa a pilha inteira porque o item marcado só é conhecido quando a marca
 * chega, e o vizinho de baixo é capturado nesse instante, antes de a posição
 * começar a mudar.
 */
function medirSaidaDaPilha(pilha: HTMLElement, limite = 3000): Promise<MedicaoDaSaida> {
  return new Promise((resolve, reject) => {
    let marcadoEm: number | null = null;
    let alvo: HTMLElement | null = null;
    let vizinho: HTMLElement | null = null;
    let topoInicial = 0;
    let ultimoTopo = 0;
    let margemFinal = '';
    let expiracao: ReturnType<typeof setTimeout>;

    // Amostragem por quadro: enquanto o item marcado estiver no DOM, guarda a
    // posição do vizinho e a margem que o item ainda carrega.
    const amostrar = () => {
      if (!alvo || !vizinho || !alvo.isConnected) return;
      ultimoTopo = vizinho.getBoundingClientRect().top;
      margemFinal = getComputedStyle(alvo).marginBlockEnd;
      requestAnimationFrame(amostrar);
    };

    const observador = new MutationObserver((registros) => {
      for (const registro of registros) {
        if (
          registro.type === 'attributes' &&
          marcadoEm === null &&
          (registro.target as HTMLElement).classList.contains('citie-toast-stack__item--saindo')
        ) {
          marcadoEm = performance.now();
          alvo = registro.target as HTMLElement;
          vizinho = alvo.nextElementSibling as HTMLElement | null;
          if (!vizinho) {
            observador.disconnect();
            clearTimeout(expiracao);
            reject(new Error('O item marcado como saindo não tinha vizinho abaixo para medir.'));
            return;
          }
          topoInicial = vizinho.getBoundingClientRect().top;
          ultimoTopo = topoInicial;
          requestAnimationFrame(amostrar);
        }

        for (const removido of registro.removedNodes) {
          if (marcadoEm !== null && removido === alvo) {
            const intervalo = performance.now() - marcadoEm;
            observador.disconnect();
            clearTimeout(expiracao);
            const topoAntesDaRemocao = ultimoTopo;
            // Um quadro depois da remoção o navegador já reposicionou a pilha:
            // a diferença para a última amostra é o degrau que o usuário vê.
            requestAnimationFrame(() => {
              const topoFinal = (vizinho as HTMLElement).getBoundingClientRect().top;
              resolve({
                intervalo,
                salto: Math.abs(topoFinal - topoAntesDaRemocao),
                deslocamento: Math.abs(topoFinal - topoInicial),
                margemFinal,
              });
            });
            return;
          }
        }
      }
    });

    expiracao = setTimeout(() => {
      observador.disconnect();
      reject(
        new Error(
          marcadoEm === null
            ? 'A marca de saída nunca chegou ao item da pilha.'
            : 'O item marcado como saindo nunca deixou o DOM.',
        ),
      );
    }, limite);

    observador.observe(pilha, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['class'],
    });
  });
}

const meta = {
  title: 'Moléculas/Feedback/Toast',
  component: Toast,
  tags: ['autodocs', 'molecule', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component:
          'Notificação temporária sobreposta que confirma o resultado de uma ação ou avisa de um evento sem interromper o fluxo. Spec: `03-components/feedback-toast-alert.md` v2.0.0. Biblioteca Figma: `07-figma-library/toast.md`. Equivalente PrimeNG: `p-toast`.\n\nRegra de escolha (Toast, Message ou banner): use Toast para confirmação efêmera do resultado de uma ação do usuário (salvar, enviar, aprovar, excluir) e para notificação passiva de sistema, porque não bloqueia o fluxo, some sozinho e não precisa ser lido depois. Nunca use Toast para erro de validação de campo, para informação que o usuário precisa ler com calma ou copiar (número de protocolo), nem para pergunta que exige decisão. Erro ou aviso ligado ao contexto da tela ou do formulário, que precisa permanecer ancorado até ser resolvido, é Message; decisão que exige confirmação explícita é Dialog.\n\nO `ToastStack` é documentado aqui: é o container do próprio Toast, responsável pela regra de no máximo 3 empilhados.\n\n**Quando não usar:**\n\n- **Conteúdo que o servidor precisa copiar ou anotar.** Número de protocolo, código de erro e prazo somem em 4 a 6 segundos (`success` 4s, `info` 5s, `warn` 6s), e o dado não volta. Deixe essa informação na tela, em `Moléculas/Feedback/Message` ou no próprio corpo da página.\n- **Erro de validação de campo.** O toast aparece longe do campo, e a pessoa fica com a mensagem sem saber onde corrigir. Use a mensagem do próprio campo (`error` do `Moléculas/Campos/Input` e demais campos), e a lista de erros do `Message` no topo do formulário quando forem vários.\n- **Decisão que exige resposta.** O toast some sozinho e não bloqueia nada, então a pergunta pode nunca ser respondida. Use `Moléculas/Overlay/ConfirmPopup` para confirmação leve ancorada ao botão e `Organismos/Overlay/ConfirmDialog` para ação irreversível.\n- **Estado que dura enquanto uma condição persistir.** Sistema em manutenção, competência fechada ou permissão insuficiente continuam valendo depois do toast desaparecer. Use o `Message` como banner no topo da página.\n- **Vários avisos ao mesmo tempo.** O `ToastStack` mostra no máximo 3 e descarta os mais antigos em silêncio, então o quarto aviso nunca é lido. Quando a operação gera muitos resultados (importação em lote, por exemplo), mostre um resumo persistente na tela com o detalhamento.\n- **Ausência de dados numa região.** Isso é `Moléculas/Feedback/EmptyState`.\n\nUma nota de acessibilidade que limita o uso: apenas a severidade `error` recebe `role="alert"` e `aria-live="assertive"`, e ela não fecha sozinha. As demais são anunciadas de forma educada e podem passar despercebidas por quem está lendo outra parte da tela, o que reforça a regra de nunca colocar informação necessária apenas no toast.',
      },
    },
  },
  args: {
    id: 'toast',
    severidade: 'success',
    titulo: 'Diária lançada com sucesso',
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ToastSucesso: Story = {
  name: 'Toast · sucesso',
  render: () => (
    <Toast
      id="t1"
      severidade="success"
      titulo="Diária lançada com sucesso"
      mensagem="O lançamento entrou na competência de março."
      acao={{ rotulo: 'Desfazer' }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // success, info, warn e secondary anunciam sem interromper a leitura.
    const toast = canvas.getByRole('status');
    await expect(toast).toHaveAttribute('aria-live', 'polite');
    // O toast entra com fade, então a asserção espera a animação terminar.
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Fechar notificação' })).toBeVisible());
  },
};

export const ToastErro: Story = {
  name: 'Toast · erro',
  parameters: {
    docs: {
      description: {
        story:
          'A severidade error interrompe a leitura em curso por ser crítica, e nunca some sozinha: permanece até o fechamento manual.',
      },
    },
  },
  render: () => (
    <Toast
      id="t2"
      severidade="error"
      titulo="Falha ao enviar o processo"
      mensagem="O SIGEP não respondeu. Tente novamente em alguns minutos."
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toast = canvas.getByRole('alert');

    await expect(toast).toHaveAttribute('aria-live', 'assertive');
    // Sem auto-dismiss na severidade error.
    await expect(DURACAO_POR_SEVERIDADE.error).toBeNull();
  },
};

export const ToastTemporizadores: Story = {
  name: 'Toast · temporizador por severidade',
  parameters: {
    docs: {
      description: {
        story: 'success 4s, info 5s, warn 6s, error sem auto-dismiss.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Toast id="s" severidade="success" titulo="Cadastro salvo" />
      <Toast id="i" severidade="info" titulo="Sessão renovada" />
      <Toast id="w" severidade="warn" titulo="Lançamento salvo com ressalva" />
    </div>
  ),
  play: async () => {
    await expect(DURACAO_POR_SEVERIDADE.success).toBe(4000);
    await expect(DURACAO_POR_SEVERIDADE.info).toBe(5000);
    await expect(DURACAO_POR_SEVERIDADE.warn).toBe(6000);
  },
};

export const ToastEmpilhado: Story = {
  name: 'Toast · máximo de 3 empilhados',
  parameters: {
    docs: {
      description: {
        story:
          'Ao chegar um quarto toast, o mais antigo sai da pilha pela mesma coreografia da dispensa: esmaece, colapsa de altura, e os toasts abaixo sobem acompanhando o colapso em vez de saltar para a nova posição. O nó só deixa o DOM quando a transição termina. Sob `prefers-reduced-motion` a pilha reorganiza sem transição, direto no estado final. A regra vive no `ToastStack`, o container do Toast; o `Button` aparece aqui por composição, só para disparar as notificações.',
      },
    },
  },
  render: function Empilhado() {
    const [toasts, setToasts] = useState<DadosDoToast[]>([]);
    // Contador monotônico: derivar o id do tamanho do array colide quando um
    // toast antigo sai enquanto outro entra, e duas entradas herdam a mesma
    // `key` dentro da pilha.
    const contador = useRef(0);

    return (
      <div style={{ display: 'grid', gap: 16 }}>
        <Button
          onClick={() => {
            contador.current += 1;
            const numero = contador.current;
            setToasts((atual) => [
              ...atual,
              {
                id: `toast-${numero}`,
                severidade: 'error',
                titulo: `Notificação ${numero}`,
              },
            ]);
          }}
        >
          Disparar notificação
        </Button>
        <ToastStack toasts={toasts} onDismiss={(id) => setToasts((a) => a.filter((t) => t.id !== id))} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const disparar = canvas.getByRole('button', { name: 'Disparar notificação' });

    // A rede de segurança lê a duração do próprio token, e o token chega em duas
    // grafias: `140ms` aqui e `.14s` no artefato, porque o minificador do Vite
    // reserializa. Como o ambiente de teste nunca minifica, a segunda grafia só
    // é alcançável afirmando a conversão direto. Sem isto, a leitura ingênua
    // volta ao build sem a suíte acusar nada.
    await expect(tempoCssEmMs('140ms')).toBe(140);
    await expect(tempoCssEmMs('.14s')).toBeCloseTo(140, 6);
    await expect(tempoCssEmMs('0.14s')).toBeCloseTo(140, 6);
    await expect(tempoCssEmMs('140MS')).toBe(140);
    await expect(tempoCssEmMs(' .14s ')).toBeCloseTo(140, 6);
    await expect(tempoCssEmMs('')).toBeNull();
    await expect(tempoCssEmMs('rápido')).toBeNull();
    await expect(tempoCssEmMs('140')).toBeNull();

    // Sob movimento reduzido não existe fase de saída: a dispensa é imediata e
    // não há intervalo a medir.
    const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Três disparos primeiro, para a pilha existir e a medição já estar armada
    // quando o quarto empurrar o mais antigo para fora.
    for (let i = 0; i < 3; i += 1) await userEvent.click(disparar);

    const pilha = canvasElement.querySelector<HTMLElement>('.citie-toast-stack');
    await expect(pilha).not.toBeNull();
    const medicao = semMovimento ? null : medirSaidaDaPilha(pilha as HTMLElement);

    await userEvent.click(disparar);

    // A saída é coreografada: o excedente esmaece e colapsa antes de deixar o
    // DOM, então as asserções esperam a transição concluir. O critério não
    // enfraquece: o mais antigo PRECISA sair do DOM, e a pilha PRECISA fechar
    // em exatamente 3.
    await waitFor(() => expect(canvas.queryByText('Notificação 1')).toBeNull());
    await expect(canvas.getAllByRole('alert')).toHaveLength(3);
    await waitFor(() => expect(canvas.getByText('Notificação 4')).toBeVisible());

    // O que "eventualmente some" não cobre: o tempo entre marcar a saída e
    // remover o nó. Se a coreografia for atropelada, o intervalo despenca para
    // poucos milissegundos e o usuário vê o sumiço abrupto de novo.
    if (medicao) {
      const { intervalo, salto, deslocamento, margemFinal } = await medicao;
      await expect(intervalo).toBeGreaterThanOrEqual(PISO_DA_COREOGRAFIA_MS);

      // O que a medição de tempo também não cobre: o CAMINHO. O vizinho de
      // baixo precisa chegar à posição final ANTES de o nó sair do DOM. Se o
      // respiro de 12px não colapsar junto com a altura, ele viaja inteiro até
      // o último quadro e a pilha salta na remoção, que é o salto que a margem
      // foi introduzida para evitar.
      await expect(salto).toBeLessThanOrEqual(SALTO_TOLERADO_PX);
      await expect(deslocamento).toBeGreaterThan(SALTO_TOLERADO_PX);
      // Causa direta do salto, afirmada de perto: a declaração de saída precisa
      // vencer a regra base em especificidade, senão é código morto.
      await expect(Number.parseFloat(margemFinal)).toBeLessThanOrEqual(SALTO_TOLERADO_PX);
    }
  },
};
