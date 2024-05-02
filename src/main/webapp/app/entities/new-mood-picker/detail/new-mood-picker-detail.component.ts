import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { INewMoodPicker } from '../new-mood-picker.model';

@Component({
  selector: 'jhi-new-mood-picker-detail',
  templateUrl: './new-mood-picker-detail.component.html',
})
export class NewMoodPickerDetailComponent implements OnInit {
  newMoodPicker: INewMoodPicker | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ newMoodPicker }) => {
      this.newMoodPicker = newMoodPicker;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
