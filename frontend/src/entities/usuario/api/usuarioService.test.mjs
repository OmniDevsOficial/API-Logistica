import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  cadastrarUsuario,
  ErroCadastroUsuario,
  listarUsuarios,
} from './usuarioService.ts';

const fetchOriginal = globalThis.fetch;
afterEach(() => { globalThis.fetch = fetchOriginal; });

function resposta(corpo, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => corpo };
}

const usuarioDaApi = {
  id: 3,
  nome: 'Ana Souza',
  email: 'ana@newe.com.br',
  perfil: 'OPERADOR',
  ativo: true,
  criadoEm: '2026-11-17T12:00:00Z',
};

const novo = { nome: '  Ana Souza ', email: ' Ana@Newe.com.br ', perfil: 'OPERADOR', senha: 'segredo123' };

async function erroDoCadastro() {
  try {
    await cadastrarUsuario(novo);
  } catch (erro) {
    return erro;
  }
  assert.fail('o cadastro deveria falhar');
}

test('lista os usuários pelo serviço de autenticação', async () => {
  let urlChamada = '';
  globalThis.fetch = async (url) => {
    urlChamada = String(url);
    return resposta([usuarioDaApi]);
  };

  const usuarios = await listarUsuarios();

  assert.equal(urlChamada, '/api/autenticacao/usuarios');
  assert.deepEqual(usuarios, [usuarioDaApi]);
});

test('recusa a lista quando algum item vem incompleto', async () => {
  globalThis.fetch = async () => resposta([{ ...usuarioDaApi, perfil: 'ADMIN' }]);

  await assert.rejects(listarUsuarios(), /inválida/);
});

test('recusa a lista quando o status ativo não vem como booleano', async () => {
  globalThis.fetch = async () => resposta([{ ...usuarioDaApi, ativo: 'sim' }]);

  await assert.rejects(listarUsuarios(), /inválida/);
});

test('avisa quando o perfil não tem permissão de listar', async () => {
  globalThis.fetch = async () => resposta({ erro: 'proibido' }, 403);

  await assert.rejects(listarUsuarios(), /permissão/);
});

test('envia o cadastro com nome aparado e e-mail em minúsculo, sem a confirmação', async () => {
  let requisicao;
  globalThis.fetch = async (url, opcoes) => {
    requisicao = { url: String(url), opcoes };
    return resposta(usuarioDaApi, 201);
  };

  const usuario = await cadastrarUsuario(novo);

  assert.equal(requisicao.url, '/api/autenticacao/usuarios');
  assert.equal(requisicao.opcoes.method, 'POST');
  assert.deepEqual(JSON.parse(requisicao.opcoes.body), {
    nome: 'Ana Souza',
    email: 'ana@newe.com.br',
    perfil: 'OPERADOR',
    senha: 'segredo123',
  });
  assert.deepEqual(usuario, usuarioDaApi);
});

test('409 vira erro no campo de e-mail', async () => {
  globalThis.fetch = async () => resposta({ erro: 'duplicado' }, 409);

  const erro = await erroDoCadastro();

  assert.ok(erro instanceof ErroCadastroUsuario);
  assert.equal(erro.motivo, 'conflito');
  assert.equal(erro.campos.email, 'Esse e-mail já está em uso.');
});

test('400 traz os erros de cada campo devolvidos pelo back', async () => {
  globalThis.fetch = async () => resposta({
    erro: 'Campos inválidos.',
    campos: { nome: 'Nome muito longo.', senha: 'Senha curta.', outro: 'ignorado' },
  }, 400);

  const erro = await erroDoCadastro();

  assert.equal(erro.motivo, 'campos');
  assert.deepEqual(erro.campos, { nome: 'Nome muito longo.', senha: 'Senha curta.' });
});

test('400 sem campos usa a mensagem geral do back', async () => {
  globalThis.fetch = async () => resposta({ erro: 'Corpo inválido.' }, 400);

  const erro = await erroDoCadastro();

  assert.equal(erro.motivo, 'campos');
  assert.equal(erro.message, 'Corpo inválido.');
  assert.deepEqual(erro.campos, {});
});

test('separa falha de rede, sessão expirada, falta de permissão e erro do servidor', async () => {
  globalThis.fetch = async () => { throw new TypeError('Failed to fetch'); };
  assert.equal((await erroDoCadastro()).motivo, 'rede');

  globalThis.fetch = async () => resposta(null, 401);
  assert.equal((await erroDoCadastro()).motivo, 'sessao');

  globalThis.fetch = async () => resposta(null, 403);
  assert.equal((await erroDoCadastro()).motivo, 'permissao');

  globalThis.fetch = async () => resposta(null, 500);
  assert.equal((await erroDoCadastro()).motivo, 'servidor');
});

test('a resposta do cadastro nunca expõe senha nem hash', async () => {
  globalThis.fetch = async () => resposta({ ...usuarioDaApi, senha: 'x', senhaHash: 'y' }, 201);

  const usuario = await cadastrarUsuario(novo);

  assert.equal('senha' in usuario, false);
  assert.equal('senhaHash' in usuario, false);
});
