// Node 24: node --test src/entities/veiculo/api/veiculoService.test.mjs
// Testes sem rede: somente fetch é simulado, nunca o código de produção.
import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  buscarTiposVeiculo,
  buscarVeiculoPorPlaca,
  buscarVeiculos,
  lerVeiculoResumo,
} from './veiculoService.ts';

const fetchOriginal = globalThis.fetch;
afterEach(() => { globalThis.fetch = fetchOriginal; });

const VEICULO = {
  id: 1,
  placa: 'EKO2F09',
  tipo: 'TRUCK OU PESADO',
  marca: 'Volvo',
  modelo: 'VM260',
  ativo: true,
  motoristaId: 7,
  motoristaNome: 'Jose Hilton',
};

function responder(corpo, status = 200) {
  const chamadas = [];
  globalThis.fetch = async (url) => {
    chamadas.push(String(url));
    return new Response(JSON.stringify(corpo), { status });
  };
  return chamadas;
}

test('lista veículos enviando só os filtros informados', async () => {
  const chamadas = responder([VEICULO]);

  const veiculos = await buscarVeiculos({ placa: ' eko ', tipo: 'Truck ou pesado', ativo: false });

  assert.equal(chamadas[0], '/api/operacional/veiculos?placa=eko&tipo=Truck+ou+pesado&ativo=false');
  assert.deepEqual(veiculos, [VEICULO]);
});

test('sem filtros chama o endpoint sem query string', async () => {
  const chamadas = responder([]);

  assert.deepEqual(await buscarVeiculos(), []);
  assert.equal(chamadas[0], '/api/operacional/veiculos');
});

test('campos opcionais ausentes viram null', async () => {
  responder([{ id: 2, placa: 'HNF5D31' }]);

  const [veiculo] = await buscarVeiculos();

  assert.deepEqual(veiculo, {
    id: 2, placa: 'HNF5D31', tipo: null, modelo: null, ativo: null,
    marca: null, motoristaId: null, motoristaNome: null,
  });
});

test('resposta fora do contrato vira erro amigável', async () => {
  responder([{ id: 1 }]);
  await assert.rejects(buscarVeiculos(), /inválida/);
});

test('falha HTTP vira erro amigável', async () => {
  responder({ erro: 'x' }, 500);
  await assert.rejects(buscarVeiculos(), /Não foi possível carregar os veículos/);
});

test('busca por placa codifica a placa e devolve null no 404', async () => {
  const chamadas = responder({ erro: 'Veículo não encontrado' }, 404);

  assert.equal(await buscarVeiculoPorPlaca('abc 1d23'), null);
  assert.equal(chamadas[0], '/api/operacional/veiculos/abc%201d23');
});

test('busca por placa devolve o veículo', async () => {
  responder(VEICULO);
  assert.deepEqual(await buscarVeiculoPorPlaca('EKO2F09'), VEICULO);
});

test('tipos vêm como lista de textos', async () => {
  responder(['FIORINO', 'VAN']);
  assert.deepEqual(await buscarTiposVeiculo(), ['FIORINO', 'VAN']);
});

test('resumo de veículo exige placa', () => {
  assert.equal(lerVeiculoResumo({ tipo: 'VAN' }), null);
  assert.equal(lerVeiculoResumo(null), null);
  assert.deepEqual(lerVeiculoResumo({ placa: 'ABC1234', modelo: '' }), {
    placa: 'ABC1234', tipo: null, modelo: null, ativo: null,
  });
});
