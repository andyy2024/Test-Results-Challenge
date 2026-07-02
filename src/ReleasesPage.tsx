import { useEffect, useMemo, useState } from "react";
import ReleaseCard from "./components/releaseCard";
import ReleaseForm from "./components/releaseForm";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { fetchReleases } from "./features/releases/releasesSlice";
import SummaryCard from "./components/summaryCard";
import ReleasesChart from "./components/releasesChart";
import { calculateSummary } from "./logic/getSummary";
import type { Release } from "./features/releases/types";

function ReleasesPage() {
  const dispatch = useAppDispatch();
  const [statusFilter, setStatusFilter] = useState<Release["status"] | "All">("All");
  const [riskFilter, setRiskFilter] = useState<"All" | "Low" | "Medium" | "High">("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"riskScore" | "releaseDate">("releaseDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const savedTheme = window.localStorage.getItem("theme");

    if (savedTheme) {
      return savedTheme === "dark";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const pageSize = 4;

  useEffect(() => {
    dispatch(fetchReleases());
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    document.documentElement.style.colorScheme = isDarkMode ? "dark" : "light";
    window.localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const { fetch, releases, update } = useAppSelector(state => state.releases);
  const isLoading = fetch.status === "loading";
  const fetchError = fetch.status === "error" ? fetch.error : null;
  const summary = calculateSummary(releases);

  const filteredReleases = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();

    const filtered = releases.filter(release => {
      const matchesStatus = statusFilter === "All" || release.status === statusFilter;
      const matchesRisk =
        riskFilter === "All" ||
        (riskFilter === "Low" && release.riskScore <= 39) ||
        (riskFilter === "Medium" && release.riskScore > 39 && release.riskScore <= 69) ||
        (riskFilter === "High" && release.riskScore > 69);
      const matchesSearch =
        normalizedQuery.length === 0 ||
        release.name.toLowerCase().includes(normalizedQuery) ||
        release.team.toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesRisk && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      const comparisonValue =
        sortBy === "riskScore"
          ? a.riskScore - b.riskScore
          : new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();

      return sortDirection === "asc" ? comparisonValue : -comparisonValue;
    });
  }, [releases, searchTerm, statusFilter, riskFilter, sortBy, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredReleases.length / pageSize));
  const pagedReleases = filteredReleases.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, riskFilter, sortBy, sortDirection]);

  const handleCreateRelease = () => {
    setEditingId(null);
    setIsCreating(true);
  };

  const handleCloseForm = () => {
    setEditingId(null);
    setIsCreating(false);
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const surfaceClassName = isDarkMode
    ? "border-slate-800 bg-slate-900 shadow-slate-950/40"
    : "border-slate-200 bg-white shadow-sm";
  const mutedTextClassName = isDarkMode ? "text-slate-400" : "text-slate-500";
  const secondaryTextClassName = isDarkMode ? "text-slate-300" : "text-slate-700";
  const inputClassName = isDarkMode
    ? "rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-slate-500"
    : "rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none ring-0 focus:border-slate-400";

  if (isLoading) {
    return (

      <div className="flex flex-col h-screen w-screen justify-center items-center gap-2">

        <div aria-label="Orange and tan hamster running in a metal wheel" role="img" className="wheel-and-hamster">
          <div className="wheel"></div>
          <div className="hamster">
            <div className="hamster__body">
              <div className="hamster__head">
                <div className="hamster__ear"></div>
                <div className="hamster__eye"></div>
                <div className="hamster__nose"></div>
              </div>
              <div className="hamster__limb hamster__limb--fr"></div>
              <div className="hamster__limb hamster__limb--fl"></div>
              <div className="hamster__limb hamster__limb--br"></div>
              <div className="hamster__limb hamster__limb--bl"></div>
              <div className="hamster__tail"></div>
            </div>
          </div>
          <div className="spoke"></div>
        </div>
        <p className="p-6 font-semibold text-slate-600 text-2-xl">Loading...</p>
      </div>


    );
  }

  if (fetchError) {
    return (

      <div className="flex flex-col h-screen w-screen justify-center items-center">

        <div className="main_wrapper">
          <div className="main">
            <div className="antenna">
              <div className="antenna_shadow" />
              <div className="a1" />
              <div className="a1d" />
              <div className="a2" />
              <div className="a2d" />
              <div className="a_base" />
            </div>
            <div className="tv">
              <div className="cruve">
                <svg className="curve_svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 189.929 189.929" xmlSpace="preserve">
                  <path d="M70.343,70.343c-30.554,30.553-44.806,72.7-39.102,115.635l-29.738,3.951C-5.442,137.659,11.917,86.34,49.129,49.13
        C86.34,11.918,137.664-5.445,189.928,1.502l-3.95,29.738C143.041,25.54,100.895,39.789,70.343,70.343z" />
                </svg>
              </div>
              <div className="display_div">
                <div className="screen_out">
                  <div className="screen_out1">
                    <div className="screen">
                      <span className="notfound_text"> NOT FOUND</span>
                    </div>
                    <div className="screenM">
                      <span className="notfound_text"> NOT FOUND</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lines">
                <div className="line1" />
                <div className="line2" />
                <div className="line3" />
              </div>
              <div className="buttons_div">
                <div className="b1"><div /></div>
                <div className="b2" />
                <div className="speakers">
                  <div className="g1">
                    <div className="g11" />
                    <div className="g12" />
                    <div className="g13" />
                  </div>
                  <div className="g" />
                  <div className="g" />
                </div>
              </div>
            </div>
            <div className="bottom">
              <div className="base1" />
              <div className="base2" />
              <div className="base3" />
            </div>
          </div>
          <div className="text_404">
            <div className="text_4041">4</div>
            <div className="text_4042">0</div>
            <div className="text_4043">4</div>
          </div>
        </div>

        <p className="text-orange-700 bg-orange-100 border border-2 rounded-lg p-3">{fetch.error}</p>

      </div>

    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      <div className="mx-auto flex max-w-6xl flex-col gap-4 p-6">


        <div className="mb-2 flex justify-center items-center gap-3">
          <img className={`h-15 ${isDarkMode ? "invert" : ""}`} src="favicon.svg"></img>
          <h1 className={`text-4xl font-bold ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
            Release Risk Dashboard
          </h1>
        </div>

        {/* DarkMode Toogle */}
        <div className="flex justify-end">
          <label className="theme-switch">
            <input
              type="checkbox"
              className="theme-switch__checkbox"
              checked={isDarkMode}
              onChange={() => setIsDarkMode(current => !current)}
            />
            <div className="theme-switch__container">
              <div className="theme-switch__clouds"></div>
              <div className="theme-switch__stars-container">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 55" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M135.831 3.00688C135.055 3.85027 134.111 4.29946 133 4.35447C134.111 4.40947 135.055 4.85867 135.831 5.71123C136.607 6.55462 136.996 7.56303 136.996 8.72727C136.996 7.95722 137.172 7.25134 137.525 6.59129C137.886 5.93124 138.372 5.39954 138.98 5.00535C139.598 4.60199 140.268 4.39114 141 4.35447C139.88 4.2903 138.936 3.85027 138.16 3.00688C137.384 2.16348 136.996 1.16425 136.996 0C136.996 1.16425 136.607 2.16348 135.831 3.00688ZM31 23.3545C32.1114 23.2995 33.0551 22.8503 33.8313 22.0069C34.6075 21.1635 34.9956 20.1642 34.9956 19C34.9956 20.1642 35.3837 21.1635 36.1599 22.0069C36.9361 22.8503 37.8798 23.2903 39 23.3545C38.2679 23.3911 37.5976 23.602 36.9802 24.0053C36.3716 24.3995 35.8864 24.9312 35.5248 25.5913C35.172 26.2513 34.9956 26.9572 34.9956 27.7273C34.9956 26.563 34.6075 25.5546 33.8313 24.7112C33.0551 23.8587 32.1114 23.4095 31 23.3545ZM0 36.3545C1.11136 36.2995 2.05513 35.8503 2.83131 35.0069C3.6075 34.1635 3.99559 33.1642 3.99559 32C3.99559 33.1642 4.38368 34.1635 5.15987 35.0069C5.93605 35.8503 6.87982 36.2903 8 36.3545C7.26792 36.3911 6.59757 36.602 5.98015 37.0053C5.37155 37.3995 4.88644 37.9312 4.52481 38.5913C4.172 39.2513 3.99559 39.9572 3.99559 40.7273C3.99559 39.563 3.6075 38.5546 2.83131 37.7112C2.05513 36.8587 1.11136 36.4095 0 36.3545ZM56.8313 24.0069C56.0551 24.8503 55.1114 25.2995 54 25.3545C55.1114 25.4095 56.0551 25.8587 56.8313 26.7112C57.6075 27.5546 57.9956 28.563 57.9956 29.7273C57.9956 28.9572 58.172 28.2513 58.5248 27.5913C58.8864 26.9312 59.3716 26.3995 59.9802 26.0053C60.5976 25.602 61.2679 25.3911 62 25.3545C60.8798 25.2903 59.9361 24.8503 59.1599 24.0069C58.3837 23.1635 57.9956 22.1642 57.9956 21C57.9956 22.1642 57.6075 23.1635 56.8313 24.0069ZM81 25.3545C82.1114 25.2995 83.0551 24.8503 83.8313 24.0069C84.6075 23.1635 84.9956 22.1642 84.9956 21C84.9956 22.1642 85.3837 23.1635 86.1599 24.0069C86.9361 24.8503 87.8798 25.2903 89 25.3545C88.2679 25.3911 87.5976 25.602 86.9802 26.0053C86.3716 26.3995 85.8864 26.9312 85.5248 27.5913C85.172 28.2513 84.9956 28.9572 84.9956 29.7273C84.9956 28.563 84.6075 27.5546 83.8313 26.7112C83.0551 25.8587 82.1114 25.4095 81 25.3545ZM136 36.3545C137.111 36.2995 138.055 35.8503 138.831 35.0069C139.607 34.1635 139.996 33.1642 139.996 32C139.996 33.1642 140.384 34.1635 141.16 35.0069C141.936 35.8503 142.88 36.2903 144 36.3545C143.268 36.3911 142.598 36.602 141.98 37.0053C141.372 37.3995 140.886 37.9312 140.525 38.5913C140.172 39.2513 139.996 39.9572 139.996 40.7273C139.996 39.563 139.607 38.5546 138.831 37.7112C138.055 36.8587 137.111 36.4095 136 36.3545ZM101.831 49.0069C101.055 49.8503 100.111 50.2995 99 50.3545C100.111 50.4095 101.055 50.8587 101.831 51.7112C102.607 52.5546 102.996 53.563 102.996 54.7273C102.996 53.9572 103.172 53.2513 103.525 52.5913C103.886 51.9312 104.372 51.3995 104.98 51.0053C105.598 50.602 106.268 50.3911 107 50.3545C105.88 50.2903 104.936 49.8503 104.16 49.0069C103.384 48.1635 102.996 47.1642 102.996 46C102.996 47.1642 102.607 48.1635 101.831 49.0069Z" fill="currentColor"></path>
                </svg>
              </div>
              <div className="theme-switch__circle-container">
                <div className="theme-switch__sun-moon-container">
                  <div className="theme-switch__moon">
                    <div className="theme-switch__spot"></div>
                    <div className="theme-switch__spot"></div>
                    <div className="theme-switch__spot"></div>
                  </div>
                </div>
              </div>
            </div>
          </label>
        </div>

        <div className="mb-2">
          <h1 className={`text-2xl font-semibold ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
            Releases Summary
          </h1>
          <p className={`text-sm ${mutedTextClassName}`}>See the full picture.</p>
        </div>

        {update.status === "error" && update.error ? (
          <div className={`rounded-2xl border p-3 text-sm ${isDarkMode ? "border-rose-800/50 bg-rose-950/40 text-rose-300" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
            {update.error}
          </div>
        ) : null}

        <SummaryCard summary={summary} darkMode={isDarkMode} />

        <ReleasesChart releases={releases} darkMode={isDarkMode} />

        <div className="mb-2">
          <h1 className={`text-2xl font-semibold ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
            Releases
          </h1>
          <p className={`text-sm ${mutedTextClassName}`}>Track release status and risk levels.</p>
        </div>

        <div className={`rounded-2xl border p-4 ${surfaceClassName}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className={`text-sm ${mutedTextClassName}`}>Refine the releases by status, risk, or text search.</p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSimulateFailure(current => !current)}
                className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${simulateFailure
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : isDarkMode
                    ? "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
              >
                {simulateFailure ? "Simulate failure: On" : "Simulate failure: Off"}
              </button>
              <button
                type="button"
                onClick={handleCreateRelease}
                className={`rounded-xl px-3 py-2 text-sm font-medium transition ${isDarkMode ? "bg-slate-100 text-slate-900 hover:bg-slate-200" : "bg-slate-900 text-white hover:bg-slate-800"}`}
              >
                Add release
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className={`flex flex-col gap-1 text-sm font-medium ${secondaryTextClassName}`}>
              Search
              <input
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
                placeholder="Search release or team"
                className={inputClassName}
              />
            </label>

            <label className={`flex flex-col gap-1 text-sm font-medium ${secondaryTextClassName}`}>
              Status
              <select
                value={statusFilter}
                onChange={event => setStatusFilter(event.target.value as Release["status"] | "All")}
                className={inputClassName}
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="In Review">In Review</option>
              </select>
            </label>

            <label className={`flex flex-col gap-1 text-sm font-medium ${secondaryTextClassName}`}>
              Risk level
              <select
                value={riskFilter}
                onChange={event => setRiskFilter(event.target.value as "All" | "Low" | "Medium" | "High")}
                className={inputClassName}
              >
                <option value="All">All</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
              <label className={`flex flex-col gap-1 text-sm font-medium ${secondaryTextClassName}`}>
                Sort by
                <select
                  value={sortBy}
                  onChange={event => setSortBy(event.target.value as "riskScore" | "releaseDate")}
                  className={inputClassName}
                >
                  <option value="releaseDate">Release date</option>
                  <option value="riskScore">Risk score</option>
                </select>
              </label>

              <label className={`flex flex-col gap-1 text-sm font-medium ${secondaryTextClassName}`}>
                Direction
                <select
                  value={sortDirection}
                  onChange={event => setSortDirection(event.target.value as "asc" | "desc")}
                  className={inputClassName}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        {filteredReleases.length === 0 ? (
          <p className={`rounded-2xl border border-dashed p-6 text-center text-sm ${isDarkMode ? "border-slate-700 bg-slate-900 text-slate-400" : "border-slate-300 bg-slate-50 text-slate-600"}`}>
            No releases match the selected filters.
          </p>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              {isCreating ? (
                <ReleaseForm onCancel={handleCloseForm} simulateFailure={simulateFailure} darkMode={isDarkMode} />
              ) : null}

              {pagedReleases.map(release =>
                editingId === release.id ? (
                  <ReleaseForm
                    key={release.id}
                    release={release}
                    onCancel={handleCloseForm}
                    simulateFailure={simulateFailure}
                    darkMode={isDarkMode}
                  />
                ) : (
                  <ReleaseCard
                    key={release.id}
                    release={release}
                    simulateFailure={simulateFailure}
                    darkMode={isDarkMode}
                    onEdit={() => {
                      setEditingId(release.id);
                      setIsCreating(false);
                    }}
                  />
                )
              )}
            </div>

            <div className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 ${surfaceClassName}`}>
              <p className={`text-sm ${mutedTextClassName}`}>
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className={`rounded-xl border px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 ${isDarkMode ? "border-slate-700 bg-slate-800 text-slate-200" : "border-slate-200 bg-white text-slate-700"}`}
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                  className={`rounded-xl border px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 ${isDarkMode ? "border-slate-700 bg-slate-800 text-slate-200" : "border-slate-200 bg-white text-slate-700"}`}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ReleasesPage