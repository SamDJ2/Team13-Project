import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IJunkFood } from '../junk-food.model';

@Component({
  selector: 'jhi-junk-food-detail',
  templateUrl: './junk-food-detail.component.html',
})
export class JunkFoodDetailComponent implements OnInit {
  junkFood: IJunkFood | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ junkFood }) => {
      this.junkFood = junkFood;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
