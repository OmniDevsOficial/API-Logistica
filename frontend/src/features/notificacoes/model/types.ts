export type TipoNotificacao = "utilizacao" | "importacao" | "usuario";

export type TomNotificacao = "alerta" | "sucesso" | "aviso" | "erro" | "info";

export interface Notificacao {
  chave: string;
  tipo: TipoNotificacao;
  tom: TomNotificacao;
  titulo: string;
  detalhe: string | null;
  data: Date | null;
}
