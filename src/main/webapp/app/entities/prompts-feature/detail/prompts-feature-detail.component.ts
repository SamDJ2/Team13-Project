import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PromptsFeature } from '../prompts-feature.model';

@Component({
  selector: 'jhi-prompts-feature-detail',
  templateUrl: './prompts-feature-detail.component.html',
})
export class PromptsFeatureDetailComponent implements OnInit {
  promptsFeature: PromptsFeature | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ promptsFeature }) => {
      this.promptsFeature = promptsFeature;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
