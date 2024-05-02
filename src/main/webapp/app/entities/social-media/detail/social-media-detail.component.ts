import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISocialMedia } from '../social-media.model';

@Component({
  selector: 'jhi-social-media-detail',
  templateUrl: './social-media-detail.component.html',
})
export class SocialMediaDetailComponent implements OnInit {
  socialMedia: ISocialMedia | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ socialMedia }) => {
      this.socialMedia = socialMedia;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
