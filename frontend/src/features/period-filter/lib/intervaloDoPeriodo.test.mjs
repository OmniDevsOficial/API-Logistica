import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  deslocarReferencia,
  intervaloDoPeriodo,
  podeAvancarPeriodo,
  referenciaDaDataIso,
} from './intervaloDoPeriodo.ts';

const hoje = new Date(2026, 9, 12);

test('dia consulta apenas a data de referencia', () => {
  assert.deepEqual(intervaloDoPeriodo('dia', hoje), {
    dataInicio: '12/10/2026',
    dataFim: '12/10/2026',
  });
});

test('mes consulta o mes inteiro da referencia', () => {
  assert.deepEqual(intervaloDoPeriodo('mes', hoje), {
    dataInicio: '01/10/2026',
    dataFim: '31/10/2026',
  });
  assert.deepEqual(intervaloDoPeriodo('mes', new Date(2026, 1, 20)), {
    dataInicio: '01/02/2026',
    dataFim: '28/02/2026',
  });
});

test('ano consulta o ano inteiro da referencia', () => {
  assert.deepEqual(intervaloDoPeriodo('ano', hoje), {
    dataInicio: '01/01/2026',
    dataFim: '31/12/2026',
  });
});

test('navegacao anda um periodo por vez e volta pela mesma porta', () => {
  assert.deepEqual(intervaloDoPeriodo('mes', deslocarReferencia('mes', hoje, -1)), {
    dataInicio: '01/09/2026',
    dataFim: '30/09/2026',
  });
  assert.deepEqual(intervaloDoPeriodo('ano', deslocarReferencia('ano', hoje, -1)), {
    dataInicio: '01/01/2025',
    dataFim: '31/12/2025',
  });
  assert.deepEqual(intervaloDoPeriodo('dia', deslocarReferencia('dia', hoje, -1)), {
    dataInicio: '11/10/2026',
    dataFim: '11/10/2026',
  });
});

test('voltar mes a mes nao pula meses curtos', () => {
  let referencia = new Date(2026, 4, 31);
  const meses = [];

  for (let volta = 0; volta < 4; volta += 1) {
    referencia = deslocarReferencia('mes', referencia, -1);
    meses.push(intervaloDoPeriodo('mes', referencia).dataInicio);
  }

  assert.deepEqual(meses, ['01/04/2026', '01/03/2026', '01/02/2026', '01/01/2026']);
});

test('nao avanca para periodo que ainda nao terminou', () => {
  assert.equal(podeAvancarPeriodo('mes', hoje, hoje), false);
  assert.equal(podeAvancarPeriodo('ano', hoje, hoje), false);
  assert.equal(podeAvancarPeriodo('dia', hoje, hoje), false);
  assert.equal(podeAvancarPeriodo('mes', new Date(2026, 8, 1), hoje), true);
  assert.equal(podeAvancarPeriodo('dia', new Date(2026, 9, 11), hoje), true);
});

test('converte a data da importacao em referencia e ignora formato invalido', () => {
  assert.deepEqual(referenciaDaDataIso('2026-09-22'), new Date(2026, 8, 22));
  for (const invalida of ['22/09/2026', '', '2026-9-2', 'ontem']) {
    assert.equal(referenciaDaDataIso(invalida), null);
  }
});

test('nao altera a data recebida', () => {
  const referencia = new Date(2026, 9, 12);
  deslocarReferencia('ano', referencia, -3);
  intervaloDoPeriodo('mes', referencia);
  assert.equal(referencia.getTime(), hoje.getTime());
});
