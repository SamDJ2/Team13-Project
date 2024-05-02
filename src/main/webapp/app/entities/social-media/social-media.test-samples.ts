import { ISocialMedia, NewSocialMedia } from './social-media.model';

export const sampleWithRequiredData: ISocialMedia = {
  id: 78547,
};

export const sampleWithPartialData: ISocialMedia = {
  id: 48327,
  levels: 'HDD fuchsia',
  progress: 'and RSS',
};

export const sampleWithFullData: ISocialMedia = {
  id: 74771,
  levels: 'open-source',
  progress: 'eyeballs withdrawal',
  timer: '41956',
};

export const sampleWithNewData: NewSocialMedia = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
