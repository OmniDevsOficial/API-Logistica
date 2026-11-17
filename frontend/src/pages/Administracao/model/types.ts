import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import type { Perfil } from "@entities/sessao";

export interface SecaoAdministracao {
  id: string;
  titulo: string;
  descricao: string;
  icone: LucideIcon;
  componente: ComponentType;
  perfis: readonly Perfil[];
}
