import type { ReactNode } from "react";

interface CampoFormularioProps {
  id: string;
  rotulo: string;
  erro?: string;
  dica?: string;
  children: (props: {
    id: string;
    "aria-invalid": true | undefined;
    "aria-describedby": string | undefined;
    className: string;
  }) => ReactNode;
}

const CONTROLE_CLASS =
  "h-11 w-full rounded-lg border bg-surface px-3 text-sm text-fg placeholder-fg-subtle shadow-sm transition-shadow focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60";
const CONTROLE_NORMAL = "border-slate-300 focus:border-primary focus:ring-primary/20 dark:border-border";
const CONTROLE_ERRO = "border-red-500 focus:border-red-500 focus:ring-red-500/20";

export function CampoFormulario({ id, rotulo, erro, dica, children }: CampoFormularioProps) {
  const idErro = `${id}-erro`;
  const idDica = `${id}-dica`;
  const descricao = erro ? idErro : dica ? idDica : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-fg">
        {rotulo}
      </label>

      {children({
        id,
        "aria-invalid": erro ? true : undefined,
        "aria-describedby": descricao,
        className: `${CONTROLE_CLASS} ${erro ? CONTROLE_ERRO : CONTROLE_NORMAL}`,
      })}

      {erro ? (
        <p id={idErro} className="text-xs text-red-600 dark:text-red-400">
          {erro}
        </p>
      ) : (
        dica && (
          <p id={idDica} className="text-xs text-fg-subtle">
            {dica}
          </p>
        )
      )}
    </div>
  );
}
