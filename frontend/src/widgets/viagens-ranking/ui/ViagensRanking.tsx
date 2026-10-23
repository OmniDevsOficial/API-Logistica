import { ViagemRankingItem } from "@entities/viagem";
import { useRankingDestinos } from "../model/useRankingDestinos";

interface ViagensRankingProps {
  /** Período do ranking no formato dd/MM/aaaa, o mesmo selecionado na tela. */
  dataInicio: string;
  dataFim: string;
}

const ESTADO = "py-4 text-center text-sm text-fg-subtle";

export function ViagensRanking({ dataInicio, dataFim }: ViagensRankingProps) {
  const { ranking, carregando, erro } = useRankingDestinos(dataInicio, dataFim);

  function conteudo() {
    if (erro) return <p role="alert" className={ESTADO}>{erro}</p>;
    if (carregando) return <p role="status" className={ESTADO}>Carregando ranking…</p>;
    if (ranking.length === 0) {
      return <p className={ESTADO}>Nenhuma viagem com dados financeiros neste período.</p>;
    }

    return (
      <div className="flex flex-col divide-y divide-border">
        {ranking.map((destino, index) => (
          <ViagemRankingItem
            key={`${destino.origem ?? ""}|${destino.destino}`}
            posicao={index + 1}
            destino={destino}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-2 rounded-md bg-surface p-6">
      <h2 className="text-[15px] font-semibold text-fg">
        Viagens mais concorridas
      </h2>
      {conteudo()}
    </div>
  );
}
