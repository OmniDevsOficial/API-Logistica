import { useEffect, useState } from "react";
import {
  getDashboardData,
  type DashboardData,
  type PeriodOption,
} from "@entities/dashboard-metrics";
import { Sidebar } from "@widgets/sidebar";
import { DashboardTopbar } from "@widgets/dashboard-topbar";
import { DashboardOverview } from "@widgets/dashboard-overview";
import { formatDateRange } from "@shared/lib";

export function DashboardPage() {
  const [period, setPeriod] = useState<PeriodOption>("mes");
  const [data, setData] = useState<DashboardData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    getDashboardData(period).then((result) => {
      if (isCurrent) setData(result);
    });
    return () => {
      isCurrent = false;
    };
  }, [period]);

  return (
    <div className="min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="min-w-0 px-4 py-6 sm:px-10 sm:py-8 lg:ml-sidebar">
        <DashboardTopbar
          period={period}
          onPeriodChange={setPeriod}
          dateRangeLabel={
            data ? formatDateRange(data.periodo.inicio, data.periodo.fim) : ""
          }
          onMenuClick={() => setSidebarOpen(true)}
        />
        {data && <DashboardOverview data={data} />}
      </main>
    </div>
  );
}
