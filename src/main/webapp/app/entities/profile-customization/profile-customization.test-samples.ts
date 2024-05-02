import { IProfileCustomization, NewProfileCustomization } from './profile-customization.model';

export const sampleWithRequiredData: IProfileCustomization = {
  id: 42966,
};

export const sampleWithPartialData: IProfileCustomization = {
  id: 85661,
  privacySettings: false,
};

export const sampleWithFullData: IProfileCustomization = {
  id: 74942,
  preferences: true,
  privacySettings: false,
  accountHistory: 'Georgia SCSI interfaces',
  bioDescription: 'array Supervisor HTTP',
};

export const sampleWithNewData: NewProfileCustomization = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
