// Node: node --test src/entities/motorista/lib/faturamentoMotorista.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { faturamentoDoMotorista, indexarFaturamento } from './faturamentoMotorista.ts';

const pagamentos = [
  { motorista: 'Ana Souza', cpf: '00123456789', quantidadeViagens: 2, valorAPagar: 1500 },
  { motorista: 'Bruno', cpf: '11111111111', quantidadeViagens: 1, valorAPagar: 250.5 },
  { motorista: 'Sem motorista identificado', cpf: null, quantidadeViagens: 3, valorAPagar: 999 },
];
const indice = indexarFaturamento(pagamentos);

test('cruza pelo CPF mesmo com pontuação no ranking', () => {
  assert.equal(faturamentoDoMotorista(indice, { cpf: '001.234.567-89', nome: 'Outro Nome' }), 1500);
});

test('sem CPF no ranking, cruza pelo nome ignorando caixa e espaços', () => {
  assert.equal(faturamentoDoMotorista(indice, { cpf: null, nome: '  bruno ' }), 250.5);
});

test('motorista sem pagamento no mês devolve null', () => {
  assert.equal(faturamentoDoMotorista(indice, { cpf: '99999999999', nome: 'Caio' }), null);
});

test('o grupo sem CPF não é atribuído a ninguém', () => {
  assert.equal(faturamentoDoMotorista(indice, { cpf: null, nome: 'Sem motorista identificado' }), null);
});
