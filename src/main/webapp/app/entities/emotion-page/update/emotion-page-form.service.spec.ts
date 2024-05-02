import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../emotion-page.test-samples';

import { EmotionPageFormService } from './emotion-page-form.service';

describe('EmotionPage Form Service', () => {
  let service: EmotionPageFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmotionPageFormService);
  });

  describe('Service methods', () => {
    describe('createEmotionPageFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEmotionPageFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            prompts: expect.any(Object),
            date: expect.any(Object),
            promptedEntry: expect.any(Object),
            currentTab: expect.any(Object),
            moodPicker: expect.any(Object),
          })
        );
      });

      it('passing IEmotionPage should create a new form with FormGroup', () => {
        const formGroup = service.createEmotionPageFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            prompts: expect.any(Object),
            date: expect.any(Object),
            promptedEntry: expect.any(Object),
            currentTab: expect.any(Object),
            moodPicker: expect.any(Object),
          })
        );
      });
    });

    describe('getEmotionPage', () => {
      it('should return NewEmotionPage for default EmotionPage initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createEmotionPageFormGroup(sampleWithNewData);

        const emotionPage = service.getEmotionPage(formGroup) as any;

        expect(emotionPage).toMatchObject(sampleWithNewData);
      });

      it('should return NewEmotionPage for empty EmotionPage initial value', () => {
        const formGroup = service.createEmotionPageFormGroup();

        const emotionPage = service.getEmotionPage(formGroup) as any;

        expect(emotionPage).toMatchObject({});
      });

      it('should return IEmotionPage', () => {
        const formGroup = service.createEmotionPageFormGroup(sampleWithRequiredData);

        const emotionPage = service.getEmotionPage(formGroup) as any;

        expect(emotionPage).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEmotionPage should not enable id FormControl', () => {
        const formGroup = service.createEmotionPageFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEmotionPage should disable id FormControl', () => {
        const formGroup = service.createEmotionPageFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
