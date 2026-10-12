import { test } from 'node:test';
import assert from 'node:assert/strict';
import { intervaloDoPeriodo } from './intervaloDoPeriodo.ts';

const hoje = new Date(2026, 9, 12);

test('dia consulta apenas a data de hoje', () => {
  assert.deepEqual(intervaloDoPeriodo('dia', hoje), {
    dataInicio: '12/10/2026',
    dataFim: '12/10/2026',
  });
});

test('mes consulta do primeiro dia do mes corrente ate hoje', () => {
  assert.deepEqual(intervaloDoPeriodo('mes', hoje), {
    dataInicio: '01/10/2026',
    dataFim: '12/10/2026',
  });
});

test('ano consulta de primeiro de janeiro ate hoje', () => {
  assert.deepEqual(intervaloDoPeriodo('ano', hoje), {
    dataInicio: '01/01/2026',
    dataFim: '12/10/2026',
  });
});

test('nao altera a data recebida', () => {
  const referencia = new Date(2026, 9, 12);
  intervaloDoPeriodo('ano', referencia);
  assert.equal(referencia.getTime(), hoje.getTime());
});
