import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../profile-customization.test-samples';

import { ProfileCustomizationFormService } from './profile-customization-form.service';

describe('ProfileCustomization Form Service', () => {
  let service: ProfileCustomizationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileCustomizationFormService);
  });

  describe('Service methods', () => {
    describe('createProfileCustomizationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProfileCustomizationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            preferences: expect.any(Object),
            privacySettings: expect.any(Object),
            accountHistory: expect.any(Object),
            bioDescription: expect.any(Object),
            joinedTeams: expect.any(Object),
            setting: expect.any(Object),
            achievement: expect.any(Object),
          })
        );
      });

      it('passing IProfileCustomization should create a new form with FormGroup', () => {
        const formGroup = service.createProfileCustomizationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            preferences: expect.any(Object),
            privacySettings: expect.any(Object),
            accountHistory: expect.any(Object),
            bioDescription: expect.any(Object),
            joinedTeams: expect.any(Object),
            setting: expect.any(Object),
            achievement: expect.any(Object),
          })
        );
      });
    });

    describe('getProfileCustomization', () => {
      it('should return NewProfileCustomization for default ProfileCustomization initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createProfileCustomizationFormGroup(sampleWithNewData);

        const profileCustomization = service.getProfileCustomization(formGroup) as any;

        expect(profileCustomization).toMatchObject(sampleWithNewData);
      });

      it('should return NewProfileCustomization for empty ProfileCustomization initial value', () => {
        const formGroup = service.createProfileCustomizationFormGroup();

        const profileCustomization = service.getProfileCustomization(formGroup) as any;

        expect(profileCustomization).toMatchObject({});
      });

      it('should return IProfileCustomization', () => {
        const formGroup = service.createProfileCustomizationFormGroup(sampleWithRequiredData);

        const profileCustomization = service.getProfileCustomization(formGroup) as any;

        expect(profileCustomization).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IProfileCustomization should not enable id FormControl', () => {
        const formGroup = service.createProfileCustomizationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProfileCustomization should disable id FormControl', () => {
        const formGroup = service.createProfileCustomizationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
