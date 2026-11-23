// Node: node --test src/entities/motorista/api/pagamentoMotoristasService.test.mjs
import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { buscarPagamentoMotoristas } from './pagamentoMotoristasService.ts';

const fetchOriginal = globalThis.fetch;
afterEach(() => { globalThis.fetch = fetchOriginal; });

function resposta(corpo, ok = true, status = 200) {
  return { ok, status, json: async () => corpo };
}

const itemDaApi = { motorista: 'Ana', cpf: '00123456789', quantidadeViagens: 2, valorAPagar: 1500.0 };

test('consulta a API com o mês no formato AAAA-MM', async () => {
  let urlChamado = '';
  globalThis.fetch = async (url) => {
    urlChamado = String(url);
    return resposta([itemDaApi]);
  };

  await buscarPagamentoMotoristas('2026-08');

  const [caminho, consulta] = urlChamado.split('?');
  assert.equal(caminho, '/api/operacional/dashboard/pagamento-motoristas');
  assert.equal(new URLSearchParams(consulta).get('mes'), '2026-08');
});

test('consulta a API com dataInicio e dataFim quando recebe um intervalo', async () => {
  let urlChamado = '';
  globalThis.fetch = async (url) => {
    urlChamado = String(url);
    return resposta([itemDaApi]);
  };

  await buscarPagamentoMotoristas({ dataInicio: '22/11/2026', dataFim: '22/11/2026' });

  const parametros = new URLSearchParams(urlChamado.split('?')[1]);
  assert.equal(parametros.get('dataInicio'), '22/11/2026');
  assert.equal(parametros.get('dataFim'), '22/11/2026');
  assert.equal(parametros.has('mes'), false);
});

test('converte valorAPagar em número e mantém CPF nulo', async () => {
  globalThis.fetch = async () => resposta([
    { ...itemDaApi, valorAPagar: '37212.00' },
    { motorista: 'Sem motorista identificado', cpf: null, quantidadeViagens: 1, valorAPagar: 0 },
  ]);

  const [ana, semCpf] = await buscarPagamentoMotoristas('2026-08');

  assert.equal(ana.valorAPagar, 37212);
  assert.equal(ana.cpf, '00123456789');
  assert.equal(semCpf.cpf, null);
});

test('aceita lista vazia (mês sem viagens)', async () => {
  globalThis.fetch = async () => resposta([]);

  assert.deepEqual(await buscarPagamentoMotoristas('2025-01'), []);
});

test('falha com mensagem amigável quando a API recusa (ex.: 403)', async () => {
  globalThis.fetch = async () => resposta({ erro: 'proibido' }, false, 403);

  await assert.rejects(
    buscarPagamentoMotoristas('2026-08'),
    /Não foi possível carregar o faturamento dos motoristas\./,
  );
});

test('rejeita resposta fora do contrato', async () => {
  globalThis.fetch = async () => resposta([{ motorista: 'Ana', valorAPagar: 'abc' }]);

  await assert.rejects(buscarPagamentoMotoristas('2026-08'), /resposta de faturamento está inválida/);
});
