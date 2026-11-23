import type { ResumoUsuarios } from "@entities/usuario";

interface UsuariosKpisProps {
  resumo: ResumoUsuarios | null;
}

const CARD = "flex min-w-0 flex-col gap-2 rounded-lg p-5 sm:p-6";
const VALOR = "text-[28px] font-bold tracking-[-0.5px]";

function formatar(valor: number | undefined): string {
  return valor === undefined ? "—" : valor.toLocaleString("pt-BR");
}

function percentual(parte: number, total: number): string {
  if (total === 0) return "Nenhum usuário cadastrado";
  return `${Math.round((parte / total) * 100)}% do total`;
}

function Ponto({ cor }: { cor: string }) {
  return <span className={`inline-block h-2 w-2 rounded-full ${cor}`} aria-hidden="true" />;
}

function CardIndicador({
  titulo,
  valor,
  legenda,
  cor,
}: {
  titulo: string;
  valor: number | undefined;
  legenda: string;
  cor: string;
}) {
  return (
    <div className={`${CARD} bg-surface`}>
      <span className="flex items-center gap-2 text-sm font-semibold text-fg-muted">
        <Ponto cor={cor} />
        {titulo}
      </span>
      <span className={`${VALOR} text-fg`}>{formatar(valor)}</span>
      <span className="text-[13px] text-fg-subtle">{legenda}</span>
    </div>
  );
}

export function UsuariosKpis({ resumo }: UsuariosKpisProps) {
  const total = resumo?.total ?? 0;
  const carregado = resumo !== null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4" aria-busy={!carregado}>
      <div className={`${CARD} bg-primary`}>
        <span className="text-sm font-semibold text-white/85">Total de usuários</span>
        <span className={`${VALOR} text-white`}>{formatar(resumo?.total)}</span>
        <span className="text-[13px] text-white/70">Cadastrados</span>
      </div>

      <CardIndicador
        titulo="Usuários ativos"
        valor={resumo?.ativos}
        legenda={carregado ? percentual(resumo.ativos, total) : "Com acesso liberado"}
        cor="bg-success"
      />
      <CardIndicador
        titulo="Gestores"
        valor={resumo?.gestores}
        legenda="Acesso completo"
        cor="bg-primary dark:bg-grafico-claro"
      />
      <CardIndicador
        titulo="Operadores"
        valor={resumo?.operadores}
        legenda="Viagens e motoristas"
        cor="bg-amber-400"
      />
    </div>
  );
}
