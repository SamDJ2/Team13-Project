import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoodJournalPageComponent } from './mood-journal-page.component';

describe('MoodJournalPageComponent', () => {
  let component: MoodJournalPageComponent;
  let fixture: ComponentFixture<MoodJournalPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoodJournalPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MoodJournalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
