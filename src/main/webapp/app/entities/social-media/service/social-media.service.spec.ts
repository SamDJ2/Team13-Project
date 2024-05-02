import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISocialMedia } from '../social-media.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../social-media.test-samples';

import { SocialMediaService } from './social-media.service';

const requireRestSample: ISocialMedia = {
  ...sampleWithRequiredData,
};

describe('SocialMedia Service', () => {
  let service: SocialMediaService;
  let httpMock: HttpTestingController;
  let expectedResult: ISocialMedia | ISocialMedia[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SocialMediaService);
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

    it('should create a SocialMedia', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const socialMedia = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(socialMedia).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SocialMedia', () => {
      const socialMedia = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(socialMedia).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SocialMedia', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SocialMedia', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a SocialMedia', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSocialMediaToCollectionIfMissing', () => {
      it('should add a SocialMedia to an empty array', () => {
        const socialMedia: ISocialMedia = sampleWithRequiredData;
        expectedResult = service.addSocialMediaToCollectionIfMissing([], socialMedia);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(socialMedia);
      });

      it('should not add a SocialMedia to an array that contains it', () => {
        const socialMedia: ISocialMedia = sampleWithRequiredData;
        const socialMediaCollection: ISocialMedia[] = [
          {
            ...socialMedia,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSocialMediaToCollectionIfMissing(socialMediaCollection, socialMedia);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SocialMedia to an array that doesn't contain it", () => {
        const socialMedia: ISocialMedia = sampleWithRequiredData;
        const socialMediaCollection: ISocialMedia[] = [sampleWithPartialData];
        expectedResult = service.addSocialMediaToCollectionIfMissing(socialMediaCollection, socialMedia);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(socialMedia);
      });

      it('should add only unique SocialMedia to an array', () => {
        const socialMediaArray: ISocialMedia[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const socialMediaCollection: ISocialMedia[] = [sampleWithRequiredData];
        expectedResult = service.addSocialMediaToCollectionIfMissing(socialMediaCollection, ...socialMediaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const socialMedia: ISocialMedia = sampleWithRequiredData;
        const socialMedia2: ISocialMedia = sampleWithPartialData;
        expectedResult = service.addSocialMediaToCollectionIfMissing([], socialMedia, socialMedia2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(socialMedia);
        expect(expectedResult).toContain(socialMedia2);
      });

      it('should accept null and undefined values', () => {
        const socialMedia: ISocialMedia = sampleWithRequiredData;
        expectedResult = service.addSocialMediaToCollectionIfMissing([], null, socialMedia, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(socialMedia);
      });

      it('should return initial array if no SocialMedia is added', () => {
        const socialMediaCollection: ISocialMedia[] = [sampleWithRequiredData];
        expectedResult = service.addSocialMediaToCollectionIfMissing(socialMediaCollection, undefined, null);
        expect(expectedResult).toEqual(socialMediaCollection);
      });
    });

    describe('compareSocialMedia', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSocialMedia(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSocialMedia(entity1, entity2);
        const compareResult2 = service.compareSocialMedia(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSocialMedia(entity1, entity2);
        const compareResult2 = service.compareSocialMedia(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSocialMedia(entity1, entity2);
        const compareResult2 = service.compareSocialMedia(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
