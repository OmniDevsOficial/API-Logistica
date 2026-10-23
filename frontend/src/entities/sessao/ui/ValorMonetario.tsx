import type { ReactNode } from "react";
import { podeVerValoresMonetarios } from "../model/permissoes";
import { useSessao } from "../model/sessao";

interface ValorMonetarioProps {
  children: ReactNode;
  className?: string;
}

/**
 * Envolva um valor monetário com este componente: para o operador o número
 * aparece borrado (não lê), enquanto o gestor continua vendo normalmente.
 *
 * Atenção: é um bloqueio visual — o valor continua vindo da API e existe no
 * DOM. Quem precisar de proteção de verdade deve esconder o dado no back.
 */
export function ValorMonetario({ children, className }: ValorMonetarioProps) {
  const { usuario } = useSessao();
  const visivel = usuario !== null && podeVerValoresMonetarios(usuario.perfil);

  if (visivel) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span
      className={`select-none blur-[4px] ${className ?? ""}`}
      title="Valor oculto para o seu perfil"
    >
      <span className="sr-only">Valor oculto</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}
