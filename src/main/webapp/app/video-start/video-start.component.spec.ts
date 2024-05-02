import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoStartComponent } from './video-start.component';

describe('VideoStartComponent', () => {
  let component: VideoStartComponent;
  let fixture: ComponentFixture<VideoStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VideoStartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
