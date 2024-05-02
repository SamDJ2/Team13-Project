import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAlcohol } from '../alcohol.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../alcohol.test-samples';

import { AlcoholService } from './alcohol.service';

const requireRestSample: IAlcohol = {
  ...sampleWithRequiredData,
};

describe('Alcohol Service', () => {
  let service: AlcoholService;
  let httpMock: HttpTestingController;
  let expectedResult: IAlcohol | IAlcohol[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AlcoholService);
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

    it('should create a Alcohol', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const alcohol = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(alcohol).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Alcohol', () => {
      const alcohol = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(alcohol).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Alcohol', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Alcohol', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Alcohol', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAlcoholToCollectionIfMissing', () => {
      it('should add a Alcohol to an empty array', () => {
        const alcohol: IAlcohol = sampleWithRequiredData;
        expectedResult = service.addAlcoholToCollectionIfMissing([], alcohol);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(alcohol);
      });

      it('should not add a Alcohol to an array that contains it', () => {
        const alcohol: IAlcohol = sampleWithRequiredData;
        const alcoholCollection: IAlcohol[] = [
          {
            ...alcohol,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAlcoholToCollectionIfMissing(alcoholCollection, alcohol);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Alcohol to an array that doesn't contain it", () => {
        const alcohol: IAlcohol = sampleWithRequiredData;
        const alcoholCollection: IAlcohol[] = [sampleWithPartialData];
        expectedResult = service.addAlcoholToCollectionIfMissing(alcoholCollection, alcohol);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(alcohol);
      });

      it('should add only unique Alcohol to an array', () => {
        const alcoholArray: IAlcohol[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const alcoholCollection: IAlcohol[] = [sampleWithRequiredData];
        expectedResult = service.addAlcoholToCollectionIfMissing(alcoholCollection, ...alcoholArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const alcohol: IAlcohol = sampleWithRequiredData;
        const alcohol2: IAlcohol = sampleWithPartialData;
        expectedResult = service.addAlcoholToCollectionIfMissing([], alcohol, alcohol2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(alcohol);
        expect(expectedResult).toContain(alcohol2);
      });

      it('should accept null and undefined values', () => {
        const alcohol: IAlcohol = sampleWithRequiredData;
        expectedResult = service.addAlcoholToCollectionIfMissing([], null, alcohol, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(alcohol);
      });

      it('should return initial array if no Alcohol is added', () => {
        const alcoholCollection: IAlcohol[] = [sampleWithRequiredData];
        expectedResult = service.addAlcoholToCollectionIfMissing(alcoholCollection, undefined, null);
        expect(expectedResult).toEqual(alcoholCollection);
      });
    });

    describe('compareAlcohol', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAlcohol(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAlcohol(entity1, entity2);
        const compareResult2 = service.compareAlcohol(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAlcohol(entity1, entity2);
        const compareResult2 = service.compareAlcohol(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAlcohol(entity1, entity2);
        const compareResult2 = service.compareAlcohol(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
