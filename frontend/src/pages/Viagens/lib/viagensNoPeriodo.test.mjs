import { test } from 'node:test';
import assert from 'node:assert/strict';
import { viagensNoPeriodo } from './viagensNoPeriodo.ts';

const VIAGENS = [
  { id: 1, data: '2026-07-31' },
  { id: 2, data: '2026-08-01' },
  { id: 3, data: '2026-08-16' },
  { id: 4, data: '2026-08-31' },
  { id: 5, data: '2026-09-01' },
];

test('mes mostra so as viagens daquele mes, incluindo o primeiro e o ultimo dia', () => {
  const resultado = viagensNoPeriodo(VIAGENS, { dataInicio: '01/08/2026', dataFim: '31/08/2026' });

  assert.deepEqual(resultado.map((viagem) => viagem.id), [2, 3, 4]);
});

test('dia mostra so as viagens daquele dia', () => {
  const resultado = viagensNoPeriodo(VIAGENS, { dataInicio: '16/08/2026', dataFim: '16/08/2026' });

  assert.deepEqual(resultado.map((viagem) => viagem.id), [3]);
});

test('ano mostra as viagens do ano inteiro', () => {
  const resultado = viagensNoPeriodo(VIAGENS, { dataInicio: '01/01/2026', dataFim: '31/12/2026' });

  assert.equal(resultado.length, 5);
});

test('periodo sem viagens devolve lista vazia', () => {
  assert.deepEqual(viagensNoPeriodo(VIAGENS, { dataInicio: '01/10/2026', dataFim: '31/10/2026' }), []);
});
