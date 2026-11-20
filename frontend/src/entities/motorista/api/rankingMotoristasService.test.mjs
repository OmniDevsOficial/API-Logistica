// Node: node --test src/entities/motorista/api/rankingMotoristasService.test.mjs
import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { buscarRankingMotoristas } from './rankingMotoristasService.ts';
import { rankingDeDemonstracao } from './rankingMotoristasMock.ts';

const fetchOriginal = globalThis.fetch;
afterEach(() => { globalThis.fetch = fetchOriginal; });

/** Resposta HTTP de sucesso com o corpo já serializado como JSON. */
function respostaOk(corpo) {
  return { ok: true, status: 200, json: async () => corpo };
}

/** Linha de exemplo no formato do endpoint atual de ranking. */
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
  rentabilidadeMedia: 12500,
  rentabilidadeTotal: 275000,
  faturamento: 320000,
  custos: 45000,
};

const respostaRanking = {
  ranking: [itemDaApi],
  tiposDisponiveis: ['TRUCK', 'VAN'],
};

test('consulta a API com mês e filtro', async () => {
  let urlChamado = '';
  globalThis.fetch = async (url) => {
    urlChamado = String(url);
    return respostaOk(respostaRanking);
  };

  await buscarRankingMotoristas('2026-11', 'FATURAMENTO');

  const [caminho, consulta] = urlChamado.split('?');
  const parametros = new URLSearchParams(consulta);
  assert.equal(caminho, '/api/operacional/motoristas/ranking');
  assert.equal(parametros.get('mes'), '2026-11');
  assert.equal(parametros.get('filtro'), 'FATURAMENTO');
  assert.equal(parametros.has('tipoVeiculo'), false);
});

test('envia tipoVeiculo somente para o filtro por tipo', async () => {
  let urlChamado = '';
  globalThis.fetch = async (url) => {
    urlChamado = String(url);
    return respostaOk(respostaRanking);
  };

  await buscarRankingMotoristas('2026-11', 'TIPO_VEICULO', 'TRUCK');
  const parametros = new URLSearchParams(urlChamado.split('?')[1]);
  assert.equal(parametros.get('filtro'), 'TIPO_VEICULO');
  assert.equal(parametros.get('tipoVeiculo'), 'TRUCK');
});

test('modo de demonstração oferece tipos e aplica o filtro de veículo', async () => {
  const resultado = await rankingDeDemonstracao('2026-11', 'TIPO_VEICULO', 'TRUCK');

  assert.ok(resultado.tiposDisponiveis.includes('TRUCK'));
  assert.ok(resultado.ranking.length > 0);
  assert.ok(resultado.ranking.every((motorista) => motorista.veiculo === 'Truck'));
});

test('normaliza os campos do item e mantém os tipos disponíveis', async () => {
  globalThis.fetch = async () => respostaOk(respostaRanking);

  const resultado = await buscarRankingMotoristas('2026-11');
  const [motorista] = resultado.ranking;
  assert.equal(motorista.motoristaId, 7);
  assert.equal(motorista.nome, 'João Silva');
  assert.equal(motorista.viagens, 22);
  assert.equal(motorista.frequencia, 78.57);
  assert.equal(motorista.rentabilidadeMedia, 12500);
  assert.equal(motorista.rentabilidadeTotal, 275000);
  assert.equal(motorista.faturamento, 320000);
  assert.equal(motorista.custos, 45000);
  assert.deepEqual(resultado.tiposDisponiveis, ['TRUCK', 'VAN']);
});

test('aceita ranking vazio e tipos sem itens no ranking', async () => {
  globalThis.fetch = async () => respostaOk({ ranking: [], tiposDisponiveis: ['VAN'] });
  const resultado = await buscarRankingMotoristas('2026-12');
  assert.deepEqual(resultado.ranking, []);
  assert.deepEqual(resultado.tiposDisponiveis, ['VAN']);
});

test('transforma campos opcionais nulos ou vazios em null', async () => {
  globalThis.fetch = async () => respostaOk({
    ranking: [{ ...itemDaApi, motoristaId: null, cpf: '', telefone: '', veiculo: undefined,
      placa: null, faturamento: '', rentabilidadeTotal: null }],
    tiposDisponiveis: [],
  });
  const [motorista] = (await buscarRankingMotoristas('2026-11')).ranking;
  assert.equal(motorista.motoristaId, null);
  assert.equal(motorista.cpf, null);
  assert.equal(motorista.telefone, null);
  assert.equal(motorista.veiculo, null);
  assert.equal(motorista.placa, null);
  assert.equal(motorista.faturamento, null);
  assert.equal(motorista.rentabilidadeTotal, null);
});

test('lança erro quando a API responde com falha', async () => {
  globalThis.fetch = async () => ({ ok: false, status: 500, json: async () => ({}) });
  await assert.rejects(buscarRankingMotoristas('2026-11'), {
    message: 'Não foi possível carregar o ranking de motoristas.',
  });
});

test('lança erro quando a resposta não contém ranking e tipos válidos', async () => {
  globalThis.fetch = async () => respostaOk({ erro: 'inesperado' });
  await assert.rejects(buscarRankingMotoristas('2026-11'), {
    message: 'A resposta do ranking está inválida.',
  });
  globalThis.fetch = async () => respostaOk({ ranking: [{ nome: 'Sem viagens' }], tiposDisponiveis: [] });
  await assert.rejects(buscarRankingMotoristas('2026-11'), {
    message: 'A resposta do ranking está inválida.',
  });
});

test('sinal abortado encerra a consulta', async () => {
  globalThis.fetch = (_url, opcoes) => new Promise((_resolve, reject) => {
    opcoes?.signal?.addEventListener('abort', () => reject(new Error('abortado')));
  });
  const controller = new AbortController();
  const consulta = buscarRankingMotoristas('2026-11', 'RENTABILIDADE', undefined, controller.signal);
  controller.abort();
  await assert.rejects(consulta);
});
