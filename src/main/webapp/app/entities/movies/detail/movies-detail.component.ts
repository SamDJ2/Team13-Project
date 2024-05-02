import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMovies } from '../movies.model';

@Component({
  selector: 'jhi-movies-detail',
  templateUrl: './movies-detail.component.html',
})
export class MoviesDetailComponent implements OnInit {
  movies: IMovies | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ movies }) => {
      this.movies = movies;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
