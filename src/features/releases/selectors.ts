import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

export const selectReleases = (state: RootState) =>
  state.releases.releases;

// Memoized selector to find a specific release by ID
export const selectReleaseById = (id: string) => 
  createSelector(
    [selectReleases], 
    (releases) => releases.find(r => r.id === id)
  );