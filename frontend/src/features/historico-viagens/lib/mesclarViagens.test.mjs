import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mesclarViagens } from './mesclarViagens.ts';

function viagem(id) {
  return { id, manifesto: String(id) };
}

test('junta a página nova depois da atual, mantendo a ordem', () => {
  const resultado = mesclarViagens([viagem(10), viagem(9)], [viagem(8), viagem(7)]);

  assert.deepEqual(resultado.map((v) => v.id), [10, 9, 8, 7]);
});

test('descarta viagem repetida quando o deslocamento repete itens', () => {
  const resultado = mesclarViagens(
    [viagem(10), viagem(9), viagem(8)],
    [viagem(8), viagem(7), viagem(6)],
  );

  assert.deepEqual(resultado.map((v) => v.id), [10, 9, 8, 7, 6]);
});

test('descarta id repetido dentro da própria página nova', () => {
  const resultado = mesclarViagens([viagem(3)], [viagem(2), viagem(2), viagem(1)]);

  assert.deepEqual(resultado.map((v) => v.id), [3, 2, 1]);
});

test('mantém a versão já exibida da viagem repetida', () => {
  const exibida = { id: 5, manifesto: 'antigo' };
  const resultado = mesclarViagens([exibida], [{ id: 5, manifesto: 'novo' }]);

  assert.equal(resultado[0], exibida);
});

test('não altera as listas recebidas', () => {
  const atuais = [viagem(2)];
  const novas = [viagem(1)];

  mesclarViagens(atuais, novas);

  assert.deepEqual(atuais.map((v) => v.id), [2]);
  assert.deepEqual(novas.map((v) => v.id), [1]);
});

test('lista vazia de qualquer lado', () => {
  assert.deepEqual(mesclarViagens([], [viagem(1)]).map((v) => v.id), [1]);
  assert.deepEqual(mesclarViagens([viagem(1)], []).map((v) => v.id), [1]);
});
