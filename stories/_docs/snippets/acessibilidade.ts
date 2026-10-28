import type { Abas } from '../Layout';

export const a11yFoco: Abas = {
  'HTML/CSS': { codigo: `:focus-visible {
  outline: 2px solid var(--color-border-focus-ring);
  outline-offset: 2px;
}
/* Nunca remova o outline sem substituto */
button:focus { outline: none; } /* evite */` },
  'SCSS': { codigo: `@mixin foco {
  &:focus-visible {
    outline: 2px solid var(--color-border-focus-ring);
    outline-offset: 2px;
  }
}
.botao { @include foco; }` },
  'Tailwind': { codigo: `<button class="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring">
  Salvar
</button>` },
  'Angular': { codigo: `/* styles.scss */
:focus-visible {
  outline: 2px solid var(--color-border-focus-ring);
  outline-offset: 2px;
}
/* PrimeNG: ajuste o anel pelo token do preset, sem remover o foco dos componentes */` },
  'React': { codigo: `export const Botao = (p: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...p}
    className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
  />
);` },
};

export const a11yRotulos: Abas = {
  'HTML/CSS': { codigo: `<label for="cpf">CPF</label>
<input id="cpf" name="cpf" inputmode="numeric" aria-describedby="cpf-ajuda cpf-erro" aria-invalid="true">
<p id="cpf-ajuda">Somente números.</p>
<p id="cpf-erro" role="alert">Informe um CPF válido.</p>

<button type="button" aria-label="Fechar aviso">×</button>` },
  'SCSS': { codigo: `// Texto só para leitor de tela
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  margin: -1px; padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}` },
  'Tailwind': { codigo: `<label for="cpf" class="text-body-medium text-text-primary">CPF</label>
<input id="cpf" aria-describedby="cpf-erro" aria-invalid="true" class="h-9 rounded-2lg border border-border-button-default" />
<p id="cpf-erro" role="alert" class="text-caption-1-medium text-text-error-primary">Informe um CPF válido.</p>
<span class="sr-only">Etapa 2 de 4</span>` },
  'Angular': { codigo: `<label for="cpf">CPF</label>
<input id="cpf" [formControl]="cpf" [attr.aria-invalid]="cpf.invalid && cpf.touched"
       aria-describedby="cpf-erro" pInputText />
@if (cpf.invalid && cpf.touched) {
  <small id="cpf-erro" role="alert">Informe um CPF válido.</small>
}` },
  'React': { codigo: `import { useId } from 'react';

export function CampoCpf({ erro }: { erro?: string }) {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>CPF</label>
      <input id={id} aria-invalid={!!erro} aria-describedby={erro ? id + '-erro' : undefined} />
      {erro ? <p id={id + '-erro'} role="alert">{erro}</p> : null}
    </>
  );
}` },
};

export const a11yAlvo: Abas = {
  'HTML/CSS': { codigo: `.botao-icone {
  display: inline-grid;
  place-items: center;
  min-width: 36px;   /* tamanho medium do sistema */
  min-height: 36px;
}
/* WCAG 2.2 AA (2.5.8): mínimo de 24 x 24 px, ou espaço equivalente ao redor */` },
  'SCSS': { codigo: `$alvo-minimo: 24px;
$alvo-padrao: 36px;

.botao-icone { min-width: $alvo-padrao; min-height: $alvo-padrao; }` },
  'Tailwind': { codigo: `<!-- size-6 = 24px (xs, mínimo AA), size-8 = 32px (small), size-9 = 36px (medium) -->
<button class="grid size-9 place-items-center" aria-label="Editar"><RiEditLine class="size-5" /></button>` },
  'Angular': { codigo: `/* componente.scss */
.acao { min-width: 36px; min-height: 36px; }

/* PrimeNG: p-button size="small" mantém 32px; revise antes de reduzir mais */` },
  'React': { codigo: `export const Acao = ({ rotulo, children }: { rotulo: string; children: React.ReactNode }) => (
  <button type="button" aria-label={rotulo} className="grid size-9 place-items-center">
    {children}
  </button>
);` },
};
