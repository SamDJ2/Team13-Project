import { IChallenges } from 'app/entities/challenges/challenges.model';

export interface IFiltered {
  id: number;
  search?: string | null;
  results?: string | null;
  filtering?: boolean | null;
  challenges?: Pick<IChallenges, 'id'>[] | null;
}

export type NewFiltered = Omit<IFiltered, 'id'> & { id: null };
