export interface ISmoking {
  id: number;
  levels?: string | null;
  progress?: string | null;
  timer?: string | null;
}

export type NewSmoking = Omit<ISmoking, 'id'> & { id: null };
