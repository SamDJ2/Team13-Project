export interface IJunkFood {
  id: number;
  levels?: string | null;
  progress?: string | null;
  timer?: string | null;
}

export type NewJunkFood = Omit<IJunkFood, 'id'> & { id: null };
