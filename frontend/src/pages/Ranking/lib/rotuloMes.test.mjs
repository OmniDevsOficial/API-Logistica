// Node: node --test src/pages/Ranking/lib/rotuloMes.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mesDaReferencia, rotuloMes } from './rotuloMes.ts';

test('mês da referência no formato AAAA-MM com zero à esquerda', () => {
  assert.equal(mesDaReferencia(new Date(2026, 7, 31)), '2026-08');
  assert.equal(mesDaReferencia(new Date(2026, 11, 1)), '2026-12');
});

test('rótulo do mês no formato do figma', () => {
  assert.equal(rotuloMes(new Date(2026, 8, 1)), '1 Setembro 2026');
});

test('primeiro dia de dezembro vira 1 Dezembro 2026', () => {
  assert.equal(rotuloMes(new Date(2026, 11, 25)), '1 Dezembro 2026');
});
