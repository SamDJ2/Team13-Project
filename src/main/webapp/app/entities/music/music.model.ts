export interface IMusic {
  id: number;
  levels?: string | null;
  progress?: string | null;
  timer?: string | null;
}

export type NewMusic = Omit<IMusic, 'id'> & { id: null };
