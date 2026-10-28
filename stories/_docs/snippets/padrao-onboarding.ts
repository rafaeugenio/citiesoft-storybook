import type { Abas } from '../Layout';

export const estadoVazioExemplo: Abas = {
  'HTML/CSS': { codigo: `<section class="vazio" aria-labelledby="vazio-titulo">
  <svg aria-hidden="true" class="vazio__icone"><!-- ícone do domínio --></svg>
  <h2 id="vazio-titulo">Nenhum processo aberto</h2>
  <p>Para registrar uma solicitação de TFD, selecione Novo processo. O sistema pré-preenche os dados do paciente cadastrado.</p>
  <a class="botao" href="/processos/novo">Novo processo</a>
</section>

<label for="orgao">Órgão</label>
<input id="orgao" value="Prefeitura Municipal de São Luís" aria-describedby="orgao-ajuda">
<p id="orgao-ajuda">Pré-preenchido com base no perfil do órgão. Verifique antes de confirmar.</p>` },
  'Angular com PrimeNG': { codigo: `<p-table [value]="processos()">
  <ng-template #emptymessage>
    <tr>
      <td colspan="6">
        <section aria-labelledby="vazio-titulo">
          <i class="pi pi-file" aria-hidden="true"></i>
          <h2 id="vazio-titulo">Nenhum processo aberto</h2>
          <p>Para registrar uma solicitação de TFD, selecione Novo processo.</p>
          <p-button label="Novo processo" routerLink="/processos/novo" />
        </section>
      </td>
    </tr>
  </ng-template>
</p-table>

<!-- Tooltip de ajuda após o rótulo, aberto por foco e hover -->
<label for="empenho">Número do empenho
  <i class="pi pi-question-circle" tabindex="0" role="img" aria-label="Ajuda: número do empenho"
     pTooltip="Informe o número no formato AAAA/NNN. Ex.: 2025/0481."></i>
</label>` },
  'React': { codigo: `import { EmptyState } from '@/components/application/estados/empty-state';
import { Button } from '@/components/base/buttons/button';
import { RiFileList3Line } from '@remixicon/react';

<EmptyState
  icon={RiFileList3Line}
  title="Nenhum processo aberto"
  description="Para registrar uma solicitação de TFD, selecione Novo processo. O sistema pré-preenche os dados do paciente cadastrado."
  action={<Button>Novo processo</Button>}
  secondaryAction={<Button variant="secondary">Importar do sistema de origem</Button>}
/>` },
};
