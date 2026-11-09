import type { RankingColocacao } from "@entities/motorista";
import { ValorMonetario } from "@entities/sessao";
import { formatCpf, formatCurrencyBRL } from "@shared/lib";

interface RankingListProps {
  /** Do 4º em diante, em ordem de posição. */
  motoristas: RankingColocacao[];
  /** US17: abre o modal de detalhes do motorista. Sem ele a linha não é clicável. */
  onMotoristaClick?: (motoristaId: number) => void;
}

const HEADER_CELL =
  "whitespace-nowrap py-3 pr-6 text-left text-xs font-semibold text-fg-muted";
const HEADER_CELL_PRIMEIRA =
  "whitespace-nowrap py-3 pr-6 pl-6 text-left text-xs font-semibold text-fg-muted";
const CELL = "py-4 pr-6 align-top";
const CELL_PRIMEIRO = "py-4 pr-6 pl-6 align-top";

export function RankingList({ motoristas, onMotoristaClick }: RankingListProps) {
  if (motoristas.length === 0) {
    return (
      <div className="overflow-hidden rounded-lg bg-surface">
        <h2 className="px-6 pt-5 pb-4 text-lg font-semibold text-fg">
          Equipe de motoristas
        </h2>
        <p className="border-t border-border px-6 py-8 text-center text-sm text-fg-subtle">
          Nenhum motorista encontrado.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg bg-surface">
      <h2 className="px-6 pt-5 pb-4 text-lg font-semibold text-fg">
        Equipe de motoristas
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] table-fixed">
          <colgroup>
            <col className="w-[32%]" />
            <col className="w-[22%]" />
            <col className="w-[14%]" />
            <col className="w-[32%]" />
          </colgroup>
          <thead>
            <tr className="border-y border-border">
              <th className={HEADER_CELL_PRIMEIRA} scope="col">
                Motorista
              </th>
              <th className={HEADER_CELL} scope="col">
                Veículo/Placa
              </th>
              <th className={HEADER_CELL} scope="col">
                Viagens
              </th>
              <th className={`${HEADER_CELL} text-right`} scope="col">
                Rentabilidade
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {motoristas.map(({ posicao, motorista }) => {
              const id = motorista.motoristaId;
              const clicavel = onMotoristaClick !== undefined && id !== null;
              const selecionar = clicavel
                ? () => onMotoristaClick?.(id)
                : undefined;

              return (
                <tr
                  key={posicao}
                  onClick={selecionar}
                  className={clicavel ? "cursor-pointer hover:bg-background" : undefined}
                >
                  {/* Motorista — telefone logo abaixo; sem telefone (o banco
                      ainda não tem a coluna) o CPF entra como fallback. */}
                  <td className={CELL_PRIMEIRO}>
                    <div className="flex flex-col">
                      {selecionar ? (
                        <button
                          type="button"
                          className="cursor-pointer text-left text-sm font-semibold text-fg transition-colors hover:text-primary"
                          onClick={(evento) => {
                            evento.stopPropagation();
                            selecionar();
                          }}
                        >
                          {motorista.nome}
                        </button>
                      ) : (
                        <span className="text-sm font-semibold text-fg">
                          {motorista.nome}
                        </span>
                      )}
                      <span className="text-xs text-fg-muted">
                        {motorista.telefone ?? formatCpf(motorista.cpf) ?? "—"}
                      </span>
                    </div>
                  </td>

                  {/* Veículo/Placa */}
                  <td className={CELL}>
                    <div className="flex flex-col">
                      <span className="text-sm text-fg">
                        {motorista.veiculo ?? "-"}
                      </span>
                      <span className="text-xs text-fg-muted">
                        {motorista.placa ?? "-"}
                      </span>
                    </div>
                  </td>

                  {/* Viagens */}
                  <td className={CELL}>
                    <span className="text-sm text-fg">{motorista.viagens}</span>
                  </td>

                  {/* Rentabilidade média no mês */}
                  <td className={`${CELL} text-right`}>
                    <ValorMonetario className="whitespace-nowrap text-sm font-medium text-fg">
                      {motorista.rentabilidadeMedia === null
                        ? null
                        : formatCurrencyBRL(motorista.rentabilidadeMedia, 2)}
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
