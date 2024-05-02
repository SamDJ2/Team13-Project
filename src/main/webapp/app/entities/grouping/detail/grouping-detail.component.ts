import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGrouping } from '../grouping.model';

@Component({
  selector: 'jhi-grouping-detail',
  templateUrl: './grouping-detail.component.html',
})
export class GroupingDetailComponent implements OnInit {
  grouping: IGrouping | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ grouping }) => {
      this.grouping = grouping;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
