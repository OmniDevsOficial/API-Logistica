import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lerFiltroSalvo, salvarFiltro } from './filtroSalvo.ts';

function armazenamentoFalso(inicial = {}) {
  const dados = { ...inicial };
  return {
    dados,
    getItem: (chave) => (chave in dados ? dados[chave] : null),
    setItem: (chave, valor) => { dados[chave] = String(valor); },
  };
}

test('guarda o periodo e a referencia e le de volta o mesmo filtro', () => {
  const armazenamento = armazenamentoFalso();

  salvarFiltro({ periodo: 'mes', referencia: new Date(2026, 7, 1) }, armazenamento);
  const filtro = lerFiltroSalvo(armazenamento);

  assert.equal(filtro.periodo, 'mes');
  assert.equal(filtro.referencia.getFullYear(), 2026);
  assert.equal(filtro.referencia.getMonth(), 7);
  assert.equal(filtro.referencia.getDate(), 1);
});

test('salva a referencia como data local, sem deslocar o dia pelo fuso', () => {
  const armazenamento = armazenamentoFalso();

  salvarFiltro({ periodo: 'dia', referencia: new Date(2026, 7, 16, 23, 30) }, armazenamento);

  assert.deepEqual(
    JSON.parse(Object.values(armazenamento.dados)[0]),
    { periodo: 'dia', referencia: '2026-08-16' },
  );
});

test('sem filtro salvo nao devolve nada, para a tela abrir no mes atual', () => {
  assert.equal(lerFiltroSalvo(armazenamentoFalso()), null);
});

test('ignora filtro salvo corrompido ou fora do formato', () => {
  for (const salvo of [
    'nao-e-json',
    JSON.stringify({ periodo: 'semana', referencia: '2026-08-01' }),
    JSON.stringify({ periodo: 'mes', referencia: '01/08/2026' }),
    JSON.stringify({ periodo: 'mes' }),
  ]) {
    const armazenamento = armazenamentoFalso({ 'newelog.dashboard.filtro': salvo });
    assert.equal(lerFiltroSalvo(armazenamento), null);
  }
});

test('navegador sem armazenamento disponivel nao quebra a tela', () => {
  const bloqueado = {
    getItem: () => { throw new Error('bloqueado'); },
    setItem: () => { throw new Error('bloqueado'); },
  };

  assert.equal(lerFiltroSalvo(bloqueado), null);
  assert.doesNotThrow(() =>
    salvarFiltro({ periodo: 'mes', referencia: new Date(2026, 7, 1) }, bloqueado));
});
