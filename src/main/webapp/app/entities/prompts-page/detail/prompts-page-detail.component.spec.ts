import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PromptsPageDetailComponent } from './prompts-page-detail.component';

describe('PromptsPage Management Detail Component', () => {
  let comp: PromptsPageDetailComponent;
  let fixture: ComponentFixture<PromptsPageDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromptsPageDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ promptsPage: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PromptsPageDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PromptsPageDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load promptsPage on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.promptsPage).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
