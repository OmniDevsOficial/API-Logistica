// Node: node --test src/entities/motorista/api/statusMotoristaService.test.mjs
// Testes sem rede: somente fetch é simulado, nunca o código de produção.
import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { atualizarStatusMotorista } from './statusMotoristaService.ts';

const fetchOriginal = globalThis.fetch;
afterEach(() => { globalThis.fetch = fetchOriginal; });

test('envia o status no formato aceito pelo back', async () => {
  const chamadas = [];
  globalThis.fetch = async (input, init) => {
    chamadas.push({ url: String(input), init });
    return Response.json({ id: 7, status: 'EM_OPERACAO' });
  };

  await atualizarStatusMotorista(7, 'em_viagem');

  assert.equal(chamadas[0].url, '/api/operacional/motoristas/7/status');
  assert.equal(chamadas[0].init.method, 'PATCH');
  assert.equal(chamadas[0].init.body, JSON.stringify({ status: 'EM_OPERACAO' }));
});

test('falha HTTP vira mensagem amigável para a tela', async () => {
  globalThis.fetch = async () => new Response('não encontrado', { status: 404 });

  await assert.rejects(
    atualizarStatusMotorista(99, 'disponivel'),
    /atualizar o status/,
  );
});
