export interface IWeeklySummary {
  id: number;
  summaryID?: number | null;
  summaryText?: string | null;
}

export type NewWeeklySummary = Omit<IWeeklySummary, 'id'> & { id: null };
