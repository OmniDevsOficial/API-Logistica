import { formatarDataCriacao, PerfilBadge, type Usuario } from "@entities/usuario";
import { ToggleStatusUsuario } from "@features/alterar-status-usuario";

const HEADER_CELL = "whitespace-nowrap py-3 pr-6 text-left text-xs font-semibold text-fg-muted";
const CELL = "py-4 pr-6 align-middle";

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  const primeira = partes[0]?.[0] ?? "";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return `${primeira}${ultima}`.toUpperCase() || "?";
}

interface Propriedades {
  usuarios: Usuario[];
  emailSessao: string | null;
  onStatusAlterado: (usuario: Usuario) => void;
  onErroStatus: (mensagem: string) => void;
}

export function UsuariosTabela({ usuarios, emailSessao, onStatusAlterado, onErroStatus }: Propriedades) {
  const sessao = emailSessao?.toLowerCase() ?? null;

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
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td className={`${CELL} pl-6`}>
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary dark:bg-primary/20 dark:text-grafico-claro"
                    aria-hidden="true"
                  >
                    {iniciais(usuario.nome)}
                  </span>
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
