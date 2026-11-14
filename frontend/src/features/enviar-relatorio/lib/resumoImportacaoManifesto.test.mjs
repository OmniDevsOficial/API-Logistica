// Node 24: node --test src/features/enviar-relatorio/lib/resumoImportacaoManifesto.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resumoImportacaoManifesto } from './resumoImportacaoManifesto.ts';

const base = { viagensImportadas: 10, manifestosDuplicados: [], erros: [], dataMaisRecente: null };

test('tudo gravado: cards zerados e sem destaque', () => {
  const resumo = resumoImportacaoManifesto(base);

  assert.match(resumo.mensagem, /Todas as linhas foram gravadas/);
  assert.deepEqual(resumo.cards, [
    { rotulo: 'Importadas', valor: 10 },
    { rotulo: 'Já existentes', valor: 0 },
    { rotulo: 'Rejeitadas', valor: 0, destaque: false },
  ]);
  assert.ok(resumo.tabelas.every((tabela) => tabela.ocorrencias.length === 0));
});

test('linhas rejeitadas destacam o card e entram na tabela com o manifesto', () => {
  const resumo = resumoImportacaoManifesto({
    ...base,
    erros: [{ linha: 4, manifesto: '124', mensagem: 'Data inválida' }],
  });

  assert.match(resumo.mensagem, /rejeitadas abaixo não foram gravadas/);
  assert.equal(resumo.cards[2].destaque, true);
  const [rejeitadas] = resumo.tabelas;
  assert.equal(rejeitadas.tom, 'erro');
  assert.deepEqual(rejeitadas.ocorrencias, [{ linha: 4, chave: '124', mensagem: 'Data inválida' }]);
});

test('manifestos duplicados viram avisos sem número de linha', () => {
  const resumo = resumoImportacaoManifesto({ ...base, manifestosDuplicados: ['100', '101'] });

  assert.match(resumo.mensagem, /já existiam no banco/);
  assert.equal(resumo.cards[1].valor, 2);
  const avisos = resumo.tabelas[1];
  assert.equal(avisos.tom, 'aviso');
  assert.deepEqual(avisos.ocorrencias.map((o) => [o.linha, o.chave]), [[null, '100'], [null, '101']]);
});
