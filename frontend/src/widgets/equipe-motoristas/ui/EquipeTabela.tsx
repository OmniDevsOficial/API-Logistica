import { AlertCircle } from "lucide-react";
import type { MotoristaEquipe, StatusEquipe } from "@entities/motorista";
import { StatusMotoristaBadge } from "@entities/motorista/ui/StatusMotoristaBadge";
import type { VeiculoResumo } from "@entities/veiculo";
import {
  formatCpf,
  formatDateOrToday,
  formatFrequencia,
  formatTipoVeiculo,
} from "@shared/lib";
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

function descreverVeiculo(veiculo: VeiculoResumo): string {
  return [veiculo.placa, veiculo.modelo, formatTipoVeiculo(veiculo.tipo)]
    .filter(Boolean)
    .join(" · ");
}

/**
 * Veículo principal (modelo · tipo e placa). Os demais veículos do motorista
 * ficam no selo "+N", com a lista completa no tooltip.
 */
function VeiculoCelula({ motorista }: { motorista: MotoristaEquipe }) {
  const titulo = [motorista.modelo, motorista.veiculo !== "-" ? motorista.veiculo : null]
    .filter(Boolean)
    .join(" · ");
  const outros = motorista.outrosVeiculos;
  const listaOutros = outros.map(descreverVeiculo).join("\n");

  return (
    <div className="flex flex-col">
      <span className="flex items-center gap-1.5 text-sm text-fg">
        <span className="min-w-0 truncate" title={titulo || undefined}>
          {titulo || "-"}
        </span>
        {outros.length > 0 && (
          <span
            className="shrink-0 cursor-default rounded-full bg-border px-1.5 text-xs font-medium text-fg-muted"
            title={listaOutros}
            aria-label={`Mais ${outros.length} ${outros.length === 1 ? "veículo" : "veículos"}: ${listaOutros.replaceAll("\n", "; ")}`}
          >
            +{outros.length}
          </span>
        )}
      </span>
      <span className="text-xs text-fg-muted">{motorista.placa}</span>
    </div>
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
              {/* Veículo/Placa ganhou espaço para modelo · tipo e o selo "+N". */}
              <col className="w-[14%]" />
              <col className="w-[13%]" />
              <col className="w-[12%]" />
              <col className="w-[7%]" />
              <col className="w-[10%]" />
              <col className="w-[14%]" />
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

                    {/* Veículo/Placa — modelo · tipo do principal, placa abaixo */}
                    <td className={CELL}>
                      <VeiculoCelula motorista={motorista} />
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
