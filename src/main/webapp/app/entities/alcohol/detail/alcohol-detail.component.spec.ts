import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AlcoholDetailComponent } from './alcohol-detail.component';

describe('Alcohol Management Detail Component', () => {
  let comp: AlcoholDetailComponent;
  let fixture: ComponentFixture<AlcoholDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlcoholDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ alcohol: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AlcoholDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AlcoholDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load alcohol on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.alcohol).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
