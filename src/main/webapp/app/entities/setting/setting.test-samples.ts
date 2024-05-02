import { ISetting, NewSetting } from './setting.model';

export const sampleWithRequiredData: ISetting = {
  id: 51292,
};

export const sampleWithPartialData: ISetting = {
  id: 77271,
};

export const sampleWithFullData: ISetting = {
  id: 81060,
  notificationsEnabled: true,
  accountDeletionRequested: false,
  changePassword: false,
};

export const sampleWithNewData: NewSetting = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
