#!/usr/bin/env node
// Roda as tabelas e cospe os numeros que vao para o README.
//
//   node ferramentas/medidor.js            todas
//   node ferramentas/medidor.js ordens     uma so
//
// O LIMITE de largura e parametro de todas elas, e aparece em toda tabela: sem
// ele os numeros nao querem dizer nada, porque o dominio muda com o limite.

import {
  tabelaPorOrdem, tabelaSimetrias, tabelaCusto,
  tabelaEstabilidade, conferidosPeloJuiz,
} from '../src/medidas.js';
import { MENOR_CONHECIDO, desenhar } from '../src/juiz.js';

const LIMITE = Number(process.env.LIMITE || 36);

const tabelas = {
  ordens() {
    console.log('Retangulos perfeitos por ordem (ambos os lados <= %d)', LIMITE);
    console.log('-----------------------------------------------------');
    console.log('  ordem  distintos  nos        menor      area  lados');
    for (const l of tabelaPorOrdem(2, 10, LIMITE)) {
      console.log('  %s  %s  %s  %s  %s  %s',
        String(l.ordem).padStart(5), String(l.distintos).padStart(9),
        String(l.nos).padStart(9), (l.menorForma || '-').padStart(9),
        String(l.menorArea ?? '-').padStart(4), l.lados ? l.lados.join(',') : '-');
    }
    console.log();
    console.log('  nenhuma ordem abaixo de 9 produz um retangulo perfeito.');
  },

  simetrias() {
    console.log('Quantas vezes a busca esbarra no mesmo retangulo');
    console.log('------------------------------------------------');
    const s = tabelaSimetrias(9, LIMITE);
    console.log('  ordem %d: %d acertos brutos, %d retangulo distinto, fator %d',
      s.ordem, s.brutos, s.distintos, s.fator);
    console.log();
    console.log('  um retangulo nao quadrado tem 4 reflexoes, e cada uma volta');
    console.log('  na orientacao trocada quando se varre toda largura: 4 x 2 = 8.');
  },

  custo() {
    console.log('O custo em nos de cada ordem (limite %d)', LIMITE);
    console.log('----------------------------------------');
    console.log('  ordem  nos        distintos');
    for (const l of tabelaCusto(2, 10, LIMITE)) {
      console.log('  %s  %s  %s',
        String(l.ordem).padStart(5), String(l.nos).padStart(9),
        String(l.distintos).padStart(9));
    }
  },

  estabilidade() {
    console.log('A contagem contra o limite de largura');
    console.log('-------------------------------------');
    console.log('  um limite baixo demais corta retangulos SEM AVISAR. So depois');
    console.log('  de a contagem estabilizar o numero pode ir para o README.');
    console.log('  limite  distintos (ordem 9)');
    for (const e of tabelaEstabilidade(9, [20, 25, 30, 33, 36])) {
      console.log('  %s  %s', String(e.limite).padStart(6), String(e.distintos).padStart(17));
    }
    console.log();
    console.log('  a contagem sai de zero exatamente em 33, que e a altura do');
    console.log('  retangulo: abaixo disso ele nao cabe no dominio varrido.');
  },

  juiz() {
    console.log('O juiz desenha cada retangulo achado, casa a casa');
    console.log('-------------------------------------------------');
    for (const j of conferidosPeloJuiz(9, LIMITE)) {
      console.log('  %s  area %d  soma dos quadrados %d  %s',
        j.forma, j.area, j.somaDosQuadrados,
        j.passouNoJuiz ? 'fecha' : 'NAO FECHA');
    }
    console.log();
    console.log('  e o menor conhecido, para comparar: %dx%d com %d quadrados',
      MENOR_CONHECIDO.largura, MENOR_CONHECIDO.altura, MENOR_CONHECIDO.ordem);
  },

  desenho() {
    console.log('O 32 x 33 desenhado');
    console.log('-------------------');
    const lados = [18, 14, 4, 10, 15, 7, 1, 9, 8];
    const { ok, grade } = desenhar(32, 33, lados);
    if (!ok) {
      console.log('  nao fechou');
      return;
    }
    const letras = ' abcdefghijklmnop';
    for (let y = grade.length - 1; y >= 0; y--) {
      console.log('  ' + Array.from(grade[y], (v) => letras[v] || '?').join(''));
    }
    console.log();
    console.log('  lados: %s', lados.join(', '));
  },
};

const pedida = process.argv[2];
const nomes = pedida ? [pedida] : Object.keys(tabelas);
for (const nome of nomes) {
  if (!tabelas[nome]) {
    console.error('tabela desconhecida: %s', nome);
    console.error('conhecidas: %s', Object.keys(tabelas).join(', '));
    process.exit(1);
  }
  tabelas[nome]();
  console.log();
}
