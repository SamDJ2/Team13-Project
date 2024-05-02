import { ILandingPage, NewLandingPage } from './landing-page.model';

export const sampleWithRequiredData: ILandingPage = {
  id: 40249,
};

export const sampleWithPartialData: ILandingPage = {
  id: 82205,
  getStarted: 'optical tan',
  contact: 'Streets',
};

export const sampleWithFullData: ILandingPage = {
  id: 81862,
  getStarted: 'Digitized Bike deposit',
  about: 'deposit Corporate',
  team: 'User-centric',
  contact: 'Towels',
};

export const sampleWithNewData: NewLandingPage = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
