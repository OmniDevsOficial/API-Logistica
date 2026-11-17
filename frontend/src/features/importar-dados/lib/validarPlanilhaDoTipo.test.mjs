import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validarPlanilhaDoTipo } from './validarPlanilhaDoTipo.ts';

const manifesto = () => new File(['Manifesto;Data;Motorista;Veículo\nM-1;01/08/2026;Ana;ABC1D23'], 'manifesto.csv');
const veiculos = () => new File(['Placa;Tipo Veículo;Motorista\nABC1D23;VAN;Ana'], 'veiculos.csv');

test('aceita cada planilha na opcao certa', async () => {
  assert.deepEqual(await validarPlanilhaDoTipo(manifesto(), 'manifesto'), { valido: true });
  assert.deepEqual(await validarPlanilhaDoTipo(veiculos(), 'veiculos'), { valido: true });
});

test('recusa a planilha de veiculos com Importar manifesto selecionado', async () => {
  const resultado = await validarPlanilhaDoTipo(veiculos(), 'manifesto');

  assert.equal(resultado.valido, false);
  assert.match(resultado.mensagemErro, /planilha de veículos/);
  assert.match(resultado.mensagemErro, /Importar veículos/);
});

test('recusa o manifesto com Importar veiculos selecionado', async () => {
  const resultado = await validarPlanilhaDoTipo(manifesto(), 'veiculos');

  assert.equal(resultado.valido, false);
  assert.match(resultado.mensagemErro, /é um manifesto/);
  assert.match(resultado.mensagemErro, /Importar manifesto/);
});

test('recusa csv sem a coluna que identifica o tipo escolhido', async () => {
  const outro = () => new File(['Nome;Idade\nAna;30'], 'outro.csv');

  assert.match((await validarPlanilhaDoTipo(outro(), 'manifesto')).mensagemErro, /coluna Manifesto/);
  assert.match((await validarPlanilhaDoTipo(outro(), 'veiculos')).mensagemErro, /coluna Placa/);
});

test('mantem as regras de formato de cada tipo', async () => {
  const xlsx = new File(['conteudo'], 'manifesto.xlsx');

  assert.deepEqual(await validarPlanilhaDoTipo(xlsx, 'manifesto'), { valido: true });
  assert.match((await validarPlanilhaDoTipo(xlsx, 'veiculos')).mensagemErro, /CSV/);
  assert.equal((await validarPlanilhaDoTipo(new File([''], 'vazio.csv'), 'manifesto')).valido, false);
});
