import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISearch } from '../search.model';

@Component({
  selector: 'jhi-search-detail',
  templateUrl: './search-detail.component.html',
})
export class SearchDetailComponent implements OnInit {
  search: ISearch | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ search }) => {
      this.search = search;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
