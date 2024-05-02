import dayjs from 'dayjs/esm';

import { IJoinedTeams, NewJoinedTeams } from './joined-teams.model';

export const sampleWithRequiredData: IJoinedTeams = {
  id: 50389,
};

export const sampleWithPartialData: IJoinedTeams = {
  id: 77589,
};

export const sampleWithFullData: IJoinedTeams = {
  id: 89461,
  teamID: 21011,
  name: 'Investment infrastructure',
  description: 'navigate Multi-tiered Consultant',
  memberSince: dayjs('2024-03-05'),
};

export const sampleWithNewData: NewJoinedTeams = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
