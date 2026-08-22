import './Kbd.css';

/**
 * Kbd: marcador de atalho de teclado dentro de texto, item de menu ou tooltip.
 *
 * Sistema denso vive de atalho, e anunciar o atalho na interface é o que faz
 * alguém aprendê-lo. O elemento é um `<kbd>` real, com cada tecla num `<kbd>`
 * aninhado, que é a forma que a especificação HTML dá para sequência de teclas.
 *
 * A camada visual mostra o símbolo (`⌘`, `⇧`) e fica com `aria-hidden`, porque
 * leitor de tela lendo o símbolo não comunica nada. O nome acessível vem de um
 * texto oculto que diz cada tecla por extenso ("Command K"), derivado da tabela
 * abaixo ou sobreposto pela prop `rotulo`.
 */

/**
 * Símbolo visual → nome por extenso que o leitor de tela anuncia.
 *
 * Critério de idioma: modificadora sai com o nome impresso na tecla física
 * ("Command", "Shift", "Ctrl" vira "Control"), porque é assim que o usuário a
 * encontra no teclado; tecla sem nome impresso próprio (setas, espaço) sai em
 * português.
 */
const NOME_DA_TECLA: Record<string, string> = {
  '⌘': 'Command',
  '⇧': 'Shift',
  '⌥': 'Option',
  '⌃': 'Control',
  Ctrl: 'Control',
  Alt: 'Alt',
  '↵': 'Enter',
  '⏎': 'Enter',
  '⌫': 'Backspace',
  '⎋': 'Escape',
  Esc: 'Escape',
  '↑': 'Seta para cima',
  '↓': 'Seta para baixo',
  '←': 'Seta para a esquerda',
  '→': 'Seta para a direita',
  '␣': 'Espaço',
};

export interface KbdProps {
  /** Sequência na ordem em que se pressiona: `['⌘', 'K']`, `['Ctrl', 'S']`. */
  teclas: string[];
  /**
   * Sobrepõe o nome por extenso derivado da tabela de símbolos. Use quando a
   * sequência tiver uma tecla fora da tabela ou pedir leitura específica.
   */
  rotulo?: string;
}

export function Kbd({ teclas, rotulo }: KbdProps) {
  const porExtenso = rotulo ?? teclas.map((tecla) => NOME_DA_TECLA[tecla] ?? tecla).join(' ');

  return (
    <kbd className="citie-kbd">
      {teclas.map((tecla, indice) => (
        <kbd className="citie-kbd__tecla" aria-hidden="true" key={`${tecla}-${indice}`}>
          {tecla}
        </kbd>
      ))}
      <span className="citie-visualmente-oculto">{porExtenso}</span>
    </kbd>
  );
}
