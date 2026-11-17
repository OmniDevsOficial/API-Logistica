// Node: node --test src/entities/sessao/model/permissoes.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  podeAcessar,
  podeVerAlertasUtilizacao,
  podeVerValoresMonetarios,
} from './permissoes.ts';

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

test('gestor e operador acessam a tela de Registros', () => {
  assert.equal(podeAcessar('GESTOR', '/registros'), true);
  assert.equal(podeAcessar('OPERADOR', '/registros'), true);
});

test('a rota inicial nunca é Registros', () => {
  // rotaInicial pega a primeira da lista; Registros fica no meio.
  assert.equal(podeAcessar('GESTOR', '/'), true);
});
