export interface IHabitstracking {
  id: number;
  nameOfHabit?: string | null;
  dayOfHabit?: string | null;
  weekOfHabit?: number | null;
  completedHabit?: boolean | null;
  usernameHabit?: string | null;
  habitIDEN?: number | null;
  summary?: string | null;
}

export type NewHabitstracking = Omit<IHabitstracking, 'id'> & { id: null };
