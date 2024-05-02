import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicLevelsComponent } from './music-levels.component';

describe('MusicLevelsComponent', () => {
  let component: MusicLevelsComponent;
  let fixture: ComponentFixture<MusicLevelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MusicLevelsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MusicLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
