import { IChallenges } from 'app/entities/challenges/challenges.model';
import { IHabit } from 'app/entities/habit/habit.model';
import { ILeaderBoards } from 'app/entities/leader-boards/leader-boards.model';
import { IProfileCustomization } from 'app/entities/profile-customization/profile-customization.model';
import { IMoodJournalPage } from 'app/entities/mood-journal-page/mood-journal-page.model';

export interface INavigationPortal {
  id: number;
  features?: string | null;
  selectedFeature?: boolean | null;
  challenges?: Pick<IChallenges, 'id'> | null;
  habit?: Pick<IHabit, 'id'> | null;
  leaderBoards?: Pick<ILeaderBoards, 'id'> | null;
  profileCustomization?: Pick<IProfileCustomization, 'id'> | null;
  moodJournalPage?: Pick<IMoodJournalPage, 'id'> | null;
}

export type NewNavigationPortal = Omit<INavigationPortal, 'id'> & { id: null };
