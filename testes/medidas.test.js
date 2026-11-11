// Os numeros do README, presos. Nenhum foi digitado de cabeca.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  retangulosDaOrdem, tabelaEstabilidade, conferidosPeloJuiz, tabelaSimetrias,
} from '../src/medidas.js';
import { menorDaOrdem } from '../src/horizonte.js';

test('a ordem 9 tem UM retangulo distinto ate o limite 36: o 32 x 33', () => {
  const r = retangulosDaOrdem(9, 36);
  assert.equal(r.completou, true);
  assert.equal(r.distintos, 1);
  assert.equal(r.nos, 6001000);
  const [unico] = r.lista;
  assert.equal(unico.largura, 32);
  assert.equal(unico.altura, 33);
  assert.equal(unico.area, 1056);
  assert.deepEqual([...unico.lados].sort((a, b) => a - b),
    [1, 4, 7, 8, 9, 10, 14, 15, 18]);
});

test('a contagem so sai de zero no limite 33, que e a altura do retangulo', () => {
  const esperado = { 20: 0, 25: 0, 30: 0, 33: 1, 36: 1 };
  for (const e of tabelaEstabilidade(9, [20, 25, 30, 33, 36])) {
    assert.equal(e.distintos, esperado[e.limite], `limite ${e.limite}`);
  }
});

test('o juiz desenha o 32 x 33 e a area fecha com a soma dos quadrados', () => {
  const [j] = conferidosPeloJuiz(9, 36);
  assert.equal(j.forma, '32x33');
  assert.equal(j.area, 1056);
  assert.equal(j.somaDosQuadrados, 1056);
  assert.equal(j.passouNoJuiz, true);
});

test('menorDaOrdem reencontra o 32 x 33 sozinho', () => {
  const { melhor, completou } = menorDaOrdem(9, 36);
  assert.equal(completou, true);
  assert.equal(melhor.area, 1056);
  assert.equal(Math.min(melhor.largura, melhor.altura), 32);
  assert.equal(Math.max(melhor.largura, melhor.altura), 33);
});

test('a busca esbarra 8 vezes no mesmo retangulo: 4 reflexoes x 2 orientacoes', () => {
  const s = tabelaSimetrias(9, 36);
  assert.equal(s.brutos, 8, 'acertos brutos da varredura');
  assert.equal(s.distintos, 1, 'retangulos de fato distintos');
  assert.equal(s.fator, 8);
});

test('as ordens 2 a 8 nao produzem nada, e cada uma custa o seu', () => {
  const esperado = {
    2: 8146, 3: 66706, 4: 367210, 5: 1321090,
    6: 3007158, 7: 4428717, 8: 5257708,
  };
  for (const [ordem, nos] of Object.entries(esperado)) {
    const r = retangulosDaOrdem(Number(ordem), 36);
    assert.equal(r.distintos, 0, `ordem ${ordem} nao deveria achar nada`);
    assert.equal(r.nos, nos, `nos da ordem ${ordem}`);
    assert.equal(r.completou, true);
  }
});

test('a ordem 10 tambem da zero ate o limite 36, e custa 6.347.187 nos', () => {
  const r = retangulosDaOrdem(10, 36);
  assert.equal(r.distintos, 0);
  assert.equal(r.nos, 6347187);
});
