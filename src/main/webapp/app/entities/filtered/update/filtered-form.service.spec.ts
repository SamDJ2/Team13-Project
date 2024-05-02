import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../filtered.test-samples';

import { FilteredFormService } from './filtered-form.service';

describe('Filtered Form Service', () => {
  let service: FilteredFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilteredFormService);
  });

  describe('Service methods', () => {
    describe('createFilteredFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFilteredFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            search: expect.any(Object),
            results: expect.any(Object),
            filtering: expect.any(Object),
            challenges: expect.any(Object),
          })
        );
      });

      it('passing IFiltered should create a new form with FormGroup', () => {
        const formGroup = service.createFilteredFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            search: expect.any(Object),
            results: expect.any(Object),
            filtering: expect.any(Object),
            challenges: expect.any(Object),
          })
        );
      });
    });

    describe('getFiltered', () => {
      it('should return NewFiltered for default Filtered initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createFilteredFormGroup(sampleWithNewData);

        const filtered = service.getFiltered(formGroup) as any;

        expect(filtered).toMatchObject(sampleWithNewData);
      });

      it('should return NewFiltered for empty Filtered initial value', () => {
        const formGroup = service.createFilteredFormGroup();

        const filtered = service.getFiltered(formGroup) as any;

        expect(filtered).toMatchObject({});
      });

      it('should return IFiltered', () => {
        const formGroup = service.createFilteredFormGroup(sampleWithRequiredData);

        const filtered = service.getFiltered(formGroup) as any;

        expect(filtered).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFiltered should not enable id FormControl', () => {
        const formGroup = service.createFilteredFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFiltered should disable id FormControl', () => {
        const formGroup = service.createFilteredFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
