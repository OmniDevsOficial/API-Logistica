import { Users } from "lucide-react";
import { SecaoUsuarios } from "@widgets/gerenciamento-usuarios";
import type { SecaoAdministracao } from "../model/types";

export const SECOES_ADMINISTRACAO: readonly SecaoAdministracao[] = [
  {
    id: "usuarios",
    titulo: "Usuários",
    descricao: "Cadastro e acesso à plataforma",
    icone: Users,
    componente: SecaoUsuarios,
    perfis: ["GESTOR"],
  },
];
