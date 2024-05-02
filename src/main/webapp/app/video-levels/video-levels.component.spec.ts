import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoLevelsComponent } from './video-levels.component';

describe('VideoLevelsComponent', () => {
  let component: VideoLevelsComponent;
  let fixture: ComponentFixture<VideoLevelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VideoLevelsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
