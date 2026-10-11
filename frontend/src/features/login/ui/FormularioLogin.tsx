import { useState } from "react";
import type { SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, User } from "lucide-react";
import { autenticar, mensagemErroLogin } from "../api/autenticar";
import {
  validarCredenciais,
  type ErrosCredenciais,
} from "../lib/validarCredenciais";
import { CampoLogin } from "./CampoLogin";

export function FormularioLogin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [erros, setErros] = useState<ErrosCredenciais>({});
  const [erroLogin, setErroLogin] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(evento: SyntheticEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (enviando) return;

    const credenciais = { email: email.trim(), senha };
    const errosEncontrados = validarCredenciais(credenciais);

    setErros(errosEncontrados);
    setErroLogin(null);
    if (errosEncontrados.email || errosEncontrados.senha) return;

    setEnviando(true);
    try {
      await autenticar(credenciais);
    } catch (erro) {
      setErroLogin(mensagemErroLogin(erro));
      setEnviando(false);
    }
  }

  return (
    <form
      onSubmit={aoEnviar}
      noValidate
      aria-busy={enviando}
      className="flex w-full max-w-[272px] flex-col"
    >
      <h1 className="text-center text-xl font-medium text-black">Bem vindo</h1>
      <p className="mt-1 text-center text-sm font-medium text-black">
        Faça login para continuar
      </p>

      <div className="mt-4 flex flex-col gap-4">
        <CampoLogin
          id="login-email"
          rotulo="E-mail:"
          tipo="email"
          valor={email}
          onChange={(valor) => {
            setEmail(valor);
            setErros((atuais) => ({ ...atuais, email: undefined }));
          }}
          placeholder="example@newe.com.br"
          autoComplete="username"
          erro={erros.email}
          desabilitado={enviando}
          adorno={<User size={18} aria-hidden="true" />}
        />

        <CampoLogin
          id="login-senha"
          rotulo="Senha:"
          tipo={senhaVisivel ? "text" : "password"}
          valor={senha}
          onChange={(valor) => {
            setSenha(valor);
            setErros((atuais) => ({ ...atuais, senha: undefined }));
          }}
          placeholder="Insira sua senha"
          autoComplete="current-password"
          erro={erros.senha}
          desabilitado={enviando}
          adorno={
            <button
              type="button"
              onClick={() => setSenhaVisivel((visivel) => !visivel)}
              aria-label={senhaVisivel ? "Ocultar senha" : "Mostrar senha"}
              aria-pressed={senhaVisivel}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:text-[#5d5d5d] focus-visible:outline-2 focus-visible:outline-[#204af4]"
            >
              {senhaVisivel ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />
      </div>

      <Link
        to="/recuperar-senha"
        className="mt-2 self-end rounded-sm text-xs text-black hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#204af4]"
      >
        Esqueceu sua senha?
      </Link>

      {erroLogin && (
        <p
          role="alert"
          className="mt-4 rounded-md bg-red-50 px-3 py-2 text-center text-xs text-red-700"
        >
          {erroLogin}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="mt-5 h-11 cursor-pointer rounded-full bg-[#204af4] text-base font-semibold text-white shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition-colors enabled:hover:bg-[#1a3ed0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#204af4] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {enviando ? "Entrando..." : "Continuar"}
      </button>

      <p className="mt-6 text-center text-sm font-medium text-black">
        Não tem uma conta?{" "}
        <Link
          to="/cadastro"
          className="rounded-sm text-[#0088ff] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#204af4]"
        >
          Cadastre-se
        </Link>
      </p>
    </form>
  );
}
