/**
 * Leitura de tempo do CSS, num módulo próprio para a suíte poder afirmá-la
 * direto sem transformar o arquivo de componentes em ponto de exportação de
 * funções soltas.
 */

/**
 * Espelho em JS do token `--citie-motion-rapido`, usado só como piso e como
 * plano B quando o valor computado não puder ser interpretado. O token segue
 * sendo a fonte da duração real da transição; esta constante nunca a substitui,
 * apenas impede que uma leitura falha encolha a rede de segurança.
 */
export const MOTION_RAPIDO_NOMINAL_MS = 140;

/**
 * Converte um tempo do CSS para milissegundos tratando o sufixo de forma
 * explícita. `Number.parseFloat` sozinho não serve aqui: o minificador de CSS
 * do Vite reserializa `140ms` como `.14s` no artefato de build, e a leitura
 * ingênua devolveria `0.14`, transformando a rede de segurança de 280ms num
 * disparo de fração de milissegundo que vence a corrida contra a própria
 * transição que ela deveria apenas cobrir. Devolve `null` quando a unidade não
 * é reconhecida, para o chamador cair no valor nominal em vez de num zero.
 *
 * A suíte afirma a conversão direto, com as duas grafias que o mesmo token
 * assume: `140ms` no servidor de desenvolvimento e `.14s` no artefato. O
 * ambiente de teste nunca minifica CSS, então uma asserção que só observasse o
 * comportamento em cena jamais veria a segunda grafia.
 */
export function tempoCssEmMs(bruto: string): number | null {
  const texto = bruto.trim().toLowerCase();
  const numero = Number.parseFloat(texto);
  if (!Number.isFinite(numero)) return null;
  if (texto.endsWith('ms')) return numero;
  if (texto.endsWith('s')) return numero * 1000;
  return null;
}
