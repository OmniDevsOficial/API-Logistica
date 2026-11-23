import type { FiltroRanking, RankingColocacao, RankingMotorista } from "@entities/motorista";
import { ValorMonetario } from "@entities/sessao";
import { formatCpf, formatCurrencyBRL } from "@shared/lib";

interface RankingListProps {
  /** Do 4º em diante, em ordem de posição. */
  motoristas: RankingColocacao[];
  /** Critério que determina a ordenação e a coluna destacada. */
  filtroAtivo: FiltroRanking;
  /** Valor a pagar no mês; omitido para perfis sem acesso financeiro. */
  faturamentoDe?: (motorista: RankingMotorista) => number | null;
  /** US17: abre o modal de detalhes do motorista. */
  onMotoristaClick?: (motoristaId: number) => void;
}

const HEADER_CELL = "whitespace-nowrap py-3 pr-6 text-left text-xs font-semibold text-fg-muted";
const CELL = "py-4 pr-6 align-top";
const REALCE_HEADER = "bg-primary/10 text-primary";
const REALCE_CELL = "bg-primary/5";

function formatarValor(valor: number | null): string | null {
  return valor === null ? null : formatCurrencyBRL(valor, 2);
}

export function RankingList({ motoristas, filtroAtivo, onMotoristaClick, faturamentoDe }: RankingListProps) {
  const exibirValorAPagar = faturamentoDe !== undefined;
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
        <table className={`w-full ${exibirValorAPagar ? "min-w-[1020px]" : "min-w-[840px]"} table-fixed`}>
          <colgroup>
            <col className={exibirValorAPagar ? "w-[24%]" : "w-[28%]"} />
            <col className={exibirValorAPagar ? "w-[18%]" : "w-[20%]"} />
            <col className={exibirValorAPagar ? "w-[10%]" : "w-[12%]"} />
            <col className={exibirValorAPagar ? "w-[16%]" : "w-[20%]"} />
            <col className={exibirValorAPagar ? "w-[16%]" : "w-[20%]"} />
            {exibirValorAPagar && <col className="w-[16%]" />}
          </colgroup>
          <thead>
            <tr className="border-y border-border">
              <th className={`${HEADER_CELL} pl-6`} scope="col">Motorista</th>
              <th className={HEADER_CELL} scope="col">Veículo/Placa</th>
              <th className={`${HEADER_CELL} ${destacarViagens ? REALCE_HEADER : ""}`} scope="col">Viagens</th>
              <th className={`${HEADER_CELL} text-right ${destacarRentabilidade ? REALCE_HEADER : ""}`} scope="col">Rentabilidade</th>
              <th className={`${HEADER_CELL} text-right ${destacarFaturamento ? REALCE_HEADER : ""}`} scope="col">Receita de frete</th>
              {exibirValorAPagar && <th className={`${HEADER_CELL} text-right`} scope="col">Valor a pagar</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {motoristas.map(({ posicao, motorista }) => {
              const id = motorista.motoristaId;
              const selecionar = onMotoristaClick && id !== null
                ? () => onMotoristaClick(id)
                : undefined;
              // O valor a pagar permanece separado da receita de frete do ranking.
              const valorAPagar = faturamentoDe?.(motorista) ?? null;
              return (
                <tr key={posicao} onClick={selecionar} className={selecionar ? "cursor-pointer hover:bg-background" : undefined}>
                  {/* O CPF fica como fallback quando o cadastro não tem telefone. */}
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
                  {/* Veículo e placa identificam o veículo principal do motorista. */}
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
                      {formatarValor(motorista.faturamento)}
                    </ValorMonetario>
                  </td>
                  {exibirValorAPagar && (
                    <td className={`${CELL} text-right`}>
                      <ValorMonetario className="whitespace-nowrap text-sm font-medium text-fg">
                        {formatarValor(valorAPagar)}
                      </ValorMonetario>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
