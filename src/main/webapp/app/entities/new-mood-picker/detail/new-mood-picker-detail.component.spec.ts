import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { NewMoodPickerDetailComponent } from './new-mood-picker-detail.component';

describe('NewMoodPicker Management Detail Component', () => {
  let comp: NewMoodPickerDetailComponent;
  let fixture: ComponentFixture<NewMoodPickerDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewMoodPickerDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ newMoodPicker: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(NewMoodPickerDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(NewMoodPickerDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load newMoodPicker on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.newMoodPicker).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
