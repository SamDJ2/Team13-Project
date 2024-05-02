import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FilteredDetailComponent } from './filtered-detail.component';

describe('Filtered Management Detail Component', () => {
  let comp: FilteredDetailComponent;
  let fixture: ComponentFixture<FilteredDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilteredDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ filtered: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FilteredDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FilteredDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load filtered on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.filtered).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
