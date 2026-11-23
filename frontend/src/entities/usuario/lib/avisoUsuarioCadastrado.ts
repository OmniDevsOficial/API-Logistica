export const EVENTO_USUARIO_CADASTRADO = "usuario:cadastrado";

export function avisarUsuarioCadastrado(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(EVENTO_USUARIO_CADASTRADO));
}
