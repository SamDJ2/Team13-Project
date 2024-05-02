import dayjs from 'dayjs/esm';
import { IUserDB } from 'app/entities/user-db/user-db.model';

export interface ITimer {
  id: number;
  startTime?: dayjs.Dayjs | null;
  isActive?: boolean | null;
  timings?: Pick<IUserDB, 'id'> | null;
}

export type NewTimer = Omit<ITimer, 'id'> & { id: null };
