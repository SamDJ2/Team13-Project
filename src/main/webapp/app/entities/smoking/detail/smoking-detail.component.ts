import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISmoking } from '../smoking.model';

@Component({
  selector: 'jhi-smoking-detail',
  templateUrl: './smoking-detail.component.html',
})
export class SmokingDetailComponent implements OnInit {
  smoking: ISmoking | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ smoking }) => {
      this.smoking = smoking;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
