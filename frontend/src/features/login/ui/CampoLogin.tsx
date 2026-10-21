import type { ReactNode } from "react";

interface CampoLoginProps {
  id: string;
  rotulo: string;
  tipo: "email" | "password" | "text";
  valor: string;
  onChange: (valor: string) => void;
  placeholder: string;
  autoComplete: string;
  erro?: string;
  desabilitado: boolean;
  adorno: ReactNode;
}

export function CampoLogin({
  id,
  rotulo,
  tipo,
  valor,
  onChange,
  placeholder,
  autoComplete,
  erro,
  desabilitado,
  adorno,
}: CampoLoginProps) {
  const idErro = `${id}-erro`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-black">
        {rotulo}
      </label>

      <div
        className={`flex h-11 items-center rounded-full bg-white pl-4 pr-1 shadow-[0_4px_4px_rgba(0,0,0,0.25)] focus-within:ring-2 ${
          erro
            ? "ring-2 ring-red-500 focus-within:ring-red-500"
            : "focus-within:ring-[#204af4]"
        }`}
      >
        <input
          id={id}
          type={tipo}
          value={valor}
          onChange={(evento) => onChange(evento.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={desabilitado}
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro ? idErro : undefined}
          className="min-w-0 flex-1 bg-transparent text-sm text-black outline-none placeholder:text-[#5d5d5d] disabled:opacity-60"
        />
        <span className="mx-1 h-6 w-px bg-[#d9d9d9]" aria-hidden="true" />
        <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[#e5e5e5]">
          {adorno}
        </span>
      </div>

      {erro && (
        <p id={idErro} className="pl-4 text-xs text-red-600">
          {erro}
        </p>
      )}
    </div>
  );
}
