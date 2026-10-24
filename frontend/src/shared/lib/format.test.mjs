// Node: node --test src/shared/lib/format.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatDateOrToday, formatCpf, formatFrequencia } from './format.ts';

const HOJE = new Date(2026, 9, 21);

test('data do dia corrente vira Hoje', () => {
  assert.equal(formatDateOrToday('21/10/2026', HOJE), 'Hoje');
});

test('data de outro dia mantém o formato dd/mm/aaaa', () => {
  assert.equal(formatDateOrToday('06/10/2026', HOJE), '06/10/2026');
  assert.equal(formatDateOrToday('01/01/2027', HOJE), '01/01/2027');
});

test('valor sem data válida passa sem formatação', () => {
  assert.equal(formatDateOrToday('-', HOJE), '-');
});

test('cpf sai formatado 000.000.000-00', () => {
  assert.equal(formatCpf('00123456789'), '001.234.567-89');
  assert.equal(formatCpf('001.234.567-89'), '001.234.567-89');
  assert.equal(formatCpf(null), null);
  assert.equal(formatCpf('123'), '123');
});

test('frequência sai com no máximo uma casa decimal', () => {
  assert.equal(formatFrequencia(26), '26%');
  assert.equal(formatFrequencia(26.456), '26,5%');
  assert.equal(formatFrequencia(0), '0%');
});
