import { iniciaisDoNome } from "../lib/iniciaisDoNome";

const TAMANHOS = {
  compacto: "h-9 w-9 text-xs",
  pequeno: "h-10 w-10 text-xs",
  grande: "h-20 w-20 text-xl",
} as const;

interface Propriedades {
  nome: string;
  foto: string | null;
  tamanho?: keyof typeof TAMANHOS;
}

export function AvatarConta({ nome, foto, tamanho = "pequeno" }: Propriedades) {
  const classes = `${TAMANHOS[tamanho]} shrink-0 overflow-hidden rounded-full`;

  if (foto) {
    return <img src={foto} alt="" className={`${classes} object-cover`} />;
  }

  return (
    <span
      aria-hidden="true"
      className={`${classes} flex items-center justify-center bg-primary/10 font-semibold text-primary dark:bg-primary/20 dark:text-grafico-claro`}
    >
      {iniciaisDoNome(nome)}
    </span>
  );
}
