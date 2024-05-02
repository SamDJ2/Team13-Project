export interface IHabit {
  id: number;
  habitID?: number | null;
  habitName?: string | null;
}

export type NewHabit = Omit<IHabit, 'id'> & { id: null };
