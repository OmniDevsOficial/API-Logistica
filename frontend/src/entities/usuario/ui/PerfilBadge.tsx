import type { Perfil } from "@entities/sessao";

const ROTULO: Record<Perfil, string> = {
  GESTOR: "Gestor",
  OPERADOR: "Operador",
};

const ESTILO: Record<Perfil, string> = {
  GESTOR: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-grafico-claro",
  OPERADOR: "bg-success/15 text-success",
};

export function PerfilBadge({ perfil }: { perfil: Perfil }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${ESTILO[perfil]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {ROTULO[perfil]}
    </span>
  );
}
