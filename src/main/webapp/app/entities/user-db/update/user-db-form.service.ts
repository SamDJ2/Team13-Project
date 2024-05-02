import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUserDB, NewUserDB } from '../user-db.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserDB for edit and NewUserDBFormGroupInput for create.
 */
type UserDBFormGroupInput = IUserDB | PartialWithRequiredKeyOf<NewUserDB>;

type UserDBFormDefaults = Pick<NewUserDB, 'id'>;

type UserDBFormGroupContent = {
  id: FormControl<IUserDB['id'] | NewUserDB['id']>;
  userID: FormControl<IUserDB['userID']>;
  email: FormControl<IUserDB['email']>;
  password: FormControl<IUserDB['password']>;
  phoneNumber: FormControl<IUserDB['phoneNumber']>;
  profilePicture: FormControl<IUserDB['profilePicture']>;
  profilePictureContentType: FormControl<IUserDB['profilePictureContentType']>;
  userName: FormControl<IUserDB['userName']>;
  landingPage: FormControl<IUserDB['landingPage']>;
  progress: FormControl<IUserDB['progress']>;
};

export type UserDBFormGroup = FormGroup<UserDBFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserDBFormService {
  createUserDBFormGroup(userDB: UserDBFormGroupInput = { id: null }): UserDBFormGroup {
    const userDBRawValue = {
      ...this.getFormDefaults(),
      ...userDB,
    };
    return new FormGroup<UserDBFormGroupContent>({
      id: new FormControl(
        { value: userDBRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      userID: new FormControl(userDBRawValue.userID),
      email: new FormControl(userDBRawValue.email),
      password: new FormControl(userDBRawValue.password),
      phoneNumber: new FormControl(userDBRawValue.phoneNumber),
      profilePicture: new FormControl(userDBRawValue.profilePicture),
      profilePictureContentType: new FormControl(userDBRawValue.profilePictureContentType),
      userName: new FormControl(userDBRawValue.userName),
      landingPage: new FormControl(userDBRawValue.landingPage),
      progress: new FormControl(userDBRawValue.progress),
    });
  }

  getUserDB(form: UserDBFormGroup): IUserDB | NewUserDB {
    return form.getRawValue() as IUserDB | NewUserDB;
  }

  resetForm(form: UserDBFormGroup, userDB: UserDBFormGroupInput): void {
    const userDBRawValue = { ...this.getFormDefaults(), ...userDB };
    form.reset(
      {
        ...userDBRawValue,
        id: { value: userDBRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UserDBFormDefaults {
    return {
      id: null,
    };
  }
}
