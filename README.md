# esquadrinhado

Retângulos cobertos por quadrados de tamanhos **todos diferentes**, varridos
pelo algoritmo do horizonte. A pergunta é de 1925 e a resposta é bonita: o menor
que existe é `32 × 33`, com nove quadrados de lados 1, 4, 7, 8, 9, 10, 14, 15 e
18. Nenhuma ordem abaixo de nove produz um.

Sem dependência nenhuma. 20 testes.

## O algoritmo do horizonte

Cobrir um retângulo com quadrados parece pedir uma busca em duas dimensões, mas
não pede. Mantendo a **altura de cada coluna**, a próxima peça só pode ir num
lugar: o ponto mais baixo e mais à esquerda. Se fosse possível deixar esse ponto
para depois, algum quadrado teria de cobri-lo por cima — e quadrado não flutua.

Com isso a busca vira unidimensional: escolher o *tamanho* do quadrado que tapa
aquele buraco. O resto é poda.

## Os quatro achados

**1. Nenhuma ordem de 2 a 8 produz um retângulo perfeito, e fechar as sete
ordens vazias custa 14.456.735 nós.** O primeiro aparece na ordem 9: o `32 × 33`,
achado em 6.001.000 nós. É o tipo de resultado que só vale varrido — "não existe"
não se demonstra com exemplo.

**2. A busca esbarra 8 vezes no mesmo retângulo.** Um retângulo não quadrado tem
quatro reflexões, e cada uma volta na orientação trocada quando se varre toda
largura: `4 × 2 = 8`. Contar acertos daria oito retângulos de ordem 9 onde existe
**um**. A diferença entre contar acertos e contar objetos é o fator 8.

**3. A contagem só sai de zero no limite 33, que é a altura do retângulo.** Com
limite 20, 25 ou 30 a tabela diz **zero** — e diz sem avisar que está mentindo,
porque o objeto procurado simplesmente não cabe no domínio varrido. É por isso
que o limite aparece em toda tabela deste repositório.

**4. O custo explode 44 vezes para um limite 39% maior.** Limite 36 custa
6.001.000 nós na ordem 9; limite 50 custa 264.532.052. Subir de 36 para 50 é
subir 39% na largura e 4.308% no trabalho.

## Como rodar

```bash
node --test testes/*.test.js
node ferramentas/medidor.js
node ferramentas/medidor.js desenho     # o 32 x 33 desenhado em letras
LIMITE=50 node ferramentas/medidor.js ordens
```

## As tabelas

### Retângulos perfeitos por ordem (ambos os lados ≤ 36)

```
  ordem  distintos  nos        menor      area  lados
      2          0       8146          -     -  -
      3          0      66706          -     -  -
      4          0     367210          -     -  -
      5          0    1321090          -     -  -
      6          0    3007158          -     -  -
      7          0    4428717          -     -  -
      8          0    5257708          -     -  -
      9          1    6001000      32x33  1056  18,14,4,10,15,7,1,9,8
     10          0    6347187          -     -  -
```

### A contagem contra o limite de largura

```
  limite  distintos (ordem 9)
      20                    0
      25                    0
      30                    0
      33                    1
      36                    1
```

### O 32 × 33

```
  eeeeeeeeeeeeeeeiiiiiiiihhhhhhhhh
  eeeeeeeeeeeeeeeiiiiiiiihhhhhhhhh
  eeeeeeeeeeeeeeeiiiiiiiihhhhhhhhh
  eeeeeeeeeeeeeeeiiiiiiiihhhhhhhhh
  eeeeeeeeeeeeeeeiiiiiiiihhhhhhhhh
  eeeeeeeeeeeeeeeiiiiiiiihhhhhhhhh
  eeeeeeeeeeeeeeeiiiiiiiihhhhhhhhh
  eeeeeeeeeeeeeeeiiiiiiiihhhhhhhhh
  eeeeeeeeeeeeeeefffffffghhhhhhhhh
  eeeeeeeeeeeeeeefffffffdddddddddd
  eeeeeeeeeeeeeeefffffffdddddddddd
  eeeeeeeeeeeeeeefffffffdddddddddd
  eeeeeeeeeeeeeeefffffffdddddddddd
  eeeeeeeeeeeeeeefffffffdddddddddd
  eeeeeeeeeeeeeeefffffffdddddddddd
  aaaaaaaaaaaaaaaaaaccccdddddddddd
  aaaaaaaaaaaaaaaaaaccccdddddddddd
  aaaaaaaaaaaaaaaaaaccccdddddddddd
  aaaaaaaaaaaaaaaaaaccccdddddddddd
  aaaaaaaaaaaaaaaaaabbbbbbbbbbbbbb
  ...
```

Cada letra é um quadrado. A soma das nove áreas dá 1.056, que é exatamente
`32 × 33` — e o juiz confere isso desenhando casa a casa, não somando.

## O que as medidas me corrigiram

**A busca dava o retângulo por pronto antes de pousar a primeira peça.** A
condição de fim era "o horizonte está plano" — e no começo ele também está
plano, todo em zero. A primeira versão voltava imediatamente, com zero achados
em toda largura, e o bug se disfarçava de resultado: uma tabela cheia de zeros é
plausível demais num problema em que quase tudo é mesmo zero. O conserto é a
condição `altura > 0`, e o teste que exige um achado na ordem 1 existe para isso
não voltar.

**Escrevi uma asserção vazia no arquivo que existe para impedir chute.** Num
teste de simetria eu "verifiquei" `8 / 1 === 8` com os dois números digitados à
mão, e ainda deixei um `require` dentro de um módulo ESM que nunca rodava. Não
testava nada. Agora o número bruto sai da varredura e o distinto sai do
agrupamento, e o teste compara os dois.

**A ordem 9 tem dois retângulos conhecidos, e eu só alcanço um.** O outro é
`69 × 61`, e ele precisa de limite 69 — onde a varredura já não fecha em tempo
útil. A tabela diz "um, até o limite 36" em vez de dizer "um" e deixar a
impressão de que é o total. Com limite 50 o custo já sobe para 264 milhões de
nós e o segundo ainda não aparece.

## Os arquivos

```
src/horizonte.js   o algoritmo do horizonte e a varredura por largura
src/juiz.js        pousa os quadrados numa grade e confere casa a casa
src/medidas.js     uma funcao por tabela, com o limite sempre explicito
ferramentas/medidor.js
testes/nucleo.test.js    13 testes
testes/medidas.test.js    7 testes
```

O juiz não importa nada do horizonte: a busca trabalha com um vetor de alturas e
nunca desenha o retângulo; o juiz redesenha tudo numa grade de verdade e exige
que cada casa seja coberta exatamente uma vez.
