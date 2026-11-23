import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { alterarFotoConta, alterarNomeConta, buscarConta } from './contaService.ts';

const fetchOriginal = globalThis.fetch;
afterEach(() => { globalThis.fetch = fetchOriginal; });

function resposta(corpo, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => corpo };
}

const contaDaApi = {
  id: 3,
  nome: 'Ana Souza',
  email: 'ana@newe.com.br',
  perfil: 'OPERADOR',
  ativo: true,
  criadoEm: '2026-11-17T12:00:00Z',
  foto: null,
};

const FOTO = 'data:image/jpeg;base64,/9j/4AAQ';

test('busca o perfil do usuário logado', async () => {
  let urlChamada = '';
  globalThis.fetch = async (url) => {
    urlChamada = String(url);
    return resposta(contaDaApi);
  };

  const conta = await buscarConta();

  assert.equal(urlChamada, '/api/autenticacao/perfil');
  assert.deepEqual(conta, contaDaApi);
});

test('recusa perfil com campos fora do contrato', async () => {
  globalThis.fetch = async () => resposta({ ...contaDaApi, perfil: 'ADMIN' });
  await assert.rejects(buscarConta(), /inválida/);

  globalThis.fetch = async () => resposta({ ...contaDaApi, foto: 42 });
  await assert.rejects(buscarConta(), /inválida/);
});

test('altera o nome aparado e devolve a conta com o token novo', async () => {
  let chamada;
  globalThis.fetch = async (url, opcoes) => {
    chamada = { url: String(url), metodo: opcoes.method, corpo: JSON.parse(opcoes.body) };
    return resposta({ perfil: { ...contaDaApi, nome: 'Ana Lima' }, token: 'token-novo' });
  };

  const { conta, token } = await alterarNomeConta('  Ana Lima ');

  assert.deepEqual(chamada, {
    url: '/api/autenticacao/perfil',
    metodo: 'PATCH',
    corpo: { nome: 'Ana Lima' },
  });
  assert.equal(conta.nome, 'Ana Lima');
  assert.equal(token, 'token-novo');
});

test('troca do nome sem token na resposta é recusada', async () => {
  globalThis.fetch = async () => resposta({ perfil: contaDaApi });

  await assert.rejects(alterarNomeConta('Ana'), /inválida/);
});

test('envia a foto e também aceita remover com null', async () => {
  const corpos = [];
  globalThis.fetch = async (url, opcoes) => {
    corpos.push({ url: String(url), corpo: JSON.parse(opcoes.body) });
    return resposta({ ...contaDaApi, foto: corpos.at(-1).corpo.foto });
  };

  assert.equal((await alterarFotoConta(FOTO)).foto, FOTO);
  assert.equal((await alterarFotoConta(null)).foto, null);
  assert.deepEqual(corpos, [
    { url: '/api/autenticacao/perfil/foto', corpo: { foto: FOTO } },
    { url: '/api/autenticacao/perfil/foto', corpo: { foto: null } },
  ]);
});

test('mostra a mensagem do campo devolvida pelo back', async () => {
  globalThis.fetch = async () =>
    resposta({ erro: 'Campos inválidos.', campos: { foto: 'Envie uma imagem PNG, JPG ou WEBP.' } }, 400);

  await assert.rejects(alterarFotoConta(FOTO), /PNG, JPG ou WEBP/);
});

test('separa falha de rede, sessão expirada e erro do servidor', async () => {
  globalThis.fetch = async () => { throw new TypeError('rede'); };
  await assert.rejects(alterarNomeConta('Ana'), /conectar ao servidor/);

  globalThis.fetch = async () => resposta(null, 401);
  await assert.rejects(alterarNomeConta('Ana'), /sessão expirou/);

  globalThis.fetch = async () => resposta(null, 500);
  await assert.rejects(alterarFotoConta(null), /salvar agora/);
});
