// Node: node --test src/entities/sessao/model/permissoes.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { podeAcessar, podeVerAlertasUtilizacao, podeVerValoresMonetarios } from './permissoes.ts';

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

test('só o gestor acessa a administração e as seções dela', () => {
  assert.equal(podeAcessar('GESTOR', '/administracao'), true);
  assert.equal(podeAcessar('GESTOR', '/administracao/usuarios'), true);
  assert.equal(podeAcessar('OPERADOR', '/administracao'), false);
  assert.equal(podeAcessar('OPERADOR', '/administracao/usuarios'), false);
});

test('a área de administração não libera rotas com o mesmo começo', () => {
  assert.equal(podeAcessar('GESTOR', '/administracaox'), false);
});

test('rotas exatas continuam sem liberar sub-rotas para o operador', () => {
  assert.equal(podeAcessar('OPERADOR', '/motoristas'), true);
  assert.equal(podeAcessar('OPERADOR', '/motoristas/utilizacao'), false);
});
