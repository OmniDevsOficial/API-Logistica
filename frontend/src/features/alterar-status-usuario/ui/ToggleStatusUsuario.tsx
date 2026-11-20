import { useState } from "react";
import { alterarStatusUsuario, type Usuario } from "@entities/usuario";

const MENSAGEM_FALHA = "Não foi possível alterar o status do usuário agora.";
const MENSAGEM_PROPRIO_USUARIO = "Você não pode desativar o seu próprio usuário.";

interface Propriedades {
  usuario: Usuario;
  proprioUsuario: boolean;
  onAlterado: (usuario: Usuario) => void;
  onErro: (mensagem: string) => void;
}

export function ToggleStatusUsuario({ usuario, proprioUsuario, onAlterado, onErro }: Propriedades) {
  const [statusPendente, setStatusPendente] = useState<boolean | null>(null);

  const ativo = statusPendente ?? usuario.ativo;
  const enviando = statusPendente !== null;
  const travado = proprioUsuario || enviando;

  async function alternar() {
    if (travado) return;

    const novoStatus = !usuario.ativo;
    setStatusPendente(novoStatus);

    try {
      onAlterado(await alterarStatusUsuario(usuario.id, novoStatus));
    } catch (erro) {
      onErro(erro instanceof Error ? erro.message : MENSAGEM_FALHA);
    } finally {
      setStatusPendente(null);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={ativo}
        aria-label={`Acesso de ${usuario.nome}`}
        aria-busy={enviando}
        disabled={travado}
        title={proprioUsuario ? MENSAGEM_PROPRIO_USUARIO : ativo ? "Desativar usuário" : "Ativar usuário"}
        onClick={alternar}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed ${
          ativo ? "bg-success" : "bg-red-500"
        } ${proprioUsuario ? "opacity-50" : enviando ? "animate-pulse" : "cursor-pointer"}`}
      >
        <span
          aria-hidden="true"
          className={`absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            ativo ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
      <span
        className={`text-xs font-semibold ${
          ativo ? "text-success" : "text-red-600 dark:text-red-400"
        }`}
      >
        {ativo ? "Ativo" : "Inativo"}
      </span>
    </div>
  );
}
