import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { rotaInicial, useSessao } from "@entities/sessao";
import { SinoNotificacoes } from "@features/notificacoes";
import { Sidebar } from "@widgets/sidebar";
import { PageHeader } from "@shared/ui";
import { SECOES_ADMINISTRACAO } from "../config/secoes";
import { secaoPermitida, secoesDoPerfil } from "../lib/secoesDoPerfil";
import { NavegacaoSecoes } from "./NavegacaoSecoes";
import { MenuPerfil } from "@features/menu-perfil";

export function AdministracaoPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { secao: idSecao } = useParams();
  const { usuario } = useSessao();

  if (!usuario) return null;

  const secoes = secoesDoPerfil(SECOES_ADMINISTRACAO, usuario.perfil);
  const atual = secaoPermitida(SECOES_ADMINISTRACAO, usuario.perfil, idSecao);

  if (!atual) {
    const destino = secoes[0] ? `/administracao/${secoes[0].id}` : rotaInicial(usuario.perfil);
    return <Navigate to={destino} replace />;
  }

  const { componente: Conteudo } = atual;

  return (
    <div className="min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="min-w-0 px-4 py-6 sm:px-10 sm:py-8 lg:ml-sidebar">
        <header className="mb-7">
          <PageHeader
            title="Administração"
            subtitle="Gestão dos usuários do sistema"
            onMenuClick={() => setSidebarOpen(true)}
            perfil={<MenuPerfil />}
            notificacoes={<SinoNotificacoes />}
          />
        </header>

        {secoes.length > 1 ? (
          <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
            <NavegacaoSecoes secoes={secoes} />
            <div key={atual.id} className="min-w-0 animate-surgir">
              <Conteudo />
            </div>
          </div>
        ) : (
          <div className="min-w-0">
            <Conteudo />
          </div>
        )}
      </main>
    </div>
  );
}
