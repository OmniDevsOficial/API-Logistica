import { validarArquivoRelatorio } from '../lib/validarArquivoRelatorio.ts';

// INTEGRAÇÃO REAL: o operacional recebe o arquivo, chama o serviço de
// processamento e retorna List<Viagem> após saveAll. Não há mock neste fluxo.
const ENDPOINT = '/api/operacional/viagens/importar-manifesto';
const TEMPO_LIMITE_MS = 60_000;
const RESULTADO_INCERTO = 'Não foi possível confirmar a importação. Confira os registros de viagens antes de reenviar o arquivo, para evitar duplicidades.';

interface ViagemImportada {
  id: number;
  manifesto: string;
}

export interface ResultadoImportacao {
  viagensImportadas: number;
}

// Apenas mensagens controladas pelo frontend são apresentadas ao operador.
// Não expor stack traces, HTML do proxy ou mensagens técnicas do banco.
export class ErroImportacao extends Error {}

export function mensagemErroImportacao(erro: unknown): string {
  return erro instanceof ErroImportacao ? erro.message : RESULTADO_INCERTO;
}

function validarResposta(dados: unknown): dados is ViagemImportada[] {
  return Array.isArray(dados) && dados.every((item) =>
    item !== null && typeof item === 'object' && !Array.isArray(item)
    && Number.isInteger(item.id) && item.id > 0
    && typeof item.manifesto === 'string' && item.manifesto.trim() !== '',
  );
}

export async function importarManifesto(arquivo: File): Promise<ResultadoImportacao> {
  const validacao = validarArquivoRelatorio(arquivo);
  if (!validacao.valido) throw new ErroImportacao(validacao.mensagemErro);

  const formulario = new FormData();
  formulario.append('file', arquivo);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TEMPO_LIMITE_MS);

  try {
    // O navegador define Content-Type e boundary do multipart automaticamente.
    const resposta = await fetch(ENDPOINT, {
      method: 'POST',
      body: formulario,
      signal: controller.signal,
    });

    if (!resposta.ok) {
      if ([400, 415, 422].includes(resposta.status)) {
        throw new ErroImportacao('O manifesto está inválido ou incompleto. Confira o formato e os campos Manifesto, CPF, Data e Valor Frete.');
      }
      if (resposta.status === 413) {
        // O backend atual pode aplicar um limite menor que 10 MB por configuração.
        throw new ErroImportacao('O servidor recusou o tamanho do arquivo. O limite previsto é 10 MB; se o arquivo for menor, avise o responsável pelo sistema.');
      }
      if ([401, 403].includes(resposta.status)) {
        throw new ErroImportacao('Você não tem acesso à importação no momento. Entre em contato com o responsável pelo sistema.');
      }
      if (resposta.status === 404) {
        throw new ErroImportacao('A importação ainda não está disponível neste ambiente. Avise o responsável pelo sistema.');
      }
      if (resposta.status === 409) {
        throw new ErroImportacao('A importação entrou em conflito com registros existentes. Confira as viagens antes de reenviar.');
      }
      if (resposta.status === 429) {
        throw new ErroImportacao('Há muitas solicitações no momento. Aguarde um pouco antes de tentar novamente.');
      }
      // Erro 500 também pode representar validação ainda não tratada pelo backend.
      // Sem confirmação, não afirmar que nada foi gravado nem repetir o POST.
      throw new ErroImportacao(`O serviço não conseguiu confirmar o resultado. Confira os registros de viagens antes de reenviar e, se necessário, avise o responsável pelo sistema.`);
    }

    const dados: unknown = await resposta.json();
    if (!validarResposta(dados)) throw new ErroImportacao(RESULTADO_INCERTO);
    if (dados.length === 0) {
      throw new ErroImportacao('Nenhuma viagem foi importada. Verifique se o manifesto contém linhas de dados.');
    }

    // Conta as entidades retornadas pela gravação, não as linhas do arquivo original.
    return { viagensImportadas: dados.length };
  } catch (erro) {
    if (erro instanceof ErroImportacao) throw erro;
    if (controller.signal.aborted) {
      throw new ErroImportacao(`O serviço demorou a responder. ${RESULTADO_INCERTO}`);
    }
    throw new ErroImportacao(`A conexão falhou ou a resposta não pôde ser lida. ${RESULTADO_INCERTO}`);
  } finally {
    clearTimeout(timeout);
  }
}
