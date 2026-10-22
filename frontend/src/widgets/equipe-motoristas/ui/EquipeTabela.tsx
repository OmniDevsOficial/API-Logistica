import { AlertCircle } from "lucide-react";
import type { MotoristaEquipe, StatusEquipe } from "@entities/motorista";
import { StatusMotoristaBadge } from "@entities/motorista/ui/StatusMotoristaBadge";
import { formatCpf, formatDateOrToday } from "@shared/lib";

interface EquipeTabelaProps {
  motoristas: MotoristaEquipe[];
  onStatusChange?: (id: number, novoStatus: StatusEquipe) => void;
  statusSalvando?: number | null;
}

const HEADER_CELL =
  "whitespace-nowrap py-3 pr-6 text-left text-xs font-semibold text-fg-muted";
const CELL = "py-4 pr-6 align-top";

/** Frequência é a participação nas viagens: 0% significa motorista sem viagem no período. */
function Frequencia({ valor }: { valor: number | null }) {
  if (valor === null) {
    return <span className="text-sm text-fg-subtle">—</span>;
  }

  const semViagens = valor === 0;

  return (
    <span
      className={`inline-flex items-center gap-1 text-sm ${
        semViagens ? "font-medium text-red-500" : "text-fg"
      }`}
      title={semViagens ? "Sem viagens no período" : undefined}
    >
      {valor.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%
      {semViagens && (
        <AlertCircle size={14} aria-label="Sem viagens no período" />
      )}
    </span>
  );
}

export function EquipeTabela({
  motoristas,
  onStatusChange,
  statusSalvando = null,
}: EquipeTabelaProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-surface">
      <h2 className="px-6 pt-5 pb-4 text-lg font-semibold text-fg">
        Equipe de motoristas
      </h2>

      {motoristas.length === 0 ? (
        <p className="border-t border-border px-6 py-8 text-center text-sm text-fg-subtle">
          Nenhum motorista encontrado.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-y border-border">
                <th className={`${HEADER_CELL} w-[23%] pl-6`}>Motorista</th>
                <th className={`${HEADER_CELL} w-[11%]`}>Veículo/Placa</th>
                <th className={`${HEADER_CELL} w-[14%]`}>Operação</th>
                <th className={`${HEADER_CELL} w-[21%]`}>Localização</th>
                <th className={`${HEADER_CELL} w-[8%]`}>Viagens</th>
                <th className={`${HEADER_CELL} w-[10%]`}>Frequência</th>
                <th className={`${HEADER_CELL} w-[13%] text-right`}>Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {motoristas.map((motorista) => {
                const cpf = formatCpf(motorista.cpf);

                return (
                  <tr key={motorista.id}>
                    {/* Motorista — nome com o documento logo abaixo */}
                    <td className={`${CELL} pl-6`}>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-fg">
                          {motorista.nome}
                        </span>
                        <span className="text-xs text-fg-muted">
                          {cpf ?? "—"}
                        </span>
                      </div>
                    </td>

                    {/* Veículo/Placa */}
                    <td className={CELL}>
                      <div className="flex flex-col">
                        <span className="text-sm text-fg">
                          {motorista.veiculo}
                        </span>
                        <span className="text-xs text-fg-muted">
                          {motorista.placa}
                        </span>
                      </div>
                    </td>

                    {/* Operação — label discreto + data em destaque */}
                    <td className={CELL}>
                      <div className="flex flex-col whitespace-nowrap">
                        <span className="text-xs text-fg-muted">
                          {motorista.operacao}
                        </span>
                        <span className="text-sm font-medium text-fg">
                          {formatDateOrToday(motorista.dataOperacao)}
                        </span>
                      </div>
                    </td>

                    {/* Localização */}
                    <td className={CELL}>
                      <span className="text-sm text-fg">
                        {motorista.localizacao}
                      </span>
                    </td>

                    {/* Viagens */}
                    <td className={CELL}>
                      <span className="text-sm text-fg">
                        {motorista.viagens}
                      </span>
                    </td>

                    {/* Frequência */}
                    <td className={CELL}>
                      <Frequencia valor={motorista.frequencia} />
                    </td>

                    {/* Status */}
                    <td className={`${CELL} text-right`}>
                      <StatusMotoristaBadge
                        status={motorista.status}
                        salvando={statusSalvando === motorista.id}
                        onChange={
                          onStatusChange
                            ? (novoStatus) =>
                                onStatusChange(motorista.id, novoStatus)
                            : undefined
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
