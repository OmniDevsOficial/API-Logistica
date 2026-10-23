import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { buscarDashboard } from './dashboardService.ts';

const fetchOriginal = globalThis.fetch;
afterEach(() => { globalThis.fetch = fetchOriginal; });

const respostaCompleta = {
  dataInicio: '01/10/2026',
  dataFim: '12/10/2026',
  status: 'COM_DADOS',
  metricas: {
    totalViagens: 7,
    freteTotal: 12345.67,
    freteMedio: 1763.67,
    kmTotal: 4200,
    motoristasAtivos: 3,
    viagensPorMotorista: 2.33,
    veiculosUtilizados: 2,
    viagensPorStatus: { pendente: 1, emTransito: 2, finalizado: 4 },
    custoTotal: null,
    custoMedio: null,
    rentabilidadeTotal: null,
    rentabilidadeMedia: null,
    margem: 55.38,
    destinoMaisRentavel: { destino: 'São Paulo', viagens: 266, rentabilidadeTotal: 440844.49 },
  },
  series: { rentabilidadePorPeriodo: { agrupamento: 'DIA', pontos: [] }, porVeiculo: [] },
  utilizacaoMotoristas: [],
};

test('envia o periodo na consulta e mapeia as metricas do contrato', async () => {
  let urlRecebida = '';
  globalThis.fetch = async (url) => {
    urlRecebida = url;
    return Response.json(respostaCompleta);
  };

  const dados = await buscarDashboard('01/10/2026', '12/10/2026');

  assert.equal(
    urlRecebida,
    '/api/operacional/dashboard?dataInicio=01%2F10%2F2026&dataFim=12%2F10%2F2026',
  );
  assert.deepEqual(dados.periodo, { inicio: '01/10/2026', fim: '12/10/2026' });
  assert.equal(dados.status, 'COM_DADOS');
  assert.equal(dados.metrics.totalViagens, 7);
  assert.equal(dados.metrics.motoristasAtivos, 3);
  assert.equal(dados.metrics.viagensPorMotorista, 2.33);
  assert.equal(dados.metrics.freteTotal, 12345.67);
  assert.equal(dados.metrics.freteMedio, 1763.67);
  assert.equal(dados.metrics.margem, 55.38);
  assert.deepEqual(dados.metrics.destinoMaisRentavel, {
    destino: 'São Paulo',
    viagens: 266,
    rentabilidadeTotal: 440844.49,
  });
  assert.deepEqual(dados.metrics.viagensPorStatus, { pendente: 1, emTransito: 2, finalizado: 4 });
});

test('mantem nulo o indicador sem fonte no banco, para a tela exibir traco', async () => {
  globalThis.fetch = async () => Response.json(respostaCompleta);

  const { metrics } = await buscarDashboard('01/10/2026', '12/10/2026');

  for (const valor of [
    metrics.custoTotal,
    metrics.custoMedio,
    metrics.rentabilidadeTotal,
    metrics.rentabilidadeMedia,
  ]) assert.equal(valor, null);
});

test('periodo sem viagens volta como SEM_DADOS com os totais zerados', async () => {
  globalThis.fetch = async () => Response.json({
    ...respostaCompleta,
    status: 'SEM_DADOS',
    metricas: {
      ...respostaCompleta.metricas,
      totalViagens: 0,
      freteTotal: null,
      freteMedio: null,
      margem: null,
      destinoMaisRentavel: null,
      kmTotal: null,
      motoristasAtivos: 0,
      viagensPorMotorista: null,
      veiculosUtilizados: 0,
      viagensPorStatus: { pendente: 0, emTransito: 0, finalizado: 0 },
    },
  });

  const dados = await buscarDashboard('01/10/2026', '12/10/2026');

  assert.equal(dados.status, 'SEM_DADOS');
  assert.equal(dados.metrics.totalViagens, 0);
  assert.equal(dados.metrics.motoristasAtivos, 0);
  assert.equal(dados.metrics.viagensPorMotorista, null);
  assert.equal(dados.metrics.freteTotal, null);
  assert.equal(dados.metrics.freteMedio, null);
  assert.equal(dados.metrics.margem, null);
  assert.equal(dados.metrics.destinoMaisRentavel, null);
});

test('mapeia a serie de rentabilidade e viagens com o agrupamento do periodo', async () => {
  globalThis.fetch = async () => Response.json({
    ...respostaCompleta,
    series: {
      rentabilidadePorPeriodo: {
        agrupamento: 'MES',
        pontos: [
          { rotulo: '07/2026', viagens: 629, custo: 711053.81, rentabilidade: 882523.67 },
          { rotulo: '08/2026', viagens: 694, custo: 12684.13, rentabilidade: -302.31 },
        ],
      },
      porVeiculo: [],
    },
  });

  const { serieRentabilidade } = await buscarDashboard('01/01/2026', '31/12/2026');

  assert.deepEqual(serieRentabilidade, {
    agrupamento: 'MES',
    pontos: [
      { rotulo: '07/2026', viagens: 629, custo: 711053.81, rentabilidade: 882523.67 },
      { rotulo: '08/2026', viagens: 694, custo: 12684.13, rentabilidade: -302.31 },
    ],
  });
});

test('serie de rentabilidade fora do contrato nao chega na tela', async () => {
  for (const series of [
    undefined,
    { porVeiculo: [] },
    { rentabilidadePorPeriodo: { agrupamento: 'DIA' } },
    { rentabilidadePorPeriodo: { agrupamento: 'DIA', pontos: [{ rotulo: '01/08', viagens: 'dez', custo: 1, rentabilidade: 1 }] } },
    { rentabilidadePorPeriodo: { agrupamento: 'DIA', pontos: [{ rotulo: '01/08', viagens: 10, rentabilidade: 1 }] } },
  ]) {
    globalThis.fetch = async () => Response.json({ ...respostaCompleta, series });
    await assert.rejects(buscarDashboard('01/08/2026', '31/08/2026'), /resposta do servi/);
  }
});

test('resposta fora do contrato nao chega na tela', async () => {
  for (const corpo of [
    null,
    [],
    { dataInicio: '01/10/2026', dataFim: '12/10/2026', status: 'COM_DADOS' },
    { ...respostaCompleta, metricas: { ...respostaCompleta.metricas, totalViagens: 'sete' } },
    { ...respostaCompleta, dataInicio: '' },
  ]) {
    globalThis.fetch = async () => Response.json(corpo);
    await assert.rejects(buscarDashboard('01/10/2026', '12/10/2026'), /resposta do servi/);
  }
});

test('erro do servidor vira mensagem em portugues', async () => {
  globalThis.fetch = async () => new Response('', { status: 503 });
  await assert.rejects(
    buscarDashboard('01/10/2026', '12/10/2026'),
    /Não foi possível carregar os dados do dashboard\./,
  );
});

test('servico lento vira aviso para tentar de novo', async () => {
  globalThis.fetch = async () => {
    throw Object.assign(new Error('The operation was aborted due to timeout'), { name: 'TimeoutError' });
  };
  await assert.rejects(
    buscarDashboard('01/10/2026', '12/10/2026'),
    /O serviço demorou a responder\./,
  );
});

test('falha de conexao nao mostra mensagem tecnica na tela', async () => {
  globalThis.fetch = async () => { throw new TypeError('fetch failed'); };
  await assert.rejects(
    buscarDashboard('01/10/2026', '12/10/2026'),
    /Verifique sua conexão/,
  );
});

test('cancelamento da tela nao vira mensagem de erro', async () => {
  const controller = new AbortController();
  globalThis.fetch = async () => {
    controller.abort();
    throw Object.assign(new Error('This operation was aborted'), { name: 'AbortError' });
  };
  await assert.rejects(
    buscarDashboard('01/10/2026', '12/10/2026', controller.signal),
    (erro) => erro.name === 'AbortError',
  );
});
