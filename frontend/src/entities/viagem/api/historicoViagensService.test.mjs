import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { buscarHistoricoViagens } from './historicoViagensService.ts';

const fetchOriginal = globalThis.fetch;
afterEach(() => { globalThis.fetch = fetchOriginal; });

function respostaOk(corpo) {
  return { ok: true, status: 200, json: async () => corpo };
}

function respostaErro(status) {
  return { ok: false, status, json: async () => ({ erro: 'falhou' }) };
}

const viagemDaApi = {
  id: 812,
  manifesto: '251104',
  origem: 'Jacareí',
  destino: 'Curitiba',
  dataSaida: '2026-10-28',
  previsaoChegada: '2026-10-30',
  status: 'EM_ANDAMENTO',
};

const paginaDaApi = {
  viagens: [
    viagemDaApi,
    {
      id: 790,
      manifesto: '251020',
      origem: null,
      destino: null,
      dataSaida: '2026-10-20',
      previsaoChegada: null,
      status: 'CONCLUIDA',
    },
  ],
  pagina: 0,
  tamanho: 10,
  totalViagens: 37,
  totalPaginas: 4,
  ultimaPagina: false,
};

test('consulta a rota do motorista com pagina e tamanho', async () => {
  let urlChamada = '';
  globalThis.fetch = async (url) => {
    urlChamada = String(url);
    return respostaOk(paginaDaApi);
  };

  await buscarHistoricoViagens(7, 2, 10);

  const [caminho, consulta] = urlChamada.split('?');
  const parametros = new URLSearchParams(consulta);
  assert.equal(caminho, '/api/operacional/motoristas/7/viagens');
  assert.equal(parametros.get('pagina'), '2');
  assert.equal(parametros.get('tamanho'), '10');
});

test('repassa o signal para o fetch', async () => {
  let signalRecebido;
  globalThis.fetch = async (_url, opcoes) => {
    signalRecebido = opcoes?.signal;
    return respostaOk(paginaDaApi);
  };

  const controller = new AbortController();
  await buscarHistoricoViagens(7, 0, 10, controller.signal);

  assert.equal(signalRecebido, controller.signal);
});

test('sinal abortado encerra a consulta', async () => {
  globalThis.fetch = (_url, opcoes) => new Promise((_resolve, reject) => {
    opcoes?.signal?.addEventListener('abort', () => reject(new Error('abortado')));
  });

  const controller = new AbortController();
  const consulta = buscarHistoricoViagens(7, 0, 10, controller.signal);
  controller.abort();

  await assert.rejects(consulta);
});

test('mapeia a página e as viagens do contrato', async () => {
  globalThis.fetch = async () => respostaOk(paginaDaApi);

  const pagina = await buscarHistoricoViagens(7, 0, 10);

  assert.deepEqual(pagina, {
    viagens: [
      {
        id: 812,
        manifesto: '251104',
        origem: 'Jacareí',
        destino: 'Curitiba',
        dataSaida: '2026-10-28',
        previsaoChegada: '2026-10-30',
        status: 'EM_ANDAMENTO',
      },
      {
        id: 790,
        manifesto: '251020',
        origem: null,
        destino: null,
        dataSaida: '2026-10-20',
        previsaoChegada: null,
        status: 'CONCLUIDA',
      },
    ],
    pagina: 0,
    tamanho: 10,
    totalViagens: 37,
    totalPaginas: 4,
    ultimaPagina: false,
  });
});

test('aceita motorista sem viagens', async () => {
  globalThis.fetch = async () => respostaOk({
    viagens: [],
    pagina: 0,
    tamanho: 10,
    totalViagens: 0,
    totalPaginas: 0,
    ultimaPagina: true,
  });

  const pagina = await buscarHistoricoViagens(7, 0, 10);

  assert.deepEqual(pagina.viagens, []);
  assert.equal(pagina.totalViagens, 0);
  assert.equal(pagina.ultimaPagina, true);
});

test('trata campos opcionais ausentes ou vazios como null', async () => {
  globalThis.fetch = async () => respostaOk({
    ...paginaDaApi,
    viagens: [{ id: 1, manifesto: '1', dataSaida: '2026-10-01', status: 'CONCLUIDA', origem: '', destino: '  ' }],
  });

  const [viagem] = (await buscarHistoricoViagens(7, 0, 10)).viagens;

  assert.equal(viagem.origem, null);
  assert.equal(viagem.destino, null);
  assert.equal(viagem.previsaoChegada, null);
});

test('404 informa que o motorista não existe', async () => {
  globalThis.fetch = async () => respostaErro(404);

  await assert.rejects(
    buscarHistoricoViagens(99, 0, 10),
    { message: 'Motorista não encontrado.' },
  );
});

test('outros erros geram a mensagem genérica do histórico', async () => {
  for (const status of [400, 500, 503]) {
    globalThis.fetch = async () => respostaErro(status);

    await assert.rejects(
      buscarHistoricoViagens(7, 0, 10),
      { message: 'Não foi possível carregar o histórico de viagens.' },
    );
  }
});

test('recusa resposta fora do contrato', async () => {
  const invalidas = [
    { ...paginaDaApi, viagens: undefined },
    { ...paginaDaApi, viagens: [{ ...viagemDaApi, status: 'FINALIZADO' }] },
    { ...paginaDaApi, viagens: [{ ...viagemDaApi, id: '812' }] },
    { ...paginaDaApi, ultimaPagina: 'false' },
    [],
    null,
  ];

  for (const corpo of invalidas) {
    globalThis.fetch = async () => respostaOk(corpo);

    await assert.rejects(
      buscarHistoricoViagens(7, 0, 10),
      { message: 'A resposta do serviço está inválida.' },
    );
  }
});

test('corpo que não é JSON vira resposta inválida', async () => {
  globalThis.fetch = async () => ({
    ok: true,
    status: 200,
    json: async () => { throw new SyntaxError('Unexpected token'); },
  });

  await assert.rejects(
    buscarHistoricoViagens(7, 0, 10),
    { message: 'A resposta do serviço está inválida.' },
  );
});
