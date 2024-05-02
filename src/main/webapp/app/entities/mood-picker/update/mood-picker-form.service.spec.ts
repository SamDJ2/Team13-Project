import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../mood-picker.test-samples';

import { MoodPickerFormService } from './mood-picker-form.service';

describe('MoodPicker Form Service', () => {
  let service: MoodPickerFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoodPickerFormService);
  });

  describe('Service methods', () => {
    describe('createMoodPickerFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMoodPickerFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            moodPickerID: expect.any(Object),
            mood: expect.any(Object),
            navigationPortal: expect.any(Object),
          })
        );
      });

      it('passing IMoodPicker should create a new form with FormGroup', () => {
        const formGroup = service.createMoodPickerFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            moodPickerID: expect.any(Object),
            mood: expect.any(Object),
            navigationPortal: expect.any(Object),
          })
        );
      });
    });

    describe('getMoodPicker', () => {
      it('should return NewMoodPicker for default MoodPicker initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMoodPickerFormGroup(sampleWithNewData);

        const moodPicker = service.getMoodPicker(formGroup) as any;

        expect(moodPicker).toMatchObject(sampleWithNewData);
      });

      it('should return NewMoodPicker for empty MoodPicker initial value', () => {
        const formGroup = service.createMoodPickerFormGroup();

        const moodPicker = service.getMoodPicker(formGroup) as any;

        expect(moodPicker).toMatchObject({});
      });

      it('should return IMoodPicker', () => {
        const formGroup = service.createMoodPickerFormGroup(sampleWithRequiredData);

        const moodPicker = service.getMoodPicker(formGroup) as any;

        expect(moodPicker).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMoodPicker should not enable id FormControl', () => {
        const formGroup = service.createMoodPickerFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMoodPicker should disable id FormControl', () => {
        const formGroup = service.createMoodPickerFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
