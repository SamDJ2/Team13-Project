import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAlcohol } from '../alcohol.model';

@Component({
  selector: 'jhi-alcohol-detail',
  templateUrl: './alcohol-detail.component.html',
})
export class AlcoholDetailComponent implements OnInit {
  alcohol: IAlcohol | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ alcohol }) => {
      this.alcohol = alcohol;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
