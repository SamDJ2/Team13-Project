import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EmotionPageDetailComponent } from './emotion-page-detail.component';

describe('EmotionPage Management Detail Component', () => {
  let comp: EmotionPageDetailComponent;
  let fixture: ComponentFixture<EmotionPageDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmotionPageDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ emotionPage: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EmotionPageDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EmotionPageDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load emotionPage on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.emotionPage).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
