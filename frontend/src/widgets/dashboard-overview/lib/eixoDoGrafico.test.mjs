import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  marcacoes,
  nomeDoMes,
  rotuloDoEixo,
  rotuloDoTooltip,
  tetoArredondado,
} from './eixoDoGrafico.ts';

test('arredonda o teto do eixo para um numero redondo acima do maior valor', () => {
  assert.equal(tetoArredondado(61_234), 80_000);
  assert.equal(tetoArredondado(889_035.33), 1_000_000);
  assert.equal(tetoArredondado(42), 50);
  assert.equal(tetoArredondado(694), 800);
  assert.equal(tetoArredondado(4), 4);
});

test('periodo sem valor positivo ainda tem um eixo valido', () => {
  assert.equal(tetoArredondado(0), 1);
  assert.equal(tetoArredondado(-302.31), 1);
});

test('marca zero, a metade e o teto do eixo', () => {
  assert.deepEqual(marcacoes(61_234, false), [0, 40_000, 80_000]);
  assert.deepEqual(marcacoes(42, true), [0, 25, 50]);
});

test('eixo de viagens nao mostra meia viagem', () => {
  assert.deepEqual(marcacoes(3, true), [0, 3]);
});

test('dia mostra so o numero no eixo e dia/mes no detalhe', () => {
  assert.equal(rotuloDoEixo('16/08', 'DIA'), '16');
  assert.equal(rotuloDoTooltip('16/08', 'DIA'), '16/08');
});

test('mes mostra o nome abreviado no eixo e mes/ano no detalhe', () => {
  assert.equal(rotuloDoEixo('08/2026', 'MES'), 'ago');
  assert.equal(rotuloDoTooltip('08/2026', 'MES'), 'ago/2026');
  assert.equal(nomeDoMes('12/2026'), 'dez/2026');
});
