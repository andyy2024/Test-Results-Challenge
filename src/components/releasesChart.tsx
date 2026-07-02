import type { Release } from "../features/releases/types";

type ReleasesChartProps = {
  releases: Release[];
  darkMode?: boolean;
};

function ReleasesChart({ releases, darkMode = false }: ReleasesChartProps) {
  const counts = {
    Low: releases.filter(release => release.riskScore <= 39).length,
    Medium: releases.filter(release => release.riskScore > 39 && release.riskScore <= 69).length,
    High: releases.filter(release => release.riskScore > 69).length,
  };

  const maxCount = Math.max(...Object.values(counts), 1);
  const chartHeight = 160;
  const bars = [
    { label: "Low", value: counts.Low, color: "bg-emerald-500" },
    { label: "Medium", value: counts.Medium, color: "bg-amber-500" },
    { label: "High", value: counts.High, color: "bg-rose-500" },
  ].map(bar => ({
    ...bar,
    height: bar.value === 0 ? 0 : Math.max(12, Math.round((bar.value / maxCount) * (chartHeight - 24))),
  }));

  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${darkMode ? "border-slate-800 bg-slate-900 shadow-slate-950/40" : "border-slate-200 bg-white"}`}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className={`text-lg font-semibold ${darkMode ? "text-slate-100" : "text-slate-900"}`}>Releases by risk level</h2>
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>A quick view of how releases are distributed.</p>
        </div>
      </div>

      <div className={`flex h-48 items-end gap-4 rounded-xl p-4 ${darkMode ? "bg-slate-800" : "bg-slate-50"}`}>
        {bars.map(bar => (
          <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-full w-full items-end justify-center">
              <div
                className={`w-full rounded-t-xl ${bar.color}`}
                style={{ height: `${bar.height}px` }}
              />
            </div>
            <div className="text-center">
              <p className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>{bar.label}</p>
              <p className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-500"}`}>{bar.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReleasesChart;
