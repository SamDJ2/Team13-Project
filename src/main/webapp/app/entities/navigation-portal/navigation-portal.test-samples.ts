import { INavigationPortal, NewNavigationPortal } from './navigation-portal.model';

export const sampleWithRequiredData: INavigationPortal = {
  id: 20093,
};

export const sampleWithPartialData: INavigationPortal = {
  id: 58239,
  features: 'Africa',
};

export const sampleWithFullData: INavigationPortal = {
  id: 69631,
  features: 'Home',
  selectedFeature: true,
};

export const sampleWithNewData: NewNavigationPortal = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
