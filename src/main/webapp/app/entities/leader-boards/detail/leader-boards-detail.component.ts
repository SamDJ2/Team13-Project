import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILeaderBoards } from '../leader-boards.model';

@Component({
  selector: 'jhi-leader-boards-detail',
  templateUrl: './leader-boards-detail.component.html',
})
export class LeaderBoardsDetailComponent implements OnInit {
  leaderBoards: ILeaderBoards | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ leaderBoards }) => {
      this.leaderBoards = leaderBoards;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
