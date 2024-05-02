import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../navigation-portal.test-samples';

import { NavigationPortalFormService } from './navigation-portal-form.service';

describe('NavigationPortal Form Service', () => {
  let service: NavigationPortalFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavigationPortalFormService);
  });

  describe('Service methods', () => {
    describe('createNavigationPortalFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createNavigationPortalFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            features: expect.any(Object),
            selectedFeature: expect.any(Object),
            challenges: expect.any(Object),
            habit: expect.any(Object),
            leaderBoards: expect.any(Object),
            profileCustomization: expect.any(Object),
            moodJournalPage: expect.any(Object),
          })
        );
      });

      it('passing INavigationPortal should create a new form with FormGroup', () => {
        const formGroup = service.createNavigationPortalFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            features: expect.any(Object),
            selectedFeature: expect.any(Object),
            challenges: expect.any(Object),
            habit: expect.any(Object),
            leaderBoards: expect.any(Object),
            profileCustomization: expect.any(Object),
            moodJournalPage: expect.any(Object),
          })
        );
      });
    });

    describe('getNavigationPortal', () => {
      it('should return NewNavigationPortal for default NavigationPortal initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createNavigationPortalFormGroup(sampleWithNewData);

        const navigationPortal = service.getNavigationPortal(formGroup) as any;

        expect(navigationPortal).toMatchObject(sampleWithNewData);
      });

      it('should return NewNavigationPortal for empty NavigationPortal initial value', () => {
        const formGroup = service.createNavigationPortalFormGroup();

        const navigationPortal = service.getNavigationPortal(formGroup) as any;

        expect(navigationPortal).toMatchObject({});
      });

      it('should return INavigationPortal', () => {
        const formGroup = service.createNavigationPortalFormGroup(sampleWithRequiredData);

        const navigationPortal = service.getNavigationPortal(formGroup) as any;

        expect(navigationPortal).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing INavigationPortal should not enable id FormControl', () => {
        const formGroup = service.createNavigationPortalFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewNavigationPortal should disable id FormControl', () => {
        const formGroup = service.createNavigationPortalFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
