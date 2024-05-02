import { IGrouping } from 'app/entities/grouping/grouping.model';

export interface IBadges {
  id: number;
  badgeNo?: number | null;
  requiredPoints?: number | null;
  badge?: string | null;
  badgeContentType?: string | null;
  grouping?: Pick<IGrouping, 'id'> | null;
}

export type NewBadges = Omit<IBadges, 'id'> & { id: null };
