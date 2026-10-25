import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { getRankingDestinos, getRentabilidade, getViagensData } from './viagemService.ts';
import { limparToken, salvarToken } from '../../../shared/api/tokenSessao.ts';

const fetchOriginal = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = fetchOriginal;
  limparToken();
});

function registrarChamadas(resposta) {
  const chamadas = [];
  globalThis.fetch = async (url, init) => {
    chamadas.push({ url: String(url), autorizacao: new Headers(init?.headers).get('Authorization') });
    return Response.json(resposta);
  };
  return chamadas;
}

test('lista as viagens enviando o token de login', async () => {
  salvarToken('token-gestor');
  const chamadas = registrarChamadas([{ id: 1, manifesto: '18790', destino: 'São Paulo' }]);

  const dados = await getViagensData();

  assert.deepEqual(chamadas, [{ url: '/api/operacional/viagens', autorizacao: 'Bearer token-gestor' }]);
  assert.equal(dados.viagens[0].manifesto, '18790');
});

test('busca a rentabilidade pelo manifesto enviando o token de login', async () => {
  salvarToken('token-gestor');
  const chamadas = registrarChamadas({ receita: 2120.58, rentabilidade: -174.99 });

  await getRentabilidade('18790');

  assert.deepEqual(chamadas, [
    { url: '/api/operacional/viagens/18790/rentabilidade', autorizacao: 'Bearer token-gestor' },
  ]);
});

test('resposta de erro vira a mensagem mostrada na tela', async () => {
  globalThis.fetch = async () => new Response('', { status: 401 });

  await assert.rejects(getViagensData(), /Não foi possível carregar as viagens/);
  await assert.rejects(getRentabilidade('18790'), /Não foi possível carregar a rentabilidade/);
});

test('busca o ranking de rotas do período enviando o token de login', async () => {
  salvarToken('token-gestor');
  const chamadas = registrarChamadas([
    { origem: 'Matriz', destino: 'Campinas', quantidadeViagens: 3, rentabilidadeMedia: 812.4 },
  ]);

  const ranking = await getRankingDestinos('01/01/2026', '31/12/2026');

  assert.deepEqual(chamadas, [
    { url: '/api/operacional/viagens/ranking-destinos?dataInicio=01%2F01%2F2026&dataFim=31%2F12%2F2026', autorizacao: 'Bearer token-gestor' },
  ]);
  assert.equal(ranking[0].destino, 'Campinas');
});

test('erro no ranking vira a mensagem mostrada na tela', async () => {
  globalThis.fetch = async () => new Response('', { status: 400 });

  await assert.rejects(getRankingDestinos('01/01/2026', '31/12/2026'), /Não foi possível carregar o ranking de destinos/);
});
