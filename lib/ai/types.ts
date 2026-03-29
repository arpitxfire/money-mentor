export type AIFeature =
  | "portfolio"
  | "fire"
  | "health"
  | "tax"
  | "life-event";

export interface AIInsightRequest {
  feature: AIFeature;
  data: Record<string, unknown>;
  stream?: boolean;
}

export interface AIInsightResponse {
  insight: string;
  feature: AIFeature;
  timestamp: string;
}

export interface StreamChunk {
  type: "delta" | "done" | "error";
  content?: string;
  error?: string;
}
