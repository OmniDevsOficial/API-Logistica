// Node 24: node --test src/features/importar-dados/lib/avisoImportacaoConcluida.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  avisarImportacaoConcluida,
  EVENTO_IMPORTACAO_CONCLUIDA,
} from './avisoImportacaoConcluida.ts';

class EventoFake {
  constructor(tipo, opcoes = {}) {
    this.type = tipo;
    this.detail = opcoes.detail;
  }
}

function comJanelaFake(executar) {
  const original = globalThis.window;
  const eventos = [];
  globalThis.window = {
    dispatchEvent: (evento) => {
      eventos.push(evento);
      return true;
    },
  };
  // O módulo usa window e CustomEvent do ambiente.
  const EventoOriginal = globalThis.CustomEvent;
  globalThis.CustomEvent = EventoFake;
  try {
    executar();
  } finally {
    globalThis.window = original;
    globalThis.CustomEvent = EventoOriginal;
  }
  return eventos;
}

test('dispara o evento com o tipo da planilha importada', () => {
  const eventos = comJanelaFake(() => avisarImportacaoConcluida('veiculos'));

  assert.equal(eventos.length, 1);
  assert.equal(eventos[0].type, 'importacao:concluida');
  assert.deepEqual(eventos[0].detail, { tipo: 'veiculos' });
  assert.equal(EVENTO_IMPORTACAO_CONCLUIDA, 'importacao:concluida');
});

test('sem janela (ambiente de teste) não quebra', () => {
  const original = globalThis.window;
  delete globalThis.window;
  try {
    assert.doesNotThrow(() => avisarImportacaoConcluida('manifesto'));
  } finally {
    globalThis.window = original;
  }
});
