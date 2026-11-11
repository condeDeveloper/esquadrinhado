import { test } from 'node:test';
import assert from 'node:assert/strict';

import { buracoMaisBaixo, varrerLargura } from '../src/horizonte.js';
import {
  desenhar, todosDiferentes, areasFecham, ehEsquadrinhamentoPerfeito,
  MENOR_CONHECIDO, ORDEM_MINIMA,
} from '../src/juiz.js';

test('o buraco mais baixo e o mais a esquerda entre os empatados', () => {
  assert.deepEqual(buracoMaisBaixo(Int32Array.from([0, 0, 0])),
    { x: 0, altura: 0, largura: 3 });
  assert.deepEqual(buracoMaisBaixo(Int32Array.from([5, 2, 2, 7])),
    { x: 1, altura: 2, largura: 2 });
  assert.deepEqual(buracoMaisBaixo(Int32Array.from([3, 9, 1, 1, 1, 4])),
    { x: 2, altura: 1, largura: 3 });
});

test('a largura do buraco para no primeiro degrau', () => {
  const r = buracoMaisBaixo(Int32Array.from([1, 1, 1, 2, 1]));
  assert.equal(r.x, 0);
  assert.equal(r.largura, 3, 'nao pode pular o degrau de altura 2');
});

test('o 32 x 33 fecha: o juiz desenha e nao sobra nem falta casa', () => {
  const lados = [18, 14, 4, 10, 15, 7, 1, 9, 8];
  const { ok, motivo } = desenhar(32, 33, lados);
  assert.equal(ok, true, motivo);
  assert.equal(todosDiferentes(lados), true);
  assert.equal(areasFecham(32, 33, lados), true);
});

test('a soma dos quadrados do 32 x 33 da a area do retangulo', () => {
  const lados = [18, 14, 4, 10, 15, 7, 1, 9, 8];
  const soma = lados.reduce((a, s) => a + s * s, 0);
  assert.equal(soma, 1056);
  assert.equal(32 * 33, 1056);
});

test('o desenho usa cada casa exatamente uma vez', () => {
  const { grade } = desenhar(32, 33, [18, 14, 4, 10, 15, 7, 1, 9, 8]);
  const conta = new Map();
  for (const linha of grade) {
    for (const v of linha) {
      assert.notEqual(v, 0, 'casa vazia');
      conta.set(v, (conta.get(v) || 0) + 1);
    }
  }
  assert.equal(conta.size, 9, 'nove quadrados');
  // cada quadrado cobre exatamente lado^2 casas
  const lados = [18, 14, 4, 10, 15, 7, 1, 9, 8];
  for (let i = 0; i < lados.length; i++) {
    assert.equal(conta.get(i + 1), lados[i] * lados[i], `quadrado ${lados[i]}`);
  }
});

test('o juiz recusa lado repetido', () => {
  assert.equal(todosDiferentes([3, 3, 1]), false);
  assert.equal(ehEsquadrinhamentoPerfeito(4, 4, [2, 2, 2, 2]), false);
});

test('o juiz recusa area que nao fecha', () => {
  assert.equal(areasFecham(32, 33, [18, 14, 4]), false);
});

test('o juiz recusa quadrado que sai do retangulo', () => {
  const r = desenhar(5, 5, [9]);
  assert.equal(r.ok, false);
  assert.match(r.motivo, /saiu/);
});

test('o quadrado unico e o unico esquadrinhamento de ordem 1', () => {
  for (const L of [2, 5, 9]) {
    const r = varrerLargura(L, L, { ordem: 1 });
    assert.equal(r.achados, 1, `largura ${L}`);
  }
});

test('nenhuma ordem de 2 a 8 produz retangulo perfeito ate o limite 36', () => {
  for (let ordem = 2; ordem <= 8; ordem++) {
    let achados = 0;
    for (let L = 2; L <= 36; L++) achados += varrerLargura(L, 36, { ordem }).achados;
    assert.equal(achados, 0, `a ordem ${ordem} nao deveria achar nada`);
  }
});

test('a ordem minima e 9, e o menor conhecido bate com ela', () => {
  assert.equal(ORDEM_MINIMA, 9);
  assert.equal(MENOR_CONHECIDO.ordem, 9);
  assert.equal(MENOR_CONHECIDO.area, MENOR_CONHECIDO.largura * MENOR_CONHECIDO.altura);
  assert.equal(
    MENOR_CONHECIDO.lados.reduce((a, s) => a + s * s, 0),
    MENOR_CONHECIDO.area
  );
});

test('o orcamento para a varredura e marca que ela nao completou', () => {
  const r = varrerLargura(20, 20, { ordem: 9, orcamento: 500 });
  assert.equal(r.completou, false);
  assert.ok(r.nos <= 500);
});

test('o horizonte volta ao zero depois de cada ramo: nada vaza entre niveis', () => {
  // se o desfazer fosse errado, varrer duas vezes daria numeros diferentes
  const a = varrerLargura(12, 12, { ordem: 5 });
  const b = varrerLargura(12, 12, { ordem: 5 });
  assert.equal(a.nos, b.nos);
  assert.equal(a.achados, b.achados);
});
