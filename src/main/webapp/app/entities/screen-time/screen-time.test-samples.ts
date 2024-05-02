import { IScreenTime, NewScreenTime } from './screen-time.model';

export const sampleWithRequiredData: IScreenTime = {
  id: 76904,
};

export const sampleWithPartialData: IScreenTime = {
  id: 84669,
};

export const sampleWithFullData: IScreenTime = {
  id: 39246,
  selectCategory: true,
};

export const sampleWithNewData: NewScreenTime = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
