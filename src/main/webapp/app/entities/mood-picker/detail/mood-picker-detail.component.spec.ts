import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MoodPickerDetailComponent } from './mood-picker-detail.component';

describe('MoodPicker Management Detail Component', () => {
  let comp: MoodPickerDetailComponent;
  let fixture: ComponentFixture<MoodPickerDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MoodPickerDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ moodPicker: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MoodPickerDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MoodPickerDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load moodPicker on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.moodPicker).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
