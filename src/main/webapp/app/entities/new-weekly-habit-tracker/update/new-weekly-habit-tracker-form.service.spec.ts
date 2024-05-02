import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../new-weekly-habit-tracker.test-samples';

import { NewWeeklyHabitTrackerFormService } from './new-weekly-habit-tracker-form.service';

describe('NewWeeklyHabitTracker Form Service', () => {
  let service: NewWeeklyHabitTrackerFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewWeeklyHabitTrackerFormService);
  });

  describe('Service methods', () => {
    describe('createNewWeeklyHabitTrackerFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createNewWeeklyHabitTrackerFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            recordID: expect.any(Object),
            habitCompletion: expect.any(Object),
            date: expect.any(Object),
            weeklySummary: expect.any(Object),
            habit: expect.any(Object),
          })
        );
      });

      it('passing INewWeeklyHabitTracker should create a new form with FormGroup', () => {
        const formGroup = service.createNewWeeklyHabitTrackerFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            recordID: expect.any(Object),
            habitCompletion: expect.any(Object),
            date: expect.any(Object),
            weeklySummary: expect.any(Object),
            habit: expect.any(Object),
          })
        );
      });
    });

    describe('getNewWeeklyHabitTracker', () => {
      it('should return NewNewWeeklyHabitTracker for default NewWeeklyHabitTracker initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createNewWeeklyHabitTrackerFormGroup(sampleWithNewData);

        const newWeeklyHabitTracker = service.getNewWeeklyHabitTracker(formGroup) as any;

        expect(newWeeklyHabitTracker).toMatchObject(sampleWithNewData);
      });

      it('should return NewNewWeeklyHabitTracker for empty NewWeeklyHabitTracker initial value', () => {
        const formGroup = service.createNewWeeklyHabitTrackerFormGroup();

        const newWeeklyHabitTracker = service.getNewWeeklyHabitTracker(formGroup) as any;

        expect(newWeeklyHabitTracker).toMatchObject({});
      });

      it('should return INewWeeklyHabitTracker', () => {
        const formGroup = service.createNewWeeklyHabitTrackerFormGroup(sampleWithRequiredData);

        const newWeeklyHabitTracker = service.getNewWeeklyHabitTracker(formGroup) as any;

        expect(newWeeklyHabitTracker).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing INewWeeklyHabitTracker should not enable id FormControl', () => {
        const formGroup = service.createNewWeeklyHabitTrackerFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewNewWeeklyHabitTracker should disable id FormControl', () => {
        const formGroup = service.createNewWeeklyHabitTrackerFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
