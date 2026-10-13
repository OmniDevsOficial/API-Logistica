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
    tipoVeiculo: null,
    placa: null,
    status: 'DISPONIVEL',
    localizacao: null,
    ultimaOperacao: null,
    previsaoDisponibilidade: null,
    quantidadeViagens: 0,
  },
];

function responder(resumo = RESUMO, lista = LISTA) {
  return async (input) => {
    const url = String(input);
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
      veiculo: 'Van',
      placa: 'RTA4F21',
      operacao: 'Previsão de disponibilidade',
      dataOperacao: '12/10/2026',
      localizacao: 'Campinas/SP',
      viagens: 18,
      status: 'em_viagem',
    },
    {
      id: 8,
      nome: 'Marcos Vinícius Lima',
      veiculo: '-',
      placa: '-',
      operacao: '-',
      dataOperacao: '-',
      localizacao: '-',
      viagens: 0,
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

  assert.ok(urls.includes('/api/operacional/motoristas?status=EM_OPERACAO'));
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
