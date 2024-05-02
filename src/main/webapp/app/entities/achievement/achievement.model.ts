import dayjs from 'dayjs/esm';
import { AchievementType } from 'app/entities/enumerations/achievement-type.model';

export interface IAchievement {
  id: number;
  achievementID?: number | null;
  name?: string | null;
  description?: string | null;
  dateEarned?: dayjs.Dayjs | null;
  achievementType?: AchievementType | null;
}

export type NewAchievement = Omit<IAchievement, 'id'> & { id: null };
