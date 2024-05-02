import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAchievement } from '../achievement.model';

@Component({
  selector: 'jhi-achievement-detail',
  templateUrl: './achievement-detail.component.html',
})
export class AchievementDetailComponent implements OnInit {
  achievement: IAchievement | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ achievement }) => {
      this.achievement = achievement;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
