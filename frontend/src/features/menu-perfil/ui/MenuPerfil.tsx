import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Camera, Check, Loader2, Pencil, RotateCcw, X } from "lucide-react";
import {
  alterarFotoConta,
  alterarNomeConta,
  AvatarConta,
  definirContaAtual,
  useContaAtual,
} from "@entities/conta";
import { iniciarSessao, useSessao } from "@entities/sessao";
import { formatarDataCriacao, PerfilBadge, StatusUsuarioBadge } from "@entities/usuario";
import { prepararFoto, TIPOS_DE_FOTO, validarArquivoDeFoto, validarNome } from "../lib/foto";

type Salvando = "nome" | "foto" | null;

interface Mensagem {
  tipo: "sucesso" | "erro";
  texto: string;
}

const BOTAO_ICONE =
  "flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60";

const CAMPO_NOME =
  "h-9 min-w-0 flex-1 rounded-lg border border-slate-300 bg-surface px-3 text-sm text-fg shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:opacity-60 dark:border-border";

function mensagemDe(erro: unknown): string {
  return erro instanceof Error ? erro.message : "Não foi possível salvar agora.";
}

export function MenuPerfil() {
  const { usuario } = useSessao();
  const { conta, erro, recarregar } = useContaAtual();
  const [aberto, setAberto] = useState(false);
  const [editandoNome, setEditandoNome] = useState(false);
  const [rascunhoNome, setRascunhoNome] = useState("");
  const [salvando, setSalvando] = useState<Salvando>(null);
  const [mensagem, setMensagem] = useState<Mensagem | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const arquivoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!aberto) return;

    function foiFora(evento: MouseEvent) {
      if (!containerRef.current?.contains(evento.target as Node)) setAberto(false);
    }

    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === "Escape") setAberto(false);
    }

    document.addEventListener("mousedown", foiFora);
    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.removeEventListener("mousedown", foiFora);
      document.removeEventListener("keydown", aoTeclar);
    };
  }, [aberto]);

  const nome = conta?.nome ?? usuario?.nome ?? "";
  const foto = conta?.foto ?? null;

  function alternar() {
    setAberto((valor) => !valor);
    setEditandoNome(false);
    setMensagem(null);
  }

  function comecarEdicao() {
    setRascunhoNome(nome);
    setEditandoNome(true);
    setMensagem(null);
  }

  async function salvarNome(evento: FormEvent) {
    evento.preventDefault();
    if (salvando) return;

    const invalido = validarNome(rascunhoNome);
    if (invalido) {
      setMensagem({ tipo: "erro", texto: invalido });
      return;
    }
    if (rascunhoNome.trim() === nome) {
      setEditandoNome(false);
      return;
    }

    setSalvando("nome");
    setMensagem(null);
    try {
      const { conta: atualizada, token } = await alterarNomeConta(rascunhoNome);
      iniciarSessao(token);
      definirContaAtual(atualizada);
      setEditandoNome(false);
      setMensagem({ tipo: "sucesso", texto: "Nome atualizado." });
    } catch (falha) {
      setMensagem({ tipo: "erro", texto: mensagemDe(falha) });
    } finally {
      setSalvando(null);
    }
  }

  async function escolherFoto(evento: ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0];
    evento.target.value = "";
    if (!arquivo || salvando) return;

    const invalido = validarArquivoDeFoto(arquivo);
    if (invalido) {
      setMensagem({ tipo: "erro", texto: invalido });
      return;
    }

    setSalvando("foto");
    setMensagem(null);
    try {
      definirContaAtual(await alterarFotoConta(await prepararFoto(arquivo)));
      setMensagem({ tipo: "sucesso", texto: "Foto atualizada." });
    } catch (falha) {
      setMensagem({ tipo: "erro", texto: mensagemDe(falha) });
    } finally {
      setSalvando(null);
    }
  }

  async function removerFoto() {
    if (salvando) return;

    setSalvando("foto");
    setMensagem(null);
    try {
      definirContaAtual(await alterarFotoConta(null));
      setMensagem({ tipo: "sucesso", texto: "Foto removida." });
    } catch (falha) {
      setMensagem({ tipo: "erro", texto: mensagemDe(falha) });
    } finally {
      setSalvando(null);
    }
  }

  if (!usuario) return null;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={alternar}
        aria-label="Meu perfil"
        aria-haspopup="dialog"
        aria-expanded={aberto}
        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-shadow hover:ring-2 hover:ring-primary/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <AvatarConta nome={nome} foto={foto} />
      </button>

      {aberto && (
        <div
          role="dialog"
          aria-label="Meu perfil"
          className="fixed inset-x-4 top-20 z-50 overflow-hidden rounded-md border border-border bg-surface shadow-lg sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:mt-2 sm:w-80"
        >
          <div className="flex flex-col items-center gap-3 px-4 pt-6 pb-4 text-center">
            <div className="relative">
              <AvatarConta nome={nome} foto={foto} tamanho="grande" />
              <button
                type="button"
                onClick={() => arquivoRef.current?.click()}
                disabled={salvando !== null || !conta}
                aria-label="Escolher foto de perfil"
                title="Escolher foto de perfil"
                className={`${BOTAO_ICONE} absolute -right-1 -bottom-1 border-2 border-surface bg-primary text-white hover:bg-primary-dark`}
              >
                {salvando === "foto" ? (
                  <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Camera size={14} aria-hidden="true" />
                )}
              </button>
              <input
                ref={arquivoRef}
                type="file"
                accept={TIPOS_DE_FOTO.join(",")}
                onChange={escolherFoto}
                className="hidden"
                tabIndex={-1}
              />
            </div>

            {editandoNome ? (
              <form onSubmit={salvarNome} className="flex w-full items-center gap-2">
                <input
                  autoFocus
                  value={rascunhoNome}
                  onChange={(evento) => setRascunhoNome(evento.target.value)}
                  onKeyDown={(evento) => {
                    if (evento.key === "Escape") {
                      evento.stopPropagation();
                      setEditandoNome(false);
                    }
                  }}
                  maxLength={120}
                  disabled={salvando === "nome"}
                  aria-label="Nome"
                  className={CAMPO_NOME}
                />
                <button
                  type="submit"
                  disabled={salvando === "nome"}
                  aria-label="Salvar nome"
                  className={`${BOTAO_ICONE} h-9 w-9 bg-primary text-white hover:bg-primary-dark`}
                >
                  {salvando === "nome" ? (
                    <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                  ) : (
                    <Check size={15} aria-hidden="true" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setEditandoNome(false)}
                  disabled={salvando === "nome"}
                  aria-label="Cancelar edição do nome"
                  className={`${BOTAO_ICONE} h-9 w-9 text-fg-muted hover:bg-background hover:text-fg`}
                >
                  <X size={15} aria-hidden="true" />
                </button>
              </form>
            ) : (
              <div className="flex w-full min-w-0 flex-col items-center">
                <div className="flex max-w-full items-center gap-1">
                  <p className="truncate text-base font-semibold text-fg" title={nome}>
                    {nome}
                  </p>
                  <button
                    type="button"
                    onClick={comecarEdicao}
                    disabled={!conta}
                    aria-label="Editar nome"
                    title="Editar nome"
                    className={`${BOTAO_ICONE} h-7 w-7 text-fg-muted hover:bg-background hover:text-fg`}
                  >
                    <Pencil size={13} aria-hidden="true" />
                  </button>
                </div>
                <p className="max-w-full truncate text-sm text-fg-muted" title={usuario.email}>
                  {usuario.email}
                </p>
              </div>
            )}

            {foto && !editandoNome && (
              <button
                type="button"
                onClick={removerFoto}
                disabled={salvando !== null}
                className="cursor-pointer text-xs font-medium text-fg-muted underline-offset-2 hover:text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-60 dark:hover:text-red-400"
              >
                Remover foto
              </button>
            )}
          </div>

          {mensagem && (
            <p
              role={mensagem.tipo === "erro" ? "alert" : "status"}
              className={`mx-4 mb-4 rounded-md px-3 py-2 text-center text-xs font-medium ${
                mensagem.tipo === "erro"
                  ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                  : "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
              }`}
            >
              {mensagem.texto}
            </p>
          )}

          {conta ? (
            <dl className="divide-y divide-border border-t border-border text-sm">
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <dt className="text-fg-muted">Perfil</dt>
                <dd>
                  <PerfilBadge perfil={conta.perfil} />
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <dt className="text-fg-muted">Status</dt>
                <dd>
                  <StatusUsuarioBadge ativo={conta.ativo} />
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <dt className="text-fg-muted">Membro desde</dt>
                <dd className="font-medium text-fg">{formatarDataCriacao(conta.criadoEm)}</dd>
              </div>
            </dl>
          ) : erro ? (
            <div className="flex flex-col items-center gap-2 border-t border-border px-4 py-4 text-center">
              <p className="text-xs text-fg-subtle">{erro}</p>
              <button
                type="button"
                onClick={recarregar}
                className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              >
                <RotateCcw size={13} aria-hidden="true" />
                Tentar de novo
              </button>
            </div>
          ) : (
            <p
              role="status"
              className="flex items-center justify-center gap-2 border-t border-border px-4 py-4 text-xs text-fg-subtle"
            >
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
              Carregando perfil...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
