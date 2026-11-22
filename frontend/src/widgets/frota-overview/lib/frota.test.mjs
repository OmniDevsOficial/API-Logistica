import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  barrasComOutras,
  formatarAtualizadoEm,
  formatarPercentual,
  percentualDe,
  rotuloNome,
  rotuloTipo,
} from './frota.ts';

test('rótulo de tipo e nome tratam o não identificado', () => {
  assert.equal(rotuloTipo('NAO_IDENTIFICADO'), 'Não identificado');
  assert.equal(rotuloTipo(null), 'Não identificado');
  assert.equal(rotuloTipo('CAVALO MECÂNICO'), 'Cavalo mecânico');
  assert.equal(rotuloNome('MERCEDES  BENZ'), 'Mercedes Benz');
  assert.equal(rotuloNome('NAO_IDENTIFICADO'), 'Não identificado');
});

test('agrupa o excedente em Outras mantendo o total', () => {
  const itens = [5, 4, 3, 2, 1].map((quantidade, i) => ({ nome: `M${i}`, quantidade }));

  const barras = barrasComOutras(itens, (nome) => nome, 3);

  assert.deepEqual(barras.map((b) => [b.rotulo, b.quantidade]), [['M0', 5], ['M1', 4], ['Outras (3)', 6]]);
});

test('não agrupa quando cabe no limite', () => {
  const itens = [{ nome: 'A', quantidade: 1 }];

  assert.equal(barrasComOutras(itens, (nome) => nome, 3).length, 1);
});

test('percentual e formatação', () => {
  assert.equal(percentualDe(1, 0), 0);
  assert.equal(percentualDe(1, 4), 25);
  assert.equal(formatarPercentual(66.666), '66,7%');
});

test('data de atualização em pt-BR ou traço', () => {
  assert.equal(formatarAtualizadoEm('2026-11-18T10:30:00'), '18/11/2026, 10:30');
  assert.equal(formatarAtualizadoEm(null), '-');
  assert.equal(formatarAtualizadoEm('xx'), '-');
});
