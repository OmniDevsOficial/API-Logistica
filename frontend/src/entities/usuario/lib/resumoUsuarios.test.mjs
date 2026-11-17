import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resumirUsuarios } from './resumoUsuarios.ts';

const usuario = (perfil, ativo) => ({ id: 1, nome: 'x', email: 'x@x.com', perfil, ativo, criadoEm: '' });

test('conta total, ativos, gestores e operadores', () => {
  const resumo = resumirUsuarios([
    usuario('GESTOR', true),
    usuario('GESTOR', false),
    usuario('OPERADOR', true),
    usuario('OPERADOR', true),
    usuario('OPERADOR', false),
  ]);

  assert.deepEqual(resumo, { total: 5, ativos: 3, gestores: 2, operadores: 3 });
});

test('lista vazia zera tudo', () => {
  assert.deepEqual(resumirUsuarios([]), { total: 0, ativos: 0, gestores: 0, operadores: 0 });
});
