// O juiz. Nao importa nada de `horizonte.js`.
//
// A busca trabalha com um vetor de alturas e nunca desenha o retangulo. O juiz
// faz o contrario: pega a lista de lados, POUSA cada quadrado numa grade de
// verdade e confere casa a casa que o retangulo ficou coberto exatamente uma
// vez. Dois caminhos independentes para a mesma pergunta.

/**
 * Reconstroi o desenho a partir da ordem em que os quadrados foram pousados.
 *
 * A regra do horizonte e deterministica — o proximo quadrado vai sempre no
 * ponto mais baixo e mais a esquerda — entao a lista de lados basta para
 * redesenhar tudo. Se a reconstrucao nao fechar, a busca mentiu.
 */
export function desenhar(largura, altura, lados) {
  const grade = Array.from({ length: altura }, () => new Int32Array(largura).fill(0));
  const alturas = new Int32Array(largura);

  for (let i = 0; i < lados.length; i++) {
    const s = lados[i];
    // ponto mais baixo e mais a esquerda
    let x = 0;
    for (let k = 1; k < largura; k++) if (alturas[k] < alturas[x]) x = k;
    const y = alturas[x];
    if (x + s > largura || y + s > altura) {
      return { ok: false, motivo: `quadrado ${s} saiu do retangulo`, grade };
    }
    for (let dy = 0; dy < s; dy++) {
      for (let dx = 0; dx < s; dx++) {
        if (grade[y + dy][x + dx] !== 0) {
          return { ok: false, motivo: `quadrado ${s} pisou em outro`, grade };
        }
        grade[y + dy][x + dx] = i + 1;
      }
    }
    for (let k = 0; k < s; k++) alturas[x + k] += s;
  }

  for (let y = 0; y < altura; y++) {
    for (let x = 0; x < largura; x++) {
      if (grade[y][x] === 0) return { ok: false, motivo: `casa ${x},${y} vazia`, grade };
    }
  }
  return { ok: true, motivo: '', grade };
}

/** Os lados sao todos diferentes? E o que faz o esquadrinhamento ser PERFEITO. */
export function todosDiferentes(lados) {
  return new Set(lados).size === lados.length;
}

/**
 * A soma das areas dos quadrados tem que dar a area do retangulo.
 *
 * E a conferencia mais barata que existe e pega erro de contagem na hora, sem
 * desenhar nada.
 */
export function areasFecham(largura, altura, lados) {
  const soma = lados.reduce((a, s) => a + s * s, 0);
  return soma === largura * altura;
}

/** Verdadeiro so se as tres condicoes valem ao mesmo tempo. */
export function ehEsquadrinhamentoPerfeito(largura, altura, lados) {
  return (
    todosDiferentes(lados) &&
    areasFecham(largura, altura, lados) &&
    desenhar(largura, altura, lados).ok
  );
}

/**
 * O menor retangulo esquadrinhado perfeito conhecido: 32 x 33, com 9
 * quadrados, achado por Moron em 1925. Nenhuma ordem abaixo de 9 admite um.
 *
 * A varredura tem que reencontrar isso sozinha — e e por isso que o valor
 * esta aqui: para discordar, nao para ser copiado para a tabela.
 */
export const MENOR_CONHECIDO = {
  ordem: 9,
  largura: 32,
  altura: 33,
  area: 1056,
  lados: [18, 15, 14, 10, 9, 8, 7, 4, 1],
};

/** Abaixo da ordem 9 nao existe nenhum: e isso que a varredura confirma. */
export const ORDEM_MINIMA = 9;
