export interface IMovies {
  id: number;
  levels?: string | null;
  progress?: string | null;
  timer?: string | null;
}

export type NewMovies = Omit<IMovies, 'id'> & { id: null };
