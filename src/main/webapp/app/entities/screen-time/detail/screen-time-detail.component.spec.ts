import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ScreenTimeDetailComponent } from './screen-time-detail.component';

describe('ScreenTime Management Detail Component', () => {
  let comp: ScreenTimeDetailComponent;
  let fixture: ComponentFixture<ScreenTimeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScreenTimeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ screenTime: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ScreenTimeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ScreenTimeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load screenTime on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.screenTime).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
