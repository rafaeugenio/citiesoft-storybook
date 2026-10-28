import { maskCpf } from "@/components/application/login-simples/mask-cpf";

export { maskCpf };

const soDigitos = (valor: string) => valor.replace(/\D/g, "");

/** Máscara do Cartão Nacional de Saúde: 000 0000 0000 0000. */
export function maskCns(valor: string): string {
  const d = soDigitos(valor).slice(0, 15);
  return [d.slice(0, 3), d.slice(3, 7), d.slice(7, 11), d.slice(11, 15)].filter(Boolean).join(" ");
}

/** Máscara de data dd/mm/aaaa. */
export function maskData(valor: string): string {
  const d = soDigitos(valor).slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

/** Máscara de telefone (99) 99999-9999 ou (99) 9999-9999. */
export function maskTelefone(valor: string): string {
  const d = soDigitos(valor).slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Máscara de CEP 00000-000. */
export function maskCep(valor: string): string {
  const d = soDigitos(valor).slice(0, 8);
  return d.length <= 5 ? d : `${d.slice(0, 5)}-${d.slice(5)}`;
}

export function cpfValido(valor: string): boolean {
  const d = soDigitos(valor);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const digito = (base: number) => {
    let soma = 0;
    for (let i = 0; i < base; i += 1) soma += Number(d[i]) * (base + 1 - i);
    return ((soma * 10) % 11) % 10;
  };
  return digito(9) === Number(d[9]) && digito(10) === Number(d[10]);
}

export function cnsValido(valor: string): boolean {
  const d = soDigitos(valor);
  if (d.length !== 15) return false;
  let soma = 0;
  for (let i = 0; i < 15; i += 1) soma += Number(d[i]) * (15 - i);
  return soma % 11 === 0 && /^[1289]/.test(d);
}

/** Converte dd/mm/aaaa em Date, ou null se a data não existir. */
export function lerData(valor: string): Date | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(valor);
  if (!m) return null;
  const [dia, mes, ano] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const data = new Date(ano, mes - 1, dia);
  if (data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia) return null;
  return data;
}

/** Data de hoje fixa nas telas, para os exemplos não mudarem com o calendário. */
export const HOJE_EXEMPLO = new Date(2026, 9, 21);

export function emailValido(valor: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim());
}

export interface RequisitoSenha {
  id: string;
  rotulo: string;
  atendido: boolean;
}

export function requisitosSenha(senha: string): RequisitoSenha[] {
  return [
    { id: "tamanho", rotulo: "Pelo menos 8 caracteres", atendido: senha.length >= 8 },
    { id: "maiuscula", rotulo: "Uma letra maiúscula", atendido: /[A-ZÀ-Ý]/.test(senha) },
    { id: "minuscula", rotulo: "Uma letra minúscula", atendido: /[a-zà-ÿ]/.test(senha) },
    { id: "numero", rotulo: "Um número", atendido: /\d/.test(senha) },
    { id: "simbolo", rotulo: "Um símbolo, como ! ou @", atendido: /[^A-Za-z0-9À-ÿ]/.test(senha) },
  ];
}

export type ForcaSenha = { nivel: 0 | 1 | 2 | 3 | 4; rotulo: string };

export function forcaSenha(senha: string): ForcaSenha {
  if (senha === "") return { nivel: 0, rotulo: "Vazia" };
  const atendidos = requisitosSenha(senha).filter((r) => r.atendido).length;
  const bonus = senha.length >= 12 ? 1 : 0;
  const pontos = Math.min(5, atendidos + bonus);
  if (pontos <= 2) return { nivel: 1, rotulo: "Fraca" };
  if (pontos === 3) return { nivel: 2, rotulo: "Razoável" };
  if (pontos === 4) return { nivel: 3, rotulo: "Boa" };
  return { nivel: 4, rotulo: "Forte" };
}
