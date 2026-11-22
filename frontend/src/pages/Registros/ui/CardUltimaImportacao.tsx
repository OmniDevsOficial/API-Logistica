import type { ImportacaoHistorico } from "@entities/importacao";
import { StatusImportacaoBadge } from "@entities/importacao";
import { formatarDataHora, usuarioDaImportacao } from "../lib/formatarRegistro";

interface CardUltimaImportacaoProps {
  titulo: string;
  importacao: ImportacaoHistorico | null;
  carregando: boolean;
}

/** Card do topo com a importação mais recente de um tipo. */
export function CardUltimaImportacao({
  titulo,
  importacao,
  carregando,
}: CardUltimaImportacaoProps) {
  return (
    <div className="flex flex-col gap-3 rounded-md bg-surface p-6">
      <span className="text-sm font-semibold text-fg-muted">{titulo}</span>

      {carregando && !importacao && (
        <span className="text-sm text-fg-subtle">Carregando…</span>
      )}

      {!carregando && !importacao && (
        <span className="text-sm text-fg-subtle">Nenhuma importação ainda</span>
      )}

      {importacao && (
        <>
          <span className="text-[22px] font-bold tracking-[-0.5px] text-fg tabular-nums">
            {formatarDataHora(importacao.dataHora)}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <StatusImportacaoBadge status={importacao.status} />
            <span className="text-sm text-fg-muted">{usuarioDaImportacao(importacao)}</span>
          </div>
          <span className="truncate text-sm text-fg-subtle" title={importacao.arquivo}>
            {importacao.arquivo}
          </span>
        </>
      )}
    </div>
  );
}
