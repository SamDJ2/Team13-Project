import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { UserDBFormService, UserDBFormGroup } from './user-db-form.service';
import { IUserDB } from '../user-db.model';
import { UserDBService } from '../service/user-db.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ILandingPage } from 'app/entities/landing-page/landing-page.model';
import { LandingPageService } from 'app/entities/landing-page/service/landing-page.service';
import { IProgress } from 'app/entities/progress/progress.model';
import { ProgressService } from 'app/entities/progress/service/progress.service';

@Component({
  selector: 'jhi-user-db-update',
  templateUrl: './user-db-update.component.html',
})
export class UserDBUpdateComponent implements OnInit {
  isSaving = false;
  userDB: IUserDB | null = null;

  landingPagesCollection: ILandingPage[] = [];
  progressesCollection: IProgress[] = [];

  editForm: UserDBFormGroup = this.userDBFormService.createUserDBFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected userDBService: UserDBService,
    protected userDBFormService: UserDBFormService,
    protected landingPageService: LandingPageService,
    protected progressService: ProgressService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareLandingPage = (o1: ILandingPage | null, o2: ILandingPage | null): boolean => this.landingPageService.compareLandingPage(o1, o2);

  compareProgress = (o1: IProgress | null, o2: IProgress | null): boolean => this.progressService.compareProgress(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userDB }) => {
      this.userDB = userDB;
      if (userDB) {
        this.updateForm(userDB);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('teamprojectApp.error', { message: err.message })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userDB = this.userDBFormService.getUserDB(this.editForm);
    if (userDB.id !== null) {
      this.subscribeToSaveResponse(this.userDBService.update(userDB));
    } else {
      this.subscribeToSaveResponse(this.userDBService.create(userDB));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserDB>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(userDB: IUserDB): void {
    this.userDB = userDB;
    this.userDBFormService.resetForm(this.editForm, userDB);

    this.landingPagesCollection = this.landingPageService.addLandingPageToCollectionIfMissing<ILandingPage>(
      this.landingPagesCollection,
      userDB.landingPage
    );
    this.progressesCollection = this.progressService.addProgressToCollectionIfMissing<IProgress>(
      this.progressesCollection,
      userDB.progress
    );
  }

  protected loadRelationshipsOptions(): void {
    this.landingPageService
      .query({ filter: 'userdb-is-null' })
      .pipe(map((res: HttpResponse<ILandingPage[]>) => res.body ?? []))
      .pipe(
        map((landingPages: ILandingPage[]) =>
          this.landingPageService.addLandingPageToCollectionIfMissing<ILandingPage>(landingPages, this.userDB?.landingPage)
        )
      )
      .subscribe((landingPages: ILandingPage[]) => (this.landingPagesCollection = landingPages));

    this.progressService
      .query({ filter: 'userdb-is-null' })
      .pipe(map((res: HttpResponse<IProgress[]>) => res.body ?? []))
      .pipe(
        map((progresses: IProgress[]) =>
          this.progressService.addProgressToCollectionIfMissing<IProgress>(progresses, this.userDB?.progress)
        )
      )
      .subscribe((progresses: IProgress[]) => (this.progressesCollection = progresses));
  }
}
