import { useEffect, useRef, useState } from 'react';

/**
 * Valor numérico que transita entre dois estados em vez de trocar de golpe.
 *
 * O problema que resolve é concreto e aparece no Painel de TFD: ao trocar o
 * período do filtro, oito indicadores mudam ao mesmo tempo. Trocando de golpe,
 * o operador não tem como saber qual deles mudou e quanto. Com a transição, o
 * movimento aponta para o que mudou, e a distância percorrida diz o tamanho da
 * mudança.
 *
 * Três cuidados que a versão ingênua deste componente costuma esquecer:
 *
 * 1. **O valor chega formatado.** `R$ 962.150` e `1.486` são texto, não número.
 *    O componente separa o miolo numérico dos afixos e transita só o miolo,
 *    devolvendo a formatação original a cada quadro. Reformatar por conta
 *    própria produziria separador de milhar errado no meio da transição.
 *
 * 2. **Leitor de tela não pode ouvir os quadros intermediários.** Um número que
 *    passa por trinta valores até chegar ao destino viraria trinta anúncios. O
 *    texto que anima fica fora da árvore de acessibilidade, e o valor real vive
 *    num texto visualmente oculto que muda uma única vez, ao fim.
 *
 * 3. **A largura não pode tremer.** Sem `tabular-nums`, cada dígito tem largura
 *    própria e o número inteiro balança durante a contagem, o que num painel
 *    com oito indicadores lado a lado faz a linha toda vibrar.
 */

interface ValorEmTransicaoProps {
  /** Valor já formatado para exibição, como `1.486` ou `R$ 962.150`. */
  valor: string;
  className?: string;
}

/** Separa o maior trecho numérico do texto, preservando prefixo e sufixo. */
function separar(texto: string) {
  const encontrado = texto.match(/[\d.,]*\d/);
  if (!encontrado || encontrado.index === undefined) return null;

  const miolo = encontrado[0];
  const digitos = miolo.replace(/\D/g, '');
  if (!digitos) return null;

  return {
    prefixo: texto.slice(0, encontrado.index),
    sufixo: texto.slice(encontrado.index + miolo.length),
    numero: Number(digitos),
    /** O molde preserva a pontuação original: `1.486` volta como `1.486`. */
    molde: miolo,
  };
}

/**
 * Formata um inteiro no mesmo estilo do molde, **inclusive quando ele cresce ou
 * encolhe de dígito**.
 *
 * A primeira versão exigia molde de comprimento igual e trocava direto no resto
 * dos casos. Um revisor mediu no Painel de TFD com as fixtures reais e mostrou
 * que, ali, mudar de quantidade de dígitos é a regra: 595 para 1.673 e 368 para
 * 1.036 trocavam de golpe, e só 103 para 287 animava. A funcionalidade não
 * disparava justamente no caso que a justifica.
 *
 * Molde puramente numérico com agrupamento por ponto é reformatado pelo
 * `Intl`, que sabe onde o separador entra em cada tamanho. Molde com vírgula
 * decimal preserva a quantidade de casas.
 */
function vestir(numero: number, molde: string) {
  const casasDecimais = molde.includes(',') ? (molde.split(',')[1] ?? '').length : 0;

  // Molde de inteiro agrupado por ponto, ou sem pontuação nenhuma: o `Intl`
  // reagrupa corretamente em qualquer tamanho.
  if (casasDecimais === 0) {
    const agrupado = molde.includes('.');
    return agrupado
      ? Math.round(numero).toLocaleString('pt-BR')
      : String(Math.round(numero));
  }

  return numero.toLocaleString('pt-BR', {
    minimumFractionDigits: casasDecimais,
    maximumFractionDigits: casasDecimais,
  });
}


export function ValorEmTransicao({ valor, className }: ValorEmTransicaoProps) {
  const [exibido, setExibido] = useState(valor);
  const anterior = useRef(valor);
  const quadro = useRef<number>(undefined);

  useEffect(() => {
    const de = separar(anterior.current);
    const para = separar(valor);
    anterior.current = valor;

    const movimentoReduzido =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    // Sem miolo numérico, sem transição possível: texto vira texto.
    // Molde diferente (mudou a moeda, o sufixo ou a quantidade de casas)
    // também troca direto, porque interpolar entre moldes distintos produziria
    // valores que nunca existiram.
    /*
     * A guarda compara **prefixo e sufixo**, e não o comprimento do molde.
     *
     * O que impede a interpolação é a mudança de FORMATO: sair de `512` para
     * `R$ 1.486` troca a natureza do valor, e interpolar mostraria um número
     * sem moeda virando um com moeda no meio do caminho. Mudar de quantidade
     * de dígitos, ao contrário, é o comportamento normal de um indicador, e a
     * versão anterior tratava isso como impedimento, o que fazia a transição
     * não disparar no caso mais comum do Painel.
     */
    const formatoMudou =
      de?.prefixo !== para?.prefixo ||
      de?.sufixo !== para?.sufixo ||
      de?.molde.includes(',') !== para?.molde.includes(',');

    if (!de || !para || movimentoReduzido || formatoMudou) {
      setExibido(valor);
      return;
    }

    if (de.numero === para.numero) {
      setExibido(valor);
      return;
    }

    const duracao = 320;
    const inicio = performance.now();

    const passo = (agora: number) => {
      const progresso = Math.min(1, (agora - inicio) / duracao);
      // Desaceleração no fim: o número chega ao destino e assenta, em vez de
      // parar de repente. É a mesma curva de saída da fundação de motion.
      const suave = 1 - (1 - progresso) ** 3;
      const atual = de.numero + (para.numero - de.numero) * suave;

      setExibido(`${para.prefixo}${vestir(atual, para.molde)}${para.sufixo}`);

      if (progresso < 1) quadro.current = requestAnimationFrame(passo);
      else setExibido(valor);
    };

    quadro.current = requestAnimationFrame(passo);
    return () => {
      if (quadro.current !== undefined) cancelAnimationFrame(quadro.current);
    };
  }, [valor]);

  // Em repouso existe um único nó de texto, com o valor real. A duplicata só
  // aparece enquanto a transição corre, e some ao terminar.
  //
  // Renderizar as duas o tempo todo pareceria mais simples e criaria dois
  // problemas: o mesmo texto apareceria duas vezes no DOM para qualquer consulta
  // por conteúdo, e a asserção da story precisaria ser afrouxada para conviver
  // com isso. Enfraquecer o teste para acomodar a implementação é o caminho
  // errado.
  const transitando = exibido !== valor;

  if (!transitando) return <span className={className}>{valor}</span>;

  return (
    <span className={className}>
      {/*
        Os quadros intermediários existem só para o olho. Deixá-los na árvore de
        acessibilidade transformaria uma mudança de valor em dezenas de anúncios.
      */}
      <span aria-hidden="true">{exibido}</span>
      <span className="citie-visualmente-oculto">{valor}</span>
    </span>
  );
}
