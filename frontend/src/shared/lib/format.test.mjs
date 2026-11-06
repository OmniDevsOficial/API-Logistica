// Node: node --test src/shared/lib/format.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatDateOrToday, formatCpf, formatFrequencia, formatTipoVeiculo } from './format.ts';

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

test('tipo de veículo em maiúsculas vira texto com só a primeira letra maiúscula', () => {
  assert.equal(formatTipoVeiculo('CAVALO MECÂNICO'), 'Cavalo mecânico');
  assert.equal(formatTipoVeiculo('FIORINO'), 'Fiorino');
  assert.equal(formatTipoVeiculo('BI-TRUCK OU PESADO'), 'Bi-truck ou pesado');
  assert.equal(formatTipoVeiculo('3/4'), '3/4');
  assert.equal(formatTipoVeiculo('  SEMI-REBOQUE   COM 2 EIXOS '), 'Semi-reboque com 2 eixos');
});

test('tipo de veículo preserva siglas e trata vazio como ausente', () => {
  assert.equal(formatTipoVeiculo('VUC'), 'VUC');
  assert.equal(formatTipoVeiculo('Van'), 'Van');
  assert.equal(formatTipoVeiculo(''), null);
  assert.equal(formatTipoVeiculo(null), null);
});
