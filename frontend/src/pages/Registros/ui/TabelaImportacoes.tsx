import type { ImportacaoHistorico, ResumoImportacoes } from "@entities/importacao";
import { StatusImportacaoBadge } from "@entities/importacao";
import {
  LABEL_TIPO,
  formatarData,
  formatarDataHora,
  usuarioDaImportacao,
} from "../lib/formatarRegistro";

interface TabelaImportacoesProps {
  /** Linhas da página atual. */
  linhas: ImportacaoHistorico[];
}

const CABECALHO = "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-fg-muted";
const CELULA = "px-4 py-3 align-top";

function CelulaResumo({ resumo }: { resumo: ResumoImportacoes }) {
  const itens: [string, number][] = [
    ["Criados", resumo.criados],
    ["Atualizados", resumo.atualizados],
    ["Ignorados", resumo.ignorados],
    ["Rejeitados", resumo.rejeitados],
  ];

  return (
    <span className="flex flex-wrap gap-x-3 gap-y-1 text-xs tabular-nums text-fg-muted">
      {itens.map(([rotulo, valor]) => (
        <span key={rotulo}>
          {rotulo} <b className="font-semibold text-fg">{valor}</b>
        </span>
      ))}
    </span>
  );
}

/** Selo mostrado quando o mesmo conteúdo de arquivo já foi importado antes. */
function SeloReimportacao({ data }: { data: Date }) {
  return (
    <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
      Mesmo arquivo da importação de {formatarData(data)}
    </span>
  );
}

/**
 * Tabela do histórico. Em telas estreitas as mesmas linhas viram cartões,
 * para não exigir rolagem horizontal.
 */
export function TabelaImportacoes({ linhas }: TabelaImportacoesProps) {
  return (
    <>
      <div className="hidden overflow-x-auto rounded-md bg-surface md:block">
        <table className="w-full min-w-[860px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className={CABECALHO}>Data e hora</th>
              <th className={CABECALHO}>Tipo</th>
              <th className={CABECALHO}>Arquivo</th>
              <th className={CABECALHO}>Usuário</th>
              <th className={CABECALHO}>Status</th>
              <th className={CABECALHO}>Resumo</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((linha) => (
              <tr key={linha.chave} className="border-b border-border last:border-0">
                <td className={`${CELULA} whitespace-nowrap tabular-nums text-fg`}>
                  {formatarDataHora(linha.dataHora)}
                </td>
                <td className={CELULA}>{LABEL_TIPO[linha.tipo]}</td>
                <td className={CELULA}>
                  <div className="flex max-w-[240px] flex-col gap-1.5">
                    <span className="break-all text-fg">{linha.arquivo}</span>
                    {linha.reimportacaoDe && <SeloReimportacao data={linha.reimportacaoDe} />}
                  </div>
                </td>
                <td className={`${CELULA} text-fg-muted`}>{usuarioDaImportacao(linha)}</td>
                <td className={CELULA}>
                  <StatusImportacaoBadge status={linha.status} />
                </td>
                <td className={CELULA}>
                  <CelulaResumo resumo={linha.resumo} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="flex flex-col gap-3 md:hidden">
        {linhas.map((linha) => (
          <li key={linha.chave} className="flex flex-col gap-2 rounded-md bg-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <span className="text-sm font-semibold tabular-nums text-fg">
                {formatarDataHora(linha.dataHora)}
              </span>
              <StatusImportacaoBadge status={linha.status} />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-fg-muted">
              <span className="rounded-full bg-border px-2.5 py-0.5 font-semibold text-fg">
                {LABEL_TIPO[linha.tipo]}
              </span>
              <span>{usuarioDaImportacao(linha)}</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="break-all text-sm text-fg">{linha.arquivo}</span>
              {linha.reimportacaoDe && <SeloReimportacao data={linha.reimportacaoDe} />}
            </div>

            <CelulaResumo resumo={linha.resumo} />
          </li>
        ))}
      </ul>
    </>
  );
}
