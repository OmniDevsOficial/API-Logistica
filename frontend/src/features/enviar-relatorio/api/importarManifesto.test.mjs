// Node 24: node --test src/features/enviar-relatorio/api/importarManifesto.test.mjs
// Testes sem rede/banco: somente fetch é simulado, nunca o código de produção.
import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { importarManifesto, mensagemErroImportacao } from './importarManifesto.ts';
import { validarArquivoRelatorio } from '../lib/validarArquivoRelatorio.ts';

const fetchOriginal = globalThis.fetch;
afterEach(() => { globalThis.fetch = fetchOriginal; });
const arquivo = () => new File(['dados'], 'manifesto.csv');

test('valida extensões, vazio e fronteira de 10 MB', () => {
  for (const name of ['manifesto.csv', 'MANIFESTO.XLSX']) {
    assert.equal(validarArquivoRelatorio({ name, size: 10 * 1024 * 1024 }).valido, true);
  }
  for (const file of [
    { name: 'manifesto.xls', size: 1 },
    { name: 'manifesto.csv.exe', size: 1 },
    { name: 'manifesto', size: 1 },
    { name: 'manifesto.csv', size: 0 },
    { name: 'manifesto.csv', size: 10 * 1024 * 1024 + 1 },
  ]) assert.equal(validarArquivoRelatorio(file).valido, false);
});

test('arquivo inválido não faz requisição', async () => {
  globalThis.fetch = () => assert.fail('Não deveria enviar');
  await assert.rejects(importarManifesto(new File(['x'], 'arquivo.pdf')), /Excel/);
});

test('envia o arquivo uma vez ao operacional e conta as entidades retornadas', async () => {
  let chamadas = 0;
  globalThis.fetch = async (url, options) => {
    chamadas++;
    assert.equal(url, '/api/operacional/viagens/importar-manifesto');
    assert.equal(options.method, 'POST');
    assert.equal(options.body.get('file').name, 'manifesto.csv');
    assert.equal(options.headers, undefined);
    return Response.json([{ id: 1, manifesto: '123' }, { id: 2, manifesto: '124' }]);
  };
  assert.deepEqual(await importarManifesto(arquivo()), { viagensImportadas: 2 });
  assert.equal(chamadas, 1);
});

for (const [status, mensagem] of [[400, /incompleto/], [413, /tamanho/], [415, /incompleto/], [422, /incompleto/], [401, /acesso/], [403, /acesso/], [404, /ambiente/], [409, /conflito/], [429, /solicitações/], [500, /confirmar/], [502, /confirmar/], [504, /confirmar/]]) {
  test(`traduz HTTP ${status} sem expor erro técnico ou repetir a importação`, async () => {
    let chamadas = 0;
    globalThis.fetch = async () => {
      chamadas++;
      return new Response('java.lang.Exception: SQL interno', { status });
    };
    await assert.rejects(importarManifesto(arquivo()), mensagem);
    assert.equal(chamadas, 1);
  });
}

test('falha de rede alerta para conferir o banco antes de reenviar', async () => {
  globalThis.fetch = async () => { throw new TypeError('Failed to fetch'); };
  await assert.rejects(importarManifesto(arquivo()), /antes de reenviar/);
});

for (const dados of [null, {}, [{ Manifesto: '123' }], [{ id: null, manifesto: '123' }], [{ id: 1, manifesto: '' }], [null]]) {
  test(`resposta inesperada não confirma gravação: ${JSON.stringify(dados)}`, async () => {
    globalThis.fetch = async () => Response.json(dados);
    await assert.rejects(importarManifesto(arquivo()), /confirmar a importação/);
  });
}

test('HTML com HTTP 200 não é sucesso', async () => {
  globalThis.fetch = async () => new Response('<html>Erro</html>');
  await assert.rejects(importarManifesto(arquivo()), /antes de reenviar/);
});

test('lista vazia não é sucesso de importação', async () => {
  globalThis.fetch = async () => Response.json([]);
  await assert.rejects(importarManifesto(arquivo()), /Nenhuma viagem/);
});

test('timeout encerra a espera sem prometer cancelamento da gravação', async (context) => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  globalThis.fetch = async (_url, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener('abort', () => reject(new Error('Abortado')), { once: true });
  });
  const verificacao = assert.rejects(importarManifesto(arquivo()), /demorou.*antes de reenviar/);
  context.mock.timers.tick(60_000);
  await verificacao;
});

test('erro desconhecido nunca expõe detalhes internos', () => {
  assert.match(mensagemErroImportacao(new Error('SQL interno')), /Não foi possível confirmar/);
});
