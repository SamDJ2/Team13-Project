import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../social-media.test-samples';

import { SocialMediaFormService } from './social-media-form.service';

describe('SocialMedia Form Service', () => {
  let service: SocialMediaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocialMediaFormService);
  });

  describe('Service methods', () => {
    describe('createSocialMediaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSocialMediaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            levels: expect.any(Object),
            progress: expect.any(Object),
            timer: expect.any(Object),
          })
        );
      });

      it('passing ISocialMedia should create a new form with FormGroup', () => {
        const formGroup = service.createSocialMediaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            levels: expect.any(Object),
            progress: expect.any(Object),
            timer: expect.any(Object),
          })
        );
      });
    });

    describe('getSocialMedia', () => {
      it('should return NewSocialMedia for default SocialMedia initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSocialMediaFormGroup(sampleWithNewData);

        const socialMedia = service.getSocialMedia(formGroup) as any;

        expect(socialMedia).toMatchObject(sampleWithNewData);
      });

      it('should return NewSocialMedia for empty SocialMedia initial value', () => {
        const formGroup = service.createSocialMediaFormGroup();

        const socialMedia = service.getSocialMedia(formGroup) as any;

        expect(socialMedia).toMatchObject({});
      });

      it('should return ISocialMedia', () => {
        const formGroup = service.createSocialMediaFormGroup(sampleWithRequiredData);

        const socialMedia = service.getSocialMedia(formGroup) as any;

        expect(socialMedia).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISocialMedia should not enable id FormControl', () => {
        const formGroup = service.createSocialMediaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSocialMedia should disable id FormControl', () => {
        const formGroup = service.createSocialMediaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
