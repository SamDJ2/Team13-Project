import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../habit.test-samples';

import { HabitFormService } from './habit-form.service';

describe('Habit Form Service', () => {
  let service: HabitFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HabitFormService);
  });

  describe('Service methods', () => {
    describe('createHabitFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createHabitFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            habitID: expect.any(Object),
            habitName: expect.any(Object),
          })
        );
      });

      it('passing IHabit should create a new form with FormGroup', () => {
        const formGroup = service.createHabitFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            habitID: expect.any(Object),
            habitName: expect.any(Object),
          })
        );
      });
    });

    describe('getHabit', () => {
      it('should return NewHabit for default Habit initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createHabitFormGroup(sampleWithNewData);

        const habit = service.getHabit(formGroup) as any;

        expect(habit).toMatchObject(sampleWithNewData);
      });

      it('should return NewHabit for empty Habit initial value', () => {
        const formGroup = service.createHabitFormGroup();

        const habit = service.getHabit(formGroup) as any;

        expect(habit).toMatchObject({});
      });

      it('should return IHabit', () => {
        const formGroup = service.createHabitFormGroup(sampleWithRequiredData);

        const habit = service.getHabit(formGroup) as any;

        expect(habit).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IHabit should not enable id FormControl', () => {
        const formGroup = service.createHabitFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewHabit should disable id FormControl', () => {
        const formGroup = service.createHabitFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
