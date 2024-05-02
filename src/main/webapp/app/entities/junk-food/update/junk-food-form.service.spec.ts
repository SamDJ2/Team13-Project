import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../junk-food.test-samples';

import { JunkFoodFormService } from './junk-food-form.service';

describe('JunkFood Form Service', () => {
  let service: JunkFoodFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JunkFoodFormService);
  });

  describe('Service methods', () => {
    describe('createJunkFoodFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createJunkFoodFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            levels: expect.any(Object),
            progress: expect.any(Object),
            timer: expect.any(Object),
          })
        );
      });

      it('passing IJunkFood should create a new form with FormGroup', () => {
        const formGroup = service.createJunkFoodFormGroup(sampleWithRequiredData);

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

    describe('getJunkFood', () => {
      it('should return NewJunkFood for default JunkFood initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createJunkFoodFormGroup(sampleWithNewData);

        const junkFood = service.getJunkFood(formGroup) as any;

        expect(junkFood).toMatchObject(sampleWithNewData);
      });

      it('should return NewJunkFood for empty JunkFood initial value', () => {
        const formGroup = service.createJunkFoodFormGroup();

        const junkFood = service.getJunkFood(formGroup) as any;

        expect(junkFood).toMatchObject({});
      });

      it('should return IJunkFood', () => {
        const formGroup = service.createJunkFoodFormGroup(sampleWithRequiredData);

        const junkFood = service.getJunkFood(formGroup) as any;

        expect(junkFood).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IJunkFood should not enable id FormControl', () => {
        const formGroup = service.createJunkFoodFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewJunkFood should disable id FormControl', () => {
        const formGroup = service.createJunkFoodFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
