import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatarQuando,
  inicioJanelaRecente,
  montarNotificacoes,
} from './montarNotificacoes.ts';

const AGORA = new Date(2026, 10, 22, 15, 0);
const DESDE = inicioJanelaRecente(AGORA);

function importacao(sobrescrever = {}) {
  return {
    chave: 'manifesto:1',
    id: 1,
    tipo: 'manifesto',
    dataHora: new Date(2026, 10, 21, 10, 0),
    arquivo: 'manifesto.xlsx',
    usuario: 'Ana',
    status: 'sucesso',
    resumo: { criados: 1, atualizados: 0, ignorados: 0, rejeitados: 0 },
    reimportacaoDe: null,
    ...sobrescrever,
  };
}

function usuario(sobrescrever = {}) {
  return {
    id: 3,
    nome: 'Bruno',
    email: 'bruno@x.com',
    perfil: 'OPERADOR',
    ativo: true,
    criadoEm: new Date(2026, 10, 22, 9, 0).toISOString(),
    foto: null,
    ...sobrescrever,
  };
}

test('janela recente começa à meia-noite de 7 dias atrás contando hoje', () => {
  assert.deepEqual(DESDE, new Date(2026, 10, 16));
});

test('alertas de utilização vêm primeiro e eventos do mais novo ao mais antigo', () => {
  const lista = montarNotificacoes({
    alertas: [{ id: 7, nome: 'Diego', percentual: 26 }],
    importacoes: [importacao()],
    usuarios: [usuario()],
    desde: DESDE,
  });

  assert.deepEqual(
    lista.map((n) => n.chave),
    ['utilizacao:7:26', 'usuario:3', 'importacao:manifesto:1'],
  );
  assert.equal(lista[0].titulo, 'Alerta motorista: Diego, baixa frequência: 26%');
  assert.equal(lista[1].detalhe, 'Bruno · Operador');
  assert.equal(lista[2].detalhe, 'manifesto.xlsx · por Ana');
});

test('título e tom seguem o tipo e o status da importação', () => {
  const [parcial, erro] = montarNotificacoes({
    alertas: [],
    importacoes: [
      importacao({ chave: 'veiculos:2', tipo: 'veiculos', status: 'parcial', usuario: null }),
      importacao({ chave: 'manifesto:4', status: 'erro', dataHora: new Date(2026, 10, 20) }),
    ],
    usuarios: [],
    desde: DESDE,
  });

  assert.equal(parcial.titulo, 'Planilha de veículos importada com rejeições');
  assert.equal(parcial.tom, 'aviso');
  assert.equal(parcial.detalhe, 'manifesto.xlsx');
  assert.equal(erro.titulo, 'Falha ao importar manifesto');
  assert.equal(erro.tom, 'erro');
});

test('eventos anteriores à janela ficam de fora', () => {
  const lista = montarNotificacoes({
    alertas: [],
    importacoes: [importacao({ dataHora: new Date(2026, 10, 15, 23, 59) })],
    usuarios: [usuario({ criadoEm: new Date(2026, 9, 1).toISOString() })],
    desde: DESDE,
  });

  assert.deepEqual(lista, []);
});

test('quando mostra hoje, ontem ou a data', () => {
  assert.equal(formatarQuando(new Date(2026, 10, 22, 9, 5), AGORA), 'Hoje às 09:05');
  assert.equal(formatarQuando(new Date(2026, 10, 21, 18, 30), AGORA), 'Ontem às 18:30');
  assert.equal(formatarQuando(new Date(2026, 10, 18, 7, 0), AGORA), '18/11 às 07:00');
});
