/**
 * Ferramentas de medição das stories da família de campo (Field, Input,
 * Textarea, DatePicker, Select), que afirmam borda e tinta computadas em vez
 * de descrevê-las em comentário.
 */

/**
 * Converte o hex de um token de cor na notação `rgb()` que o navegador
 * devolve em `getComputedStyle`.
 *
 * Existe para a asserção comparar sempre com o TOKEN: cor transcrita à mão na
 * story envelhece calada quando a fundação muda, e ainda obrigaria a duplicar
 * o valor por tema. Como o valor é lido do próprio elemento sob teste, a mesma
 * asserção vale no claro e no escuro. Aceita as cores de token do DS, que são
 * hex de seis dígitos.
 */
export function corDoToken(elemento: Element, token: string) {
  const hex = getComputedStyle(elemento).getPropertyValue(token).trim();
  const canal = Number.parseInt(hex.slice(1), 16);
  return `rgb(${(canal >> 16) & 255}, ${(canal >> 8) & 255}, ${canal & 255})`;
}

function* regrasDeEstilo(): Generator<CSSStyleRule> {
  for (const folha of Array.from(document.styleSheets)) {
    let regras: CSSRuleList;
    try {
      regras = folha.cssRules;
    } catch {
      // Folha de outra origem: o navegador nega a leitura. Nenhuma do DS cai
      // aqui, e engolir mantém a varredura viva se alguma entrar.
      continue;
    }
    for (const regra of Array.from(regras)) {
      if (regra instanceof CSSStyleRule) yield regra;
      else if (regra instanceof CSSMediaRule || regra instanceof CSSSupportsRule) {
        for (const interna of Array.from(regra.cssRules)) {
          if (interna instanceof CSSStyleRule) yield interna;
        }
      }
    }
  }
}

/**
 * Lê a cor que uma regra de estilo DECLARA e devolve resolvida contra o
 * elemento, na mesma notação `rgb()` de `getComputedStyle`.
 *
 * POR QUE ISTO EXISTE NO LUGAR DE UM PONTEIRO. O pseudo `:hover` do CSS
 * responde à posição física do cursor. `userEvent.hover` despacha evento
 * sintético, que serve a componente reagindo em JavaScript (Tooltip,
 * HoverCard) e não move cursor nenhum, então a medição leria a cor de
 * repouso. As duas saídas que mexem no estado de verdade passam por chamada ao
 * driver do navegador, e nenhuma sobrevive à suíte inteira aqui: o cursor do
 * Playwright funciona com um punhado de arquivos e para de voltar com os 119,
 * e o `CSS.forcePseudoState` do CDP, que é o botão ":hov" do DevTools, gastou
 * 5,5s só no `DOM.enable` na mesma condição, contra 15s de tempo total do
 * teste. Asserção de acessibilidade que passa por sorte é pior que asserção
 * nenhuma, então a guarda foi partida em duas metades sem driver:
 *
 * 1. O VALOR do degrau é medido renderizado, no campo preenchido e no addon do
 *    grupo preenchido, que pintam pelo MESMO token que o hover usa.
 * 2. O ALVO da regra de hover é lido aqui, na folha viva, e comparado com esse
 *    mesmo valor.
 *
 * Junto, o par reprova a troca do token do degrau (metade 1) e a volta do
 * hover para o degrau que apagava a fronteira (metade 2), que é o defeito que
 * este recorte existe para consertar.
 *
 * Falha alto quando a regra some ou muda de nome, porque guarda que emudece ao
 * perder o alvo deixa de guardar.
 */
export function corDeclaradaNaRegra(
  elemento: Element,
  trechoDoSeletor: string,
  propriedade = 'border-color',
) {
  const encontradas = Array.from(regrasDeEstilo()).filter(
    (regra) =>
      regra.selectorText.includes(trechoDoSeletor) &&
      regra.style.getPropertyValue(propriedade).trim() !== '',
  );
  // A última é a que vale, pela ordem da cascata entre iguais.
  const regra = encontradas.at(-1);
  if (!regra) {
    throw new Error(
      `Nenhuma regra com "${trechoDoSeletor}" declara ${propriedade}. ` +
        'A regra saiu da folha ou o seletor mudou de nome.',
    );
  }

  const declarado = regra.style.getPropertyValue(propriedade).trim();
  const token = /^var\(\s*(--[\w-]+)\s*\)$/.exec(declarado)?.[1];
  if (!token) {
    throw new Error(
      `A regra "${regra.selectorText}" declara ${propriedade}: ${declarado}, ` +
        'que é cor solta. Cor de fronteira no DS vem de token.',
    );
  }
  return corDoToken(elemento, token);
}
