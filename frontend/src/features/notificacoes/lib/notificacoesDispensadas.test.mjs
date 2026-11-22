import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  adicionarDispensadas,
  chaveArmazenamento,
  LIMITE_DISPENSADAS,
  lerDispensadas,
  salvarDispensadas,
} from './notificacoesDispensadas.ts';

function armazenamentoFake(inicial = {}) {
  const dados = { ...inicial };
  return {
    dados,
    getItem: (chave) => (chave in dados ? dados[chave] : null),
    setItem: (chave, valor) => {
      dados[chave] = valor;
    },
  };
}

test('cada usuário tem a própria lista, sem diferenciar maiúsculas no e-mail', () => {
  assert.equal(chaveArmazenamento(' Ana@X.com '), 'notificacoes:dispensadas:ana@x.com');
});

test('salva e lê as chaves dispensadas', () => {
  const armazenamento = armazenamentoFake();
  salvarDispensadas(armazenamento, 'ana@x.com', ['usuario:1', 'importacao:manifesto:2']);
  assert.deepEqual(lerDispensadas(armazenamento, 'ana@x.com'), [
    'usuario:1',
    'importacao:manifesto:2',
  ]);
  assert.deepEqual(lerDispensadas(armazenamento, 'bruno@x.com'), []);
});

test('conteúdo inválido ou sem armazenamento vira lista vazia', () => {
  const armazenamento = armazenamentoFake({ [chaveArmazenamento('ana@x.com')]: '{quebrado' });
  assert.deepEqual(lerDispensadas(armazenamento, 'ana@x.com'), []);
  assert.deepEqual(lerDispensadas(null, 'ana@x.com'), []);
  assert.doesNotThrow(() => salvarDispensadas(null, 'ana@x.com', ['x']));
});

test('falha ao gravar não quebra a tela', () => {
  const armazenamento = {
    getItem: () => null,
    setItem: () => {
      throw new Error('cota');
    },
  };
  assert.doesNotThrow(() => salvarDispensadas(armazenamento, 'ana@x.com', ['x']));
});

test('guarda só as mais recentes até o limite', () => {
  const armazenamento = armazenamentoFake();
  const chaves = Array.from({ length: LIMITE_DISPENSADAS + 10 }, (_, i) => `usuario:${i}`);
  salvarDispensadas(armazenamento, 'ana@x.com', chaves);
  const salvas = lerDispensadas(armazenamento, 'ana@x.com');
  assert.equal(salvas.length, LIMITE_DISPENSADAS);
  assert.equal(salvas[0], 'usuario:10');
});

test('adicionar não repete chave já dispensada', () => {
  assert.deepEqual(adicionarDispensadas(['a', 'b'], ['b', 'c']), ['a', 'b', 'c']);
});
