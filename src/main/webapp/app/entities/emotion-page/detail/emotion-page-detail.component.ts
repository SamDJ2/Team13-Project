import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEmotionPage } from '../emotion-page.model';

@Component({
  selector: 'jhi-emotion-page-detail',
  templateUrl: './emotion-page-detail.component.html',
})
export class EmotionPageDetailComponent implements OnInit {
  emotionPage: IEmotionPage | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ emotionPage }) => {
      this.emotionPage = emotionPage;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
