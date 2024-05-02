import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserPoints } from '../user-points.model';

@Component({
  selector: 'jhi-user-points-detail',
  templateUrl: './user-points-detail.component.html',
})
export class UserPointsDetailComponent implements OnInit {
  userPoints: IUserPoints | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userPoints }) => {
      this.userPoints = userPoints;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
