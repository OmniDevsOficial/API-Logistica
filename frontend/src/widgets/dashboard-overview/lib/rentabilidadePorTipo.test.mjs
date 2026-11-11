import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  barrasDoGrafico,
  eixoDoGrafico,
  ROTULO_NAO_IDENTIFICADO,
} from './rentabilidadePorTipo.ts';

function tipo(nome, rentabilidade, naoIdentificado = false) {
  return {
    tipo: nome,
    naoIdentificado,
    viagens: 1,
    receita: 0,
    custo: 0,
    rentabilidade,
    mediaPorViagem: rentabilidade,
  };
}

test('formata o nome do tipo e marca a barra positiva, negativa e neutra', () => {
  const barras = barrasDoGrafico([
    tipo('CAVALO MECÂNICO', 500),
    tipo('VUC', -120.5),
    tipo('NAO_IDENTIFICADO', -40, true),
  ]);

  assert.deepEqual(
    barras.map(({ rotulo, destaque }) => ({ rotulo, destaque })),
    [
      { rotulo: 'Cavalo mecânico', destaque: 'positivo' },
      { rotulo: 'VUC', destaque: 'negativo' },
      { rotulo: ROTULO_NAO_IDENTIFICADO, destaque: 'neutro' },
    ],
  );
});

test('mantem o valor negativo da rentabilidade sem zerar', () => {
  const [barra] = barrasDoGrafico([tipo('VAN', -300)]);

  assert.equal(barra.rentabilidade, -300);
});

test('eixo so com valores positivos comeca no zero', () => {
  assert.deepEqual(eixoDoGrafico([322061.42, 5406.63]), {
    dominio: [0, 400000],
    marcacoes: [0, 200000, 400000],
  });
});

test('eixo abre para o lado negativo quando ha rentabilidade negativa', () => {
  assert.deepEqual(eixoDoGrafico([300000, -150000]), {
    dominio: [-150000, 300000],
    marcacoes: [-150000, 0, 150000, 300000],
  });
});

test('negativo pequeno entra no dominio sem marcacao colada no zero', () => {
  assert.deepEqual(eixoDoGrafico([400000, -500]), {
    dominio: [-500, 400000],
    marcacoes: [0, 200000, 400000],
  });
});

test('eixo so com valores negativos termina no zero', () => {
  assert.deepEqual(eixoDoGrafico([-800, -200]), {
    dominio: [-800, 0],
    marcacoes: [-800, -400, 0],
  });
});

test('eixo sem valores nao quebra', () => {
  assert.deepEqual(eixoDoGrafico([0]), { dominio: [0, 1], marcacoes: [0] });
});
