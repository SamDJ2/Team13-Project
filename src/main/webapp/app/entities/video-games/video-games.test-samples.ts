import { IVideoGames, NewVideoGames } from './video-games.model';

export const sampleWithRequiredData: IVideoGames = {
  id: 60591,
};

export const sampleWithPartialData: IVideoGames = {
  id: 91394,
  levels: 'Rubber Automated Games',
  timer: '2623',
};

export const sampleWithFullData: IVideoGames = {
  id: 8332,
  levels: 'Integration Rand',
  progress: 'matrix calculate Focused',
  timer: '65462',
};

export const sampleWithNewData: NewVideoGames = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
