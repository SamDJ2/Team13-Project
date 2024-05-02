import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MembersFormService, MembersFormGroup } from './members-form.service';
import { IMembers } from '../members.model';
import { MembersService } from '../service/members.service';
import { IGrouping } from 'app/entities/grouping/grouping.model';
import { GroupingService } from 'app/entities/grouping/service/grouping.service';

@Component({
  selector: 'jhi-members-update',
  templateUrl: './members-update.component.html',
})
export class MembersUpdateComponent implements OnInit {
  isSaving = false;
  members: IMembers | null = null;

  groupingsSharedCollection: IGrouping[] = [];

  editForm: MembersFormGroup = this.membersFormService.createMembersFormGroup();

  constructor(
    protected membersService: MembersService,
    protected membersFormService: MembersFormService,
    protected groupingService: GroupingService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareGrouping = (o1: IGrouping | null, o2: IGrouping | null): boolean => this.groupingService.compareGrouping(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ members }) => {
      this.members = members;
      if (members) {
        this.updateForm(members);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const members = this.membersFormService.getMembers(this.editForm);
    if (members.id !== null) {
      this.subscribeToSaveResponse(this.membersService.update(members));
    } else {
      this.subscribeToSaveResponse(this.membersService.create(members));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMembers>>): void {
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

  protected updateForm(members: IMembers): void {
    this.members = members;
    this.membersFormService.resetForm(this.editForm, members);

    this.groupingsSharedCollection = this.groupingService.addGroupingToCollectionIfMissing<IGrouping>(
      this.groupingsSharedCollection,
      members.grouping
    );
  }

  protected loadRelationshipsOptions(): void {
    this.groupingService
      .query()
      .pipe(map((res: HttpResponse<IGrouping[]>) => res.body ?? []))
      .pipe(
        map((groupings: IGrouping[]) => this.groupingService.addGroupingToCollectionIfMissing<IGrouping>(groupings, this.members?.grouping))
      )
      .subscribe((groupings: IGrouping[]) => (this.groupingsSharedCollection = groupings));
  }
}
