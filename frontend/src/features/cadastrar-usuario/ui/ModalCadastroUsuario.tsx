import { useEffect, useRef, useState } from "react";
import type { SyntheticEvent } from "react";
import { AlertCircle, Loader2, RotateCcw, UserPlus, X } from "lucide-react";
import {
  cadastrarUsuario,
  ErroCadastroUsuario,
  type Usuario,
} from "@entities/usuario";
import type { Perfil } from "@entities/sessao";
import {
  FORMULARIO_VAZIO,
  TAMANHO_MAXIMO_NOME,
  TAMANHO_MINIMO_SENHA,
  temErros,
  validarFormularioUsuario,
  type CampoFormulario as NomeCampo,
  type ErrosFormulario,
  type FormularioUsuario,
} from "../lib/validarFormularioUsuario";
import { CampoFormulario } from "./CampoFormulario";
import { CampoSenha } from "./CampoSenha";
import { SeletorPerfil } from "./SeletorPerfil";

interface ModalCadastroUsuarioProps {
  onFechar: () => void;
  onCadastrado: (usuario: Usuario) => void;
}

interface ErroGeral {
  mensagem: string;
  podeTentarDeNovo: boolean;
}

const ORDEM_CAMPOS: readonly NomeCampo[] = [
  "nome",
  "email",
  "perfil",
  "senha",
  "confirmacao",
];

const ID_CAMPO: Record<NomeCampo, string> = {
  nome: "usuario-nome",
  email: "usuario-email",
  perfil: "usuario-perfil",
  senha: "usuario-senha",
  confirmacao: "usuario-confirmacao",
};

const MENSAGEM_INESPERADA = "Não foi possível cadastrar o usuário. Tente de novo.";

const BOTAO_SECUNDARIO =
  "h-11 cursor-pointer rounded-full border border-slate-300 px-5 text-sm font-semibold text-fg transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-border";
const BOTAO_PRIMARIO =
  "inline-flex h-11 min-w-[150px] cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white transition-colors enabled:hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-70";

function focarPrimeiroComErro(erros: ErrosFormulario) {
  const campo = ORDEM_CAMPOS.find((nome) => erros[nome]);
  if (campo) document.getElementById(ID_CAMPO[campo])?.focus();
}

export function ModalCadastroUsuario({ onFechar, onCadastrado }: ModalCadastroUsuarioProps) {
  const [formulario, setFormulario] = useState<FormularioUsuario>(FORMULARIO_VAZIO);
  const [erros, setErros] = useState<ErrosFormulario>({});
  const [erroGeral, setErroGeral] = useState<ErroGeral | null>(null);
  const [enviando, setEnviando] = useState(false);
  const envioEmAndamentoRef = useRef(false);
  const nomeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nomeRef.current?.focus();
  }, []);

  useEffect(() => {
    function aoPressionarTecla(evento: KeyboardEvent) {
      if (evento.key === "Escape" && !envioEmAndamentoRef.current) onFechar();
    }
    window.addEventListener("keydown", aoPressionarTecla);
    return () => window.removeEventListener("keydown", aoPressionarTecla);
  }, [onFechar]);

  function tentarFechar() {
    if (!envioEmAndamentoRef.current) onFechar();
  }

  function alterar<C extends NomeCampo>(campo: C, valor: FormularioUsuario[C]) {
    setFormulario((atual) => ({ ...atual, [campo]: valor }));
    setErros((atuais) => ({
      ...atuais,
      [campo]: undefined,
      ...(campo === "senha" ? { confirmacao: undefined } : {}),
    }));
    setErroGeral(null);
  }

  async function enviar() {
    if (envioEmAndamentoRef.current) return;

    const errosEncontrados = validarFormularioUsuario(formulario);
    setErros(errosEncontrados);
    setErroGeral(null);
    if (temErros(errosEncontrados)) {
      focarPrimeiroComErro(errosEncontrados);
      return;
    }

    envioEmAndamentoRef.current = true;
    setEnviando(true);

    try {
      const usuario = await cadastrarUsuario({
        nome: formulario.nome,
        email: formulario.email,
        perfil: formulario.perfil as Perfil,
        senha: formulario.senha,
      });
      setFormulario(FORMULARIO_VAZIO);
      onCadastrado(usuario);
    } catch (erro) {
      if (!(erro instanceof ErroCadastroUsuario)) {
        setErroGeral({ mensagem: MENSAGEM_INESPERADA, podeTentarDeNovo: true });
        return;
      }

      if (erro.motivo === "campos" || erro.motivo === "conflito") {
        setErros(erro.campos);
        if (temErros(erro.campos)) {
          requestAnimationFrame(() => focarPrimeiroComErro(erro.campos));
        } else {
          setErroGeral({ mensagem: erro.message, podeTentarDeNovo: false });
        }
        return;
      }

      setErroGeral({
        mensagem: erro.message,
        podeTentarDeNovo: erro.motivo === "rede" || erro.motivo === "servidor",
      });
    } finally {
      envioEmAndamentoRef.current = false;
      setEnviando(false);
    }
  }

  function aoEnviar(evento: SyntheticEvent<HTMLFormElement>) {
    evento.preventDefault();
    void enviar();
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4"
      onClick={tentarFechar}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-cadastro-usuario"
        aria-describedby="descricao-cadastro-usuario"
        aria-busy={enviando}
        onClick={(evento) => evento.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-[520px] animate-surgir flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl ring-1 ring-border"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <UserPlus className="h-5 w-5 text-primary dark:text-grafico-claro" aria-hidden="true" />
            </div>
            <div>
              <h2 id="titulo-cadastro-usuario" className="text-base font-semibold text-fg">
                Novo usuário
              </h2>
              <p id="descricao-cadastro-usuario" className="text-sm text-fg-muted">
                Cadastre uma pessoa para acessar a plataforma
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={tentarFechar}
            disabled={enviando}
            aria-label="Fechar"
            className="cursor-pointer rounded-full p-1.5 text-fg-subtle transition-colors hover:bg-background hover:text-fg focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={aoEnviar} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="flex flex-col gap-4 overflow-y-auto px-6 py-5">
            <CampoFormulario id={ID_CAMPO.nome} rotulo="Nome" erro={erros.nome}>
              {(props) => (
                <input
                  {...props}
                  ref={nomeRef}
                  type="text"
                  value={formulario.nome}
                  onChange={(evento) => alterar("nome", evento.target.value)}
                  placeholder="Nome completo"
                  autoComplete="off"
                  maxLength={TAMANHO_MAXIMO_NOME}
                  disabled={enviando}
                />
              )}
            </CampoFormulario>

            <CampoFormulario id={ID_CAMPO.email} rotulo="E-mail" erro={erros.email}>
              {(props) => (
                <input
                  {...props}
                  type="email"
                  value={formulario.email}
                  onChange={(evento) => alterar("email", evento.target.value)}
                  placeholder="exemplo@newe.com.br"
                  autoComplete="off"
                  disabled={enviando}
                />
              )}
            </CampoFormulario>

            <CampoFormulario id={ID_CAMPO.perfil} rotulo="Perfil" erro={erros.perfil}>
              {(props) => (
                <SeletorPerfil
                  {...props}
                  valor={formulario.perfil}
                  onChange={(perfil) => alterar("perfil", perfil)}
                  desabilitado={enviando}
                />
              )}
            </CampoFormulario>

            <div className="grid gap-4 sm:grid-cols-2">
              <CampoSenha
                id={ID_CAMPO.senha}
                rotulo="Senha"
                valor={formulario.senha}
                onChange={(valor) => alterar("senha", valor)}
                placeholder="Crie uma senha"
                erro={erros.senha}
                dica={`Mínimo de ${TAMANHO_MINIMO_SENHA} caracteres.`}
                desabilitado={enviando}
              />
              <CampoSenha
                id={ID_CAMPO.confirmacao}
                rotulo="Confirmar senha"
                valor={formulario.confirmacao}
                onChange={(valor) => alterar("confirmacao", valor)}
                placeholder="Repita a senha"
                erro={erros.confirmacao}
                desabilitado={enviando}
              />
            </div>

            {erroGeral && (
              <div
                role="alert"
                className="flex flex-col gap-3 rounded-[10px] border border-red-300 bg-red-50 px-3.5 py-3 text-sm font-medium text-red-700 sm:flex-row sm:items-center dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-400"
              >
                <span className="flex flex-1 items-start gap-2">
                  <AlertCircle size={18} className="mt-px shrink-0" aria-hidden="true" />
                  {erroGeral.mensagem}
                </span>
                {erroGeral.podeTentarDeNovo && (
                  <button
                    type="submit"
                    disabled={enviando}
                    className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 self-end rounded-full border border-current px-3 py-1 text-xs font-semibold transition-opacity hover:opacity-70 disabled:cursor-not-allowed sm:self-auto"
                  >
                    <RotateCcw size={14} aria-hidden="true" />
                    Tentar de novo
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-border px-6 py-4 sm:flex-row sm:justify-end">
            <button type="button" onClick={tentarFechar} disabled={enviando} className={BOTAO_SECUNDARIO}>
              Cancelar
            </button>
            <button type="submit" disabled={enviando} className={BOTAO_PRIMARIO}>
              {enviando ? (
                <>
                  <Loader2 size={17} className="animate-spin" aria-hidden="true" />
                  Cadastrando...
                </>
              ) : (
                "Cadastrar usuário"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
