import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../challenges.test-samples';

import { ChallengesFormService } from './challenges-form.service';

describe('Challenges Form Service', () => {
  let service: ChallengesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChallengesFormService);
  });

  describe('Service methods', () => {
    describe('createChallengesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createChallengesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            selectChallenge: expect.any(Object),
            allChallenges: expect.any(Object),
            progress: expect.any(Object),
            junkFood: expect.any(Object),
            screenTime: expect.any(Object),
            alcohol: expect.any(Object),
            smoking: expect.any(Object),
            searches: expect.any(Object),
            filtereds: expect.any(Object),
          })
        );
      });

      it('passing IChallenges should create a new form with FormGroup', () => {
        const formGroup = service.createChallengesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            selectChallenge: expect.any(Object),
            allChallenges: expect.any(Object),
            progress: expect.any(Object),
            junkFood: expect.any(Object),
            screenTime: expect.any(Object),
            alcohol: expect.any(Object),
            smoking: expect.any(Object),
            searches: expect.any(Object),
            filtereds: expect.any(Object),
          })
        );
      });
    });

    describe('getChallenges', () => {
      it('should return NewChallenges for default Challenges initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createChallengesFormGroup(sampleWithNewData);

        const challenges = service.getChallenges(formGroup) as any;

        expect(challenges).toMatchObject(sampleWithNewData);
      });

      it('should return NewChallenges for empty Challenges initial value', () => {
        const formGroup = service.createChallengesFormGroup();

        const challenges = service.getChallenges(formGroup) as any;

        expect(challenges).toMatchObject({});
      });

      it('should return IChallenges', () => {
        const formGroup = service.createChallengesFormGroup(sampleWithRequiredData);

        const challenges = service.getChallenges(formGroup) as any;

        expect(challenges).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IChallenges should not enable id FormControl', () => {
        const formGroup = service.createChallengesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewChallenges should disable id FormControl', () => {
        const formGroup = service.createChallengesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
