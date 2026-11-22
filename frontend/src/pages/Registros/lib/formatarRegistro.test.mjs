// Node 24: node --test src/pages/Registros/lib/formatarRegistro.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatarData,
  formatarDataHora,
  formatarHora,
  usuarioDaImportacao,
} from './formatarRegistro.ts';

const MOMENTO = new Date('2026-11-12T14:32:00-03:00');

test('formata data, hora e data/hora no padrão brasileiro', () => {
  assert.equal(formatarData(MOMENTO), '12/11/2026');
  assert.equal(formatarHora(MOMENTO), '14:32');
  assert.equal(formatarDataHora(MOMENTO), '12/11/2026 às 14:32');
});

test('hora sem 24h no lugar das 00h', () => {
  const meiaNoite = new Date('2026-11-13T00:05:00-03:00');
  assert.equal(formatarHora(meiaNoite), '00:05');
});

test('usuário ausente vira texto amigável', () => {
  assert.equal(usuarioDaImportacao({ usuario: null }), 'Usuário não identificado');
  assert.equal(usuarioDaImportacao({ usuario: 'Yuri' }), 'Yuri');
});
