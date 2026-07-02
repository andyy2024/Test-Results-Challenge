import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Release } from "./types";

interface RequestState {
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
}

interface ReleasesState {
  releases: Release[];
  fetch: RequestState;
  update: RequestState;
  delete: RequestState;
}

interface UpdateReleaseStatusPayload {
  id: string;
  status: Release["status"];
  simulateFailure?: boolean;
}

interface UpdateReleasePayload {
  release: Release;
  simulateFailure?: boolean;
}

const LOCAL_STORAGE_KEY = "release-statuses";

const getPersistedStatuses = (): Record<string, Release["status"]> => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const storedStatuses = window.localStorage.getItem(LOCAL_STORAGE_KEY);

    return storedStatuses ? JSON.parse(storedStatuses) : {};
  } catch {
    return {};
  }
};

const persistStatuses = (releases: Release[]) => {
  if (typeof window === "undefined") {
    return;
  }

  const statuses = releases.reduce<Record<string, Release["status"]>>(
    (accumulator, release) => {
      accumulator[release.id] = release.status;
      return accumulator;
    },
    {}
  );

  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(statuses));
};

const applyPersistedStatuses = (releases: Release[]) => {
  const persistedStatuses = getPersistedStatuses();

  return releases.map(release => {
    const persistedStatus = persistedStatuses[release.id];
    return persistedStatus ? { ...release, status: persistedStatus } : release;
  });
};

const initialState: ReleasesState = {
  releases: [],
  fetch: { status: "idle", error: null },
  update: { status: "idle", error: null },
  delete: { status: "idle", error: null },
};

const releasesSlice = createSlice({
  name: "releases",
  initialState,
  reducers: {
    setReleases(state, action: PayloadAction<Release[]>) {
      state.releases = action.payload;
    },

    addRelease(state, action: PayloadAction<Release>) {
      state.releases.push(action.payload);
    },

    optimisticallyUpdateRelease(
      state,
      action: PayloadAction<{ release: Release }>
    ) {
      const index = state.releases.findIndex(
        release => release.id === action.payload.release.id
      );

      if (index !== -1) {
        state.releases[index] = action.payload.release;
        persistStatuses(state.releases);
      }
    },

    optimisticallyUpdateReleaseStatus(
      state,
      action: PayloadAction<{ id: string; status: Release["status"] }>
    ) {
      const release = state.releases.find(r => r.id === action.payload.id);

      if (release) {
        release.status = action.payload.status;
        persistStatuses(state.releases);
      }
    },

    rollbackRelease(state, action: PayloadAction<{ release: Release }>) {
      const index = state.releases.findIndex(
        release => release.id === action.payload.release.id
      );

      if (index !== -1) {
        state.releases[index] = action.payload.release;
        persistStatuses(state.releases);
      }
    },

    deleteRelease(state, action: PayloadAction<string>) {
      state.releases = state.releases.filter(r => r.id !== action.payload);
    },
  },

  extraReducers: builder => {
    builder
      .addCase(fetchReleases.pending, state => {
        state.fetch.status = "loading";
        state.fetch.error = null;
      })
      .addCase(fetchReleases.fulfilled, (state, action) => {
        state.fetch.status = "success";
        state.fetch.error = null;
        state.releases = applyPersistedStatuses(action.payload);
      })
      .addCase(fetchReleases.rejected, (state, action) => {
        state.fetch.status = "error";
        state.fetch.error = action.error.message ?? "Unknown error";
      })
      .addCase(updateReleaseStatus.pending, state => {
        state.update.status = "loading";
        state.update.error = null;
      })
      .addCase(updateReleaseStatus.fulfilled, state => {
        state.update.status = "success";
        state.update.error = null;
      })
      .addCase(updateReleaseStatus.rejected, (state, action) => {
        state.update.status = "error";
        state.update.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          "Request failed.";
      })
      .addCase(updateRelease.pending, state => {
        state.update.status = "loading";
        state.update.error = null;
      })
      .addCase(updateRelease.fulfilled, state => {
        state.update.status = "success";
        state.update.error = null;
      })
      .addCase(updateRelease.rejected, (state, action) => {
        state.update.status = "error";
        state.update.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          "Request failed.";
      });
  },
});

export const {
  setReleases,
  addRelease,
  optimisticallyUpdateRelease,
  optimisticallyUpdateReleaseStatus,
  rollbackRelease,
  deleteRelease,
} = releasesSlice.actions;

export const updateReleaseStatus = createAsyncThunk(
  "releases/updateReleaseStatus",
  async (
    { id, status, simulateFailure = false }: UpdateReleaseStatusPayload,
    { dispatch, getState, rejectWithValue }
  ) => {
    const previousRelease = (
      getState() as { releases: { releases: Release[] } }
    ).releases.releases.find(release => release.id === id);

    if (!previousRelease) {
      return rejectWithValue("Release not found.");
    }

    dispatch(optimisticallyUpdateReleaseStatus({ id, status }));

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (simulateFailure) {
      dispatch(rollbackRelease({ release: previousRelease }));
      window.alert("Request failed and rollback was performed.");
      return rejectWithValue("Request failed.");
    }

    return { id, status };
  }
);

export const updateRelease = createAsyncThunk(
  "releases/updateRelease",
  async (
    { release, simulateFailure = false }: UpdateReleasePayload,
    { dispatch, getState, rejectWithValue }
  ) => {
    const previousRelease = (
      getState() as { releases: { releases: Release[] } }
    ).releases.releases.find(item => item.id === release.id);

    if (!previousRelease) {
      return rejectWithValue("Release not found.");
    }

    dispatch(optimisticallyUpdateRelease({ release }));

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (simulateFailure) {
      dispatch(rollbackRelease({ release: previousRelease }));
      window.alert("Request failed and rollback was performed.");
      return rejectWithValue("Request failed.");
    }

    return { release };
  }
);

export const fetchReleases = createAsyncThunk(
  "releases/fetchReleases",
  async () => {
    await new Promise(resolve => setTimeout(resolve, 3000));

    const response = await fetch("/data.json");

    if (!response.ok) {
      throw new Error("Failed to load releases.");
    }

    const data = await response.json();

    return data;
  }
);

export default releasesSlice.reducer;