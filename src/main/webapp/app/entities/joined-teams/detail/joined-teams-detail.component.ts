import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IJoinedTeams } from '../joined-teams.model';

@Component({
  selector: 'jhi-joined-teams-detail',
  templateUrl: './joined-teams-detail.component.html',
})
export class JoinedTeamsDetailComponent implements OnInit {
  joinedTeams: IJoinedTeams | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ joinedTeams }) => {
      this.joinedTeams = joinedTeams;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
