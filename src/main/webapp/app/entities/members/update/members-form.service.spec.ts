import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../members.test-samples';

import { MembersFormService } from './members-form.service';

describe('Members Form Service', () => {
  let service: MembersFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MembersFormService);
  });

  describe('Service methods', () => {
    describe('createMembersFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMembersFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            groupID: expect.any(Object),
            userID: expect.any(Object),
            leader: expect.any(Object),
            grouping: expect.any(Object),
          })
        );
      });

      it('passing IMembers should create a new form with FormGroup', () => {
        const formGroup = service.createMembersFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            groupID: expect.any(Object),
            userID: expect.any(Object),
            leader: expect.any(Object),
            grouping: expect.any(Object),
          })
        );
      });
    });

    describe('getMembers', () => {
      it('should return NewMembers for default Members initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMembersFormGroup(sampleWithNewData);

        const members = service.getMembers(formGroup) as any;

        expect(members).toMatchObject(sampleWithNewData);
      });

      it('should return NewMembers for empty Members initial value', () => {
        const formGroup = service.createMembersFormGroup();

        const members = service.getMembers(formGroup) as any;

        expect(members).toMatchObject({});
      });

      it('should return IMembers', () => {
        const formGroup = service.createMembersFormGroup(sampleWithRequiredData);

        const members = service.getMembers(formGroup) as any;

        expect(members).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMembers should not enable id FormControl', () => {
        const formGroup = service.createMembersFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMembers should disable id FormControl', () => {
        const formGroup = service.createMembersFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
