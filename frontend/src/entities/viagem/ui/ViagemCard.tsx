import { formatCurrencyBRL } from "@shared/lib";
import type { Viagem } from "../model/types";
import { StatusViagemBadge } from "./StatusViagemBadge";

interface ViagemCardProps {
  viagem: Viagem;
}

// Os valores financeiros já vêm na listagem: o card não faz requisição própria.
export function ViagemCard({ viagem }: ViagemCardProps) {
  const moeda = (valor: number | null | undefined) =>
    valor === null || valor === undefined
      ? "-"
      : `R$ ${valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return (
    <div className="flex flex-col gap-2 rounded-md bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-medium text-fg">
          {viagem.origem} -&gt; {viagem.destino}
        </span>
        <StatusViagemBadge status={viagem.status} />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-fg">
          {formatCurrencyBRL(viagem.freteEstimado)}
        </span>
        <span className="text-[13px] text-fg-subtle">frete estimado</span>
      </div>
      <span className="text-[13px] text-fg-subtle">
        {viagem.veiculo} · {viagem.distanciaKm}km · estimativa {viagem.estimativaDias} dias
      </span>
      <div className="mt-2 grid grid-cols-3 gap-3 border-t border-border pt-3">
        {(["receita", "custo", "rentabilidade"] as const).map((campo) => (
          <div key={campo}>
            <span className="block text-xs text-fg-subtle">{campo === "rentabilidade" ? "Rentabilidade" : campo[0].toUpperCase() + campo.slice(1)}</span>
            <span className={`text-sm font-semibold ${campo === "rentabilidade" && (viagem.rentabilidade ?? 0) < 0 ? "text-red-600" : "text-fg"}`}>
              {moeda(viagem[campo])}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
