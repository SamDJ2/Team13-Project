import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../landing-page.test-samples';

import { LandingPageFormService } from './landing-page-form.service';

describe('LandingPage Form Service', () => {
  let service: LandingPageFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LandingPageFormService);
  });

  describe('Service methods', () => {
    describe('createLandingPageFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLandingPageFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            getStarted: expect.any(Object),
            about: expect.any(Object),
            team: expect.any(Object),
            contact: expect.any(Object),
            moodPicker: expect.any(Object),
          })
        );
      });

      it('passing ILandingPage should create a new form with FormGroup', () => {
        const formGroup = service.createLandingPageFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            getStarted: expect.any(Object),
            about: expect.any(Object),
            team: expect.any(Object),
            contact: expect.any(Object),
            moodPicker: expect.any(Object),
          })
        );
      });
    });

    describe('getLandingPage', () => {
      it('should return NewLandingPage for default LandingPage initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createLandingPageFormGroup(sampleWithNewData);

        const landingPage = service.getLandingPage(formGroup) as any;

        expect(landingPage).toMatchObject(sampleWithNewData);
      });

      it('should return NewLandingPage for empty LandingPage initial value', () => {
        const formGroup = service.createLandingPageFormGroup();

        const landingPage = service.getLandingPage(formGroup) as any;

        expect(landingPage).toMatchObject({});
      });

      it('should return ILandingPage', () => {
        const formGroup = service.createLandingPageFormGroup(sampleWithRequiredData);

        const landingPage = service.getLandingPage(formGroup) as any;

        expect(landingPage).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILandingPage should not enable id FormControl', () => {
        const formGroup = service.createLandingPageFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLandingPage should disable id FormControl', () => {
        const formGroup = service.createLandingPageFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
