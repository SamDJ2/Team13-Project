import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../search.test-samples';

import { SearchFormService } from './search-form.service';

describe('Search Form Service', () => {
  let service: SearchFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchFormService);
  });

  describe('Service methods', () => {
    describe('createSearchFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSearchFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            search: expect.any(Object),
            results: expect.any(Object),
            challenges: expect.any(Object),
          })
        );
      });

      it('passing ISearch should create a new form with FormGroup', () => {
        const formGroup = service.createSearchFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            search: expect.any(Object),
            results: expect.any(Object),
            challenges: expect.any(Object),
          })
        );
      });
    });

    describe('getSearch', () => {
      it('should return NewSearch for default Search initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSearchFormGroup(sampleWithNewData);

        const search = service.getSearch(formGroup) as any;

        expect(search).toMatchObject(sampleWithNewData);
      });

      it('should return NewSearch for empty Search initial value', () => {
        const formGroup = service.createSearchFormGroup();

        const search = service.getSearch(formGroup) as any;

        expect(search).toMatchObject({});
      });

      it('should return ISearch', () => {
        const formGroup = service.createSearchFormGroup(sampleWithRequiredData);

        const search = service.getSearch(formGroup) as any;

        expect(search).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISearch should not enable id FormControl', () => {
        const formGroup = service.createSearchFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSearch should disable id FormControl', () => {
        const formGroup = service.createSearchFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
