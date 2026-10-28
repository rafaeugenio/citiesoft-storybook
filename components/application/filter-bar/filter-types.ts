export interface FilterOption {
  value: string;
  label: string;
}

/** Filtro por lista: simples (um valor, `Select`) ou múltiplo (vários valores, menu). */
export interface FilterBarFilter {
  id: string;
  label: string;
  options: FilterOption[];
  multiple?: boolean;
  /** Rótulo da opção que remove o filtro (filtro simples). Padrão "Todos". */
  allLabel?: string;
}

/** Campo disponível no filtro por condições. Com `options`, o valor vira uma lista. */
export interface FilterBarField {
  id: string;
  label: string;
  options?: FilterOption[];
}

export interface FilterBarOperator {
  id: string;
  label: string;
}

export interface FilterCondition {
  id: string;
  fieldId: string;
  operatorId: string;
  value: string;
}

export interface FilterBarValue {
  search: string;
  /** Valores selecionados por filtro (`id` do filtro para lista de valores). */
  selections: Record<string, string[]>;
  conditions: FilterCondition[];
}

export const emptyFilterBarValue: FilterBarValue = { search: "", selections: {}, conditions: [] };

export const defaultOperators: FilterBarOperator[] = [
  { id: "igual", label: "é" },
  { id: "diferente", label: "não é" },
  { id: "contem", label: "contém" },
];

/** Quantidade de filtros ativos: busca, um por filtro de lista e um por condição. */
export function countActiveFilters(value: FilterBarValue): number {
  const lists = Object.values(value.selections).filter((v) => v.length > 0).length;
  return (value.search.trim() ? 1 : 0) + lists + value.conditions.length;
}
