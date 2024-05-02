import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../timer.test-samples';

import { TimerFormService } from './timer-form.service';

describe('Timer Form Service', () => {
  let service: TimerFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimerFormService);
  });

  describe('Service methods', () => {
    describe('createTimerFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTimerFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            startTime: expect.any(Object),
            isActive: expect.any(Object),
            timings: expect.any(Object),
          })
        );
      });

      it('passing ITimer should create a new form with FormGroup', () => {
        const formGroup = service.createTimerFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            startTime: expect.any(Object),
            isActive: expect.any(Object),
            timings: expect.any(Object),
          })
        );
      });
    });

    describe('getTimer', () => {
      it('should return NewTimer for default Timer initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTimerFormGroup(sampleWithNewData);

        const timer = service.getTimer(formGroup) as any;

        expect(timer).toMatchObject(sampleWithNewData);
      });

      it('should return NewTimer for empty Timer initial value', () => {
        const formGroup = service.createTimerFormGroup();

        const timer = service.getTimer(formGroup) as any;

        expect(timer).toMatchObject({});
      });

      it('should return ITimer', () => {
        const formGroup = service.createTimerFormGroup(sampleWithRequiredData);

        const timer = service.getTimer(formGroup) as any;

        expect(timer).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITimer should not enable id FormControl', () => {
        const formGroup = service.createTimerFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTimer should disable id FormControl', () => {
        const formGroup = service.createTimerFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
