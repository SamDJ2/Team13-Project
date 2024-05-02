import { IVideoGames } from 'app/entities/video-games/video-games.model';
import { IMovies } from 'app/entities/movies/movies.model';
import { ISocialMedia } from 'app/entities/social-media/social-media.model';
import { IMusic } from 'app/entities/music/music.model';

export interface IScreenTime {
  id: number;
  selectCategory?: boolean | null;
  videoGames?: Pick<IVideoGames, 'id'> | null;
  movies?: Pick<IMovies, 'id'> | null;
  socialMedia?: Pick<ISocialMedia, 'id'> | null;
  music?: Pick<IMusic, 'id'> | null;
}

export type NewScreenTime = Omit<IScreenTime, 'id'> & { id: null };
