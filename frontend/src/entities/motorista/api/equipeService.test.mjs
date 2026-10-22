// Node 24: node --test src/entities/motorista/api/equipeService.test.mjs
// Testes sem rede: somente fetch é simulado, nunca o código de produção.
import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { buscarEquipeMotoristas } from './equipeService.ts';

const fetchOriginal = globalThis.fetch;
afterEach(() => { globalThis.fetch = fetchOriginal; });

const RESUMO = { disponiveis: 2, emOperacao: 1, indisponiveis: 1, total: 4 };

const LISTA = [
  {
    id: 7,
    nome: 'Ana Paula Ribeiro',
    cpf: '00123456789',
    tipoVeiculo: 'Van',
    placa: 'RTA4F21',
    status: 'EM_OPERACAO',
    localizacao: 'Campinas/SP',
    ultimaOperacao: '2026-10-06',
    previsaoDisponibilidade: '2026-10-12',
    quantidadeViagens: 18,
  },
  {
    id: 8,
    nome: 'Marcos Vinícius Lima',
    cpf: '11122233344',
    tipoVeiculo: null,
    placa: null,
    status: 'DISPONIVEL',
    localizacao: null,
    ultimaOperacao: null,
    previsaoDisponibilidade: null,
    quantidadeViagens: 0,
  },
];

const UTILIZACAO = {
  motoristas: [
    {
      chave: '00123456789',
      motoristaId: 7,
      nome: 'Ana Paula Ribeiro',
      quantidadeViagens: 18,
      porcentagem: 90,
      status: 'COM_VIAGENS',
    },
    {
      chave: '11122233344',
      motoristaId: 8,
      nome: 'Marcos Vinícius Lima',
      quantidadeViagens: 0,
      porcentagem: 0,
      status: 'SEM_VIAGENS',
    },
  ],
};

function responder(resumo = RESUMO, lista = LISTA, utilizacao = UTILIZACAO) {
  return async (input) => {
    const url = String(input);
    if (url.includes('/indicadores/utilizacao')) return Response.json(utilizacao);
    return url.endsWith('/motoristas/resumo')
      ? Response.json(resumo)
      : Response.json(lista);
  };
}

test('agrega os KPIs do resumo com a lista mapeada para o modelo da tela', async () => {
  globalThis.fetch = responder();

  const dados = await buscarEquipeMotoristas();

  assert.deepEqual(
    {
      totalMotoristas: dados.totalMotoristas,
      disponiveis: dados.disponiveis,
      emViagem: dados.emViagem,
      indisponiveis: dados.indisponiveis,
    },
    { totalMotoristas: 4, disponiveis: 2, emViagem: 1, indisponiveis: 1 },
  );
  assert.deepEqual(dados.motoristas, [
    {
      id: 7,
      nome: 'Ana Paula Ribeiro',
      cpf: '00123456789',
      veiculo: 'Van',
      placa: 'RTA4F21',
      operacao: 'Previsão de disponibilidade',
      dataOperacao: '12/10/2026',
      localizacao: 'Campinas/SP',
      viagens: 18,
      frequencia: 90,
      status: 'em_viagem',
    },
    {
      id: 8,
      nome: 'Marcos Vinícius Lima',
      cpf: '11122233344',
      veiculo: '-',
      placa: '-',
      operacao: '-',
      dataOperacao: '-',
      localizacao: '-',
      viagens: 0,
      frequencia: 0,
      status: 'disponivel',
    },
  ]);
});

test('motorista sem data de operação usa a última operação como rótulo', async () => {
  const semPrevisao = LISTA.map((motorista) => ({
    ...motorista,
    previsaoDisponibilidade: null,
  }));
  globalThis.fetch = responder(RESUMO, semPrevisao);

  const dados = await buscarEquipeMotoristas();

  assert.equal(dados.motoristas[0].operacao, 'Última operação');
  assert.equal(dados.motoristas[0].dataOperacao, '06/10/2026');
});

test('filtro por status vira o parâmetro aceito pelo back', async () => {
  const urls = [];
  globalThis.fetch = async (input) => {
    urls.push(String(input));
    return responder()(input);
  };

  await buscarEquipeMotoristas('em_viagem');

  const lista = new URL(
    urls.find((url) => url.includes('/motoristas?')),
    'http://localhost',
  ).searchParams;

  assert.equal(lista.get('status'), 'EM_OPERACAO');
  assert.ok(urls.includes('/api/operacional/motoristas/resumo'));
});

test('contagem zero chega à tela como zero', async () => {
  globalThis.fetch = responder(
    { disponiveis: 0, emOperacao: 0, indisponiveis: 0, total: 0 },
    [],
  );

  const dados = await buscarEquipeMotoristas();

  assert.equal(dados.disponiveis, 0);
  assert.deepEqual(dados.motoristas, []);
});

test('falha de qualquer chamada vira mensagem amigável para o estado de erro', async () => {
  globalThis.fetch = async () => { throw new Error('offline'); };

  await assert.rejects(buscarEquipeMotoristas(), /equipe de motoristas/);

  globalThis.fetch = async () => new Response('indisponível', { status: 503 });

  await assert.rejects(buscarEquipeMotoristas(), /equipe de motoristas/);
});

test('resposta fora do contrato vira mensagem amigável', async () => {
  globalThis.fetch = responder(RESUMO, [{ id: 'sete' }]);

  await assert.rejects(buscarEquipeMotoristas(), /equipe de motoristas/);
});

test('frequência corresponde pelo cpf quando o indicador não traz o id', async () => {
  const semId = {
    motoristas: UTILIZACAO.motoristas.map((motorista) => ({
      ...motorista,
      motoristaId: null,
      porcentagem: 66.6,
    })),
  };
  globalThis.fetch = responder(RESUMO, LISTA, semId);

  const dados = await buscarEquipeMotoristas();

  assert.deepEqual(dados.motoristas.map((motorista) => motorista.frequencia), [66.6, 66.6]);
});

test('frequência consulta os últimos 12 meses, não só o mês corrente', async () => {
  const urls = [];
  globalThis.fetch = async (input) => {
    urls.push(String(input));
    return responder()(input);
  };

  await buscarEquipeMotoristas();

  const consulta = new URL(
    urls.find((url) => url.includes('/indicadores/utilizacao')),
    'http://localhost',
  ).searchParams;

  const [diaInicio, mesInicio, anoInicio] = consulta
    .get('dataInicio')
    .split('/')
    .map(Number);
  const [diaFim, mesFim, anoFim] = consulta.get('dataFim').split('/').map(Number);

  // Início é o primeiro dia do mês 11 posições antes do fim: cobre 12 meses cheios.
  assert.equal(diaInicio, 1);
  assert.equal(anoFim * 12 + mesFim - (anoInicio * 12 + mesInicio), 11);
  assert.equal(diaFim, new Date().getDate());
});

test('indicador de utilização indisponível deixa a frequência sem valor', async () => {
  globalThis.fetch = responder(RESUMO, LISTA, { inesperado: true });

  const dados = await buscarEquipeMotoristas();

  assert.deepEqual(dados.motoristas.map((motorista) => motorista.frequencia), [null, null]);
});
