import { IJoinedTeams } from 'app/entities/joined-teams/joined-teams.model';
import { ISetting } from 'app/entities/setting/setting.model';
import { IAchievement } from 'app/entities/achievement/achievement.model';

export interface IProfileCustomization {
  id: number;
  preferences?: boolean | null;
  privacySettings?: boolean | null;
  accountHistory?: string | null;
  bioDescription?: string | null;
  joinedTeams?: Pick<IJoinedTeams, 'id'> | null;
  setting?: Pick<ISetting, 'id'> | null;
  achievement?: Pick<IAchievement, 'id'> | null;
}

export type NewProfileCustomization = Omit<IProfileCustomization, 'id'> & { id: null };
