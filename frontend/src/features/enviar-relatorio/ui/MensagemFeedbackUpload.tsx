// src/features/enviar-relatorio/ui/MensagemFeedbackUpload.tsx
import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export type TipoMensagemUpload = 'erro' | 'sucesso';

interface Propriedades {
  tipo: TipoMensagemUpload;
  mensagem: string;
  onFechar: () => void;
}

const estilos = {
  erro: {
    container: 'border-red-300 bg-red-50',
    conteudo: 'text-red-700',
    barra: 'bg-red-600',
  },
  sucesso: {
    container: 'border-green-300 bg-green-50',
    conteudo: 'text-green-700',
    barra: 'bg-green-500',
  },
} as const;

export function MensagemFeedbackUpload({
  tipo,
  mensagem,
  onFechar,
}: Propriedades) {
  const [barraReduzida, setBarraReduzida] = useState(false);

  const estilo = estilos[tipo];
  const Icone = tipo === 'erro' ? AlertCircle : CheckCircle2;

  useEffect(() => {
    let segundoFrame: number | undefined;

    const primeiroFrame = requestAnimationFrame(() => {
      segundoFrame = requestAnimationFrame(() => {
        setBarraReduzida(true);
      });
    });

    return () => {
      cancelAnimationFrame(primeiroFrame);

      if (segundoFrame !== undefined) {
        cancelAnimationFrame(segundoFrame);
      }
    };
  }, []);

  return (
    <div
      className={`
        w-full shrink-0 overflow-hidden
        rounded-[10px] border
        ${estilo.container}
      `}
      role={tipo === 'erro' ? 'alert' : 'status'}
      aria-live={tipo === 'erro' ? 'assertive' : 'polite'}
    >
      <div
        className={`
          flex min-h-12 items-center gap-2
          px-3.5 py-3
          text-sm leading-5 font-medium
          ${estilo.conteudo}
        `}
      >
        <Icone
          size={20}
          className="shrink-0"
          aria-hidden="true"
        />

        <span className="min-w-0 flex-1 break-words">
          {mensagem}
        </span>

        <button
          type="button"
          className="
            flex shrink-0 cursor-pointer border-0
            bg-transparent p-1 text-current
            transition-opacity
            hover:opacity-60
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-current
          "
          onClick={onFechar}
          aria-label={`Fechar mensagem de ${tipo}`}
        >
          <X size={17} />
        </button>
      </div>

      <div
        className={`
          h-[3px] origin-left shrink-0
          transition-transform duration-[5000ms] ease-linear
          ${estilo.barra}
          ${barraReduzida ? 'scale-x-0' : 'scale-x-100'}
        `}
      />
    </div>
  );
}