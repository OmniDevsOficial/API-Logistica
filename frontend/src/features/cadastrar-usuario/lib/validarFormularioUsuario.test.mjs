import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validarFormularioUsuario, temErros } from './validarFormularioUsuario.ts';

const valido = {
  nome: 'Ana Souza',
  email: 'ana@newe.com.br',
  perfil: 'GESTOR',
  senha: 'segredo123',
  confirmacao: 'segredo123',
};

test('formulário completo não tem erros', () => {
  assert.equal(temErros(validarFormularioUsuario(valido)), false);
});

test('todos os campos são obrigatórios', () => {
  const erros = validarFormularioUsuario({
    nome: '  ',
    email: '',
    perfil: '',
    senha: '',
    confirmacao: '',
  });

  assert.deepEqual(Object.keys(erros).sort(), ['confirmacao', 'email', 'nome', 'perfil', 'senha']);
});

test('nome passa de 120 caracteres', () => {
  assert.ok(validarFormularioUsuario({ ...valido, nome: 'a'.repeat(121) }).nome);
  assert.equal(validarFormularioUsuario({ ...valido, nome: 'a'.repeat(120) }).nome, undefined);
});

test('e-mail precisa ter formato válido', () => {
  assert.ok(validarFormularioUsuario({ ...valido, email: 'ana@newe' }).email);
  assert.equal(validarFormularioUsuario({ ...valido, email: ' ana@newe.com.br ' }).email, undefined);
});

test('senha precisa de no mínimo 8 caracteres', () => {
  const erros = validarFormularioUsuario({ ...valido, senha: '1234567', confirmacao: '1234567' });
  assert.match(erros.senha, /8 caracteres/);
});

test('confirmação precisa ser igual à senha', () => {
  const erros = validarFormularioUsuario({ ...valido, confirmacao: 'segredo124' });
  assert.equal(erros.confirmacao, 'As senhas não conferem.');
});
