import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBadges } from '../badges.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-badges-detail',
  templateUrl: './badges-detail.component.html',
})
export class BadgesDetailComponent implements OnInit {
  badges: IBadges | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ badges }) => {
      this.badges = badges;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
