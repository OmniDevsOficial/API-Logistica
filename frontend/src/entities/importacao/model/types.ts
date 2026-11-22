/**
 * Origem de uma importação. Manifesto são as viagens vindas da planilha de
 * manifesto; veículos é a planilha da frota.
 */
export type TipoImportacao = "manifesto" | "veiculos";

/** Situação da importação: sucesso, parcial (alguma linha rejeitada) ou erro. */
export type StatusImportacao = "sucesso" | "parcial" | "erro";

/** Contagens exibidas na coluna de resumo da tabela de registros. */
export interface ResumoImportacoes {
  criados: number;
  atualizados: number;
  ignorados: number;
  rejeitados: number;
}

/** Uma importação registrada no histórico. */
export interface ImportacaoHistorico {
  /**
   * Chave da linha na tela: o id numérico vem de consultas separadas e pode
   * repetir entre os dois tipos, então a chave é tipo + id.
   */
  chave: string;
  id: number;
  tipo: TipoImportacao;
  dataHora: Date;
  arquivo: string;
  usuario: string | null;
  status: StatusImportacao;
  resumo: ResumoImportacoes;
  /** Quando houve a importação anterior do mesmo arquivo (reimportação). */
  reimportacaoDe: Date | null;
}

/** Tipo do filtro da tela; "todos" consulta as duas origens. */
export type FiltroTipoImportacao = "todos" | TipoImportacao;

/** Status do filtro da tela; "todos" não vai no parâmetro da requisição. */
export type FiltroStatusImportacao = "todos" | StatusImportacao;
