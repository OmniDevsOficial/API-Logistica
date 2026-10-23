import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { buscarAlertasUtilizacao } from './alertaUtilizacaoService.ts';
import { periodoEquipe } from './periodoEquipe.ts';

const fetchOriginal = globalThis.fetch;
afterEach(() => { globalThis.fetch = fetchOriginal; });

function motorista(motoristaId, nome, porcentagem, baixaUtilizacao) {
  return {
    chave: String(motoristaId ?? nome),
    motoristaId,
    nome,
    quantidadeViagens: 1,
    porcentagem,
    status: porcentagem === 0 ? 'SEM_VIAGENS' : 'COM_VIAGENS',
    baixaUtilizacao,
  };
}

function responder(motoristas) {
  return async () => Response.json({ motoristas });
}

test('gera um alerta por motorista com baixa utilização', async () => {
  globalThis.fetch = responder([
    motorista(7, 'Diego Martins Faria', 26.4, true),
    motorista(8, 'Ana Paula Ribeiro', 73.6, false),
    motorista(null, 'Carla', 0, true),
  ]);

  const alertas = await buscarAlertasUtilizacao();

  assert.deepEqual(alertas, [
    { id: 7, nome: 'Diego Martins Faria', percentual: 26.4 },
    { id: 'Carla', nome: 'Carla', percentual: 0 },
  ]);
});

test('sem motorista abaixo do limite não há alerta', async () => {
  globalThis.fetch = responder([motorista(8, 'Ana Paula Ribeiro', 100, false)]);

  assert.deepEqual(await buscarAlertasUtilizacao(), []);
});

test('resposta sem o indicador do back não gera alerta', async () => {
  const semIndicador = motorista(7, 'Diego Martins Faria', 5, true);
  delete semIndicador.baixaUtilizacao;
  globalThis.fetch = responder([semIndicador]);

  assert.deepEqual(await buscarAlertasUtilizacao(), []);
});

test('consulta o mesmo período da frequência da tela de motoristas', async () => {
  const urls = [];
  globalThis.fetch = async (input) => {
    urls.push(String(input));
    return Response.json({ motoristas: [] });
  };

  await buscarAlertasUtilizacao();

  const consulta = new URL(urls[0], 'http://localhost').searchParams;
  const { dataInicio, dataFim } = periodoEquipe();
  assert.equal(consulta.get('dataInicio'), dataInicio);
  assert.equal(consulta.get('dataFim'), dataFim);
});
