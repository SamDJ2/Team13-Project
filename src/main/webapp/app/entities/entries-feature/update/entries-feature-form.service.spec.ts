import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../entries-feature.test-samples';

import { EntriesFeatureFormService } from './entries-feature-form.service';

describe('EntriesFeature Form Service', () => {
  let service: EntriesFeatureFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntriesFeatureFormService);
  });

  describe('Service methods', () => {
    describe('createEntriesFeatureFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEntriesFeatureFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            content: expect.any(Object),
            date: expect.any(Object),
          })
        );
      });

      it('passing IEntriesFeature should create a new form with FormGroup', () => {
        const formGroup = service.createEntriesFeatureFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            content: expect.any(Object),
            date: expect.any(Object),
          })
        );
      });
    });

    describe('getEntriesFeature', () => {
      it('should return NewEntriesFeature for default EntriesFeature initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createEntriesFeatureFormGroup(sampleWithNewData);

        const entriesFeature = service.getEntriesFeature(formGroup) as any;

        expect(entriesFeature).toMatchObject(sampleWithNewData);
      });

      it('should return NewEntriesFeature for empty EntriesFeature initial value', () => {
        const formGroup = service.createEntriesFeatureFormGroup();

        const entriesFeature = service.getEntriesFeature(formGroup) as any;

        expect(entriesFeature).toMatchObject({});
      });

      it('should return IEntriesFeature', () => {
        const formGroup = service.createEntriesFeatureFormGroup(sampleWithRequiredData);

        const entriesFeature = service.getEntriesFeature(formGroup) as any;

        expect(entriesFeature).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEntriesFeature should not enable id FormControl', () => {
        const formGroup = service.createEntriesFeatureFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEntriesFeature should disable id FormControl', () => {
        const formGroup = service.createEntriesFeatureFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
