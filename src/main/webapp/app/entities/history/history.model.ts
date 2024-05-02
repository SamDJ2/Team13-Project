import dayjs from 'dayjs/esm';

export interface IHistory {
  id: number;
  challengeName?: string | null;
  challengeLevel?: string | null;
  dateStarted?: dayjs.Dayjs | null;
  username?: string | null;
}

export type NewHistory = Omit<IHistory, 'id'> & { id: null };
