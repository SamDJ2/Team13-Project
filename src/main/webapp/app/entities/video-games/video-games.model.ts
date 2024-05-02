export interface IVideoGames {
  id: number;
  levels?: string | null;
  progress?: string | null;
  timer?: string | null;
}

export type NewVideoGames = Omit<IVideoGames, 'id'> & { id: null };
