import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { buscarFrota, buscarResumoFrota } from './frotaService.ts';

const fetchOriginal = globalThis.fetch;
afterEach(() => { globalThis.fetch = fetchOriginal; });

function responder(corpo, status = 200) {
  const chamadas = [];
  globalThis.fetch = async (url) => {
    chamadas.push(String(url));
    return new Response(JSON.stringify(corpo), { status });
  };
  return chamadas;
}

function responderDepois(chamadas, corpo) {
  const anterior = globalThis.fetch;
  let primeira = true;
  globalThis.fetch = async (url) => {
    if (primeira) {
      primeira = false;
      return anterior(url);
    }
    chamadas.push(String(url));
    return new Response(JSON.stringify(corpo), { status: 200 });
  };
}

const PAGINA = {
  itens: [{
    id: 1,
    placa: 'EKO-2F09',
    tipo: 'TRUCK',
    marca: 'Volvo',
    modelo: 'VM260',
    combustivel: 'DIESEL',
    motorista: 'Jose Hilton',
    atualizadoEm: '2026-11-18T10:30:00',
    dadosAdicionais: { Cor: 'Branca', Vazio: '  ', Numero: 3 },
  }],
  pagina: 0,
  tamanho: 20,
  totalItens: 1,
  totalPaginas: 1,
};

const RESUMO = {
  possuiDados: true,
  totalVeiculos: 5,
  veiculosSemMotorista: 2,
  motoristasComVeiculo: 2,
  porTipo: [{ tipo: 'TRUCK', quantidade: 3 }, { tipo: 'NAO_IDENTIFICADO', quantidade: 2 }],
  porCombustivel: [{ combustivel: 'DIESEL', quantidade: 2, percentual: 40.0 }],
  porMarca: [{ marca: 'VOLVO', quantidade: 1 }],
};

test('lista a frota com paginação padrão e sem filtros vazios', async () => {
  const chamadas = responder(PAGINA);

  const pagina = await buscarFrota({ tipo: ' ', busca: '' });

  assert.equal(chamadas[0], '/api/operacional/veiculos/frota?pagina=0&tamanho=20');
  assert.deepEqual(pagina.itens[0].dadosAdicionais, { Cor: 'Branca' });
  assert.equal(pagina.itens[0].motorista, 'Jose Hilton');
});

test('envia página, tamanho, tipo e busca', async () => {
  const chamadas = responder({ ...PAGINA, itens: [], pagina: 2 });

  await buscarFrota({ pagina: 2, tamanho: 10, tipo: 'NAO_IDENTIFICADO', busca: ' abc-1 ' });

  assert.equal(
    chamadas[0],
    '/api/operacional/veiculos/frota?pagina=2&tamanho=10&tipo=NAO_IDENTIFICADO&busca=abc-1',
  );
});

test('campos opcionais ausentes viram null', async () => {
  responder({ ...PAGINA, itens: [{ id: 2, placa: 'HNF-5D31' }] });

  const [veiculo] = (await buscarFrota()).itens;

  assert.deepEqual(veiculo, {
    id: 2, placa: 'HNF-5D31', tipo: null, marca: null, modelo: null, combustivel: null,
    motorista: null, atualizadoEm: null, dadosAdicionais: {},
  });
});

test('página fora do contrato lança erro', async () => {
  responder({ itens: [{ id: 1 }], pagina: 0, tamanho: 20, totalItens: 1, totalPaginas: 1 });

  await assert.rejects(buscarFrota(), /resposta do serviço está inválida/);
});

test('erro HTTP na listagem vira mensagem em português', async () => {
  responder({ erro: 'x' }, 403);

  await assert.rejects(buscarFrota(), /Não foi possível carregar os veículos/);
});

test('envia o período quando as duas datas existem', async () => {
  const chamadas = responder(PAGINA);
  responderDepois(chamadas, RESUMO);

  await buscarFrota({ dataInicio: '01/09/2026', dataFim: '30/09/2026' });
  await buscarResumoFrota({ dataInicio: '01/09/2026', dataFim: '30/09/2026' });

  assert.equal(chamadas[0], '/api/operacional/veiculos/frota?pagina=0&tamanho=20&dataInicio=01%2F09%2F2026&dataFim=30%2F09%2F2026');
  assert.equal(chamadas[1], '/api/operacional/veiculos/resumo?dataInicio=01%2F09%2F2026&dataFim=30%2F09%2F2026');
});

test('converte o resumo para o formato da tela', async () => {
  const chamadas = responder(RESUMO);

  const resumo = await buscarResumoFrota();

  assert.equal(chamadas[0], '/api/operacional/veiculos/resumo');
  assert.deepEqual(resumo.porTipo[1], { nome: 'NAO_IDENTIFICADO', quantidade: 2 });
  assert.deepEqual(resumo.porCombustivel, [{ nome: 'DIESEL', quantidade: 2, percentual: 40 }]);
  assert.deepEqual(resumo.porMarca, [{ nome: 'VOLVO', quantidade: 1 }]);
});

test('resumo sem dados é estado normal', async () => {
  responder({
    possuiDados: false, totalVeiculos: 0, veiculosSemMotorista: 0, motoristasComVeiculo: 0,
    porTipo: [], porCombustivel: [], porMarca: [],
  });

  const resumo = await buscarResumoFrota();

  assert.equal(resumo.possuiDados, false);
  assert.deepEqual(resumo.porTipo, []);
});

test('resumo fora do contrato lança erro', async () => {
  responder({ ...RESUMO, porCombustivel: [{ combustivel: 'DIESEL', quantidade: 2 }] });

  await assert.rejects(buscarResumoFrota(), /resposta do serviço está inválida/);
});
