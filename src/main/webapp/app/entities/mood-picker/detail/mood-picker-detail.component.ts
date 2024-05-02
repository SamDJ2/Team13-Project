import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMoodPicker } from '../mood-picker.model';

@Component({
  selector: 'jhi-mood-picker-detail',
  templateUrl: './mood-picker-detail.component.html',
})
export class MoodPickerDetailComponent implements OnInit {
  moodPicker: IMoodPicker | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ moodPicker }) => {
      this.moodPicker = moodPicker;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
