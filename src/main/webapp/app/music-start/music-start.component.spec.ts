import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicStartComponent } from './music-start.component';

describe('MusicStartComponent', () => {
  let component: MusicStartComponent;
  let fixture: ComponentFixture<MusicStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MusicStartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MusicStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
