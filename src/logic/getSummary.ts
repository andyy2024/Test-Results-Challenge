import type { Release } from "../features/releases/types";

export interface ReleaseStatusCounts {
  Pending: number;
  "In Review": number;
  Approved: number;
}

export interface ReleaseSummary {
  totalReleases: number;
  averageRiskScore: number;
  highestRiskRelease: string;
  releasesByStatus: ReleaseStatusCounts;
}

export function calculateSummary(releases: Release[]): ReleaseSummary {

  if (releases.length === 0) {
    return {
      totalReleases: 0,
      averageRiskScore: 0,
      highestRiskRelease: "None",
      releasesByStatus: { Pending: 0, "In Review": 0, Approved: 0 }
    };
  }

  let totalRisk = 0;
  let highestRisk = -1;
  let highestRiskName = "";
  
  const statusCounts: ReleaseStatusCounts = {
    Pending: 0,
    "In Review": 0,
    Approved: 0
  };

  for (const release of releases) {
    totalRisk += release.riskScore;
    
    if (release.riskScore > highestRisk) {
      highestRisk = release.riskScore;
      highestRiskName = release.name;
    }

    statusCounts[release.status]++;
  }

  return {
    totalReleases: releases.length,
    averageRiskScore: Math.round((totalRisk / releases.length) * 10) / 10, // Rounds to 1 decimal place
    highestRiskRelease: highestRiskName,
    releasesByStatus: statusCounts
  };
}