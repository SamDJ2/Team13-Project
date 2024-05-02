import dayjs from 'dayjs/esm';

export interface IGrouping {
  id: number;
  iD?: string | null;
  groupingName?: string | null;
  groupingPoints?: number | null;
  remainingTime?: string | null;
  currentDate?: dayjs.Dayjs | null;
}

export type NewGrouping = Omit<IGrouping, 'id'> & { id: null };
