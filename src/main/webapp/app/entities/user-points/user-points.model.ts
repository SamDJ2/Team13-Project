import { ILeaderBoards } from 'app/entities/leader-boards/leader-boards.model';

export interface IUserPoints {
  id: number;
  userID?: number | null;
  currentPoints?: number | null;
  previousPoints?: number | null;
  totalPoints?: number | null;
  leaderBoards?: Pick<ILeaderBoards, 'id'> | null;
}

export type NewUserPoints = Omit<IUserPoints, 'id'> & { id: null };
