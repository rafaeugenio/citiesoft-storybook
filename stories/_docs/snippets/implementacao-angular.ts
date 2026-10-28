import type { Abas } from '../Layout';

export const deteccaoDeGeracao: Abas = {
  'Terminal': { codigo: `# Identifica a geração pelo package.json
cat package.json | grep -E '"@primeng|@primeuix|primeflex|primeng"'`, linguagem: 'bash' },
};

export const presetAngular: Abas = {
  'app.config.ts (A19)': { codigo: `import { providePrimeNG } from 'primeng/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CitiesoftPreset } from './theme/citiesoft-preset'; // mantido pelo DesignOps

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: CitiesoftPreset,
        options: {
          darkModeSelector: '.app-dark',
          cssLayer: { name: 'primeng', order: 'tailwind-base, primeng, tailwind-utilities' },
        },
      },
    }),
  ],
};`, linguagem: 'typescript' },
  'citiesoft-preset.ts': { codigo: `import { definePreset } from '@primeng/themes'; // A21: @primeuix/themes
import Lara from '@primeng/themes/lara';

export const CitiesoftPreset = definePreset(Lara, {
  semantic: {
    primary: {
      50: '#EFF5FF', 100: '#DBE8FF', 200: '#B3CEFE', 300: '#84AEFD', 400: '#4D8BFC',
      500: '#146BFA', 600: '#1261E4', 700: '#0E4DB8', 800: '#0B3C8F', 900: '#0A2F6E', 950: '#061D45',
    },
  },
});`, linguagem: 'typescript' },
};

export const estadosPorClasse: Abas = {
  'Template': { codigo: `<div
  class="cs-card"
  [class.cs-card--selected]="selecionado"
  [class.cs-card--disabled]="desabilitado"
  [class.cs-card--loading]="carregando"
>
  ...
</div>`, linguagem: 'html' },
  'SCSS': { codigo: `.cs-card {
  background: var(--cs-bg-surface);
  border: 1px solid var(--cs-border-default);
  border-radius: var(--cs-radius-lg);
  box-shadow: var(--cs-shadow-md);

  &--selected { border-color: var(--cs-brand-primary); background: var(--cs-brand-subtle); }
  &--disabled { background: var(--cs-state-disabled-bg); color: var(--cs-state-disabled-text); pointer-events: none; }
  &--loading  { opacity: 0.7; cursor: wait; }
}

*:focus-visible { outline: none; box-shadow: var(--cs-state-focus); }`, linguagem: 'scss' },
  'Errado': { codigo: `<!-- Proibido: hex no template, sem foco e sem tema escuro -->
<button
  [style.background-color]="ativo ? '#1261E4' : '#E8EAED'"
  [style.color]="ativo ? '#FFFFFF' : '#6B7177'"
>
  Confirmar
</button>`, linguagem: 'html' },
};

export const contratoDeComponente: Abas = {
  'cs-status-chip.component.ts': { codigo: `export type ChipVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

@Component({
  selector: 'cs-status-chip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`<span class="cs-chip" [class]="'cs-chip--' + variant" [attr.aria-label]="ariaLabel || label">{{ label }}</span>\`,
  styleUrls: ['./cs-status-chip.component.scss'],
})
export class CsStatusChipComponent {
  @Input({ required: true }) label!: string;
  @Input() variant: ChipVariant = 'default';
  @Input() ariaLabel?: string;
}`, linguagem: 'typescript' },
};

export const densidadeEMovimento: Abas = {
  'Densidade': { codigo: `<main class="cs-layout cs-density--compact"> ... </main>

.cs-density--compact {
  --cs-field-padding-y: var(--cs-space-2);
  --cs-field-padding-x: var(--cs-space-3);
  --cs-table-row-height: 40px;
  --cs-section-gap: var(--cs-space-4);
}
.cs-density--comfortable {
  --cs-field-padding-y: var(--cs-space-3);
  --cs-field-padding-x: var(--cs-space-4);
  --cs-table-row-height: 52px;
  --cs-section-gap: var(--cs-space-8);
}`, linguagem: 'scss' },
  'Movimento': { codigo: `@media (prefers-reduced-motion: no-preference) {
  .cs-overlay {
    transition: opacity var(--motion-quick) var(--ease-citie-out),
                transform var(--motion-quick) var(--ease-citie-out);
  }
}

// main.ts: sem animações do Angular quando a pessoa pede menos movimento
provideAnimationsAsync(
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'noop' : 'animations',
);`, linguagem: 'typescript' },
};

export const tabelaDeServidores: Abas = {
  'Template': { codigo: `<p-table
  [value]="servidores"
  [virtualScroll]="true"
  [virtualScrollItemSize]="40"
  styleClass="cs-table"
  aria-label="Lista de servidores cadastrados"
>
  <ng-template pTemplate="header">
    <tr><th scope="col">Matrícula</th><th scope="col">Nome</th><th scope="col">Situação</th></tr>
  </ng-template>
  <ng-template pTemplate="body" let-s>
    <tr>
      <td><span class="cs-mono">{{ s.matricula }}</span></td>
      <td>{{ s.nome }}</td>
      <td><p-tag [value]="s.situacaoLabel" [severity]="s.situacaoSeverity" /></td>
    </tr>
  </ng-template>
  <ng-template pTemplate="emptymessage">
    <tr><td colspan="3">Nenhum servidor encontrado com os filtros aplicados.</td></tr>
  </ng-template>
</p-table>`, linguagem: 'html' },
};
