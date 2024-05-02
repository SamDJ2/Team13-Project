import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../prompts-page.test-samples';

import { PromptsPageFormService } from './prompts-page-form.service';

describe('PromptsPage Form Service', () => {
  let service: PromptsPageFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PromptsPageFormService);
  });

  describe('Service methods', () => {
    describe('createPromptsPageFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPromptsPageFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            promptedEntries: expect.any(Object),
            date: expect.any(Object),
            emotionFromMoodPicker: expect.any(Object),
            currentTab: expect.any(Object),
            moodPicker: expect.any(Object),
            emotionPage: expect.any(Object),
            moodJournalPage: expect.any(Object),
          })
        );
      });

      it('passing IPromptsPage should create a new form with FormGroup', () => {
        const formGroup = service.createPromptsPageFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            promptedEntries: expect.any(Object),
            date: expect.any(Object),
            emotionFromMoodPicker: expect.any(Object),
            currentTab: expect.any(Object),
            moodPicker: expect.any(Object),
            emotionPage: expect.any(Object),
            moodJournalPage: expect.any(Object),
          })
        );
      });
    });

    describe('getPromptsPage', () => {
      it('should return NewPromptsPage for default PromptsPage initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPromptsPageFormGroup(sampleWithNewData);

        const promptsPage = service.getPromptsPage(formGroup) as any;

        expect(promptsPage).toMatchObject(sampleWithNewData);
      });

      it('should return NewPromptsPage for empty PromptsPage initial value', () => {
        const formGroup = service.createPromptsPageFormGroup();

        const promptsPage = service.getPromptsPage(formGroup) as any;

        expect(promptsPage).toMatchObject({});
      });

      it('should return IPromptsPage', () => {
        const formGroup = service.createPromptsPageFormGroup(sampleWithRequiredData);

        const promptsPage = service.getPromptsPage(formGroup) as any;

        expect(promptsPage).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPromptsPage should not enable id FormControl', () => {
        const formGroup = service.createPromptsPageFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPromptsPage should disable id FormControl', () => {
        const formGroup = service.createPromptsPageFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
