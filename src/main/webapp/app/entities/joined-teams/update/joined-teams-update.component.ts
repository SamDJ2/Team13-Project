import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { JoinedTeamsFormService, JoinedTeamsFormGroup } from './joined-teams-form.service';
import { IJoinedTeams } from '../joined-teams.model';
import { JoinedTeamsService } from '../service/joined-teams.service';

@Component({
  selector: 'jhi-joined-teams-update',
  templateUrl: './joined-teams-update.component.html',
})
export class JoinedTeamsUpdateComponent implements OnInit {
  isSaving = false;
  joinedTeams: IJoinedTeams | null = null;

  editForm: JoinedTeamsFormGroup = this.joinedTeamsFormService.createJoinedTeamsFormGroup();

  constructor(
    protected joinedTeamsService: JoinedTeamsService,
    protected joinedTeamsFormService: JoinedTeamsFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ joinedTeams }) => {
      this.joinedTeams = joinedTeams;
      if (joinedTeams) {
        this.updateForm(joinedTeams);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const joinedTeams = this.joinedTeamsFormService.getJoinedTeams(this.editForm);
    if (joinedTeams.id !== null) {
      this.subscribeToSaveResponse(this.joinedTeamsService.update(joinedTeams));
    } else {
      this.subscribeToSaveResponse(this.joinedTeamsService.create(joinedTeams));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJoinedTeams>>): void {
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

  protected updateForm(joinedTeams: IJoinedTeams): void {
    this.joinedTeams = joinedTeams;
    this.joinedTeamsFormService.resetForm(this.editForm, joinedTeams);
  }
}
