import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProfileCustomization } from '../profile-customization.model';

@Component({
  selector: 'jhi-profile-customization-detail',
  templateUrl: './profile-customization-detail.component.html',
})
export class ProfileCustomizationDetailComponent implements OnInit {
  profileCustomization: IProfileCustomization | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ profileCustomization }) => {
      this.profileCustomization = profileCustomization;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
