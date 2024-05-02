import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../leader-boards.test-samples';

import { LeaderBoardsFormService } from './leader-boards-form.service';

describe('LeaderBoards Form Service', () => {
  let service: LeaderBoardsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaderBoardsFormService);
  });

  describe('Service methods', () => {
    describe('createLeaderBoardsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLeaderBoardsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            standings: expect.any(Object),
            grouping: expect.any(Object),
            progress: expect.any(Object),
          })
        );
      });

      it('passing ILeaderBoards should create a new form with FormGroup', () => {
        const formGroup = service.createLeaderBoardsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            standings: expect.any(Object),
            grouping: expect.any(Object),
            progress: expect.any(Object),
          })
        );
      });
    });

    describe('getLeaderBoards', () => {
      it('should return NewLeaderBoards for default LeaderBoards initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createLeaderBoardsFormGroup(sampleWithNewData);

        const leaderBoards = service.getLeaderBoards(formGroup) as any;

        expect(leaderBoards).toMatchObject(sampleWithNewData);
      });

      it('should return NewLeaderBoards for empty LeaderBoards initial value', () => {
        const formGroup = service.createLeaderBoardsFormGroup();

        const leaderBoards = service.getLeaderBoards(formGroup) as any;

        expect(leaderBoards).toMatchObject({});
      });

      it('should return ILeaderBoards', () => {
        const formGroup = service.createLeaderBoardsFormGroup(sampleWithRequiredData);

        const leaderBoards = service.getLeaderBoards(formGroup) as any;

        expect(leaderBoards).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILeaderBoards should not enable id FormControl', () => {
        const formGroup = service.createLeaderBoardsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLeaderBoards should disable id FormControl', () => {
        const formGroup = service.createLeaderBoardsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
