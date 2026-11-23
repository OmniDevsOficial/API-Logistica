import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mensagemAlerta } from './mensagemAlerta.ts';

test('mensagem segue o formato do sino', () => {
  assert.equal(
    mensagemAlerta({ id: 7, nome: 'Diego Martins Faria', percentual: 26 }),
    'Alerta motorista: Diego Martins Faria, baixa frequência: 26%',
  );
});

test('percentual usa o mesmo arredondamento da tabela', () => {
  assert.equal(
    mensagemAlerta({ id: 7, nome: 'Diego', percentual: 26.456 }),
    'Alerta motorista: Diego, baixa frequência: 26,5%',
  );
});
