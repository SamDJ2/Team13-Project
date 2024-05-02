import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IChallenges } from '../challenges.model';

@Component({
  selector: 'jhi-challenges-detail',
  templateUrl: './challenges-detail.component.html',
})
export class ChallengesDetailComponent implements OnInit {
  challenges: IChallenges | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ challenges }) => {
      this.challenges = challenges;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
