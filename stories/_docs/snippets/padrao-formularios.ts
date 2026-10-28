import type { Abas } from '../Layout';

export const campoComErro: Abas = {
  'HTML/CSS': { codigo: `<div class="campo">
  <label for="cpf">CPF <span aria-hidden="true">*</span></label>
  <input id="cpf" name="cpf" inputmode="numeric" placeholder="Ex.: 123.456.789-09"
         required aria-required="true" aria-invalid="true" aria-describedby="cpf-erro">
  <p id="cpf-erro" class="erro">CPF inválido. Verifique os 11 dígitos e tente novamente.</p>
</div>

<div id="resumo" role="alert" tabindex="-1" class="resumo-erros">
  <p>Corrija 3 erros antes de continuar.</p>
  <ul><li><a href="#cpf">CPF: CPF inválido. Verifique os 11 dígitos e tente novamente.</a></li></ul>
</div>

.campo input[aria-invalid="true"] { border-color: var(--color-border-error-default); }
.erro { color: var(--color-text-error-primary); margin-block-start: 4px; }
.resumo-erros { background: var(--color-background-tertiary-error); border: 1px solid var(--color-border-error-default); }

/* No envio inválido: valide, mostre o resumo e mova o foco para ele */
document.getElementById('resumo').focus();` },
  'Angular com PrimeNG': { codigo: `// cadastro.component.ts
form = this.fb.group({
  cpf: ['', { validators: [Validators.required, cpfValido], updateOn: 'blur' }],
});

invalido(nome: string) {
  const c = this.form.get(nome);
  return !!c && c.invalid && (c.touched || this.enviado);
}

<!-- cadastro.component.html -->
<label for="cpf">CPF *</label>
<input pInputText id="cpf" formControlName="cpf" inputmode="numeric"
       [attr.aria-invalid]="invalido('cpf')" aria-describedby="cpf-erro" />
@if (invalido('cpf')) {
  <p-message id="cpf-erro" severity="error" variant="simple" size="small">
    CPF inválido. Verifique os 11 dígitos e tente novamente.
  </p-message>
}` },
  'React': { codigo: `import { Input } from '@/components/base/input/input';
import { FormActions } from '@/components/application/formulario/form-actions';

<form noValidate onSubmit={enviar}>
  <Input
    name="cpf"
    label="CPF"
    placeholder="Ex.: 123.456.789-09"
    isRequired
    value={cpf}
    onChange={setCpf}
    onBlur={() => setTocado(true)}
    isInvalid={Boolean(erro)}
    hint={erro}
  />
  <FormActions primaryLabel="Salvar" loadingLabel="Salvando" isLoading={salvando} />
</form>` },
};
