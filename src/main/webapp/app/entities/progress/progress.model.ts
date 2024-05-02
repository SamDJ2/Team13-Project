export interface IProgress {
  id: number;
  detoxProgress?: number | null;
  detoxTotal?: number | null;
  challengesInfo?: string | null;
  leaderboardInfo?: string | null;
}

export type NewProgress = Omit<IProgress, 'id'> & { id: null };
