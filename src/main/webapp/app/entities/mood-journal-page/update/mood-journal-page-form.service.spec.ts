import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../mood-journal-page.test-samples';

import { MoodJournalPageFormService } from './mood-journal-page-form.service';

describe('MoodJournalPage Form Service', () => {
  let service: MoodJournalPageFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoodJournalPageFormService);
  });

  describe('Service methods', () => {
    describe('createMoodJournalPageFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMoodJournalPageFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            allEntries: expect.any(Object),
            date: expect.any(Object),
            currentTab: expect.any(Object),
          })
        );
      });

      it('passing IMoodJournalPage should create a new form with FormGroup', () => {
        const formGroup = service.createMoodJournalPageFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            allEntries: expect.any(Object),
            date: expect.any(Object),
            currentTab: expect.any(Object),
          })
        );
      });
    });

    describe('getMoodJournalPage', () => {
      it('should return NewMoodJournalPage for default MoodJournalPage initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMoodJournalPageFormGroup(sampleWithNewData);

        const moodJournalPage = service.getMoodJournalPage(formGroup) as any;

        expect(moodJournalPage).toMatchObject(sampleWithNewData);
      });

      it('should return NewMoodJournalPage for empty MoodJournalPage initial value', () => {
        const formGroup = service.createMoodJournalPageFormGroup();

        const moodJournalPage = service.getMoodJournalPage(formGroup) as any;

        expect(moodJournalPage).toMatchObject({});
      });

      it('should return IMoodJournalPage', () => {
        const formGroup = service.createMoodJournalPageFormGroup(sampleWithRequiredData);

        const moodJournalPage = service.getMoodJournalPage(formGroup) as any;

        expect(moodJournalPage).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMoodJournalPage should not enable id FormControl', () => {
        const formGroup = service.createMoodJournalPageFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMoodJournalPage should disable id FormControl', () => {
        const formGroup = service.createMoodJournalPageFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
