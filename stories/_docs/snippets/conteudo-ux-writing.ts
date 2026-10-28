import type { Abas } from '../Layout';

export const campoComErro: Abas = {
  'HTML/CSS': { linguagem: 'html', codigo: `<label for="cpf">CPF <span aria-hidden="true">*</span></label>
<input
  id="cpf"
  name="cpf"
  placeholder="Ex.: 000.000.000-00"
  aria-required="true"
  aria-invalid="true"
  aria-describedby="cpf-erro"
/>
<small id="cpf-erro" role="alert" class="erro">
  CPF inválido. Verifique os dígitos e tente novamente.
</small>

<style>
  .erro { color: #dc2626; font-size: 12px; }
</style>` },
  'Angular (PrimeNG)': { linguagem: 'html', codigo: `<label for="cpf">CPF <span class="text-red-600" aria-hidden="true">*</span></label>
<input
  id="cpf"
  pInputText
  formControlName="cpf"
  placeholder="Ex.: 000.000.000-00"
  aria-required="true"
  aria-describedby="cpf-erro"
/>
@if (form.get('cpf')?.invalid && form.get('cpf')?.touched) {
  <small id="cpf-erro" class="p-error" role="alert">
    CPF inválido. Verifique os dígitos e tente novamente.
  </small>
}` },
  'React': { linguagem: 'tsx', codigo: `export function CampoCpf({ valor, erro, onChange }: Props) {
  return (
    <div>
      <label htmlFor="cpf">CPF <span aria-hidden="true">*</span></label>
      <input
        id="cpf"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ex.: 000.000.000-00"
        aria-required="true"
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? 'cpf-erro' : undefined}
      />
      {erro ? (
        <small id="cpf-erro" role="alert" className="text-red-600">
          {erro}
        </small>
      ) : null}
    </div>
  );
}` },
};

export const feedbackEConfirmacao: Abas = {
  'Angular (PrimeNG)': { linguagem: 'ts', codigo: `// Toast de sucesso
this.messageService.add({
  severity: 'success',
  summary: 'Lançamento salvo',
  detail: 'O lançamento de diária foi salvo com sucesso.',
  life: 5000,
});

// Confirmação destrutiva
this.confirmationService.confirm({
  header: 'Excluir servidor João Mendes?',
  message: 'Todos os dados funcionais, lançamentos e histórico vinculados a este servidor serão removidos permanentemente. Esta ação não pode ser desfeita.',
  acceptLabel: 'Excluir servidor',
  rejectLabel: 'Cancelar',
  acceptButtonStyleClass: 'p-button-danger',
  accept: () => this.excluirServidor(),
});` },
  'React': { linguagem: 'tsx', codigo: `<dialog open aria-labelledby="titulo-exclusao">
  <h2 id="titulo-exclusao">Excluir servidor João Mendes?</h2>
  <p>
    Todos os dados funcionais, lançamentos e histórico vinculados a este
    servidor serão removidos permanentemente. Esta ação não pode ser desfeita.
  </p>
  <button type="button" className="btn btn--danger" onClick={excluir}>
    Excluir servidor
  </button>
  <button type="button" className="btn" onClick={fechar}>
    Cancelar
  </button>
</dialog>

<div role="status">Lançamento salvo com sucesso.</div>` },
};
