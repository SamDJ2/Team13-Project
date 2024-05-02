import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../prompts-feature.test-samples';

import { PromptsFeatureFormService } from './prompts-feature-form.service';

describe('PromptsFeature Form Service', () => {
  let service: PromptsFeatureFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PromptsFeatureFormService);
  });

  describe('Service methods', () => {
    describe('createPromptsFeatureFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPromptsFeatureFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            prompt: expect.any(Object),
            content: expect.any(Object),
            date: expect.any(Object),
          })
        );
      });

      it('passing IPromptsFeature should create a new form with FormGroup', () => {
        const formGroup = service.createPromptsFeatureFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            prompt: expect.any(Object),
            content: expect.any(Object),
            date: expect.any(Object),
          })
        );
      });
    });

    describe('getPromptsFeature', () => {
      it('should return NewPromptsFeature for default PromptsFeature initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPromptsFeatureFormGroup(sampleWithNewData);

        const promptsFeature = service.getPromptsFeature(formGroup) as any;

        expect(promptsFeature).toMatchObject(sampleWithNewData);
      });

      it('should return NewPromptsFeature for empty PromptsFeature initial value', () => {
        const formGroup = service.createPromptsFeatureFormGroup();

        const promptsFeature = service.getPromptsFeature(formGroup) as any;

        expect(promptsFeature).toMatchObject({});
      });

      it('should return IPromptsFeature', () => {
        const formGroup = service.createPromptsFeatureFormGroup(sampleWithRequiredData);

        const promptsFeature = service.getPromptsFeature(formGroup) as any;

        expect(promptsFeature).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPromptsFeature should not enable id FormControl', () => {
        const formGroup = service.createPromptsFeatureFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPromptsFeature should disable id FormControl', () => {
        const formGroup = service.createPromptsFeatureFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
