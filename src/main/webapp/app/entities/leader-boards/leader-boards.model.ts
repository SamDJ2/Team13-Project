import { IGrouping } from 'app/entities/grouping/grouping.model';
import { IProgress } from 'app/entities/progress/progress.model';

export interface ILeaderBoards {
  id: number;
  standings?: string | null;
  grouping?: Pick<IGrouping, 'id'> | null;
  progress?: Pick<IProgress, 'id'> | null;
}

export type NewLeaderBoards = Omit<ILeaderBoards, 'id'> & { id: null };
