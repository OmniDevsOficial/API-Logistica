import { AlertCircle } from "lucide-react";
import type { MotoristaEquipe, StatusEquipe } from "@entities/motorista";
import { StatusMotoristaBadge } from "@entities/motorista/ui/StatusMotoristaBadge";
import { formatCpf, formatDateOrToday, formatFrequencia } from "@shared/lib";
import { ValorMonetario } from "@entities/sessao";

interface EquipeTabelaProps {
  motoristas: MotoristaEquipe[];
  rentabilidades: Map<string, number | null>;
  chaveNomeMotorista: (nome: string) => string;
  onStatusChange?: (id: number, novoStatus: StatusEquipe) => void;
  statusSalvando?: number | null;
}

const HEADER_CELL =
  "whitespace-nowrap py-3 pr-6 text-left text-xs font-semibold text-fg-muted";
const CELL = "py-4 pr-6 align-top";

const FORMATADOR_MOEDA = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** Frequência é a participação nas viagens: 0% significa motorista sem viagem no período. */
function Frequencia({ valor, baixa }: { valor: number | null; baixa: boolean }) {
  if (valor === null) {
    return <span className="text-sm text-fg-subtle">—</span>;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 text-sm ${
        baixa ? "font-medium text-red-500" : "text-fg"
      }`}
      title={baixa ? "Baixa utilização" : undefined}
    >
      {formatFrequencia(valor)}
      {baixa && <AlertCircle size={14} aria-label="Baixa utilização" />}
    </span>
  );
}

export function EquipeTabela({
  motoristas,
  rentabilidades,
  chaveNomeMotorista,
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
          <table className="w-full min-w-[1100px] table-fixed">
            <colgroup>
              <col className="w-[15%]" />
              <col className="w-[11%]" />
              <col className="w-[15%]" />
              <col className="w-[12%]" />
              <col className="w-[7%]" />
              <col className="w-[10%]" />
              <col className="w-[15%]" />
              <col className="w-[15%]" />
            </colgroup>
            <thead>
              <tr className="border-y border-border">
                <th className={`${HEADER_CELL} pl-6`}>Motorista</th>
                <th className={HEADER_CELL}>Veículo/Placa</th>
                <th className={HEADER_CELL}>Operação</th>
                <th className={HEADER_CELL}>Localização</th>
                <th className={HEADER_CELL}>Viagens</th>
                <th className={HEADER_CELL}>Frequência</th>
                <th className={HEADER_CELL}>Rentabilidade média</th>
                <th className={`${HEADER_CELL} text-right`}>Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {motoristas.map((motorista) => {
                const cpf = formatCpf(motorista.cpf);
                const rentabilidade = rentabilidades.get(
                  chaveNomeMotorista(motorista.nome),
                );

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
                      <div className="flex flex-col">
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
                      <Frequencia
                        valor={motorista.frequencia}
                        baixa={motorista.baixaFrequencia}
                      />
                    </td>

                    {/* Rentabilidade média — borrada para o operador */}
                    <td className={CELL}>
                      <ValorMonetario
                        className={`whitespace-nowrap text-sm font-medium ${
                          rentabilidade != null && rentabilidade < 0
                            ? "text-red-600"
                            : "text-fg"
                        }`}
                      >
                        {rentabilidade == null
                          ? null
                          : FORMATADOR_MOEDA.format(rentabilidade)}
                      </ValorMonetario>
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
