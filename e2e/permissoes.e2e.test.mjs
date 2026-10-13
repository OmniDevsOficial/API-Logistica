import { test, before } from "node:test";
import assert from "node:assert/strict";

const BASE = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const GESTOR = {
  email: process.env.E2E_GESTOR_EMAIL ?? "gestor@newe.com.br",
  senha: process.env.E2E_GESTOR_SENHA ?? "Gestor@123",
};
const OPERADOR = {
  email: process.env.E2E_OPERADOR_EMAIL ?? "operador@newe.com.br",
  senha: process.env.E2E_OPERADOR_SENHA ?? "Operador@123",
};

const VIAGENS = "/api/operacional/viagens";
const DASHBOARD = "/api/operacional/dashboard?dataInicio=01/09/2026&dataFim=30/09/2026";
const UTILIZACAO = "/api/operacional/indicadores/utilizacao?dataInicio=01/09/2026&dataFim=30/09/2026";
const UPLOAD_RELATORIO = "/api/relatorio/manifestos/upload";

function logar(credenciais) {
  return fetch(`${BASE}/api/autenticacao/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credenciais),
  });
}

async function obterToken(credenciais) {
  const resposta = await logar(credenciais);
  assert.equal(resposta.status, 200, `login de ${credenciais.email} deveria funcionar`);
  const { token } = await resposta.json();
  assert.equal(typeof token, "string");
  return token;
}

function consultar(caminho, token) {
  return fetch(`${BASE}${caminho}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

let tokenGestor;
let tokenOperador;

before(async () => {
  tokenGestor = await obterToken(GESTOR);
  tokenOperador = await obterToken(OPERADOR);
});

test("login com senha errada retorna 401", async () => {
  const resposta = await logar({ email: GESTOR.email, senha: "senha-errada" });
  assert.equal(resposta.status, 401);
});

test("operador acessa endpoint do proprio perfil", async () => {
  const resposta = await consultar(VIAGENS, tokenOperador);
  assert.equal(resposta.status, 200);
  assert.ok(Array.isArray(await resposta.json()));
});

test("operador e bloqueado nos endpoints do gestor", async () => {
  for (const caminho of [DASHBOARD, UTILIZACAO]) {
    const resposta = await consultar(caminho, tokenOperador);
    assert.equal(resposta.status, 403, caminho);
    assert.equal(typeof (await resposta.json()).erro, "string");
  }
});

test("gestor acessa os endpoints do proprio perfil", async () => {
  for (const caminho of [DASHBOARD, UTILIZACAO, VIAGENS]) {
    const resposta = await consultar(caminho, tokenGestor);
    assert.equal(resposta.status, 200, caminho);
  }
});

test("sem token os servicos respondem 401", async () => {
  for (const caminho of [VIAGENS, DASHBOARD]) {
    const resposta = await consultar(caminho);
    assert.equal(resposta.status, 401, caminho);
  }

  const upload = await fetch(`${BASE}${UPLOAD_RELATORIO}`, { method: "POST" });
  assert.equal(upload.status, 401, UPLOAD_RELATORIO);
});

test("token adulterado retorna 401", async () => {
  const [cabecalho, payload] = tokenGestor.split(".");
  const adulterado = `${cabecalho}.${payload}.assinatura-invalida`;

  const resposta = await consultar(VIAGENS, adulterado);
  assert.equal(resposta.status, 401);
});