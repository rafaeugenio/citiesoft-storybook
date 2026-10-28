import type { Abas } from '../Layout';

export const exclusaoExemplo: Abas = {
  'HTML/CSS': { codigo: `<dialog id="excluir" role="alertdialog" aria-labelledby="excluir-titulo" aria-describedby="excluir-texto">
  <h2 id="excluir-titulo">Excluir diária?</h2>
  <p id="excluir-texto">Você está prestes a excluir a diária de Ana Paula Ribeiro, de 15/06 a 17/06/2025. Esta ação não pode ser desfeita.</p>
  <button type="button" autofocus value="cancelar">Cancelar</button>
  <button type="button" class="perigo" value="excluir">Excluir</button>
</dialog>

// o foco volta ao botão que abriu o diálogo
botaoExcluir.addEventListener('click', () => dialogo.showModal());
dialogo.addEventListener('close', () => botaoExcluir.focus());` },
  'Angular com PrimeNG': { codigo: `// diarias.component.ts
excluir(diaria: Diaria) {
  this.confirmation.confirm({
    header: 'Excluir diária?',
    message: 'Você está prestes a excluir a diária de ' + diaria.servidor + '. Esta ação não pode ser desfeita.',
    icon: 'pi pi-exclamation-triangle',
    defaultFocus: 'reject',
    rejectButtonProps: { label: 'Cancelar', severity: 'secondary', outlined: true },
    acceptButtonProps: { label: 'Excluir', severity: 'danger' },
    accept: () => this.servico.excluir(diaria.id).subscribe(() =>
      this.messages.add({ severity: 'success', summary: 'Diária excluída com sucesso.', life: 3000 })),
  });
}

<p-confirmdialog />` },
  'React': { codigo: `import { ConfirmDialog } from '@/components/application/dialog/confirm-dialog';

<ConfirmDialog
  isOpen={aberto}
  onOpenChange={setAberto}
  tone="danger"
  title="Excluir diária?"
  description="Você está prestes a excluir a diária de Ana Paula Ribeiro, de 15/06 a 17/06/2025. Esta ação não pode ser desfeita."
  confirmLabel="Excluir"
  loadingLabel="Excluindo"
  isLoading={excluindo}
  onConfirm={excluir}
/>

{/* Em massa: affectedCount={12} gera "Excluir 12 registros?" */}` },
};
