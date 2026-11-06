import { apiFetch } from "../../../shared/api/apiFetch.ts";
import { validarArquivoVeiculos } from "../lib/validarArquivoVeiculos.ts";

// Gestor e operador importam. A importação atualiza pela placa e não duplica
// veículos nem motoristas, então reenviar o mesmo arquivo é seguro.
const ENDPOINT = "/api/operacional/veiculos/importacao";
const TEMPO_LIMITE_MS = 60_000;
const RESULTADO_INCERTO =
  "Não foi possível confirmar a importação. Reenviar o arquivo é seguro: os veículos são atualizados sem duplicar.";
const FALHA_DE_REDE = "Não foi possível enviar o arquivo.";

/** Linha rejeitada (erro) ou gravada com ressalva (aviso). */
export interface OcorrenciaLinha {
  linha: number;
  placa: string | null;
  mensagem: string;
}

export interface ResultadoImportacaoVeiculos {
  totalLinhas: number;
  veiculosCadastrados: number;
  veiculosAtualizados: number;
  motoristasCadastrados: number;
  veiculosSemMotorista: number;
  linhasComErro: number;
  erros: OcorrenciaLinha[];
  avisos: OcorrenciaLinha[];
}

// Só mensagens controladas chegam ao usuário: as do frontend e o campo "erro"
// do backend nas respostas 400/409, que são escritas para o usuário final.
export class ErroImportacaoVeiculos extends Error {
  /**
   * Indica que reenviar o mesmo arquivo pode resolver (rede, servidor,
   * conflito). Erros do arquivo (400) exigem corrigir a planilha antes.
   */
  readonly podeTentarDeNovo: boolean;

  constructor(mensagem: string | undefined, podeTentarDeNovo = false) {
    super(mensagem);
    this.podeTentarDeNovo = podeTentarDeNovo;
  }
}

export function mensagemErroImportacaoVeiculos(erro: unknown): string {
  return erro instanceof ErroImportacaoVeiculos ? erro.message : RESULTADO_INCERTO;
}

/** Erro desconhecido também permite tentar de novo: a importação é idempotente. */
export function podeTentarDeNovo(erro: unknown): boolean {
  return erro instanceof ErroImportacaoVeiculos ? erro.podeTentarDeNovo : true;
}

const CONTADORES = [
  "totalLinhas",
  "veiculosCadastrados",
  "veiculosAtualizados",
  "motoristasCadastrados",
  "veiculosSemMotorista",
  "linhasComErro",
] as const;

function ehOcorrencia(item: unknown): item is OcorrenciaLinha {
  if (item === null || typeof item !== "object") return false;
  const ocorrencia = item as Record<string, unknown>;
  return (
    Number.isInteger(ocorrencia.linha) &&
    typeof ocorrencia.mensagem === "string" &&
    (ocorrencia.placa === null || ocorrencia.placa === undefined || typeof ocorrencia.placa === "string")
  );
}

function lerResultado(dados: unknown): ResultadoImportacaoVeiculos | null {
  if (dados === null || typeof dados !== "object" || Array.isArray(dados)) return null;
  const resposta = dados as Record<string, unknown>;
  const contadoresValidos = CONTADORES.every(
    (campo) => Number.isInteger(resposta[campo]) && (resposta[campo] as number) >= 0,
  );
  if (!contadoresValidos) return null;
  if (!Array.isArray(resposta.erros) || !resposta.erros.every(ehOcorrencia)) return null;
  if (!Array.isArray(resposta.avisos) || !resposta.avisos.every(ehOcorrencia)) return null;

  const normalizar = (ocorrencia: OcorrenciaLinha): OcorrenciaLinha => ({
    linha: ocorrencia.linha,
    placa: ocorrencia.placa ?? null,
    mensagem: ocorrencia.mensagem,
  });

  return {
    totalLinhas: resposta.totalLinhas as number,
    veiculosCadastrados: resposta.veiculosCadastrados as number,
    veiculosAtualizados: resposta.veiculosAtualizados as number,
    motoristasCadastrados: resposta.motoristasCadastrados as number,
    veiculosSemMotorista: resposta.veiculosSemMotorista as number,
    linhasComErro: resposta.linhasComErro as number,
    erros: (resposta.erros as OcorrenciaLinha[]).map(normalizar),
    avisos: (resposta.avisos as OcorrenciaLinha[]).map(normalizar),
  };
}

async function mensagemDoBackend(resposta: Response): Promise<string | null> {
  try {
    const corpo: unknown = await resposta.json();
    const erro = (corpo as Record<string, unknown> | null)?.erro;
    return typeof erro === "string" && erro.trim() !== "" ? erro : null;
  } catch {
    return null;
  }
}

/**
 * Envia o CSV de veículos. Linhas inválidas não fazem a importação falhar:
 * elas voltam em `erros` no resultado.
 */
export async function importarVeiculos(arquivo: File): Promise<ResultadoImportacaoVeiculos> {
  const validacao = validarArquivoVeiculos(arquivo);
  if (!validacao.valido) throw new ErroImportacaoVeiculos(validacao.mensagemErro);

  const formulario = new FormData();
  formulario.append("file", arquivo);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TEMPO_LIMITE_MS);

  try {
    // O navegador define Content-Type e boundary do multipart automaticamente.
    const resposta = await apiFetch(ENDPOINT, {
      method: "POST",
      body: formulario,
      signal: controller.signal,
    });

    if (!resposta.ok) {
      if (resposta.status === 400) {
        throw new ErroImportacaoVeiculos(
          (await mensagemDoBackend(resposta)) ??
            "A planilha de veículos está inválida. Confira se é um CSV com as colunas Placa e Tipo Veículo.",
        );
      }
      if (resposta.status === 413) {
        throw new ErroImportacaoVeiculos("O arquivo excede o tamanho máximo permitido (10MB).");
      }
      if ([401, 403].includes(resposta.status)) {
        throw new ErroImportacaoVeiculos(
          "Você não tem acesso à importação de veículos. Entre novamente ou fale com o responsável pelo sistema.",
        );
      }
      if (resposta.status === 404) {
        throw new ErroImportacaoVeiculos(
          "A importação de veículos ainda não está disponível neste ambiente. Avise o responsável pelo sistema.",
        );
      }
      if (resposta.status === 409) {
        throw new ErroImportacaoVeiculos(
          (await mensagemDoBackend(resposta)) ??
            "Outra importação alterou os mesmos veículos ao mesmo tempo. Envie o arquivo novamente.",
          true,
        );
      }
      throw new ErroImportacaoVeiculos(RESULTADO_INCERTO, true);
    }

    // Corpo ilegível não é falha de rede: o servidor respondeu e pode ter gravado.
    const resultado = lerResultado(await resposta.json().catch(() => null));
    if (!resultado) throw new ErroImportacaoVeiculos(RESULTADO_INCERTO, true);
    return resultado;
  } catch (erro) {
    if (erro instanceof ErroImportacaoVeiculos) throw erro;
    if (controller.signal.aborted) {
      throw new ErroImportacaoVeiculos(`${FALHA_DE_REDE} O serviço demorou a responder.`, true);
    }
    // fetch só rejeita sem resposta HTTP: conexão caiu, servidor fora do ar ou bloqueio de rede.
    throw new ErroImportacaoVeiculos(`${FALHA_DE_REDE} Verifique sua conexão.`, true);
  } finally {
    clearTimeout(timeout);
  }
}
