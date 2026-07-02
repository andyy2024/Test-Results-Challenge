export interface Release {
  id: string;
  name: string;
  team: string;
  releaseDate: string;
  riskScore: number;
  status: "Pending" | "Approved" | "In Review";
}