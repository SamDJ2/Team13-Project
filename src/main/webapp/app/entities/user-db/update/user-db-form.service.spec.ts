import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../user-db.test-samples';

import { UserDBFormService } from './user-db-form.service';

describe('UserDB Form Service', () => {
  let service: UserDBFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserDBFormService);
  });

  describe('Service methods', () => {
    describe('createUserDBFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUserDBFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            userID: expect.any(Object),
            email: expect.any(Object),
            password: expect.any(Object),
            phoneNumber: expect.any(Object),
            profilePicture: expect.any(Object),
            userName: expect.any(Object),
            landingPage: expect.any(Object),
            progress: expect.any(Object),
          })
        );
      });

      it('passing IUserDB should create a new form with FormGroup', () => {
        const formGroup = service.createUserDBFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            userID: expect.any(Object),
            email: expect.any(Object),
            password: expect.any(Object),
            phoneNumber: expect.any(Object),
            profilePicture: expect.any(Object),
            userName: expect.any(Object),
            landingPage: expect.any(Object),
            progress: expect.any(Object),
          })
        );
      });
    });

    describe('getUserDB', () => {
      it('should return NewUserDB for default UserDB initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createUserDBFormGroup(sampleWithNewData);

        const userDB = service.getUserDB(formGroup) as any;

        expect(userDB).toMatchObject(sampleWithNewData);
      });

      it('should return NewUserDB for empty UserDB initial value', () => {
        const formGroup = service.createUserDBFormGroup();

        const userDB = service.getUserDB(formGroup) as any;

        expect(userDB).toMatchObject({});
      });

      it('should return IUserDB', () => {
        const formGroup = service.createUserDBFormGroup(sampleWithRequiredData);

        const userDB = service.getUserDB(formGroup) as any;

        expect(userDB).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUserDB should not enable id FormControl', () => {
        const formGroup = service.createUserDBFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUserDB should disable id FormControl', () => {
        const formGroup = service.createUserDBFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
