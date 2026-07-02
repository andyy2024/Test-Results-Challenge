import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAppDispatch } from "../app/hooks";
import { addRelease, updateRelease } from "../features/releases/releasesSlice";
import type { Release } from "../features/releases/types";

interface ReleaseFormProps {
  release?: Release;
  onCancel: () => void;
  simulateFailure?: boolean;
  darkMode?: boolean;
}

function ReleaseForm({ release, onCancel, simulateFailure = false, darkMode = false }: ReleaseFormProps) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<Release>({
    id: release?.id ?? "",
    name: release?.name ?? "",
    team: release?.team ?? "",
    releaseDate: release?.releaseDate ?? "",
    riskScore: release?.riskScore ?? 50,
    status: release?.status ?? "Pending",
  });

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData(current => ({
      ...current,
      [name]: name === "riskScore" ? Number(value) : value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedName = formData.name.trim();
    const normalizedTeam = formData.team.trim();

    if (!normalizedName || !normalizedTeam || !formData.releaseDate) {
      return;
    }

    const releaseToSave: Release = {
      ...formData,
      id: formData.id || `release-${Date.now()}`,
      name: normalizedName,
      team: normalizedTeam,
      riskScore: Math.min(100, Math.max(0, formData.riskScore)),
    };

    if (release?.id) {
      dispatch(updateRelease({ release: releaseToSave, simulateFailure }));
    } else {
      dispatch(addRelease(releaseToSave));
    }

    onCancel();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-2xl border p-6 shadow-sm transition-all duration-200 ${darkMode ? "border-slate-800 bg-slate-900 shadow-slate-950/40" : "border-slate-200 bg-slate-50"}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className={`text-lg font-semibold ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
            {release?.id ? "Edit release" : "Add release"}
          </h3>
          <p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            {release?.id ? "Update the release details below." : "Create a new release entry."}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Release name
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Release name"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Team
          <input
            name="team"
            value={formData.team}
            onChange={handleChange}
            placeholder="Team name"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Release date
          <input
            name="releaseDate"
            type="date"
            value={formData.releaseDate}
            onChange={handleChange}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Risk score
          <input
            name="riskScore"
            type="number"
            min="0"
            max="100"
            value={formData.riskScore}
            onChange={handleChange}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700 md:col-span-2">
          Status
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="In Review">In Review</option>
          </select>
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${darkMode ? "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`rounded-xl px-3 py-2 text-sm font-medium transition ${darkMode ? "bg-slate-100 text-slate-900 hover:bg-slate-200" : "bg-slate-900 text-white hover:bg-slate-800"}`}
        >
          Save release
        </button>
      </div>
    </form>
  );
}

export default ReleaseForm;
