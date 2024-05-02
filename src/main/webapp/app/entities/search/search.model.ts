import { IChallenges } from 'app/entities/challenges/challenges.model';

export interface ISearch {
  id: number;
  search?: string | null;
  results?: string | null;
  challenges?: Pick<IChallenges, 'id'>[] | null;
}

export type NewSearch = Omit<ISearch, 'id'> & { id: null };
