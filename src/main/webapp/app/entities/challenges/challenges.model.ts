import { IProgress } from 'app/entities/progress/progress.model';
import { IJunkFood } from 'app/entities/junk-food/junk-food.model';
import { IScreenTime } from 'app/entities/screen-time/screen-time.model';
import { IAlcohol } from 'app/entities/alcohol/alcohol.model';
import { ISmoking } from 'app/entities/smoking/smoking.model';
import { ISearch } from 'app/entities/search/search.model';
import { IFiltered } from 'app/entities/filtered/filtered.model';

export interface IChallenges {
  id: number;
  selectChallenge?: boolean | null;
  allChallenges?: string | null;
  progress?: Pick<IProgress, 'id'> | null;
  junkFood?: Pick<IJunkFood, 'id'> | null;
  screenTime?: Pick<IScreenTime, 'id'> | null;
  alcohol?: Pick<IAlcohol, 'id'> | null;
  smoking?: Pick<ISmoking, 'id'> | null;
  searches?: Pick<ISearch, 'id'>[] | null;
  filtereds?: Pick<IFiltered, 'id'>[] | null;
}

export type NewChallenges = Omit<IChallenges, 'id'> & { id: null };
