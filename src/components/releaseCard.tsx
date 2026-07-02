import type { ChangeEvent } from "react";
import { useAppDispatch } from "../app/hooks";
import { updateReleaseStatus } from "../features/releases/releasesSlice";
import type { Release } from "../features/releases/types";

interface ReleaseCardProps {
  release: Release;
  onEdit?: () => void;
  simulateFailure?: boolean;
  darkMode?: boolean;
}

function getRiskLevel(riskScore: number) {
  if (riskScore <= 39) {
    return {
      label: "Low",
      classes: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    };
  }

  if (riskScore <= 69) {
    return {
      label: "Medium",
      classes: "bg-amber-100 text-amber-800 ring-amber-200",
    };
  }

  return {
    label: "High",
    classes: "bg-rose-100 text-rose-800 ring-rose-200",
  };
}

function getStatusClasses(status: Release["status"]) {
  switch (status) {
    case "Approved":
      return "bg-teal-100 text-teal-800 ring-1 ring-teal-200";
    case "In Review":
      return "bg-fuchsia-100 text-fuchsia-800 ring-1 ring-fuchsia-200";
    default:
      return "bg-cyan-100 text-cyan-800 ring-1 ring-cyan-200";
  }
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

function ReleaseCard({ release, onEdit, simulateFailure = false, darkMode = false }: ReleaseCardProps) {
  const dispatch = useAppDispatch();
  const risk = getRiskLevel(release.riskScore);

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    dispatch(
      updateReleaseStatus({
        id: release.id,
        status: event.target.value as Release["status"],
        simulateFailure,
      })
    );
  };

  return (
    <article className={`rounded-2xl border p-6 shadow-sm transition-shadow duration-200 hover:shadow-md ${darkMode ? "border-slate-800 bg-slate-900 shadow-slate-950/40" : "border-slate-200 bg-white"}`}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className={`text-lg font-semibold ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{release.name}</h3>
            <p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{release.team}</p>
          </div>
          <div className="flex items-center gap-2">
            {onEdit ? (
              <button
                type="button"
                onClick={onEdit}
                className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${darkMode ? "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
              >
                Edit
              </button>
            ) : null}
            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ring-1 ${risk.classes}`}>
              {risk.label} risk
            </span>
          </div>
        </div>

        <div className={`grid gap-3 text-sm sm:grid-cols-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Release date
            </p>
            <p className="mt-1 font-medium">{formatDate(release.releaseDate)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Risk score
            </p>
            <p className="mt-1 font-medium">{release.riskScore}/100</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Status
            </p>
            <select
              value={release.status}
              onChange={handleStatusChange}
              className={`mt-1 rounded-full border border-transparent px-2.5 py-1 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 ${getStatusClasses(release.status)} ${darkMode ? "focus:ring-offset-slate-900" : "focus:ring-offset-white"}`}
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="In Review">In Review</option>
            </select>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ReleaseCard;
