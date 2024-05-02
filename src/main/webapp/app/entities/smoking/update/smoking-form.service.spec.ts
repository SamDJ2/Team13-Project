import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../smoking.test-samples';

import { SmokingFormService } from './smoking-form.service';

describe('Smoking Form Service', () => {
  let service: SmokingFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmokingFormService);
  });

  describe('Service methods', () => {
    describe('createSmokingFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSmokingFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            levels: expect.any(Object),
            progress: expect.any(Object),
            timer: expect.any(Object),
          })
        );
      });

      it('passing ISmoking should create a new form with FormGroup', () => {
        const formGroup = service.createSmokingFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            levels: expect.any(Object),
            progress: expect.any(Object),
            timer: expect.any(Object),
          })
        );
      });
    });

    describe('getSmoking', () => {
      it('should return NewSmoking for default Smoking initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSmokingFormGroup(sampleWithNewData);

        const smoking = service.getSmoking(formGroup) as any;

        expect(smoking).toMatchObject(sampleWithNewData);
      });

      it('should return NewSmoking for empty Smoking initial value', () => {
        const formGroup = service.createSmokingFormGroup();

        const smoking = service.getSmoking(formGroup) as any;

        expect(smoking).toMatchObject({});
      });

      it('should return ISmoking', () => {
        const formGroup = service.createSmokingFormGroup(sampleWithRequiredData);

        const smoking = service.getSmoking(formGroup) as any;

        expect(smoking).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISmoking should not enable id FormControl', () => {
        const formGroup = service.createSmokingFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSmoking should disable id FormControl', () => {
        const formGroup = service.createSmokingFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
