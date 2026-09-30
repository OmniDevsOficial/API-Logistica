import type { ComponentType } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  User,
  ClipboardList,
  Truck,
  Trophy,
  Settings,
  LogOut,
  X,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  path?: string;
}

const MAIN_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: LayoutGrid, path: "/" },
  { label: "Motoristas", icon: User, path: "/motoristas" },
  { label: "Registros", icon: ClipboardList },
  { label: "Viagens", icon: Truck, path: "/viagens" },
  { label: "Ranking", icon: Trophy },
];

const NAV_ITEM_BASE_CLASS =
  "flex items-center gap-3 rounded-md px-3 py-[11px] text-sm font-medium";
const NAV_ITEM_INACTIVE_CLASS = `${NAV_ITEM_BASE_CLASS} text-black`;
const NAV_ITEM_ACTIVE_CLASS = `${NAV_ITEM_BASE_CLASS} bg-primary font-semibold text-white`;
const NAV_ITEM_DISABLED_CLASS = `${NAV_ITEM_BASE_CLASS} cursor-default text-black`;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed top-0 left-0 z-50 flex h-screen w-sidebar flex-col overflow-y-auto bg-surface px-5 py-7 transition-transform duration-200 ease-out lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-10 flex items-center justify-between px-2">
          <div className="min-w-0 flex-1">
            <img
              src="/logo.png"
              alt="Newe Logística Integrada"
              className="h-auto w-full object-contain"
            />
          </div>
          <button
            type="button"
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-fg-muted hover:bg-background hover:text-fg lg:hidden"
            aria-label="Fechar menu"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {MAIN_NAV_ITEMS.map(({ label, icon: Icon, path }) =>
            path ? (
              <NavLink
                key={label}
                to={path}
                end={path === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  isActive ? NAV_ITEM_ACTIVE_CLASS : NAV_ITEM_INACTIVE_CLASS
                }
              >
                <Icon size={18} strokeWidth={2} />
                <span>{label}</span>
              </NavLink>
            ) : (
              <div key={label} className={NAV_ITEM_DISABLED_CLASS}>
                <Icon size={18} strokeWidth={2} />
                <span>{label}</span>
              </div>
            ),
          )}
        </nav>

        <div className="flex flex-col gap-1">
          <div className={NAV_ITEM_INACTIVE_CLASS}>
            <Settings size={18} strokeWidth={2} />
            <span>Settings</span>
          </div>
          <div className={NAV_ITEM_INACTIVE_CLASS}>
            <LogOut size={18} strokeWidth={2} />
            <span>Log out</span>
          </div>
        </div>
      </aside>
    </>
  );
}
