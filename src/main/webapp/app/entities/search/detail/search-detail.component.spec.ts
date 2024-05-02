import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SearchDetailComponent } from './search-detail.component';

describe('Search Management Detail Component', () => {
  let comp: SearchDetailComponent;
  let fixture: ComponentFixture<SearchDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ search: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SearchDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SearchDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load search on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.search).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
