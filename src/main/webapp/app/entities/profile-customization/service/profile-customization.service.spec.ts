import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProfileCustomization } from '../profile-customization.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../profile-customization.test-samples';

import { ProfileCustomizationService } from './profile-customization.service';

const requireRestSample: IProfileCustomization = {
  ...sampleWithRequiredData,
};

describe('ProfileCustomization Service', () => {
  let service: ProfileCustomizationService;
  let httpMock: HttpTestingController;
  let expectedResult: IProfileCustomization | IProfileCustomization[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProfileCustomizationService);
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

    it('should create a ProfileCustomization', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const profileCustomization = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(profileCustomization).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProfileCustomization', () => {
      const profileCustomization = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(profileCustomization).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ProfileCustomization', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ProfileCustomization', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ProfileCustomization', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addProfileCustomizationToCollectionIfMissing', () => {
      it('should add a ProfileCustomization to an empty array', () => {
        const profileCustomization: IProfileCustomization = sampleWithRequiredData;
        expectedResult = service.addProfileCustomizationToCollectionIfMissing([], profileCustomization);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(profileCustomization);
      });

      it('should not add a ProfileCustomization to an array that contains it', () => {
        const profileCustomization: IProfileCustomization = sampleWithRequiredData;
        const profileCustomizationCollection: IProfileCustomization[] = [
          {
            ...profileCustomization,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addProfileCustomizationToCollectionIfMissing(profileCustomizationCollection, profileCustomization);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProfileCustomization to an array that doesn't contain it", () => {
        const profileCustomization: IProfileCustomization = sampleWithRequiredData;
        const profileCustomizationCollection: IProfileCustomization[] = [sampleWithPartialData];
        expectedResult = service.addProfileCustomizationToCollectionIfMissing(profileCustomizationCollection, profileCustomization);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(profileCustomization);
      });

      it('should add only unique ProfileCustomization to an array', () => {
        const profileCustomizationArray: IProfileCustomization[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const profileCustomizationCollection: IProfileCustomization[] = [sampleWithRequiredData];
        expectedResult = service.addProfileCustomizationToCollectionIfMissing(profileCustomizationCollection, ...profileCustomizationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const profileCustomization: IProfileCustomization = sampleWithRequiredData;
        const profileCustomization2: IProfileCustomization = sampleWithPartialData;
        expectedResult = service.addProfileCustomizationToCollectionIfMissing([], profileCustomization, profileCustomization2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(profileCustomization);
        expect(expectedResult).toContain(profileCustomization2);
      });

      it('should accept null and undefined values', () => {
        const profileCustomization: IProfileCustomization = sampleWithRequiredData;
        expectedResult = service.addProfileCustomizationToCollectionIfMissing([], null, profileCustomization, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(profileCustomization);
      });

      it('should return initial array if no ProfileCustomization is added', () => {
        const profileCustomizationCollection: IProfileCustomization[] = [sampleWithRequiredData];
        expectedResult = service.addProfileCustomizationToCollectionIfMissing(profileCustomizationCollection, undefined, null);
        expect(expectedResult).toEqual(profileCustomizationCollection);
      });
    });

    describe('compareProfileCustomization', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareProfileCustomization(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareProfileCustomization(entity1, entity2);
        const compareResult2 = service.compareProfileCustomization(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareProfileCustomization(entity1, entity2);
        const compareResult2 = service.compareProfileCustomization(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareProfileCustomization(entity1, entity2);
        const compareResult2 = service.compareProfileCustomization(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
