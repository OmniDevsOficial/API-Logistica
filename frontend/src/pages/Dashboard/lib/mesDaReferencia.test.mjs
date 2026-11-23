import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mesDaReferencia, rotuloDoMes } from './mesDaReferencia.ts';

test('converte a data de referencia no mes AAAA-MM que o endpoint espera', () => {
  assert.equal(mesDaReferencia(new Date(2026, 7, 15)), '2026-08');
  assert.equal(mesDaReferencia(new Date(2026, 0, 31)), '2026-01');
  assert.equal(mesDaReferencia(new Date(2026, 1, 1)), '2026-02');
  assert.equal(mesDaReferencia(new Date(2026, 11, 1)), '2026-12');
});

test('mostra o nome do mes com a primeira letra maiuscula', () => {
  assert.equal(rotuloDoMes(new Date(2026, 7, 1)), 'Agosto de 2026');
});
