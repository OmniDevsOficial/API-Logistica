import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, RotateCcw, UserPlus, Users } from "lucide-react";
import { resumirUsuarios, type Usuario } from "@entities/usuario";
import { ModalCadastroUsuario } from "@features/cadastrar-usuario";
import { MensagemFeedbackUpload } from "@shared/ui";
import { useUsuarios } from "../model/useUsuarios";
import { UsuariosKpis } from "./UsuariosKpis";
import { UsuariosTabela } from "./UsuariosTabela";

const DURACAO_AVISO_MS = 5000;

const BOTAO_PRIMARIO =
  "inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

function descreverQuantidade(total: number): string {
  return total === 1 ? "1 usuário cadastrado" : `${total} usuários cadastrados`;
}

export function SecaoUsuarios() {
  const { dados, carregando, erro, recarregar } = useUsuarios();
  const [modalAberto, setModalAberto] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    if (!aviso) return;
    const temporizador = setTimeout(() => setAviso(null), DURACAO_AVISO_MS);
    return () => clearTimeout(temporizador);
  }, [aviso]);

  const fecharModal = useCallback(() => setModalAberto(false), []);

  const aoCadastrar = useCallback(
    (usuario: Usuario) => {
      setModalAberto(false);
      setAviso(`Usuário ${usuario.nome} cadastrado com sucesso.`);
      recarregar();
    },
    [recarregar],
  );

  const resumo = useMemo(() => (dados ? resumirUsuarios(dados) : null), [dados]);

  const subtitulo =
    dados && !erro ? descreverQuantidade(dados.length) : "Pessoas com acesso à plataforma";

  return (
    <section aria-labelledby="titulo-secao-usuarios" className="flex flex-col gap-4">
      {aviso && (
        <MensagemFeedbackUpload
          key={aviso}
          tipo="sucesso"
          mensagem={aviso}
          onFechar={() => setAviso(null)}
        />
      )}

      <UsuariosKpis resumo={resumo} />

      <div className="overflow-hidden rounded-lg bg-surface">
        <div className="flex flex-col gap-4 px-6 pt-5 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="titulo-secao-usuarios" className="text-lg font-semibold text-fg">
              Usuários
            </h2>
            <p className="text-sm text-fg-muted">{subtitulo}</p>
          </div>
          <button type="button" onClick={() => setModalAberto(true)} className={BOTAO_PRIMARIO}>
            <UserPlus size={17} aria-hidden="true" />
            Novo usuário
          </button>
        </div>

        {erro ? (
          <div
            role="alert"
            className="flex flex-col items-center gap-3 border-t border-border px-6 py-10 text-center"
          >
            <p className="text-sm text-fg-subtle">{erro}</p>
            <button
              type="button"
              onClick={recarregar}
              className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              <RotateCcw size={15} aria-hidden="true" />
              Tentar de novo
            </button>
          </div>
        ) : carregando && !dados ? (
          <p
            role="status"
            className="flex items-center justify-center gap-2 border-t border-border px-6 py-10 text-sm text-fg-subtle"
          >
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            Carregando usuários...
          </p>
        ) : dados && dados.length === 0 ? (
          <div
            role="status"
            className="flex flex-col items-center gap-2 border-t border-border px-6 py-10 text-center"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Users size={20} aria-hidden="true" />
            </span>
            <p className="text-sm font-medium text-fg">Nenhum usuário cadastrado</p>
            <p className="text-sm text-fg-subtle">
              Use o botão “Novo usuário” para dar acesso a alguém.
            </p>
          </div>
        ) : (
          dados && (
            <div aria-busy={carregando}>
              <UsuariosTabela usuarios={dados} />
            </div>
          )
        )}
      </div>

      {modalAberto && (
        <ModalCadastroUsuario onFechar={fecharModal} onCadastrado={aoCadastrar} />
      )}
    </section>
  );
}
