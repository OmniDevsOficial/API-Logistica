import { test } from 'node:test';
import assert from 'node:assert/strict';
import { paginasVisiveis, totalDePaginas } from './paginacao.ts';

test('mostra a primeira, 3 antes, a atual, 3 depois e a última', () => {
  assert.deepEqual(paginasVisiveis(10, 40), [1, '...', 7, 8, 9, 10, 11, 12, 13, '...', 40]);
});

test('no início não repete a primeira página nem coloca reticências sem salto', () => {
  assert.deepEqual(paginasVisiveis(1, 40), [1, 2, 3, 4, '...', 40]);
  assert.deepEqual(paginasVisiveis(5, 40), [1, 2, 3, 4, 5, 6, 7, 8, '...', 40]);
});

test('no fim não repete a última página', () => {
  assert.deepEqual(paginasVisiveis(40, 40), [1, '...', 37, 38, 39, 40]);
});

test('poucas páginas aparecem todas', () => {
  assert.deepEqual(paginasVisiveis(1, 1), [1]);
  assert.deepEqual(paginasVisiveis(2, 3), [1, 2, 3]);
  assert.deepEqual(paginasVisiveis(1, 0), []);
});

test('total de páginas arredonda para cima e nunca é zero', () => {
  assert.equal(totalDePaginas(1871, 30), 63);
  assert.equal(totalDePaginas(30, 30), 1);
  assert.equal(totalDePaginas(0, 30), 1);
});
