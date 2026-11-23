// Node 24: node --test src/features/importar-veiculos/api/importarVeiculos.test.mjs
// Testes sem rede/banco: somente fetch é simulado, nunca o código de produção.
import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  importarVeiculos,
  mensagemErroImportacaoVeiculos,
  podeTentarDeNovo,
} from './importarVeiculos.ts';
import { validarArquivoVeiculos } from '../lib/validarArquivoVeiculos.ts';

const fetchOriginal = globalThis.fetch;
afterEach(() => { globalThis.fetch = fetchOriginal; });
const arquivo = () => new File(['Placa;Tipo Veículo\nABC1234;VAN'], 'veiculos.csv');

const RESULTADO = {
  totalLinhas: 3,
  veiculosCadastrados: 1,
  veiculosAtualizados: 1,
  motoristasCadastrados: 1,
  veiculosSemMotorista: 0,
  linhasComErro: 1,
  erros: [{ linha: 4, placa: null, mensagem: 'Placa não informada.' }],
  avisos: [],
};

test('valida extensão, vazio e fronteira de 10 MB', () => {
  for (const name of ['veiculos.csv', 'VEICULOS.CSV']) {
    assert.equal(validarArquivoVeiculos({ name, size: 10 * 1024 * 1024 }).valido, true);
  }
  for (const file of [
    { name: 'veiculos.xlsx', size: 1 },
    { name: 'veiculos.csv.exe', size: 1 },
    { name: 'veiculos', size: 1 },
    { name: 'veiculos.csv', size: 0 },
    { name: 'veiculos.csv', size: 10 * 1024 * 1024 + 1 },
  ]) assert.equal(validarArquivoVeiculos(file).valido, false);
});

test('arquivo inválido não faz requisição', async () => {
  globalThis.fetch = () => assert.fail('Não deveria enviar');
  await assert.rejects(importarVeiculos(new File(['x'], 'veiculos.xlsx')), /CSV/);
});

test('envia o arquivo uma vez no campo file e devolve o resumo', async () => {
  const chamadas = [];
  globalThis.fetch = async (url, opcoes) => {
    chamadas.push({ url: String(url), metodo: opcoes.method, arquivo: opcoes.body.get('file') });
    return Response.json(RESULTADO);
  };

  const resultado = await importarVeiculos(arquivo());

  assert.equal(chamadas.length, 1);
  assert.equal(chamadas[0].url, '/api/operacional/veiculos/importacao');
  assert.equal(chamadas[0].metodo, 'POST');
  assert.equal(chamadas[0].arquivo.name, 'veiculos.csv');
  assert.deepEqual(resultado, RESULTADO);
});

test('400 mostra a mensagem do backend (ex.: colunas ausentes)', async () => {
  globalThis.fetch = async () => Response.json(
    { erro: 'Colunas obrigatórias ausentes: Tipo Veículo.' }, { status: 400 });

  await assert.rejects(importarVeiculos(arquivo()), /Colunas obrigatórias ausentes: Tipo Veículo\./);
});

test('400 sem corpo legível usa mensagem própria', async () => {
  globalThis.fetch = async () => new Response('<html>Bad Request</html>', { status: 400 });

  await assert.rejects(importarVeiculos(arquivo()), /Placa e Tipo Veículo/);
});

test('403 informa falta de acesso sem sugerir reenvio', async () => {
  globalThis.fetch = async () => new Response(null, { status: 403 });

  const erro = await importarVeiculos(arquivo()).catch((e) => e);

  assert.match(erro.message, /não tem acesso à importação de veículos/);
  assert.equal(podeTentarDeNovo(erro), false);
});

test('413 do proxy vira mensagem de tamanho', async () => {
  globalThis.fetch = async () => new Response('<html>413</html>', { status: 413 });
  await assert.rejects(importarVeiculos(arquivo()), /10MB/);
});

test('500 não expõe detalhes técnicos e orienta reenvio seguro', async () => {
  globalThis.fetch = async () => Response.json({ erro: 'SQLState 23505 detalhe interno' }, { status: 500 });

  const erro = await importarVeiculos(arquivo()).catch((e) => e);

  assert.doesNotMatch(mensagemErroImportacaoVeiculos(erro), /SQLState/);
  assert.match(mensagemErroImportacaoVeiculos(erro), /Reenviar o arquivo é seguro/);
});

test('resposta fora do contrato vira resultado incerto', async () => {
  globalThis.fetch = async () => Response.json({ ...RESULTADO, erros: 'x' });
  await assert.rejects(importarVeiculos(arquivo()), /Não foi possível confirmar/);
});

test('falha de rede mostra "Não foi possível enviar o arquivo" e permite tentar de novo', async () => {
  globalThis.fetch = async () => { throw new TypeError('Failed to fetch'); };

  const erro = await importarVeiculos(arquivo()).catch((e) => e);

  assert.match(erro.message, /^Não foi possível enviar o arquivo\./);
  assert.equal(podeTentarDeNovo(erro), true);
});

test('400 é erro do arquivo: não oferece tentar de novo', async () => {
  globalThis.fetch = async () => Response.json({ erro: 'O arquivo está vazio.' }, { status: 400 });

  const erro = await importarVeiculos(arquivo()).catch((e) => e);

  assert.equal(erro.message, 'O arquivo está vazio.');
  assert.equal(podeTentarDeNovo(erro), false);
});

test('200 com corpo ilegível não é tratado como falha de rede', async () => {
  globalThis.fetch = async () => new Response('não é json', { status: 200 });

  const erro = await importarVeiculos(arquivo()).catch((e) => e);

  assert.match(erro.message, /Não foi possível confirmar a importação/);
  assert.equal(podeTentarDeNovo(erro), true);
});

test('erro desconhecido usa a mensagem padrão', () => {
  assert.match(mensagemErroImportacaoVeiculos(new Error('qualquer')), /Não foi possível confirmar/);
});
