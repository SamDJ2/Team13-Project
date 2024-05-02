import { IMembers, NewMembers } from './members.model';

export const sampleWithRequiredData: IMembers = {
  id: 16665,
};

export const sampleWithPartialData: IMembers = {
  id: 99615,
};

export const sampleWithFullData: IMembers = {
  id: 93405,
  groupID: 41903,
  userID: 11467,
  leader: true,
};

export const sampleWithNewData: NewMembers = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
