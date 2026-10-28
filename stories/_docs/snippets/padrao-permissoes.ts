import type { Abas } from '../Layout';

export const permissaoExemplo: Abas = {
  'HTML/CSS': { codigo: `<!-- Oculte renderizando só o que o perfil pode ver -->
<button type="button" class="botao" aria-disabled="true" aria-describedby="motivo-aprovar">Aprovar</button>
<p id="motivo-aprovar">Você não pode aprovar sua própria solicitação. Encaminhe para outro gestor.</p>

<input id="valor" value="R$ 720,00" readonly aria-describedby="valor-ajuda">
<p id="valor-ajuda">Somente leitura. Somente administradores do sistema podem alterar este parâmetro.</p>

.botao[aria-disabled="true"] { background: var(--color-background-primary-disabled); cursor: not-allowed; }

/* aria-disabled mantém o botão na ordem de tabulação: bloqueie o clique no script */
botao.addEventListener('click', (e) => { if (botao.ariaDisabled === 'true') e.preventDefault(); });` },
  'Angular com PrimeNG': { codigo: `<!-- Ocultar: o elemento nem entra no DOM -->
@if (acesso.pode('lancamento.aprovar')) {
  <p-button label="Aprovar"
            [attr.aria-disabled]="propria"
            [attr.aria-describedby]="propria ? 'motivo-aprovar' : null"
            (onClick)="!propria && aprovar()" />
  @if (propria) {
    <small id="motivo-aprovar">Você não pode aprovar sua própria solicitação. Encaminhe para outro gestor.</small>
  }
}

// guarda de rota: sem permissão vai para a tela de acesso negado, nunca para o login
export const exigir = (perm: string): CanActivateFn => () =>
  inject(AcessoService).pode(perm) || inject(Router).createUrlTree(['/acesso-negado']);` },
  'React': { codigo: `import { Button } from '@/components/base/buttons/button';

{pode('lancamento.aprovar') ? (
  <>
    <Button
      aria-disabled={propria || undefined}
      aria-describedby={propria ? 'motivo-aprovar' : undefined}
      onClick={(e) => { if (propria) e.preventDefault(); else aprovar(); }}
    >
      Aprovar
    </Button>
    {propria ? <p id="motivo-aprovar">Você não pode aprovar sua própria solicitação. Encaminhe para outro gestor.</p> : null}
  </>
) : null}

{/* Antes de o perfil carregar, renderize o esqueleto: o estado inicial é sem permissão. */}` },
};
