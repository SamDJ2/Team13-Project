import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesLevelsComponent } from './games-levels.component';

describe('GamesLevelsComponent', () => {
  let component: GamesLevelsComponent;
  let fixture: ComponentFixture<GamesLevelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GamesLevelsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GamesLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
