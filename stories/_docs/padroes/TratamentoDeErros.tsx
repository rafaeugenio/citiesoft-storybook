import { RiErrorWarningFill, RiFileSearchLine, RiLockLine } from '@remixicon/react';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { EmptyState } from '@/components/application/estados/empty-state';
import { ErrorState } from '@/components/application/estados/error-state';
import { Moldura } from './Moldura';

/** Erro de campo: causa, formato esperado e exemplo, ligado ao campo. */
export function ErroDeCampoDemo() {
  return (
    <Moldura legenda="Borda, ícone e texto. A cor nunca é o único sinal." largura={420}>
      <div className="flex flex-col gap-4">
        <Input label="Valor da diária" isRequired isInvalid defaultValue="" hint="Valor da diária é obrigatório. Informe o valor em reais (ex.: 150,00)." />
        <Input label="CPF do servidor" isRequired isInvalid defaultValue="123.456.789" hint="CPF deve estar no formato 000.000.000-00." />
      </div>
    </Moldura>
  );
}

/** Painel de resumo no topo do formulário, com itens acionáveis. */
export function PainelDeResumoDemo() {
  const itens = [
    'CPF do servidor: CPF deve estar no formato 000.000.000-00.',
    'Data de admissão: Data de admissão é obrigatória.',
    'Cargo: Selecione um cargo válido na lista.',
  ];
  return (
    <Moldura legenda="Aparece com 3 ou mais erros. Recebe o foco após o envio e cada item leva ao campo.">
      <div role="alert" className="rounded-2xl border border-border-error-default bg-background-tertiary-error p-4">
        <p className="flex items-center gap-2 text-body-medium text-text-error-primary">
          <RiErrorWarningFill className="size-5" aria-hidden />
          Corrija 3 erros antes de continuar.
        </p>
        <ul className="mt-2 flex list-disc flex-col gap-1 ps-9 text-body-regular text-text-primary">
          {itens.map((i) => (
            <li key={i}><a href="#campo" onClick={(e) => e.preventDefault()} className="underline underline-offset-2">{i}</a></li>
          ))}
        </ul>
      </div>
    </Moldura>
  );
}

/** Falha de operação em linguagem de negócio, com referência curta para o suporte. */
export function FalhaDeOperacaoDemo() {
  return (
    <Moldura legenda="Toast de erro: 8 segundos, botão de fechar, sem dado técnico.">
      <div role="status" className="flex max-w-[520px] flex-col gap-1 rounded-2xl bg-notification-error-background p-4 text-notification-error-foreground">
        <p className="text-body-medium">Não foi possível salvar o lançamento.</p>
        <p className="text-body-regular">
          A competência 04/2025 está encerrada para lançamentos. Contate o setor de contabilidade ou abra um chamado de reabertura de competência. Referência: A3F9B21C.
        </p>
      </div>
    </Moldura>
  );
}

/** Seção que não carregou: mensagem e nova tentativa no lugar do conteúdo. */
export function ErroDeSecaoDemo() {
  return (
    <Moldura legenda="Alerta de seção: substitui o conteúdo e oferece Tentar novamente.">
      <ErrorState
        size="sm"
        title="Não foi possível carregar os lançamentos."
        description="Tente novamente. Se o problema persistir, entre em contato com o suporte técnico."
        onRetry={() => undefined}
        retryLabel="Tentar novamente"
      />
    </Moldura>
  );
}

/** Páginas de erro: título claro, motivo e ação, sem código de status visível. */
export function PaginasDeErroDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Moldura legenda="Página não encontrada">
        <EmptyState
          size="sm"
          tone="erro"
          icon={RiFileSearchLine}
          title="Página não encontrada"
          description="O endereço que você acessou não existe ou foi movido. Verifique o link ou volte à página anterior."
          action={<Button size="small">Ir para o início</Button>}
          secondaryAction={<Button size="small" variant="secondary">Voltar</Button>}
        />
      </Moldura>
      <Moldura legenda="Acesso não autorizado">
        <EmptyState
          size="sm"
          tone="erro"
          icon={RiLockLine}
          title="Acesso não autorizado"
          description="Você não tem permissão para acessar este recurso. Se acredita que isso é um erro, solicite acesso ao administrador do sistema."
          action={<Button size="small">Ir para o início</Button>}
          secondaryAction={<Button size="small" variant="secondary">Solicitar acesso</Button>}
        />
      </Moldura>
    </div>
  );
}
