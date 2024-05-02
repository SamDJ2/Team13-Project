import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../alcohol.test-samples';

import { AlcoholFormService } from './alcohol-form.service';

describe('Alcohol Form Service', () => {
  let service: AlcoholFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlcoholFormService);
  });

  describe('Service methods', () => {
    describe('createAlcoholFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAlcoholFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            levels: expect.any(Object),
            progress: expect.any(Object),
            timer: expect.any(Object),
          })
        );
      });

      it('passing IAlcohol should create a new form with FormGroup', () => {
        const formGroup = service.createAlcoholFormGroup(sampleWithRequiredData);

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

    describe('getAlcohol', () => {
      it('should return NewAlcohol for default Alcohol initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAlcoholFormGroup(sampleWithNewData);

        const alcohol = service.getAlcohol(formGroup) as any;

        expect(alcohol).toMatchObject(sampleWithNewData);
      });

      it('should return NewAlcohol for empty Alcohol initial value', () => {
        const formGroup = service.createAlcoholFormGroup();

        const alcohol = service.getAlcohol(formGroup) as any;

        expect(alcohol).toMatchObject({});
      });

      it('should return IAlcohol', () => {
        const formGroup = service.createAlcoholFormGroup(sampleWithRequiredData);

        const alcohol = service.getAlcohol(formGroup) as any;

        expect(alcohol).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAlcohol should not enable id FormControl', () => {
        const formGroup = service.createAlcoholFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAlcohol should disable id FormControl', () => {
        const formGroup = service.createAlcoholFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
