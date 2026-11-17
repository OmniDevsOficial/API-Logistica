import { test } from 'node:test';
import assert from 'node:assert/strict';
import { colunasDoCabecalho, identificarPlanilha, lerTipoDaPlanilha } from './planilha.ts';

test('le as colunas do cabecalho com ponto e virgula ignorando acento, maiuscula e BOM', () => {
  assert.deepEqual(
    colunasDoCabecalho('\uFEFFManifesto;Data;Motorista;Veículo\r\nM-1;01/08/2026;Ana;ABC1D23'),
    ['manifesto', 'data', 'motorista', 'veiculo'],
  );
});

test('aceita virgula como separador e pula a linha sep= do Excel', () => {
  assert.deepEqual(colunasDoCabecalho('sep=,\n"Placa","Tipo Veículo"\nABC1D23,VAN'), ['placa', 'tipoveiculo']);
});

test('identifica manifesto pela coluna Manifesto e veiculos pela coluna Placa', () => {
  assert.equal(identificarPlanilha(['manifesto', 'data', 'veiculo']), 'manifesto');
  assert.equal(identificarPlanilha(['placa', 'tipoveiculo', 'motorista']), 'veiculos');
  assert.equal(identificarPlanilha(['nome', 'idade']), null);
});

test('le o tipo direto do arquivo', async () => {
  assert.equal(await lerTipoDaPlanilha(new File(['Placa;Tipo Veículo\nABC1D23;VAN'], 'frota.csv')), 'veiculos');
  assert.equal(await lerTipoDaPlanilha(new File([''], 'vazio.csv')), null);
});
