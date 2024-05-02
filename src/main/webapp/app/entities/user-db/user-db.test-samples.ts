import { IUserDB, NewUserDB } from './user-db.model';

export const sampleWithRequiredData: IUserDB = {
  id: 81540,
};

export const sampleWithPartialData: IUserDB = {
  id: 78757,
  phoneNumber: 'Helena Rubber Handmade',
  userName: 'eyeballs pixel Re-contextualized',
};

export const sampleWithFullData: IUserDB = {
  id: 6429,
  userID: 57933,
  email: 'Isaias.Trantow@yahoo.com',
  password: 'User-centric TCP Gloves',
  phoneNumber: 'Agent Peso silver',
  profilePicture: '../fake-data/blob/hipster.png',
  profilePictureContentType: 'unknown',
  userName: 'array Forest',
};

export const sampleWithNewData: NewUserDB = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
