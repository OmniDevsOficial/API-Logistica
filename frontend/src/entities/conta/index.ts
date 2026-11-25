export type { Conta } from "./model/types";
export {
  alterarFotoConta,
  alterarNomeConta,
  buscarConta,
  type ContaAtualizada,
} from "./api/contaService";
export { definirContaAtual, useContaAtual } from "./model/contaAtual";
export { iniciaisDoNome } from "./lib/iniciaisDoNome";
export { AvatarConta } from "./ui/AvatarConta";
