// Node 24: node --test src/pages/Registros/lib/juntarImportacoes.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { juntarImportacoes } from './juntarImportacoes.ts';

function linha(id, tipo, dataHora) {
  return {
    chave: `${tipo}:${id}`,
    id,
    tipo,
    dataHora: new Date(dataHora),
    arquivo: `arquivo-${id}.csv`,
    usuario: 'Yuri',
    status: 'sucesso',
    resumo: { criados: 1, atualizados: 0, ignorados: 0, rejeitados: 0 },
    reimportacaoDe: null,
  };
}

test('junta as duas origens em ordem decrescente de data/hora', () => {
  const manifesto = [linha(1, 'manifesto', '2026-11-10T09:00:00'), linha(2, 'manifesto', '2026-11-12T10:00:00')];
  const veiculos = [linha(3, 'veiculos', '2026-11-12T11:00:00'), linha(4, 'veiculos', '2026-11-01T08:00:00')];

  const junta = juntarImportacoes(manifesto, veiculos);

  assert.deepEqual(
    junta.map((item) => item.chave),
    ['veiculos:3', 'manifesto:2', 'manifesto:1', 'veiculos:4'],
  );
});

test('origem vazia não esconde a outra', () => {
  const manifesto = [linha(1, 'manifesto', '2026-11-10T09:00:00')];

  assert.equal(juntarImportacoes(manifesto, []).length, 1);
  assert.equal(juntarImportacoes([], []).length, 0);
});
