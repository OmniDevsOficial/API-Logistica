// Node: node --test src/pages/Ranking/lib/distribuirRanking.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { distribuirRanking } from './distribuirRanking.ts';

function motorista(nome) {
  return {
    motoristaId: 1,
    nome,
    telefone: null,
    veiculo: null,
    placa: null,
    viagens: 1,
    frequencia: null,
    rentabilidadeMedia: 1,
    frete: null,
    custos: null,
  };
}

function ranking(...nomes) {
  return nomes.map(motorista);
}

test('os 3 primeiros vão para o pódio e os demais para a lista', () => {
  const { podio, lista } = distribuirRanking(
    ranking('João Silva', 'Thales Souza', 'Jailson Nunes', 'Carlos Souza', 'Ana Ribeiro'),
  );

  assert.deepEqual(podio.map((colocacao) => colocacao.motorista.nome), [
    'João Silva',
    'Thales Souza',
    'Jailson Nunes',
  ]);
  assert.deepEqual(lista.map((colocacao) => colocacao.motorista.nome), [
    'Carlos Souza',
    'Ana Ribeiro',
  ]);
});

test('a posição é a ordem do ranking, começando em 1', () => {
  const { podio, lista } = distribuirRanking(
    ranking('João Silva', 'Thales Souza', 'Jailson Nunes', 'Carlos Souza'),
  );

  assert.deepEqual(
    [...podio, ...lista].map((colocacao) => colocacao.posicao),
    [1, 2, 3, 4],
  );
});

test('com menos de 3 motoristas o pódio só tem as posições que existem', () => {
  const dois = distribuirRanking(ranking('João Silva', 'Thales Souza'));

  assert.deepEqual(dois.podio.map((colocacao) => colocacao.posicao), [1, 2]);
  assert.deepEqual(dois.lista, []);

  const um = distribuirRanking(ranking('João Silva'));

  assert.deepEqual(um.podio.map((colocacao) => colocacao.posicao), [1]);
  assert.deepEqual(um.lista, []);
});

test('sem motoristas o pódio e a lista ficam vazios', () => {
  const { podio, lista } = distribuirRanking([]);

  assert.deepEqual(podio, []);
  assert.deepEqual(lista, []);
});
