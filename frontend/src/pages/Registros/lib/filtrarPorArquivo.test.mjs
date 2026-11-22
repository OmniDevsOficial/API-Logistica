// Node 24: node --test src/pages/Registros/lib/filtrarPorArquivo.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filtrarPorArquivo, normalizarBusca } from './filtrarPorArquivo.ts';

function linha(arquivo) {
  return {
    chave: `manifesto:${arquivo}`,
    id: 1,
    tipo: 'manifesto',
    dataHora: new Date('2026-11-10T09:00:00'),
    arquivo,
    usuario: 'Yuri',
    status: 'sucesso',
    resumo: { criados: 1, atualizados: 0, ignorados: 0, rejeitados: 0 },
    reimportacaoDe: null,
  };
}

const LINHAS = [
  linha('Manifesto-Novembro.CSV'),
  linha('frota de veiculos.csv'),
  linha('manifesto-dezembro.csv'),
];

test('busca sem termo devolve a lista inteira', () => {
  assert.equal(filtrarPorArquivo(LINHAS, '  ').length, 3);
});

test('filtra ignorando caixa e acentos', () => {
  const resultado = filtrarPorArquivo(LINHAS, 'MANIFESTO');
  assert.deepEqual(
    resultado.map((item) => item.arquivo),
    ['Manifesto-Novembro.CSV', 'manifesto-dezembro.csv'],
  );

  const comAcento = filtrarPorArquivo(LINHAS, 'veiculos');
  assert.equal(comAcento.length, 1);

  const acentuado = filtrarPorArquivo([linha('relatorio-veículo.csv')], 'veiculo');
  assert.equal(acentuado.length, 1);
});

test('sem correspondência devolve lista vazia', () => {
  assert.equal(filtrarPorArquivo(LINHAS, 'inexistente').length, 0);
});

test('normalizarBusca remove espaços e caixa', () => {
  assert.equal(normalizarBusca('  Manifesto-Novembro.CSV '), 'manifesto-novembro.csv');
});
