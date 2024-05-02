import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILandingPage } from '../landing-page.model';

@Component({
  selector: 'jhi-landing-page-detail',
  templateUrl: './landing-page-detail.component.html',
})
export class LandingPageDetailComponent implements OnInit {
  landingPage: ILandingPage | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ landingPage }) => {
      this.landingPage = landingPage;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
