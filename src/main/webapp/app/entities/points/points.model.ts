import { ILeaderBoards } from 'app/entities/leader-boards/leader-boards.model';

export interface IPoints {
  id: number;
  username?: string | null;
  currentPoints?: number | null;
  previousPoints?: number | null;
  totalPoints?: number | null;
  leaderBoards?: Pick<ILeaderBoards, 'id'> | null;
}

export type NewPoints = Omit<IPoints, 'id'> & { id: null };
