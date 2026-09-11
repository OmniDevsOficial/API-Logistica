import { Bell, Calendar, Menu, Moon, Upload, User } from "lucide-react";
import type { PeriodOption } from "@entities/dashboard-metrics";
import { PeriodFilter } from "@features/period-filter";

interface DashboardTopbarProps {
  period: PeriodOption;
  onPeriodChange: (period: PeriodOption) => void;
  dateRangeLabel: string;
  onMenuClick: () => void;
}

const ICON_BUTTON_CLASS =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-black cursor-pointer hover:text-fg";

const UPLOAD_BUTTON_CLASS =
  "inline-flex cursor-not-allowed items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white";

const DATE_RANGE_CLASS =
  "flex items-center gap-2 whitespace-nowrap rounded-md bg-surface px-4 py-2.5 text-sm font-medium text-black";

export function DashboardTopbar({
  period,
  onPeriodChange,
  dateRangeLabel,
  onMenuClick,
}: DashboardTopbarProps) {
  return (
    <header className="mb-7">
      <div className="flex flex-col gap-4 sm:hidden">
        <div className="flex items-center justify-between">
          <button
            type="button"
            className={ICON_BUTTON_CLASS}
            aria-label="Abrir menu"
            onClick={onMenuClick}
          >
            <Menu size={18} />
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className={ICON_BUTTON_CLASS}
              aria-label="Alternar tema"
            >
              <Moon size={18} />
            </button>
            <button
              type="button"
              className={ICON_BUTTON_CLASS}
              aria-label="Notificações"
            >
              <Bell size={18} />
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-border text-fg-muted">
              <User size={18} />
            </div>
          </div>
        </div>

        <h1 className="text-[28px] font-semibold text-fg">Dashboard</h1>

        <div className="flex items-center justify-between gap-3">
          <button type="button" className={UPLOAD_BUTTON_CLASS} disabled>
            <Upload size={16} />
            Upload
          </button>

          <PeriodFilter value={period} onChange={onPeriodChange} />
        </div>

        <div className={`${DATE_RANGE_CLASS} w-full justify-center`}>
          <Calendar size={16} />
          <span>{dateRangeLabel}</span>
        </div>
      </div>

      <div className="hidden sm:flex sm:flex-col sm:gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className={`${ICON_BUTTON_CLASS} lg:hidden`}
              aria-label="Abrir menu"
              onClick={onMenuClick}
            >
              <Menu size={18} />
            </button>
            <h1 className="text-[28px] font-semibold text-fg">Dashboard</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className={ICON_BUTTON_CLASS}
              aria-label="Alternar tema"
            >
              <Moon size={18} />
            </button>
            <button
              type="button"
              className={ICON_BUTTON_CLASS}
              aria-label="Notificações"
            >
              <Bell size={18} />
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-border text-fg-muted">
              <User size={18} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button type="button" className={UPLOAD_BUTTON_CLASS} disabled>
            <Upload size={16} />
            Upload
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <PeriodFilter value={period} onChange={onPeriodChange} />

            <div className={DATE_RANGE_CLASS}>
              <Calendar size={16} />
              <span>{dateRangeLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
