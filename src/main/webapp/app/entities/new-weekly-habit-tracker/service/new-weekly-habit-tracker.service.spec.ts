import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { INewWeeklyHabitTracker } from '../new-weekly-habit-tracker.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../new-weekly-habit-tracker.test-samples';

import { NewWeeklyHabitTrackerService, RestNewWeeklyHabitTracker } from './new-weekly-habit-tracker.service';

const requireRestSample: RestNewWeeklyHabitTracker = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.format(DATE_FORMAT),
};

describe('NewWeeklyHabitTracker Service', () => {
  let service: NewWeeklyHabitTrackerService;
  let httpMock: HttpTestingController;
  let expectedResult: INewWeeklyHabitTracker | INewWeeklyHabitTracker[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(NewWeeklyHabitTrackerService);
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

    it('should create a NewWeeklyHabitTracker', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const newWeeklyHabitTracker = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(newWeeklyHabitTracker).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a NewWeeklyHabitTracker', () => {
      const newWeeklyHabitTracker = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(newWeeklyHabitTracker).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a NewWeeklyHabitTracker', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of NewWeeklyHabitTracker', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a NewWeeklyHabitTracker', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addNewWeeklyHabitTrackerToCollectionIfMissing', () => {
      it('should add a NewWeeklyHabitTracker to an empty array', () => {
        const newWeeklyHabitTracker: INewWeeklyHabitTracker = sampleWithRequiredData;
        expectedResult = service.addNewWeeklyHabitTrackerToCollectionIfMissing([], newWeeklyHabitTracker);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(newWeeklyHabitTracker);
      });

      it('should not add a NewWeeklyHabitTracker to an array that contains it', () => {
        const newWeeklyHabitTracker: INewWeeklyHabitTracker = sampleWithRequiredData;
        const newWeeklyHabitTrackerCollection: INewWeeklyHabitTracker[] = [
          {
            ...newWeeklyHabitTracker,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addNewWeeklyHabitTrackerToCollectionIfMissing(newWeeklyHabitTrackerCollection, newWeeklyHabitTracker);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a NewWeeklyHabitTracker to an array that doesn't contain it", () => {
        const newWeeklyHabitTracker: INewWeeklyHabitTracker = sampleWithRequiredData;
        const newWeeklyHabitTrackerCollection: INewWeeklyHabitTracker[] = [sampleWithPartialData];
        expectedResult = service.addNewWeeklyHabitTrackerToCollectionIfMissing(newWeeklyHabitTrackerCollection, newWeeklyHabitTracker);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(newWeeklyHabitTracker);
      });

      it('should add only unique NewWeeklyHabitTracker to an array', () => {
        const newWeeklyHabitTrackerArray: INewWeeklyHabitTracker[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const newWeeklyHabitTrackerCollection: INewWeeklyHabitTracker[] = [sampleWithRequiredData];
        expectedResult = service.addNewWeeklyHabitTrackerToCollectionIfMissing(
          newWeeklyHabitTrackerCollection,
          ...newWeeklyHabitTrackerArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const newWeeklyHabitTracker: INewWeeklyHabitTracker = sampleWithRequiredData;
        const newWeeklyHabitTracker2: INewWeeklyHabitTracker = sampleWithPartialData;
        expectedResult = service.addNewWeeklyHabitTrackerToCollectionIfMissing([], newWeeklyHabitTracker, newWeeklyHabitTracker2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(newWeeklyHabitTracker);
        expect(expectedResult).toContain(newWeeklyHabitTracker2);
      });

      it('should accept null and undefined values', () => {
        const newWeeklyHabitTracker: INewWeeklyHabitTracker = sampleWithRequiredData;
        expectedResult = service.addNewWeeklyHabitTrackerToCollectionIfMissing([], null, newWeeklyHabitTracker, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(newWeeklyHabitTracker);
      });

      it('should return initial array if no NewWeeklyHabitTracker is added', () => {
        const newWeeklyHabitTrackerCollection: INewWeeklyHabitTracker[] = [sampleWithRequiredData];
        expectedResult = service.addNewWeeklyHabitTrackerToCollectionIfMissing(newWeeklyHabitTrackerCollection, undefined, null);
        expect(expectedResult).toEqual(newWeeklyHabitTrackerCollection);
      });
    });

    describe('compareNewWeeklyHabitTracker', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareNewWeeklyHabitTracker(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareNewWeeklyHabitTracker(entity1, entity2);
        const compareResult2 = service.compareNewWeeklyHabitTracker(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareNewWeeklyHabitTracker(entity1, entity2);
        const compareResult2 = service.compareNewWeeklyHabitTracker(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareNewWeeklyHabitTracker(entity1, entity2);
        const compareResult2 = service.compareNewWeeklyHabitTracker(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
