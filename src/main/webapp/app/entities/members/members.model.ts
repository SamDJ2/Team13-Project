import { IGrouping } from 'app/entities/grouping/grouping.model';

export interface IMembers {
  id: number;
  groupID?: number | null;
  userID?: number | null;
  leader?: boolean | null;
  grouping?: Pick<IGrouping, 'id'> | null;
}

export type NewMembers = Omit<IMembers, 'id'> & { id: null };
