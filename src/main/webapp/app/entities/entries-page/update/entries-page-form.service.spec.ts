import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../entries-page.test-samples';

import { EntriesPageFormService } from './entries-page-form.service';

describe('EntriesPage Form Service', () => {
  let service: EntriesPageFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntriesPageFormService);
  });

  describe('Service methods', () => {
    describe('createEntriesPageFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEntriesPageFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            normalEntries: expect.any(Object),
            date: expect.any(Object),
            currentTab: expect.any(Object),
            moodJournalPage: expect.any(Object),
          })
        );
      });

      it('passing IEntriesPage should create a new form with FormGroup', () => {
        const formGroup = service.createEntriesPageFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            normalEntries: expect.any(Object),
            date: expect.any(Object),
            currentTab: expect.any(Object),
            moodJournalPage: expect.any(Object),
          })
        );
      });
    });

    describe('getEntriesPage', () => {
      it('should return NewEntriesPage for default EntriesPage initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createEntriesPageFormGroup(sampleWithNewData);

        const entriesPage = service.getEntriesPage(formGroup) as any;

        expect(entriesPage).toMatchObject(sampleWithNewData);
      });

      it('should return NewEntriesPage for empty EntriesPage initial value', () => {
        const formGroup = service.createEntriesPageFormGroup();

        const entriesPage = service.getEntriesPage(formGroup) as any;

        expect(entriesPage).toMatchObject({});
      });

      it('should return IEntriesPage', () => {
        const formGroup = service.createEntriesPageFormGroup(sampleWithRequiredData);

        const entriesPage = service.getEntriesPage(formGroup) as any;

        expect(entriesPage).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEntriesPage should not enable id FormControl', () => {
        const formGroup = service.createEntriesPageFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEntriesPage should disable id FormControl', () => {
        const formGroup = service.createEntriesPageFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
