import type { Abas } from '../Layout';

export const erroInline: Abas = {
  'Angular (PrimeNG)': { codigo: `<label for="cpf">CPF</label>
<p-inputmask
  inputId="cpf"
  formControlName="cpf"
  mask="999.999.999-99"
  placeholder="000.000.000-00"
  [attr.aria-invalid]="invalido() ? true : null"
  aria-describedby="cpf-erro" />

@if (invalido()) {
  <small id="cpf-erro" role="alert">CPF inválido. Verifique os 11 dígitos.</small>
}`, linguagem: 'html' },
  'HTML/CSS': { codigo: `<label for="cpf">CPF</label>
<input id="cpf" name="cpf" inputmode="numeric" placeholder="000.000.000-00"
  aria-invalid="true" aria-describedby="cpf-erro">
<small id="cpf-erro" role="alert">CPF inválido. Verifique os 11 dígitos.</small>

input[aria-invalid="true"] { border-color: var(--color-text-error-primary); }
small[role="alert"] { color: var(--color-text-error-primary); font-size: 12px; }`, linguagem: 'html' },
  'React': { codigo: `export function CampoCpf({ erro }: { erro?: string }) {
  return (
    <>
      <label htmlFor="cpf">CPF</label>
      <input
        id="cpf"
        inputMode="numeric"
        placeholder="000.000.000-00"
        aria-invalid={erro ? true : undefined}
        aria-describedby="cpf-erro"
      />
      {erro ? <small id="cpf-erro" role="alert">{erro}</small> : null}
    </>
  );
}`, linguagem: 'tsx' },
};
