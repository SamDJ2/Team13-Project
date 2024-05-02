import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { INewMoodPicker } from '../new-mood-picker.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../new-mood-picker.test-samples';

import { NewMoodPickerService } from './new-mood-picker.service';

const requireRestSample: INewMoodPicker = {
  ...sampleWithRequiredData,
};

describe('NewMoodPicker Service', () => {
  let service: NewMoodPickerService;
  let httpMock: HttpTestingController;
  let expectedResult: INewMoodPicker | INewMoodPicker[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(NewMoodPickerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a NewMoodPicker', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const newMoodPicker = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(newMoodPicker).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a NewMoodPicker', () => {
      const newMoodPicker = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(newMoodPicker).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a NewMoodPicker', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of NewMoodPicker', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a NewMoodPicker', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addNewMoodPickerToCollectionIfMissing', () => {
      it('should add a NewMoodPicker to an empty array', () => {
        const newMoodPicker: INewMoodPicker = sampleWithRequiredData;
        expectedResult = service.addNewMoodPickerToCollectionIfMissing([], newMoodPicker);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(newMoodPicker);
      });

      it('should not add a NewMoodPicker to an array that contains it', () => {
        const newMoodPicker: INewMoodPicker = sampleWithRequiredData;
        const newMoodPickerCollection: INewMoodPicker[] = [
          {
            ...newMoodPicker,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addNewMoodPickerToCollectionIfMissing(newMoodPickerCollection, newMoodPicker);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a NewMoodPicker to an array that doesn't contain it", () => {
        const newMoodPicker: INewMoodPicker = sampleWithRequiredData;
        const newMoodPickerCollection: INewMoodPicker[] = [sampleWithPartialData];
        expectedResult = service.addNewMoodPickerToCollectionIfMissing(newMoodPickerCollection, newMoodPicker);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(newMoodPicker);
      });

      it('should add only unique NewMoodPicker to an array', () => {
        const newMoodPickerArray: INewMoodPicker[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const newMoodPickerCollection: INewMoodPicker[] = [sampleWithRequiredData];
        expectedResult = service.addNewMoodPickerToCollectionIfMissing(newMoodPickerCollection, ...newMoodPickerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const newMoodPicker: INewMoodPicker = sampleWithRequiredData;
        const newMoodPicker2: INewMoodPicker = sampleWithPartialData;
        expectedResult = service.addNewMoodPickerToCollectionIfMissing([], newMoodPicker, newMoodPicker2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(newMoodPicker);
        expect(expectedResult).toContain(newMoodPicker2);
      });

      it('should accept null and undefined values', () => {
        const newMoodPicker: INewMoodPicker = sampleWithRequiredData;
        expectedResult = service.addNewMoodPickerToCollectionIfMissing([], null, newMoodPicker, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(newMoodPicker);
      });

      it('should return initial array if no NewMoodPicker is added', () => {
        const newMoodPickerCollection: INewMoodPicker[] = [sampleWithRequiredData];
        expectedResult = service.addNewMoodPickerToCollectionIfMissing(newMoodPickerCollection, undefined, null);
        expect(expectedResult).toEqual(newMoodPickerCollection);
      });
    });

    describe('compareNewMoodPicker', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareNewMoodPicker(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareNewMoodPicker(entity1, entity2);
        const compareResult2 = service.compareNewMoodPicker(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareNewMoodPicker(entity1, entity2);
        const compareResult2 = service.compareNewMoodPicker(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareNewMoodPicker(entity1, entity2);
        const compareResult2 = service.compareNewMoodPicker(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
