import type { ReactNode } from "react";
import { podeVerValoresMonetarios } from "../model/permissoes";
import { useSessao } from "../model/sessao";

interface ValorMonetarioProps {
  /** Valor formatado; quando ausente entra o placeholder. */
  children?: ReactNode;
  className?: string;
  /** Texto mostrado quando não há valor. Para o operador aparece borrado. */
  placeholder?: string;
}

const SEM_VALOR = "-";

/**
 * Envolva um valor monetário com este componente: para o operador o número
 * aparece borrado (não lê), enquanto o gestor continua vendo normalmente.
 * Sem valor, o gestor vê "-" e o operador vê o placeholder borrado — assim ele
 * não descobre, nem pelo texto nem pelo traço, se existe valor ali.
 *
 * Atenção: é um bloqueio visual — o valor continua vindo da API e existe no
 * DOM. Quem precisar de proteção de verdade deve esconder o dado no back.
 */
export function ValorMonetario({
  children,
  className,
  placeholder = "R$ •••,••",
}: ValorMonetarioProps) {
  const { usuario } = useSessao();
  const visivel = usuario !== null && podeVerValoresMonetarios(usuario.perfil);

  if (visivel) {
    return <span className={className}>{children ?? SEM_VALOR}</span>;
  }

  return (
    <span
      className={`select-none blur-[4px] ${className ?? ""}`}
      title="Valor oculto para o seu perfil"
    >
      <span className="sr-only">Valor oculto</span>
      <span aria-hidden="true">{children ?? placeholder}</span>
    </span>
  );
}
