import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { BadgesFormService, BadgesFormGroup } from './badges-form.service';
import { IBadges } from '../badges.model';
import { BadgesService } from '../service/badges.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IGrouping } from 'app/entities/grouping/grouping.model';
import { GroupingService } from 'app/entities/grouping/service/grouping.service';

@Component({
  selector: 'jhi-badges-update',
  templateUrl: './badges-update.component.html',
})
export class BadgesUpdateComponent implements OnInit {
  isSaving = false;
  badges: IBadges | null = null;

  groupingsSharedCollection: IGrouping[] = [];

  editForm: BadgesFormGroup = this.badgesFormService.createBadgesFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected badgesService: BadgesService,
    protected badgesFormService: BadgesFormService,
    protected groupingService: GroupingService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareGrouping = (o1: IGrouping | null, o2: IGrouping | null): boolean => this.groupingService.compareGrouping(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ badges }) => {
      this.badges = badges;
      if (badges) {
        this.updateForm(badges);
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

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const badges = this.badgesFormService.getBadges(this.editForm);
    if (badges.id !== null) {
      this.subscribeToSaveResponse(this.badgesService.update(badges));
    } else {
      this.subscribeToSaveResponse(this.badgesService.create(badges));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBadges>>): void {
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

  protected updateForm(badges: IBadges): void {
    this.badges = badges;
    this.badgesFormService.resetForm(this.editForm, badges);

    this.groupingsSharedCollection = this.groupingService.addGroupingToCollectionIfMissing<IGrouping>(
      this.groupingsSharedCollection,
      badges.grouping
    );
  }

  protected loadRelationshipsOptions(): void {
    this.groupingService
      .query()
      .pipe(map((res: HttpResponse<IGrouping[]>) => res.body ?? []))
      .pipe(
        map((groupings: IGrouping[]) => this.groupingService.addGroupingToCollectionIfMissing<IGrouping>(groupings, this.badges?.grouping))
      )
      .subscribe((groupings: IGrouping[]) => (this.groupingsSharedCollection = groupings));
  }
}
