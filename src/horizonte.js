// O algoritmo do horizonte (Bouwkamp, 1946).
//
// Cobrir um retangulo com quadrados parece pedir uma busca em duas dimensoes,
// mas nao pede. Mantendo a ALTURA de cada coluna, a proxima peca so pode ir num
// lugar: o ponto mais baixo e mais a esquerda do horizonte. Se fosse possivel
// deixar esse ponto para depois, algum quadrado teria de cobri-lo por cima, e
// quadrado nao flutua.
//
// Com isso a busca vira unidimensional: escolher o TAMANHO do quadrado que
// tapa aquele buraco. O resto e poda.

/** O ponto mais baixo do horizonte, e ate onde ele se estende. */
export function buracoMaisBaixo(alturas) {
  let onde = 0;
  for (let x = 1; x < alturas.length; x++) {
    if (alturas[x] < alturas[onde]) onde = x;
  }
  let largura = 1;
  const altura = alturas[onde];
  while (onde + largura < alturas.length && alturas[onde + largura] === altura) {
    largura++;
  }
  return { x: onde, altura, largura };
}

/**
 * Varre os retangulos de largura `L` e altura ate `alturaMax`, cobertos por
 * quadrados de tamanhos TODOS DIFERENTES.
 *
 * @param {object} opcoes
 *   - `ordem`: quantos quadrados exatamente (null = qualquer)
 *   - `aoAchar`: chamada com (lados, altura) a cada retangulo fechado
 *   - `orcamento`: teto de nos; estourar marca `completou: false`
 * @returns {{achados:number, nos:number, completou:boolean}}
 */
export function varrerLargura(L, alturaMax, opcoes = {}) {
  const { ordem = null, aoAchar = null, orcamento = Infinity } = opcoes;

  const alturas = new Int32Array(L);
  const usados = new Set();
  const lados = [];
  let achados = 0;
  let nos = 0;
  let estourou = false;

  function desce() {
    if (estourou) return;
    nos++;
    if (nos >= orcamento) {
      estourou = true;
      return;
    }

    const { x, altura, largura } = buracoMaisBaixo(alturas);

    // Horizonte plano E acima de zero: o retangulo fechou. O "acima de zero"
    // nao e detalhe — no comeco o horizonte tambem esta plano, e sem essa
    // condicao a busca daria o retangulo por pronto antes de pousar a primeira
    // peca e voltaria sem explorar nada.
    if (largura === L && altura > 0) {
      if (ordem === null || lados.length === ordem) {
        achados++;
        if (aoAchar) aoAchar(lados.slice(), altura);
      }
      return;
    }

    if (ordem !== null && lados.length >= ordem) return;

    const maximo = Math.min(largura, alturaMax - altura);
    for (let s = maximo; s >= 1; s--) {
      if (usados.has(s)) continue;
      usados.add(s);
      lados.push(s);
      for (let k = 0; k < s; k++) alturas[x + k] += s;

      desce();

      for (let k = 0; k < s; k++) alturas[x + k] -= s;
      lados.pop();
      usados.delete(s);
      if (estourou) return;
    }
  }

  desce();
  return { achados, nos, completou: !estourou };
}

/**
 * O menor retangulo esquadrinhado perfeito de cada ordem.
 *
 * Varre as larguras em ordem crescente e para na primeira que fecha, o que
 * garante que o achado e MINIMO em area para aquela ordem — nao so o primeiro
 * que apareceu.
 */
export function menorDaOrdem(ordem, larguraMax = 40, orcamento = Infinity) {
  let melhor = null;
  let nosTotais = 0;
  for (let L = 2; L <= larguraMax; L++) {
    const r = varrerLargura(L, larguraMax, {
      ordem,
      orcamento,
      aoAchar(lados, altura) {
        const area = L * altura;
        if (!melhor || area < melhor.area) {
          melhor = { largura: L, altura, area, lados: lados.slice() };
        }
      },
    });
    nosTotais += r.nos;
    if (!r.completou) return { melhor, nos: nosTotais, completou: false };
    // uma vez achado, larguras maiores que a area do melhor nao ajudam
    if (melhor && L * L > melhor.area) break;
  }
  return { melhor, nos: nosTotais, completou: true };
}
