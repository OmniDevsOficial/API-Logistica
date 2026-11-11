// Node: node --test src/entities/sessao/model/permissoes.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { podeVerAlertasUtilizacao, podeVerValoresMonetarios } from './permissoes.ts';

test('gestor enxerga valores monetários', () => {
  assert.equal(podeVerValoresMonetarios('GESTOR'), true);
});

test('operador não enxerga valores monetários', () => {
  assert.equal(podeVerValoresMonetarios('OPERADOR'), false);
});

test('só o gestor recebe alertas de utilização', () => {
  assert.equal(podeVerAlertasUtilizacao('GESTOR'), true);
  assert.equal(podeVerAlertasUtilizacao('OPERADOR'), false);
});
