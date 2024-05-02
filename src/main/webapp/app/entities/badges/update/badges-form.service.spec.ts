import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../badges.test-samples';

import { BadgesFormService } from './badges-form.service';

describe('Badges Form Service', () => {
  let service: BadgesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BadgesFormService);
  });

  describe('Service methods', () => {
    describe('createBadgesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBadgesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            badgeNo: expect.any(Object),
            requiredPoints: expect.any(Object),
            badge: expect.any(Object),
            grouping: expect.any(Object),
          })
        );
      });

      it('passing IBadges should create a new form with FormGroup', () => {
        const formGroup = service.createBadgesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            badgeNo: expect.any(Object),
            requiredPoints: expect.any(Object),
            badge: expect.any(Object),
            grouping: expect.any(Object),
          })
        );
      });
    });

    describe('getBadges', () => {
      it('should return NewBadges for default Badges initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createBadgesFormGroup(sampleWithNewData);

        const badges = service.getBadges(formGroup) as any;

        expect(badges).toMatchObject(sampleWithNewData);
      });

      it('should return NewBadges for empty Badges initial value', () => {
        const formGroup = service.createBadgesFormGroup();

        const badges = service.getBadges(formGroup) as any;

        expect(badges).toMatchObject({});
      });

      it('should return IBadges', () => {
        const formGroup = service.createBadgesFormGroup(sampleWithRequiredData);

        const badges = service.getBadges(formGroup) as any;

        expect(badges).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBadges should not enable id FormControl', () => {
        const formGroup = service.createBadgesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBadges should disable id FormControl', () => {
        const formGroup = service.createBadgesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
