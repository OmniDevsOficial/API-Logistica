// Node: node --test src/entities/motorista/api/rankingMotoristasService.test.mjs
import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { buscarRankingMotoristas } from './rankingMotoristasService.ts';

const fetchOriginal = globalThis.fetch;
afterEach(() => { globalThis.fetch = fetchOriginal; });

/** Resposta HTTP de sucesso com o corpo já em JSON. */
function respostaOk(corpo) {
  return { ok: true, status: 200, json: async () => corpo };
}

/** Amostra no formato do backend (POST /motoristas/ranking). */
const itemDaApi = {
  posicao: 1,
  motoristaId: 7,
  nome: 'João Silva',
  cpf: '12345678901',
  telefone: null,
  veiculo: 'Truck',
  placa: 'RTA4F21',
  viagens: 22,
  quantidadeViagens: 22,
  frequencia: 78.57,
  rentabilidadeMedia: 12500.0,
  rentabilidadeTotal: 275000.0,
  frete: 320000.0,
  custos: 45000.0,
};

test('consulta a API com dataInicio e dataFim', async () => {
  let urlChamado = '';
  globalThis.fetch = async (url) => {
    urlChamado = String(url);
    return respostaOk([itemDaApi]);
  };

  await buscarRankingMotoristas('01/11/2026', '30/11/2026');

  const [caminho, consulta] = urlChamado.split('?');
  const parametros = new URLSearchParams(consulta);
  assert.equal(caminho, '/api/operacional/motoristas/ranking');
  assert.equal(parametros.get('dataInicio'), '01/11/2026');
  assert.equal(parametros.get('dataFim'), '30/11/2026');
});

test('normaliza os campos do item vindo do backend', async () => {
  globalThis.fetch = async () => respostaOk([itemDaApi]);

  const [motorista] = await buscarRankingMotoristas('01/11/2026', '30/11/2026');

  assert.equal(motorista.motoristaId, 7);
  assert.equal(motorista.nome, 'João Silva');
  assert.equal(motorista.cpf, '12345678901');
  assert.equal(motorista.telefone, null);
  assert.equal(motorista.veiculo, 'Truck');
  assert.equal(motorista.placa, 'RTA4F21');
  assert.equal(motorista.viagens, 22);
  assert.equal(motorista.frequencia, 78.57);
  assert.equal(motorista.rentabilidadeMedia, 12500);
  assert.equal(motorista.frete, 320000);
  assert.equal(motorista.custos, 45000);
});

test('aceita lista vazia (mês sem viagens)', async () => {
  globalThis.fetch = async () => respostaOk([]);

  const ranking = await buscarRankingMotoristas('01/12/2026', '31/12/2026');

  assert.deepEqual(ranking, []);
});

test('transforma campos opcionais nulos ou vazios em null', async () => {
  globalThis.fetch = async () => respostaOk([{
    ...itemDaApi,
    motoristaId: null,
    cpf: '',
    telefone: '',
    veiculo: undefined,
    placa: null,
    frequencia: null,
    frete: '',
  }]);

  const [motorista] = await buscarRankingMotoristas('01/11/2026', '30/11/2026');

  assert.equal(motorista.motoristaId, null);
  assert.equal(motorista.cpf, null);
  assert.equal(motorista.telefone, null);
  assert.equal(motorista.veiculo, null);
  assert.equal(motorista.placa, null);
  assert.equal(motorista.frequencia, null);
  assert.equal(motorista.frete, null);
});

test('lança erro quando a API responde com falha', async () => {
  globalThis.fetch = async () => ({ ok: false, status: 500, json: async () => ({}) });

  await assert.rejects(
    buscarRankingMotoristas('01/11/2026', '30/11/2026'),
    { message: 'Não foi possível carregar o ranking de motoristas.' },
  );
});

test('lança erro quando a resposta não é uma lista de itens válidos', async () => {
  globalThis.fetch = async () => respostaOk({ erro: 'inesperado' });

  await assert.rejects(
    buscarRankingMotoristas('01/11/2026', '30/11/2026'),
    { message: 'A resposta do ranking está inválida.' },
  );

  globalThis.fetch = async () => respostaOk([{ nome: 'Sem viagens' }]);
  await assert.rejects(
    buscarRankingMotoristas('01/11/2026', '30/11/2026'),
    { message: 'A resposta do ranking está inválida.' },
  );
});

test('sinal abortado encerra a consulta', async () => {
  globalThis.fetch = (_url, opcoes) => new Promise((_resolve, reject) => {
    opcoes?.signal?.addEventListener('abort', () => reject(new Error('abortado')));
  });

  const controller = new AbortController();
  const consulta = buscarRankingMotoristas(
    '01/11/2026',
    '30/11/2026',
    controller.signal,
  );
  controller.abort();

  await assert.rejects(consulta);
});
