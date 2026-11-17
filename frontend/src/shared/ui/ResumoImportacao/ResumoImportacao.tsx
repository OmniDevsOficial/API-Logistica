// src/shared/ui/ResumoImportacao/ResumoImportacao.tsx

/** Contador exibido em card no topo do resumo. */
export interface CardResumoImportacao {
  rotulo: string;
  valor: number;
  /** Destaca o card em vermelho (ex.: linhas rejeitadas). */
  destaque?: boolean;
}

/** Linha de uma tabela de ocorrências (rejeição ou aviso). */
export interface OcorrenciaImportacao {
  /** Linha da planilha; nulo quando o backend não informa. */
  linha: number | null;
  /** Identificador da linha na planilha (placa, manifesto...). */
  chave: string | null;
  mensagem: string;
}

/** Tabela de ocorrências; não é renderizada quando vazia. */
export interface TabelaResumoImportacao {
  titulo: string;
  /** Cabeçalho da coluna de identificação ("Placa", "Manifesto"). */
  colunaChave: string;
  /** Cabeçalho da coluna de texto ("Motivo", "Aviso"). */
  colunaMensagem: string;
  tom: "erro" | "aviso";
  ocorrencias: OcorrenciaImportacao[];
}

export interface ResumoImportacaoProps {
  mensagem: string;
  cards: CardResumoImportacao[];
  tabelas: TabelaResumoImportacao[];
}

const SEM_VALOR = "—";

function TabelaOcorrencias({
  titulo,
  colunaChave,
  colunaMensagem,
  tom,
  ocorrencias,
}: TabelaResumoImportacao) {
  if (ocorrencias.length === 0) return null;
  const cor =
    tom === "erro"
      ? "text-red-700 dark:text-red-400"
      : "text-amber-800 dark:text-amber-300";

  return (
    <section className="flex flex-col gap-2">
      <h3 className={`m-0 text-sm font-semibold ${cor}`}>{titulo}</h3>
      <div className="max-h-60 overflow-y-auto rounded-lg border border-border">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="sticky top-0 bg-background">
            <tr className="text-xs text-fg-muted">
              <th scope="col" className="w-16 px-3 py-2 font-semibold">Linha</th>
              <th scope="col" className="w-24 px-3 py-2 font-semibold">{colunaChave}</th>
              <th scope="col" className="px-3 py-2 font-semibold">{colunaMensagem}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ocorrencias.map((ocorrencia, indice) => (
              <tr key={`${indice}-${ocorrencia.linha}-${ocorrencia.chave}`}>
                <td className="px-3 py-2 align-top text-fg-muted">
                  {ocorrencia.linha ?? SEM_VALOR}
                </td>
                <td className="px-3 py-2 align-top font-mono text-fg">
                  {ocorrencia.chave ?? SEM_VALOR}
                </td>
                <td className="px-3 py-2 align-top text-fg">{ocorrencia.mensagem}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/**
 * Resultado de uma importação de planilha: mensagem, contadores em cards e
 * tabelas de linhas rejeitadas/avisos. Padrão comum aos modais de importação.
 */
export function ResumoImportacao({ mensagem, cards, tabelas }: ResumoImportacaoProps) {
  const colunas = cards.length >= 4 ? "sm:grid-cols-4" : "sm:grid-cols-3";

  return (
    <div className="flex flex-col gap-4" role="status" aria-live="polite">
      <p className="m-0 text-sm text-fg-muted">{mensagem}</p>

      <dl className={`m-0 grid grid-cols-2 gap-3 ${colunas}`}>
        {cards.map((card) => (
          <div
            key={card.rotulo}
            className={`rounded-lg border px-3 py-2 ${
              card.destaque
                ? "border-red-300 bg-red-50 dark:border-red-500/40 dark:bg-red-500/10"
                : "border-border"
            }`}
          >
            <dt
              className={`text-xs ${card.destaque ? "text-red-700 dark:text-red-400" : "text-fg-muted"}`}
            >
              {card.rotulo}
            </dt>
            <dd
              className={`m-0 text-lg font-semibold ${card.destaque ? "text-red-700 dark:text-red-400" : "text-fg"}`}
            >
              {card.valor}
            </dd>
          </div>
        ))}
      </dl>

      {tabelas.map((tabela) => (
        <TabelaOcorrencias key={tabela.titulo} {...tabela} />
      ))}
    </div>
  );
}
