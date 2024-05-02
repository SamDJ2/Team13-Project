import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVideoGames } from '../video-games.model';

@Component({
  selector: 'jhi-video-games-detail',
  templateUrl: './video-games-detail.component.html',
})
export class VideoGamesDetailComponent implements OnInit {
  videoGames: IVideoGames | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ videoGames }) => {
      this.videoGames = videoGames;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
