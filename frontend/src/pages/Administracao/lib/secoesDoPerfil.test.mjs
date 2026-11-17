import { test } from 'node:test';
import assert from 'node:assert/strict';
import { secaoPermitida, secoesDoPerfil } from './secoesDoPerfil.ts';

const secoes = [
  { id: 'usuarios', perfis: ['GESTOR'] },
  { id: 'aparencia', perfis: ['GESTOR', 'OPERADOR'] },
];

test('lista só as seções do perfil, na ordem registrada', () => {
  assert.deepEqual(secoesDoPerfil(secoes, 'GESTOR').map((s) => s.id), ['usuarios', 'aparencia']);
  assert.deepEqual(secoesDoPerfil(secoes, 'OPERADOR').map((s) => s.id), ['aparencia']);
});

test('encontra a seção da URL quando o perfil pode vê-la', () => {
  assert.equal(secaoPermitida(secoes, 'GESTOR', 'usuarios')?.id, 'usuarios');
});

test('recusa seção inexistente, ausente ou de outro perfil', () => {
  assert.equal(secaoPermitida(secoes, 'GESTOR', 'nao-existe'), null);
  assert.equal(secaoPermitida(secoes, 'GESTOR', undefined), null);
  assert.equal(secaoPermitida(secoes, 'OPERADOR', 'usuarios'), null);
});
