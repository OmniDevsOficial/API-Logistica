// Node 24: node --test src/entities/importacao/api/importacaoService.test.mjs
// Testes sem rede: somente fetch é simulado, nunca o código de produção.
import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { buscarImportacoes, lerImportacao } from './importacaoService.ts';

const fetchOriginal = globalThis.fetch;
afterEach(() => { globalThis.fetch = fetchOriginal; });

const LINHA = {
  id: 12,
  tipo: 'VEICULO',
  dataHora: '2026-11-12T11:00:00-03:00',
  arquivo: 'frota-novembro.csv',
  usuario: 'Yuri',
  status: 'SUCESSO',
  resumo: { criados: 4, atualizados: 1, ignorados: 0, rejeitados: 2 },
  reimportacaoDe: '2026-11-05T10:00:00-03:00',
};

function responder(corpo, status = 200) {
  const chamadas = [];
  globalThis.fetch = async (url) => {
    chamadas.push(String(url));
    return new Response(JSON.stringify(corpo), { status });
  };
  return chamadas;
}

test('manda tipo, status e período como parâmetros do back', async () => {
  const chamadas = responder([]);

  await buscarImportacoes({
    tipo: 'veiculos',
    status: 'parcial',
    de: '2026-11-01',
    ate: '2026-11-17',
  });

  // O tipo da UI ("veiculos") é convertido para o nome do enum do back.
  assert.equal(
    chamadas[0],
    '/api/operacional/importacoes?tipo=VEICULO&status=parcial&de=2026-11-01&ate=2026-11-17',
  );
});

test('sem status e sem período manda só o tipo da origem', async () => {
  const chamadas = responder([]);

  await buscarImportacoes({ tipo: 'manifesto' });

  assert.equal(chamadas[0], '/api/operacional/importacoes?tipo=MANIFESTO');
});

test('converte a linha: chave tipo:id, status em minúsculas e datas reais', async () => {
  responder([LINHA]);

  const [linha] = await buscarImportacoes({ tipo: 'veiculos' });

  assert.equal(linha.chave, 'veiculos:12');
  assert.equal(linha.tipo, 'veiculos');
  assert.equal(linha.status, 'sucesso');
  assert.equal(linha.arquivo, 'frota-novembro.csv');
  assert.equal(linha.usuario, 'Yuri');
  assert.deepEqual(linha.resumo, {
    criados: 4, atualizados: 1, ignorados: 0, rejeitados: 2,
  });
  assert.equal(linha.dataHora.getTime(), new Date(LINHA.dataHora).getTime());
  assert.equal(linha.reimportacaoDe.getTime(), new Date(LINHA.reimportacaoDe).getTime());
});

test('linha sem usuário e sem reimportação fica com null', async () => {
  responder([{ ...LINHA, usuario: '', reimportacaoDe: null }]);

  const [linha] = await buscarImportacoes({ tipo: 'veiculos' });

  assert.equal(linha.usuario, null);
  assert.equal(linha.reimportacaoDe, null);
});

test('resposta fora do contrato vira erro amigável', async () => {
  responder([{ id: 1 }]);
  await assert.rejects(buscarImportacoes({ tipo: 'manifesto' }), /inválida/);
});

test('falha HTTP vira erro amigável', async () => {
  responder({ erro: 'x' }, 500);
  await assert.rejects(
    buscarImportacoes({ tipo: 'manifesto' }),
    /Não foi possível carregar o histórico/,
  );
});

test('lerImportacao recusa lixo sem quebrar a tela', () => {
  assert.equal(lerImportacao(null), null);
  assert.equal(lerImportacao('texto'), null);
  assert.equal(lerImportacao({ ...LINHA, status: 'EXPLODIU' }), null);
  assert.equal(lerImportacao({ ...LINHA, dataHora: 'ontem' }), null);
  assert.equal(lerImportacao({ ...LINHA, resumo: {} }), null);
});
