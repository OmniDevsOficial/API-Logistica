import type { AlertaUtilizacao } from "@entities/motorista";
import type {
  ImportacaoHistorico,
  StatusImportacao,
  TipoImportacao,
} from "@entities/importacao";
import type { Perfil } from "@entities/sessao";
import type { Usuario } from "@entities/usuario";
import type { Notificacao, TomNotificacao } from "../model/types.ts";
import { mensagemAlerta } from "./mensagemAlerta.ts";

export const DIAS_RECENTES = 7;

const TITULO_IMPORTACAO: Record<TipoImportacao, Record<StatusImportacao, string>> = {
  manifesto: {
    sucesso: "Manifesto importado",
    parcial: "Manifesto importado com rejeições",
    erro: "Falha ao importar manifesto",
  },
  veiculos: {
    sucesso: "Planilha de veículos importada",
    parcial: "Planilha de veículos importada com rejeições",
    erro: "Falha ao importar planilha de veículos",
  },
};

const TOM_IMPORTACAO: Record<StatusImportacao, TomNotificacao> = {
  sucesso: "sucesso",
  parcial: "aviso",
  erro: "erro",
};

const ROTULO_PERFIL: Record<Perfil, string> = {
  GESTOR: "Gestor",
  OPERADOR: "Operador",
};

export function inicioJanelaRecente(agora: Date): Date {
  const inicio = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  inicio.setDate(inicio.getDate() - (DIAS_RECENTES - 1));
  return inicio;
}

export function notificacaoDeImportacao(importacao: ImportacaoHistorico): Notificacao {
  return {
    chave: `importacao:${importacao.chave}`,
    tipo: "importacao",
    tom: TOM_IMPORTACAO[importacao.status],
    titulo: TITULO_IMPORTACAO[importacao.tipo][importacao.status],
    detalhe: importacao.usuario
      ? `${importacao.arquivo} · por ${importacao.usuario}`
      : importacao.arquivo,
    data: importacao.dataHora,
  };
}

export function notificacaoDeUsuario(usuario: Usuario): Notificacao {
  return {
    chave: `usuario:${usuario.id}`,
    tipo: "usuario",
    tom: "info",
    titulo: "Novo usuário cadastrado",
    detalhe: `${usuario.nome} · ${ROTULO_PERFIL[usuario.perfil]}`,
    data: new Date(usuario.criadoEm),
  };
}

export function notificacaoDeAlerta(alerta: AlertaUtilizacao): Notificacao {
  return {
    chave: `utilizacao:${alerta.id}:${alerta.percentual}`,
    tipo: "utilizacao",
    tom: "alerta",
    titulo: mensagemAlerta(alerta),
    detalhe: null,
    data: null,
  };
}

interface FontesNotificacoes {
  alertas: AlertaUtilizacao[];
  importacoes: ImportacaoHistorico[];
  usuarios: Usuario[];
  desde: Date;
}

export function montarNotificacoes({
  alertas,
  importacoes,
  usuarios,
  desde,
}: FontesNotificacoes): Notificacao[] {
  const eventos = [
    ...importacoes.map(notificacaoDeImportacao),
    ...usuarios.map(notificacaoDeUsuario),
  ]
    .filter((evento) => evento.data !== null && evento.data.getTime() >= desde.getTime())
    .sort((a, b) => (b.data?.getTime() ?? 0) - (a.data?.getTime() ?? 0));

  return [...alertas.map(notificacaoDeAlerta), ...eventos];
}

const HORA = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" });
const DIA = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" });

function mesmoDia(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatarQuando(data: Date, agora: Date): string {
  const ontem = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() - 1);
  const hora = HORA.format(data);
  if (mesmoDia(data, agora)) return `Hoje às ${hora}`;
  if (mesmoDia(data, ontem)) return `Ontem às ${hora}`;
  return `${DIA.format(data)} às ${hora}`;
}
