import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PromptsFeatureDetailComponent } from './prompts-feature-detail.component';

describe('PromptsFeature Management Detail Component', () => {
  let comp: PromptsFeatureDetailComponent;
  let fixture: ComponentFixture<PromptsFeatureDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromptsFeatureDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ promptsFeature: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PromptsFeatureDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PromptsFeatureDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load promptsFeature on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.promptsFeature).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
