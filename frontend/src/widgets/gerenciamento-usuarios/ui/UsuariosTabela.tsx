import { AvatarConta, useContaAtual } from "@entities/conta";
import { formatarDataCriacao, PerfilBadge, type Usuario } from "@entities/usuario";
import { ToggleStatusUsuario } from "@features/alterar-status-usuario";

const HEADER_CELL = "whitespace-nowrap py-3 pr-6 text-left text-xs font-semibold text-fg-muted";
const CELL = "py-4 pr-6 align-middle";

interface Propriedades {
  usuarios: Usuario[];
  emailSessao: string | null;
  onStatusAlterado: (usuario: Usuario) => void;
  onErroStatus: (mensagem: string) => void;
}

export function UsuariosTabela({ usuarios, emailSessao, onStatusAlterado, onErroStatus }: Propriedades) {
  const sessao = emailSessao?.toLowerCase() ?? null;
  const { conta } = useContaAtual();

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] table-fixed">
        <colgroup>
          <col className="w-[28%]" />
          <col className="w-[29%]" />
          <col className="w-[14%]" />
          <col className="w-[15%]" />
          <col className="w-[14%]" />
        </colgroup>
        <thead>
          <tr className="border-y border-border">
            <th scope="col" className={`${HEADER_CELL} pl-6`}>Nome</th>
            <th scope="col" className={HEADER_CELL}>E-mail</th>
            <th scope="col" className={HEADER_CELL}>Perfil</th>
            <th scope="col" className={HEADER_CELL}>Status</th>
            <th scope="col" className={HEADER_CELL}>Criado em</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {usuarios.map((item) => {
            const usuario =
              conta !== null && conta.id === item.id
                ? { ...item, nome: conta.nome, foto: conta.foto }
                : item;

            return (
              <tr key={usuario.id}>
                <td className={`${CELL} pl-6`}>
                  <div className="flex min-w-0 items-center gap-3">
                    <AvatarConta nome={usuario.nome} foto={usuario.foto} tamanho="compacto" />
                    <span className="truncate text-sm font-semibold text-fg" title={usuario.nome}>
                      {usuario.nome}
                    </span>
                  </div>
                </td>
                <td className={CELL}>
                  <span className="block truncate text-sm text-fg" title={usuario.email}>
                    {usuario.email}
                  </span>
                </td>
                <td className={CELL}>
                  <PerfilBadge perfil={usuario.perfil} />
                </td>
                <td className={CELL}>
                  <ToggleStatusUsuario
                    usuario={usuario}
                    proprioUsuario={usuario.email.toLowerCase() === sessao}
                    onAlterado={onStatusAlterado}
                    onErro={onErroStatus}
                  />
                </td>
                <td className={CELL}>
                  <span className="text-sm text-fg">{formatarDataCriacao(usuario.criadoEm)}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
