import type { MotoristaEquipe } from "@entities/motorista";
import { StatusMotoristaBadge } from "@entities/motorista/ui/StatusMotoristaBadge";

interface EquipeTabelaProps {
  motoristas: MotoristaEquipe[];
}

const HEADER_CELL = "text-left text-xs font-semibold text-fg-muted";

export function EquipeTabela({ motoristas }: EquipeTabelaProps) {
  if (motoristas.length === 0) {
    return (
      <p className="rounded-md bg-surface p-6 text-center text-sm text-fg-subtle">
        Nenhum motorista encontrado.
      </p>
    );
  }

  return (
    <div className="rounded-md bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-border">
              <th className={`${HEADER_CELL} py-4 pl-6`}>Motorista</th>
              <th className={`${HEADER_CELL} py-4`}>Veículo/Placa</th>
              <th className={`${HEADER_CELL} py-4`}>Operação</th>
              <th className={`${HEADER_CELL} py-4`}>Localização</th>
              <th className={`${HEADER_CELL} py-4`}>Viagens</th>
              <th className={`${HEADER_CELL} py-4 pr-6`}>Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {motoristas.map((motorista) => (
              <tr key={motorista.id}>
                {/* Motorista — nome + telefone */}
                <td className="py-4 pl-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-fg">
                      {motorista.nome}
                    </span>
                    <span className="text-xs text-fg-muted">
                      {motorista.telefone}
                    </span>
                  </div>
                </td>

                {/* Veículo/Placa */}
                <td className="py-4">
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
                <td className="py-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-fg-muted">
                      {motorista.operacao}
                    </span>
                    <span className="text-sm font-medium text-fg">
                      {motorista.dataOperacao}
                    </span>
                  </div>
                </td>

                {/* Localização */}
                <td className="py-4">
                  <span className="text-sm text-fg">
                    {motorista.localizacao}
                  </span>
                </td>

                {/* Viagens */}
                <td className="py-4">
                  <span className="text-sm text-fg">{motorista.viagens}</span>
                </td>

                {/* Status */}
                <td className="py-4 pr-6">
                  <StatusMotoristaBadge status={motorista.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
