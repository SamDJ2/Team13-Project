import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMoodPicker } from '../mood-picker.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../mood-picker.test-samples';

import { MoodPickerService } from './mood-picker.service';

const requireRestSample: IMoodPicker = {
  ...sampleWithRequiredData,
};

describe('MoodPicker Service', () => {
  let service: MoodPickerService;
  let httpMock: HttpTestingController;
  let expectedResult: IMoodPicker | IMoodPicker[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MoodPickerService);
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

    it('should create a MoodPicker', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const moodPicker = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(moodPicker).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a MoodPicker', () => {
      const moodPicker = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(moodPicker).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a MoodPicker', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of MoodPicker', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a MoodPicker', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMoodPickerToCollectionIfMissing', () => {
      it('should add a MoodPicker to an empty array', () => {
        const moodPicker: IMoodPicker = sampleWithRequiredData;
        expectedResult = service.addMoodPickerToCollectionIfMissing([], moodPicker);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(moodPicker);
      });

      it('should not add a MoodPicker to an array that contains it', () => {
        const moodPicker: IMoodPicker = sampleWithRequiredData;
        const moodPickerCollection: IMoodPicker[] = [
          {
            ...moodPicker,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMoodPickerToCollectionIfMissing(moodPickerCollection, moodPicker);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a MoodPicker to an array that doesn't contain it", () => {
        const moodPicker: IMoodPicker = sampleWithRequiredData;
        const moodPickerCollection: IMoodPicker[] = [sampleWithPartialData];
        expectedResult = service.addMoodPickerToCollectionIfMissing(moodPickerCollection, moodPicker);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(moodPicker);
      });

      it('should add only unique MoodPicker to an array', () => {
        const moodPickerArray: IMoodPicker[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const moodPickerCollection: IMoodPicker[] = [sampleWithRequiredData];
        expectedResult = service.addMoodPickerToCollectionIfMissing(moodPickerCollection, ...moodPickerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const moodPicker: IMoodPicker = sampleWithRequiredData;
        const moodPicker2: IMoodPicker = sampleWithPartialData;
        expectedResult = service.addMoodPickerToCollectionIfMissing([], moodPicker, moodPicker2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(moodPicker);
        expect(expectedResult).toContain(moodPicker2);
      });

      it('should accept null and undefined values', () => {
        const moodPicker: IMoodPicker = sampleWithRequiredData;
        expectedResult = service.addMoodPickerToCollectionIfMissing([], null, moodPicker, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(moodPicker);
      });

      it('should return initial array if no MoodPicker is added', () => {
        const moodPickerCollection: IMoodPicker[] = [sampleWithRequiredData];
        expectedResult = service.addMoodPickerToCollectionIfMissing(moodPickerCollection, undefined, null);
        expect(expectedResult).toEqual(moodPickerCollection);
      });
    });

    describe('compareMoodPicker', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMoodPicker(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMoodPicker(entity1, entity2);
        const compareResult2 = service.compareMoodPicker(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMoodPicker(entity1, entity2);
        const compareResult2 = service.compareMoodPicker(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMoodPicker(entity1, entity2);
        const compareResult2 = service.compareMoodPicker(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
