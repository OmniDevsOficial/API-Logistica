import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { buscarAlertasUtilizacao } from './alertaUtilizacaoService.ts';

const fetchOriginal = globalThis.fetch;
afterEach(() => { globalThis.fetch = fetchOriginal; });

function motorista(motoristaId, nome, porcentagem) {
  return {
    chave: String(motoristaId),
    motoristaId,
    nome,
    quantidadeViagens: 1,
    porcentagem,
    status: 'COM_VIAGENS',
    baixaUtilizacao: true,
  };
}

test('gera um alerta por motorista devolvido pelo back', async () => {
  globalThis.fetch = async () => Response.json([
    motorista(7, 'Diego Martins Faria', 3.33),
    motorista(8, 'Fernando Costa', 6.67),
  ]);

  assert.deepEqual(await buscarAlertasUtilizacao(), [
    { id: 7, nome: 'Diego Martins Faria', percentual: 3.33 },
    { id: 8, nome: 'Fernando Costa', percentual: 6.67 },
  ]);
});

test('lista vazia do back não gera alerta', async () => {
  globalThis.fetch = async () => Response.json([]);

  assert.deepEqual(await buscarAlertasUtilizacao(), []);
});

test('consulta o endpoint de baixa utilização sem mês, usando o mês atual do back', async () => {
  const urls = [];
  globalThis.fetch = async (input) => {
    urls.push(String(input));
    return Response.json([]);
  };

  await buscarAlertasUtilizacao();

  assert.deepEqual(urls, ['/api/operacional/motoristas/baixa-utilizacao']);
});

test('falha do back vira erro', async () => {
  globalThis.fetch = async () => new Response('indisponível', { status: 503 });

  await assert.rejects(buscarAlertasUtilizacao(), /alertas de utilização/);
});

test('resposta fora do contrato vira erro', async () => {
  globalThis.fetch = async () => Response.json({ motoristas: [] });

  await assert.rejects(buscarAlertasUtilizacao(), /inválida/);
});
