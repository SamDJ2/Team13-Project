import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../joined-teams.test-samples';

import { JoinedTeamsFormService } from './joined-teams-form.service';

describe('JoinedTeams Form Service', () => {
  let service: JoinedTeamsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JoinedTeamsFormService);
  });

  describe('Service methods', () => {
    describe('createJoinedTeamsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createJoinedTeamsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            teamID: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            memberSince: expect.any(Object),
          })
        );
      });

      it('passing IJoinedTeams should create a new form with FormGroup', () => {
        const formGroup = service.createJoinedTeamsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            teamID: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            memberSince: expect.any(Object),
          })
        );
      });
    });

    describe('getJoinedTeams', () => {
      it('should return NewJoinedTeams for default JoinedTeams initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createJoinedTeamsFormGroup(sampleWithNewData);

        const joinedTeams = service.getJoinedTeams(formGroup) as any;

        expect(joinedTeams).toMatchObject(sampleWithNewData);
      });

      it('should return NewJoinedTeams for empty JoinedTeams initial value', () => {
        const formGroup = service.createJoinedTeamsFormGroup();

        const joinedTeams = service.getJoinedTeams(formGroup) as any;

        expect(joinedTeams).toMatchObject({});
      });

      it('should return IJoinedTeams', () => {
        const formGroup = service.createJoinedTeamsFormGroup(sampleWithRequiredData);

        const joinedTeams = service.getJoinedTeams(formGroup) as any;

        expect(joinedTeams).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IJoinedTeams should not enable id FormControl', () => {
        const formGroup = service.createJoinedTeamsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewJoinedTeams should disable id FormControl', () => {
        const formGroup = service.createJoinedTeamsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
