// Uma funcao por tabela do README. Nenhum numero do README e digitado a mao.

import { varrerLargura } from './horizonte.js';
import { ehEsquadrinhamentoPerfeito, ORDEM_MINIMA } from './juiz.js';

/**
 * Todos os retangulos de uma ordem, com as repeticoes por simetria juntadas.
 *
 * A varredura encontra o MESMO retangulo varias vezes: refletido na horizontal,
 * na vertical, e de novo com a largura e a altura trocadas, porque as duas
 * orientacoes aparecem quando se varre toda largura. Juntar por
 * `(menor lado) x (maior lado) + multiconjunto de lados` e o que transforma
 * "quantas vezes a busca esbarrou" em "quantos retangulos existem".
 */
export function retangulosDaOrdem(ordem, limite = 40, orcamento = Infinity) {
  const vistos = new Map();
  let nos = 0;
  let completou = true;

  for (let L = 2; L <= limite; L++) {
    const r = varrerLargura(L, limite, {
      ordem,
      orcamento,
      aoAchar(lados, altura) {
        const a = Math.min(L, altura);
        const b = Math.max(L, altura);
        const chave = `${a}x${b}:${[...lados].sort((x, y) => x - y).join(',')}`;
        if (!vistos.has(chave)) {
          vistos.set(chave, { largura: a, altura: b, area: a * b, lados: [...lados] });
        }
      },
    });
    nos += r.nos;
    if (!r.completou) {
      completou = false;
      break;
    }
  }

  const lista = [...vistos.values()].sort((x, y) => x.area - y.area);
  return { ordem, distintos: lista.length, lista, nos, completou };
}

/** Tabela 1 — quantos retangulos perfeitos cada ordem tem, e o menor deles. */
export function tabelaPorOrdem(de = 1, ate = 10, limite = 40, orcamento = Infinity) {
  const linhas = [];
  for (let ordem = de; ordem <= ate; ordem++) {
    const r = retangulosDaOrdem(ordem, limite, orcamento);
    const menor = r.lista[0] || null;
    linhas.push({
      ordem,
      distintos: r.distintos,
      nos: r.nos,
      completou: r.completou,
      menorArea: menor ? menor.area : null,
      menorForma: menor ? `${menor.largura}x${menor.altura}` : null,
      lados: menor ? menor.lados : null,
    });
  }
  return linhas;
}

/**
 * Tabela 2 — quantas vezes a busca esbarra no mesmo retangulo.
 *
 * E a diferenca entre contar acertos e contar objetos. Um retangulo nao
 * quadrado tem quatro reflexoes, e cada uma aparece de novo na orientacao
 * trocada: o fator esperado e 8.
 */
export function tabelaSimetrias(ordem, limite = 40) {
  let brutos = 0;
  for (let L = 2; L <= limite; L++) {
    brutos += varrerLargura(L, limite, { ordem }).achados;
  }
  const { distintos } = retangulosDaOrdem(ordem, limite);
  return { ordem, brutos, distintos, fator: distintos ? brutos / distintos : 0 };
}

/** Tabela 3 — o custo em nos de cada ordem. */
export function tabelaCusto(de = 1, ate = 10, limite = 40) {
  return tabelaPorOrdem(de, ate, limite).map(({ ordem, nos, distintos }) => ({
    ordem,
    nos,
    distintos,
    nosPorAchado: distintos ? Math.round(nos / distintos) : null,
  }));
}

/**
 * Tabela 4 — o teto de largura importa?
 *
 * A varredura precisa de um limite para as larguras. Se o limite for baixo
 * demais, retangulos ficam de fora e a contagem sai menor sem avisar. Esta
 * tabela mede a contagem contra o limite, e so quando ela ESTABILIZA o numero
 * pode ir para o README.
 */
export function tabelaEstabilidade(ordem, limites = [20, 25, 30, 35, 40]) {
  return limites.map((limite) => ({
    ordem,
    limite,
    distintos: retangulosDaOrdem(ordem, limite).distintos,
  }));
}

/** Tabela 5 — o juiz confere cada retangulo achado, desenhando de verdade. */
export function conferidosPeloJuiz(ordem, limite = 40) {
  const { lista } = retangulosDaOrdem(ordem, limite);
  return lista.map((r) => ({
    forma: `${r.largura}x${r.altura}`,
    area: r.area,
    somaDosQuadrados: r.lados.reduce((a, s) => a + s * s, 0),
    passouNoJuiz: ehEsquadrinhamentoPerfeito(r.largura, r.altura, r.lados)
      || ehEsquadrinhamentoPerfeito(r.altura, r.largura, r.lados),
  }));
}

export { ORDEM_MINIMA };
