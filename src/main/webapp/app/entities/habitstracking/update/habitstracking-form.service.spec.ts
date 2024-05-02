import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../habitstracking.test-samples';

import { HabitstrackingFormService } from './habitstracking-form.service';

describe('Habitstracking Form Service', () => {
  let service: HabitstrackingFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HabitstrackingFormService);
  });

  describe('Service methods', () => {
    describe('createHabitstrackingFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createHabitstrackingFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nameOfHabit: expect.any(Object),
            dayOfHabit: expect.any(Object),
            weekOfHabit: expect.any(Object),
            completedHabit: expect.any(Object),
            usernameHabit: expect.any(Object),
            habitIDEN: expect.any(Object),
            summary: expect.any(Object),
          })
        );
      });

      it('passing IHabitstracking should create a new form with FormGroup', () => {
        const formGroup = service.createHabitstrackingFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nameOfHabit: expect.any(Object),
            dayOfHabit: expect.any(Object),
            weekOfHabit: expect.any(Object),
            completedHabit: expect.any(Object),
            usernameHabit: expect.any(Object),
            habitIDEN: expect.any(Object),
            summary: expect.any(Object),
          })
        );
      });
    });

    describe('getHabitstracking', () => {
      it('should return NewHabitstracking for default Habitstracking initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createHabitstrackingFormGroup(sampleWithNewData);

        const habitstracking = service.getHabitstracking(formGroup) as any;

        expect(habitstracking).toMatchObject(sampleWithNewData);
      });

      it('should return NewHabitstracking for empty Habitstracking initial value', () => {
        const formGroup = service.createHabitstrackingFormGroup();

        const habitstracking = service.getHabitstracking(formGroup) as any;

        expect(habitstracking).toMatchObject({});
      });

      it('should return IHabitstracking', () => {
        const formGroup = service.createHabitstrackingFormGroup(sampleWithRequiredData);

        const habitstracking = service.getHabitstracking(formGroup) as any;

        expect(habitstracking).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IHabitstracking should not enable id FormControl', () => {
        const formGroup = service.createHabitstrackingFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewHabitstracking should disable id FormControl', () => {
        const formGroup = service.createHabitstrackingFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
