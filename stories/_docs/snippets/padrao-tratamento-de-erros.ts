import type { Abas } from '../Layout';

export const erroDeOperacao: Abas = {
  'HTML/CSS': { codigo: `<!-- Toast de falha recuperável: anunciado sem tomar o foco -->
<div class="toast toast--erro" role="status" aria-live="assertive">
  <p><strong>Não foi possível salvar o lançamento.</strong></p>
  <p>A competência 04/2025 está encerrada para lançamentos. Contate o setor de contabilidade
     ou abra um chamado de reabertura de competência. Referência: A3F9B21C.</p>
  <button type="button" aria-label="Fechar aviso">Fechar</button>
</div>

.toast--erro { background: var(--color-notification-error-background); color: var(--color-notification-error-foreground); }
@media (max-width: 639px) { .toast { inset-block-end: 0; inset-inline: 0; } }` },
  'Angular com PrimeNG': { codigo: `// o interceptor traduz a resposta do servidor para linguagem de negócio
this.messages.add({
  severity: 'error',
  summary: 'Não foi possível salvar o lançamento.',
  detail: 'A competência 04/2025 está encerrada para lançamentos. Contate o setor de contabilidade. Referência: A3F9B21C.',
  life: 8000,
});

<p-toast position="top-right" [breakpoints]="{ '640px': { width: '100%', left: '0', top: '0' } }" />

<!-- Falha que bloqueia a seção -->
@if (erro()) {
  <p-message severity="error">Não foi possível carregar os lançamentos.</p-message>
  <p-button label="Tentar novamente" severity="secondary" (onClick)="carregar()" />
}` },
  'React': { codigo: `import { ErrorState } from '@/components/application/estados/error-state';

{erro ? (
  <ErrorState
    title="Não foi possível carregar os lançamentos."
    description="Tente novamente. Se o problema persistir, entre em contato com o suporte técnico."
    onRetry={carregar}
    retryLabel="Tentar novamente"
  />
) : (
  <Tabela dados={dados} />
)}

{/* Os valores do formulário ficam em estado local: erro de servidor nunca o zera. */}` },
};
