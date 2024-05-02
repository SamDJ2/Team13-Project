import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../progress.test-samples';

import { ProgressFormService } from './progress-form.service';

describe('Progress Form Service', () => {
  let service: ProgressFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressFormService);
  });

  describe('Service methods', () => {
    describe('createProgressFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProgressFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            detoxProgress: expect.any(Object),
            detoxTotal: expect.any(Object),
            challengesInfo: expect.any(Object),
            leaderboardInfo: expect.any(Object),
          })
        );
      });

      it('passing IProgress should create a new form with FormGroup', () => {
        const formGroup = service.createProgressFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            detoxProgress: expect.any(Object),
            detoxTotal: expect.any(Object),
            challengesInfo: expect.any(Object),
            leaderboardInfo: expect.any(Object),
          })
        );
      });
    });

    describe('getProgress', () => {
      it('should return NewProgress for default Progress initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createProgressFormGroup(sampleWithNewData);

        const progress = service.getProgress(formGroup) as any;

        expect(progress).toMatchObject(sampleWithNewData);
      });

      it('should return NewProgress for empty Progress initial value', () => {
        const formGroup = service.createProgressFormGroup();

        const progress = service.getProgress(formGroup) as any;

        expect(progress).toMatchObject({});
      });

      it('should return IProgress', () => {
        const formGroup = service.createProgressFormGroup(sampleWithRequiredData);

        const progress = service.getProgress(formGroup) as any;

        expect(progress).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IProgress should not enable id FormControl', () => {
        const formGroup = service.createProgressFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProgress should disable id FormControl', () => {
        const formGroup = service.createProgressFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
