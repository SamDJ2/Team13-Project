import dayjs from 'dayjs/esm';
import { IWeeklySummary } from 'app/entities/weekly-summary/weekly-summary.model';
import { IHabit } from 'app/entities/habit/habit.model';

export interface INewWeeklyHabitTracker {
  id: number;
  recordID?: number | null;
  habitCompletion?: boolean | null;
  date?: dayjs.Dayjs | null;
  weeklySummary?: Pick<IWeeklySummary, 'id'> | null;
  habit?: Pick<IHabit, 'id'> | null;
}

export type NewNewWeeklyHabitTracker = Omit<INewWeeklyHabitTracker, 'id'> & { id: null };
