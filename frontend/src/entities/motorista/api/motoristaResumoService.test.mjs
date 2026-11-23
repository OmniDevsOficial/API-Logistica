// Node 24: node --test src/entities/motorista/api/motoristaResumoService.test.mjs
// Testes sem rede: somente fetch é simulado, nunca o código de produção.
import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { buscarResumoMotoristas } from './motoristaResumoService.ts';

const fetchOriginal = globalThis.fetch;
afterEach(() => { globalThis.fetch = fetchOriginal; });

const RESUMO = { disponiveis: 3, emOperacao: 2, indisponiveis: 1, total: 6 };

test('consulta o endpoint de KPIs e devolve a contagem por status', async () => {
  let url = '';
  let sinal = null;
  globalThis.fetch = async (input, init) => {
    url = input;
    sinal = init.signal;
    return Response.json(RESUMO);
  };

  const controle = new AbortController();
  const resumo = await buscarResumoMotoristas(controle.signal);

  assert.equal(url, '/api/operacional/motoristas/resumo');
  assert.equal(sinal, controle.signal);
  assert.deepEqual(resumo, RESUMO);
});

test('contagem real zero é devolvida como zero, não como ausência', async () => {
  globalThis.fetch = async () =>
    Response.json({ disponiveis: 0, emOperacao: 0, indisponiveis: 0, total: 0 });

  assert.equal((await buscarResumoMotoristas()).disponiveis, 0);
});

test('erro HTTP lança exceção para o card exibir ausência de dado', async () => {
  globalThis.fetch = async () => new Response('indisponível', { status: 503 });

  await assert.rejects(buscarResumoMotoristas(), /indicadores dos motoristas/);
});

test('resposta fora do contrato lança exceção', async () => {
  globalThis.fetch = async () => Response.json({ disponiveis: 'muitos' });

  await assert.rejects(buscarResumoMotoristas(), /inválida/);
});

test('falha de rede lança exceção', async () => {
  globalThis.fetch = async () => { throw new Error('offline'); };

  await assert.rejects(buscarResumoMotoristas(), /offline/);
});
