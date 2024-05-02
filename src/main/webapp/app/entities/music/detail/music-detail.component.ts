import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMusic } from '../music.model';

@Component({
  selector: 'jhi-music-detail',
  templateUrl: './music-detail.component.html',
})
export class MusicDetailComponent implements OnInit {
  music: IMusic | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ music }) => {
      this.music = music;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
