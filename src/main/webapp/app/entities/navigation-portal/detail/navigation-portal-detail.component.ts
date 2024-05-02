import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { INavigationPortal } from '../navigation-portal.model';

@Component({
  selector: 'jhi-navigation-portal-detail',
  templateUrl: './navigation-portal-detail.component.html',
})
export class NavigationPortalDetailComponent implements OnInit {
  navigationPortal: INavigationPortal | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ navigationPortal }) => {
      this.navigationPortal = navigationPortal;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
