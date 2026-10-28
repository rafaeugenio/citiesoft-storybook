import type { Abas } from '../Layout';

export const tabelaDensa: Abas = {
  'HTML/CSS': { codigo: `<table class="tabela tabela--compacta">
  <caption>Tabela de processos TFD. 142 registros. Ordenada por data de cadastro, crescente.</caption>
  <thead>
    <tr>
      <th scope="col"><input type="checkbox" aria-label="Selecionar todos os registros da página"></th>
      <th scope="col" aria-sort="ascending"><button type="button">Cadastro</button></th>
      <th scope="col">Processo</th>
    </tr>
  </thead>
</table>

.tabela--compacta td { height: 36px; padding-block: 8px; padding-inline: 12px; }
.tabela--confortavel td { height: 48px; padding-block: 12px; padding-inline: 16px; }
.tabela td.numero, .tabela td.data { text-align: end; }` },
  'Angular com PrimeNG': { codigo: `<p-table
  [value]="processos()"
  [(selection)]="selecionados"
  dataKey="id"
  size="small"
  [paginator]="true"
  [rows]="20"
  [rowsPerPageOptions]="[20, 50, 100]"
  [scrollable]="true"
  scrollHeight="flex"
  currentPageReportTemplate="{first} a {last} de {totalRecords} registros"
  [showCurrentPageReport]="true">
  <ng-template #header>
    <tr>
      <th style="width: 40px"><p-tableHeaderCheckbox ariaLabel="Selecionar todos os registros da página" /></th>
      <th pSortableColumn="cadastro">Cadastro <p-sortIcon field="cadastro" /></th>
      <th>Processo</th>
    </tr>
  </ng-template>
</p-table>` },
  'React': { codigo: `import { DataListing } from '@/components/application/data-listing/data-listing';
import { FilterBar } from '@/components/application/filter-bar/filter-bar';
import { SelectionBar } from '@/components/application/selection-bar/selection-bar';

<FilterBar value={filtro} onChange={setFiltro} filters={filtros} resultCount={total} />
<DataListing
  label="Processos TFD"
  entity={{ singular: 'processo', plural: 'processos' }}
  columns={colunas}
  data={pagina}
  getRowId={(r) => r.id}
  getRowLabel={(r) => r.numero}
  density="compacta"
  selectable
  selectedKeys={selecionados}
  onSelectedKeysChange={setSelecionados}
  sort={ordem}
  onSortChange={setOrdem}
  total={total}
  page={paginaAtual}
  pageSize={20}
/>
<SelectionBar count={selecionados.size} actions={acoes} onClear={limpar} />` },
};
