import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { JunkFoodDetailComponent } from './junk-food-detail.component';

describe('JunkFood Management Detail Component', () => {
  let comp: JunkFoodDetailComponent;
  let fixture: ComponentFixture<JunkFoodDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JunkFoodDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ junkFood: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(JunkFoodDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(JunkFoodDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load junkFood on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.junkFood).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
