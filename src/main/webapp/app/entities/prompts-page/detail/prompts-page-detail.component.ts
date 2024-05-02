import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPromptsPage } from '../prompts-page.model';

@Component({
  selector: 'jhi-prompts-page-detail',
  templateUrl: './prompts-page-detail.component.html',
})
export class PromptsPageDetailComponent implements OnInit {
  promptsPage: IPromptsPage | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ promptsPage }) => {
      this.promptsPage = promptsPage;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
