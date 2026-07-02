import { describe, expect, it } from "vitest";
import { calculateSummary } from "./getSummary";
import type { Release } from "../features/releases/types";

describe("calculateSummary", () => {
  it("returns an empty summary for an empty array", () => {
    expect(calculateSummary([])).toEqual({
      totalReleases: 0,
      averageRiskScore: 0,
      highestRiskRelease: "None",
      releasesByStatus: {
        Pending: 0,
        "In Review": 0,
        Approved: 0,
      },
    });
  });

  it("calculates summary statistics correctly", () => {
    const releases: Release[] = [
      {
        id: "1",
        name: "Release A",
        team: "Payments",
        releaseDate: "2026-01-01",
        riskScore: 50,
        status: "Pending",
      },
      {
        id: "2",
        name: "Release B",
        team: "Infrastructure",
        releaseDate: "2026-01-02",
        riskScore: 80,
        status: "Approved",
      },
      {
        id: "3",
        name: "Release C",
        team: "Platform",
        releaseDate: "2026-01-03",
        riskScore: 70,
        status: "Pending",
      },
    ];

    expect(calculateSummary(releases)).toEqual({
      totalReleases: 3,
      averageRiskScore: 66.7,
      highestRiskRelease: "Release B",
      releasesByStatus: {
        Pending: 2,
        "In Review": 0,
        Approved: 1,
      },
    });
  });

  it("does not modify the original array", () => {
    const releases: Release[] = [
      {
        id: "1",
        name: "Release A",
        team: "Payments",
        releaseDate: "2026-01-01",
        riskScore: 50,
        status: "Pending",
      },
    ];

    const original = structuredClone(releases);

    calculateSummary(releases);

    expect(releases).toEqual(original);
  });
});