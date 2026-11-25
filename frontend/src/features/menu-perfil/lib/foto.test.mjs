import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TAMANHO_MAXIMO_DA_FOTO, validarArquivoDeFoto, validarNome } from './foto.ts';

test('aceita PNG, JPG e WEBP até 5 MB', () => {
  for (const type of ['image/png', 'image/jpeg', 'image/webp']) {
    assert.equal(validarArquivoDeFoto({ type, size: TAMANHO_MAXIMO_DA_FOTO }), null);
  }
});

test('recusa outros formatos e arquivos grandes demais', () => {
  assert.match(validarArquivoDeFoto({ type: 'image/gif', size: 10 }), /PNG, JPG ou WEBP/);
  assert.match(validarArquivoDeFoto({ type: 'application/pdf', size: 10 }), /PNG, JPG ou WEBP/);
  assert.match(validarArquivoDeFoto({ type: 'image/png', size: TAMANHO_MAXIMO_DA_FOTO + 1 }), /5 MB/);
});

test('nome precisa ter conteúdo e no máximo 120 caracteres', () => {
  assert.equal(validarNome('  Ana Lima '), null);
  assert.match(validarNome('   '), /Informe o nome/);
  assert.match(validarNome('a'.repeat(121)), /120 caracteres/);
  assert.equal(validarNome(` ${'a'.repeat(120)} `), null);
});
