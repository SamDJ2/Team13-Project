import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../weekly-summary.test-samples';

import { WeeklySummaryFormService } from './weekly-summary-form.service';

describe('WeeklySummary Form Service', () => {
  let service: WeeklySummaryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeeklySummaryFormService);
  });

  describe('Service methods', () => {
    describe('createWeeklySummaryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createWeeklySummaryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            summaryID: expect.any(Object),
            summaryText: expect.any(Object),
          })
        );
      });

      it('passing IWeeklySummary should create a new form with FormGroup', () => {
        const formGroup = service.createWeeklySummaryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            summaryID: expect.any(Object),
            summaryText: expect.any(Object),
          })
        );
      });
    });

    describe('getWeeklySummary', () => {
      it('should return NewWeeklySummary for default WeeklySummary initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createWeeklySummaryFormGroup(sampleWithNewData);

        const weeklySummary = service.getWeeklySummary(formGroup) as any;

        expect(weeklySummary).toMatchObject(sampleWithNewData);
      });

      it('should return NewWeeklySummary for empty WeeklySummary initial value', () => {
        const formGroup = service.createWeeklySummaryFormGroup();

        const weeklySummary = service.getWeeklySummary(formGroup) as any;

        expect(weeklySummary).toMatchObject({});
      });

      it('should return IWeeklySummary', () => {
        const formGroup = service.createWeeklySummaryFormGroup(sampleWithRequiredData);

        const weeklySummary = service.getWeeklySummary(formGroup) as any;

        expect(weeklySummary).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IWeeklySummary should not enable id FormControl', () => {
        const formGroup = service.createWeeklySummaryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewWeeklySummary should disable id FormControl', () => {
        const formGroup = service.createWeeklySummaryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
