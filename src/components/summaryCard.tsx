import type { ReleaseSummary } from "../logic/getSummary";

interface SummaryCardProps {
  summary: ReleaseSummary;
  darkMode?: boolean;
}

function SummaryCard({ summary, darkMode = false }: SummaryCardProps) {
  const statusEntries = Object.entries(summary.releasesByStatus);

  return (
    <section className={`rounded-2xl border p-5 shadow-sm ${darkMode ? "border-slate-800 bg-slate-900 shadow-slate-950/40" : "border-slate-200 bg-white"}`}>
      <div className="grid gap-4 md:grid-cols-4">
        <div className={`rounded-xl p-4 ${darkMode ? "bg-slate-800" : "bg-slate-50"}`}>
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Total releases</p>
          <p className={`mt-2 text-2xl font-semibold ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
            {summary.totalReleases}
          </p>
        </div>

        <div className={`rounded-xl p-4 ${darkMode ? "bg-slate-800" : "bg-slate-50"}`}>
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Average risk</p>
          <p className={`mt-2 text-2xl font-semibold ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
            {summary.averageRiskScore.toFixed(1)}
          </p>
        </div>

        <div className={`rounded-xl p-4 ${darkMode ? "bg-slate-800" : "bg-slate-50"}`}>
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Highest risk</p>
          <p className={`mt-2 text-lg font-semibold ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
            {summary.highestRiskRelease}
          </p>
        </div>

        <div className={`rounded-xl p-4 ${darkMode ? "bg-slate-800" : "bg-slate-50"}`}>
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Status breakdown</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {statusEntries.map(([status, count]) => (
              <span
                key={status}
                className={`rounded-full border px-2.5 py-1 text-xs font-medium ${darkMode ? "border-slate-700 bg-slate-900 text-slate-200" : "border-slate-200 bg-white text-slate-700"}`}
              >
                {status}: {count}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SummaryCard