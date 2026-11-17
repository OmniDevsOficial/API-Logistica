import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { CampoFormulario } from "./CampoFormulario";

interface CampoSenhaProps {
  id: string;
  rotulo: string;
  valor: string;
  onChange: (valor: string) => void;
  placeholder: string;
  erro?: string;
  dica?: string;
  desabilitado: boolean;
}

export function CampoSenha({
  id,
  rotulo,
  valor,
  onChange,
  placeholder,
  erro,
  dica,
  desabilitado,
}: CampoSenhaProps) {
  const [visivel, setVisivel] = useState(false);

  return (
    <CampoFormulario id={id} rotulo={rotulo} erro={erro} dica={dica}>
      {({ className, ...acessibilidade }) => (
        <div className="relative">
          <input
            {...acessibilidade}
            type={visivel ? "text" : "password"}
            value={valor}
            onChange={(evento) => onChange(evento.target.value)}
            placeholder={placeholder}
            autoComplete="new-password"
            disabled={desabilitado}
            className={`${className} pr-11`}
          />
          <button
            type="button"
            onClick={() => setVisivel((atual) => !atual)}
            disabled={desabilitado}
            aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={visivel}
            aria-controls={id}
            className="absolute top-1/2 right-1.5 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-fg-subtle transition-colors hover:bg-background hover:text-fg focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed"
          >
            {visivel ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      )}
    </CampoFormulario>
  );
}
