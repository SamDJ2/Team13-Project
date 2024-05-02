export interface IAlcohol {
  id: number;
  levels?: string | null;
  progress?: string | null;
  timer?: string | null;
}

export type NewAlcohol = Omit<IAlcohol, 'id'> & { id: null };
