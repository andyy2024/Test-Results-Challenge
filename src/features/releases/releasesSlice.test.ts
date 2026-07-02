import { describe, expect, it } from "vitest";
import reducer, { updateRelease } from "./releasesSlice";

const initialState = {
  releases: [],
  fetch: { status: "idle" as const, error: null as string | null },
  update: { status: "idle" as const, error: null as string | null },
  delete: { status: "idle" as const, error: null as string | null },
};

describe("releases slice request state", () => {
  it("keeps fetch state separate from update failures", () => {
    const state = reducer(
      {
        ...initialState,
        fetch: { status: "success", error: null },
        update: { status: "success", error: null },
      },
      {
        type: updateRelease.rejected.type,
        payload: "Request failed.",
      }
    );

    expect(state.fetch.status).toBe("success");
    expect(state.fetch.error).toBeNull();
    expect(state.update.status).toBe("error");
    expect(state.update.error).toBe("Request failed.");
  });
});
