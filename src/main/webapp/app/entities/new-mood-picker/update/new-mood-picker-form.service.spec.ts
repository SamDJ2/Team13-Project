import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../new-mood-picker.test-samples';

import { NewMoodPickerFormService } from './new-mood-picker-form.service';

describe('NewMoodPicker Form Service', () => {
  let service: NewMoodPickerFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewMoodPickerFormService);
  });

  describe('Service methods', () => {
    describe('createNewMoodPickerFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createNewMoodPickerFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            username: expect.any(Object),
            mood: expect.any(Object),
          })
        );
      });

      it('passing INewMoodPicker should create a new form with FormGroup', () => {
        const formGroup = service.createNewMoodPickerFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            username: expect.any(Object),
            mood: expect.any(Object),
          })
        );
      });
    });

    describe('getNewMoodPicker', () => {
      it('should return NewNewMoodPicker for default NewMoodPicker initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createNewMoodPickerFormGroup(sampleWithNewData);

        const newMoodPicker = service.getNewMoodPicker(formGroup) as any;

        expect(newMoodPicker).toMatchObject(sampleWithNewData);
      });

      it('should return NewNewMoodPicker for empty NewMoodPicker initial value', () => {
        const formGroup = service.createNewMoodPickerFormGroup();

        const newMoodPicker = service.getNewMoodPicker(formGroup) as any;

        expect(newMoodPicker).toMatchObject({});
      });

      it('should return INewMoodPicker', () => {
        const formGroup = service.createNewMoodPickerFormGroup(sampleWithRequiredData);

        const newMoodPicker = service.getNewMoodPicker(formGroup) as any;

        expect(newMoodPicker).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing INewMoodPicker should not enable id FormControl', () => {
        const formGroup = service.createNewMoodPickerFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewNewMoodPicker should disable id FormControl', () => {
        const formGroup = service.createNewMoodPickerFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
