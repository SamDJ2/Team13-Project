import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../history.test-samples';

import { HistoryFormService } from './history-form.service';

describe('History Form Service', () => {
  let service: HistoryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoryFormService);
  });

  describe('Service methods', () => {
    describe('createHistoryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createHistoryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            challengeName: expect.any(Object),
            challengeLevel: expect.any(Object),
            dateStarted: expect.any(Object),
            username: expect.any(Object),
          })
        );
      });

      it('passing IHistory should create a new form with FormGroup', () => {
        const formGroup = service.createHistoryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            challengeName: expect.any(Object),
            challengeLevel: expect.any(Object),
            dateStarted: expect.any(Object),
            username: expect.any(Object),
          })
        );
      });
    });

    describe('getHistory', () => {
      it('should return NewHistory for default History initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createHistoryFormGroup(sampleWithNewData);

        const history = service.getHistory(formGroup) as any;

        expect(history).toMatchObject(sampleWithNewData);
      });

      it('should return NewHistory for empty History initial value', () => {
        const formGroup = service.createHistoryFormGroup();

        const history = service.getHistory(formGroup) as any;

        expect(history).toMatchObject({});
      });

      it('should return IHistory', () => {
        const formGroup = service.createHistoryFormGroup(sampleWithRequiredData);

        const history = service.getHistory(formGroup) as any;

        expect(history).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IHistory should not enable id FormControl', () => {
        const formGroup = service.createHistoryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewHistory should disable id FormControl', () => {
        const formGroup = service.createHistoryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
