import type { FiltroRanking, RankingColocacao } from "@entities/motorista";
import { ValorMonetario } from "@entities/sessao";
import { formatCpf, formatCurrencyBRL } from "@shared/lib";

interface RankingListProps {
  motoristas: RankingColocacao[];
  filtroAtivo: FiltroRanking;
  onMotoristaClick?: (motoristaId: number) => void;
}

const HEADER_CELL = "whitespace-nowrap py-3 pr-6 text-left text-xs font-semibold text-fg-muted";
const CELL = "py-4 pr-6 align-top";
const REALCE_HEADER = "bg-primary/10 text-primary";
const REALCE_CELL = "bg-primary/5";

export function RankingList({ motoristas, filtroAtivo, onMotoristaClick }: RankingListProps) {
  if (motoristas.length === 0) {
    return (
      <div className="overflow-hidden rounded-lg bg-surface">
        <h2 className="px-6 pb-4 pt-5 text-lg font-semibold text-fg">Equipe de motoristas</h2>
        <p className="border-t border-border px-6 py-8 text-center text-sm text-fg-subtle">
          Nenhum motorista encontrado.
        </p>
      </div>
    );
  }

  const destacarViagens = filtroAtivo === "VIAGENS";
  const destacarRentabilidade = filtroAtivo === "RENTABILIDADE" || filtroAtivo === "TIPO_VEICULO";
  const destacarFaturamento = filtroAtivo === "FATURAMENTO";

  return (
    <div className="overflow-hidden rounded-lg bg-surface">
      <h2 className="px-6 pb-4 pt-5 text-lg font-semibold text-fg">Equipe de motoristas</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[840px] table-fixed">
          <colgroup>
            <col className="w-[28%]" /><col className="w-[20%]" /><col className="w-[12%]" />
            <col className="w-[20%]" /><col className="w-[20%]" />
          </colgroup>
          <thead>
            <tr className="border-y border-border">
              <th className={`${HEADER_CELL} pl-6`} scope="col">Motorista</th>
              <th className={HEADER_CELL} scope="col">Veículo/Placa</th>
              <th className={`${HEADER_CELL} ${destacarViagens ? REALCE_HEADER : ""}`} scope="col">Viagens</th>
              <th className={`${HEADER_CELL} text-right ${destacarRentabilidade ? REALCE_HEADER : ""}`} scope="col">Rentabilidade</th>
              <th className={`${HEADER_CELL} text-right ${destacarFaturamento ? REALCE_HEADER : ""}`} scope="col">Faturamento</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {motoristas.map(({ posicao, motorista }) => {
              const id = motorista.motoristaId;
              const selecionar = onMotoristaClick && id !== null
                ? () => onMotoristaClick(id)
                : undefined;
              return (
                <tr key={posicao} onClick={selecionar} className={selecionar ? "cursor-pointer hover:bg-background" : undefined}>
                  <td className={`${CELL} pl-6`}>
                    <div className="flex flex-col">
                      {selecionar ? (
                        <button type="button" className="cursor-pointer text-left text-sm font-semibold text-fg hover:text-primary" onClick={(e) => { e.stopPropagation(); selecionar(); }}>
                          {motorista.nome}
                        </button>
                      ) : <span className="text-sm font-semibold text-fg">{motorista.nome}</span>}
                      <span className="text-xs text-fg-muted">{motorista.telefone ?? formatCpf(motorista.cpf) ?? "—"}</span>
                    </div>
                  </td>
                  <td className={CELL}>
                    <div className="flex flex-col">
                      <span className="text-sm text-fg">{motorista.veiculo ?? "-"}</span>
                      <span className="text-xs text-fg-muted">{motorista.placa ?? "-"}</span>
                    </div>
                  </td>
                  <td className={`${CELL} ${destacarViagens ? REALCE_CELL : ""}`}>
                    <span className={`text-sm ${destacarViagens ? "font-semibold text-primary" : "text-fg"}`}>{motorista.viagens}</span>
                  </td>
                  <td className={`${CELL} text-right ${destacarRentabilidade ? REALCE_CELL : ""}`}>
                    <ValorMonetario className={`whitespace-nowrap text-sm ${destacarRentabilidade ? "font-semibold text-primary" : "font-medium text-fg"}`}>
                      {motorista.rentabilidadeMedia === null ? null : formatCurrencyBRL(motorista.rentabilidadeMedia, 2)}
                    </ValorMonetario>
                  </td>
                  <td className={`${CELL} text-right ${destacarFaturamento ? REALCE_CELL : ""}`}>
                    <ValorMonetario className={`whitespace-nowrap text-sm ${destacarFaturamento ? "font-semibold text-primary" : "font-medium text-fg"}`}>
                      {motorista.faturamento === null ? null : formatCurrencyBRL(motorista.faturamento, 2)}
                    </ValorMonetario>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
