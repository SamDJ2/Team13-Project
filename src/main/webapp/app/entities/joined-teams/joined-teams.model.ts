import dayjs from 'dayjs/esm';

export interface IJoinedTeams {
  id: number;
  teamID?: number | null;
  name?: string | null;
  description?: string | null;
  memberSince?: dayjs.Dayjs | null;
}

export type NewJoinedTeams = Omit<IJoinedTeams, 'id'> & { id: null };
