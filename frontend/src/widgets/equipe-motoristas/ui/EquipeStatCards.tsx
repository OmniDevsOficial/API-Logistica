interface IndicadorDot {
  color: string;
}

function Dot({ color }: IndicadorDot) {
  return <span className={`inline-block h-2 w-2 rounded-full ${color}`} />;
}

interface EquipeStatCardsProps {
  totalMotoristas: number;
  disponiveis: number;
  emViagem: number;
  indisponiveis: number;
}

export function EquipeStatCards({
  totalMotoristas,
  disponiveis,
  emViagem,
  indisponiveis,
}: EquipeStatCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total de motoristas — card destacado */}
      <div className="flex flex-col gap-2 rounded-md bg-primary p-6">
        <span className="text-sm font-semibold text-white/85">
          Total de motoristas
        </span>
        <span className="text-[28px] font-bold tracking-[-0.5px] text-white">
          {totalMotoristas.toLocaleString("pt-BR")}
        </span>
        <span className="text-[13px] text-white/70">Cadastrados</span>
      </div>

      {/* Disponíveis */}
      <div className="flex flex-col gap-2 rounded-md bg-surface p-6">
        <span className="flex items-center gap-2 text-sm font-semibold text-fg-muted">
          <Dot color="bg-success" />
          Disponíveis
        </span>
        <span className="text-[28px] font-bold tracking-[-0.5px] text-fg">
          {disponiveis.toLocaleString("pt-BR")}
        </span>
        <span className="text-[13px] text-fg-subtle">Em tempo real</span>
      </div>

      {/* Em viagem */}
      <div className="flex flex-col gap-2 rounded-md bg-surface p-6">
        <span className="flex items-center gap-2 text-sm font-semibold text-fg-muted">
          <Dot color="bg-primary" />
          Em viagem
        </span>
        <span className="text-[28px] font-bold tracking-[-0.5px] text-fg">
          {emViagem.toLocaleString("pt-BR")}
        </span>
        <span className="text-[13px] text-fg-subtle">Em rota agora</span>
      </div>

      {/* Indisponíveis */}
      <div className="flex flex-col gap-2 rounded-md bg-surface p-6">
        <span className="flex items-center gap-2 text-sm font-semibold text-fg-muted">
          <Dot color="bg-red-500" />
          Indisponíveis
        </span>
        <span className="text-[28px] font-bold tracking-[-0.5px] text-fg">
          {indisponiveis.toLocaleString("pt-BR")}
        </span>
        <span className="text-[13px] text-fg-subtle">
          Folga ou manutenção
        </span>
      </div>
    </div>
  );
}
