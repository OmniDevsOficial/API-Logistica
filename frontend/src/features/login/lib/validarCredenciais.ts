export interface Credenciais {
  email: string;
  senha: string;
}

export interface ErrosCredenciais {
  email?: string;
  senha?: string;
}

const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarCredenciais({
  email,
  senha,
}: Credenciais): ErrosCredenciais {
  const erros: ErrosCredenciais = {};

  if (email.trim() === "") {
    erros.email = "Informe o e-mail.";
  } else if (!FORMATO_EMAIL.test(email.trim())) {
    erros.email = "Informe um e-mail válido.";
  }

  if (senha === "") {
    erros.senha = "Informe a senha.";
  }

  return erros;
}
