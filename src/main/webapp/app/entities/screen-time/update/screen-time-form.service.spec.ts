import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../screen-time.test-samples';

import { ScreenTimeFormService } from './screen-time-form.service';

describe('ScreenTime Form Service', () => {
  let service: ScreenTimeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScreenTimeFormService);
  });

  describe('Service methods', () => {
    describe('createScreenTimeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createScreenTimeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            selectCategory: expect.any(Object),
            videoGames: expect.any(Object),
            movies: expect.any(Object),
            socialMedia: expect.any(Object),
            music: expect.any(Object),
          })
        );
      });

      it('passing IScreenTime should create a new form with FormGroup', () => {
        const formGroup = service.createScreenTimeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            selectCategory: expect.any(Object),
            videoGames: expect.any(Object),
            movies: expect.any(Object),
            socialMedia: expect.any(Object),
            music: expect.any(Object),
          })
        );
      });
    });

    describe('getScreenTime', () => {
      it('should return NewScreenTime for default ScreenTime initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createScreenTimeFormGroup(sampleWithNewData);

        const screenTime = service.getScreenTime(formGroup) as any;

        expect(screenTime).toMatchObject(sampleWithNewData);
      });

      it('should return NewScreenTime for empty ScreenTime initial value', () => {
        const formGroup = service.createScreenTimeFormGroup();

        const screenTime = service.getScreenTime(formGroup) as any;

        expect(screenTime).toMatchObject({});
      });

      it('should return IScreenTime', () => {
        const formGroup = service.createScreenTimeFormGroup(sampleWithRequiredData);

        const screenTime = service.getScreenTime(formGroup) as any;

        expect(screenTime).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IScreenTime should not enable id FormControl', () => {
        const formGroup = service.createScreenTimeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewScreenTime should disable id FormControl', () => {
        const formGroup = service.createScreenTimeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
